import React, { useState } from 'react';
import './LaborLookupModal.css';

const LaborLookupModal = ({ onClose, onSelect }) => {
  const [selectedRow, setSelectedRow] = useState(0);
  const [laborItems, setLaborItems] = useState([]);
  
  React.useEffect(() => {
    fetch('http://localhost:5001/api/labor')
      .then(res => res.json())
      .then(data => setLaborItems(data))
      .catch(err => console.error("Error fetching labor:", err));
  }, []);
  
  const [filters, setFilters] = useState({ laborNum: '', desc: '', price: '' });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredLabor = laborItems.filter(row => {
    return (
      String(row.laborNum).toLowerCase().includes(filters.laborNum.toLowerCase()) &&
      String(row.desc).toLowerCase().includes(filters.desc.toLowerCase()) &&
      String(row.price).toLowerCase().includes(filters.price.toLowerCase())
    );
  });

  const handleSelect = () => {
    if (filteredLabor[selectedRow]) {
      if (typeof onSelect === 'function') {
        onSelect(filteredLabor[selectedRow]);
      } else {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="labor-modal-overlay">
      <div className="labor-modal">
        <div className="labor-header">
          <span>Labor</span>
          <button className="close-btn" onClick={onClose}>x</button>
        </div>

        <div className="labor-body">
          <div className="labor-grid-container">
            <table className="labor-table">
              <thead>
                <tr className="filter-row">
                  <th><input type="text" className="grid-filter-input" value={filters.laborNum} onChange={(e) => handleFilterChange('laborNum', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.desc} onChange={(e) => handleFilterChange('desc', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.price} onChange={(e) => handleFilterChange('price', e.target.value)} /></th>
                </tr>
                <tr>
                  <th style={{ width: '25%' }}>Labor #</th>
                  <th style={{ width: '55%' }}>Description</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredLabor.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={selectedRow === idx ? 'selected' : ''}
                    onClick={() => setSelectedRow(idx)}
                    onDoubleClick={() => {
                      if (typeof onSelect === 'function') onSelect(row);
                    }}
                  >
                    <td>{row.laborNum}</td>
                    <td>{row.desc}</td>
                    <td className="right-align">{row.price}</td>
                  </tr>
                ))}
                {/* Empty rows to match the screenshot layout */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr key={`empty-${i}`} style={{ height: '22px' }}>
                    <td></td>
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

export default LaborLookupModal;
