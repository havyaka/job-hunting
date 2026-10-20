// API Client utility for CareerPilot AI

const BASE_URL = '/api';

export const api = {
  async getCandidate() {
    const res = await fetch(`${BASE_URL}/candidate`);
    if (!res.ok) throw new Error('Failed to fetch candidate profile');
    return res.json();
  },

  async updateCandidate(profile) {
    const res = await fetch(`${BASE_URL}/candidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (!res.ok) throw new Error('Failed to save profile');
    return res.json();
  },

  async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await fetch(`${BASE_URL}/resume/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload resume');
    }
    return res.json();
  },

  async applyParsedResume(acceptedFields, parsedData) {
    const res = await fetch(`${BASE_URL}/resume/apply-parsed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acceptedFields, parsedData })
    });
    if (!res.ok) throw new Error('Failed to apply parsed resume data');
    return res.json();
  },

  async getSearchMatrix() {
    const res = await fetch(`${BASE_URL}/search/matrix`);
    if (!res.ok) throw new Error('Failed to fetch search matrix');
    return res.json();
  },

  async runSearch(candidate = null) {
    const res = await fetch(`${BASE_URL}/search/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate })
    });
    if (!res.ok) throw new Error('Failed to execute job discovery');
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${BASE_URL}/stats`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  async getSearchLogs() {
    const res = await fetch(`${BASE_URL}/search/logs`);
    if (!res.ok) throw new Error('Failed to fetch search logs');
    return res.json();
  },

  async getJobs(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, v);
      }
    });
    const res = await fetch(`${BASE_URL}/jobs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async getJob(id) {
    const res = await fetch(`${BASE_URL}/jobs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch job details');
    return res.json();
  },

  async verifyJob(id) {
    const res = await fetch(`${BASE_URL}/jobs/${id}/verify`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to verify job URL');
    return res.json();
  },

  async getMatchAnalysis(id) {
    const res = await fetch(`${BASE_URL}/jobs/${id}/match-analysis`);
    if (!res.ok) throw new Error('Failed to fetch match analysis');
    return res.json();
  },

  async getResumeOptimization(id) {
    const res = await fetch(`${BASE_URL}/jobs/${id}/optimize-resume`);
    if (!res.ok) throw new Error('Failed to fetch resume optimization');
    return res.json();
  },

  async getApplications() {
    const res = await fetch(`${BASE_URL}/applications`);
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },

  async saveApplication(appData) {
    const res = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    });
    if (!res.ok) throw new Error('Failed to save application');
    return res.json();
  },

  async deleteApplication(id) {
    const res = await fetch(`${BASE_URL}/applications/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete application');
    return res.json();
  }
};
