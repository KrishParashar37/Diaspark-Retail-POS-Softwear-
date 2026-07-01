import API_BASE_URL from '../config.js';
import React, { useState, useEffect } from 'react';
import './CustomerInfoView.css';
import EditCustomerModal from './EditCustomerModal';

function CustomerInfoView({ onSelectCustomer, onAction }) {
  const [salespersonsList, setSalespersonsList] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [searchParams, setSearchParams] = useState({
    keyWords: '',
    firstName: '',
    lastName: '',
    city: '',
    zip: '',
    address: '',
    email: '',
    phone: '',
    salesperson: ''
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/salespersons`)
      .then(res => res.json())
      .then(data => setSalespersonsList(data))
      .catch(err => console.error("Error fetching salespersons:", err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const { keyWords, firstName, lastName, city, zip, address, email, phone, salesperson } = searchParams;
      if (keyWords.trim()) params.append('keywords', keyWords.trim());
      if (firstName.trim()) params.append('firstName', firstName.trim());
      if (lastName.trim()) params.append('lastName', lastName.trim());
      if (city.trim()) params.append('city', city.trim());
      if (zip.trim()) params.append('zip', zip.trim());
      if (address.trim()) params.append('address', address.trim());
      if (email.trim()) params.append('email', email.trim());
      if (phone.trim()) params.append('phone', phone.trim());
      if (salesperson.trim()) params.append('salesperson', salesperson.trim());

      const url = params.toString()
        ? `${API_BASE_URL}/api/customers/search?${params.toString()}`
        : `${API_BASE_URL}/api/customers`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setFilteredCustomers(data);
      }
    } catch (err) {
      console.error("Error searching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const displayRows = [...filteredCustomers];
  while (displayRows.length < 20) {
    displayRows.push(null);
  }

  const handleActionClick = (action) => {
    if (onAction) {
      onAction(action, selectedCustomer);
    }
  };

  return (
    <div className="customer-info-container">
      
      {/* Search Bar */}
      <div className="customer-info-search-bar">
        <span className="find-label">Find Customer</span>
        <input type="text" name="keyWords" value={searchParams.keyWords} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Key Words" style={{ width: '130px', marginRight: '5px' }} />
        <span className="or-label">OR</span>
        <input type="text" name="firstName" value={searchParams.firstName} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="First Name" style={{ width: '100px', marginRight: '5px' }} />
        <input type="text" name="lastName" value={searchParams.lastName} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Last Name" style={{ width: '100px', marginRight: '5px' }} />
        <input type="text" name="city" value={searchParams.city} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="City" style={{ width: '70px', marginRight: '5px' }} />
        <input type="text" name="zip" value={searchParams.zip} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Zip" style={{ width: '50px', marginRight: '5px' }} />
        <input type="text" name="address" value={searchParams.address} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Address" style={{ width: '130px', marginRight: '5px' }} />
        <input type="text" name="email" value={searchParams.email} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Email" style={{ width: '110px', marginRight: '5px' }} />
        <input type="text" name="phone" value={searchParams.phone} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Phone" style={{ width: '100px', marginRight: '5px' }} />
        <select name="salesperson" value={searchParams.salesperson} onChange={handleInputChange} onKeyDown={handleKeyDown} style={{ width: '100px', marginRight: '10px' }}>
          <option value="">Salesperson</option>
          {salespersonsList.map((sp, idx) => (
            <option key={idx} value={sp.code}>{sp.name}</option>
          ))}
        </select>
        <button onClick={handleSearch} className="customer-info-action-btn" style={{ marginRight: '5px' }}>Search</button>
        <button className="customer-info-action-btn" style={{ marginRight: '5px' }}>Print</button>
        <button className="customer-info-action-btn">New</button>
      </div>

      {/* Actions Row */}
      <div className="customer-info-actions-row">
        <button onClick={() => handleActionClick('Sales')} className="customer-info-action-btn">Sales</button>
        <button onClick={() => handleActionClick('Return/Exchange')} className="customer-info-action-btn">Return</button>
        <button onClick={() => handleActionClick('Special Order')} className="customer-info-action-btn">Special</button>
        <button onClick={() => handleActionClick('Repair')} className="customer-info-action-btn">Repair</button>
        <button onClick={() => handleActionClick('Wish List')} className="customer-info-action-btn">Wishlist</button>
      </div>

      {/* Data Grid */}
      <div className="customer-info-grid-container">
        <table className="customer-info-table">
          <thead>
            <tr>
              <th style={{ width: '9%' }}>Customer #</th>
              <th style={{ width: '8%' }}>First Name</th>
              <th style={{ width: '9%' }}>Last Name</th>
              <th style={{ width: '6%', textAlign: 'right' }}>2026</th>
              <th style={{ width: '6%', textAlign: 'right' }}>2025</th>
              <th style={{ width: '6%', textAlign: 'right' }}>2024</th>
              <th style={{ width: '8%' }}>Spouse Name</th>
              <th style={{ width: '8%' }}>Salesperson #</th>
              <th style={{ width: '10%' }}>Address1</th>
              <th style={{ width: '10%' }}>Address2</th>
              <th style={{ width: '7%' }}>City</th>
              <th style={{ width: '8%' }}>Phone</th>
              <th style={{ width: '8%' }}>Mobile</th>
              <th style={{ width: '7%' }}>Start Date</th>
              <th style={{ width: '12%' }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((cust, i) => (
              <tr 
                key={i} 
                className={selectedCustomer && cust && selectedCustomer.customerId === cust.customerId ? 'selected' : ''}
                onClick={() => {
                  if (cust) {
                    setSelectedCustomer(cust);
                    if (onSelectCustomer) onSelectCustomer(cust);
                  }
                }}
                onDoubleClick={() => {
                  if (cust) {
                    setEditingCustomer(cust);
                  }
                }}
                style={{ cursor: cust ? 'pointer' : 'default' }}
              >
                {cust ? (
                  <>
                    <td>{cust.customerId}</td>
                    <td>{cust.firstName}</td>
                    <td>{cust.lastName}</td>
                    <td style={{ textAlign: 'right' }}></td>
                    <td style={{ textAlign: 'right' }}></td>
                    <td style={{ textAlign: 'right' }}></td>
                    <td></td>
                    <td>{cust.salesperson || ''}</td>
                    <td>{cust.addressLine}</td>
                    <td></td>
                    <td>{cust.city}</td>
                    <td>{cust.mobile}</td>
                    <td>{cust.mobile}</td>
                    <td>09/05/2023</td>
                    <td>{cust.email}</td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '9px 6px' }}></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div style={{ textAlign: 'center', padding: '10px' }}>Loading...</div>}
      </div>

      {editingCustomer && (
        <EditCustomerModal 
          customer={editingCustomer} 
          onClose={() => setEditingCustomer(null)} 
        />
      )}
    </div>
  );
}

export default CustomerInfoView;
