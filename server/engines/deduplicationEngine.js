/**
 * Cross-Source Job Deduplication & Canonical Representation Engine
 * Identifies duplicate job postings across official company career sites and third-party portals,
 * merges source citations, and promotes direct official application URLs.
 */

// Normalizes company names to canonical forms
export function normalizeCompanyName(rawName = '') {
  let name = rawName.trim();
  // Remove legal suffixes
  name = name.replace(/\b(Pvt\.?\s*Ltd\.?|Private Limited|LLC|Inc\.?|Corporation|Corp\.?|Services|Solutions|India|USI|Technologies|Global|Consulting)\b/gi, '').trim();
  // Clean multiple spaces and punctuation
  name = name.replace(/[-–—,]/g, ' ').replace(/\s+/g, ' ').trim();
  return name || rawName.trim();
}

// Normalizes job titles to facilitate deduplication
export function normalizeJobTitle(rawTitle = '') {
  let title = rawTitle.toLowerCase().trim();
  // Remove location tags like "(Bengaluru)", "[Bangalore]", "- India"
  title = title.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '');
  title = title.replace(/[-–—|]\s*(bangalore|bengaluru|hyderabad|pune|mumbai|india|remote|hybrid|full-time).*/gi, '');
  title = title.replace(/\b(hiring for|urgently hiring|immediate joiner|job opening)\b/gi, '');
  title = title.replace(/\s+/g, ' ').trim();
  return title;
}

// Normalizes locations
export function normalizeLocation(rawLoc = '') {
  const loc = rawLoc.toLowerCase();
  if (loc.includes('bengaluru') || loc.includes('bangalore')) return 'Bangalore';
  if (loc.includes('hyderabad')) return 'Hyderabad';
  if (loc.includes('pune')) return 'Pune';
  if (loc.includes('mumbai')) return 'Mumbai';
  if (loc.includes('delhi') || loc.includes('gurgaon') || loc.includes('noida') || loc.includes('ncr')) return 'Delhi NCR';
  if (loc.includes('remote')) return 'Remote';
  return rawLoc.trim();
}

/**
 * Deduplicate an array of raw jobs discovered across multiple sources
 */
export function deduplicateJobs(jobsList) {
  const clusterMap = new Map();
  let duplicatesRemovedCount = 0;

  for (const job of jobsList) {
    const normCompany = normalizeCompanyName(job.company).toLowerCase();
    const normTitle = normalizeJobTitle(job.title).toLowerCase();
    const normLoc = normalizeLocation(job.location || '').toLowerCase();

    // Create clustering signature
    const clusterKey = `${normCompany}:::${normTitle}:::${normLoc}`;

    if (!clusterMap.has(clusterKey)) {
      // First time seeing this job: initialize canonical record
      const canonical = {
        ...job,
        sourcesFound: [
          {
            name: job.source || (job.sourceType === 'OFFICIAL_COMPANY' ? `${job.company} Careers` : 'Job Platform'),
            url: job.directApplyUrl || job.jobPlatformUrl || job.officialCompanyPage,
            isOfficial: job.sourceType === 'OFFICIAL_COMPANY'
          }
        ]
      };
      clusterMap.set(clusterKey, canonical);
    } else {
      // Duplicate opening detected from another portal or feed
      duplicatesRemovedCount++;
      const canonical = clusterMap.get(clusterKey);

      // Check if current job source is official career page
      const isCurrentOfficial = job.sourceType === 'OFFICIAL_COMPANY';
      const sourceName = job.source || (isCurrentOfficial ? `${job.company} Careers` : 'Job Platform');
      const sourceUrl = job.directApplyUrl || job.jobPlatformUrl || job.officialCompanyPage;

      // Add to sourcesFound if not already present
      const alreadyHasSource = canonical.sourcesFound.some(s => s.name.toLowerCase() === sourceName.toLowerCase());
      if (!alreadyHasSource && sourceUrl) {
        canonical.sourcesFound.push({
          name: sourceName,
          url: sourceUrl,
          isOfficial: isCurrentOfficial
        });
      }

      // If current duplicate is official, promote canonical record to official status and prefer its direct link!
      if (isCurrentOfficial && canonical.sourceType !== 'OFFICIAL_COMPANY') {
        canonical.sourceType = 'OFFICIAL_COMPANY';
        canonical.officialCompanyPage = job.officialCompanyPage || sourceUrl;
        canonical.directApplyUrl = job.directApplyUrl || sourceUrl;
        canonical.source = sourceName;
        canonical.sourceVerification = 'VERIFIED_OFFICIAL_CAREERS';
      }

      // If existing canonical was missing description or skills, backfill from duplicate
      if ((!canonical.description || canonical.description.length < 50) && job.description) {
        canonical.description = job.description;
      }
      if ((!canonical.requiredSkills || canonical.requiredSkills.length === 0) && job.requiredSkills) {
        canonical.requiredSkills = job.requiredSkills;
      }
      if (canonical.salary === 'Not disclosed' && job.salary && job.salary !== 'Not disclosed') {
        canonical.salary = job.salary;
      }

      clusterMap.set(clusterKey, canonical);
    }
  }

  return {
    deduplicatedJobs: Array.from(clusterMap.values()),
    duplicatesRemovedCount
  };
}
