import React from 'react';
import { 
  Globe2, 
  ExternalLink, 
  Sparkles, 
  FileEdit, 
  BookmarkPlus, 
  MapPin, 
  Building,
  ShieldCheck 
} from 'lucide-react';

export default function JobsTablePlatforms({ 
  jobs, 
  onSelectJob, 
  onOpenMatchAnalysis, 
  onOpenResumeOptimizer, 
  onTrackJob 
}) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <Globe2 size={40} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
        <h3 style={{ marginBottom: 8 }}>No Job Platform Listings Found</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto 20px' }}>
          No platform jobs (LinkedIn, Naukri, Indeed, etc.) match your current filter selection.
        </p>
      </div>
    );
  }

  const getScoreBadgeClass = (score) => {
    if (score >= 85) return 'score-high';
    if (score >= 70) return 'score-mid';
    return 'score-low';
  };

  const getPlatformBadgeColor = (platform = '') => {
    const p = platform.toLowerCase();
    if (p.includes('linkedin')) return { bg: 'rgba(10, 102, 194, 0.18)', color: '#38BDF8', border: 'rgba(10, 102, 194, 0.4)' };
    if (p.includes('naukri')) return { bg: 'rgba(40, 116, 240, 0.18)', color: '#60A5FA', border: 'rgba(40, 116, 240, 0.4)' };
    if (p.includes('indeed')) return { bg: 'rgba(33, 100, 244, 0.18)', color: '#93C5FD', border: 'rgba(33, 100, 244, 0.4)' };
    if (p.includes('glassdoor')) return { bg: 'rgba(12, 160, 68, 0.18)', color: '#34D399', border: 'rgba(12, 160, 68, 0.4)' };
    if (p.includes('internshala')) return { bg: 'rgba(234, 88, 12, 0.18)', color: '#FB923C', border: 'rgba(234, 88, 12, 0.4)' };
    if (p.includes('cutshort')) return { bg: 'rgba(168, 85, 247, 0.18)', color: '#C084FC', border: 'rgba(168, 85, 247, 0.4)' };
    return { bg: 'rgba(14, 165, 233, 0.15)', color: '#38BDF8', border: 'rgba(14, 165, 233, 0.35)' };
  };

  return (
    <div className="table-container">
      <table className="jobs-table" id="table-job-platform-jobs">
        <thead>
          <tr>
            <th style={{ width: 85 }}>Match</th>
            <th>Job Title</th>
            <th>Company</th>
            <th>Platform</th>
            <th>Location</th>
            <th>Experience</th>
            <th>Matched Keywords</th>
            <th>Posted</th>
            <th style={{ textAlign: 'center' }}>Job Link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => {
            const badgeStyle = getPlatformBadgeColor(job.source);

            return (
              <tr key={job.id}>
                {/* Match Score */}
                <td>
                  <span className={`match-score-pill ${getScoreBadgeClass(job.matchScore)}`}>
                    {job.matchScore}%
                  </span>
                </td>

                {/* Job Title */}
                <td className="job-title-cell">
                  <div 
                    className="job-title-text" 
                    onClick={() => onSelectJob(job)}
                    title="Click to view full job description"
                  >
                    <span>{job.title}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
                    <span className="badge badge-verified">
                      <ShieldCheck size={11} />
                      Verified Live
                    </span>
                    {job.workMode && (
                      <span className="tag-chip" style={{ fontSize: '0.65rem' }}>
                        {job.workMode}
                      </span>
                    )}
                  </div>
                </td>

                {/* Company */}
                <td>
                  <div className="company-name">
                    <Building size={14} style={{ color: 'var(--text-muted)' }} />
                    <span>{job.company}</span>
                  </div>
                </td>

                {/* Platform Badge */}
                <td>
                  <span 
                    className="badge"
                    style={{ 
                      background: badgeStyle.bg, 
                      color: badgeStyle.color, 
                      borderColor: badgeStyle.border 
                    }}
                  >
                    <Globe2 size={11} />
                    {job.source}
                  </span>
                </td>

                {/* Location */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                    <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
                    <span>{job.location}</span>
                  </div>
                </td>

                {/* Experience */}
                <td>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {job.experienceRequired || 'Not specified'}
                  </span>
                </td>

                {/* Matched Keywords */}
                <td>
                  <div className="tag-list">
                    {(job.matchedKeywords || []).slice(0, 3).map((kw, idx) => (
                      <span key={idx} className="tag-chip matched">
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Posted Date */}
                <td>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {job.postedDate || 'Recent'}
                  </span>
                </td>

                {/* Job Link */}
                <td style={{ textAlign: 'center' }}>
                  <a
                    href={job.directApplyUrl || job.jobPlatformUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-tactile btn-primary btn-sm"
                    title={`Open job opening on ${job.source}`}
                    id={`platform-link-${job.id}`}
                  >
                    <span>Open on {job.source.split(' ')[0]}</span>
                    <ExternalLink size={13} />
                  </a>
                </td>

                {/* Actions */}
                <td>
                  <div className="action-cell">
                    <button
                      className="btn-tactile btn-outline btn-sm"
                      onClick={() => onOpenMatchAnalysis(job)}
                      title="Why am I a match?"
                    >
                      <Sparkles size={13} style={{ color: '#34D399' }} />
                      <span>Fit</span>
                    </button>

                    <button
                      className="btn-tactile btn-outline btn-sm"
                      onClick={() => onOpenResumeOptimizer(job)}
                      title="Optimize resume for this job"
                    >
                      <FileEdit size={13} style={{ color: '#38BDF8' }} />
                      <span>ATS</span>
                    </button>

                    <button
                      className="btn-tactile btn-outline btn-sm"
                      onClick={() => onTrackJob(job)}
                      title="Track in application pipeline"
                    >
                      <BookmarkPlus size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
