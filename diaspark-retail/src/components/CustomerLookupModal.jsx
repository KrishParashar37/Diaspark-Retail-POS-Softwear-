import React, { useState, useEffect } from 'react';
import './CustomerLookupModal.css';
import CustomerFormModal from './CustomerFormModal';

function CustomerLookupModal({ onClose, onSelect }) {
  const [allCustomers, setAllCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState('new');

  // Search form states
  const [salespersonsList, setSalespersonsList] = useState([]);
  const [searchParams, setSearchParams] = useState({
    keyWords: '',
    firstName: '',
    lastName: '',
    city: '',
    state: '',
    zip: '',
    address: '',
    email: '',
    phone: '',
    salesperson: ''
  });

  // Fetch salespersons list on mount (table starts blank until user searches)
  useEffect(() => {
    fetch('http://localhost:5001/api/salespersons')
      .then(res => res.json())
      .then(data => setSalespersonsList(data))
      .catch(err => console.error("Error fetching salespersons:", err));
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/customers');
      if (response.ok) {
        const data = await response.json();
        setAllCustomers(data);
        setFilteredCustomers(data);
      } else {
        console.error("Failed to fetch customers");
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  // Press Enter in any field to search
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
      const { keyWords, firstName, lastName, city, state, zip, address, email, phone, salesperson } = searchParams;
      if (keyWords.trim()) params.append('keywords', keyWords.trim());
      if (firstName.trim()) params.append('firstName', firstName.trim());
      if (lastName.trim()) params.append('lastName', lastName.trim());
      if (city.trim()) params.append('city', city.trim());
      if (state.trim()) params.append('state', state.trim());
      if (zip.trim()) params.append('zip', zip.trim());
      if (address.trim()) params.append('address', address.trim());
      if (email.trim()) params.append('email', email.trim());
      if (phone.trim()) params.append('phone', phone.trim());
      if (salesperson.trim()) params.append('salesperson', salesperson.trim());

      const url = params.toString()
        ? `http://localhost:5001/api/customers/search?${params.toString()}`
        : 'http://localhost:5001/api/customers';
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

  // Ensure we always show at least 15 rows for visual effect
  const displayRows = [...filteredCustomers];
  while (displayRows.length < 15) {
    displayRows.push(null);
  }

  return (
    <div className="modal-overlay">
      <div className="customer-lookup-modal">
        {/* Header */}
        <div className="modal-header">
          <span>Customer Lookup</span>
          <button className="close-btn" onClick={onClose} title="Close">&times;</button>
        </div>
        
        {/* Search Bar */}
        <div className="modal-search-bar">
          <input type="text" name="keyWords" value={searchParams.keyWords} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Key Words" className="search-input" style={{width: '130px'}} />
          <span className="or-text">OR</span>
          <input type="text" name="firstName" value={searchParams.firstName} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="First Name" className="search-input" style={{width: '100px'}} />
          <input type="text" name="lastName" value={searchParams.lastName} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Last Name" className="search-input" style={{width: '100px'}} />
          <input type="text" name="city" value={searchParams.city} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="City" className="search-input" style={{width: '60px'}} />
          <input type="text" name="state" value={searchParams.state} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="State" className="search-input" style={{width: '45px'}} />
          <input type="text" name="zip" value={searchParams.zip} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Zip" className="search-input" style={{width: '50px'}} />
          <input type="text" name="address" value={searchParams.address} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Address" className="search-input" style={{width: '130px'}} />
          <input type="text" name="email" value={searchParams.email} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Email" className="search-input" style={{width: '110px'}} />
          <input type="text" name="phone" value={searchParams.phone} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Phone" className="search-input" style={{width: '100px'}} />
          <select name="salesperson" value={searchParams.salesperson} onChange={handleInputChange} onKeyDown={handleKeyDown} className="search-input" style={{width: '100px', height: '22px'}}>
            <option value="">Salesperson</option>
            {salespersonsList.map((sp, idx) => (
              <option key={idx} value={sp.code}>{sp.name}({sp.code})</option>
            ))}
          </select>
          <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>
        
        {/* Grid Container */}
        <div className="modal-grid-container">
          <table className="lookup-table">
            <thead>
              <tr className="empty-header-row">
                <th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th>
              </tr>
              <tr>
                <th style={{width: '6%'}}>Code</th>
                <th style={{width: '8%'}}>First Name</th>
                <th style={{width: '8%'}}>Last Name</th>
                <th style={{width: '7%'}}>Mobile</th>
                <th style={{width: '7%'}}>Phone</th>
                <th style={{width: '9%'}}>Spouse Name</th>
                <th style={{width: '6%'}}>City</th>
                <th style={{width: '4%'}}>State</th>
                <th style={{width: '4%'}}>Zip</th>
                <th style={{width: '11%'}}>Address</th>
                <th style={{width: '7%'}}>Category #</th>
                <th style={{width: '9%'}}>Email</th>
                <th style={{width: '7%'}}>Parent #</th>
                <th style={{width: '7%'}}>Parent Name</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map((cust, i) => (
                <tr 
                  key={i} 
                  onClick={() => cust && setSelectedCustomer(cust)}
                  className={selectedCustomer && cust && selectedCustomer.customerId === cust.customerId ? 'selected-row' : ''}
                  style={{ cursor: cust ? 'pointer' : 'default' }}
                >
                  {cust ? (
                    <>
                      <td>{cust.customerId}</td>
                      <td>{cust.firstName}</td>
                      <td>{cust.lastName}</td>
                      <td>{cust.mobile}</td>
                      <td>{cust.mobile}</td>
                      <td></td>
                      <td>{cust.city}</td>
                      <td>{cust.stateName}</td>
                      <td>{cust.zipCode}</td>
                      <td>{cust.addressLine}</td>
                      <td>{cust.category || 'POS'}</td>
                      <td>{cust.email}</td>
                      <td></td>
                      <td></td>
                    </>
                  ) : (
                    <>
                      <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div style={{textAlign: 'center', padding: '10px'}}>Loading...</div>}
        </div>
        
        {/* Footer */}
        <div className="modal-footer">
          <div className="footer-left" style={{ display: 'flex', gap: '10px' }}>
            <button className="modal-action-btn" style={{background: 'linear-gradient(to bottom, #6bc06b, #4b9e4b)', border: '1px solid #3d8a3d', color: 'white', fontWeight: 'bold'}} onClick={() => {
              if (onSelect) {
                onSelect({
                  customerId: 'CASH',
                  firstName: 'CASH',
                  lastName: 'CUSTOMER',
                  mobile: '',
                  email: ''
                });
              }
              onClose();
            }}>Cash Customer</button>
            <button className="modal-action-btn" onClick={() => {
              if(selectedCustomer) {
                setFormMode('detail');
                setShowFormModal(true);
              } else alert('Please select a customer first');
            }}>Show Detail</button>
          </div>
          <div className="footer-right">
            <button className="modal-action-btn" onClick={() => {
              if (selectedCustomer) {
                if (onSelect) onSelect(selectedCustomer);
                onClose();
              } else {
                alert('Please select a customer first');
              }
            }}>Select</button>
            <button className="modal-action-btn" onClick={() => {
              setFormMode('new');
              setShowFormModal(true);
            }}>New</button>
            <button className="modal-action-btn" onClick={() => {
              if(selectedCustomer) {
                setFormMode('edit');
                setShowFormModal(true);
              } else {
                alert('Please select a customer to edit');
              }
            }}>Edit</button>
            <button className="modal-action-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
      {showFormModal && (
        <CustomerFormModal 
          mode={formMode} 
          initialData={selectedCustomer} 
          onClose={() => setShowFormModal(false)} 
          onSaved={() => {
            setShowFormModal(false);
            fetchCustomers(); // Refresh the grid
          }}
        />
      )}
    </div>
  );
}

export default CustomerLookupModal;
