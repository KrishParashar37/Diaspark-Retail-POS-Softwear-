import API_BASE_URL from '../config.js';
import React, { useState } from 'react';
import './DiamondStoneLookupModal.css';

const DiamondStoneLookupModal = ({ onClose }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [diamondStones, setDiamondStones] = useState([]);
  
  const [filters, setFilters] = useState({
    sku: '', lot: '', name: '', stone: '', type: '', shape: '', shade: '', size: '', clarity: '',
    color: '', pcs: '', wt: '', price: '', cert: '', ownership: '', remarks: '', order: '', loc: ''
  });

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/api/items`)
      .then(res => res.json())
      .then(data => {
        // Map real POSDB product data to Diamond & Stone columns
        const mappedData = data.map(item => ({
          sku: item.sku || '',
          lot: item.serial || '',
          name: item.description || '',
          stone: '', // Not in Products table
          type: item.category || '',
          shape: '',
          shade: '',
          size: item.size || '',
          clarity: '',
          color: '',
          pcs: item.onHand || '0',
          wt: '',
          price: item.retailPrice ? parseFloat(item.retailPrice).toFixed(2) : '0.00',
          cert: '',
          ownership: '',
          remarks: item.detailDescription || '',
          order: '',
          loc: item.location || ''
        }));
        setDiamondStones(mappedData);
      })
      .catch(err => console.error("Failed to fetch diamond/stones from posdb:", err));
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredStones = diamondStones.filter(row => {
    return (
      String(row.sku).toLowerCase().includes(filters.sku.toLowerCase()) &&
      String(row.lot).toLowerCase().includes(filters.lot.toLowerCase()) &&
      String(row.name).toLowerCase().includes(filters.name.toLowerCase()) &&
      String(row.stone).toLowerCase().includes(filters.stone.toLowerCase()) &&
      String(row.type).toLowerCase().includes(filters.type.toLowerCase()) &&
      String(row.shape).toLowerCase().includes(filters.shape.toLowerCase()) &&
      String(row.shade).toLowerCase().includes(filters.shade.toLowerCase()) &&
      String(row.size).toLowerCase().includes(filters.size.toLowerCase()) &&
      String(row.clarity).toLowerCase().includes(filters.clarity.toLowerCase()) &&
      String(row.color).toLowerCase().includes(filters.color.toLowerCase()) &&
      String(row.pcs).toLowerCase().includes(filters.pcs.toLowerCase()) &&
      String(row.wt).toLowerCase().includes(filters.wt.toLowerCase()) &&
      String(row.price).toLowerCase().includes(filters.price.toLowerCase()) &&
      String(row.cert).toLowerCase().includes(filters.cert.toLowerCase()) &&
      String(row.ownership).toLowerCase().includes(filters.ownership.toLowerCase()) &&
      String(row.remarks).toLowerCase().includes(filters.remarks.toLowerCase()) &&
      String(row.order).toLowerCase().includes(filters.order.toLowerCase()) &&
      String(row.loc).toLowerCase().includes(filters.loc.toLowerCase())
    );
  });


  return (
    <div className="diamond-stone-modal-overlay">
      <div className="diamond-stone-modal">
        <div className="diamond-stone-header">
          <span>Diamond And Stone</span>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>

        <div className="diamond-stone-body">
          <div className="diamond-stone-grid-container">
            <table className="diamond-stone-table">
              <thead>
                <tr className="filter-row">
                  <th><input type="text" className="grid-filter-input" value={filters.sku} onChange={(e) => handleFilterChange('sku', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.lot} onChange={(e) => handleFilterChange('lot', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.name} onChange={(e) => handleFilterChange('name', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.stone} onChange={(e) => handleFilterChange('stone', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.shape} onChange={(e) => handleFilterChange('shape', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.shade} onChange={(e) => handleFilterChange('shade', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.size} onChange={(e) => handleFilterChange('size', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.clarity} onChange={(e) => handleFilterChange('clarity', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.color} onChange={(e) => handleFilterChange('color', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.pcs} onChange={(e) => handleFilterChange('pcs', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.wt} onChange={(e) => handleFilterChange('wt', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.price} onChange={(e) => handleFilterChange('price', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.cert} onChange={(e) => handleFilterChange('cert', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.ownership} onChange={(e) => handleFilterChange('ownership', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.remarks} onChange={(e) => handleFilterChange('remarks', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.order} onChange={(e) => handleFilterChange('order', e.target.value)} /></th>
                  <th><input type="text" className="grid-filter-input" value={filters.loc} onChange={(e) => handleFilterChange('loc', e.target.value)} /></th>
                </tr>
                <tr>
                  <th>SKU #</th>
                  <th>Lot #</th>
                  <th>Name</th>
                  <th>Stone #</th>
                  <th>Type</th>
                  <th>Shape</th>
                  <th>Shade</th>
                  <th>Size</th>
                  <th>Clarity</th>
                  <th>Color</th>
                  <th>Pcs</th>
                  <th>Wt</th>
                  <th>Price</th>
                  <th>Certificate</th>
                  <th>OwnerShip</th>
                  <th>Remarks</th>
                  <th>Order #</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {filteredStones.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={selectedRow === idx ? 'selected' : ''}
                    onClick={() => setSelectedRow(idx)}
                  >
                    <td>{row.sku}</td>
                    <td>{row.lot}</td>
                    <td>{row.name}</td>
                    <td>{row.stone}</td>
                    <td>{row.type}</td>
                    <td>{row.shape}</td>
                    <td>{row.shade}</td>
                    <td>{row.size}</td>
                    <td>{row.clarity}</td>
                    <td className="color-col">{row.color}</td>
                    <td className="right-align">{row.pcs}</td>
                    <td className="right-align">{row.wt}</td>
                    <td className="right-align">{row.price}</td>
                    <td>{row.cert}</td>
                    <td>{row.ownership}</td>
                    <td>{row.remarks}</td>
                    <td>{row.order}</td>
                    <td>{row.loc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="diamond-stone-footer">
          <button className="custom-action-btn primary" onClick={onClose}>Select</button>
          <button className="custom-action-btn primary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DiamondStoneLookupModal;
