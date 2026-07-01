import React, { useState } from 'react';
import './ChangePasswordModal.css';

export default function ChangePasswordModal({ onClose }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');

  const handleChange = () => {
    if (newPassword !== retypePassword) {
      alert("New password and re-type password do not match!");
      return;
    }
    // Simulate successful password change
    alert("Password successfully changed!");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="change-password-dialog">
        <div className="dialog-header">
          <span className="dialog-title">Change Password</span>
          <button className="dialog-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="dialog-instruction">
            Please Update Your Password
          </div>
          <div className="dialog-form-group">
            <label>Old Password</label>
            <input 
              type="password" 
              value={oldPassword} 
              onChange={(e) => setOldPassword(e.target.value)} 
            />
          </div>
          <div className="dialog-form-group">
            <label>New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
            />
          </div>
          <div className="dialog-form-group">
            <label>Re-type Password</label>
            <input 
              type="password" 
              value={retypePassword} 
              onChange={(e) => setRetypePassword(e.target.value)} 
            />
          </div>
          <div className="dialog-footer-actions">
            <button className="dialog-btn-change" onClick={handleChange}>change</button>
            <button className="dialog-btn-cancel" onClick={onClose}>cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
