import React, { useState, useEffect } from 'react';
import './SalesPage.css';

function InventoryTransferPage({ onNavigate }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedOption = 'Inventory Transfer';

  const salesOptions = [
    'Inventory Transfer', 'Store Transfer', 'Store Transfer Receive', 'Store Transfer Cancel'
  ];

  // Real-time clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

      <div style={{ flex: 1, backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <button style={{
          background: 'linear-gradient(to bottom, #99baf2, #5381d6)',
          border: '1px solid #3c6ab5',
          borderRadius: '3px',
          color: 'white',
          fontWeight: 'bold',
          padding: '10px 40px',
          width: '300px',
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          textShadow: '1px 1px 1px rgba(0,0,0,0.4)'
        }}>Store Transfer</button>
        
        <button style={{
          background: 'linear-gradient(to bottom, #99baf2, #5381d6)',
          border: '1px solid #3c6ab5',
          borderRadius: '3px',
          color: 'white',
          fontWeight: 'bold',
          padding: '10px 40px',
          width: '300px',
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          textShadow: '1px 1px 1px rgba(0,0,0,0.4)'
        }}>Store Transfer Receive</button>

        <button style={{
          background: 'linear-gradient(to bottom, #99baf2, #5381d6)',
          border: '1px solid #3c6ab5',
          borderRadius: '3px',
          color: 'white',
          fontWeight: 'bold',
          padding: '10px 40px',
          width: '300px',
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          textShadow: '1px 1px 1px rgba(0,0,0,0.4)'
        }}>Store Transfer Cancel</button>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 10px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#e0e0e0', borderTop: '1px solid #999', marginTop: 'auto' }}>
        <div>current version: 5.8.9 <span style={{ marginLeft: '40px' }}>version date: 05/18/2026</span></div>
        <div style={{ color: '#555' }}>Copyright 2014-15, Diaspark Inc. USA.</div>
        <div style={{ color: '#0055aa', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); alert('Starting Remote Assistance session...'); }}>Remote Assistance</div>
      </div>
    </div>
  );
}

export default InventoryTransferPage;
