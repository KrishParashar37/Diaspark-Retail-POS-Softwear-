import React from 'react';
import './CustomerComponentModal.css';

const CustomerComponentModal = ({ onClose, onSave }) => {
  return (
    <div className="modal-overlay">
      <div className="customer-component-modal">
        <div className="customer-component-modal-header">
          <span>Customer Component</span>
          <button className="customer-component-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="customer-component-modal-body">
          <div className="customer-component-row">
            <label>Description</label>
            <textarea className="customer-component-textarea"></textarea>
          </div>
          
          <div className="customer-component-row">
            <label>Approx Value</label>
            <input type="text" className="customer-component-input" />
          </div>
        </div>
        
        <div className="customer-component-modal-footer">
          <button className="customer-component-btn btn-ok" onClick={() => { onSave && onSave(); onClose(); }}>OK</button>
          <button className="customer-component-btn btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerComponentModal;
