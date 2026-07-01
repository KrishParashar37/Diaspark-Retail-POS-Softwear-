import React, { useState, useEffect } from 'react';
import './SalespersonModal.css';
import SalesPeopleLookupModal from './SalesPeopleLookupModal';

function SalespersonModal({ onClose, onSelect }) {
  const [salespersons, setSalespersons] = useState([]);
  const [rows, setRows] = useState([
    { name: '', pct: '0.00' },
    { name: '', pct: '0.00' },
    { name: '', pct: '0.00' },
    { name: '', pct: '0.00' },
    { name: '', pct: '0.00' },
  ]);
  const [showLookup, setShowLookup] = useState(false);
  const [selectedLookupRow, setSelectedLookupRow] = useState(null);
  const [activeRowIndex, setActiveRowIndex] = useState(0);

  // Fetch salespersons from backend
  useEffect(() => {
    const fetchSalespersons = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/salespersons');
        if (response.ok) {
          const data = await response.json();
          setSalespersons(data);
        }
      } catch (err) {
        console.error("Error fetching salespersons:", err);
      }
    };
    fetchSalespersons();
  }, []);

  const handleOpenLookup = () => {
    setShowLookup(true);
  };

  const recalculatePercentages = (currentRows) => {
    const activeRows = currentRows.filter(r => r.name && r.name.trim() !== '');
    const numActive = activeRows.length;
    
    if (numActive === 0) {
      return currentRows.map(r => ({ ...r, pct: '0.00' }));
    }
    
    const splitPct = Math.floor(10000 / numActive) / 100;
    let remaining = 100;
    let activeSeen = 0;
    
    return currentRows.map((r) => {
      if (!r.name || r.name.trim() === '') {
        return { ...r, pct: '0.00' };
      }
      
      activeSeen++;
      if (activeSeen === numActive) {
        return { ...r, pct: remaining.toFixed(2) };
      } else {
        remaining -= splitPct;
        return { ...r, pct: splitPct.toFixed(2) };
      }
    });
  };

  const handleSelectFromLookup = (selectedSalespersons) => {
    let newRows = [...rows];
    
    // selectedSalespersons is now an array from the new multi-select lookup
    let currentFillIndex = activeRowIndex;
    
    selectedSalespersons.forEach(sp => {
      // Find the next empty row starting from currentFillIndex if the current is taken by a previous iteration
      while (currentFillIndex < 5 && newRows[currentFillIndex].name && newRows[currentFillIndex].name.trim() !== '') {
        currentFillIndex++;
      }
      
      // If we still have room, add the salesperson
      if (currentFillIndex < 5) {
        newRows[currentFillIndex] = { name: `${sp.name}(${sp.code})`, pct: '0.00' };
        currentFillIndex++;
      }
    });

    newRows = recalculatePercentages(newRows);
    setRows(newRows);
    setShowLookup(false);
  };

  const handleRowNameChange = (index, value) => {
    let newRows = [...rows];
    newRows[index] = { ...newRows[index], name: value };
    newRows = recalculatePercentages(newRows);
    setRows(newRows);
  };

  const handlePctChange = (index, value) => {
    // Allow digits and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      let newRows = [...rows];
      newRows[index] = { ...newRows[index], pct: value };
      setRows(newRows);
    }
  };

  const handleClearRow = (index) => {
    let newRows = [...rows];
    newRows[index] = { name: '', pct: '0.00' };
    newRows = recalculatePercentages(newRows);
    setRows(newRows);
  };

  const totalShare = rows.reduce((sum, r) => sum + parseFloat(r.pct || 0), 0).toFixed(2);

  const handleSelect = () => {
    const selectedSalespersons = rows.filter(r => r.name);
    
    if (selectedSalespersons.length > 0) {
      if (totalShare !== '100.00') {
        alert("Total Share must be exactly 100.00%");
        return;
      }
      onSelect(selectedSalespersons);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="salesperson-modal">
        {/* Header */}
        <div className="modal-header">
          <span>Salesperson</span>
          <button className="close-btn" onClick={onClose} title="Close">&times;</button>
        </div>
        
        <div className="salesperson-modal-body">
          <button className="open-lookup-btn" onClick={handleOpenLookup}>Open Lookup</button>
          
          <div className="salesperson-grid">
            <div className="sp-header-row">
              <span className="sp-col-name">Salesperson</span>
              <span className="sp-col-pct">(%)</span>
            </div>
            
            {rows.map((row, i) => (
              <div key={i} className="sp-input-row" onClick={() => setActiveRowIndex(i)} style={{ backgroundColor: activeRowIndex === i ? '#e8f4fd' : 'transparent' }}>
                <input type="text" className="sp-input-name" value={row.name} onChange={(e) => handleRowNameChange(i, e.target.value)} />
                <input type="text" className="sp-input-pct" value={row.pct} onChange={(e) => handlePctChange(i, e.target.value)} />
                <div className="sp-minus-icon" onClick={(e) => { e.stopPropagation(); handleClearRow(i); }} style={{ cursor: 'pointer' }}></div>
              </div>
            ))}
            
            <div className="sp-total-row">
              <span>Total Share(%)</span>
              <span>{totalShare}</span>
            </div>
          </div>

          {/* Separate Lookup Modal */}
          {showLookup && (
            <SalesPeopleLookupModal
              salespersons={salespersons}
              onClose={() => setShowLookup(false)}
              onSelect={handleSelectFromLookup}
            />
          )}
        </div>
        
        {/* Footer */}
        <div className="salesperson-modal-footer">
          <button className="modal-action-btn" onClick={handleSelect}>Select</button>
          <button className="modal-action-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default SalespersonModal;
