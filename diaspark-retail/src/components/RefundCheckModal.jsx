import React, { useState } from 'react';
import './RefundCheckModal.css';

function RefundCheckModal({ amountDue, onClose, onAddPayment }) {
  const [amount, setAmount] = useState(amountDue.toFixed(2));
  const [gridData, setGridData] = useState([]);

  const handleOk = () => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount !== 0) {
      setGridData([...gridData, { amount: parsedAmount }]);
      setAmount('0.00');
    }
  };

  const handleClose = () => {
    const totalAdded = gridData.reduce((acc, row) => acc + row.amount, 0);
    if (totalAdded > 0) {
      onAddPayment(totalAdded);
    }
    onClose();
  };

  const displayRows = [...gridData];
  while (displayRows.length < 5) {
    displayRows.push(null);
  }

  return (
    <div className="rc-overlay">
      <div className="rc-container">
        <div className="rc-header">
          <span>Payment</span>
          <button className="rc-close-x" onClick={handleClose}>&times;</button>
        </div>
        
        <div className="rc-body">
          <h3 className="rc-title">Refund Check Detail</h3>
          
          <div className="rc-top-section">
            <div className="rc-form-group">
              <label>Refund Check Amt</label> 
              <input 
                type="number" 
                step="0.01" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                onKeyDown={e => { if (e.key === 'Enter') handleOk(); }}
                className="rc-amount-input" 
              />
            </div>
            
            <div className="rc-buttons">
              <button className="rc-btn" onClick={handleOk}>OK</button>
              <button className="rc-btn" onClick={() => setAmount(amountDue.toFixed(2))}>Reset</button>
            </div>
          </div>
          
          <div className="rc-grid-container">
            <table className="rc-grid">
              <thead>
                <tr>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row, i) => (
                  <tr key={i}>
                    {row ? (
                      <td>{row.amount.toFixed(2)}</td>
                    ) : (
                      <td></td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="rc-footer">
            <button className="rc-btn close" onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RefundCheckModal;
