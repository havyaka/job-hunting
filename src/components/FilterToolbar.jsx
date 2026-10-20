import React from 'react';
import { Search, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';

export default function FilterToolbar({ filters, setFilters, onReset }) {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="filter-toolbar">
      <div className="filter-row-top">
        <div className="search-input-wrap">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by job title, company, skills (e.g. Power BI, SQL), location..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            id="filter-search-input"
          />
        </div>

        <select
          className="select-filter"
          value={filters.minScore || ''}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '90') setFilters(p => ({ ...p, minScore: '90', maxScore: '' }));
            else if (val === '80') setFilters(p => ({ ...p, minScore: '80', maxScore: '89' }));
            else if (val === '70') setFilters(p => ({ ...p, minScore: '70', maxScore: '79' }));
            else if (val === 'below70') setFilters(p => ({ ...p, minScore: '', maxScore: '69' }));
            else setFilters(p => ({ ...p, minScore: '', maxScore: '' }));
          }}
          id="filter-match-score"
        >
          <option value="">All Match Scores</option>
          <option value="90">90% – 100% (High Alignment)</option>
          <option value="80">80% – 89% (Strong Fit)</option>
          <option value="70">70% – 79% (Good Match)</option>
          <option value="below70">Below 70% (Possible Match)</option>
        </select>

        <select
          className="select-filter"
          value={filters.location || 'all'}
          onChange={(e) => handleChange('location', e.target.value)}
          id="filter-location"
        >
          <option value="all">All Locations</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Pune">Pune</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi NCR</option>
          <option value="Remote">Remote</option>
        </select>

        <select
          className="select-filter"
          value={filters.experience || 'all'}
          onChange={(e) => handleChange('experience', e.target.value)}
          id="filter-experience"
        >
          <option value="all">All Experience Levels</option>
          <option value="fresher">Fresher / Graduate</option>
          <option value="0–1">0–1 years</option>
          <option value="0–2">0–2 years</option>
          <option value="3">3+ years</option>
        </select>

        <select
          className="select-filter"
          value={filters.workMode || 'all'}
          onChange={(e) => handleChange('workMode', e.target.value)}
          id="filter-work-mode"
        >
          <option value="all">All Work Modes</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>

        <select
          className="select-filter"
          value={filters.sortBy || 'match_score_desc'}
          onChange={(e) => handleChange('sortBy', e.target.value)}
          id="filter-sort-by"
        >
          <option value="match_score_desc">Sort: Highest Match Score</option>
          <option value="newest">Sort: Recently Posted</option>
          <option value="company_asc">Sort: Company (A–Z)</option>
          <option value="title_asc">Sort: Job Title (A–Z)</option>
        </select>

        <button
          className="btn-tactile btn-outline btn-sm"
          onClick={onReset}
          title="Reset all filters"
          id="btn-reset-filters"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
