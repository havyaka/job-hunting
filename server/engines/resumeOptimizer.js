/**
 * ATS Resume Optimization & Alignment Engine
 * Delivers tailored advice for tailoring a resume to a specific discovered job posting
 * strictly without fabricating skills or unearned qualifications.
 */

export function generateResumeOptimization(job, candidate) {
  const candidateSkills = [
    ...(candidate.skills?.technical || []),
    ...(candidate.skills?.business || []),
    ...(candidate.skills?.analytical || []),
    ...(candidate.skills?.software || []),
    ...(candidate.skills?.databases || []),
    ...(candidate.skills?.biTools || [])
  ];

  const jobSkills = job.requiredSkills || [];
  const candidateLower = candidateSkills.map(s => s.toLowerCase());

  // Find exact overlap
  const existingMatches = jobSkills.filter(s => candidateLower.includes(s.toLowerCase()));

  // Find high-impact keywords missing from job requirements
  const missingKeywords = jobSkills.filter(s => !candidateLower.includes(s.toLowerCase()));

  // Relevant candidate projects to feature prominently
  const prioritizedProjects = (candidate.projects || []).map(p => {
    const tech = (p.technologies || []).join(' ').toLowerCase();
    const isRelevant = jobSkills.some(js => tech.includes(js.toLowerCase())) ||
      (job.title || '').toLowerCase().split(' ').some(w => w.length > 3 && p.description.toLowerCase().includes(w));
    return {
      projectName: p.name,
      relevance: isRelevant ? 'High Priority' : 'Supporting',
      recommendation: isRelevant
        ? `Lead with this project in your resume under 'Key Analytics Projects'. Highlight outcomes tied to ${p.technologies?.slice(0, 3).join(', ')}.`
        : `Include as secondary technical demonstration.`
    };
  });

  // Actionable tailoring recommendations
  const actionItems = [];

  if (missingKeywords.length > 0) {
    actionItems.push({
      category: 'Targeted Vocabulary & Terminology',
      advice: `Incorporate industry-standard phrasing for: ${missingKeywords.slice(0, 4).join(', ')}. If you have academic exposure, coursework, or project familiarity with these tools, explicitly reference them under Coursework or Tools.`,
      warning: 'Never fabricate hands-on production experience if you have not used the tool.'
    });
  }

  if (existingMatches.length > 0) {
    actionItems.push({
      category: 'Front-Loading Core Strengths',
      advice: `Elevate your verified skills (${existingMatches.slice(0, 4).join(', ')}) to the top third of your resume and summary statement to match the ATS keyword filters immediately.`,
      warning: null
    });
  }

  actionItems.push({
    category: 'Metric-Driven Bullet Points',
    advice: `Frame your responsibilities using the Google XYZ Formula: 'Accomplished [X], as measured by [Y], by doing [Z]'. For example: 'Engineered automated Power BI KPI reports, reducing executive reporting latency by 35% across 150K records'.`,
    warning: null
  });

  if ((candidate.education || []).some(e => e.degree === 'MBA')) {
    actionItems.push({
      category: 'Bridge Business & Technical Value',
      advice: `Emphasize how your MBA Business Analytics background bridges data querying (SQL/Python) with business decisions (BRD/FRD, stakeholder communication, cost-benefit analysis).`,
      warning: null
    });
  }

  return {
    jobTitle: job.title,
    company: job.company,
    targetATSScoreForecast: Math.min(96, Math.max(78, (job.matchScore || 80) + 12)),
    matchingKeywordsFound: existingMatches,
    missingKeywordsToAddress: missingKeywords,
    prioritizedProjects,
    actionItems,
    recommendedBulletPhrasings: [
      `Designed and deployed automated reporting pipelines in SQL & Power BI, providing visibility into key business metrics for departmental leadership.`,
      `Conducted root cause data analysis and stakeholder requirement gathering, translating business questions into actionable analytical dashboards.`,
      `Executed exploratory data analysis using Python and Advanced Excel to identify trend anomalies and support data-backed decision making.`
    ]
  };
}
