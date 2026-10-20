import React from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  FileEdit, 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function JobDetailModal({ 
  job, 
  onClose, 
  onOpenMatchAnalysis, 
  onOpenResumeOptimizer, 
  onTrackJob 
}) {
  if (!job) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 880 }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className={`match-score-pill ${job.matchScore >= 85 ? 'score-high' : job.matchScore >= 70 ? 'score-mid' : 'score-low'}`} style={{ fontSize: '1rem', padding: '6px 14px' }}>
              {job.matchScore}% Match
            </span>
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 2 }}>{job.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{job.company}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={13} />
                  {job.location}
                </span>
                <span>•</span>
                <span className="badge badge-verified">
                  <ShieldCheck size={11} />
                  {job.jobStatus || 'Verified Active'}
                </span>
              </div>
            </div>
          </div>

          <button className="btn-tactile btn-outline btn-sm" onClick={onClose} style={{ padding: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 22 }}>
            <div style={{ background: 'var(--bg-elevated)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Experience</div>
              <div style={{ fontWeight: 600, marginTop: 2 }}>{job.experienceRequired || 'Not specified'}</div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Salary</div>
              <div style={{ fontWeight: 600, marginTop: 2 }}>{job.salary || 'Not disclosed'}</div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Work Mode</div>
              <div style={{ fontWeight: 600, marginTop: 2 }}>{job.workMode || 'Hybrid'} ({job.employmentType || 'Full-time'})</div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Posted / Discovered</div>
              <div style={{ fontWeight: 600, marginTop: 2 }}>{job.postedDate || 'Recent'}</div>
            </div>
          </div>

          {/* Multi-source Availability Badges */}
          {job.sourcesFound && job.sourcesFound.length > 0 && (
            <div style={{ background: 'var(--bg-elevated)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 20, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                Discovered Across Sources:
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {job.sourcesFound.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tag-chip"
                    style={{ background: src.isOfficial ? 'rgba(99, 102, 241, 0.2)' : 'rgba(14, 165, 233, 0.15)', color: '#FFFFFF', padding: '4px 10px' }}
                  >
                    ✓ {src.name}
                    <ExternalLink size={10} style={{ marginLeft: 4 }} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Quick Fit Summary */}
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#34D399', marginBottom: 6, fontSize: '0.86rem' }}>
              <Sparkles size={16} />
              AI Match Synthesis
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {job.matchExplanation}
            </p>
          </div>

          {/* Required Skills */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.86rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
              Skills & Qualifications
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(job.requiredSkills || []).map((sk, idx) => {
                const isMatched = (job.matchedKeywords || []).some(k => k.toLowerCase() === sk.toLowerCase());
                return (
                  <span key={idx} className={`tag-chip ${isMatched ? 'matched' : ''}`} style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                    {isMatched ? '✓ ' : ''}{sk}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Full Job Description */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.86rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
              Role Overview & Responsibilities
            </h4>
            <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-line', color: 'var(--text-secondary)' }}>
              {job.description}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button 
            className="btn-tactile btn-outline"
            onClick={() => {
              onClose();
              onOpenMatchAnalysis(job);
            }}
          >
            <Sparkles size={16} style={{ color: '#34D399' }} />
            <span>Why Am I A Match?</span>
          </button>

          <button 
            className="btn-tactile btn-outline"
            onClick={() => {
              onClose();
              onOpenResumeOptimizer(job);
            }}
          >
            <FileEdit size={16} style={{ color: '#38BDF8' }} />
            <span>Optimize Resume</span>
          </button>

          <button 
            className="btn-tactile btn-secondary"
            onClick={() => {
              onTrackJob(job);
              onClose();
            }}
          >
            <span>Track Application</span>
          </button>

          <a
            href={job.directApplyUrl || job.officialCompanyPage || job.jobPlatformUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-tactile btn-success"
            id="modal-direct-apply-btn"
          >
            <span>{job.sourceType === 'OFFICIAL_COMPANY' ? 'Apply on Official Careers' : `Apply on ${job.source}`}</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
