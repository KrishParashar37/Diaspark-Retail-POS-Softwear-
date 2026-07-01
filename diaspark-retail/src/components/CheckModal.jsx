import React, { useState } from 'react';
import './CheckModal.css';

function CheckModal({ amountDue, onClose, onAddPayment }) {
  const [amount, setAmount] = useState(amountDue.toFixed(2));
  const [checkNumber, setCheckNumber] = useState('');
  const [checkDate, setCheckDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkType, setCheckType] = useState('Electronic');
  
  const [gridData, setGridData] = useState([]);

  const handleOk = () => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      const newEntry = {
        amount: parsedAmount,
        checkNumber,
        checkDate,
        checkType
      };
      setGridData([...gridData, newEntry]);
      onAddPayment(parsedAmount, {
        check_no: checkNumber,
        check_date: checkDate,
        check_type: checkType
      });
      setAmount('0.00');
      setCheckNumber('');
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
  while (displayRows.length < 5) {
    displayRows.push(null);
  }

  return (
    <div className="chk-overlay">
      <div className="chk-container">
        <div className="chk-header">
          <span>Payment</span>
          <button className="chk-close-x" onClick={handleClose}>&times;</button>
        </div>
        
        <div className="chk-body">
          <h3 className="chk-title">Check Detail</h3>
          
          <div className="chk-top-section">
            <div className="chk-form-column">
              <div className="chk-form-group">
                <label>Check Amt</label>
                <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="chk-amount-input" />
              </div>
              <div className="chk-form-group">
                <label>Check#</label>
                <input type="text" value={checkNumber} onChange={e => setCheckNumber(e.target.value)} style={{width: '150px'}} />
              </div>
              <div className="chk-form-group">
                <label>Check Date</label>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <input type="date" value={checkDate} onChange={e => setCheckDate(e.target.value)} style={{width: '110px', padding: '2px'}} />
                </div>
              </div>
              <div className="chk-form-group">
                <label>Check Type</label>
                <select value={checkType} onChange={e => setCheckType(e.target.value)} style={{width: '120px', padding: '3px'}}>
                  <option value="Electronic">Electronic</option>
                  <option value="Paper">Paper</option>
                </select>
              </div>
            </div>
            
            <div className="chk-buttons-column">
              <button className="chk-btn" onClick={handleOk}>OK</button>
              <button className="chk-btn reset" onClick={() => { setAmount(amountDue.toFixed(2)); setCheckNumber(''); }}>Reset</button>
            </div>
          </div>
          
          <div className="chk-grid-container">
            <table className="chk-grid">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Check Number</th>
                  <th>Check Date</th>
                  <th>Check Type</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row, i) => (
                  <tr key={i}>
                    {row ? (
                      <>
                        <td>{row.amount.toFixed(2)}</td>
                        <td>{row.checkNumber}</td>
                        <td>{row.checkDate}</td>
                        <td>{row.checkType}</td>
                        <td></td>
                      </>
                    ) : (
                      <><td></td><td></td><td></td><td></td><td></td></>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="chk-footer">
            <span className="chk-total">{totalAddedAmount}</span>
            <button className="chk-btn close" onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckModal;
