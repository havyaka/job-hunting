import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Check, 
  GraduationCap, 
  Briefcase, 
  FolderKanban, 
  Wrench, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  User 
} from 'lucide-react';
import { api } from '../utils/api.js';

export default function ResumeUploader({ candidate, onProfileUpdated }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [acceptedFields, setAcceptedFields] = useState({
    name: true,
    email: true,
    phone: true,
    location: true,
    education: true,
    experience: true,
    skills: true,
    projects: true,
    certifications: true
  });
  const [applying, setApplying] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    setUploading(true);
    setUploadResult(null);
    setSuccessMsg('');
    try {
      const res = await api.uploadResume(file);
      setUploadResult(res);
      setAcceptedFields({
        name: true,
        email: true,
        phone: true,
        location: true,
        education: true,
        experience: true,
        skills: true,
        projects: true,
        certifications: true
      });
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleApplyParsed = async () => {
    if (!uploadResult?.parsedData) return;
    setApplying(true);
    try {
      const res = await api.applyParsedResume(acceptedFields, uploadResult.parsedData);
      setSuccessMsg('Resume parsed information successfully saved to your candidate profile!');
      if (onProfileUpdated) onProfileUpdated(res.candidate);
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    } finally {
      setApplying(false);
    }
  };

  const toggleField = (field) => {
    setAcceptedFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const pData = uploadResult?.parsedData;

  return (
    <div style={{ maxWidth: 1050, margin: '0 auto' }}>
      <div className="glass-card" style={{ marginBottom: 24 }}>
        <div className="glass-card-header">
          <div>
            <h3>Upload & Parse Candidate Resume</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
              Upload your resume (PDF, DOCX, TXT) to automatically extract your personal details, education, skills, work experience/internships, projects, and certifications.
            </p>
          </div>
        </div>

        <div className="glass-card-body">
          {/* Drag & Drop Area */}
          <div
            className={`dropzone ${isDragging ? 'active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,.txt"
              style={{ display: 'none' }}
              id="resume-file-input"
            />

            {uploading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <Loader2 size={36} className="spin-icon" style={{ color: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }} />
                <div style={{ fontWeight: 600 }}>Extracting entities and parsing resume sections...</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Classifying degrees, internships, technical skills & projects</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                  <UploadCloud size={28} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                  Click to select or drag and drop your resume here
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Supports PDF, DOCX, DOC, TXT (Auto-extracts Education, Internships, Skills & Projects)
                </div>
                {candidate?.resumeFileName && (
                  <div style={{ marginTop: 8, fontSize: '0.82rem', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileText size={14} />
                    Active File: <strong>{candidate.resumeFileName}</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Success Notification */}
          {successMsg && (
            <div style={{ marginTop: 18, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', padding: 14, display: 'flex', alignItems: 'center', gap: 10, color: '#34D399', fontSize: '0.9rem' }}>
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Parsed Results Overview */}
          {pData && (
            <div style={{ marginTop: 24, borderTop: '1px solid var(--border-subtle)', paddingTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Extracted Resume Profile</h4>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    File: <strong style={{ color: 'var(--text-primary)' }}>{uploadResult.fileName}</strong> • Parser Quality Score: <strong style={{ color: '#34D399' }}>{pData.confidenceScore}%</strong>
                  </div>
                </div>

                <button
                  className="btn-tactile btn-primary btn-sm"
                  onClick={handleApplyParsed}
                  disabled={applying}
                  id="btn-apply-parsed-resume"
                  style={{ padding: '10px 18px', fontSize: '0.9rem' }}
                >
                  {applying ? (
                    <>
                      <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Updating Candidate Profile...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Apply All Resume Details to Profile</span>
                    </>
                  )}
                </button>
              </div>

              {/* Side-by-Side Conflict Detection Card */}
              {uploadResult.conflicts && uploadResult.conflicts.length > 0 && (
                <div className="conflict-card" style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#FBBF24', fontWeight: 700, fontSize: '0.9rem', marginBottom: 8 }}>
                    <AlertTriangle size={18} />
                    <span>Profile Differences Detected</span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                    Your uploaded resume details differ from the existing profile form. Choose whether to update with resume values:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {uploadResult.conflicts.map((conf, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-card)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem', flexWrap: 'wrap', gap: 8 }}>
                        <div>
                          <strong>{conf.field}:</strong>
                          <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>Existing:</span>
                          <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)' }}>{conf.existingValue}</span>
                          <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>→ Resume:</span>
                          <span style={{ color: '#34D399', fontWeight: 700 }}>{conf.resumeValue}</span>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                          <input
                            type="checkbox"
                            checked={acceptedFields[conf.field.toLowerCase()] ?? true}
                            onChange={() => toggleField(conf.field.toLowerCase())}
                          />
                          <span>Update with resume</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 1: PERSONAL & CONTACT */}
              <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-info)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <User size={14} /> Personal Details
                  </span>
                  <label style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={acceptedFields.name && acceptedFields.email}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setAcceptedFields(p => ({ ...p, name: checked, email: checked, phone: checked, location: checked }));
                      }}
                    />
                    Include in profile
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, fontSize: '0.86rem' }}>
                  <div><strong>Name:</strong> {pData.name || 'Not detected'}</div>
                  <div><strong>Email:</strong> {pData.email || 'Not detected'}</div>
                  <div><strong>Phone:</strong> {pData.phone || 'Not detected'}</div>
                  <div><strong>Location:</strong> {pData.detectedLocation || 'Not detected'}</div>
                </div>
              </div>

              {/* SECTION 2: EDUCATION HISTORY */}
              <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#818CF8', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <GraduationCap size={15} /> Education History ({pData.education?.length || 0} Qualifications)
                  </span>
                  <label style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={acceptedFields.education}
                      onChange={() => toggleField('education')}
                    />
                    Include Education
                  </label>
                </div>

                {pData.education && pData.education.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {pData.education.map((edu, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-card)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <strong style={{ fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                              {edu.degree} {edu.specialization ? `in ${edu.specialization}` : ''}
                            </strong>
                            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                              {edu.university}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span className="badge badge-official" style={{ fontSize: '0.7rem' }}>
                              {edu.status}
                            </span>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                              {edu.graduationYear}
                            </div>
                          </div>
                        </div>
                        {edu.achievements && (
                          <div style={{ marginTop: 6, fontSize: '0.8rem', color: '#34D399', fontWeight: 600 }}>
                            Score: {edu.achievements}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>No education history detected.</div>
                )}
              </div>

              {/* SECTION 3: WORK EXPERIENCE & INTERNSHIPS */}
              <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#34D399', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Briefcase size={15} /> Work Experience & Internships ({pData.experience?.length || 0} Positions)
                  </span>
                  <label style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={acceptedFields.experience}
                      onChange={() => toggleField('experience')}
                    />
                    Include Experience
                  </label>
                </div>

                {pData.experience && pData.experience.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {pData.experience.map((exp, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-card)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <strong style={{ fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                              {exp.title}
                            </strong>
                            <div style={{ fontSize: '0.84rem', color: 'var(--accent-primary)', marginTop: 2, fontWeight: 600 }}>
                              {exp.company} {exp.location ? `• ${exp.location}` : ''}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {exp.dates}
                          </span>
                        </div>
                        {exp.responsibilities && (
                          <div style={{ marginTop: 8, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                            {exp.responsibilities}
                          </div>
                        )}
                        {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                            {exp.skillsUsed.map((sk, sIdx) => (
                              <span key={sIdx} className="tag-chip matched" style={{ fontSize: '0.68rem' }}>{sk}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>No work experience detected.</div>
                )}
              </div>

              {/* SECTION 4: KEY PROJECTS */}
              <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#FBBF24', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FolderKanban size={15} /> Key Technical Projects ({pData.projects?.length || 0} Projects)
                  </span>
                  <label style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={acceptedFields.projects}
                      onChange={() => toggleField('projects')}
                    />
                    Include Projects
                  </label>
                </div>

                {pData.projects && pData.projects.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {pData.projects.map((proj, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-card)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                          {proj.name}
                        </strong>
                        {proj.description && (
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.45 }}>
                            {proj.description}
                          </p>
                        )}
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                            {proj.technologies.map((t, tIdx) => (
                              <span key={tIdx} className="tag-chip" style={{ fontSize: '0.68rem', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8' }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>No projects detected.</div>
                )}
              </div>

              {/* SECTION 5: CATEGORIZED SKILLS */}
              <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-info)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Wrench size={15} /> Categorized Skills ({Object.values(pData.skills || {}).flat().length} Skills Detected)
                  </span>
                  <label style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={acceptedFields.skills}
                      onChange={() => toggleField('skills')}
                    />
                    Include Skills
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                  {Object.entries(pData.skills || {}).map(([cat, list]) => {
                    if (!list || list.length === 0) return null;
                    return (
                      <div key={cat} style={{ background: 'var(--bg-card)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6 }}>
                          {cat} ({list.length})
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {list.map((sk, sIdx) => (
                            <span key={sIdx} className="tag-chip matched" style={{ fontSize: '0.7rem' }}>
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 6: CERTIFICATIONS */}
              <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#C084FC', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Award size={15} /> Certifications & Credentials ({pData.certifications?.length || 0} Records)
                  </span>
                  <label style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={acceptedFields.certifications}
                      onChange={() => toggleField('certifications')}
                    />
                    Include Certifications
                  </label>
                </div>

                {pData.certifications && pData.certifications.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
                    {pData.certifications.map((c, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-card)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <strong style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                          {c.name}
                        </strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', marginTop: 2 }}>
                          {c.issuingOrg} {c.date ? `• ${c.date}` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>No certifications detected.</div>
                )}
              </div>

              {/* Bottom Big CTA */}
              <div style={{ textAlign: 'center', paddingTop: 8 }}>
                <button
                  className="btn-tactile btn-primary btn-lg"
                  onClick={handleApplyParsed}
                  disabled={applying}
                  style={{ minWidth: 280 }}
                >
                  {applying ? (
                    <>
                      <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Updating Candidate Profile...</span>
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      <span>Apply All Resume Details to Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
