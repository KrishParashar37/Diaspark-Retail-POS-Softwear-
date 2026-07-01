import React, { useState, useEffect } from 'react';
import './CustomerLookupModal.css';

const ShippingAddressModal = ({ customer, onClose, onSelect }) => {
  const [addresses, setAddresses] = useState([]);
  
  useEffect(() => {
    if (customer) {
      setAddresses([{
        code: `SHIP-0001`,
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        addressType: 'Primary Billing Address',
        address1: customer.address1 || '',
        address2: customer.address2 || '',
        city: customer.city || '',
        state: customer.state || '',
        zip: customer.zip || '',
        country: 'USA'
      }]);
    }
  }, [customer]);

  const initialFormState = {
    firstName: '', lastName: '', addressType: '', attn1: '', attn2: '',
    address1: '', address2: '', city: '', state: '', zip: '',
    country: 'USA', phone: '', fax: '', email: '', mobile: '', outOfUsa: false
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNew = () => {
    setFormData(initialFormState);
  };

  const handleSave = () => {
    if (!formData.firstName && !formData.lastName && !formData.address1) {
      alert('Please enter at least a name or address to save.');
      return;
    }
    const newAddress = {
      ...formData,
      code: `SHIP-${String(addresses.length + 1).padStart(4, '0')}`
    };
    setAddresses([...addresses, newAddress]);
    setFormData(initialFormState);
    alert('Shipping Address saved successfully!');
  };

  return (
    <div className="modal-overlay">
      <style>
        {`
          .shipping-modal-container * {
            box-sizing: border-box;
          }
          .shipping-modal-container input[type="text"], 
          .shipping-modal-container select {
            height: 20px;
            padding: 1px 4px;
          }
        `}
      </style>
      <div className="customer-lookup-modal shipping-modal-container" style={{ width: '950px', backgroundColor: '#e2e2e2' }}>
        <div className="modal-header" style={{ background: 'linear-gradient(to bottom, #cfdbe8, #a6bad1)' }}>
          <span>Shipping Address</span>
          <button className="close-btn" onClick={onClose} title="Close">&times;</button>
        </div>
        
        <div style={{ display: 'flex', padding: '15px 15px 5px 15px', gap: '15px' }}>
          
          {/* Left Side Table */}
          <div style={{ flex: 1, backgroundColor: 'white', border: '1px solid #aaa', height: '360px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
              <table className="lookup-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead>
                  <tr className="empty-header-row" style={{ background: '#f0f0f0' }}>
                    <th style={{ padding: '2px 4px' }}><input type="text" style={{ width: '100%', border: '1px solid #aaa' }} /></th>
                    <th style={{ padding: '2px 4px' }}><input type="text" style={{ width: '100%', border: '1px solid #aaa' }} /></th>
                    <th style={{ padding: '2px 4px' }}><input type="text" style={{ width: '100%', border: '1px solid #aaa' }} /></th>
                    <th style={{ padding: '2px 4px' }}><input type="text" style={{ width: '100%', border: '1px solid #aaa' }} /></th>
                    <th style={{ padding: '2px 4px' }}><input type="text" style={{ width: '100%', border: '1px solid #aaa' }} /></th>
                    <th style={{ padding: '2px 4px' }}><input type="text" style={{ width: '100%', border: '1px solid #aaa' }} /></th>
                    <th style={{ padding: '2px 4px' }}><input type="text" style={{ width: '100%', border: '1px solid #aaa' }} /></th>
                    <th style={{ padding: '2px 4px' }}><input type="text" style={{ width: '100%', border: '1px solid #aaa' }} /></th>
                    <th style={{ padding: '2px 4px' }}><input type="text" style={{ width: '100%', border: '1px solid #aaa' }} /></th>
                  </tr>
                  <tr>
                    <th style={{width: '12%', padding: '4px'}}>Code</th>
                    <th style={{width: '12%', padding: '4px'}}>First Name</th>
                    <th style={{width: '12%', padding: '4px'}}>Last Name</th>
                    <th style={{width: '13%', padding: '4px'}}>Address Type</th>
                    <th style={{width: '15%', padding: '4px'}}>Address #1</th>
                    <th style={{width: '13%', padding: '4px'}}>Address #2</th>
                    <th style={{width: '10%', padding: '4px'}}>City</th>
                    <th style={{width: '6%', padding: '4px'}}>State</th>
                    <th style={{width: '7%', padding: '4px'}}>Zip</th>
                  </tr>
                </thead>
                <tbody>
                  {addresses.map((addr, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => setFormData(addr)}
                      onDoubleClick={() => onSelect(addr)}
                      style={{ 
                        background: formData.code === addr.code ? '#5ab0e2' : 'white', 
                        color: formData.code === addr.code ? 'white' : 'black',
                        cursor: 'pointer' 
                      }}
                    >
                      <td>{addr.code}</td>
                      <td>{addr.firstName}</td>
                      <td>{addr.lastName}</td>
                      <td>{addr.addressType}</td>
                      <td>{addr.address1}</td>
                      <td>{addr.address2}</td>
                      <td>{addr.city}</td>
                      <td>{addr.state}</td>
                      <td>{addr.zip}</td>
                    </tr>
                  ))}
                  {/* Empty rows to fill space */}
                  {[...Array(Math.max(13 - addresses.length, 0))].map((_, i) => (
                    <tr key={`empty-${i}`} style={{ background: (i + addresses.length) % 2 === 1 ? '#f9f9f9' : 'white' }}>
                      <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side Form */}
          <div style={{ width: '270px', minWidth: '270px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#111' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '90px', minWidth: '90px', textAlign: 'right', paddingRight: '5px' }}>First/Last Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} style={{ width: '70px', marginRight: '5px', border: '1px solid #aaa' }} />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} style={{ flex: 1, minWidth: 0, border: '1px solid #aaa' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '90px', minWidth: '90px', textAlign: 'right', paddingRight: '5px' }}>Address Type</label>
              <select name="addressType" value={formData.addressType} onChange={handleInputChange} style={{ flex: 1, minWidth: 0, border: '1px solid #aaa' }}>
                <option></option>
                <option>Primary Billing Address</option>
                <option>Business Address</option>
                <option>Secondary Billing Address</option>
                <option>Secondary Mailing Address</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '90px', minWidth: '90px', textAlign: 'right', paddingRight: '5px' }}>Attn/CO</label>
              <input type="text" name="attn1" value={formData.attn1} onChange={handleInputChange} style={{ width: '70px', marginRight: '5px', border: '1px solid #aaa' }} />
              <input type="text" name="attn2" value={formData.attn2} onChange={handleInputChange} style={{ flex: 1, minWidth: 0, border: '1px solid #aaa' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '90px', minWidth: '90px', textAlign: 'right', paddingRight: '5px' }}>Address #1</label>
              <input type="text" name="address1" value={formData.address1} onChange={handleInputChange} style={{ flex: 1, minWidth: 0, border: '1px solid #aaa' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '90px', minWidth: '90px', textAlign: 'right', paddingRight: '5px' }}>#2</label>
              <input type="text" name="address2" value={formData.address2} onChange={handleInputChange} style={{ flex: 1, minWidth: 0, border: '1px solid #aaa' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '90px', minWidth: '90px', textAlign: 'right', paddingRight: '5px' }}>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} style={{ width: '80px', border: '1px solid #aaa' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '90px', minWidth: '90px', textAlign: 'right', paddingRight: '5px' }}>State/Zip</label>
              <input type="text" name="state" value={formData.state} onChange={handleInputChange} style={{ width: '40px', marginRight: '5px', border: '1px solid #aaa' }} />
              <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} style={{ flex: 1, minWidth: 0, border: '1px solid #aaa' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '90px', minWidth: '90px', textAlign: 'right', paddingRight: '5px' }}>Country</label>
              <select name="country" value={formData.country} onChange={handleInputChange} style={{ width: '100px', border: '1px solid #aaa' }}>
                <option>None</option>
                <option>USA</option>
                {["Afghanistan", "Aland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bonaire, Sint Eustatius and Saba", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, Democratic Republic of the", "Cook Islands", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "North Macedonia", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestine, State of", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Réunion", "Romania", "Russian Federation", "Rwanda", "Saint Barthélemy", "Saint Helena, Ascension and Tristan da Cunha", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Viet Nam", "Virgin Islands, British", "Virgin Islands, U.S.", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '90px', minWidth: '90px', textAlign: 'right', paddingRight: '5px' }}>Phone/Fax</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} style={{ width: '80px', marginRight: '5px', border: '1px solid #aaa' }} />
              <input type="text" name="fax" value={formData.fax} onChange={handleInputChange} style={{ flex: 1, minWidth: 0, border: '1px solid #aaa' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '90px', minWidth: '90px', textAlign: 'right', paddingRight: '5px' }}>Email</label>
              <input type="text" name="email" value={formData.email} onChange={handleInputChange} style={{ flex: 1, minWidth: 0, border: '1px solid #aaa' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ width: '90px', minWidth: '90px', textAlign: 'right', paddingRight: '5px' }}>Mobile</label>
              <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} style={{ width: '100px', border: '1px solid #aaa' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
              <label style={{ width: '90px', minWidth: '90px', textAlign: 'right', paddingRight: '5px' }}>Out of USA</label>
              <input type="checkbox" name="outOfUsa" checked={formData.outOfUsa} onChange={handleInputChange} style={{ margin: 0 }} />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div style={{ padding: '15px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <button className="search-btn" onClick={handleNew} style={{ padding: '4px 20px', fontSize: '12px' }}>New</button>
          <button className="search-btn" onClick={handleSave} style={{ padding: '4px 20px', fontSize: '12px' }}>Save</button>
          <button className="search-btn" onClick={onClose} style={{ padding: '4px 20px', fontSize: '12px' }}>Cancel</button>
        </div>

      </div>
    </div>
  );
};

export default ShippingAddressModal;
