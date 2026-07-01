import React, { useState } from 'react'
import ChangePasswordModal from './ChangePasswordModal'
import './Header.css'

export default function Header({ onNavigate, onLogout }) {
  const [showChangePassword, setShowChangePassword] = useState(false);
  return (
    <div className="header">
      <div className="header-left" />
      <div className="header-center">
        <div className="logo" onClick={() => onNavigate && onNavigate('dashboard')} style={{ cursor: 'pointer' }}>
          <span className="logo-blue">DIASPARK</span><span className="logo-black"> RETAIL</span>
        </div>
        <div className="store-info">
          <span className="store-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Demosparkle
          </span>
          <span className="store-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#e53935" stroke="#e53935" strokeWidth="1.2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5" fill="white" stroke="white"/>
            </svg>
            Edison
          </span>
          <span className="store-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="7" r="4"/><path d="M4 21v-1a8 8 0 0116 0v1"/>
            </svg>
            POS
          </span>
        </div>
      </div>
      <div className="header-right">
        <div className="header-icons">
          <button className="icon-btn" title="Settings" onClick={() => onNavigate && onNavigate('setting')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
          </button>
          <button className="icon-btn" title="Logout" onClick={onLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
        <a href="#" className="change-password" onClick={(e) => { e.preventDefault(); setShowChangePassword(true); }}>Change Password</a>
      </div>
      
      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  )
}
