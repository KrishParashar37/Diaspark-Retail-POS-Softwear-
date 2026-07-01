import API_BASE_URL from '../config.js';
import React, { useState } from 'react';
import './ItemLookupModal.css';

function ItemLookupModal({ onClose, onSelect }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [searchFilters, setSearchFilters] = useState({
    keyWords: '',
    serial: '',
    sku: '',
    department: '',
    category: '',
    vendor: '',
    description: ''
  });

  React.useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/items`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        // Do not display data until search is clicked
        setFilteredItems([]);
      })
      .catch(err => console.error("Error fetching items:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    let result = items;
    const { keyWords, serial, sku, category, vendor, description } = searchFilters;

    if (keyWords) {
      const lowerKey = keyWords.toLowerCase();
      result = result.filter(item => 
        (item.description && item.description.toLowerCase().includes(lowerKey)) ||
        (item.sku && item.sku.toLowerCase().includes(lowerKey)) ||
        (item.serial && String(item.serial).toLowerCase().includes(lowerKey))
      );
    }
    if (serial) {
      result = result.filter(item => item.serial && String(item.serial).toLowerCase().includes(serial.toLowerCase()));
    }
    if (sku) {
      result = result.filter(item => item.sku && item.sku.toLowerCase().includes(sku.toLowerCase()));
    }
    if (category) {
      result = result.filter(item => item.category && item.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (vendor) {
      result = result.filter(item => item.vendor && item.vendor.toLowerCase().includes(vendor.toLowerCase()));
    }
    if (description) {
      result = result.filter(item => item.description && item.description.toLowerCase().includes(description.toLowerCase()));
    }
    setFilteredItems(result);
    setSelectedRow(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSelect = () => {
    if (selectedRow !== null && onSelect) {
      onSelect(filteredItems[selectedRow]);
    }
    onClose();
  };

  const handleRowClick = (index) => {
    setSelectedRow(index);
  };

  const handleDoubleClick = (index) => {
    setSelectedRow(index);
    if (onSelect) {
      onSelect(filteredItems[index]);
    }
    onClose();
  };

  return (
    <div className="item-modal-overlay">
      <div className="item-lookup-modal">
        <div className="item-modal-header">
          <span>Item Lookup</span>
          <button className="item-close-btn" onClick={onClose} title="Close">&times;</button>
        </div>
        
        <div className="item-content-container">
          {/* Top Search Bar */}
          <div className="item-search-bar">
            <input type="text" placeholder="Key Words" style={{width: '120px'}} 
              value={searchFilters.keyWords} onChange={(e) => handleFilterChange('keyWords', e.target.value)} onKeyDown={handleKeyDown} />
            <span style={{fontWeight: 'bold', margin: '0 10px'}}>OR</span>
            <input type="text" placeholder="Serial #" style={{width: '90px'}} 
              value={searchFilters.serial} onChange={(e) => handleFilterChange('serial', e.target.value)} onKeyDown={handleKeyDown} />
            <input type="text" placeholder="Style/ SKU #" style={{width: '100px'}} 
              value={searchFilters.sku} onChange={(e) => handleFilterChange('sku', e.target.value)} onKeyDown={handleKeyDown} />
            <input type="text" placeholder="Department" style={{width: '90px'}} 
              value={searchFilters.department} onChange={(e) => handleFilterChange('department', e.target.value)} onKeyDown={handleKeyDown} />
            <input type="text" placeholder="Category #" style={{width: '90px'}} 
              value={searchFilters.category} onChange={(e) => handleFilterChange('category', e.target.value)} onKeyDown={handleKeyDown} />
            <input type="text" placeholder="Vendor #" style={{width: '90px'}} 
              value={searchFilters.vendor} onChange={(e) => handleFilterChange('vendor', e.target.value)} onKeyDown={handleKeyDown} />
            <input type="text" placeholder="Description" style={{width: '120px'}} 
              value={searchFilters.description} onChange={(e) => handleFilterChange('description', e.target.value)} onKeyDown={handleKeyDown} />
            <button className="item-action-btn item-primary-btn" style={{marginLeft: '10px'}} onClick={handleSearch}>Search</button>
          </div>

          <div className="item-grid-container">
            {/* Filter Inputs Row */}
            <div className="item-filter-row">
              <input type="text" className="item-filter-input" style={{width: '8%'}} />
              <input type="text" className="item-filter-input" style={{width: '10%'}} />
              <input type="text" className="item-filter-input" style={{width: '12%'}} />
              <input type="text" className="item-filter-input" style={{width: '8%'}} />
              <input type="text" className="item-filter-input" style={{width: '15%'}} />
              <input type="text" className="item-filter-input" style={{width: '8%'}} />
              <input type="text" className="item-filter-input" style={{width: '10%'}} />
              <input type="text" className="item-filter-input" style={{width: '5%'}} />
              <input type="text" className="item-filter-input" style={{width: '8%'}} />
              <input type="text" className="item-filter-input" style={{width: '6%'}} />
              <input type="text" className="item-filter-input" style={{width: '10%'}} />
            </div>

            <div className="item-grid-header">
              <div className="item-col" style={{width: '8%'}}>Serial #</div>
              <div className="item-col" style={{width: '10%'}}>Style/ SKU #</div>
              <div className="item-col" style={{width: '12%'}}>Description</div>
              <div className="item-col" style={{width: '8%'}}>Category</div>
              <div className="item-col" style={{width: '15%'}}>Detail Description</div>
              <div className="item-col" style={{width: '8%'}}>Vendor</div>
              <div className="item-col" style={{width: '10%'}}>Vendor Style</div>
              <div className="item-col" style={{width: '5%'}}>Size</div>
              <div className="item-col" style={{width: '8%'}}>Retail Price</div>
              <div className="item-col" style={{width: '6%'}}>On Hand</div>
              <div className="item-col" style={{width: '10%'}}>Location #</div>
            </div>
            
            <div className="item-grid-body">
              {filteredItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`item-grid-row ${selectedRow === index ? 'selected' : ''}`}
                  onClick={() => handleRowClick(index)}
                  onDoubleClick={() => handleDoubleClick(index)}
                >
                  <div className="item-col" style={{width: '8%'}}>{item.serial}</div>
                  <div className="item-col" style={{width: '10%'}}>{item.sku}</div>
                  <div className="item-col" style={{width: '12%'}}>{item.description}</div>
                  <div className="item-col" style={{width: '8%'}}>{item.category}</div>
                  <div className="item-col" style={{width: '15%'}}>{item.detailDescription}</div>
                  <div className="item-col" style={{width: '8%'}}>{item.vendor}</div>
                  <div className="item-col" style={{width: '10%'}}>{item.vendorStyle}</div>
                  <div className="item-col" style={{width: '5%'}}>{item.size}</div>
                  <div className="item-col" style={{width: '8%'}}>{item.retailPrice}</div>
                  <div className="item-col" style={{width: '6%'}}>{item.onHand}</div>
                  <div className="item-col" style={{width: '10%'}}>{item.location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="item-modal-footer">
          <div className="item-footer-buttons">
            <button className="item-action-btn item-primary-btn" style={{marginRight: '30px'}}>Show Detail</button>
            <button className="item-action-btn item-primary-btn" onClick={handleSelect}>Select</button>
            <button className="item-action-btn item-primary-btn" onClick={onClose}>Cancel</button>
          </div>
          <div className="item-footer-checkboxes">
            <label>Include Inventory? <input type="checkbox" defaultChecked /></label>
            <label style={{marginLeft: '10px'}}>Include Zero Qty? <input type="checkbox" /></label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemLookupModal;
