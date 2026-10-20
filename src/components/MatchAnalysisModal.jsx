import React from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  GraduationCap, 
  Wrench, 
  Briefcase, 
  FolderKanban, 
  MapPin, 
  FileEdit, 
  ExternalLink 
} from 'lucide-react';

export default function MatchAnalysisModal({ 
  job, 
  onClose, 
  onOpenResumeOptimizer 
}) {
  if (!job) return null;

  const b = job.matchBreakdown || {
    overall: job.matchScore || 85,
    education: 95,
    skills: 90,
    experience: 75,
    projects: 85,
    location: 95,
    seniority: 80
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 840 }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: 2 }}>Why Am I A Match?</h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {job.title} at <strong style={{ color: 'var(--text-primary)' }}>{job.company}</strong>
              </div>
            </div>
          </div>

          <button className="btn-tactile btn-outline btn-sm" onClick={onClose} style={{ padding: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Top Score Banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-elevated)', padding: '16px 20px', borderRadius: 'var(--radius-lg)', marginBottom: 20, border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overall Job Fit Score</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: job.matchScore >= 85 ? '#34D399' : '#38BDF8', lineHeight: 1.1, marginTop: 4 }}>
                {job.matchScore}%
              </div>
            </div>
            <div style={{ maxWidth: 440, fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              {job.matchExplanation}
            </div>
          </div>

          {/* Granular Factor Scorecard */}
          <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
            Candidate Alignment Breakdown
          </h4>
          <div className="radar-grid">
            <div className="radar-item">
              <div className="radar-item-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <GraduationCap size={14} /> Education
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.education}%</span>
              </div>
              <div className="radar-bar-bg">
                <div className="radar-bar-fill" style={{ width: `${b.education}%` }} />
              </div>
            </div>

            <div className="radar-item">
              <div className="radar-item-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Wrench size={14} /> Skills
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.skills}%</span>
              </div>
              <div className="radar-bar-bg">
                <div className="radar-bar-fill" style={{ width: `${b.skills}%` }} />
              </div>
            </div>

            <div className="radar-item">
              <div className="radar-item-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Briefcase size={14} /> Experience
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.experience}%</span>
              </div>
              <div className="radar-bar-bg">
                <div className="radar-bar-fill" style={{ width: `${b.experience}%` }} />
              </div>
            </div>

            <div className="radar-item">
              <div className="radar-item-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <FolderKanban size={14} /> Projects
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.projects || 85}%</span>
              </div>
              <div className="radar-bar-bg">
                <div className="radar-bar-fill" style={{ width: `${b.projects || 85}%` }} />
              </div>
            </div>

            <div className="radar-item">
              <div className="radar-item-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <MapPin size={14} /> Location
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.location}%</span>
              </div>
              <div className="radar-bar-bg">
                <div className="radar-bar-fill" style={{ width: `${b.location}%` }} />
              </div>
            </div>
          </div>

          {/* Why This Matches */}
          <div style={{ marginTop: 20 }}>
            <h4 style={{ fontSize: '0.84rem', color: '#34D399', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} />
              Why this matches your profile
            </h4>
            <ul className="check-point-list">
              {(job.matchedPoints || []).map((pt, idx) => (
                <li key={idx} className="check-point-item">
                  <span className="check-icon">✓</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing / Weak Areas */}
          <div style={{ marginTop: 18 }}>
            <h4 style={{ fontSize: '0.84rem', color: '#FBBF24', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={16} />
              Missing or Weak Areas
            </h4>
            <ul className="check-point-list">
              {(job.weakPoints || []).length > 0 ? (
                job.weakPoints.map((wpt, idx) => (
                  <li key={idx} className="check-point-item">
                    <span className="warn-icon">⚠</span>
                    <span>{wpt}</span>
                  </li>
                ))
              ) : (
                <li className="check-point-item" style={{ color: 'var(--text-muted)' }}>
                  No significant qualification deficits identified for this opening.
                </li>
              )}
            </ul>
          </div>

          {/* Matched & Missing Keywords Chips */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 22 }}>
            <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                Matched Profile Keywords
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(job.matchedKeywords || []).map((kw, idx) => (
                  <span key={idx} className="tag-chip matched">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                Missing Job Keywords
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(job.missingSkills || []).length > 0 ? (
                  job.missingSkills.map((sk, idx) => (
                    <span key={idx} className="tag-chip" style={{ color: '#FBBF24' }}>
                      ⚠ {sk}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>None identified</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            className="btn-tactile btn-primary btn-sm"
            onClick={() => {
              onClose();
              onOpenResumeOptimizer(job);
            }}
          >
            <FileEdit size={14} />
            <span>Optimize Resume for This Job</span>
          </button>

          <a
            href={job.directApplyUrl || job.officialCompanyPage || job.jobPlatformUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-tactile btn-success btn-sm"
          >
            <span>Proceed to Application</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
