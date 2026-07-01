import React, { useState } from 'react';
import './CategoryLookupModal.css';

const CategoryLookupModal = ({ onClose, onSelect }) => {
  const [dummyData, setDummyData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(0);
  const [filters, setFilters] = useState({ code: '', name: '' });
  const [filteredData, setFilteredData] = useState([]);

  React.useEffect(() => {
    fetch('http://localhost:5001/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDummyData(data);
          setFilteredData(data);
        } else if (data && Array.isArray(data.data)) {
          setDummyData(data.data);
          setFilteredData(data.data);
        } else {
          setDummyData([{code: 'POS', name: 'POS'}, {code: 'POSCV', name: 'POCCV'}]);
          setFilteredData([{code: 'POS', name: 'POS'}, {code: 'POSCV', name: 'POCCV'}]);
        }
      })
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  React.useEffect(() => {
    const filtered = dummyData.filter(row => {
      return (
        (row.code || '').toLowerCase().includes(filters.code.toLowerCase()) &&
        (row.name || '').toLowerCase().includes(filters.name.toLowerCase())
      );
    });
    setFilteredData(filtered);
  }, [filters, dummyData]);

  const handleSelect = () => {
    if (filteredData[selectedRow] && onSelect) {
      onSelect(filteredData[selectedRow]);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="category-lookup-modal">
        {/* Header */}
        <div className="modal-header">
          <span>Category Lookup</span>
          <button className="close-btn" onClick={onClose} title="Close">&times;</button>
        </div>
        
        {/* Grid Container */}
        <div className="category-grid-container">
          <table className="category-lookup-table">
            <thead>
              <tr className="filter-row">
                <th><input type="text" value={filters.code} onChange={(e) => setFilters({...filters, code: e.target.value})} style={{ width: '100%', boxSizing: 'border-box' }} /></th>
                <th><input type="text" value={filters.name} onChange={(e) => setFilters({...filters, name: e.target.value})} style={{ width: '100%', boxSizing: 'border-box' }} /></th>
              </tr>
              <tr className="header-row">
                <th style={{ width: '30%' }}>Code</th>
                <th style={{ width: '70%' }}>Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, i) => (
                <tr key={i} 
                    onClick={() => setSelectedRow(i)} 
                    onDoubleClick={() => {
                      if (onSelect) onSelect(filteredData[i]);
                      onClose();
                    }}
                    style={{ backgroundColor: selectedRow === i ? '#7bc0f7' : (i % 2 !== 0 ? '#fcfcfc' : 'white'), color: selectedRow === i ? 'white' : 'black', cursor: 'pointer' }}>
                  <td>{row.code}</td>
                  <td>{row.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="category-footer">
          <button className="category-action-btn" onClick={handleSelect}>Select</button>
          <button className="category-action-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CategoryLookupModal;
