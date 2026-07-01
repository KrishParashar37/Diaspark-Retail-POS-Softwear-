import React, { useState } from 'react';
import './CashModal.css';

function CashModal({ amountDue, onClose, onAddPayment }) {
  const [tendered, setTendered] = useState(amountDue.toFixed(2));
  const [cashType, setCashType] = useState('Cash');

  const handleOk = () => {
    const parsedTendered = parseFloat(tendered);
    if (!isNaN(parsedTendered) && parsedTendered > 0) {
      onAddPayment(parsedTendered);
    }
  };

  const handleReset = () => {
    setTendered(amountDue.toFixed(2));
    setCashType('Cash');
  };

  return (
    <div className="cash-overlay">
      <div className="cash-container">
        <div className="cash-header">
          <span>Payment</span>
          <button className="cash-close-x" onClick={onClose}>&times;</button>
        </div>
        
        <div className="cash-body">
          <h3 className="cash-title">Cash Detail</h3>
          
          <div className="cash-top-section">
            <div className="cash-form-group">
              <label>Cash Amt</label>
              <input type="number" step="0.01" value={tendered} onChange={e => setTendered(e.target.value)} className="cash-amount-input" />
            </div>
            
            <div className="cash-form-group">
              <label>Cash Type</label>
              <select value={cashType} onChange={e => setCashType(e.target.value)} className="cash-type-select">
                <option value="Cash">Cash</option>
                <option value="Cashier Check">Cashier Check</option>
                <option value="Money Order">Money Order</option>
              </select>
            </div>
          </div>
          
          <div className="cash-buttons">
            <button className="cash-btn" onClick={handleOk}>OK</button>
            <button className="cash-btn" onClick={handleReset}>Reset</button>
            <button className="cash-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CashModal;
