import API_BASE_URL from '../config.js';
import React, { useState, useEffect } from 'react';
import './FamilyCustomerLookupModal.css';

const FamilyCustomerLookupModal = ({ onClose, onSelect }) => {
  const [dummyData, setDummyData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(0);
  const [filters, setFilters] = useState({
    customerId: '', firstName: '', lastName: '', city: '', state: '', zip: '', email: '', phone: ''
  });
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/customers`)
      .then(res => res.json())
      .then(data => {
        if(data.success && Array.isArray(data.data)) {
           setDummyData(data.data);
           setFilteredData(data.data);
        } else if (Array.isArray(data)) {
           setDummyData(data);
           setFilteredData(data);
        } else {
           setDummyData([]);
           setFilteredData([]);
        }
      })
      .catch(err => console.error("Error fetching customers:", err));
  }, []);

  const handleSearch = () => {
    const filtered = dummyData.filter(row => {
      return (
        (String(row.customerId || '')).toLowerCase().includes(filters.customerId.toLowerCase()) &&
        (row.firstName || '').toLowerCase().includes(filters.firstName.toLowerCase()) &&
        (row.lastName || '').toLowerCase().includes(filters.lastName.toLowerCase()) &&
        (row.city || '').toLowerCase().includes(filters.city.toLowerCase()) &&
        (row.stateName || '').toLowerCase().includes(filters.state.toLowerCase()) &&
        (row.zipCode || '').toLowerCase().includes(filters.zip.toLowerCase()) &&
        (row.email || '').toLowerCase().includes(filters.email.toLowerCase()) &&
        (row.mobile || '').toLowerCase().includes(filters.phone.toLowerCase())
      );
    });
    setFilteredData(filtered);
    setSelectedRow(0);
  };

  const handleSelect = () => {
    if (filteredData[selectedRow] && onSelect) {
      onSelect(filteredData[selectedRow]);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="family-lookup-modal">
        {/* Header */}
        <div className="modal-header">
          <span>Family Customer Lookup</span>
          <button className="close-btn" onClick={onClose} title="Close">&times;</button>
        </div>
        
        {/* Search Bar */}
        <div className="family-lookup-search-bar">
          <input type="text" placeholder="DAND-00001" value={filters.customerId} onChange={(e) => setFilters({...filters, customerId: e.target.value})} style={{ width: '120px' }} />
          <span style={{ fontWeight: 'bold', margin: '0 5px' }}>OR</span>
          <input type="text" placeholder="First Name" value={filters.firstName} onChange={(e) => setFilters({...filters, firstName: e.target.value})} style={{ width: '100px' }} />
          <input type="text" placeholder="Last Name" value={filters.lastName} onChange={(e) => setFilters({...filters, lastName: e.target.value})} style={{ width: '100px' }} />
          <input type="text" placeholder="City" value={filters.city} onChange={(e) => setFilters({...filters, city: e.target.value})} style={{ width: '80px' }} />
          <input type="text" placeholder="State" value={filters.state} onChange={(e) => setFilters({...filters, state: e.target.value})} style={{ width: '50px' }} />
          <input type="text" placeholder="Zip" value={filters.zip} onChange={(e) => setFilters({...filters, zip: e.target.value})} style={{ width: '60px' }} />
          <input type="text" placeholder="Email" value={filters.email} onChange={(e) => setFilters({...filters, email: e.target.value})} style={{ width: '120px' }} />
          <input type="text" placeholder="Phone" value={filters.phone} onChange={(e) => setFilters({...filters, phone: e.target.value})} style={{ width: '100px' }} />
          <button className="family-action-btn" onClick={handleSearch} style={{ marginLeft: '10px' }}>Search</button>
        </div>
        
        {/* Grid Container */}
        <div className="family-grid-container">
          <table className="family-lookup-table">
            <thead>
              <tr className="header-row">
                <th>Category #</th>
                <th>Code</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Zip</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Mobile</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, i) => (
                <tr key={i} 
                    onClick={() => setSelectedRow(i)} 
                    onDoubleClick={() => {
                      if (onSelect) onSelect(filteredData[i]);
                      onClose();
                    }}
                    style={{ backgroundColor: selectedRow === i ? '#7bc0f7' : (i % 2 !== 0 ? '#fcfcfc' : 'white'), color: selectedRow === i ? 'white' : 'black', cursor: 'pointer' }}>
                  <td>{row.category || 'POS'}</td>
                  <td>{row.customerId}</td>
                  <td>{row.firstName}</td>
                  <td>{row.lastName}</td>
                  <td>{row.addressLine}</td>
                  <td>{row.city}</td>
                  <td>{row.stateName}</td>
                  <td>{row.zipCode}</td>
                  <td>{row.email}</td>
                  <td>{row.mobile}</td>
                  <td>{row.mobile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="family-footer">
          <button className="family-action-btn" style={{ float: 'left' }}>Cash Customer</button>
          <button className="family-action-btn" style={{ float: 'left' }}>Show Detail</button>
          <div style={{ display: 'inline-block', margin: '0 auto' }}>
            <button className="family-action-btn" onClick={handleSelect}>Select</button>
            <button className="family-action-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyCustomerLookupModal;
