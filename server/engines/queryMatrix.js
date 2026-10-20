import { inferAdjacentRoles } from './taxonomy.js';

/**
 * Intelligent Search Query Matrix Generator
 * Dynamically synthesizes search query permutations across Roles x Skills x Locations x Companies
 */
export function generateSearchMatrix(candidate) {
  const { inferredRoles, combinedRoles } = inferAdjacentRoles(candidate);

  const topRoles = combinedRoles.slice(0, 6);
  const preferredLocations = (candidate.preferences?.preferredLocations || ['Bangalore', 'Remote', 'Hyderabad']).slice(0, 4);

  const skillsFlat = [
    ...(candidate.skills?.technical || []),
    ...(candidate.skills?.business || []),
    ...(candidate.skills?.databases || []),
    ...(candidate.skills?.biTools || []),
    ...(candidate.skills?.software || [])
  ];
  // Select top high-signal keywords
  const prioritizedSkills = (candidate.preferences?.priorityKeywords || []).length > 0
    ? candidate.preferences.priorityKeywords
    : ['SQL', 'Power BI', 'Excel', 'Python', 'Business Analysis', 'Tableau'];

  const targetCompanies = candidate.preferences?.preferredCompanies || [
    'Accenture', 'Deloitte', 'EY', 'PwC', 'KPMG', 'Amazon', 'Flipkart', 'Razorpay', 'Swiggy', 'Zomato', 'TCS', 'Infosys'
  ];

  const queries = [];
  const matrixCombinations = [];

  // 1. Role + Key Skill + Location combinations
  for (const role of topRoles.slice(0, 4)) {
    for (const skill of prioritizedSkills.slice(0, 3)) {
      for (const loc of preferredLocations.slice(0, 2)) {
        const queryText = `"${role}" "${skill}" "${loc}"`;
        queries.push({
          type: 'SKILL_ROLE_LOCATION',
          query: queryText,
          role,
          skill,
          location: loc
        });
        matrixCombinations.push(`${role} + ${skill} + ${loc}`);
      }
    }
  }

  // 2. Official Company Career search queries
  for (const company of targetCompanies.slice(0, 8)) {
    for (const role of topRoles.slice(0, 2)) {
      queries.push({
        type: 'COMPANY_CAREERS',
        company,
        role,
        query: `${company} careers "${role}" jobs Bangalore`
      });
    }
  }

  // 3. Platform Specific Queries (LinkedIn, Naukri, Indeed, etc.)
  const platforms = [
    { name: 'LinkedIn Jobs', siteFilter: 'site:linkedin.com/jobs/view' },
    { name: 'Naukri', siteFilter: 'site:naukri.com/job-listings' },
    { name: 'Indeed', siteFilter: 'site:indeed.com/viewjob' },
    { name: 'Glassdoor', siteFilter: 'site:glassdoor.com/job-listing' },
    { name: 'Foundit', siteFilter: 'site:foundit.in/job-listings' },
    { name: 'Internshala', siteFilter: 'site:internshala.com' },
    { name: 'Cutshort', siteFilter: 'site:cutshort.io/job' }
  ];

  for (const platform of platforms) {
    const role = topRoles[0] || 'Business Analyst';
    const loc = preferredLocations[0] || 'Bangalore';
    queries.push({
      type: 'PLATFORM_INDEXED',
      platform: platform.name,
      query: `${platform.siteFilter} "${role}" "${loc}"`
    });
  }

  // 4. ATS Direct Board targets
  const targetAtsCompanies = [
    { name: 'Stripe', system: 'greenhouse', board: 'stripe' },
    { name: 'Figma', system: 'greenhouse', board: 'figma' },
    { name: 'DoorDash', system: 'greenhouse', board: 'doordash' },
    { name: 'Pinterest', system: 'greenhouse', board: 'pinterest' },
    { name: 'GitLab', system: 'greenhouse', board: 'gitlab' },
    { name: 'Postman', system: 'greenhouse', board: 'postman' },
    { name: 'Razorpay', system: 'greenhouse', board: 'razorpay' },
    { name: 'Swiggy', system: 'greenhouse', board: 'swiggy' },
    { name: 'CRED', system: 'greenhouse', board: 'cred' },
    { name: 'Spotify', system: 'lever', board: 'spotify' },
    { name: 'Canva', system: 'lever', board: 'canva' },
    { name: 'Databricks', system: 'lever', board: 'databricks' },
    { name: 'Ramp', system: 'ashby', board: 'ramp' },
    { name: 'Linear', system: 'ashby', board: 'linear' },
    { name: 'Notion', system: 'ashby', board: 'notion' },
    { name: 'Retool', system: 'ashby', board: 'retool' }
  ];

  return {
    inferredRoles,
    combinedRoles,
    prioritizedSkills,
    preferredLocations,
    matrixCombinations: matrixCombinations.slice(0, 15),
    totalQueriesGenerated: queries.length,
    queries,
    atsTargets: targetAtsCompanies
  };
}
