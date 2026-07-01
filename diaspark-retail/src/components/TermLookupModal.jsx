import API_BASE_URL from '../config.js';
import React, { useState } from 'react';
import './TermLookupModal.css';

function TermLookupModal({ onClose, onSelect }) {
  const [selectedRow, setSelectedRow] = useState(0);
  const [filters, setFilters] = useState({ code: '', name: '' });
  const [MOCK_TERMS, setTerms] = useState([]);
  
  React.useEffect(() => {
    fetch(`${API_BASE_URL}/api/terms`)
      .then(res => res.json())
      .then(data => setTerms(data))
      .catch(err => console.error("Failed to fetch terms:", err));
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const filteredData = MOCK_TERMS.filter(r => 
    r.code.toLowerCase().includes(filters.code.toLowerCase()) &&
    r.name.toLowerCase().includes(filters.name.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedRow !== null && onSelect && filteredData[selectedRow]) {
      onSelect(filteredData[selectedRow].code);
    }
    onClose();
  };

  const displayRows = [...filteredData];
  while (displayRows.length < 10) {
    displayRows.push(null);
  }

  return (
    <div className="term-modal-overlay">
      <div className="term-modal-container">
        <div className="term-modal-header">
          <span>Term Lookup</span>
          <button className="term-close-btn" onClick={onClose} title="Close">&times;</button>
        </div>
        
        <div className="term-search-row">
          <input type="text" className="term-search-input" style={{width: '50%'}} value={filters.code} onChange={(e) => handleFilterChange('code', e.target.value)} />
          <input type="text" className="term-search-input" style={{width: '50%'}} value={filters.name} onChange={(e) => handleFilterChange('name', e.target.value)} />
        </div>
        
        <div className="term-grid-container">
          <table className="term-lookup-table">
            <thead>
              <tr>
                <th style={{width: '50%'}}>Code</th>
                <th style={{width: '50%'}}>Name</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row, i) => (
                <tr key={i} 
                    onClick={() => row && setSelectedRow(i)} 
                    onDoubleClick={() => { if(row){ setSelectedRow(i); handleSelect(); } }}
                    style={{ backgroundColor: selectedRow === i && row ? '#73c3fa' : (i % 2 !== 0 ? '#fcfcfc' : 'white'), cursor: row ? 'pointer' : 'default' }}>
                  <td style={{width: '50%'}}>{row ? row.code : ''}</td>
                  <td style={{width: '50%'}}>{row ? row.name : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="term-modal-footer">
          <button className="term-action-btn" onClick={handleSelect}>Select</button>
          <button className="term-action-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default TermLookupModal;
