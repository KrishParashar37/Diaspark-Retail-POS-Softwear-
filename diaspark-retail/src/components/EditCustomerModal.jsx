import React, { useState, useEffect } from 'react';
import './EditCustomerModal.css';
import CategoryLookupModal from './CategoryLookupModal';
import FamilyCustomerLookupModal from './FamilyCustomerLookupModal';
import EngagementLookupModal from './EngagementLookupModal';
import LanguageLookupModal from './LanguageLookupModal';
import DemographicLookupModal from './DemographicLookupModal';
import InterestsLookupModal from './InterestsLookupModal';

function EditCustomerModal({ customer, onClose }) {
  const [activeTopTab, setActiveTopTab] = useState('Customer');
  const [activeSubTab, setActiveSubTab] = useState('Customer');
  const [tabData, setTabData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryLookup, setShowCategoryLookup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('POS');
  const [showFamilyLookup, setShowFamilyLookup] = useState(false);
  const [familyId, setFamilyId] = useState(customer?.customerId || '');
  const [showEngagementLookup, setShowEngagementLookup] = useState(false);
  const [engagementCode, setEngagementCode] = useState('');
  const [showLanguageLookup, setShowLanguageLookup] = useState(false);
  const [languageCode, setLanguageCode] = useState('');
  const [showDemographicLookup, setShowDemographicLookup] = useState(false);
  const [demographicCode, setDemographicCode] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showInterestsLookup, setShowInterestsLookup] = useState(false);
  const [activeLookupField, setActiveLookupField] = useState(null);
  const [interestValues, setInterestValues] = useState({
    'Interests': '',
    'Watch Brand': '',
    'Preowned Watch Brands': '',
    'Jewelry Type': '',
    'Jewelry Brand': '',
    'Other Product Types': '',
    'Other Product Brands': ''
  });

  useEffect(() => {
    if (!customer || !customer.customerId) return;

    // Map UI tab names to backend API routes
    const routeMap = {
      'Purchase': 'purchases',
      'Appraisal': 'appraisals',
      'Receivables': 'receivables',
      'Wishlist': 'wishlist',
      'Order': 'orders',
      'Repair': 'repairs',
      'Family': 'family',
      'Family Transaction': 'family-transactions',
      'Gift Card': 'gift-cards',
      'Gift Certificate': 'gift-certificates'
    };

    const route = routeMap[activeTopTab];
    if (route) {
      setIsLoading(true);
      fetch(`http://localhost:5001/api/customers/${customer.customerId}/${route}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTabData(data.data);
          } else {
            console.error("Error fetching tab data", data.error);
            setTabData([]);
          }
        })
        .catch(err => {
          console.error("Fetch error:", err);
          setTabData([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setTabData([]);
    }
  }, [activeTopTab, customer]);

  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const countries = ['', 'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', "Cote d'Ivoire", 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Holy See', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine State', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'US', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];
  const states = ['', 'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];
  const days = ['', ...Array.from({ length: 31 }, (_, i) => i + 1)];

  const topTabs = [
    'Customer', 'Purchase', 'Appraisal', 'Receivables', 'Wishlist',
    'Order', 'Repair', 'Family', 'Family Transaction', 'Gift Card', 'Gift Certificate'
  ];

  const subTabs = [
    'Customer', 'Detail', 'Address', 'Other Information', 'Salesperson',
    'Store Credit', 'Notes', 'Interests', 'Affiliation', 'Finger Size(Self)', 'Finger Size(Significant Other)'
  ];

  return (
    <div className="edit-customer-modal-overlay">
      <div className="edit-customer-modal-container">
        <div className="edit-customer-modal-header">
          <span>Edit Customer - {customer?.firstName} {customer?.lastName}({customer?.customerId})</span>
          <button className="edit-customer-modal-close-btn" onClick={onClose}>x</button>
        </div>

        <div className="edit-customer-top-tabs">
          {topTabs.map(tab => (
            <button
              key={tab}
              className={`edit-customer-top-tab ${activeTopTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTopTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTopTab === 'Customer' && (
          <div className="edit-customer-sub-tabs">
            {subTabs.map(tab => (
              <span
                key={tab}
                className={`edit-customer-sub-tab ${activeSubTab === tab ? 'active' : ''}`}
                onClick={() => setActiveSubTab(tab)}
              >
                {tab}
              </span>
            ))}
          </div>
        )}

        <div className="edit-customer-content">
          {activeTopTab === 'Customer' && activeSubTab === 'Customer' && (
            <div style={{ display: 'flex', gap: '20px' }}>

              {/* Left Column */}
              <div style={{ flex: 2 }}>

                <div className="edit-customer-form-row">
                  <div className="edit-customer-label">Customer #</div>
                  <input className="edit-customer-input" value={customer?.customerId || ''} disabled style={{ width: '120px' }} />
                  <div className="edit-customer-label" style={{ width: '70px' }}>Category</div>
                  <input className="edit-customer-input" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ width: '120px' }} />
                  <button className="edit-customer-lookup-btn" onClick={() => setShowCategoryLookup(true)}>LU</button>
                  <div className="edit-customer-label" style={{ width: '60px' }}>Family #</div>
                  <input className="edit-customer-input" value={familyId} onChange={(e) => setFamilyId(e.target.value)} style={{ width: '120px' }} />
                  <button className="edit-customer-lookup-btn" onClick={() => setShowFamilyLookup(true)}>LU</button>
                  <div className="edit-customer-label" style={{ width: '120px' }}>Relationship Manager</div>
                  <select className="edit-customer-select" style={{ width: '100px' }}>
                    <option>GHAD</option>
                  </select>
                </div>

                <div className="edit-customer-form-row" style={{ marginTop: '10px' }}>
                  <div className="edit-customer-label"></div>
                  <div style={{ width: '80px', fontSize: '10px', textAlign: 'center' }}>Gender</div>
                  <div style={{ width: '60px', fontSize: '10px', textAlign: 'center' }}>Title</div>
                  <div style={{ width: '100px', fontSize: '10px' }}>First Name*</div>
                  <div style={{ width: '100px', fontSize: '10px' }}>Last Name*</div>
                  <div style={{ width: '85px', fontSize: '10px', textAlign: 'center' }}>Birth Date</div>
                  <div style={{ width: '90px', fontSize: '10px' }}>Cell Phone</div>
                  <div style={{ width: '130px', fontSize: '10px' }}>Email</div>
                  <div style={{ width: '90px', fontSize: '10px' }}>Work Phone</div>
                  <div style={{ width: '70px', fontSize: '10px' }}>Nick Name</div>
                </div>

                <div className="edit-customer-form-row">
                  <div className="edit-customer-label">Customer :</div>
                  <select className="edit-customer-select" style={{ width: '80px' }}>
                    <option>Female</option>
                    <option>Male</option>
                    <option>NA</option>
                    <option>Unisex</option>
                  </select>
                  <select className="edit-customer-select" style={{ width: '60px' }}>
                    <option></option>
                    <option>Dr.</option>
                    <option>Miss</option>
                    <option>Mr.</option>
                    <option>Mrs.</option>
                  </select>
                  <input className="edit-customer-input" value={customer?.firstName || ''} style={{ width: '100px' }} />
                  <input className="edit-customer-input" value={customer?.lastName || ''} style={{ width: '100px' }} />
                  <select className="edit-customer-select" style={{ width: '55px' }}>{months.map(m => <option key={m}>{m}</option>)}</select>
                  <select className="edit-customer-select" style={{ width: '50px' }}>{days.map(d => <option key={d}>{d}</option>)}</select>
                  <input className="edit-customer-input" value={customer?.mobile || '(567) 555-7707'} style={{ width: '90px' }} />
                  <input className="edit-customer-input" value={customer?.email || 'daniel.zeiger@luxare.com'} style={{ width: '130px' }} />
                  <input className="edit-customer-input" style={{ width: '90px' }} />
                  <input className="edit-customer-input" style={{ width: '70px' }} />
                </div>

                <div className="edit-customer-form-row">
                  <div className="edit-customer-label">Significant Other :</div>
                  <select className="edit-customer-select" style={{ width: '80px' }}>
                    <option></option>
                    <option>Female</option>
                    <option>Male</option>
                    <option>NA</option>
                    <option>Unisex</option>
                  </select>
                  <select className="edit-customer-select" style={{ width: '60px' }}>
                    <option></option>
                    <option>Dr.</option>
                    <option>Miss</option>
                    <option>Mr.</option>
                    <option>Mrs.</option>
                  </select>
                  <input className="edit-customer-input" style={{ width: '100px' }} />
                  <input className="edit-customer-input" style={{ width: '100px' }} />
                  <select className="edit-customer-select" style={{ width: '55px' }}>{months.map(m => <option key={m}>{m}</option>)}</select>
                  <select className="edit-customer-select" style={{ width: '50px' }}>{days.map(d => <option key={d}>{d}</option>)}</select>
                  <input className="edit-customer-input" style={{ width: '90px' }} />
                  <input className="edit-customer-input" style={{ width: '130px' }} />
                  <input className="edit-customer-input" style={{ width: '90px' }} />
                  <input className="edit-customer-input" style={{ width: '70px' }} />
                </div>

                <div className="edit-customer-form-row" style={{ marginTop: '10px' }}>
                  <div className="edit-customer-label">Marital Status</div>
                  <select className="edit-customer-select" style={{ width: '150px' }}></select>
                  <div className="edit-customer-label" style={{ width: '110px' }}>Engagement Date</div>
                  <select className="edit-customer-select" style={{ width: '55px' }}>{months.map(m => <option key={m}>{m}</option>)}</select>
                  <select className="edit-customer-select" style={{ width: '50px' }}>{days.map(d => <option key={d}>{d}</option>)}</select>
                  <input className="edit-customer-input" style={{ width: '50px' }} />
                  <div className="edit-customer-label" style={{ width: '110px' }}>Anniversary Date</div>
                  <select className="edit-customer-select" style={{ width: '55px' }}>{months.map(m => <option key={m}>{m}</option>)}</select>
                  <select className="edit-customer-select" style={{ width: '50px' }}>{days.map(d => <option key={d}>{d}</option>)}</select>
                  <input className="edit-customer-input" style={{ width: '50px' }} />
                </div>

                <div className="edit-customer-form-row">
                  <div className="edit-customer-label">How did you hear about us ?</div>
                  <select className="edit-customer-select" style={{ width: '200px' }}>
                    <option></option>
                    <option>Facebook</option>
                    <option>Instagram</option>
                    <option>Mall Banners</option>
                    <option>Mall Stands</option>
                    <option>N/A</option>
                    <option>Newspaper</option>
                    <option>Referral</option>
                    <option>Twitter</option>
                    <option>Youtube</option>
                  </select>
                  <div className="edit-customer-label" style={{ width: '90px' }}>Referred By:</div>
                  <input className="edit-customer-input" style={{ width: '200px' }} />
                </div>

                <div className="edit-customer-form-row">
                  <div className="edit-customer-label">Points of Engagement:</div>
                  <input className="edit-customer-input" value={engagementCode} onChange={(e) => setEngagementCode(e.target.value)} style={{ width: '170px' }} />
                  <button className="edit-customer-lookup-btn" onClick={() => setShowEngagementLookup(true)}>LU</button>
                  <div className="edit-customer-label" style={{ width: '120px' }}>Client Demographic:</div>
                  <input className="edit-customer-input" value={demographicCode} onChange={(e) => setDemographicCode(e.target.value)} style={{ width: '170px' }} />
                  <button className="edit-customer-lookup-btn" onClick={() => setShowDemographicLookup(true)}>LU</button>
                </div>

                <div className="edit-customer-form-row">
                  <div className="edit-customer-label">Preferred Language:</div>
                  <input className="edit-customer-input" value={languageCode} onChange={(e) => setLanguageCode(e.target.value)} style={{ width: '170px' }} />
                  <button className="edit-customer-lookup-btn" onClick={() => setShowLanguageLookup(true)}>LU</button>
                  <div className="edit-customer-label" style={{ width: '120px' }}>Rating</div>
                  <select className="edit-customer-select" style={{ width: '170px' }}>
                    <option></option>
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                  </select>
                </div>

                <div style={{ marginTop: '10px', fontSize: '11px', textTransform: 'uppercase', paddingLeft: '50px' }}>
                  PRIMARY RESIDENTIAL ADDRESS
                </div>

                <div className="edit-customer-form-row">
                  <div className="edit-customer-label">Attn/Co</div>
                  <input className="edit-customer-input" style={{ width: '150px' }} />
                  <input className="edit-customer-input" style={{ width: '150px' }} />
                </div>

                <div className="edit-customer-form-row">
                  <div className="edit-customer-label">Address</div>
                  <input className="edit-customer-input" value={customer?.addressLine || 'Ocean Parkway'} style={{ width: '400px' }} />
                </div>

                <div className="edit-customer-form-row">
                  <div className="edit-customer-label"></div>
                  <input className="edit-customer-input" style={{ width: '400px' }} />
                </div>

                <div className="edit-customer-form-row" style={{ alignItems: 'flex-start' }}>
                  <div className="edit-customer-label">Address Instructions</div>
                  <textarea className="edit-customer-input" style={{ width: '400px', height: '40px', resize: 'none' }}></textarea>
                </div>

                <div className="edit-customer-form-row">
                  <div className="edit-customer-label">City</div>
                  <input className="edit-customer-input" value={customer?.city || 'Brooklyn'} style={{ width: '120px' }} />
                  <div className="edit-customer-label" style={{ width: '80px' }}>State/ Province</div>
                  <select className="edit-customer-select" defaultValue={customer?.stateName || 'NY'} style={{ width: '60px' }}>
                    {states.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <div className="edit-customer-label" style={{ width: '30px' }}>Zip</div>
                  <input className="edit-customer-input" value={customer?.zip || '11218'} style={{ width: '60px' }} />
                </div>

                <div className="edit-customer-form-row">
                  <div className="edit-customer-label">Country</div>
                  <select className="edit-customer-select" style={{ width: '120px' }}>
                    {countries.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className="edit-customer-form-row" style={{ marginTop: '20px', paddingLeft: '50px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '11px' }}>Do Not Email</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '40px' }}>
                    <span style={{ fontSize: '11px' }}>Do Not Mail</span>
                    <input type="checkbox" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '40px' }}>
                    <span style={{ fontSize: '11px' }}>Snail Email Opt Out</span>
                    <input type="checkbox" />
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div style={{ flex: 1, paddingRight: '20px' }}>
                <div className="edit-customer-buys-on-box">
                  <div className="edit-customer-buys-on-header">Buys On</div>

                  <div className="edit-customer-buys-on-row">
                    <span>Birthday</span><input type="checkbox" />
                  </div>
                  <div className="edit-customer-buys-on-row">
                    <span>S/O Birthday</span><input type="checkbox" />
                  </div>
                  <div className="edit-customer-buys-on-row">
                    <span>Anniversary</span><input type="checkbox" />
                  </div>
                  <div className="edit-customer-buys-on-row">
                    <span>Christmas</span><input type="checkbox" />
                  </div>
                  <div className="edit-customer-buys-on-row">
                    <span>Special Sales</span><input type="checkbox" />
                  </div>
                  <div className="edit-customer-buys-on-row">
                    <span>Event</span><input type="checkbox" />
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <input className="edit-customer-input" placeholder="Event Name" style={{ width: '100%', boxSizing: 'border-box' }} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                    <input className="edit-customer-input" style={{ width: '100px' }} />
                    <button style={{ padding: '0', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}>📷</button>
                  </div>

                  <div style={{ marginTop: '10px', height: '100px', border: '1px dashed #ccc', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px', color: '#ccc' }}>📷</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTopTab === 'Purchase' && (
            <div className="edit-customer-purchase-container">
              {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading purchases...</div>
              ) : (
                <table className="edit-customer-purchase-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Store #</th>
                      <th>Trans #</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Department</th>
                      <th>Brand</th>
                      <th>Style/SKU</th>
                      <th>Serial #</th>
                      <th>Description</th>
                      <th>Salesp</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Tax Amt</th>
                      <th>Discount</th>
                      <th>Ext.Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.map((row, i) => (
                        <tr key={i}>
                          <td style={{ textAlign: 'center' }}>📷</td>
                          <td>{row.storeNo}</td>
                          <td>{row.transNo}</td>
                          <td>{row.date}</td>
                          <td>{row.type}</td>
                          <td>{row.category}</td>
                          <td>{row.department}</td>
                          <td>{row.brand}</td>
                          <td>{row.styleSku}</td>
                          <td>{row.serialNo}</td>
                          <td>{row.description}</td>
                          <td>{row.salesperson}</td>
                          <td style={{ textAlign: 'right' }}>{row.qty}</td>
                          <td style={{ textAlign: 'right' }}>{row.price}</td>
                          <td style={{ textAlign: 'right' }}>{row.taxAmt}</td>
                          <td style={{ textAlign: 'right' }}>{row.discount}</td>
                          <td style={{ textAlign: 'right' }}>{row.extPrice}</td>
                        </tr>
                      ))}
                      {[...Array(Math.max(0, 15 - tabData.length))].map((_, i) => (
                        <tr key={`empty-${i}`}>
                          <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTopTab === 'Appraisal' && (
            <div className="edit-customer-purchase-container">
              {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading appraisal...</div>
              ) : (
                <table className="edit-customer-purchase-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Trans #</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Department</th>
                      <th>Style/SKU #</th>
                      <th>Serial #</th>
                      <th>Description</th>
                      <th>Salesperson #</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Discount</th>
                      <th>Ext.Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.length > 0 ? (
                      tabData.map((row, i) => (
                        <tr key={i}>
                          <td>📷</td><td>{row.transNo}</td><td>{row.date}</td><td>{row.type}</td><td>{row.category}</td><td>{row.department}</td><td>{row.styleSku}</td><td>{row.serialNo}</td><td>{row.description}</td><td>{row.salesperson}</td><td>{row.qty}</td><td>{row.price}</td><td>{row.discount}</td><td>{row.extPrice}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="14" style={{ textAlign: 'center' }}>No appraisal data found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTopTab === 'Receivables' && (
            <div className="edit-customer-purchase-container">
              {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading receivables...</div>
              ) : (
                <table className="edit-customer-purchase-table">
                  <thead>
                    <tr>
                      <th>Customer #</th>
                      <th>Store #</th>
                      <th>Trans Bk</th>
                      <th>Trans #</th>
                      <th>Trans Date</th>
                      <th>Due Date</th>
                      <th>Reward Type</th>
                      <th>Net Amt</th>
                      <th>Balance Amt</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.length > 0 ? (
                      tabData.map((row, i) => (
                        <tr key={i}>
                          <td>{row.customerId}</td><td>{row.storeNo}</td><td>{row.transBk}</td><td>{row.transNo}</td><td>{row.transDate}</td><td>{row.dueDate}</td><td>{row.rewardType}</td><td>{row.netAmt}</td><td>{row.balanceAmt}</td><td>{row.description}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" style={{ textAlign: 'center' }}>No receivables data found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTopTab === 'Wishlist' && (
            <div className="edit-customer-purchase-container">
              {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading wishlist...</div>
              ) : (
                <table className="edit-customer-purchase-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Date</th>
                      <th>Description</th>
                      <th>SalesPerson #</th>
                      <th>Retail Price</th>
                      <th>Store Invn</th>
                      <th>Other Store Invn</th>
                      <th>Interest Level</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.length > 0 ? (
                      tabData.map((row, i) => (
                        <tr key={i}>
                          <td>📷</td><td>{row.date}</td><td>{row.description}</td><td>{row.salesperson}</td><td>{row.retailPrice}</td><td>{row.storeInvn}</td><td>{row.otherStoreInvn}</td><td>{row.interestLevel}</td><td>{""}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center' }}>No wishlist data found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTopTab === 'Order' && (
            <div className="edit-customer-purchase-container">
              {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading order...</div>
              ) : (
                <table className="edit-customer-purchase-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Transaction</th>
                      <th>Due Date</th>
                      <th>Description</th>
                      <th>Salesperson #</th>
                      <th>Open Qty</th>
                      <th>Price / Discount / Total</th>
                      <th>Approve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.map((row, i) => (
                        <tr key={i}>
                          <td>📷</td><td>{row.transactionNo}</td><td>{row.dueDate}</td><td>{row.description}</td><td>{row.salesperson}</td><td>{row.qty}</td><td>{row.price}</td><td>{""}</td>
                        </tr>
                      ))}
                      {[...Array(Math.max(0, 15 - tabData.length))].map((_, i) => (
                        <tr key={`empty-${i}`}>
                          <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTopTab === 'Repair' && (
            <div className="edit-customer-purchase-container">
              {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading repair...</div>
              ) : (
                <table className="edit-customer-purchase-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Transaction</th>
                      <th>Due Date</th>
                      <th>Description</th>
                      <th>Salesperson #</th>
                      <th>Repair Charge</th>
                      <th>Order Status</th>
                      <th>Approve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.map((row, i) => (
                        <tr key={i}>
                          <td>📷</td><td>{row.transactionNo}</td><td>{row.dueDate}</td><td>{row.description}</td><td>{row.salesperson}</td><td>{row.repairCharge}</td><td>{row.orderStatus}</td><td>{row.approved}</td>
                        </tr>
                      ))}
                      {[...Array(Math.max(0, 15 - tabData.length))].map((_, i) => (
                        <tr key={`empty-${i}`}>
                          <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTopTab === 'Family' && (
            <div className="edit-customer-purchase-container">
              {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading family...</div>
              ) : (
                <table className="edit-customer-purchase-table">
                  <thead>
                    <tr>
                      <th>Customer #</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Birth Date</th>
                      <th>Anniversary</th>
                      <th>Significant Other Name</th>
                      <th>Significant Other Birth Date</th>
                      <th>Phone</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.length > 0 ? (
                      tabData.map((row, i) => (
                        <tr key={i}>
                          <td>{row.customerId}</td><td>{row.firstName}</td><td>{row.lastName}</td><td>{row.birthDate}</td><td>{row.anniversary}</td><td>{row.significantOtherName}</td><td>{row.significantOtherBirthDate}</td><td>{row.phone}</td><td>{row.email}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center' }}>No family data found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTopTab === 'Family Transaction' && (
            <div className="edit-customer-purchase-container">
              {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading family transaction...</div>
              ) : (
                <table className="edit-customer-purchase-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Customer #</th>
                      <th>Transaction</th>
                      <th>Description</th>
                      <th>Salesperson #</th>
                      <th>Qty</th>
                      <th>Price / Discount / Total</th>
                      <th>Ext. Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.length > 0 ? (
                      tabData.map((row, i) => (
                        <tr key={i}>
                          <td>📷</td><td>{row.customerId}</td><td>{row.transactionNo}</td><td>{row.description}</td><td>{row.salesperson}</td><td>{row.qty}</td><td>{row.price}</td><td>{row.extPrice}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center' }}>No family transaction data found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTopTab === 'Gift Card' && (
            <div className="edit-customer-purchase-container">
              {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading gift card...</div>
              ) : (
                <table className="edit-customer-purchase-table">
                  <thead>
                    <tr>
                      <th>Gift card #</th>
                      <th>Value</th>
                      <th>Balance Amt</th>
                      <th>Charge Value</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.length > 0 ? (
                      tabData.map((row, i) => (
                        <tr key={i}>
                          <td>{row.id}</td><td>{row.value}</td><td>{row.balanceAmt}</td><td>{row.chargeValue}</td><td>{row.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center' }}>No gift card data found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTopTab === 'Gift Certificate' && (
            <div className="edit-customer-purchase-container">
              {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading gift certificate...</div>
              ) : (
                <table className="edit-customer-purchase-table">
                  <thead>
                    <tr>
                      <th>Gift Certificate #</th>
                      <th>Value</th>
                      <th>Expiry Date</th>
                      <th>Remarks</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabData.length > 0 ? (
                      tabData.map((row, i) => (
                        <tr key={i}>
                          <td>{row.id}</td><td>{row.value}</td><td>{row.expiryDate}</td><td>{row.remarks}</td><td>{row.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center' }}>No gift certificate data found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTopTab !== 'Customer' && activeTopTab !== 'Purchase' && activeTopTab !== 'Appraisal' && activeTopTab !== 'Receivables' && activeTopTab !== 'Wishlist' && activeTopTab !== 'Order' && activeTopTab !== 'Repair' && activeTopTab !== 'Family' && activeTopTab !== 'Family Transaction' && activeTopTab !== 'Gift Card' && activeTopTab !== 'Gift Certificate' && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              {activeTopTab} tab contents would go here...
            </div>
          )}

          {activeTopTab === 'Customer' && activeSubTab === 'Detail' && (
            <div style={{ display: 'flex', padding: '40px 20px', gap: '40px', fontSize: '12px', color: '#000' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex' }}><div style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>Start Date :</div><div>09/05/2023</div></div>
                <div style={{ display: 'flex' }}><div style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>Name :</div><div>{customer?.firstName} {customer?.lastName}</div></div>
                <div style={{ display: 'flex' }}><div style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>Address :</div><div>{customer?.addressLine || ''}</div></div>
                <div style={{ display: 'flex', marginTop: '10px' }}><div style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>City/State/Zip :</div><div>{customer?.city || ''},{customer?.stateName || customer?.state || ''},{customer?.zipCode || customer?.zip || ''}</div></div>
                <div style={{ display: 'flex' }}><div style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>Email :</div><div>{customer?.email || ''}</div></div>
                <div style={{ display: 'flex' }}><div style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>Phone/Fax :</div><div>{customer?.mobile || customer?.phone || ''},</div></div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex' }}><div style={{ width: '180px', textAlign: 'right', paddingRight: '10px' }}>Customer LifeTime Value :</div><div>0.00</div></div>
                <div style={{ display: 'flex' }}><div style={{ width: '180px', textAlign: 'right', paddingRight: '10px' }}>Average Transaction Value :</div><div></div></div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', gap: '10px' }}><div style={{ width: '60px', textAlign: 'right' }}>2026 :</div><div>0.00</div></div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}><div style={{ width: '60px', textAlign: 'right' }}>2025 :</div><div>0.00</div></div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}><div style={{ width: '60px', textAlign: 'right' }}>2024 :</div><div>0.00</div></div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex' }}><div style={{ width: '150px', textAlign: 'right', paddingRight: '10px' }}>Last Transaction Date :</div><div></div></div>
                <div style={{ display: 'flex' }}><div style={{ width: '150px', textAlign: 'right', paddingRight: '10px' }}>Last Transaction Value :</div><div></div></div>
                <div style={{ display: 'flex', marginTop: '10px' }}><div style={{ width: '150px', textAlign: 'right', paddingRight: '10px' }}>Credit Memo</div><div>0.00</div></div>
                <div style={{ display: 'flex' }}><div style={{ width: '150px', textAlign: 'right', paddingRight: '10px' }}>Rewards :</div><div></div></div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                  <div style={{ width: '80px', height: '80px', border: '1px dashed #ccc', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '16px' }}>📷</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTopTab === 'Customer' && activeSubTab === 'Address' && (
            <div style={{ display: 'flex', padding: '10px', gap: '20px', height: '100%' }}>
              <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                <table className="edit-customer-purchase-table" style={{ marginTop: '0' }}>
                  <thead>
                    <tr>
                      <th>Code</th><th>First Name</th><th>Last Name</th><th>Address Type</th><th>Address #1</th><th>Address #2</th><th>City</th><th>State</th><th>Zip</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      onClick={() => setSelectedAddress({
                        customerId: customer?.customerId || 'DRER-00...',
                        firstName: customer?.firstName || '',
                        lastName: customer?.lastName || '',
                        addressLine: customer?.addressLine || 'Dias - 66 7th ave',
                        city: customer?.city || 'Brooklyn',
                        state: customer?.stateName || customer?.state || 'NY',
                        zip: customer?.zipCode || customer?.zip || '11217',
                        country: customer?.country || 'USA',
                        phone: customer?.phone || '',
                        email: customer?.email || '',
                        mobile: customer?.mobile || ''
                      })}
                      style={{ cursor: 'pointer', backgroundColor: selectedAddress ? '#e0f0ff' : 'transparent' }}
                    >
                      <td>{customer?.customerId || 'DRER-00...'}</td><td>{customer?.firstName || ''}</td><td>{customer?.lastName || ''}</td><td></td><td>{customer?.addressLine || 'Dias - 66 7th ave'}</td><td></td><td>{customer?.city || 'Brooklyn'}</td><td>{customer?.stateName || customer?.state || 'NY'}</td><td>{customer?.zipCode || customer?.zip || '11217'}</td>
                    </tr>
                    {/* empty rows to fill space */}
                    {[...Array(8)].map((_, i) => <tr key={i}><td colSpan="9">&nbsp;</td></tr>)}
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                  <button className="edit-customer-action-btn" onClick={() => setSelectedAddress(null)}>New</button>
                  <button className="edit-customer-action-btn">Save</button>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px', fontSize: '11px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100px', textAlign: 'right', paddingRight: '5px' }}>First/Last Name</div>
                  <input className="edit-customer-input" style={{ width: '80px' }} value={selectedAddress?.firstName || ''} onChange={e => setSelectedAddress({ ...selectedAddress, firstName: e.target.value })} />
                  <input className="edit-customer-input" style={{ width: '80px', marginLeft: '5px' }} value={selectedAddress?.lastName || ''} onChange={e => setSelectedAddress({ ...selectedAddress, lastName: e.target.value })} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100px', textAlign: 'right', paddingRight: '5px' }}>Address Type</div>
                  <select className="edit-customer-select" style={{ width: '165px' }} value={selectedAddress?.addressType || ''} onChange={e => setSelectedAddress({ ...selectedAddress, addressType: e.target.value })}>
                    <option></option>
                    <option>Primary Billing Address</option>
                    <option>Business Address</option>
                    <option>Secondary Billing Address</option>
                    <option>Secondary Mailing Address</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100px', textAlign: 'right', paddingRight: '5px' }}>Attn/CO</div>
                  <input className="edit-customer-input" style={{ width: '80px' }} value={selectedAddress?.attn || ''} onChange={e => setSelectedAddress({ ...selectedAddress, attn: e.target.value })} />
                  <input className="edit-customer-input" style={{ width: '80px', marginLeft: '5px' }} value={selectedAddress?.co || ''} onChange={e => setSelectedAddress({ ...selectedAddress, co: e.target.value })} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100px', textAlign: 'right', paddingRight: '5px' }}>Address #1</div>
                  <input className="edit-customer-input" style={{ width: '165px' }} value={selectedAddress?.addressLine || ''} onChange={e => setSelectedAddress({ ...selectedAddress, addressLine: e.target.value })} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100px', textAlign: 'right', paddingRight: '5px' }}>#2</div>
                  <input className="edit-customer-input" style={{ width: '165px' }} value={selectedAddress?.address2 || ''} onChange={e => setSelectedAddress({ ...selectedAddress, address2: e.target.value })} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100px', textAlign: 'right', paddingRight: '5px' }}>City</div>
                  <input className="edit-customer-input" style={{ width: '100px' }} value={selectedAddress?.city || ''} onChange={e => setSelectedAddress({ ...selectedAddress, city: e.target.value })} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100px', textAlign: 'right', paddingRight: '5px' }}>State/Zip</div>
                  <select className="edit-customer-select" style={{ width: '60px' }} value={selectedAddress?.state || ''} onChange={e => setSelectedAddress({ ...selectedAddress, state: e.target.value })}>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input className="edit-customer-input" style={{ width: '100px', marginLeft: '5px' }} value={selectedAddress?.zip || ''} onChange={e => setSelectedAddress({ ...selectedAddress, zip: e.target.value })} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100px', textAlign: 'right', paddingRight: '5px' }}>Country</div>
                  <select className="edit-customer-select" style={{ width: '100px' }} value={selectedAddress?.country || 'USA'} onChange={e => setSelectedAddress({ ...selectedAddress, country: e.target.value })}>
                    {['None', 'USA', 'Afghanistan', 'Aland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100px', textAlign: 'right', paddingRight: '5px' }}>Phone/Fax</div>
                  <input className="edit-customer-input" style={{ width: '80px' }} value={selectedAddress?.phone || ''} onChange={e => setSelectedAddress({ ...selectedAddress, phone: e.target.value })} />
                  <input className="edit-customer-input" style={{ width: '80px', marginLeft: '5px' }} value={selectedAddress?.fax || ''} onChange={e => setSelectedAddress({ ...selectedAddress, fax: e.target.value })} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100px', textAlign: 'right', paddingRight: '5px' }}>Email</div>
                  <input className="edit-customer-input" style={{ width: '165px' }} value={selectedAddress?.email || ''} onChange={e => setSelectedAddress({ ...selectedAddress, email: e.target.value })} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100px', textAlign: 'right', paddingRight: '5px' }}>Mobile</div>
                  <input className="edit-customer-input" style={{ width: '100px' }} value={selectedAddress?.mobile || ''} onChange={e => setSelectedAddress({ ...selectedAddress, mobile: e.target.value })} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                  <div style={{ width: '100px', textAlign: 'right', paddingRight: '5px' }}>USA</div>
                  <input type="checkbox" checked={selectedAddress?.country === 'USA'} onChange={e => setSelectedAddress({ ...selectedAddress, country: e.target.checked ? 'USA' : 'None' })} />
                </div>
              </div>
            </div>
          )}

          {activeTopTab === 'Customer' && activeSubTab === 'Other Information' && (
            <div style={{ padding: '20px', fontSize: '11px', color: '#000' }}>
              <div style={{ display: 'flex', gap: '40px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: '140px', textAlign: 'right', paddingRight: '10px' }}>Insurance Broker</div><input className="edit-customer-input" style={{ width: '200px' }} /></div>
                  <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: '140px', textAlign: 'right', paddingRight: '10px' }}>Home Phone</div><input className="edit-customer-input" style={{ width: '200px' }} /></div>
                  <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: '140px', textAlign: 'right', paddingRight: '10px' }}>Fax No</div><input className="edit-customer-input" style={{ width: '200px' }} /></div>

                  <div style={{ marginTop: '15px', marginBottom: '5px' }}>Work Information:</div>
                  <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: '140px', textAlign: 'right', paddingRight: '10px' }}>WorkPlace</div><input className="edit-customer-input" style={{ width: '200px' }} /></div>
                  <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: '140px', textAlign: 'right', paddingRight: '10px' }}>Work Email</div><input className="edit-customer-input" style={{ width: '200px' }} /></div>
                  <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: '140px', textAlign: 'right', paddingRight: '10px' }}>Assistant</div><input className="edit-customer-input" style={{ width: '200px' }} /></div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>Secondary Email</div><input className="edit-customer-input" style={{ width: '200px' }} /></div>
                  <div style={{ marginTop: '70px', display: 'flex', alignItems: 'center' }}><div style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>Work Title</div><input className="edit-customer-input" style={{ width: '200px' }} /></div>
                  <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>Work Fax</div><input className="edit-customer-input" style={{ width: '200px' }} /></div>
                  <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>Assistant Phone</div><input className="edit-customer-input" style={{ width: '200px' }} /></div>
                </div>
              </div>

              <div style={{ marginTop: '20px', marginBottom: '5px' }}>Important Dates:</div>
              <div style={{ display: 'flex', gap: '40px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '140px', textAlign: 'right', paddingRight: '10px' }}>Important Date {i} Label</div>
                      <input className="edit-customer-input" style={{ width: '200px' }} />
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '120px', textAlign: 'right', paddingRight: '10px' }}>Important Date {i}</div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input type="date" className="edit-customer-input" style={{ width: '120px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTopTab === 'Customer' && activeSubTab === 'Salesperson' && (
            <div style={{ padding: '10px', height: '100%' }}>
              <table className="edit-customer-purchase-table" style={{ marginTop: '0' }}>
                <thead>
                  <tr>
                    <th>From Date</th><th>To Date</th><th>Code</th><th>Customer Owner</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', height: '300px', verticalAlign: 'top', paddingTop: '20px' }}>No Salesperson data found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTopTab === 'Customer' && activeSubTab === 'Store Credit' && (
            <div style={{ padding: '10px', height: '100%' }}>
              <table className="edit-customer-purchase-table" style={{ marginTop: '0' }}>
                <thead>
                  <tr>
                    <th>Credit Issued Date</th><th>Store Credit #</th><th>Balance Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', height: '300px', verticalAlign: 'top', paddingTop: '20px' }}>No Store Credit data found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTopTab === 'Customer' && activeSubTab === 'Notes' && (
            <div style={{ display: 'flex', padding: '20px', gap: '40px', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '5px', color: '#000' }}>Popup Notes</div>
                  <textarea className="edit-customer-input" style={{ height: '100px', resize: 'none' }}></textarea>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '5px', color: '#000' }}>Customer Description</div>
                  <textarea className="edit-customer-input" style={{ height: '100px', resize: 'none' }}></textarea>
                </div>
              </div>
              <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '5px', color: '#000' }}>Detailed Notes</div>
                <textarea className="edit-customer-input" style={{ flex: 1, minHeight: '220px', resize: 'none' }}></textarea>
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                  <input type="range" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          )}

          {activeTopTab === 'Customer' && activeSubTab === 'Interests' && (
            <div style={{ padding: '10px', height: '100%' }}>
              <table className="edit-customer-purchase-table" style={{ marginTop: '0', width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: '25%' }}>Name</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Interests' },
                    { name: 'Watch Brand' },
                    { name: 'Preowned Watch Brands' },
                    { name: 'Jewelry Type' },
                    { name: 'Jewelry Brand' },
                    { name: 'Other Product Types' },
                    { name: 'Other Product Brands' }
                  ].map((item, idx) => (
                    <tr key={item.name} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f0f4f8' }}>
                      <td style={{ padding: '8px' }}>{item.name}</td>
                      <td style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input
                          className="edit-customer-input"
                          value={interestValues[item.name] || ''}
                          onChange={e => setInterestValues({ ...interestValues, [item.name]: e.target.value })}
                          style={{ flex: 1, backgroundColor: '#f9f9f9' }}
                        />
                        <button
                          className="edit-customer-action-btn"
                          style={{ padding: '2px 8px', minWidth: 'auto', background: 'linear-gradient(to bottom, #7b9ed8, #426cb4)', color: 'white' }}
                          onClick={() => {
                            setActiveLookupField(item.name);
                            setShowInterestsLookup(true);
                          }}
                        >📖</button>
                      </td>
                    </tr>
                  ))}
                  <tr><td colSpan="2" style={{ height: '200px', borderBottom: 'none' }}></td></tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTopTab === 'Customer' && activeSubTab === 'Affiliation' && (
            <div style={{ padding: '10px', height: '100%' }}>
              <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>➕</button>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', color: 'red' }}>➖</button>
              </div>
              <table className="edit-customer-purchase-table" style={{ marginTop: '0' }}>
                <thead>
                  <tr>
                    <th>Relationship</th><th>Customer #</th><th>First Name</th><th>Last Name</th><th>Birth Date</th><th>Anniversary</th><th>Phone</th><th>Email</th><th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10)].map((_, i) => <tr key={i}><td colSpan="9">&nbsp;</td></tr>)}
                </tbody>
              </table>
            </div>
          )}

          {activeTopTab === 'Customer' && activeSubTab === 'Finger Size(Self)' && (
            <div style={{ display: 'flex', padding: '20px', gap: '20px', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px', color: '#000' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: '120px' }}>Chain Size</div><input className="edit-customer-input" placeholder="Chain" style={{ width: '80px', fontStyle: 'italic', color: '#999', textAlign: 'center' }} /></div>
                <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: '120px' }}>Strap Size</div><input className="edit-customer-input" placeholder="Strap" style={{ width: '80px', fontStyle: 'italic', color: '#999', textAlign: 'center' }} /></div>
                <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: '120px' }}>Ears Pierced</div><input type="checkbox" /></div>
                <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: '120px' }}>Number of Piercing</div><input className="edit-customer-input" style={{ width: '80px' }} /></div>
                <div style={{ marginTop: '10px' }}>Customer Sizing Notes</div>
                <textarea className="edit-customer-input" style={{ width: '100%', height: '100px', resize: 'none' }}></textarea>
              </div>

              <div style={{ flex: 2, display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'relative', width: '300px', height: '400px', backgroundColor: '#fff', border: '1px solid #eee' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '24px' }}>✋ Left Hand</div>
                  <input className="edit-customer-input" placeholder="Pinky" style={{ position: 'absolute', top: '120px', left: '-10px', width: '45px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Ring" style={{ position: 'absolute', top: '20px', left: '70px', width: '45px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Middle" style={{ position: 'absolute', top: '10px', left: '125px', width: '45px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Index" style={{ position: 'absolute', top: '20px', left: '180px', width: '45px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Thumb" style={{ position: 'absolute', top: '150px', right: '-10px', width: '50px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Wrist" style={{ position: 'absolute', bottom: '10px', left: '10px', width: '50px', fontStyle: 'italic', textAlign: 'center' }} />
                </div>
              </div>

              <div style={{ flex: 2, display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'relative', width: '300px', height: '400px', backgroundColor: '#fff', border: '1px solid #eee' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '24px' }}>✋ Right Hand</div>
                  <input className="edit-customer-input" placeholder="Thumb" style={{ position: 'absolute', top: '150px', left: '-10px', width: '50px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Index" style={{ position: 'absolute', top: '20px', left: '70px', width: '45px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Middle" style={{ position: 'absolute', top: '10px', left: '125px', width: '45px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Ring" style={{ position: 'absolute', top: '20px', left: '180px', width: '45px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Pinky" style={{ position: 'absolute', top: '120px', right: '-10px', width: '45px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Wrist" style={{ position: 'absolute', bottom: '10px', right: '10px', width: '50px', fontStyle: 'italic', textAlign: 'center' }} />
                </div>
              </div>
            </div>
          )}

          {activeTopTab === 'Customer' && activeSubTab === 'Finger Size(Significant Other)' && (
            <div style={{ display: 'flex', padding: '20px', gap: '20px', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px', color: '#000' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: '120px' }}>Chain Size</div><input className="edit-customer-input" placeholder="Chain" style={{ width: '80px', fontStyle: 'italic', color: '#999', textAlign: 'center' }} /></div>
                <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: '120px' }}>Strap Size</div><input className="edit-customer-input" placeholder="Strap" style={{ width: '80px', fontStyle: 'italic', color: '#999', textAlign: 'center' }} /></div>
                <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: '120px' }}>Ears Pierced</div><input type="checkbox" /></div>
                <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: '120px' }}>Number of Piercing</div><input className="edit-customer-input" style={{ width: '80px' }} /></div>
                <div style={{ marginTop: '10px' }}>Customer Sizing Notes</div>
                <textarea className="edit-customer-input" style={{ width: '100%', height: '100px', resize: 'none' }}></textarea>
              </div>

              <div style={{ flex: 2, display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'relative', width: '300px', height: '400px', backgroundColor: '#fff', border: '1px solid #eee' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '24px' }}>✋ Left Hand</div>
                  <input className="edit-customer-input" placeholder="Pinky" style={{ position: 'absolute', top: '120px', left: '-10px', width: '45px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Ring" style={{ position: 'absolute', top: '20px', left: '70px', width: '45px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Middle" style={{ position: 'absolute', top: '10px', left: '125px', width: '45px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Index" style={{ position: 'absolute', top: '20px', left: '180px', width: '45px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Thumb" style={{ position: 'absolute', top: '150px', right: '-10px', width: '50px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Wrist" style={{ position: 'absolute', bottom: '10px', left: '10px', width: '50px', fontStyle: 'italic', textAlign: 'center' }} />
                </div>
              </div>

              <div style={{ flex: 2, display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'relative', width: '300px', height: '400px', backgroundColor: '#fff', border: '1px solid #eee' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '24px' }}>✋ Right Hand</div>
                  <input className="edit-customer-input" placeholder="Thumb" style={{ position: 'absolute', top: '150px', left: '-10px', width: '50px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Index" style={{ position: 'absolute', top: '20px', left: '70px', width: '45px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Middle" style={{ position: 'absolute', top: '10px', left: '125px', width: '45px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Ring" style={{ position: 'absolute', top: '20px', left: '180px', width: '45px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Pinky" style={{ position: 'absolute', top: '120px', right: '-10px', width: '45px', fontStyle: 'italic', textAlign: 'center' }} />
                  <input className="edit-customer-input" placeholder="Wrist" style={{ position: 'absolute', bottom: '10px', right: '10px', width: '50px', fontStyle: 'italic', textAlign: 'center' }} />
                </div>
              </div>
            </div>
          )}

          {activeTopTab === 'Customer' && !['Customer', 'Detail', 'Address', 'Other Information', 'Salesperson', 'Store Credit', 'Notes', 'Interests', 'Affiliation', 'Finger Size(Self)', 'Finger Size(Significant Other)'].includes(activeSubTab) && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              {activeSubTab} sub-tab contents would go here...
            </div>
          )}
        </div>

        <div className="edit-customer-footer">
          <button className="edit-customer-action-btn">Save</button>
          <button className="edit-customer-action-btn">Reset</button>
          <button className="edit-customer-action-btn" onClick={onClose}>Close</button>
        </div>
      </div>

      {showCategoryLookup && (
        <CategoryLookupModal
          onClose={() => setShowCategoryLookup(false)}
          onSelect={(cat) => setSelectedCategory(cat.code)}
        />
      )}

      {showFamilyLookup && (
        <FamilyCustomerLookupModal
          onClose={() => setShowFamilyLookup(false)}
          onSelect={(fam) => setFamilyId(fam.customerId)}
        />
      )}

      {showEngagementLookup && (
        <EngagementLookupModal
          onClose={() => setShowEngagementLookup(false)}
          onSelect={(eng) => setEngagementCode(eng.code)}
        />
      )}

      {showLanguageLookup && (
        <LanguageLookupModal
          onClose={() => setShowLanguageLookup(false)}
          onSelect={(lang) => setLanguageCode(lang.code)}
        />
      )}

      {showDemographicLookup && (
        <DemographicLookupModal
          onClose={() => setShowDemographicLookup(false)}
          onSelect={(demo) => setDemographicCode(demo.code)}
        />
      )}

      {showInterestsLookup && activeLookupField && (
        <InterestsLookupModal
          lookupType={activeLookupField}
          onClose={() => setShowInterestsLookup(false)}
          onSelect={(row) => {
            setInterestValues(prev => {
              const currentVal = prev[activeLookupField] || '';
              if (!currentVal.includes(row.name)) {
                return {
                  ...prev,
                  [activeLookupField]: currentVal ? `${currentVal}, ${row.name}` : row.name
                };
              }
              return prev;
            });
          }}
        />
      )}
    </div>
  );
}

export default EditCustomerModal;
