# CareerPilot AI — Verified Real-Time Job Discovery & ATS Intelligence

CareerPilot AI is an enterprise-grade job discovery and resume intelligence platform that searches, verifies, and analyzes job openings in **real time** across official company ATS boards and public job platforms with **zero expired links**.

---

## Key Features

- **100% Live Job Discovery**:
  - Direct parallel integration with **50+ premier enterprise ATS boards** (Greenhouse & Ashby) including InMobi, Thoughtworks, Groww, Cohere, Notion, Quora, OpenAI, Perplexity, Datadog, Cloudflare, MongoDB, GitLab, and more.
  - Real-time ingestion from verified public APIs (**Arbeitnow**, **Jobicy**, **Remotive**, **RemoteOK**).
  - 24-hour live platform deep-queries for **LinkedIn**, **Naukri**, **Indeed**, **Internshala**, **Glassdoor**, **Cutshort**, and **Foundit**.
- **Automated HTTP Link Verification Engine**:
  - Actively checks application URLs before displaying them.
  - Automatically identifies HTTP 404/410 errors and soft-404 closures (*"position has been filled"*, *"job is no longer available"*), immediately purging dead links.
- **Deep Resume-to-Job Match Scoring**:
  - Evaluates candidate skills, experience level, education, and keywords against exact job requirements.
  - Provides a multidimensional match scorecard with strength breakdowns and missing skill alerts.
- **Tailored ATS Resume Optimizer**:
  - Generates custom resume summary bullet points and keyword recommendations tailored to any specific job description.
- **Dual-View Job Dashboard**:
  - **Table 1**: Official Company Career Jobs (direct application links to official company boards).
  - **Table 2**: Job Platform Jobs (real-time platform postings & 24h live search feeds).
- **Application Pipeline Tracker**:
  - Track applications, interview stages, contacts, follow-up dates, and notes.

---

## Tech Stack

- **Frontend**: React 19, Vite, Vanilla CSS Design System, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express 5, Multer, Cheerio, PDF-Parse, Mammoth
- **Storage**: Local JSON database with atomic file persistence
- **Architecture**: Microservice API proxy with concurrent client/server dev environment

---

## Quick Start

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 2. Installation
```bash
git clone https://github.com/havyaka/job-hunting.git
cd job-hunting
npm install
```

### 3. Run Locally
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5175`

### 4. Build for Production
```bash
npm run build
```

---

## License
MIT
