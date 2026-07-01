import React, { useState } from 'react';
import './LaborLookupModal.css';

const LaborCategoryLookupModal = ({ onClose, onSelect }) => {
  const [selectedRow, setSelectedRow] = useState(0);
  const [laborCategories, setLaborCategories] = useState([]);

  React.useEffect(() => {
    fetch('http://localhost:5001/api/labor')
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        const mapped = data.map(item => ({ categoryNum: item.laborNum, description: item.desc }));
        setLaborCategories(mapped);
      })
      .catch(err => console.error("Error fetching labor categories:", err));
  }, []);

  const [filters, setFilters] = useState({ categoryNum: '', description: '' });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredCategories = laborCategories.filter(row => {
    return (
      String(row.categoryNum).toLowerCase().includes(filters.categoryNum.toLowerCase()) &&
      String(row.description).toLowerCase().includes(filters.description.toLowerCase())
    );
  });

  const handleSelect = () => {
    if (filteredCategories[selectedRow]) {
      onSelect(filteredCategories[selectedRow]);
    } else {
      onClose();
    }
  };

  return (
    <div className="labor-modal-overlay">
      <div className="labor-modal">
        <div className="labor-header">
          <span>Labor Category</span>
          <button className="close-btn" onClick={onClose}>x</button>
        </div>

        <div className="labor-body">
          <div className="labor-grid-container">
            <table className="labor-table">
              <thead>
                <tr className="filter-row">
                  <th><input type="text" className="grid-filter-input" value={filters.categoryNum} onChange={(e) => handleFilterChange('categoryNum', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.description} onChange={(e) => handleFilterChange('description', e.target.value)} /></th>
                </tr>
                <tr>
                  <th style={{ width: '30%' }}>Category #</th>
                  <th style={{ width: '70%' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={selectedRow === idx ? 'selected' : ''}
                    onClick={() => setSelectedRow(idx)}
                    onDoubleClick={() => {
                      onSelect(row);
                    }}
                  >
                    <td>{row.categoryNum}</td>
                    <td>{row.description}</td>
                  </tr>
                ))}
                {/* Empty rows to match the screenshot layout */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr key={`empty-${i}`} style={{ height: '22px' }}>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="labor-footer">
          <button className="custom-action-btn primary" onClick={handleSelect}>Select</button>
          <button className="custom-action-btn primary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LaborCategoryLookupModal;
