import React, { useState } from 'react';
import './LaborLookupModal.css';

const LaborGroupLookupModal = ({ onClose, onSelect }) => {
  const [selectedRow, setSelectedRow] = useState(0);
  const [laborGroups, setLaborGroups] = useState([]);

  React.useEffect(() => {
    fetch('http://localhost:5001/api/labor')
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        const mapped = data.map(item => ({ groupNum: item.laborNum, name: item.desc }));
        setLaborGroups(mapped);
      })
      .catch(err => console.error("Error fetching labor groups:", err));
  }, []);

  const [filters, setFilters] = useState({ groupNum: '', name: '' });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredGroups = laborGroups.filter(row => {
    return (
      String(row.groupNum).toLowerCase().includes(filters.groupNum.toLowerCase()) &&
      String(row.name).toLowerCase().includes(filters.name.toLowerCase())
    );
  });

  const handleSelect = () => {
    if (filteredGroups[selectedRow]) {
      onSelect(filteredGroups[selectedRow]);
    } else {
      onClose();
    }
  };

  return (
    <div className="labor-modal-overlay">
      <div className="labor-modal">
        <div className="labor-header">
          <span>Labor Group</span>
          <button className="close-btn" onClick={onClose}>x</button>
        </div>

        <div className="labor-body">
          <div className="labor-grid-container">
            <table className="labor-table">
              <thead>
                <tr className="filter-row">
                  <th><input type="text" className="grid-filter-input" value={filters.groupNum} onChange={(e) => handleFilterChange('groupNum', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.name} onChange={(e) => handleFilterChange('name', e.target.value)} /></th>
                </tr>
                <tr>
                  <th style={{ width: '30%' }}>Group #</th>
                  <th style={{ width: '70%' }}>Name</th>
                </tr>
              </thead>
              <tbody>
                {filteredGroups.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={selectedRow === idx ? 'selected' : ''}
                    onClick={() => setSelectedRow(idx)}
                    onDoubleClick={() => {
                      onSelect(row);
                    }}
                  >
                    <td>{row.groupNum}</td>
                    <td>{row.name}</td>
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

export default LaborGroupLookupModal;
