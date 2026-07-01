import React, { useState } from 'react';
import './StyleSkuLookupModal.css';

function StyleSkuLookupModal({ onClose, onSelect }) {
  const [items, setItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState(0);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5001/api/items')
      .then(res => res.json())
      .then(data => {
        // Map the API fields to the format expected by the table if necessary
        const mappedData = data.map(item => ({
          category: item.category || '',
          sku: item.sku || '',
          type: 'Jewelry', // Hardcoded as Item Type is not directly provided in API
          desc: item.description || '',
          vendor: item.vendor || '',
          vendorStyle: item.vendorStyle || '',
          onHand: item.onHand !== undefined ? item.onHand : '0'
        }));
        setItems(mappedData);
      })
      .catch(err => console.error("Error fetching items:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = () => {
    if (selectedRow !== null && onSelect) {
      onSelect(items[selectedRow]);
    }
    onClose();
  };

  const handleRowClick = (index) => {
    setSelectedRow(index);
  };

  const handleDoubleClick = (index) => {
    setSelectedRow(index);
    if (onSelect) {
      onSelect(items[index]);
    }
    onClose();
  };

  return (
    <div className="sku-modal-overlay">
      <div className="sku-lookup-modal">
        <div className="sku-modal-header">
          <span>Style/ SKU # Lookup</span>
          <button className="sku-close-btn" onClick={onClose} title="Close">&times;</button>
        </div>
        
        <div className="sku-content-container">
          <div className="sku-grid-container">
            {/* Filter Inputs Row */}
            <div className="sku-filter-row">
              <input type="text" className="sku-filter-input" style={{width: '12%'}} />
              <input type="text" className="sku-filter-input" style={{width: '18%'}} />
              <input type="text" className="sku-filter-input" style={{width: '10%'}} />
              <input type="text" className="sku-filter-input" style={{width: '28%'}} />
              <input type="text" className="sku-filter-input" style={{width: '12%'}} />
              <input type="text" className="sku-filter-input" style={{width: '14%'}} />
              <input type="text" className="sku-filter-input" style={{width: '6%'}} />
            </div>

            <div className="sku-grid-header">
              <div className="sku-col" style={{width: '12%'}}>Category</div>
              <div className="sku-col" style={{width: '18%'}}>Style/ SKU #</div>
              <div className="sku-col" style={{width: '10%'}}>Item Type</div>
              <div className="sku-col" style={{width: '28%'}}>Description</div>
              <div className="sku-col" style={{width: '12%'}}>Vendor #</div>
              <div className="sku-col" style={{width: '14%'}}>Vendor Style #</div>
              <div className="sku-col" style={{width: '6%', textAlign: 'right'}}>On Hand</div>
            </div>
            
            <div className="sku-grid-body">
              {items.map((item, index) => (
                <div 
                  key={index} 
                  className={`sku-grid-row ${selectedRow === index ? 'selected' : ''}`}
                  onClick={() => handleRowClick(index)}
                  onDoubleClick={() => handleDoubleClick(index)}
                >
                  <div className="sku-col" style={{width: '12%'}}>{item.category}</div>
                  <div className="sku-col" style={{width: '18%'}}>{item.sku}</div>
                  <div className="sku-col" style={{width: '10%'}}>{item.type}</div>
                  <div className="sku-col" style={{width: '28%'}}>{item.desc}</div>
                  <div className="sku-col" style={{width: '12%'}}>{item.vendor}</div>
                  <div className="sku-col" style={{width: '14%'}}>{item.vendorStyle}</div>
                  <div className="sku-col" style={{width: '6%', textAlign: 'right'}}>{item.onHand}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="sku-modal-footer">
          <div className="sku-footer-buttons">
            <button className="sku-action-btn sku-primary-btn" onClick={handleSelect}>Select</button>
            <button className="sku-action-btn sku-primary-btn" onClick={onClose}>Cancel</button>
          </div>
          <div className="sku-footer-checkbox">
            <label>Include Zero Qty? <input type="checkbox" defaultChecked /></label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StyleSkuLookupModal;
