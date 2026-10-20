import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  User, 
  GraduationCap, 
  Briefcase, 
  Wrench, 
  FolderKanban, 
  Award, 
  Settings, 
  CheckCircle2 
} from 'lucide-react';
import { api } from '../utils/api.js';

export default function ProfileEditor({ candidate, onProfileSaved }) {
  const [profile, setProfile] = useState(candidate || {});
  const [activeSubTab, setActiveSubTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Synchronize state when candidate updates from resume upload or reload
  useEffect(() => {
    if (candidate) {
      setProfile(candidate);
    }
  }, [candidate]);

  const handlePersonalChange = (field, value) => {
    setProfile(p => ({ ...p, [field]: value }));
  };

  const handlePreferencesChange = (field, value) => {
    setProfile(p => ({
      ...p,
      preferences: {
        ...(p.preferences || {}),
        [field]: value
      }
    }));
  };

  // Education handlers
  const addEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree: 'MBA',
      specialization: 'Business Analytics',
      university: '',
      graduationYear: '2026',
      status: 'Pursuing',
      coursework: '',
      achievements: ''
    };
    setProfile(p => ({ ...p, education: [...(p.education || []), newEdu] }));
  };

  const updateEducation = (id, field, value) => {
    setProfile(p => ({
      ...p,
      education: (p.education || []).map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  const removeEducation = (id) => {
    setProfile(p => ({
      ...p,
      education: (p.education || []).filter(e => e.id !== id)
    }));
  };

  // Experience handlers
  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      company: '',
      title: 'Business Analyst',
      dates: '',
      responsibilities: '',
      industry: '',
      skillsUsed: []
    };
    setProfile(p => ({ ...p, experience: [...(p.experience || []), newExp] }));
  };

  const updateExperience = (id, field, value) => {
    setProfile(p => ({
      ...p,
      experience: (p.experience || []).map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  const removeExperience = (id) => {
    setProfile(p => ({
      ...p,
      experience: (p.experience || []).filter(e => e.id !== id)
    }));
  };

  // Projects handlers
  const addProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      technologies: [],
      industry: '',
      responsibilities: '',
      results: ''
    };
    setProfile(p => ({ ...p, projects: [...(p.projects || []), newProj] }));
  };

  const updateProject = (id, field, value) => {
    setProfile(p => ({
      ...p,
      projects: (p.projects || []).map(pr => pr.id === id ? { ...pr, [field]: value } : pr)
    }));
  };

  const removeProject = (id) => {
    setProfile(p => ({
      ...p,
      projects: (p.projects || []).filter(pr => pr.id !== id)
    }));
  };

  // Certifications handlers
  const addCertification = () => {
    const newCert = {
      id: `cert-${Date.now()}`,
      name: '',
      issuingOrg: '',
      date: '2025',
      skills: []
    };
    setProfile(p => ({ ...p, certifications: [...(p.certifications || []), newCert] }));
  };

  const updateCertification = (id, field, value) => {
    setProfile(p => ({
      ...p,
      certifications: (p.certifications || []).map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const removeCertification = (id) => {
    setProfile(p => ({
      ...p,
      certifications: (p.certifications || []).filter(c => c.id !== id)
    }));
  };

  // Save handler
  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await api.updateCandidate(profile);
      setProfile(res.candidate);
      if (onProfileSaved) onProfileSaved(res.candidate);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div className="glass-card" style={{ marginBottom: 24 }}>
        <div className="glass-card-header">
          <div>
            <h3>Candidate Profile Management</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              Maintain your structured credentials, skills, target companies, and job preferences.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {savedSuccess && (
              <span style={{ color: '#34D399', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={15} /> Saved
              </span>
            )}
            <button className="btn-tactile btn-primary btn-sm" onClick={handleSave} disabled={saving} id="btn-save-profile">
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div style={{ display: 'flex', gap: 8, padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', overflowX: 'auto' }}>
          {[
            { id: 'personal', label: 'Personal & Search', icon: User },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'experience', label: 'Experience', icon: Briefcase },
            { id: 'skills', label: 'Skills & Tools', icon: Wrench },
            { id: 'projects', label: 'Projects', icon: FolderKanban },
            { id: 'certifications', label: 'Certifications', icon: Award },
            { id: 'preferences', label: 'Preferences & Keywords', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`btn-tactile ${activeSubTab === tab.id ? 'btn-primary' : 'btn-outline'} btn-sm`}
                onClick={() => setActiveSubTab(tab.id)}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="glass-card-body">
          {/* 1. PERSONAL TAB */}
          {activeSubTab === 'personal' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Full Name</label>
                <input
                  type="text"
                  className="search-input"
                  style={{ paddingLeft: 14 }}
                  value={profile.name || ''}
                  onChange={(e) => handlePersonalChange('name', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Email</label>
                <input
                  type="email"
                  className="search-input"
                  style={{ paddingLeft: 14 }}
                  value={profile.email || ''}
                  onChange={(e) => handlePersonalChange('email', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Phone</label>
                <input
                  type="text"
                  className="search-input"
                  style={{ paddingLeft: 14 }}
                  value={profile.phone || ''}
                  onChange={(e) => handlePersonalChange('phone', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Current Location</label>
                <input
                  type="text"
                  className="search-input"
                  style={{ paddingLeft: 14 }}
                  value={profile.currentLocation || ''}
                  onChange={(e) => handlePersonalChange('currentLocation', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Preferred Locations (Comma-separated)</label>
                <input
                  type="text"
                  className="search-input"
                  style={{ paddingLeft: 14 }}
                  value={(profile.preferredLocations || []).join(', ')}
                  onChange={(e) => handlePersonalChange('preferredLocations', e.target.value.split(',').map(s => s.trim()))}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Willing to Relocate?</label>
                <select
                  className="select-filter"
                  style={{ width: '100%', height: 42 }}
                  value={profile.relocate ? 'yes' : 'no'}
                  onChange={(e) => handlePersonalChange('relocate', e.target.value === 'yes')}
                >
                  <option value="yes">Yes, open to relocate</option>
                  <option value="no">No, only preferred cities</option>
                </select>
              </div>
            </div>
          )}

          {/* 2. EDUCATION TAB */}
          {activeSubTab === 'education' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>Academic Qualifications (Supports Multiple Degrees)</span>
                <button className="btn-tactile btn-outline btn-sm" onClick={addEducation}>
                  <Plus size={14} /> Add Degree
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(profile.education || []).map((edu) => (
                  <div key={edu.id} style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                    <button
                      onClick={() => removeEducation(edu.id)}
                      style={{ position: 'absolute', top: 12, right: 12, color: 'var(--accent-danger)' }}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Degree</label>
                        <input
                          type="text"
                          className="search-input"
                          style={{ paddingLeft: 10, marginTop: 4 }}
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Specialization</label>
                        <input
                          type="text"
                          className="search-input"
                          style={{ paddingLeft: 10, marginTop: 4 }}
                          value={edu.specialization}
                          onChange={(e) => updateEducation(edu.id, 'specialization', e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>University / College</label>
                        <input
                          type="text"
                          className="search-input"
                          style={{ paddingLeft: 10, marginTop: 4 }}
                          value={edu.university}
                          onChange={(e) => updateEducation(edu.id, 'university', e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Graduation Year</label>
                        <input
                          type="text"
                          className="search-input"
                          style={{ paddingLeft: 10, marginTop: 4 }}
                          value={edu.graduationYear}
                          onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. EXPERIENCE TAB */}
          {activeSubTab === 'experience' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>Work History & Internships</span>
                <button className="btn-tactile btn-outline btn-sm" onClick={addExperience}>
                  <Plus size={14} /> Add Role
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(profile.experience || []).map((exp) => (
                  <div key={exp.id} style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      style={{ position: 'absolute', top: 12, right: 12, color: 'var(--accent-danger)' }}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 10 }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Job Title</label>
                        <input
                          type="text"
                          className="search-input"
                          style={{ paddingLeft: 10, marginTop: 4 }}
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Company</label>
                        <input
                          type="text"
                          className="search-input"
                          style={{ paddingLeft: 10, marginTop: 4 }}
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Dates / Duration</label>
                        <input
                          type="text"
                          className="search-input"
                          style={{ paddingLeft: 10, marginTop: 4 }}
                          value={exp.dates}
                          onChange={(e) => updateExperience(exp.id, 'dates', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Key Responsibilities & Deliverables</label>
                      <textarea
                        className="search-input"
                        rows={3}
                        style={{ paddingLeft: 10, marginTop: 4, height: 'auto' }}
                        value={exp.responsibilities}
                        onChange={(e) => updateExperience(exp.id, 'responsibilities', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SKILLS TAB */}
          {activeSubTab === 'skills' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {Object.entries(profile.skills || {}).map(([cat, list]) => (
                <div key={cat} style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
                    {cat}
                  </label>
                  <input
                    type="text"
                    className="search-input"
                    style={{ paddingLeft: 10, marginBottom: 8 }}
                    placeholder="Comma-separated skills..."
                    value={(list || []).join(', ')}
                    onChange={(e) => {
                      const updated = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      setProfile(p => ({
                        ...p,
                        skills: { ...p.skills, [cat]: updated }
                      }));
                    }}
                  />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {(list || []).map((sk, idx) => (
                      <span key={idx} className="tag-chip matched">{sk}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. PROJECTS TAB */}
          {activeSubTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>Key Analytics & Technical Projects</span>
                <button className="btn-tactile btn-outline btn-sm" onClick={addProject}>
                  <Plus size={14} /> Add Project
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(profile.projects || []).map((proj) => (
                  <div key={proj.id} style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                    <button
                      onClick={() => removeProject(proj.id)}
                      style={{ position: 'absolute', top: 12, right: 12, color: 'var(--accent-danger)' }}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Project Name</label>
                      <input
                        type="text"
                        className="search-input"
                        style={{ paddingLeft: 10, marginTop: 4 }}
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                      />
                    </div>

                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Description</label>
                      <textarea
                        className="search-input"
                        rows={2}
                        style={{ paddingLeft: 10, marginTop: 4, height: 'auto' }}
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Technologies / Tools (Comma-separated)</label>
                      <input
                        type="text"
                        className="search-input"
                        style={{ paddingLeft: 10, marginTop: 4 }}
                        value={(proj.technologies || []).join(', ')}
                        onChange={(e) => updateProject(proj.id, 'technologies', e.target.value.split(',').map(s => s.trim()))}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. CERTIFICATIONS TAB */}
          {activeSubTab === 'certifications' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  Professional Licenses, Accreditations & Certifications ({(profile.certifications || []).length})
                </span>
                <button className="btn-tactile btn-outline btn-sm" onClick={addCertification}>
                  <Plus size={14} /> Add Certification
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(profile.certifications || []).map((cert) => (
                  <div key={cert.id} style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                    <button
                      onClick={() => removeCertification(cert.id)}
                      style={{ position: 'absolute', top: 12, right: 12, color: 'var(--accent-danger)' }}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Certification Name</label>
                        <input
                          type="text"
                          className="search-input"
                          style={{ paddingLeft: 10, marginTop: 4 }}
                          value={cert.name}
                          onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Issuing Organization</label>
                        <input
                          type="text"
                          className="search-input"
                          style={{ paddingLeft: 10, marginTop: 4 }}
                          value={cert.issuingOrg}
                          onChange={(e) => updateCertification(cert.id, 'issuingOrg', e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Issue Date / Year</label>
                        <input
                          type="text"
                          className="search-input"
                          style={{ paddingLeft: 10, marginTop: 4 }}
                          value={cert.date}
                          onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {(!profile.certifications || profile.certifications.length === 0) && (
                  <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    No certifications added yet. Upload your resume or click "Add Certification" above.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7. PREFERENCES TAB */}
          {activeSubTab === 'preferences' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Desired Job Titles (Comma-separated)
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ paddingLeft: 14 }}
                  value={(profile.preferences?.desiredTitles || []).join(', ')}
                  onChange={(e) => handlePreferencesChange('desiredTitles', e.target.value.split(',').map(s => s.trim()))}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Preferred Companies (Comma-separated)
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ paddingLeft: 14 }}
                  value={(profile.preferences?.preferredCompanies || []).join(', ')}
                  onChange={(e) => handlePreferencesChange('preferredCompanies', e.target.value.split(',').map(s => s.trim()))}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Salary Expectation
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ paddingLeft: 14 }}
                  value={profile.preferences?.salaryExpectation || ''}
                  onChange={(e) => handlePreferencesChange('salaryExpectation', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Priority Keywords
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ paddingLeft: 14 }}
                  value={(profile.preferences?.priorityKeywords || []).join(', ')}
                  onChange={(e) => handlePreferencesChange('priorityKeywords', e.target.value.split(',').map(s => s.trim()))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
