/**
 * Professional Role Taxonomy and Intelligent Domain Expansion Engine
 * Provides adjacent role inference, skill equivalence mapping, and boundaries.
 */

// Skill Equivalence & Semantic Synonyms
export const SKILL_SYNONYMS = {
  'power bi': ['powerbi', 'power-bi', 'microsoft power bi', 'power bi desktop', 'dax', 'power query'],
  'tableau': ['tableau desktop', 'tableau server', 'tableau prep'],
  'sql': ['structured query language', 'mysql', 'postgresql', 't-sql', 'pl/sql', 'mssql', 'sql server', 'relational database'],
  'python': ['python 3', 'pandas', 'numpy', 'scipy', 'jupyter', 'pyspark'],
  'excel': ['advanced excel', 'ms excel', 'vlookup', 'xlookup', 'pivot table', 'pivot tables', 'macros', 'excel modeling'],
  'business analysis': ['business analyst', 'business requirements', 'brd', 'frd', 'requirements gathering', 'gap analysis', 'user stories', 'stakeholder management'],
  'data analysis': ['data analyst', 'exploratory data analysis', 'eda', 'data analytics', 'data interpretation', 'statistical analysis'],
  'business intelligence': ['bi', 'bi reporting', 'dashboarding', 'data visualization', 'reporting analyst', 'bi developer'],
  'reporting': ['mis reporting', 'management reporting', 'kpi reporting', 'executive reporting', 'dashboard creation'],
  'process analysis': ['process improvement', 'process mapping', 'workflow optimization', 'sop', 'as-is to-be', 'bpm']
};

/**
 * Infer adjacent and highly relevant roles based on candidate's profile
 */
export function inferAdjacentRoles(candidate) {
  const inferred = new Set();
  const rationale = [];

  const allSkills = [
    ...(candidate.skills?.technical || []),
    ...(candidate.skills?.business || []),
    ...(candidate.skills?.analytical || []),
    ...(candidate.skills?.software || []),
    ...(candidate.skills?.databases || []),
    ...(candidate.skills?.biTools || [])
  ].map(s => s.toLowerCase());

  const degrees = (candidate.education || []).map(e => `${e.degree} ${e.specialization || ''}`.toLowerCase());
  const hasAnalyticsDegree = degrees.some(d => d.includes('analytics') || d.includes('data science') || d.includes('statistics'));
  const hasMBADegree = degrees.some(d => d.includes('mba') || d.includes('business administration'));
  const hasTechDegree = degrees.some(d => d.includes('b.tech') || d.includes('b.e.') || d.includes('cs') || d.includes('computer'));

  const hasSQL = allSkills.some(s => s.includes('sql'));
  const hasBI = allSkills.some(s => s.includes('power bi') || s.includes('tableau') || s.includes('looker') || s.includes('bi'));
  const hasExcel = allSkills.some(s => s.includes('excel'));
  const hasPython = allSkills.some(s => s.includes('python'));
  const hasBusinessAnalysis = allSkills.some(s => s.includes('business analysis') || s.includes('requirements') || s.includes('brd'));

  // 1. Business Analyst & Business Intelligence
  if ((hasMBADegree || hasAnalyticsDegree) && (hasSQL || hasExcel || hasBI)) {
    inferred.add('Business Analyst');
    inferred.add('Business Intelligence Analyst');
    inferred.add('BI Analyst');
    inferred.add('Reporting Analyst');
    inferred.add('MIS Analyst');
    rationale.push('Strong intersection of business education (MBA/Commerce) with analytical tooling (SQL, BI, Excel).');
  }

  // 2. Data Analyst & Analytics Consultant
  if (hasSQL && (hasPython || hasBI || hasExcel)) {
    inferred.add('Data Analyst');
    inferred.add('Analytics Consultant');
    inferred.add('Data Associate');
    rationale.push('Core data querying (SQL) paired with reporting visualization qualifies for data analyst titles.');
  }

  // 3. Operations & Strategy
  if (hasMBADegree && (hasBusinessAnalysis || hasExcel)) {
    inferred.add('Business Operations Analyst');
    inferred.add('Operations Analyst');
    inferred.add('Process Analyst');
    inferred.add('Strategy & Operations Associate');
    rationale.push('Business domain understanding and process modeling skills suit business operations analysis.');
  }

  // 4. Product / Tech Analytics
  if (hasPython && hasSQL && hasBI) {
    inferred.add('Product Analyst');
    inferred.add('Growth Analytics Associate');
    rationale.push('Programming (Python) + Database (SQL) + Metrics tracking unlocks product & growth analytics tracks.');
  }

  // Combine with explicit desired titles from candidate
  const explicitTitles = (candidate.preferences?.desiredTitles || []);
  const combinedTitles = Array.from(new Set([...explicitTitles, ...inferred]));

  return {
    inferredRoles: Array.from(inferred),
    combinedRoles: combinedTitles,
    rationale: Array.from(new Set(rationale))
  };
}

/**
 * Check if a required job skill is matched by candidate skills (considering synonyms)
 */
export function checkSkillMatch(requiredSkill, candidateSkills) {
  const reqLower = requiredSkill.toLowerCase().trim();
  const candidateLowerList = candidateSkills.map(s => s.toLowerCase().trim());

  // Direct exact match
  if (candidateLowerList.includes(reqLower)) {
    return { matched: true, type: 'exact', matchedWith: requiredSkill };
  }

  // Check synonym group
  for (const [canonical, syns] of Object.entries(SKILL_SYNONYMS)) {
    const group = [canonical, ...syns];
    const isReqInGroup = group.some(g => reqLower.includes(g) || g.includes(reqLower));
    
    if (isReqInGroup) {
      // Check if candidate possesses any skill in this group
      const matchedCandSkill = candidateLowerList.find(cs => group.some(g => cs.includes(g) || g.includes(cs)));
      if (matchedCandSkill) {
        return { matched: true, type: 'synonym', matchedWith: matchedCandSkill };
      }
    }
  }

  // Substring containment check
  for (const cs of candidateLowerList) {
    if (cs.length > 2 && reqLower.includes(cs)) {
      return { matched: true, type: 'partial', matchedWith: cs };
    }
  }

  return { matched: false };
}
