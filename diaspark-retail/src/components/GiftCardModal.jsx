import React, { useState } from 'react';
import './GiftCardModal.css';

function GiftCardModal({ amountDue, onClose, onAddPayment }) {
  const [amount, setAmount] = useState(amountDue.toFixed(2));
  const [number, setNumber] = useState('');
  const [lane, setLane] = useState('1');
  const [host, setHost] = useState('285');
  
  const [gridData, setGridData] = useState([]);

  const handleOk = () => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0 && number) {
      const newEntry = {
        amount: parsedAmount,
        lastFourDigits: number.slice(-4),
        refNo: Math.floor(Math.random() * 1000000).toString()
      };
      setGridData([...gridData, newEntry]);
      setAmount('0.00');
      setNumber('');
    }
  };

  const handleClose = () => {
    const totalAdded = gridData.reduce((acc, row) => acc + row.amount, 0);
    if (totalAdded > 0) {
      onAddPayment(totalAdded);
    }
    onClose();
  };

  const totalAddedAmount = gridData.reduce((acc, row) => acc + row.amount, 0).toFixed(2);

  const displayRows = [...gridData];
  while (displayRows.length < 3) {
    displayRows.push(null);
  }

  return (
    <div className="gc-overlay">
      <div className="gc-container">
        <div className="gc-header">
          <span>Payment</span>
          <button className="gc-close-x" onClick={handleClose}>&times;</button>
        </div>
        
        <div className="gc-body">
          <h3 className="gc-title">Gift Card Detail</h3>
          
          <div className="gc-top-section">
            <div className="gc-form-group">
              <label>Gift Card Amt</label>
              <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="gc-amount-input" />
            </div>
            
            <div className="gc-form-group">
              <label>Number</label>
              <input 
                type="text" 
                value={number} 
                onChange={e => setNumber(e.target.value)} 
                onKeyDown={e => { if (e.key === 'Enter') handleOk(); }}
                style={{width: '150px'}} 
              />
              <button className="gc-btn small" onClick={handleOk}>OK</button>
            </div>
            
            <p className="gc-red-text">Please scan or enter gift card number, then press Enter key.</p>
          </div>
          
          <div className="gc-right-section">
            <div className="gc-form-group">
              <label>*Lane</label>
              <select value={lane} onChange={e => setLane(e.target.value)} style={{width: '60px'}}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
              <button className="gc-btn small">*Balance</button>
            </div>
            <div className="gc-form-group">
              <label>#Host</label>
              <select value={host} onChange={e => setHost(e.target.value)} style={{width: '60px'}}>
                <option value="285">285</option>
                <option value="07">07</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="31">31</option>
              </select>
              <button className="gc-btn small">#Balance</button>
            </div>
          </div>
          
          <div className="gc-actions">
            <div className="gc-actions-left">
              <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                <button className="gc-btn" onClick={handleOk}>*Swipe</button>
                <button className="gc-btn" onClick={handleOk}>*Manual</button>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button className="gc-btn" onClick={handleOk}>#Swipe</button>
                <button className="gc-btn" onClick={handleOk}>#Manual</button>
              </div>
            </div>
            <div className="gc-actions-right">
              <button className="gc-btn" style={{marginBottom: '10px'}}>*Reversal</button>
              <button className="gc-btn">#Void</button>
            </div>
          </div>
          
          <div className="gc-grid-container">
            <table className="gc-grid">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Last Four Digits</th>
                  <th>RefNo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row, i) => (
                  <tr key={i}>
                    {row ? (
                      <>
                        <td>{row.amount.toFixed(2)}</td>
                        <td>{row.lastFourDigits}</td>
                        <td>{row.refNo}</td>
                        <td></td>
                      </>
                    ) : (
                      <><td></td><td></td><td></td><td></td></>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="gc-footer">
            <span className="gc-total">{totalAddedAmount}</span>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
              <button className="gc-btn close" onClick={handleClose}>Close</button>
              <span style={{fontSize: '10px', marginTop: '5px'}}>* triPOS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiftCardModal;
