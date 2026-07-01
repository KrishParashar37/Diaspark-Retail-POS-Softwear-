import React, { useState } from 'react';
import './WireTransferModal.css';

function WireTransferModal({ amountDue, onClose, onAddPayment }) {
  const [amount, setAmount] = useState(amountDue.toFixed(2));
  const [wireNo, setWireNo] = useState('');
  const [wireDate, setWireDate] = useState(new Date().toISOString().split('T')[0]);
  const [gridData, setGridData] = useState([]);

  const handleOk = () => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount !== 0) {
      setGridData([...gridData, { amount: parsedAmount, wireNo, wireDate }]);
      setAmount('0.00');
      setWireNo('');
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
  while (displayRows.length < 4) {
    displayRows.push(null);
  }

  return (
    <div className="wt-overlay">
      <div className="wt-container">
        <div className="wt-header">
          <span>Payment</span>
          <button className="wt-close-x" onClick={handleClose}>&times;</button>
        </div>
        
        <div className="wt-body">
          <div className="wt-top-section">
            <h3 className="wt-title">Wire Transfer Detail</h3>
            
            <div className="wt-form-group">
              <label>Wire Transfer Amt</label>
              <input 
                type="number" 
                step="0.01" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                onKeyDown={e => { if (e.key === 'Enter') handleOk(); }}
                className="wt-amount-input" 
              />
            </div>
            
            <div className="wt-form-group">
              <label>Wire Transfer#</label>
              <input 
                type="text" 
                value={wireNo} 
                onChange={e => setWireNo(e.target.value)} 
                onKeyDown={e => { if (e.key === 'Enter') handleOk(); }}
                style={{width: '180px'}} 
              />
            </div>
            
            <div className="wt-form-group">
              <label>Wire Transfer Date</label>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <input type="date" value={wireDate} onChange={e => setWireDate(e.target.value)} style={{width: '110px', padding: '2px'}} />
              </div>
              <div className="wt-buttons">
                <button className="wt-btn" onClick={handleOk}>OK</button>
                <button className="wt-btn" onClick={() => setAmount(amountDue.toFixed(2))}>Reset</button>
              </div>
            </div>
          </div>
          
          <div className="wt-grid-container">
            <table className="wt-grid">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>WireTransfer Number</th>
                  <th>WireTransfer Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row, i) => (
                  <tr key={i}>
                    {row ? (
                      <>
                        <td>{row.amount.toFixed(2)}</td>
                        <td>{row.wireNo}</td>
                        <td>{row.wireDate}</td>
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
          
          <div className="wt-footer">
            <span className="wt-total">{totalAddedAmount}</span>
            <button className="wt-btn close" onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WireTransferModal;
