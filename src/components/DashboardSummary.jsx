import React from 'react';
import { 
  Briefcase, 
  Sparkles, 
  ThumbsUp, 
  Building2, 
  Globe2, 
  ShieldCheck, 
  Clock, 
  Send 
} from 'lucide-react';

export default function DashboardSummary({ stats, onSelectFilter }) {
  if (!stats) return null;

  return (
    <div className="stats-grid">
      <div 
        className="stat-card primary" 
        onClick={() => onSelectFilter && onSelectFilter({ minScore: '', sourceType: '' })}
        style={{ cursor: 'pointer' }}
      >
        <div className="stat-header">
          <span className="stat-label">Jobs Discovered</span>
          <Briefcase size={18} className="stat-icon" />
        </div>
        <div className="stat-value">{stats.totalJobs || 0}</div>
        <div className="stat-footnote">Active verified openings</div>
      </div>

      <div 
        className="stat-card success"
        onClick={() => onSelectFilter && onSelectFilter({ minScore: '85', sourceType: '' })}
        style={{ cursor: 'pointer' }}
      >
        <div className="stat-header">
          <span className="stat-label">Highly Relevant (85%+)</span>
          <Sparkles size={18} className="stat-icon" style={{ color: '#34D399' }} />
        </div>
        <div className="stat-value" style={{ color: '#34D399' }}>{stats.highlyRelevant || 0}</div>
        <div className="stat-footnote">Direct skill & degree fit</div>
      </div>

      <div 
        className="stat-card info"
        onClick={() => onSelectFilter && onSelectFilter({ minScore: '70', maxScore: '84', sourceType: '' })}
        style={{ cursor: 'pointer' }}
      >
        <div className="stat-header">
          <span className="stat-label">Good Match (70–84%)</span>
          <ThumbsUp size={18} className="stat-icon" style={{ color: '#38BDF8' }} />
        </div>
        <div className="stat-value" style={{ color: '#38BDF8' }}>{stats.goodMatch || 0}</div>
        <div className="stat-footnote">Strong transferable potential</div>
      </div>

      <div 
        className="stat-card primary"
        onClick={() => onSelectFilter && onSelectFilter({ sourceType: 'OFFICIAL_COMPANY' })}
        style={{ cursor: 'pointer' }}
      >
        <div className="stat-header">
          <span className="stat-label">Official Company Jobs</span>
          <Building2 size={18} className="stat-icon" style={{ color: '#818CF8' }} />
        </div>
        <div className="stat-value" style={{ color: '#818CF8' }}>{stats.officialCompanyJobs || 0}</div>
        <div className="stat-footnote">Direct career portals</div>
      </div>

      <div 
        className="stat-card info"
        onClick={() => onSelectFilter && onSelectFilter({ sourceType: 'JOB_PLATFORM' })}
        style={{ cursor: 'pointer' }}
      >
        <div className="stat-header">
          <span className="stat-label">Job Platform Jobs</span>
          <Globe2 size={18} className="stat-icon" style={{ color: '#38BDF8' }} />
        </div>
        <div className="stat-value" style={{ color: '#38BDF8' }}>{stats.jobPlatformJobs || 0}</div>
        <div className="stat-footnote">LinkedIn, Naukri, Indeed, etc.</div>
      </div>

      <div className="stat-card success">
        <div className="stat-header">
          <span className="stat-label">Verified Active</span>
          <ShieldCheck size={18} className="stat-icon" style={{ color: '#10B981' }} />
        </div>
        <div className="stat-value" style={{ color: '#10B981' }}>{stats.verifiedActive || 0}</div>
        <div className="stat-footnote">Live application links confirmed</div>
      </div>

      <div className="stat-card warning">
        <div className="stat-header">
          <span className="stat-label">Discovered Today</span>
          <Clock size={18} className="stat-icon" style={{ color: '#FBBF24' }} />
        </div>
        <div className="stat-value" style={{ color: '#FBBF24' }}>{stats.newJobsToday || 0}</div>
        <div className="stat-footnote">Freshly indexed listings</div>
      </div>

      <div className="stat-card primary">
        <div className="stat-header">
          <span className="stat-label">Tracked Applications</span>
          <Send size={18} className="stat-icon" style={{ color: '#818CF8' }} />
        </div>
        <div className="stat-value">{stats.totalApplications || 0}</div>
        <div className="stat-footnote">In ATS pipeline</div>
      </div>
    </div>
  );
}
