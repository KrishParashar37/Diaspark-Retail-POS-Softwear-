import React, { useState, useEffect } from 'react';
import './SalesPeopleLookupModal.css';

function SalesPeopleLookupModal({ onClose, onSelect, salespersons }) {
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [selectState, setSelectState] = useState({});
  const [primaryState, setPrimaryState] = useState({});

  const cycleState = (current) => {
    if (!current || current === '') return 'Y';
    if (current === 'Y') return 'N';
    return '';
  };

  const handleSelectClick = (i, e) => {
    e.stopPropagation();
    setHighlightedRow(i);
    setSelectState(prev => {
      const nextState = cycleState(prev[i]);
      if (nextState === 'Y') {
        const yCount = Object.values(prev).filter(val => val === 'Y').length;
        if (yCount >= 5) {
          alert("SalesPersons cannot be more than 5");
          return prev;
        }
      }
      return { ...prev, [i]: nextState };
    });
  };

  const handlePrimaryClick = (i, e) => {
    e.stopPropagation();
    setHighlightedRow(i);
    setPrimaryState(prev => {
      const nextState = cycleState(prev[i]);
      if (nextState === 'Y') {
        const newState = {};
        Object.keys(prev).forEach(k => {
          newState[k] = (k == i) ? 'Y' : (prev[k] === 'Y' ? 'N' : prev[k]);
        });
        newState[i] = 'Y';
        return newState;
      }
      return { ...prev, [i]: nextState };
    });
  };

  const handleSelect = () => {
    const selected = [];
    salespersons.forEach((sp, i) => {
      if (selectState[i] === 'Y') {
        selected.push(sp);
      }
    });

    if (selected.length > 0) {
      onSelect(selected);
    } else {
      alert("Please select at least one salesperson by setting them to 'Y'.");
    }
  };

  return (
    <div className="splookup-modal-overlay">
      <div className="splookup-modal">
        <div className="splookup-header">
          <span>SalesPeople Lookup</span>
          <button className="splookup-close-btn" onClick={onClose}>x</button>
        </div>
        
        <div className="splookup-body">
          <div className="splookup-controls">
            <label>All <input type="checkbox" defaultChecked /></label>
          </div>
          
          <div className="splookup-grid-container">
            <table className="splookup-table">
              <thead>
                <tr>
                  <th style={{width: '60px'}}>Select</th>
                  <th style={{width: '80px'}}>Code</th>
                  <th style={{width: '150px'}}>Name</th>
                  <th style={{width: '120px'}}>Store</th>
                  <th style={{width: '70px'}}>Primary</th>
                </tr>
              </thead>
              <tbody>
                {salespersons.map((sp, i) => (
                  <tr 
                    key={i} 
                    className={highlightedRow === i ? 'selected' : ''}
                    onClick={(e) => handleSelectClick(i, e)}
                    onDoubleClick={() => {
                      onSelect([sp]);
                    }}
                    style={{cursor: 'pointer'}}
                  >
                    <td style={{textAlign: 'center', fontWeight: 'bold'}}>
                      {selectState[i] || ''}
                    </td>
                    <td>{sp.code}</td>
                    <td>{sp.name}</td>
                    <td>{sp.store}</td>
                    <td 
                      style={{textAlign: 'center', fontWeight: 'bold'}}
                      onClick={(e) => handlePrimaryClick(i, e)}
                    >
                      {primaryState[i] || ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="splookup-footer">
          <button className="splookup-btn" onClick={handleSelect}>Select</button>
          <button className="splookup-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default SalesPeopleLookupModal;
