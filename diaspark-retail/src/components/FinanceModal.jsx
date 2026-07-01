import React, { useState } from 'react';
import './FinanceModal.css';
import TermLookupModal from './TermLookupModal';

function FinanceModal({ amountDue, onClose, onAddPayment }) {
  const [amount, setAmount] = useState(amountDue.toFixed(2));
  const [plan, setPlan] = useState('');
  const [term, setTerm] = useState('');
  const [institution, setInstitution] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [authorization, setAuthorization] = useState('');
  const [showTermLookup, setShowTermLookup] = useState(false);

  const handleOk = () => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      onAddPayment(parsedAmount, {
        finance_account_number: accountNumber,
        finance_plan: plan,
        finance_term: term,
        finance_institution: institution,
        finance_authorization: authorization
      });
    }
  };

  const handleReset = () => {
    setAmount(amountDue.toFixed(2));
    setPlan('');
    setTerm('');
    setInstitution('');
    setAccountNumber('');
    setAuthorization('');
  };

  return (
    <div className="fm-overlay">
      <div className="fm-container">
        <div className="fm-header">
          <span>Payment</span>
          <button className="fm-close-x" onClick={onClose}>&times;</button>
        </div>
        
        <div className="fm-body">
          <h3 className="fm-title">Finance Detail</h3>
          
          <div className="fm-form-group">
            <label>Amount</label>
            <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="fm-amount-input" />
          </div>
          
          <div className="fm-form-group">
            <label>Plan</label>
            <input type="text" value={plan} onChange={e => setPlan(e.target.value)} />
          </div>
          
          <div className="fm-form-group">
            <label>Term</label>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <input type="text" value={term} onChange={e => setTerm(e.target.value)} style={{width: 'calc(100% - 25px)', borderRadius: '4px 0 0 4px', borderRight: 'none'}} />
              <button 
                className="fm-book-btn" 
                title="Lookup Terms" 
                onClick={() => setShowTermLookup(true)}
                style={{
                  background: 'linear-gradient(to bottom, #f9f9f9, #dcdcdc)',
                  border: '1px solid #aaa',
                  padding: '2px 5px',
                  cursor: 'pointer',
                  borderRadius: '0 4px 4px 0',
                  fontSize: '12px'
                }}
              >📖</button>
            </div>
          </div>
          
          <div className="fm-form-group">
            <label>Financial Institution</label>
            <select value={institution} onChange={e => setInstitution(e.target.value)}>
              <option value=""></option>
              <option value="Ideal Credit">Ideal Credit</option>
              <option value="Other">Other</option>
              <option value="Progressive Leasing">Progressive Leasing</option>
            </select>
          </div>
          
          <div className="fm-form-group">
            <label>Account Number</label>
            <input type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />
          </div>
          
          <div className="fm-form-group">
            <label>Authorization #</label>
            <input type="text" value={authorization} onChange={e => setAuthorization(e.target.value)} />
          </div>
          
          <div className="fm-buttons">
            <button className="fm-btn" onClick={handleOk}>OK</button>
            <button className="fm-btn" onClick={handleReset}>Reset</button>
            <button className="fm-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
      
      {showTermLookup && (
        <TermLookupModal 
          onClose={() => setShowTermLookup(false)} 
          onSelect={(code) => setTerm(code)} 
        />
      )}
    </div>
  );
}

export default FinanceModal;
