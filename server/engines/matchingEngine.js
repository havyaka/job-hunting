import { checkSkillMatch, inferAdjacentRoles } from './taxonomy.js';

/**
 * Intelligent Multi-Dimensional Job Fit Scoring Engine
 * Computes a weighted 0–100 match score with granular factor breakdowns and explicit rationales.
 */
export function evaluateJobFit(job, candidate) {
  // Collect candidate skill pool
  const candidateSkills = [
    ...(candidate.skills?.technical || []),
    ...(candidate.skills?.business || []),
    ...(candidate.skills?.analytical || []),
    ...(candidate.skills?.software || []),
    ...(candidate.skills?.databases || []),
    ...(candidate.skills?.biTools || [])
  ];

  const { combinedRoles } = inferAdjacentRoles(candidate);

  const matchedPoints = [];
  const weakPoints = [];
  const matchedKeywords = [];
  const missingKeywords = [];

  // 1. Job Title & Role Match (Weight: 25%)
  let titleScore = 40; // baseline
  const jobTitleLower = (job.title || '').toLowerCase();
  
  const exactRoleMatch = combinedRoles.find(r => jobTitleLower.includes(r.toLowerCase()));
  if (exactRoleMatch) {
    titleScore = 95;
    matchedPoints.push(`Target role alignment: "${job.title}" strongly aligns with your profile as a ${exactRoleMatch}.`);
    matchedKeywords.push(exactRoleMatch);
  } else {
    const partialMatch = combinedRoles.find(r => {
      const parts = r.toLowerCase().split(' ');
      return parts.some(p => p.length > 3 && jobTitleLower.includes(p));
    });
    if (partialMatch) {
      titleScore = 75;
      matchedPoints.push(`Relevant domain title: "${job.title}" connects with your analytical background.`);
      matchedKeywords.push(partialMatch);
    } else {
      titleScore = 50;
      weakPoints.push(`Role title differs from primary preferred positions.`);
    }
  }

  // 2. Skills Match (Weight: 35%)
  const requiredSkills = job.requiredSkills && job.requiredSkills.length > 0
    ? job.requiredSkills
    : extractSkillsFromText(job.description);

  let skillsFoundCount = 0;
  const totalSkillsEvaluated = Math.max(requiredSkills.length, 3);

  for (const reqSkill of requiredSkills) {
    const res = checkSkillMatch(reqSkill, candidateSkills);
    if (res.matched) {
      skillsFoundCount++;
      matchedKeywords.push(res.matchedWith || reqSkill);
      matchedPoints.push(`Skill match: Proficient in ${reqSkill} (${res.type === 'synonym' ? 'via ' + res.matchedWith : 'direct qualification'}).`);
    } else {
      missingKeywords.push(reqSkill);
      weakPoints.push(`Missing / Preferred skill: ${reqSkill} mentioned in job requirements.`);
    }
  }

  // Compute Skill Percentage
  const skillRatio = skillsFoundCount / totalSkillsEvaluated;
  const skillScore = Math.min(100, Math.round(skillRatio * 100));

  // 3. Education Match (Weight: 10%)
  let educationScore = 70;
  const candidateDegrees = (candidate.education || []).map(e => `${e.degree} ${e.specialization || ''}`.toLowerCase());
  const hasMBA = candidateDegrees.some(d => d.includes('mba') || d.includes('analytics'));
  const hasDegree = candidate.education && candidate.education.length > 0;

  if (hasMBA && (jobTitleLower.includes('analyst') || jobTitleLower.includes('consultant') || jobTitleLower.includes('business'))) {
    educationScore = 98;
    matchedPoints.push(`Education: MBA in Business Analytics strongly satisfies target academic criteria.`);
    matchedKeywords.push('MBA Business Analytics');
  } else if (hasDegree) {
    educationScore = 85;
    matchedPoints.push(`Education: Completed recognized university bachelor/master degree.`);
  }

  // 4. Experience & Seniority Match (Weight: 15%)
  let experienceScore = 75;
  const candidateYears = candidate.experienceYears || 0.5;
  const jobExpText = (job.experienceRequired || '').toLowerCase();

  if (jobExpText.includes('fresher') || jobExpText.includes('0-1') || jobExpText.includes('0–1') || jobExpText.includes('0-2') || jobExpText.includes('intern')) {
    experienceScore = 95;
    matchedPoints.push(`Experience level: Role is ideally structured for early-career / graduate candidates (${job.experienceRequired || '0–2 years'}).`);
  } else if (jobExpText.includes('2-4') || jobExpText.includes('2-5') || jobExpText.includes('3+')) {
    experienceScore = 60;
    weakPoints.push(`Experience gap: Role indicates ${job.experienceRequired || '2+ years'} experience required.`);
  } else if (candidateYears <= 1 && (jobTitleLower.includes('senior') || jobTitleLower.includes('lead') || jobTitleLower.includes('principal'))) {
    experienceScore = 30;
    weakPoints.push(`Seniority mismatch: Role is labeled as Senior/Lead level.`);
  } else {
    experienceScore = 80;
  }

  // 5. Location Match (Weight: 10%)
  let locationScore = 60;
  const jobLoc = (job.location || '').toLowerCase();
  const preferredLocs = (candidate.preferences?.preferredLocations || ['Bangalore', 'Remote']).map(l => l.toLowerCase());
  
  const matchesLoc = preferredLocs.some(pl => jobLoc.includes(pl) || (pl === 'remote' && jobLoc.includes('remote')));
  if (matchesLoc || (candidate.relocate && !jobLoc.includes('onsite only'))) {
    locationScore = 95;
    matchedPoints.push(`Location fit: Located in ${job.location || 'preferred geography'}.`);
    matchedKeywords.push(job.location || 'Bangalore');
  } else if (job.workMode === 'Remote' || jobLoc.includes('remote')) {
    locationScore = 100;
    matchedPoints.push(`Location fit: 100% Remote flexibility aligns with your preferences.`);
    matchedKeywords.push('Remote');
  } else {
    locationScore = 55;
    weakPoints.push(`Location outside your preferred top locations (${job.location || 'Other'}).`);
  }

  // 6. Projects & Certifications (Weight: 5%)
  let projectScore = 70;
  const candidateProjects = candidate.projects || [];
  const projectTech = candidateProjects.flatMap(p => p.technologies || []).map(t => t.toLowerCase());
  
  const relevantProjectTools = projectTech.filter(pt => (job.description || '').toLowerCase().includes(pt));
  if (relevantProjectTools.length > 0) {
    projectScore = 95;
    matchedPoints.push(`Practical portfolio project: Your project demonstration in ${relevantProjectTools.slice(0, 3).join(', ')} reinforces this role.`);
  }

  // Weighted Total Formula
  const overallScore = Math.round(
    titleScore * 0.25 +
    skillScore * 0.35 +
    experienceScore * 0.15 +
    educationScore * 0.10 +
    locationScore * 0.10 +
    projectScore * 0.05
  );

  const boundedScore = Math.max(35, Math.min(98, overallScore));

  return {
    matchScore: boundedScore,
    matchBreakdown: {
      overall: boundedScore,
      title: titleScore,
      skills: skillScore,
      experience: experienceScore,
      education: educationScore,
      location: locationScore,
      projects: projectScore,
      seniority: experienceScore
    },
    matchedPoints: matchedPoints.slice(0, 7),
    weakPoints: weakPoints.slice(0, 5),
    matchedKeywords: Array.from(new Set(matchedKeywords)),
    missingKeywords: Array.from(new Set(missingKeywords)),
    explanation: generateSummaryExplanation(boundedScore, matchedPoints, weakPoints)
  };
}

function generateSummaryExplanation(score, matched, weak) {
  if (score >= 85) {
    return 'Strong High-Confidence Match: Your business analytics education and core technical skills directly mirror this opening’s baseline prerequisites.';
  } else if (score >= 70) {
    return 'Solid Match: Well-suited for your profile with a high degree of skill overlap; slight gaps exist in specific tool preferences or experience seniority.';
  } else {
    return 'Moderate / Stretch Opportunity: Applicable transferable skills identified, though additional tool proficiency or domain experience may be expected.';
  }
}

function extractSkillsFromText(text = '') {
  const common = ['SQL', 'Power BI', 'Excel', 'Python', 'Tableau', 'Business Analysis', 'Reporting', 'R', 'PostgreSQL', 'JIRA', 'Agile'];
  const lower = text.toLowerCase();
  return common.filter(s => lower.includes(s.toLowerCase()));
}
