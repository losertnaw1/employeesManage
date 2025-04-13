import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Employee } from '../types/employee';
import '../styles/SearchPage.css';

const SearchPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('fullNameVi');
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const [filteredResults, setFilteredResults] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    chineseLevel: '',
    educationLevel: '',
    mainWorkLocation: '',
    skills: ''
  });

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      chineseLevel: '',
      educationLevel: '',
      mainWorkLocation: '',
      skills: ''
    });
    // No need to manually set filteredResults here
    // The useEffect will trigger applyFilters when filters change
  }, []);

  // Define applyFilters function
  const applyFilters = useCallback(() => {
    let results = [...searchResults];

    // Apply Chinese level filter
    if (filters.chineseLevel) {
      results = results.filter(emp => emp.chineseLevel === filters.chineseLevel);
    }

    // Apply education level filter
    if (filters.educationLevel) {
      results = results.filter(emp => emp.educationLevel === filters.educationLevel);
    }

    // Apply work location filter
    if (filters.mainWorkLocation) {
      results = results.filter(emp => emp.mainWorkLocation === filters.mainWorkLocation);
    }

    // Apply skills filter
    if (filters.skills) {
      results = results.filter(emp =>
        emp.skills.some(skill =>
          skill.toLowerCase().includes(filters.skills.toLowerCase())
        )
      );
    }

    setFilteredResults(results);
  }, [filters, searchResults]);

  // Handle search using API
  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the search API endpoint
      const response = await axios.get('http://localhost:5000/api/employees/search', {
        params: {
          field: searchField,
          term: searchTerm.trim()
        }
      });

      const results = response.data;
      setSearchResults(results);
      // No need to manually set filteredResults here
      // The useEffect will handle this when searchResults changes
      resetFilters(); // Reset filters when new search is performed
    } catch (err) {
      console.error('Error searching employees:', err);
      setError(t('searchError') || 'Error searching employees');
      setSearchResults([]);
      setFilteredResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, t, resetFilters, searchField]);

  // Apply filters whenever filters or searchResults change
  useEffect(() => {
    if (searchResults.length > 0) {
      applyFilters();
    }
  }, [searchResults, filters, applyFilters]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handle field change
  const handleFieldChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchField(e.target.value);
  }, []);

  // Handle key press (search on Enter)
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  // Handle filter change
  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // applyFilters and resetFilters functions have been moved to the top of the component

  // Toggle filters visibility
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  return (
    <div className="search-page">
      <h1 className="search-title">{t('searchEmployees')}</h1>

      <div className="search-container">
        <div className="search-controls">
          <select
            className="search-field-select"
            value={searchField}
            onChange={handleFieldChange}
          >
            <option value="fullNameVi">{t('fullNameVi')}</option>
            <option value="fullNameCn">{t('fullNameCn')}</option>
            <option value="phoneNumber">{t('phoneNumber')}</option>
            <option value="mainWorkLocation">{t('mainWorkLocation')}</option>
            <option value="chineseLevel">{t('chineseLevel')}</option>
            <option value="educationLevel">{t('educationLevel')}</option>
            <option value="skills">{t('skills')}</option>
            <option value="previousProjects">{t('previousProjects')}</option>
          </select>

          <div className="search-input-container">
            <input
              type="text"
              className="search-input"
              placeholder={t('searchPlaceholder') || 'Search...'}
              value={searchTerm}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button
              className="search-button"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? t('searching') || 'Searching...' : t('search') || 'Search'}
            </button>
          </div>

          <button
            className="filter-toggle-button"
            onClick={toggleFilters}
          >
            {showFilters ? t('hideFilters') || 'Hide Filters' : t('showFilters') || 'Show Filters'}
          </button>
        </div>

        {/* Filters section */}
        {showFilters && (
          <div className="filters-container">
            <h3 className="filters-title">{t('filterResults') || 'Filter Results'}</h3>

            <div className="filters-grid">
              {/* Chinese Level Filter */}
              <div className="filter-group">
                <label htmlFor="chineseLevel">{t('chineseLevel')}:</label>
                <select
                  id="chineseLevel"
                  name="chineseLevel"
                  value={filters.chineseLevel}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">{t('all') || 'All'}</option>
                  <option value="HSK1">HSK1</option>
                  <option value="HSK2">HSK2</option>
                  <option value="HSK3">HSK3</option>
                  <option value="HSK4">HSK4</option>
                  <option value="HSK5">HSK5</option>
                  <option value="HSK6">HSK6</option>
                </select>
              </div>

              {/* Education Level Filter */}
              <div className="filter-group">
                <label htmlFor="educationLevel">{t('educationLevel')}:</label>
                <select
                  id="educationLevel"
                  name="educationLevel"
                  value={filters.educationLevel}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">{t('all') || 'All'}</option>
                  <option value="High School">{t('filterHighSchool') || 'High School'}</option>
                  <option value="College">{t('filterCollege') || 'College'}</option>
                  <option value="Bachelor">{t('filterBachelor') || 'Bachelor'}</option>
                  <option value="Master">{t('filterMaster') || 'Master'}</option>
                  <option value="PhD">{t('filterPhd') || 'PhD'}</option>
                </select>
              </div>

              {/* Work Location Filter */}
              <div className="filter-group">
                <label htmlFor="mainWorkLocation">{t('mainWorkLocation')}:</label>
                <select
                  id="mainWorkLocation"
                  name="mainWorkLocation"
                  value={filters.mainWorkLocation}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">{t('all') || 'All'}</option>
                  <option value="HCM">HCM</option>
                  <option value="Hanoi">Hanoi</option>
                  <option value="Da Nang">Da Nang</option>
                </select>
              </div>

              {/* Skills Filter */}
              <div className="filter-group">
                <label htmlFor="skills">{t('skills')}:</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={filters.skills}
                  onChange={handleFilterChange}
                  className="filter-input"
                  placeholder={t('enterSkills') || 'Enter skills...'}
                />
              </div>
            </div>

            <div className="filter-actions">
              <button
                className="reset-filters-button"
                onClick={resetFilters}
              >
                {t('resetFilters') || 'Reset Filters'}
              </button>
            </div>
          </div>
        )}

        {error && <div className="search-error">{error}</div>}

        {searchResults.length > 0 ? (
          <div className="search-results">
            <h2 className="results-title">
              {t('searchResults')} ({filteredResults.length}/{searchResults.length})
              {filteredResults.length !== searchResults.length && (
                <span className="filtered-indicator"> - {t('filtered') || 'Filtered'}</span>
              )}
            </h2>
            <div className="results-list">
              {filteredResults.map(employee => (
                <div key={employee._id} className="result-card">
                  <div className="result-header">
                    <h3 className="result-name">{employee.fullNameVi}</h3>
                    {employee.fullNameCn && <span className="result-name-cn">{employee.fullNameCn}</span>}
                  </div>

                  <div className="result-details">
                    <div className="result-detail">
                      <span className="detail-label">{t('phoneNumber')}:</span>
                      <span className="detail-value">{employee.phoneNumber || '-'}</span>
                    </div>

                    <div className="result-detail">
                      <span className="detail-label">{t('mainWorkLocation')}:</span>
                      <span className="detail-value">{employee.mainWorkLocation || '-'}</span>
                    </div>

                    <div className="result-detail">
                      <span className="detail-label">{t('chineseLevel')}:</span>
                      <span className="detail-value">{employee.chineseLevel || '-'}</span>
                    </div>

                    <div className="result-detail">
                      <span className="detail-label">{t('educationLevel')}:</span>
                      <span className="detail-value">{employee.educationLevel || '-'}</span>
                    </div>

                    {employee.skills && employee.skills.length > 0 && (
                      <div className="result-detail">
                        <span className="detail-label">{t('skills')}:</span>
                        <span className="detail-value">{employee.skills.join(', ')}</span>
                      </div>
                    )}

                    {employee.previousProjects && employee.previousProjects.length > 0 && (
                      <div className="result-detail">
                        <span className="detail-label">{t('previousProjects')}:</span>
                        <span className="detail-value">{employee.previousProjects.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="result-actions">
                    <button
                      className="view-button"
                      onClick={() => window.location.href = `/employees/edit/${employee._id}`}
                    >
                      {t('viewDetails')}
                    </button>

                    {employee.cvUrl && (
                      <button
                        className="download-cv-button"
                        onClick={async () => {
                          try {
                            const response = await axios.get(
                              `http://localhost:5000/api/employees/${employee._id}/download-cv`,
                              { responseType: 'blob' }
                            );

                            const blob = response.data;
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = employee.cvUrl?.split('/').pop() || 'cv.pdf';
                            document.body.appendChild(a);
                            a.click();

                            window.URL.revokeObjectURL(url);
                            document.body.removeChild(a);
                          } catch (err) {
                            console.error('Error downloading CV:', err);
                            alert(t('downloadError') || 'Failed to download CV');
                          }
                        }}
                      >
                        {t('downloadCV')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : searchTerm && !loading ? (
          <div className="no-results">
            <p>{t('noSearchResults')}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;
