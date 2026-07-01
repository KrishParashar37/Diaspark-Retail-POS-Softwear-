import React, { useState } from 'react';
import './HouseAccountModal.css';
import TermLookupModal from './TermLookupModal';

function HouseAccountModal({ amountDue, onClose, onAddPayment }) {
  const [amount, setAmount] = useState(amountDue.toFixed(2));
  const [rewards, setRewards] = useState('0.00');
  const [terms, setTerms] = useState('NET365');
  const [showTermLookup, setShowTermLookup] = useState(false);

  const handleOk = () => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      onAddPayment(parsedAmount);
    }
  };

  const handleReset = () => {
    setAmount(amountDue.toFixed(2));
    setRewards('0.00');
    setTerms('NET365');
  };

  return (
    <div className="ha-overlay">
      <div className="ha-container">
        <div className="ha-header">
          <span>Payment</span>
          <button className="ha-close-x" onClick={onClose}>&times;</button>
        </div>
        
        <div className="ha-body">
          <h3 className="ha-title">On Account</h3>
          
          <div className="ha-form-group">
            <label>On Account Amt</label>
            <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="ha-amount-input" />
          </div>
          
          <div className="ha-form-group">
            <label>Rewards</label>
            <input type="number" step="0.01" value={rewards} onChange={e => setRewards(e.target.value)} />
          </div>
          
          <div className="ha-form-group" style={{marginTop: '15px'}}>
            <label>Terms #</label>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <input type="text" value={terms} onChange={e => setTerms(e.target.value)} style={{width: '200px', borderRadius: '4px 0 0 4px', borderRight: 'none'}} />
              <button className="ha-book-btn" title="Lookup Terms" onClick={() => setShowTermLookup(true)}>📖</button>
            </div>
          </div>
          
          <div className="ha-buttons">
            <button className="ha-btn" onClick={handleOk}>OK</button>
            <button className="ha-btn" onClick={handleReset}>Reset</button>
            <button className="ha-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
      
      {showTermLookup && (
        <TermLookupModal 
          onClose={() => setShowTermLookup(false)} 
          onSelect={(code) => setTerms(code)} 
        />
      )}
    </div>
  );
}

export default HouseAccountModal;
