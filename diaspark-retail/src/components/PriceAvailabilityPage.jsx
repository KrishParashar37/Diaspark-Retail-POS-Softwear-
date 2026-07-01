import React, { useState, useEffect } from 'react';
import './SalesPage.css';

function PriceAvailabilityPage({ onNavigate }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedOption = 'Price Availability';

  const salesOptions = ['Price Availability'];

  // Real-time clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Using a book icon placeholder like in SalesPage
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

      <div style={{ flex: 1, backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
        {/* Top Search Area */}
        <div style={{ padding: '15px 20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '12px' }}>Barcode #</label>
              <input type="text" style={{ border: '1px solid #ccc', padding: '3px 5px', width: '130px', borderRadius: '10px' }} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '12px' }}>Style/ SKU #</label>
              <div className="form-input-with-icon" style={{ borderRadius: '10px', overflow: 'hidden', width: '150px' }}>
                <input type="text" style={{ width: '100%', padding: '3px 5px', border: 'none', outline: 'none' }} />
                <div className="form-input-icon"><BookIcon /></div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '12px' }}>Serial #</label>
              <div className="form-input-with-icon" style={{ borderRadius: '10px', overflow: 'hidden', width: '150px' }}>
                <input type="text" style={{ width: '100%', padding: '3px 5px', border: 'none', outline: 'none' }} />
                <div className="form-input-icon"><BookIcon /></div>
              </div>
            </div>

            <button style={{
              background: 'linear-gradient(to bottom, #72ba60, #4ca03c)', border: '1px solid #3c822e', borderRadius: '3px', color: 'white', fontWeight: 'bold', padding: '4px 15px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', textShadow: '1px 1px 1px rgba(0,0,0,0.4)', fontSize: '13px'
            }}>New</button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {['Sales', 'Return', 'Wishlist'].map((btn, idx) => (
              <button key={btn} style={{
                background: 'linear-gradient(to bottom, #7aa4db, #487ccc)',
                border: '1px solid #3461a6',
                borderRadius: '3px',
                color: 'white',
                fontWeight: 'bold',
                padding: '4px 15px',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                textShadow: '1px 1px 1px rgba(0,0,0,0.4)',
                fontSize: '13px',
                minWidth: idx === 2 ? '80px' : '60px'
              }}>{btn}</button>
            ))}
          </div>
        </div>

        {/* Data Grid */}
        <div style={{ flex: 1, borderTop: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 4fr 1fr 1fr 2fr', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ccc', padding: '5px 10px', fontWeight: 'bold', fontSize: '12px', color: '#333' }}>
            <div>Serial #</div>
            <div>Name</div>
            <div>On Hand</div>
            <div>Retail</div>
            <div></div>
          </div>
          <div style={{ flex: 1, backgroundColor: 'white', overflowY: 'auto' }}>
            {/* Blank rows to match screenshot striped look */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 4fr 1fr 1fr 2fr', borderBottom: '1px solid #eee', height: '24px', backgroundColor: i % 2 === 0 ? 'white' : '#fcfcfc' }}>
                <div style={{ borderRight: '1px solid #eee' }}></div>
                <div style={{ borderRight: '1px solid #eee' }}></div>
                <div style={{ borderRight: '1px solid #eee' }}></div>
                <div style={{ borderRight: '1px solid #eee' }}></div>
                <div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 10px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#e0e0e0', borderTop: '1px solid #999', marginTop: 'auto' }}>
        <div>current version: 5.8.9 <span style={{ marginLeft: '40px' }}>version date: 05/18/2026</span></div>
        <div style={{ color: '#555' }}>Copyright 2014-15, Diaspark Inc. USA.</div>
        <div style={{ color: '#0055aa', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); alert('Starting Remote Assistance session...'); }}>Remote Assistance</div>
      </div>
    </div>
  );
}

export default PriceAvailabilityPage;
