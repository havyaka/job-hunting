import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  Globe2, 
  Sparkles, 
  Search, 
  RotateCcw, 
  ShieldCheck, 
  ArrowRight, 
  FileText,
  Activity,
  CheckCircle2,
  RefreshCw,
  Zap,
  Radio,
  Clock
} from 'lucide-react';

import Header from './components/Header.jsx';
import DashboardSummary from './components/DashboardSummary.jsx';
import FilterToolbar from './components/FilterToolbar.jsx';
import JobsTableOfficial from './components/JobsTableOfficial.jsx';
import JobsTablePlatforms from './components/JobsTablePlatforms.jsx';
import JobDetailModal from './components/JobDetailModal.jsx';
import MatchAnalysisModal from './components/MatchAnalysisModal.jsx';
import ResumeOptimizerModal from './components/ResumeOptimizerModal.jsx';
import ResumeUploader from './components/ResumeUploader.jsx';
import ProfileEditor from './components/ProfileEditor.jsx';
import SearchQueryMatrixView from './components/SearchQueryMatrixView.jsx';
import ApplicationTracker from './components/ApplicationTracker.jsx';
import SearchExecutionLogView from './components/SearchExecutionLogView.jsx';

import { api } from './utils/api.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'official' | 'platforms' | 'matrix' | 'profile' | 'resume' | 'tracker' | 'logs'
  const [tableSubTab, setTableSubTab] = useState('official'); // 'official' | 'platforms'

  const [candidate, setCandidate] = useState(null);
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    minScore: '',
    maxScore: '',
    location: 'all',
    experience: 'all',
    workMode: 'all',
    sortBy: 'match_score_desc',
    includeExpired: false
  });

  // Modals state
  const [selectedJob, setSelectedJob] = useState(null);
  const [matchAnalysisJob, setMatchAnalysisJob] = useState(null);
  const [resumeOptimizerJob, setResumeOptimizerJob] = useState(null);

  // Load initial candidate profile and dashboard metrics
  const loadInitialData = async () => {
    try {
      const [candRes, statsRes] = await Promise.all([
        api.getCandidate(),
        api.getStats()
      ]);
      setCandidate(candRes.candidate);
      setStats(statsRes.stats);
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  };

  // Load jobs with active filters
  const loadJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await api.getJobs(filters);
      setJobs(res.jobs || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const [searchElapsedSeconds, setSearchElapsedSeconds] = useState(0);

  // Timer effect during live search
  useEffect(() => {
    let interval;
    if (isSearching) {
      setSearchElapsedSeconds(0);
      interval = setInterval(() => {
        setSearchElapsedSeconds(s => s + 1);
      }, 1000);
    } else {
      setSearchElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isSearching]);

  // Handle live search execution
  const handleTriggerSearch = async () => {
    setIsSearching(true);
    try {
      const res = await api.runSearch(candidate);
      setStats(res.stats);
      await loadJobs();
      // Celebration effect on successful discovery
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      alert('Live search failed: ' + err.message);
    } finally {
      setIsSearching(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      minScore: '',
      maxScore: '',
      location: 'all',
      experience: 'all',
      workMode: 'all',
      sortBy: 'match_score_desc',
      includeExpired: false
    });
  };

  // Track application shortcut
  const handleTrackJob = async (job) => {
    try {
      await api.saveApplication({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        applicationUrl: job.directApplyUrl || job.officialCompanyPage || job.jobPlatformUrl,
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        notes: `Discovered with ${job.matchScore}% match score on ${job.source}.`
      });
      alert(`Added "${job.title}" at ${job.company} to your Application Tracker!`);
      const s = await api.getStats();
      setStats(s.stats);
    } catch (err) {
      alert('Failed to save to tracker: ' + err.message);
    }
  };

  // Split jobs into Official Company Jobs (Table 1) and Job Platform Jobs (Table 2)
  const officialJobs = jobs.filter(j => j.sourceType === 'OFFICIAL_COMPANY');
  const platformJobs = jobs.filter(j => j.sourceType === 'JOB_PLATFORM');

  return (
    <div className="app-container">
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSearching={isSearching}
        onTriggerSearch={handleTriggerSearch}
        officialCount={officialJobs.length}
        platformCount={platformJobs.length}
        trackerCount={stats?.totalApplications || 0}
      />

      {/* Main Content Area */}
      <main className="app-main">
        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            {/* Dashboard High-Level Metrics Summary */}
            <DashboardSummary
              stats={stats}
              onSelectFilter={(partial) => setFilters(p => ({ ...p, ...partial }))}
            />

            {/* Filter Toolbar */}
            <FilterToolbar
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
            />

            {/* Live Verification Status Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(56, 189, 248, 0.08))',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 20px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34D399',
                  boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
                }}>
                  <Radio size={20} className="pulse-icon" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>
                      Live Search Active • Real-Time Openings Only
                    </span>
                    <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                      <ShieldCheck size={11} /> 100% Live Links Verified
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    Querying 50+ enterprise ATS systems (Greenhouse, Ashby), public feeds, & 24h platform portals. Expired & dead links are automatically purged.
                  </div>
                </div>
              </div>

              <button
                className="btn-tactile btn-primary btn-sm"
                onClick={handleTriggerSearch}
                disabled={isSearching}
                id="btn-rescan-live"
                style={{ gap: 8 }}
              >
                <RefreshCw size={14} className={isSearching ? 'spin-icon' : ''} />
                <span>{isSearching ? `Scanning Live Web (${searchElapsedSeconds}s)...` : 'Re-Scan Live Openings Now'}</span>
              </button>
            </div>

            {/* Two Main Result Tables Switcher */}
            <div className="table-tab-switcher">
              <button
                className={`table-tab-btn ${tableSubTab === 'official' ? 'active' : ''}`}
                onClick={() => setTableSubTab('official')}
                id="btn-subtab-official"
              >
                <Building2 size={16} />
                <span>TABLE 1 — Official Company Career Jobs</span>
                <span className="table-tab-count">{officialJobs.length}</span>
              </button>

              <button
                className={`table-tab-btn ${tableSubTab === 'platforms' ? 'active' : ''}`}
                onClick={() => setTableSubTab('platforms')}
                id="btn-subtab-platforms"
              >
                <Globe2 size={16} />
                <span>TABLE 2 — Job Platform Jobs (LinkedIn, Naukri, Indeed)</span>
                <span className="table-tab-count">{platformJobs.length}</span>
              </button>
            </div>

            {/* Active Table Rendering */}
            {tableSubTab === 'official' ? (
              <JobsTableOfficial
                jobs={officialJobs}
                onSelectJob={(j) => setSelectedJob(j)}
                onOpenMatchAnalysis={(j) => setMatchAnalysisJob(j)}
                onOpenResumeOptimizer={(j) => setResumeOptimizerJob(j)}
                onTrackJob={handleTrackJob}
              />
            ) : (
              <JobsTablePlatforms
                jobs={platformJobs}
                onSelectJob={(j) => setSelectedJob(j)}
                onOpenMatchAnalysis={(j) => setMatchAnalysisJob(j)}
                onOpenResumeOptimizer={(j) => setResumeOptimizerJob(j)}
                onTrackJob={handleTrackJob}
              />
            )}
          </div>
        )}

        {/* VIEW 2: TABLE 1 ONLY (Official Company Jobs) */}
        {activeTab === 'official' && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: 20 }}>
              <h2>Table 1 — Official Company Career Portal Openings</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
                Openings discovered directly on official enterprise career boards (Accenture, Deloitte, EY, PwC, Amazon, Razorpay, etc.) with guaranteed direct application links.
              </p>
            </div>
            <FilterToolbar filters={filters} setFilters={setFilters} onReset={handleResetFilters} />
            <JobsTableOfficial
              jobs={officialJobs}
              onSelectJob={(j) => setSelectedJob(j)}
              onOpenMatchAnalysis={(j) => setMatchAnalysisJob(j)}
              onOpenResumeOptimizer={(j) => setResumeOptimizerJob(j)}
              onTrackJob={handleTrackJob}
            />
          </div>
        )}

        {/* VIEW 3: TABLE 2 ONLY (Job Platform Jobs) */}
        {activeTab === 'platforms' && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: 20 }}>
              <h2>Table 2 — Job Platform Listings</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
                Verified openings discovered across LinkedIn Jobs, Naukri, Indeed, Glassdoor, Internshala, Cutshort, and Foundit.
              </p>
            </div>
            <FilterToolbar filters={filters} setFilters={setFilters} onReset={handleResetFilters} />
            <JobsTablePlatforms
              jobs={platformJobs}
              onSelectJob={(j) => setSelectedJob(j)}
              onOpenMatchAnalysis={(j) => setMatchAnalysisJob(j)}
              onOpenResumeOptimizer={(j) => setResumeOptimizerJob(j)}
              onTrackJob={handleTrackJob}
            />
          </div>
        )}

        {/* VIEW 4: AI QUERY MATRIX & INFERRED ROLES */}
        {activeTab === 'matrix' && (
          <div className="animate-fade-in">
            <SearchQueryMatrixView candidate={candidate} />
          </div>
        )}

        {/* VIEW 5: CANDIDATE PROFILE */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in">
            <ProfileEditor
              candidate={candidate}
              onProfileSaved={(c) => {
                setCandidate(c);
                loadInitialData();
              }}
            />
          </div>
        )}

        {/* VIEW 6: RESUME UPLOADER & CONFLICTS */}
        {activeTab === 'resume' && (
          <div className="animate-fade-in">
            <ResumeUploader
              candidate={candidate}
              onProfileUpdated={(c) => {
                setCandidate(c);
                loadInitialData();
              }}
            />
          </div>
        )}

        {/* VIEW 7: APPLICATION TRACKER */}
        {activeTab === 'tracker' && (
          <div className="animate-fade-in">
            <ApplicationTracker
              onCountChange={(cnt) => setStats(p => ({ ...p, totalApplications: cnt }))}
            />
          </div>
        )}

        {/* VIEW 8: SEARCH EXECUTION LOGS */}
        {activeTab === 'logs' && (
          <div className="animate-fade-in">
            <SearchExecutionLogView />
          </div>
        )}
      </main>

      {/* MODAL 1: JOB DETAIL MODAL */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onOpenMatchAnalysis={(j) => setMatchAnalysisJob(j)}
          onOpenResumeOptimizer={(j) => setResumeOptimizerJob(j)}
          onTrackJob={handleTrackJob}
        />
      )}

      {/* MODAL 2: WHY AM I A MATCH? FIT SCORECARD */}
      {matchAnalysisJob && (
        <MatchAnalysisModal
          job={matchAnalysisJob}
          onClose={() => setMatchAnalysisJob(null)}
          onOpenResumeOptimizer={(j) => setResumeOptimizerJob(j)}
        />
      )}

      {/* MODAL 3: RESUME OPTIMIZER FOR THIS JOB */}
      {resumeOptimizerJob && (
        <ResumeOptimizerModal
          job={resumeOptimizerJob}
          onClose={() => setResumeOptimizerJob(null)}
        />
      )}

      {/* LIVE SEARCHING PROGRESS OVERLAY MODAL */}
      {isSearching && (
        <div className="modal-overlay" style={{ zIndex: 9999, backdropFilter: 'blur(8px)', background: 'rgba(5, 8, 16, 0.85)' }}>
          <div className="modal-dialog glass-card animate-fade-in" style={{ maxWidth: 560, padding: '32px 28px', textAlign: 'center' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(56, 189, 248, 0.25))',
              border: '1px solid rgba(56, 189, 248, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#38BDF8',
              boxShadow: '0 0 24px rgba(56, 189, 248, 0.35)'
            }}>
              <RefreshCw size={28} style={{ animation: 'spin 1.5s linear infinite' }} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>
              Searching Job Openings in Live Time...
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 20 }}>
              Querying official enterprise career portals and live platform feeds. Validating all application URLs in real time.
            </p>

            <div style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              textAlign: 'left',
              marginBottom: 24
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: '0.84rem' }}>
                <CheckCircle2 size={16} style={{ color: '#34D399', flexShrink: 0 }} />
                <span>Connected to 50+ enterprise ATS systems (Greenhouse & Ashby)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: '0.84rem' }}>
                <CheckCircle2 size={16} style={{ color: '#34D399', flexShrink: 0 }} />
                <span>Polling live public feeds (Arbeitnow, Jobicy, Remotive, RemoteOK)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: '0.84rem' }}>
                <CheckCircle2 size={16} style={{ color: '#34D399', flexShrink: 0 }} />
                <span>Querying 24-hour live platform feeds (LinkedIn, Naukri, Indeed, Internshala)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.84rem', color: '#38BDF8' }}>
                <Activity size={16} style={{ color: '#38BDF8', flexShrink: 0, animation: 'pulse 1s infinite' }} />
                <span>Verifying HTTP application links & scoring resume match ({searchElapsedSeconds}s elapsed)...</span>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              ⚡ This takes a few seconds because it performs live web queries to ensure zero expired links.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
