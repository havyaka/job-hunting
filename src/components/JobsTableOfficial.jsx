import React from 'react';
import { 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  FileEdit, 
  BookmarkPlus, 
  MapPin, 
  Briefcase 
} from 'lucide-react';

export default function JobsTableOfficial({ 
  jobs, 
  onSelectJob, 
  onOpenMatchAnalysis, 
  onOpenResumeOptimizer, 
  onTrackJob 
}) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <Building2 size={40} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
        <h3 style={{ marginBottom: 8 }}>No Official Company Jobs Found</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto 20px' }}>
          No official career page jobs match your current search criteria. Try broadening your filters or click "Discover Jobs" above.
        </p>
      </div>
    );
  }

  const getScoreBadgeClass = (score) => {
    if (score >= 85) return 'score-high';
    if (score >= 70) return 'score-mid';
    return 'score-low';
  };

  return (
    <div className="table-container">
      <table className="jobs-table" id="table-official-company-jobs">
        <thead>
          <tr>
            <th style={{ width: 85 }}>Match</th>
            <th>Job Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Experience</th>
            <th>Key Skills</th>
            <th>Matched Keywords</th>
            <th>Posted</th>
            <th style={{ textAlign: 'center' }}>Application</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
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
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
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
                  <Building2 size={14} style={{ color: 'var(--accent-primary)' }} />
                  <span>{job.company}</span>
                </div>
                <div className="company-sub">{job.source}</div>
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

              {/* Key Skills */}
              <td>
                <div className="tag-list">
                  {(job.requiredSkills || []).slice(0, 3).map((sk, idx) => (
                    <span key={idx} className="tag-chip">
                      {sk}
                    </span>
                  ))}
                  {(job.requiredSkills || []).length > 3 && (
                    <span className="tag-chip">+{job.requiredSkills.length - 3}</span>
                  )}
                </div>
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

              {/* Application Column: Direct clickable link to actual career portal */}
              <td style={{ textAlign: 'center' }}>
                <a
                  href={job.directApplyUrl || job.officialCompanyPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-tactile btn-success btn-sm"
                  title="Direct link to official company application page"
                  id={`apply-link-${job.id}`}
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink size={13} />
                </a>
              </td>

              {/* Actions Column */}
              <td>
                <div className="action-cell">
                  <button
                    className="btn-tactile btn-outline btn-sm"
                    onClick={() => onOpenMatchAnalysis(job)}
                    title="Why am I a match?"
                  >
                    <Sparkles size={13} style={{ color: '#34D399' }} />
                    <span>Fit Analysis</span>
                  </button>

                  <button
                    className="btn-tactile btn-outline btn-sm"
                    onClick={() => onOpenResumeOptimizer(job)}
                    title="Optimize resume for this job"
                  >
                    <FileEdit size={13} style={{ color: '#38BDF8' }} />
                    <span>ATS Prep</span>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
