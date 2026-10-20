import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, Search, Filter, Layers, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../utils/api.js';

export default function SearchExecutionLogView() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSearchLogs()
      .then(res => setLogs(res.logs || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
        Loading execution history logs...
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
        <History size={36} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
        <h3>No Execution History Yet</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Click "Discover Jobs" in the top bar to run a live multi-source discovery cycle.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h2>Live Search Execution Logs & Audit Trail</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
          Transparent inspection of each search pass: sources queried, queries dispatched, duplicates deduplicated, and verified active counts.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {logs.map((log) => (
          <div key={log.id} className="glass-card">
            <div className="glass-card-header" style={{ background: 'var(--bg-elevated)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock size={16} style={{ color: 'var(--accent-info)' }} />
                <div>
                  <strong>Search Execution Completed:</strong>{' '}
                  <span style={{ color: 'var(--text-secondary)' }}>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <span className="badge badge-verified">
                Execution Time: {((log.durationMs || 1000) / 1000).toFixed(1)}s
              </span>
            </div>

            <div className="glass-card-body">
              {/* Metrics Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
                <div style={{ background: 'var(--bg-surface)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Queries Generated</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: 4 }}>{log.queriesGenerated || 0}</div>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Raw Discovered</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: 4, color: '#38BDF8' }}>{log.jobsDiscovered || 0}</div>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Duplicates Removed</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: 4, color: '#FBBF24' }}>{log.duplicatesRemoved || 0}</div>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Expired Filtered</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: 4, color: '#F87171' }}>{log.expiredJobsRemoved || 0}</div>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Verified Active</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: 4, color: '#34D399' }}>{log.verifiedJobsCount || 0}</div>
                </div>
              </div>

              {/* Sources List */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Sources Queried in this Session:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(log.sourcesSearched || []).map((src, idx) => (
                    <span key={idx} className="tag-chip" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#A5B4FC' }}>
                      ✓ {src}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
