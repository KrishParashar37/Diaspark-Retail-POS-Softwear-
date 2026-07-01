import React, { useState, useEffect } from 'react';
import './SkuLookupModal.css';

function SkuLookupModal({ onClose, onSelect }) {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Search filter states
  const [filters, setFilters] = useState({
    category: '', sku: '', itemType: '', description: '', vendor: '', vendorStyle: ''
  });

  // Fetch data from backend on mount
  useEffect(() => {
    fetchSkus();
  }, []);

  const fetchSkus = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/skus');
      if (response.ok) {
        const data = await response.json();
        setAllData(data);
        setFilteredData(data);
      }
    } catch (err) {
      console.error("Error fetching SKUs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);

    // Client-side filtering
    let results = allData;
    if (newFilters.category) results = results.filter(r => r.category.toLowerCase().includes(newFilters.category.toLowerCase()));
    if (newFilters.sku) results = results.filter(r => r.sku.toLowerCase().includes(newFilters.sku.toLowerCase()));
    if (newFilters.itemType) results = results.filter(r => r.itemType.toLowerCase().includes(newFilters.itemType.toLowerCase()));
    if (newFilters.description) results = results.filter(r => r.description.toLowerCase().includes(newFilters.description.toLowerCase()));
    if (newFilters.vendor) results = results.filter(r => r.vendor.toLowerCase().includes(newFilters.vendor.toLowerCase()));
    if (newFilters.vendorStyle) results = results.filter(r => r.vendorStyle.toLowerCase().includes(newFilters.vendorStyle.toLowerCase()));
    setFilteredData(results);
  };

  const handleSelect = () => {
    if (selectedRow !== null && onSelect) {
      onSelect(filteredData[selectedRow]);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="sku-lookup-modal">
        {/* Header */}
        <div className="modal-header">
          <span>Style/ SKU # Lookup</span>
          <button className="close-btn" onClick={onClose} title="Close">&times;</button>
        </div>
        
        {/* Search Bar Row */}
        <div className="sku-search-row">
          <input type="text" className="sku-search-input" style={{width: '9%'}} placeholder="Category" value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)} />
          <input type="text" className="sku-search-input" style={{width: '18%'}} placeholder="Style/ SKU #" value={filters.sku} onChange={(e) => handleFilterChange('sku', e.target.value)} />
          <input type="text" className="sku-search-input" style={{width: '9%'}} placeholder="Item Type" value={filters.itemType} onChange={(e) => handleFilterChange('itemType', e.target.value)} />
          <input type="text" className="sku-search-input" style={{width: '32%'}} placeholder="Description" value={filters.description} onChange={(e) => handleFilterChange('description', e.target.value)} />
          <input type="text" className="sku-search-input" style={{width: '11%'}} placeholder="Vendor #" value={filters.vendor} onChange={(e) => handleFilterChange('vendor', e.target.value)} />
          <input type="text" className="sku-search-input" style={{width: '16%'}} placeholder="Vendor Style" value={filters.vendorStyle} onChange={(e) => handleFilterChange('vendorStyle', e.target.value)} />
        </div>
        
        {/* Grid Container */}
        <div className="sku-grid-container">
          <table className="sku-lookup-table">
            <thead>
              <tr>
                <th style={{width: '9%'}}>Category</th>
                <th style={{width: '18%'}}>Style/ SKU #</th>
                <th style={{width: '9%'}}>Item Type</th>
                <th style={{width: '32%'}}>Description</th>
                <th style={{width: '11%'}}>Vendor #</th>
                <th style={{width: '16%'}}>Vendor Style #</th>
                <th style={{width: '5%', textAlign: 'right'}}>On Hand</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="7" style={{textAlign: 'center', padding: '10px'}}>Loading...</td></tr>}
              {filteredData.map((row, i) => (
                <tr key={i} 
                    onClick={() => setSelectedRow(i)} 
                    onDoubleClick={handleSelect}
                    style={{ backgroundColor: selectedRow === i ? '#b8def9' : 'transparent', cursor: 'pointer' }}>
                  <td>{row.category}</td>
                  <td>{row.sku}</td>
                  <td>{row.itemType}</td>
                  <td>{row.description}</td>
                  <td>{row.vendor}</td>
                  <td>{row.vendorStyle}</td>
                  <td style={{textAlign: 'right'}}>{row.onHand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="sku-modal-footer">
          <div className="sku-footer-center">
            <button className="modal-action-btn" onClick={handleSelect}>Select</button>
            <button className="modal-action-btn" onClick={onClose}>Cancel</button>
          </div>
          <div className="sku-footer-right">
            <label>Include Zero Qty? <input type="checkbox" /></label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkuLookupModal;
