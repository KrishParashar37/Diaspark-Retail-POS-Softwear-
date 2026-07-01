import React, { useState, useEffect } from 'react';
import ItemLookupModal from './ItemLookupModal';
import SkuLookupModal from './SkuLookupModal';
import CategoryLookupModal from './CategoryLookupModal';
import VendorLookupModal from './VendorLookupModal';
import './SalesPage.css';

function PrintTagPage({ onNavigate }) {
  const [showItemLookup, setShowItemLookup] = useState(false);
  const [showSkuLookup, setShowSkuLookup] = useState(false);
  const [showCategoryLookup, setShowCategoryLookup] = useState(false);
  const [showVendorLookup, setShowVendorLookup] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedOption = 'Print Taq';

  const [serial, setSerial] = useState('');
  const [category, setCategory] = useState('');
  const [vendor, setVendor] = useState('');

  const salesOptions = ['Print Taq'];

  // Real-time clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const BookIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  );

  return (
    <div className="sales-page-container">
      <div className="sales-header">
        <div className="sales-header-left">
          <div className="home-btn-container">
            <button className="home-btn" onClick={() => onNavigate('dashboard')} title="Back to Dashboard">
              <svg viewBox="0 0 48 48" width="32" height="32" filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.5))">
                <rect x="12" y="24" width="24" height="18" fill="#f0f0f0" />
                <rect x="20" y="28" width="8" height="14" fill="#a0d8f0" stroke="#88b8d0" strokeWidth="1" />
                <polygon points="6,24 24,8 42,24 38,24 24,12 10,24" fill="#f89020" />
                <polygon points="10,24 24,12 38,24 36,24 24,14 12,24" fill="#ffb050" />
                <polygon points="24,8 42,24 38,24 24,12" fill="#d07010" />
              </svg>
            </button>
          </div>
          
          <div className="custom-dropdown-container">
            <div className="custom-dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="custom-dropdown-button-text">{selectedOption}</div>
              <div className="custom-dropdown-arrow">▼</div>
            </div>
            {dropdownOpen && (
              <div className="custom-dropdown-menu">
                {salesOptions.map(option => (
                  <div key={option} className={`custom-dropdown-item ${option === selectedOption ? 'active' : ''}`} onClick={() => setDropdownOpen(false)}>
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="sales-header-right">
          <span>{currentTime.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' })}</span>
          <span style={{ marginLeft: '10px' }}>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          <span style={{ margin: '0 20px', fontWeight: 'bold' }}>Demosparkle - Edison - POS</span>
          <button style={{
            background: 'linear-gradient(to bottom, #a8e063, #5fac11)',
            border: '1px solid #4a870c',
            borderRadius: '4px',
            color: 'white',
            fontWeight: 'bold',
            padding: '5px 20px',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
            textShadow: '1px 1px 1px rgba(0,0,0,0.3)'
          }}>Help</button>
        </div>
      </div>

      <div style={{ flex: 1, backgroundColor: '#f0f0f0', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', padding: '15px', gap: '40px', alignItems: 'flex-start' }}>
          
          {/* Left: Serial # */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '12px' }}>Serial #</label>
            <div className="form-input-with-icon" style={{ borderRadius: '4px', overflow: 'hidden', width: '120px', backgroundColor: 'white', border: '1px solid #ccc' }}>
              <input type="text" value={serial} onChange={(e) => setSerial(e.target.value)} style={{ width: '100%', padding: '2px 5px', border: 'none', outline: 'none' }} />
              <div className="form-input-icon" onClick={() => setShowItemLookup(true)} style={{ backgroundColor: '#86acf2', padding: '0 5px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}><BookIcon /></div>
            </div>
          </div>

          {/* Middle: Item Type, Category, Vendor #, etc */}
          <div style={{ display: 'flex', gap: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '12px' }}>Item Type</label>
                <select style={{ width: '120px', padding: '2px', border: '1px solid #ccc' }}></select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '12px' }}>Category</label>
                <div className="form-input-with-icon" style={{ borderRadius: '4px', overflow: 'hidden', width: '120px', backgroundColor: 'white', border: '1px solid #ccc' }}>
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '2px 5px', border: 'none', outline: 'none' }} />
                  <div className="form-input-icon" onClick={() => setShowCategoryLookup(true)} style={{ backgroundColor: '#86acf2', padding: '0 5px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}><BookIcon /></div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '12px' }}>Vendor #</label>
                <div className="form-input-with-icon" style={{ borderRadius: '4px', overflow: 'hidden', width: '120px', backgroundColor: 'white', border: '1px solid #ccc' }}>
                  <input type="text" value={vendor} onChange={(e) => setVendor(e.target.value)} style={{ width: '100%', padding: '2px 5px', border: 'none', outline: 'none' }} />
                  <div className="form-input-icon" onClick={() => setShowVendorLookup(true)} style={{ backgroundColor: '#86acf2', padding: '0 5px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}><BookIcon /></div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '12px' }}>Vendor Invoice #</label>
                <input type="text" style={{ width: '120px', padding: '2px 5px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '12px' }}>Print Format</label>
                <select style={{ width: '120px', padding: '2px', border: '1px solid #ccc' }}>
                  <option>Default</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right: Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
            <button style={{ background: 'linear-gradient(to bottom, #7aa4db, #487ccc)', border: '1px solid #3461a6', borderRadius: '3px', color: 'white', fontWeight: 'bold', padding: '5px 20px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', textShadow: '1px 1px 1px rgba(0,0,0,0.4)', fontSize: '14px', height: 'fit-content' }}>Search</button>
            <button style={{ background: 'linear-gradient(to bottom, #7aa4db, #487ccc)', border: '1px solid #3461a6', borderRadius: '3px', color: 'white', fontWeight: 'bold', padding: '5px 20px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', textShadow: '1px 1px 1px rgba(0,0,0,0.4)', fontSize: '14px', height: 'fit-content' }}>Reset</button>
            <button style={{ background: 'linear-gradient(to bottom, #7aa4db, #487ccc)', border: '1px solid #3461a6', borderRadius: '3px', color: 'white', fontWeight: 'bold', padding: '5px 20px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', textShadow: '1px 1px 1px rgba(0,0,0,0.4)', fontSize: '14px', height: 'fit-content', marginLeft: '15px' }}>Print</button>
          </div>
        </div>

        <div style={{ flex: 1, borderTop: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1fr 3fr 1.2fr 1fr 1fr 1fr 1fr 0.5fr', backgroundColor: '#e8e8e8', borderBottom: '1px solid #ccc', borderTop: '1px solid #fff', padding: '5px 10px', fontWeight: 'bold', fontSize: '11px', color: '#333' }}>
            <div style={{ borderRight: '1px solid #ddd' }}>Image</div>
            <div style={{ borderRight: '1px solid #ddd', paddingLeft: '5px' }}>Serial #</div>
            <div style={{ borderRight: '1px solid #ddd', paddingLeft: '5px' }}>Description</div>
            <div style={{ borderRight: '1px solid #ddd', paddingLeft: '5px' }}>Retail Price</div>
            <div style={{ borderRight: '1px solid #ddd', paddingLeft: '5px' }}>Metal</div>
            <div style={{ borderRight: '1px solid #ddd', paddingLeft: '5px' }}>Diamond</div>
            <div style={{ borderRight: '1px solid #ddd', paddingLeft: '5px' }}>Color Stone</div>
            <div style={{ borderRight: '1px solid #ddd', paddingLeft: '5px' }}>On Hand</div>
            <div style={{ paddingLeft: '5px' }}>Select</div>
          </div>
          <div style={{ flex: 1, backgroundColor: '#f0f0f0', overflowY: 'auto' }}>
            {/* Blank rows */}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 10px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#e0e0e0', borderTop: '1px solid #999', marginTop: 'auto' }}>
        <div>current version: 5.8.9 <span style={{ marginLeft: '40px' }}>version date: 05/18/2026</span></div>
        <div style={{ color: '#555' }}>Copyright 2014-15, Diaspark Inc. USA.</div>
        <div style={{ color: '#0055aa', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); alert('Starting Remote Assistance session...'); }}>Remote Assistance</div>
      </div>

      {showItemLookup && <ItemLookupModal onClose={() => setShowItemLookup(false)} onSelect={(item) => setSerial(item.serial)} />}
      {showSkuLookup && <SkuLookupModal onClose={() => setShowSkuLookup(false)} />}
      {showCategoryLookup && <CategoryLookupModal onClose={() => setShowCategoryLookup(false)} onSelect={(cat) => setCategory(cat.code)} />}
      {showVendorLookup && <VendorLookupModal onClose={() => setShowVendorLookup(false)} onSelect={(ven) => setVendor(ven.code)} />}
    </div>
  );
}

export default PrintTagPage;
