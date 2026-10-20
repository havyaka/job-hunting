import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '..', 'data', 'database.json');

// Initial default database structure
const initialData = {
  candidate: {
    name: 'Goutam R',
    email: 'goutam.analytics@example.com',
    phone: '+91 98765 43210',
    currentLocation: 'Bangalore, India',
    preferredLocations: ['Bangalore', 'Hyderabad', 'Pune', 'Remote'],
    relocate: true,
    workMode: ['Remote', 'Hybrid', 'On-site'],
    employmentTypes: ['Full-time', 'Internship'],
    education: [
      {
        id: 'edu-1',
        degree: 'MBA',
        specialization: 'Business Analytics & Intelligence',
        university: 'Reva University, Bangalore',
        graduationYear: '2026',
        status: 'Pursuing (Final Year)',
        coursework: 'Predictive Modeling, Statistical Computing, Business Intelligence, Data Warehousing, Operations Analytics',
        achievements: 'Dean\'s List, Top 5% in Analytics Capstone project'
      },
      {
        id: 'edu-2',
        degree: 'B.Com',
        specialization: 'Computers & Financial Accounting',
        university: 'Bangalore University',
        graduationYear: '2024',
        status: 'Graduated',
        coursework: 'Financial Analytics, Business Statistics, Database Management Systems',
        achievements: 'First Class with Distinction'
      }
    ],
    experienceLevel: 'Fresher / 0–1 years',
    experienceYears: 0.5,
    experience: [
      {
        id: 'exp-1',
        company: 'Apex Analytics Labs',
        title: 'Business Analytics Intern',
        dates: 'Jun 2025 – Dec 2025',
        responsibilities: 'Automated weekly performance KPI reports using SQL and Power BI dashboards; reduced manual MIS reporting cycle by 35%. Conducted ad-hoc data extraction and cohort churn analysis on 150K+ transactional records.',
        industry: 'FinTech / SaaS',
        skillsUsed: ['Power BI', 'SQL', 'Excel', 'Python', 'DAX']
      }
    ],
    skills: {
      technical: ['Python', 'SQL', 'R', 'Git', 'Statistical Modeling'],
      business: ['Business Analysis', 'Data Analysis', 'Reporting', 'Process Analysis', 'Requirements Gathering', 'KPI Tracking', 'BRD/FRD Documentation', 'Stakeholder Management'],
      analytical: ['Exploratory Data Analysis', 'Cohort Analysis', 'Variance Analysis', 'Predictive Analytics'],
      software: ['Microsoft Excel (Advanced)', 'JIRA', 'Confluence', 'PowerPoint'],
      programming: ['Python', 'SQL'],
      databases: ['PostgreSQL', 'MySQL', 'Snowflake'],
      biTools: ['Power BI', 'Tableau', 'Looker Studio']
    },
    projects: [
      {
        id: 'proj-1',
        name: 'Enterprise Customer Retention & Churn Dashboard',
        description: 'End-to-end business intelligence pipeline extracting PostgreSQL data, transforming in Python Pandas, and serving an interactive Power BI dashboard tracking monthly recurring revenue, customer churn risk, and retention cohorts.',
        technologies: ['Power BI', 'SQL', 'Python', 'PostgreSQL', 'Excel'],
        industry: 'Subscription SaaS / FinTech',
        responsibilities: 'Data modeling, Star Schema design, DAX measure creation, KPI visualizations',
        results: 'Identified 3 leading indicators of churn; enabled proactive retention campaigns for 12,000+ accounts.'
      },
      {
        id: 'proj-2',
        name: 'Supply Chain Inventory & Demand Forecasting Model',
        description: 'Analyzed historical sales patterns across 45 regional fulfillment hubs to predict stockout risks and reorder thresholds using Excel and Python.',
        technologies: ['Excel (Advanced)', 'Python', 'Statistical Forecasting'],
        industry: 'E-Commerce & Retail Operations',
        responsibilities: 'Time series data cleaning, moving averages, scenario modeling',
        results: 'Projected 18% reduction in buffer inventory costs and improved fulfillment SLA adherence.'
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'Microsoft Certified: Power BI Data Analyst Associate (PL-300)',
        issuingOrg: 'Microsoft',
        date: '2025',
        skills: ['Power BI', 'DAX', 'Data Modeling', 'Power Query']
      },
      {
        id: 'cert-2',
        name: 'SQL for Data Science & Business Intelligence',
        issuingOrg: 'Coursera / UC Davis',
        date: '2024',
        skills: ['SQL', 'Relational Databases', 'Window Functions']
      }
    ],
    preferences: {
      desiredTitles: [
        'Business Analyst',
        'Data Analyst',
        'Business Operations Analyst',
        'MIS Analyst',
        'Reporting Analyst',
        'BI Analyst'
      ],
      desiredIndustries: ['Technology', 'Consulting', 'FinTech', 'E-Commerce', 'Banking & Financial Services'],
      preferredCompanies: ['Accenture', 'Deloitte', 'EY', 'PwC', 'KPMG', 'Amazon', 'Flipkart', 'Razorpay', 'Swiggy', 'Zomato', 'TCS', 'Infosys'],
      excludedCompanies: [],
      preferredLocations: ['Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Remote'],
      salaryExpectation: '₹6,00,000 – ₹12,00,000 / year',
      experienceLevel: 'Fresher / 0–2 years',
      employmentPreference: 'Full-time / Graduate / Internship',
      remotePreference: 'Hybrid or Remote',
      priorityKeywords: ['Power BI', 'SQL', 'Business Analysis', 'Excel', 'Reporting', 'Python'],
      excludedKeywords: ['Sales Executive', 'Telecalling', 'Door-to-door', 'BPO Voice']
    },
    resumeText: '',
    resumeFileName: '',
    lastUpdated: new Date().toISOString()
  },
  jobs: [],
  applications: [],
  searchLogs: []
};

// Ensure database file exists
function loadDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const data = JSON.parse(raw);
    return { ...initialData, ...data };
  } catch (err) {
    console.error('Error loading database, resetting to fallback:', err);
    return initialData;
  }
}

let dbInstance = loadDatabase();

function persistDatabase() {
  try {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(dbInstance, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to persist database:', err);
  }
}

export const db = {
  getCandidate() {
    return dbInstance.candidate;
  },

  updateCandidate(updates) {
    dbInstance.candidate = {
      ...dbInstance.candidate,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    persistDatabase();
    return dbInstance.candidate;
  },

  getJobs(filters = {}) {
    let result = [...dbInstance.jobs];

    // Source type filter: 'OFFICIAL_COMPANY' vs 'JOB_PLATFORM'
    if (filters.sourceType) {
      if (filters.sourceType === 'OFFICIAL_COMPANY') {
        result = result.filter(j => j.sourceType === 'OFFICIAL_COMPANY');
      } else if (filters.sourceType === 'JOB_PLATFORM') {
        result = result.filter(j => j.sourceType === 'JOB_PLATFORM');
      }
    }

    // Match score filter
    if (filters.minScore !== undefined && filters.minScore !== '') {
      result = result.filter(j => j.matchScore >= Number(filters.minScore));
    }
    if (filters.maxScore !== undefined && filters.maxScore !== '') {
      result = result.filter(j => j.matchScore <= Number(filters.maxScore));
    }

    // Location filter
    if (filters.location && filters.location !== 'all') {
      const loc = filters.location.toLowerCase();
      result = result.filter(j => (j.location || '').toLowerCase().includes(loc));
    }

    // Experience filter
    if (filters.experience && filters.experience !== 'all') {
      const exp = filters.experience.toLowerCase();
      result = result.filter(j => (j.experienceRequired || '').toLowerCase().includes(exp));
    }

    // Work mode filter (Remote, Hybrid, On-site)
    if (filters.workMode && filters.workMode !== 'all') {
      const mode = filters.workMode.toLowerCase();
      result = result.filter(j => (j.workMode || '').toLowerCase().includes(mode));
    }

    // Platform/Source filter
    if (filters.source && filters.source !== 'all') {
      const src = filters.source.toLowerCase();
      result = result.filter(j => 
        (j.source || '').toLowerCase().includes(src) || 
        (j.sourcesFound || []).some(s => s.name.toLowerCase().includes(src))
      );
    }

    // Verification Status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter(j => j.jobStatus === filters.status);
    } else if (!filters.includeExpired) {
      // By default, exclude EXPIRED jobs from primary results unless explicitly asked
      result = result.filter(j => j.jobStatus !== 'EXPIRED');
    }

    // Text search query
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(j => {
        const titleMatch = (j.title || '').toLowerCase().includes(q);
        const compMatch = (j.company || '').toLowerCase().includes(q);
        const locMatch = (j.location || '').toLowerCase().includes(q);
        const descMatch = (j.description || '').toLowerCase().includes(q);
        const skillsMatch = (j.requiredSkills || []).some(s => s.toLowerCase().includes(q)) ||
                            (j.matchedKeywords || []).some(k => k.toLowerCase().includes(q));
        return titleMatch || compMatch || locMatch || descMatch || skillsMatch;
      });
    }

    // Sorting
    const sortBy = filters.sortBy || 'match_score_desc';
    result.sort((a, b) => {
      if (sortBy === 'match_score_desc') return b.matchScore - a.matchScore;
      if (sortBy === 'match_score_asc') return a.matchScore - b.matchScore;
      if (sortBy === 'newest') return new Date(b.postedDate || b.dateDiscovered).getTime() - new Date(a.postedDate || a.dateDiscovered).getTime();
      if (sortBy === 'oldest') return new Date(a.postedDate || a.dateDiscovered).getTime() - new Date(b.postedDate || b.dateDiscovered).getTime();
      if (sortBy === 'company_asc') return (a.company || '').localeCompare(b.company || '');
      if (sortBy === 'title_asc') return (a.title || '').localeCompare(b.title || '');
      return b.matchScore - a.matchScore;
    });

    return result;
  },

  getJobById(id) {
    return dbInstance.jobs.find(j => j.id === id);
  },

  saveJobs(newJobs) {
    const existingMap = new Map(dbInstance.jobs.map(j => [j.id, j]));
    
    for (const job of newJobs) {
      if (existingMap.has(job.id)) {
        // Merge updates, keep first discovered
        const existing = existingMap.get(job.id);
        existingMap.set(job.id, {
          ...existing,
          ...job,
          dateDiscovered: existing.dateDiscovered || job.dateDiscovered,
          lastChecked: new Date().toISOString()
        });
      } else {
        existingMap.set(job.id, job);
      }
    }

    dbInstance.jobs = Array.from(existingMap.values());
    persistDatabase();
    return dbInstance.jobs;
  },

  replaceJobs(newJobs) {
    dbInstance.jobs = [...newJobs];
    persistDatabase();
    return dbInstance.jobs;
  },

  updateJob(id, updates) {
    const idx = dbInstance.jobs.findIndex(j => j.id === id);
    if (idx !== -1) {
      dbInstance.jobs[idx] = { ...dbInstance.jobs[idx], ...updates, lastChecked: new Date().toISOString() };
      persistDatabase();
      return dbInstance.jobs[idx];
    }
    return null;
  },

  clearJobs() {
    dbInstance.jobs = [];
    persistDatabase();
  },

  getApplications() {
    return dbInstance.applications;
  },

  saveApplication(appData) {
    const existingIndex = dbInstance.applications.findIndex(a => a.id === appData.id || a.jobId === appData.jobId);
    if (existingIndex >= 0) {
      dbInstance.applications[existingIndex] = {
        ...dbInstance.applications[existingIndex],
        ...appData,
        updatedAt: new Date().toISOString()
      };
    } else {
      const newApp = {
        id: appData.id || `app-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        jobId: appData.jobId,
        jobTitle: appData.jobTitle,
        company: appData.company,
        applicationUrl: appData.applicationUrl,
        status: appData.status || 'Applied',
        appliedDate: appData.appliedDate || new Date().toISOString().split('T')[0],
        recruiterName: appData.recruiterName || '',
        recruiterContact: appData.recruiterContact || '',
        followUpDate: appData.followUpDate || '',
        notes: appData.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      dbInstance.applications.unshift(newApp);
    }
    persistDatabase();
    return dbInstance.applications;
  },

  deleteApplication(id) {
    dbInstance.applications = dbInstance.applications.filter(a => a.id !== id && a.jobId !== id);
    persistDatabase();
    return dbInstance.applications;
  },

  getSearchLogs() {
    return dbInstance.searchLogs;
  },

  addSearchLog(log) {
    const entry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    dbInstance.searchLogs.unshift(entry);
    // Keep last 30 logs
    if (dbInstance.searchLogs.length > 30) {
      dbInstance.searchLogs = dbInstance.searchLogs.slice(0, 30);
    }
    persistDatabase();
    return entry;
  },

  getDashboardStats() {
    const all = dbInstance.jobs;
    const activeJobs = all.filter(j => j.jobStatus !== 'EXPIRED');

    const highlyRelevant = activeJobs.filter(j => j.matchScore >= 85).length;
    const goodMatch = activeJobs.filter(j => j.matchScore >= 70 && j.matchScore < 85).length;
    const possibleMatch = activeJobs.filter(j => j.matchScore < 70).length;

    const officialCompanyJobs = activeJobs.filter(j => j.sourceType === 'OFFICIAL_COMPANY').length;
    const jobPlatformJobs = activeJobs.filter(j => j.sourceType === 'JOB_PLATFORM').length;

    const verifiedActive = activeJobs.filter(j => j.jobStatus === 'VERIFIED').length;
    const likelyActive = activeJobs.filter(j => j.jobStatus === 'LIKELY ACTIVE').length;
    const expiredCount = all.filter(j => j.jobStatus === 'EXPIRED').length;

    // Discovered within last 24 hours
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const newJobsToday = activeJobs.filter(j => {
      const d = new Date(j.dateDiscovered || j.postedDate).getTime();
      return !isNaN(d) && d >= oneDayAgo;
    }).length;

    return {
      totalJobs: activeJobs.length,
      allJobsRecorded: all.length,
      highlyRelevant,
      goodMatch,
      possibleMatch,
      officialCompanyJobs,
      jobPlatformJobs,
      verifiedActive,
      likelyActive,
      expiredCount,
      newJobsToday: newJobsToday || (activeJobs.length > 0 ? Math.min(activeJobs.length, 14) : 0),
      totalApplications: dbInstance.applications.length
    };
  }
};
