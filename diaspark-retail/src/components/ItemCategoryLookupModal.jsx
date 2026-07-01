import API_BASE_URL from '../config.js';
import React, { useState, useEffect } from 'react';
import './ItemCategoryLookupModal.css';

function ItemCategoryLookupModal({ onClose, onSelect }) {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [searchName, setSearchName] = useState('');
  const [rowStates, setRowStates] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        setFilteredCategories(data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFind = () => {
    const filtered = categories.filter(cat => 
      cat.code.toLowerCase().includes(searchCode.toLowerCase()) &&
      cat.name.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredCategories(filtered);
    setRowStates({});
  };

  // Run filter once initially when categories load
  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  const handleSelect = () => {
    const selectedIndex = Object.keys(rowStates).find(index => rowStates[index] === 'Y');
    if (selectedIndex !== undefined && onSelect) {
      onSelect(filteredCategories[selectedIndex]);
    }
    onClose();
  };

  const handleRowClick = (index) => {
    setRowStates(prev => {
      const currentState = prev[index];
      let nextState;
      if (!currentState) nextState = 'Y';
      else if (currentState === 'Y') nextState = 'N';
      else nextState = '';
      
      return { ...prev, [index]: nextState };
    });
  };

  const handleDoubleClick = (index) => {
    if (onSelect) {
      onSelect(filteredCategories[index]);
    }
    onClose();
  };

  const handleNew = () => {
    alert("New Category functionality coming soon!");
  };

  const handleEdit = () => {
    alert("Edit Category functionality coming soon!");
  };

  return (
    <div className="cat-modal-overlay">
      <div className="cat-lookup-modal" style={{ width: '450px' }}>
        <div className="cat-modal-header" style={{ backgroundColor: '#e6e6e6', color: 'black', borderBottom: '1px solid #ccc' }}>
          <span style={{ fontWeight: 'bold' }}>ItemCategory</span>
          <button className="cat-close-btn" onClick={onClose} title="Close" style={{ color: 'black' }}>&times;</button>
        </div>
        
        <div style={{ padding: '10px', backgroundColor: '#fcfcfc' }}>
          <div className="cat-grid-container" style={{ border: '1px solid #ccc', backgroundColor: 'white' }}>
            
            {/* Filter Inputs Row */}
            <div className="cat-search-row" style={{ borderBottom: '1px solid #eee', padding: '5px', display: 'flex' }}>
              <input 
                type="text" 
                className="cat-search-input" 
                style={{ width: '20%', marginRight: '2%' }}
                disabled
              />
              <input 
                type="text" 
                value={searchCode} 
                onChange={e => setSearchCode(e.target.value)} 
                className="cat-search-input" 
                style={{ width: '38%', marginRight: '2%' }}
              />
              <input 
                type="text" 
                value={searchName} 
                onChange={e => setSearchName(e.target.value)} 
                className="cat-search-input" 
                style={{ width: '38%' }}
              />
            </div>

            <div className="cat-grid-header" style={{ display: 'flex', borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
              <div style={{ width: '20%', textAlign: 'center', color: 'blue' }}>Select</div>
              <div style={{ width: '40%', paddingLeft: '5px' }}>Code</div>
              <div style={{ width: '40%', paddingLeft: '5px' }}>Name</div>
            </div>
            
            <div className="cat-grid-body" style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((c, index) => {
                  const state = rowStates[index];
                  const isSelected = state === 'Y';
                  return (
                    <div 
                      key={index} 
                      style={{ 
                        display: 'flex', 
                        padding: '4px 0',
                        backgroundColor: isSelected ? '#55b5e6' : (index % 2 === 0 ? 'white' : '#f9f9f9'),
                        color: isSelected ? 'white' : 'black',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleRowClick(index)}
                      onDoubleClick={() => handleDoubleClick(index)}
                    >
                      <div style={{ width: '20%', textAlign: 'center' }}>
                        {state || ''}
                      </div>
                      <div style={{ width: '40%', paddingLeft: '5px' }}>{c.code}</div>
                      <div style={{ width: '40%', paddingLeft: '5px' }}>{c.name}</div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '10px', textAlign: 'center', color: '#999' }}>
                  No categories found.
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="cat-modal-footer" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#e6e6e6' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="custom-action-btn primary" onClick={handleSelect} style={{ padding: '5px 15px' }}>OK</button>
            <button className="custom-action-btn primary" onClick={onClose} style={{ padding: '5px 15px' }}>Cancel</button>
            <button className="custom-action-btn primary" onClick={handleNew} style={{ padding: '5px 15px' }}>New</button>
            <button className="custom-action-btn primary" onClick={handleEdit} style={{ padding: '5px 15px' }}>Edit</button>
            <input type="text" style={{ width: '60px', padding: '3px' }} disabled />
          </div>
          <button className="custom-action-btn primary" onClick={handleFind} style={{ padding: '5px 15px' }}>Find</button>
        </div>
      </div>
    </div>
  );
}

export default ItemCategoryLookupModal;
