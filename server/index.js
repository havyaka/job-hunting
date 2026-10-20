import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { db } from './db.js';
import { extractRawTextFromFile, parseResumeText, detectConflicts } from './parsers/resumeParser.js';
import { generateSearchMatrix } from './engines/queryMatrix.js';
import { inferAdjacentRoles } from './engines/taxonomy.js';
import { runJobDiscoveryPipeline } from './engines/discoveryEngine.js';
import { verifyJobUrl, determineJobStatus } from './engines/verifierEngine.js';
import { evaluateJobFit } from './engines/matchingEngine.js';
import { generateResumeOptimization } from './engines/resumeOptimizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Configure file upload storage
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `resume_${Date.now()}_${file.originalname}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 1. Candidate Profile Routes
app.get('/api/candidate', (req, res) => {
  res.json({ success: true, candidate: db.getCandidate() });
});

app.post('/api/candidate', (req, res) => {
  const updated = db.updateCandidate(req.body);
  res.json({ success: true, candidate: updated });
});

// 2. Resume Upload & Parsing Routes
app.post('/api/resume/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No resume file uploaded.' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    // Extract raw text from file
    const rawText = await extractRawTextFromFile(filePath, originalName);
    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Could not extract text from the uploaded document.' });
    }

    // Parse structured entities
    const parsedData = parseResumeText(rawText);

    // Detect conflicts with currently saved profile
    const currentProfile = db.getCandidate();
    const conflicts = detectConflicts(currentProfile, parsedData);

    // Save resume file metadata
    db.updateCandidate({
      resumeText: parsedData.rawText,
      resumeFileName: originalName
    });

    res.json({
      success: true,
      fileName: originalName,
      parsedData,
      conflicts,
      message: 'Resume parsed successfully.'
    });
  } catch (err) {
    console.error('Error during resume upload:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Apply parsed resume data to candidate profile
app.post('/api/resume/apply-parsed', (req, res) => {
  try {
    const { acceptedFields, parsedData } = req.body;
    const current = db.getCandidate();
    const updates = {};

    if (acceptedFields.name && parsedData.name) updates.name = parsedData.name;
    if (acceptedFields.email && parsedData.email) updates.email = parsedData.email;
    if (acceptedFields.phone && parsedData.phone) updates.phone = parsedData.phone;
    if (acceptedFields.location && parsedData.detectedLocation) updates.currentLocation = parsedData.detectedLocation;

    // Experience entries & seniority
    if (acceptedFields.experience) {
      if (parsedData.experienceLevel) {
        updates.experienceLevel = parsedData.experienceLevel;
        updates.experienceYears = parsedData.experienceYears || 0.5;
      }
      if (parsedData.experience && parsedData.experience.length > 0) {
        updates.experience = parsedData.experience.map((exp, idx) => ({
          id: `exp-${Date.now()}-${idx}`,
          ...exp
        }));
      }
    }

    // Skills
    if (acceptedFields.skills && parsedData.skills) {
      // Replace with candidate's actual extracted skills
      updates.skills = parsedData.skills;
    }

    // Education
    if (acceptedFields.education && parsedData.education && parsedData.education.length > 0) {
      updates.education = parsedData.education.map((e, idx) => ({
        id: `edu-${Date.now()}-${idx}`,
        ...e
      }));
    }

    // Projects
    if (acceptedFields.projects && parsedData.projects && parsedData.projects.length > 0) {
      updates.projects = parsedData.projects.map((p, idx) => ({
        id: `proj-${Date.now()}-${idx}`,
        ...p
      }));
    }

    // Certifications
    if (acceptedFields.certifications && parsedData.certifications && parsedData.certifications.length > 0) {
      updates.certifications = parsedData.certifications.map((c, idx) => ({
        id: `cert-${Date.now()}-${idx}`,
        ...c
      }));
    }

    // Automatically synchronize preferred roles & keywords with parsed resume
    const desiredTitles = [];
    if (parsedData.education?.some(e => /data science|machine learning|analytics/i.test(e.specialization || ''))) {
      desiredTitles.push('Data Scientist', 'Machine Learning Engineer', 'Data Analyst', 'AI Engineer');
    }
    if (parsedData.experience?.some(e => /machine learning/i.test(e.title || ''))) {
      desiredTitles.push('Machine Learning Intern', 'Associate Data Scientist');
    }
    if (desiredTitles.length > 0) {
      updates.preferences = {
        ...(current.preferences || {}),
        desiredTitles: Array.from(new Set([...desiredTitles, ...(current.preferences?.desiredTitles || [])])),
        priorityKeywords: ['Python', 'SQL', 'Machine Learning', 'Data Science', 'Pandas', 'Scikit-learn', 'Power BI']
      };
    }

    const updated = db.updateCandidate(updates);
    res.json({ success: true, candidate: updated, message: 'Profile updated with resume information.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Search Query Matrix & Role Inference Routes
app.get('/api/search/matrix', (req, res) => {
  const candidate = db.getCandidate();
  const matrix = generateSearchMatrix(candidate);
  const adjacentRoles = inferAdjacentRoles(candidate);
  res.json({
    success: true,
    matrix,
    adjacentRoles
  });
});

// 4. Job Discovery Run Route
app.post('/api/search/run', async (req, res) => {
  try {
    const candidate = req.body.candidate || db.getCandidate();
    const result = await runJobDiscoveryPipeline(candidate);
    res.json(result);
  } catch (err) {
    console.error('Job discovery pipeline error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Dashboard Statistics Route
app.get('/api/stats', (req, res) => {
  res.json({ success: true, stats: db.getDashboardStats() });
});

// 6. Search Execution Logs Route
app.get('/api/search/logs', (req, res) => {
  res.json({ success: true, logs: db.getSearchLogs() });
});

// 7. Discovered Jobs Listing Route (supports Table 1 vs Table 2 & filters)
app.get('/api/jobs', (req, res) => {
  const filters = {
    sourceType: req.query.sourceType, // 'OFFICIAL_COMPANY' | 'JOB_PLATFORM'
    minScore: req.query.minScore,
    maxScore: req.query.maxScore,
    location: req.query.location,
    experience: req.query.experience,
    workMode: req.query.workMode,
    source: req.query.source,
    status: req.query.status,
    search: req.query.search,
    sortBy: req.query.sortBy,
    includeExpired: req.query.includeExpired === 'true'
  };

  const jobs = db.getJobs(filters);
  res.json({
    success: true,
    count: jobs.length,
    jobs
  });
});

// 8. Single Job Details Route
app.get('/api/jobs/:id', (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
  res.json({ success: true, job });
});

// 9. Re-verify Job URL Route
app.post('/api/jobs/:id/verify', async (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job) return res.status(404).json({ success: false, error: 'Job not found' });

  const urlToCheck = job.directApplyUrl || job.officialCompanyPage || job.jobPlatformUrl;
  const verification = await verifyJobUrl(urlToCheck);
  const status = determineJobStatus(job, verification);

  const updatedJob = db.updateJob(job.id, {
    jobStatus: status,
    lastChecked: new Date().toISOString()
  });

  res.json({ success: true, job: updatedJob, verification });
});

// 10. Deep Resume-To-Job Match Analysis ("Why am I a match?")
app.get('/api/jobs/:id/match-analysis', (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
  const candidate = db.getCandidate();

  const fit = evaluateJobFit(job, candidate);
  res.json({
    success: true,
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    analysis: fit
  });
});

// 11. Resume Optimization Route ("Optimize Resume for this Job")
app.get('/api/jobs/:id/optimize-resume', (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
  const candidate = db.getCandidate();

  const optimization = generateResumeOptimization(job, candidate);
  res.json({
    success: true,
    jobId: job.id,
    optimization
  });
});

// 12. Application Tracker Routes
app.get('/api/applications', (req, res) => {
  res.json({ success: true, applications: db.getApplications() });
});

app.post('/api/applications', (req, res) => {
  const apps = db.saveApplication(req.body);
  res.json({ success: true, applications: apps });
});

app.delete('/api/applications/:id', (req, res) => {
  const apps = db.deleteApplication(req.params.id);
  res.json({ success: true, applications: apps });
});

// Initialize server and preload real live jobs if database is currently empty
const server = app.listen(PORT, async () => {
  console.log(`Job Discovery Backend Server running on http://localhost:${PORT}`);
  
  // If database has 0 jobs or contains legacy fake mock jobs, run discovery pipeline to prime real genuine jobs
  const currentJobs = db.getJobs({ includeExpired: true });
  const hasFakeMockJobs = currentJobs.some(j => j.id.startsWith('ent-accenture') || j.id.startsWith('ent-deloitte') || j.id.startsWith('plat-linkedin-ba-inmobi'));
  if (currentJobs.length === 0 || hasFakeMockJobs) {
    console.log('Purging legacy fake mock data and priming database with genuine live jobs...');
    try {
      await runJobDiscoveryPipeline();
      console.log('Initial live job discovery completed.');
    } catch (e) {
      console.warn('Initial live search priming completed with note:', e.message);
    }
  }
});

// Keep event loop active
setInterval(() => {}, 30000);

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use by another instance. Exiting gracefully.`);
  } else {
    console.error('Server error:', err);
  }
});

