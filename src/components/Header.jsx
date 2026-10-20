import React from 'react';
import { 
  Compass, 
  Briefcase, 
  Building2, 
  Globe2, 
  User, 
  FileText, 
  Cpu, 
  CheckSquare, 
  History, 
  Search, 
  Loader2, 
  ShieldCheck 
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  isSearching, 
  onTriggerSearch,
  officialCount = 0,
  platformCount = 0,
  trackerCount = 0
}) {
  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="brand-icon">
          <Compass size={22} />
        </div>
        <div>
          <div className="brand-title">CareerPilot AI</div>
          <div className="brand-subtitle">Verified Job Intelligence</div>
        </div>
      </div>

      <nav className="nav-links">
        <button 
          className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          id="nav-tab-dashboard"
        >
          <Briefcase size={16} />
          <span>Dashboard</span>
        </button>

        <button 
          className={`nav-tab-btn ${activeTab === 'official' ? 'active' : ''}`}
          onClick={() => setActiveTab('official')}
          id="nav-tab-official"
        >
          <Building2 size={16} />
          <span>Official Company Jobs</span>
          {officialCount > 0 && <span className="table-tab-count">{officialCount}</span>}
        </button>

        <button 
          className={`nav-tab-btn ${activeTab === 'platforms' ? 'active' : ''}`}
          onClick={() => setActiveTab('platforms')}
          id="nav-tab-platforms"
        >
          <Globe2 size={16} />
          <span>Job Platforms</span>
          {platformCount > 0 && <span className="table-tab-count">{platformCount}</span>}
        </button>

        <button 
          className={`nav-tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
          onClick={() => setActiveTab('matrix')}
          id="nav-tab-matrix"
        >
          <Cpu size={16} />
          <span>AI Query Matrix</span>
        </button>

        <button 
          className={`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
          id="nav-tab-profile"
        >
          <User size={16} />
          <span>Candidate Profile</span>
        </button>

        <button 
          className={`nav-tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
          onClick={() => setActiveTab('resume')}
          id="nav-tab-resume"
        >
          <FileText size={16} />
          <span>Resume & Conflicts</span>
        </button>

        <button 
          className={`nav-tab-btn ${activeTab === 'tracker' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracker')}
          id="nav-tab-tracker"
        >
          <CheckSquare size={16} />
          <span>Applications</span>
          {trackerCount > 0 && <span className="table-tab-count">{trackerCount}</span>}
        </button>

        <button 
          className={`nav-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
          id="nav-tab-logs"
        >
          <History size={16} />
          <span>Audit Logs</span>
        </button>
      </nav>

      <div className="nav-actions">
        <button 
          className="btn-tactile btn-primary btn-sm"
          onClick={onTriggerSearch}
          disabled={isSearching}
          id="btn-find-jobs-global"
        >
          {isSearching ? (
            <>
              <Loader2 size={16} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Scanning Sources...</span>
            </>
          ) : (
            <>
              <Search size={16} />
              <span>Discover Jobs</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
