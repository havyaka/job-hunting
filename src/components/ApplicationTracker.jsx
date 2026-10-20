import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Plus, 
  ExternalLink, 
  Calendar, 
  User, 
  Phone, 
  Trash2, 
  Edit3, 
  Building2 
} from 'lucide-react';
import { api } from '../utils/api.js';

const STATUS_COLUMNS = [
  { id: 'Interested', title: 'Interested', color: '#818CF8' },
  { id: 'Applied', title: 'Applied', color: '#38BDF8' },
  { id: 'Assessment', title: 'Online Assessment', color: '#FBBF24' },
  { id: 'Interview', title: 'Interview Rounds', color: '#C084FC' },
  { id: 'Offer', title: 'Offer Received', color: '#34D399' },
  { id: 'Rejected', title: 'Archived / Rejected', color: '#94A3B8' }
];

export default function ApplicationTracker({ onCountChange }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingApp, setEditingApp] = useState(null);

  const fetchApps = async () => {
    try {
      const res = await api.getApplications();
      setApplications(res.applications || []);
      if (onCountChange) onCountChange((res.applications || []).length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleStatusChange = async (app, newStatus) => {
    try {
      await api.saveApplication({ ...app, status: newStatus });
      fetchApps();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this application from tracker?')) return;
    try {
      await api.deleteApplication(id);
      fetchApps();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!editingApp) return;
    try {
      await api.saveApplication(editingApp);
      setEditingApp(null);
      fetchApps();
    } catch (err) {
      alert('Error saving application: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
        Loading Application Pipeline...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.3rem' }}>Application Pipeline & Interview Tracker</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
            Track progress across recruiters, interview rounds, assessments, and offers.
          </p>
        </div>

        <button
          className="btn-tactile btn-primary btn-sm"
          onClick={() => setEditingApp({
            id: `app-custom-${Date.now()}`,
            jobTitle: 'Business Analyst',
            company: '',
            status: 'Applied',
            appliedDate: new Date().toISOString().split('T')[0],
            recruiterName: '',
            recruiterContact: '',
            followUpDate: '',
            notes: ''
          })}
        >
          <Plus size={14} /> Add Application
        </button>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {STATUS_COLUMNS.map(col => {
          const colApps = applications.filter(a => a.status === col.id);

          return (
            <div key={col.id} className="kanban-col">
              <div className="kanban-col-header" style={{ borderTop: `3px solid ${col.color}` }}>
                <span>{col.title}</span>
                <span className="table-tab-count">{colApps.length}</span>
              </div>

              <div className="kanban-col-body">
                {colApps.map(app => (
                  <div key={app.id} className="kanban-item-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                        {app.jobTitle}
                      </strong>
                      <button
                        onClick={() => handleDelete(app.id)}
                        style={{ color: 'var(--text-muted)' }}
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--accent-primary)', marginBottom: 8 }}>
                      <Building2 size={13} />
                      <span>{app.company}</span>
                    </div>

                    {app.appliedDate && (
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                        <Calendar size={11} />
                        <span>Applied: {app.appliedDate}</span>
                      </div>
                    )}

                    {app.notes && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'var(--bg-elevated)', padding: '6px 8px', borderRadius: 4, marginBottom: 8, fontStyle: 'italic' }}>
                        "{app.notes}"
                      </div>
                    )}

                    {/* Move Status Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                      <select
                        className="select-filter"
                        style={{ padding: '3px 6px', fontSize: '0.72rem' }}
                        value={app.status}
                        onChange={(e) => handleStatusChange(app, e.target.value)}
                      >
                        {STATUS_COLUMNS.map(s => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </select>

                      <button
                        className="btn-tactile btn-outline btn-sm"
                        style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                        onClick={() => setEditingApp(app)}
                      >
                        <Edit3 size={11} /> Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Add Modal */}
      {editingApp && (
        <div className="modal-overlay" onClick={() => setEditingApp(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3>{editingApp.id ? 'Edit Application Details' : 'Add Tracked Job'}</h3>
              <button className="btn-tactile btn-outline btn-sm" onClick={() => setEditingApp(null)}>✕</button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Job Title</label>
                  <input
                    type="text"
                    required
                    className="search-input"
                    style={{ paddingLeft: 10, marginTop: 4 }}
                    value={editingApp.jobTitle}
                    onChange={(e) => setEditingApp({ ...editingApp, jobTitle: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Company Name</label>
                  <input
                    type="text"
                    required
                    className="search-input"
                    style={{ paddingLeft: 10, marginTop: 4 }}
                    value={editingApp.company}
                    onChange={(e) => setEditingApp({ ...editingApp, company: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pipeline Status</label>
                    <select
                      className="select-filter"
                      style={{ width: '100%', height: 42, marginTop: 4 }}
                      value={editingApp.status}
                      onChange={(e) => setEditingApp({ ...editingApp, status: e.target.value })}
                    >
                      {STATUS_COLUMNS.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Applied Date</label>
                    <input
                      type="date"
                      className="search-input"
                      style={{ paddingLeft: 10, marginTop: 4 }}
                      value={editingApp.appliedDate || ''}
                      onChange={(e) => setEditingApp({ ...editingApp, appliedDate: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Recruiter Name</label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ paddingLeft: 10, marginTop: 4 }}
                      value={editingApp.recruiterName || ''}
                      onChange={(e) => setEditingApp({ ...editingApp, recruiterName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Follow-up Date</label>
                    <input
                      type="date"
                      className="search-input"
                      style={{ paddingLeft: 10, marginTop: 4 }}
                      value={editingApp.followUpDate || ''}
                      onChange={(e) => setEditingApp({ ...editingApp, followUpDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Notes / Interview Feedback</label>
                  <textarea
                    rows={3}
                    className="search-input"
                    style={{ paddingLeft: 10, marginTop: 4, height: 'auto' }}
                    value={editingApp.notes || ''}
                    onChange={(e) => setEditingApp({ ...editingApp, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-tactile btn-outline" onClick={() => setEditingApp(null)}>Cancel</button>
                <button type="submit" className="btn-tactile btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
