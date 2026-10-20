import { db } from '../db.js';
import { generateSearchMatrix } from './queryMatrix.js';
import { fetchOfficialAtsJobs } from '../connectors/officialAtsConnector.js';
import { searchEnterpriseCareers } from '../connectors/companyCareersScraper.js';
import { searchJobPlatforms } from '../connectors/searchEngineConnector.js';
import { fetchVerifiedPublicFeeds } from '../connectors/publicFeedsConnector.js';
import { deduplicateJobs } from './deduplicationEngine.js';
import { verifyJobUrl, determineJobStatus } from './verifierEngine.js';
import { evaluateJobFit } from './matchingEngine.js';

export async function runJobDiscoveryPipeline(candidateOverride = null) {
  const candidate = candidateOverride || db.getCandidate();
  const startTime = Date.now();

  const searchMatrix = generateSearchMatrix(candidate);
  const targetRoles = searchMatrix.combinedRoles.slice(0, 6);
  const primaryRole = targetRoles[0] || 'Data Analyst';
  const targetLocations = searchMatrix.preferredLocations || ['Bangalore', 'Remote'];
  const primaryLoc = targetLocations[0] || 'Bangalore';
  const candidateSkills = searchMatrix.prioritizedSkills || ['Python', 'SQL', 'Data Analysis'];

  const rawDiscovered = [];
  const sourcesSearched = [
    'Live Official ATS Boards (Greenhouse & Ashby Enterprise Portals)',
    'Live Public Feeds (Arbeitnow, Jobicy, Remotive, RemoteOK)',
    'Enterprise Career Portals (Amazon, Google, Microsoft, JPMorgan Chase, etc.)',
    'Live Job Platforms (LinkedIn, Naukri, Indeed, Internshala, Glassdoor, Cutshort, Foundit)'
  ];

  // Execute live parallel queries with Promise.allSettled
  try {
    const [atsJobs, feedJobs, entSearchJobs, platSearchJobs] = await Promise.allSettled([
      fetchOfficialAtsJobs(targetRoles, targetLocations),
      fetchVerifiedPublicFeeds(targetRoles),
      searchEnterpriseCareers(primaryRole, primaryLoc),
      searchJobPlatforms(targetRoles, targetLocations, candidateSkills)
    ]);

    if (atsJobs.status === 'fulfilled' && Array.isArray(atsJobs.value)) {
      rawDiscovered.push(...atsJobs.value);
    }
    if (feedJobs.status === 'fulfilled' && Array.isArray(feedJobs.value)) {
      rawDiscovered.push(...feedJobs.value);
    }
    if (entSearchJobs.status === 'fulfilled' && Array.isArray(entSearchJobs.value)) {
      rawDiscovered.push(...entSearchJobs.value);
    }
    if (platSearchJobs.status === 'fulfilled' && Array.isArray(platSearchJobs.value)) {
      rawDiscovered.push(...platSearchJobs.value);
    }
  } catch (err) {
    console.warn('Discovery query error:', err.message);
  }

  // Deduplicate discovered jobs
  const { deduplicatedJobs, duplicatesRemovedCount } = deduplicateJobs(rawDiscovered);

  // Score all jobs with matchingEngine against candidate profile
  const scoredJobs = deduplicatedJobs.map(job => {
    const fitResult = evaluateJobFit(job, candidate);
    return {
      ...job,
      jobStatus: 'VERIFIED',
      lastChecked: new Date().toISOString(),
      matchScore: fitResult.matchScore,
      matchBreakdown: fitResult.matchBreakdown,
      matchedPoints: fitResult.matchedPoints,
      weakPoints: fitResult.weakPoints,
      matchedKeywords: fitResult.matchedKeywords,
      missingSkills: fitResult.missingKeywords,
      matchExplanation: fitResult.explanation
    };
  });

  // Sort by match score descending to surface the most relevant jobs
  scoredJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  // Fast concurrent verification of top jobs (up to 80 jobs in parallel batches of 20)
  const topJobs = scoredJobs.slice(0, 120);
  const processedJobs = [];
  let expiredJobsCount = 0;

  const batchSize = 20;
  for (let i = 0; i < topJobs.length; i += batchSize) {
    const chunk = topJobs.slice(i, i + batchSize);
    const verifications = await Promise.all(
      chunk.map(j => {
        const url = j.directApplyUrl || j.officialCompanyPage || j.jobPlatformUrl;
        return verifyJobUrl(url, 2500);
      })
    );

    chunk.forEach((job, idx) => {
      const v = verifications[idx];
      const finalStatus = determineJobStatus(job, v);

      if (finalStatus === 'EXPIRED') {
        expiredJobsCount++;
        return; // Exclude expired/dead links completely
      }

      processedJobs.push({
        ...job,
        jobStatus: finalStatus,
        lastChecked: new Date().toISOString()
      });
    });
  }

  // Persist verified live jobs to database (replacing legacy/fake entries)
  db.replaceJobs(processedJobs);

  // Record Search Log Entry
  const logEntry = {
    durationMs: Date.now() - startTime,
    sourcesSearched,
    queriesGenerated: searchMatrix.totalQueriesGenerated,
    jobsDiscovered: rawDiscovered.length,
    duplicatesRemoved: duplicatesRemovedCount,
    expiredJobsRemoved: expiredJobsCount,
    verifiedJobsCount: processedJobs.length,
    officialJobsCount: processedJobs.filter(j => j.sourceType === 'OFFICIAL_COMPANY').length,
    platformJobsCount: processedJobs.filter(j => j.sourceType === 'JOB_PLATFORM').length,
    targetRoles,
    targetLocations,
    matrixSample: searchMatrix.matrixCombinations.slice(0, 8)
  };
  db.addSearchLog(logEntry);

  return {
    success: true,
    stats: db.getDashboardStats(),
    searchLog: logEntry,
    jobsCount: processedJobs.length,
    jobs: processedJobs
  };
}
