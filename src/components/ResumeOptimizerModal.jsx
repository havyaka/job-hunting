import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileEdit, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Lightbulb, 
  Copy, 
  Check 
} from 'lucide-react';
import { api } from '../utils/api.js';

export default function ResumeOptimizerModal({ job, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    if (job?.id) {
      setLoading(true);
      api.getResumeOptimization(job.id)
        .then(res => setData(res.optimization))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [job]);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!job) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 840 }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8' }}>
              <FileEdit size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: 2 }}>ATS Resume Optimization</h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Targeting: {job.title} at <strong style={{ color: 'var(--text-primary)' }}>{job.company}</strong>
              </div>
            </div>
          </div>

          <button className="btn-tactile btn-outline btn-sm" onClick={onClose} style={{ padding: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
              Analyzing resume keywords against ATS requirements...
            </div>
          ) : data ? (
            <>
              {/* ATS Forecast Card */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(56, 189, 248, 0.15))', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--accent-info)', fontWeight: 700 }}>
                    Predicted ATS Resume Score
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                      {job.matchScore}%
                    </span>
                    <ArrowRight size={18} style={{ color: 'var(--accent-success)' }} />
                    <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34D399' }}>
                      {data.targetATSScoreForecast}%
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: 380 }}>
                  By emphasizing your verified analytical projects and tailoring phrasing, your keyword match probability increases significantly.
                </div>
              </div>

              {/* Anti-Hallucination Disclaimer Banner */}
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', color: '#F87171' }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>
                  <strong>Ethical AI Guardrail:</strong> Never fabricate unearned qualifications, companies, or tools. Only highlight skills you have genuine coursework or project exposure to.
                </span>
              </div>

              {/* Action Items */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: '0.84rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
                  Tailoring Action Plan
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {data.actionItems.map((item, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: 4 }}>
                        {item.category}
                      </div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {item.advice}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prioritized Projects */}
              {data.prioritizedProjects && data.prioritizedProjects.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: '0.84rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
                    Portfolio Projects to Lead With
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {data.prioritizedProjects.map((p, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '0.88rem' }}>{p.projectName}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            {p.recommendation}
                          </div>
                        </div>
                        <span className={`tag-chip ${p.relevance === 'High Priority' ? 'matched' : ''}`}>
                          {p.relevance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Bullet Phrasings */}
              <div>
                <h4 style={{ fontSize: '0.84rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Lightbulb size={14} style={{ color: '#FBBF24' }} />
                  High-Impact Metric Phrasings (XYZ Format)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {data.recommendedBulletPhrasings.map((bullet, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                        "{bullet}"
                      </span>
                      <button
                        className="btn-tactile btn-outline btn-sm"
                        onClick={() => handleCopy(bullet, idx)}
                        style={{ padding: '4px 8px', flexShrink: 0 }}
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check size={12} style={{ color: '#10B981' }} />
                            <span style={{ fontSize: '0.72rem', color: '#10B981' }}>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span style={{ fontSize: '0.72rem' }}>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>Failed to load recommendations.</div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-tactile btn-primary btn-sm" onClick={onClose}>
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
}
