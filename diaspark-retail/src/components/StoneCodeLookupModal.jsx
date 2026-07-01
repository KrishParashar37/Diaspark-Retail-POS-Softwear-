import React, { useState, useEffect } from 'react';
import './StoneCodeLookupModal.css';

function StoneCodeLookupModal({ onClose, onSelect }) {
  const [stoneCodes, setStoneCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({
    code: '',
    stoneType: '',
    color: ''
  });
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetchStoneCodes();
  }, []);

  const fetchStoneCodes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(search);
      const response = await fetch(`http://localhost:5001/api/stonecodes?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setStoneCodes(data);
      }
    } catch (err) {
      console.error("Error fetching stone codes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearch(prev => ({ ...prev, [name]: value }));
  };

  // Debounce the search or just search on every change? The screenshot doesn't show a search button,
  // just input boxes at the top of the columns. Let's do it on every keystroke with a small debounce, 
  // or just attach it to an Enter keypress, but calling it directly is fine for mock.
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStoneCodes();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleSelect = () => {
    if (selectedRow !== null && onSelect) {
      onSelect(stoneCodes[selectedRow]);
    }
    onClose();
  };

  const handleRowClick = (index) => {
    setSelectedRow(index);
  };

  const handleDoubleClick = (index) => {
    setSelectedRow(index);
    if (onSelect) {
      onSelect(stoneCodes[index]);
    }
    onClose();
  };

  return (
    <div className="stone-modal-overlay">
      <div className="stone-lookup-modal">
        <div className="stone-modal-header">
          <span>Stone Code Lookup</span>
          <button className="stone-close-btn" onClick={onClose} title="Close">&times;</button>
        </div>
        
        <div className="stone-content-container">
          <div className="stone-grid-container">
            {/* Filter Inputs Row */}
            <div className="stone-filter-row">
              <input type="text" name="code" value={search.code} onChange={handleInputChange} className="stone-filter-input" style={{width: '33.33%'}} />
              <input type="text" name="stoneType" value={search.stoneType} onChange={handleInputChange} className="stone-filter-input" style={{width: '33.33%'}} />
              <input type="text" name="color" value={search.color} onChange={handleInputChange} className="stone-filter-input" style={{width: '33.33%'}} />
            </div>

            <div className="stone-grid-header">
              <div className="stone-col" style={{width: '33.33%'}}>Code</div>
              <div className="stone-col" style={{width: '33.33%'}}>Stone Type</div>
              <div className="stone-col" style={{width: '33.33%'}}>Color</div>
            </div>
            
            <div className="stone-grid-body">
              {stoneCodes.length > 0 ? (
                stoneCodes.map((s, index) => (
                  <div 
                    key={index} 
                    className={`stone-grid-row ${selectedRow === index ? 'selected' : ''}`}
                    onClick={() => handleRowClick(index)}
                    onDoubleClick={() => handleDoubleClick(index)}
                  >
                    <div className="stone-col" style={{width: '33.33%'}}>{s.code}</div>
                    <div className="stone-col" style={{width: '33.33%'}}>{s.stoneType}</div>
                    <div className="stone-col" style={{width: '33.33%'}}>{s.color}</div>
                  </div>
                ))
              ) : (
                <div className="stone-grid-row" style={{justifyContent: 'center', color: '#999'}}>
                  {loading ? 'Loading...' : 'No stone codes found.'}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="stone-modal-footer">
          <button className="stone-action-btn stone-select-btn" onClick={handleSelect}>Select</button>
          <button className="stone-action-btn stone-cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default StoneCodeLookupModal;
