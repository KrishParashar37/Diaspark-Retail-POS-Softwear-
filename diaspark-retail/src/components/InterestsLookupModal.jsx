import API_BASE_URL from '../config.js';
import React, { useState } from 'react';
import './DemographicLookupModal.css';

const InterestsLookupModal = ({ lookupType, onClose, onSelect }) => {
  const [dummyData, setDummyData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(0);
  const [filters, setFilters] = useState({ code: '', name: '' });
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    let endpoint = `${API_BASE_URL}/api/vendors`;
    if (lookupType?.includes('Type') || lookupType?.includes('Category')) {
      endpoint = `${API_BASE_URL}/api/categories`;
    } else if (lookupType?.includes('Brand')) {
      endpoint = `${API_BASE_URL}/api/vendors`;
    } else if (lookupType === 'Interests') {
      endpoint = `${API_BASE_URL}/api/interests`;
    }

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        let arr = [];
        if (Array.isArray(data)) arr = data;
        else if (data && Array.isArray(data.data)) arr = data.data;

        const standardized = arr.map(item => ({
          code: item.code || item.category_id || item.vendor_id || '',
          name: item.name || item.category_name || item.vendor_name || ''
        }));
        
        setDummyData(standardized);
        setFilteredData(standardized);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching lookup data:', err);
        setIsLoading(false);
      });
  }, [lookupType]);

  React.useEffect(() => {
    const filtered = dummyData.filter(row => {
      return (
        (row.code || '').toLowerCase().includes(filters.code.toLowerCase()) &&
        (row.name || '').toLowerCase().includes(filters.name.toLowerCase())
      );
    });
    setFilteredData(filtered);
    setSelectedRow(0);
  }, [filters, dummyData]);

  const handleSelect = () => {
    if (filteredData[selectedRow] && onSelect) {
      onSelect(filteredData[selectedRow]);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="demographic-lookup-modal">
        {/* Header */}
        <div className="modal-header">
          <span>{lookupType ? `${lookupType} Lookup` : 'Interests Lookup'}</span>
          <button className="close-btn" onClick={onClose} title="Close">&times;</button>
        </div>
        
        {/* Grid Container */}
        <div className="demographic-grid-container">
          <table className="demographic-lookup-table">
            <thead>
              <tr className="filter-row">
                <th style={{ width: '40px' }}></th>
                <th><input type="text" value={filters.code} onChange={(e) => setFilters({...filters, code: e.target.value})} style={{ width: '100%', boxSizing: 'border-box' }} /></th>
                <th><input type="text" value={filters.name} onChange={(e) => setFilters({...filters, name: e.target.value})} style={{ width: '100%', boxSizing: 'border-box' }} /></th>
              </tr>
              <tr className="header-row">
                <th style={{ width: '40px', textAlign: 'center' }}>Select</th>
                <th style={{ width: '30%' }}>Code</th>
                <th style={{ width: '70%' }}>Name</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>Loading data...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>No records found.</td>
                </tr>
              ) : (
                filteredData.map((row, i) => (
                <tr key={i} 
                    onClick={() => setSelectedRow(i)} 
                    onDoubleClick={() => {
                      if (onSelect) onSelect(filteredData[i]);
                      onClose();
                    }}
                    style={{ backgroundColor: selectedRow === i ? '#7bc0f7' : (i % 2 !== 0 ? '#fcfcfc' : 'white'), color: selectedRow === i ? 'white' : 'black', cursor: 'pointer' }}>
                  <td style={{ textAlign: 'center' }}>
                    {selectedRow === i ? 'Y' : ''}
                  </td>
                  <td>{row.code}</td>
                  <td>{row.name}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="demographic-footer">
          <button className="demographic-action-btn" onClick={handleSelect}>Select</button>
          <button className="demographic-action-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default InterestsLookupModal;
