import API_BASE_URL from '../config.js';
import React, { useState } from 'react';
import './VendorLookupModal.css';

const VendorLookupModal = ({ onClose, onSelect }) => {
  const [dummyData, setDummyData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(0);
  const [filters, setFilters] = useState({ keywords: '', name: '', city: '', state: '', zip: '', email: '', phone: '' });
  const [gridFilters, setGridFilters] = useState({ code: '', name: '', phone: '', city: '', state: '', zip: '', email: '' });
  const [filteredData, setFilteredData] = useState([]);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/api/vendors`)
      .then(res => res.json())
      .then(data => {
        setDummyData(data);
        setFilteredData(data);
      })
      .catch(err => console.error("Error fetching vendors:", err));
  }, []);

  const handleSearch = () => {
    const result = dummyData.filter(item => {
      const matchKeywords = !filters.keywords || 
        item.code.toLowerCase().includes(filters.keywords.toLowerCase()) || 
        item.name.toLowerCase().includes(filters.keywords.toLowerCase());
      const matchName = !filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchCity = !filters.city || item.city.toLowerCase().includes(filters.city.toLowerCase());
      const matchState = !filters.state || item.state.toLowerCase().includes(filters.state.toLowerCase());
      const matchZip = !filters.zip || item.zip.toLowerCase().includes(filters.zip.toLowerCase());
      const matchEmail = !filters.email || item.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchPhone = !filters.phone || item.phone.toLowerCase().includes(filters.phone.toLowerCase());
      
      return matchKeywords && matchName && matchCity && matchState && matchZip && matchEmail && matchPhone;
    });
    setFilteredData(result);
    setSelectedRow(result.length > 0 ? 0 : null);
  };

  const handleChange = (e, field) => {
    setFilters({ ...filters, [field]: e.target.value });
  };

  const handleSelect = () => {
    if (selectedRow !== null && onSelect && filteredData[selectedRow]) {
      onSelect(filteredData[selectedRow]);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="vendor-lookup-modal">
        <div className="modal-header">
          <span>Vendor Lookup</span>
          <button className="close-btn" onClick={onClose} title="Close">&times;</button>
        </div>
        
        <div className="vendor-lookup-content">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <div className="vendor-filter-section" style={{ backgroundColor: 'white', marginBottom: 0, flex: 1, padding: '5px' }}>
              <input type="text" value={filters.keywords} onChange={(e) => handleChange(e, 'keywords')} placeholder="Key Words" style={{ width: '100px' }} />
              <span style={{ margin: '0 10px', fontWeight: 'bold', fontSize: '13px' }}>OR</span>
              <input type="text" value={filters.name} onChange={(e) => handleChange(e, 'name')} placeholder="Vendor Name" style={{ width: '130px' }} />
              <input type="text" value={filters.city} onChange={(e) => handleChange(e, 'city')} placeholder="City" style={{ width: '90px', marginLeft: '5px' }} />
              <input type="text" value={filters.state} onChange={(e) => handleChange(e, 'state')} placeholder="State" style={{ width: '50px', marginLeft: '5px' }} />
              <input type="text" value={filters.zip} onChange={(e) => handleChange(e, 'zip')} placeholder="Zip" style={{ width: '60px', marginLeft: '5px' }} />
              <input type="text" value={filters.email} onChange={(e) => handleChange(e, 'email')} placeholder="Email" style={{ width: '130px', marginLeft: '5px' }} />
              <input type="text" value={filters.phone} onChange={(e) => handleChange(e, 'phone')} placeholder="Phone" style={{ width: '100px', marginLeft: '5px' }} />
            </div>
            <button className="vendor-search-btn" onClick={handleSearch} style={{ marginLeft: '10px', height: '32px', padding: '0 20px', fontSize: '14px', flexShrink: 0 }}>Search</button>
          </div>
          
          <div className="vendor-grid-container">
            <table className="vendor-lookup-table">
              <thead>
                <tr className="filter-row">
                  <th><input type="text" value={gridFilters.code} onChange={e => setGridFilters({...gridFilters, code: e.target.value})} style={{ width: '100%', boxSizing: 'border-box' }} /></th>
                  <th><input type="text" value={gridFilters.name} onChange={e => setGridFilters({...gridFilters, name: e.target.value})} style={{ width: '100%', boxSizing: 'border-box' }} /></th>
                  <th><input type="text" value={gridFilters.phone} onChange={e => setGridFilters({...gridFilters, phone: e.target.value})} style={{ width: '100%', boxSizing: 'border-box' }} /></th>
                  <th><input type="text" value={gridFilters.city} onChange={e => setGridFilters({...gridFilters, city: e.target.value})} style={{ width: '100%', boxSizing: 'border-box' }} /></th>
                  <th><input type="text" value={gridFilters.state} onChange={e => setGridFilters({...gridFilters, state: e.target.value})} style={{ width: '100%', boxSizing: 'border-box' }} /></th>
                  <th><input type="text" value={gridFilters.zip} onChange={e => setGridFilters({...gridFilters, zip: e.target.value})} style={{ width: '100%', boxSizing: 'border-box' }} /></th>
                  <th><input type="text" value={gridFilters.email} onChange={e => setGridFilters({...gridFilters, email: e.target.value})} style={{ width: '100%', boxSizing: 'border-box' }} /></th>
                </tr>
                <tr className="header-row">
                  <th style={{ width: '10%' }}>Code</th>
                  <th style={{ width: '25%' }}>Name</th>
                  <th style={{ width: '15%' }}>Phone</th>
                  <th style={{ width: '15%' }}>City</th>
                  <th style={{ width: '10%' }}>State</th>
                  <th style={{ width: '10%' }}>Zip</th>
                  <th style={{ width: '15%' }}>Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.filter(row => {
                  return row.code.toLowerCase().includes(gridFilters.code.toLowerCase()) &&
                         row.name.toLowerCase().includes(gridFilters.name.toLowerCase()) &&
                         row.phone.toLowerCase().includes(gridFilters.phone.toLowerCase()) &&
                         row.city.toLowerCase().includes(gridFilters.city.toLowerCase()) &&
                         row.state.toLowerCase().includes(gridFilters.state.toLowerCase()) &&
                         row.zip.toLowerCase().includes(gridFilters.zip.toLowerCase()) &&
                         row.email.toLowerCase().includes(gridFilters.email.toLowerCase());
                }).map((row, i) => (
                  <tr key={i} 
                      onClick={() => setSelectedRow(i)} 
                      onDoubleClick={() => { setSelectedRow(i); if(onSelect) { onSelect(filteredData[i]); onClose(); } }}
                      style={{ backgroundColor: selectedRow === i ? '#7bc0f7' : (i % 2 !== 0 ? '#fcfcfc' : 'white'), color: selectedRow === i ? 'white' : 'black', cursor: 'pointer' }}>
                    <td>{row.code}</td>
                    <td>{row.name}</td>
                    <td>{row.phone}</td>
                    <td>{row.city}</td>
                    <td>{row.state}</td>
                    <td>{row.zip}</td>
                    <td>{row.email}</td>
                  </tr>
                ))}
                {/* Add empty rows to fill space */}
                {[...Array(10)].map((_, i) => (
                  <tr key={`empty-${i}`} style={{ backgroundColor: (i + filteredData.length) % 2 !== 0 ? '#fcfcfc' : 'white' }}>
                    <td>&nbsp;</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="vendor-footer">
          <button className="vendor-action-btn" onClick={handleSelect}>Select</button>
          <button className="vendor-action-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default VendorLookupModal;
