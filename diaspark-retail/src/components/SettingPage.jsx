import React, { useState, useEffect } from 'react';
import './SettingPage.css';

export default function SettingPage({ onNavigate }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="setting-page-container">
      {/* Top Header matching exactly the screenshot */}
      <div className="sales-header">
        <div className="header-left">
          <div className="home-icon" onClick={() => onNavigate('dashboard')} style={{ cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <div className="header-dropdown">
            <select className="module-select" value="Setting" readOnly>
              <option value="Setting">Setting</option>
            </select>
          </div>
        </div>
        <div className="header-right">
          <div className="header-datetime">
            {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).replace(/,/g, '')}
            {'  '}
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="header-store">Demosparkle - Edison - POS</div>
          <button className="help-btn" onClick={() => alert('Opening Help Documentation...')}>Help</button>
        </div>
      </div>

      <div className="setting-content">
        <div className="setting-main-box">
          
          <div className="setting-row">
            <div className="setting-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label>Cash Drawer Port</label>
              <select defaultValue="COM3" style={{ width: '80px', padding: '2px' }}>
                <option value="COM3">COM3</option>
                <option value="COM4">COM4</option>
                <option value="COM5">COM5</option>
              </select>
            </div>
            
            <div className="setting-group" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '30px' }}>
              <label>Is Drawer Connected ?</label>
              <input type="checkbox" />
            </div>
          </div>

          <div className="setting-row" style={{ marginTop: '15px' }}>
            <label style={{ width: '180px', textAlign: 'right', marginRight: '10px' }}>Diaspark Usb Cash Drawer Exe Path</label>
            <input type="text" style={{ flex: 1 }} />
          </div>

          <div className="setting-section">
            <h4 style={{ margin: '15px 0 5px 0', fontSize: '13px' }}>Normal Printer Setting</h4>
            <p style={{ margin: '0 0 15px 0', fontSize: '12px', fontWeight: 'bold' }}>
              (If printer is your default printer than no need to provide Printer Name,Printer Driver Name and Printer Port Name.)
            </p>

            <div className="setting-row" style={{ justifyContent: 'flex-start' }}>
              <label className="printer-label">Adobe Acrobat Path</label>
              <input type="text" style={{ width: '500px' }} />
            </div>
            
            <div className="setting-row" style={{ justifyContent: 'flex-start' }}>
              <label className="printer-label">Printer Name</label>
              <input type="text" style={{ width: '150px' }} />
            </div>
            
            <div className="setting-row" style={{ justifyContent: 'flex-start' }}>
              <label className="printer-label">Printer Driver Name</label>
              <input type="text" style={{ width: '150px' }} />
            </div>
            
            <div className="setting-row" style={{ justifyContent: 'flex-start' }}>
              <label className="printer-label">Printer Port</label>
              <input type="text" style={{ width: '150px' }} />
            </div>
          </div>

          <div className="setting-actions">
            <div className="setting-buttons">
              <button className="action-btn" onClick={() => alert('Settings saved successfully!')}>Save</button>
              <button className="action-btn" onClick={() => alert('Opening USB Cash Drawer...')}>Open Usb Drawer</button>
              <button className="action-btn" onClick={() => alert('Listing connected USB Drawers: \\n- COM3 (Active)\\n- COM4 (Offline)')}>List Usb Drawer</button>
            </div>
            <a href="#" className="reset-login-link" onClick={(e) => { e.preventDefault(); alert('Resetting login credentials to default...'); }}>Reset Login</a>
          </div>

        </div>
      </div>
    </div>
  );
}
