import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Search, 
  MapPin, 
  Wrench, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { api } from '../utils/api.js';

export default function SearchQueryMatrixView({ candidate }) {
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSearchMatrix()
      .then(res => setMatrixData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [candidate]);

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
        Calculating search matrix and inferring adjacent roles...
      </div>
    );
  }

  const { matrix, adjacentRoles } = matrixData || {};

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* AI Profile Understanding & Role Expansion Card */}
      <div className="glass-card" style={{ marginBottom: 24 }}>
        <div className="glass-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              <Cpu size={20} />
            </div>
            <div>
              <h3>AI Profile Understanding & Adjacent Role Inference</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                System examines your education, tools, and domain exposure to expand search boundaries beyond explicit job titles.
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card-body">
          {/* Explicit vs Inferred Roles Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 20 }}>
            <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                Explicit Desired Roles (From Profile)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(candidate?.preferences?.desiredTitles || []).map((t, idx) => (
                  <span key={idx} className="tag-chip" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', padding: '4px 10px' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-success)', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} />
                AI-Inferred Adjacent Roles
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(adjacentRoles?.inferredRoles || []).map((t, idx) => (
                  <span key={idx} className="tag-chip matched" style={{ padding: '4px 10px' }}>
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rationale List */}
          <div style={{ background: 'rgba(99, 102, 241, 0.06)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-md)', padding: 14 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              Inference Rationale & Professional Boundaries:
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(adjacentRoles?.rationale || []).map((r, idx) => (
                <li key={idx} style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: 'var(--accent-primary)' }}>•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Dynamic Search Matrix Permutations */}
      <div className="glass-card" style={{ marginBottom: 24 }}>
        <div className="glass-card-header">
          <div>
            <h3>Search Query Permutation Matrix</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              Multi-dimensional query combinations automatically generated and searched across portals.
            </p>
          </div>
          <span className="badge badge-official">
            {matrix?.totalQueriesGenerated || 0} Dynamic Queries
          </span>
        </div>

        <div className="glass-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 20 }}>
            <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6 }}>
                Target Dimensions
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                <strong>Roles:</strong> {matrix?.combinedRoles?.slice(0, 4).join(', ')}
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                <strong>Skills:</strong> {matrix?.prioritizedSkills?.slice(0, 4).join(', ')}
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                <strong>Locations:</strong> {matrix?.preferredLocations?.join(', ')}
              </div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6 }}>
                Direct ATS Targets
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {(matrix?.atsTargets || []).slice(0, 10).map((ats, idx) => (
                  <span key={idx} className="tag-chip" style={{ fontSize: '0.7rem' }}>
                    {ats.name} ({ats.system})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sample Query Permutations Table */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
            <h4 style={{ fontSize: '0.84rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
              Sample Live Combinations
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 8 }}>
              {(matrix?.matrixCombinations || []).map((combo, idx) => (
                <div key={idx} style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', fontFamily: 'var(--font-family-mono)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Search size={13} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                  <span>{combo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
