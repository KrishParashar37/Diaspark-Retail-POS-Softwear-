import React, { useState } from 'react';
import './TradeInItemDetailModal.css';

function TradeInItemDetailModal({ onClose, onSelect, defaultCategory = 'Gold Purchase' }) {
  const [category, setCategory] = useState(defaultCategory);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('0.00');

  const handleOk = () => {
    onSelect({
      sku: 'GOLD-PUR',
      description: description || 'Gold Purchase',
      qty: 1,
      price: -Math.abs(parseFloat(amount) || 0), // Trade-ins/purchases usually reduce the total or are negative items
      category: 'TRADE-IN'
    });
  };

  return (
    <div className="trade-item-overlay">
      <div className="trade-item-modal">
        <div className="trade-item-header">
          <span>Item Detail</span>
          <button className="trade-item-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="trade-item-body">
          <div className="trade-form-row">
            <label>Item Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Gold Purchase">Gold Purchase</option>
              <option value="Trade-In">Trade-In</option>
            </select>
          </div>
          
          <div className="trade-form-row align-top">
            <label>Item Description</label>
            <div className="trade-desc-container">
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="trade-camera-icon">
                {/* SVG for Camera/Picture icon */}
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#555" d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="trade-form-row">
            <label>Item Amount</label>
            <input 
              type="text" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              style={{ textAlign: 'right', width: '120px' }}
            />
          </div>
        </div>
        
        <div className="trade-item-footer">
          <button className="trade-btn" onClick={handleOk}>OK</button>
          <button className="trade-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default TradeInItemDetailModal;
