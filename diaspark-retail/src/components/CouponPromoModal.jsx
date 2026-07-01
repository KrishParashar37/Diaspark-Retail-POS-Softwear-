import React, { useState } from 'react';
import './CouponPromoModal.css';

function CouponPromoModal({ onClose, onAddPayment }) {
  const [promoNo, setPromoNo] = useState('');
  const [amount, setAmount] = useState('0.00');
  const [gridData, setGridData] = useState([]);

  const handleOk = () => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount !== 0) {
      setGridData([...gridData, { 
        select: 'Y', 
        promoNo: promoNo, 
        name: 'Manual Promo', 
        type: 'Flat', 
        amount: parsedAmount, 
        couponAmount: parsedAmount 
      }]);
      setAmount('0.00');
      setPromoNo('');
    }
  };

  const handleClose = () => {
    gridData.forEach(row => {
      onAddPayment(row.couponAmount, {
        coupon_promo_code: row.promoNo,
        coupon_promo_type: row.type
      });
    });
    onClose();
  };

  const totalAddedAmount = gridData.reduce((acc, row) => acc + row.couponAmount, 0).toFixed(2);

  const displayRows = [...gridData];
  while (displayRows.length < 5) {
    displayRows.push(null);
  }

  return (
    <div className="cp-overlay">
      <div className="cp-container">
        <div className="cp-header">
          <span>Payment</span>
          <button className="cp-close-x" onClick={handleClose}>&times;</button>
        </div>
        
        <div className="cp-body">
          <h3 className="cp-title">Coupon Promo Detail</h3>
          
          <div style={{display: 'flex', gap: '20px', marginBottom: '15px', alignItems: 'flex-end'}}>
            <div className="cp-form-group">
              <label>Promo No</label>
              <input 
                type="text" 
                value={promoNo} 
                onChange={e => setPromoNo(e.target.value)} 
                onKeyDown={e => { if (e.key === 'Enter') handleOk(); }}
              />
            </div>
            <div className="cp-form-group">
              <label>Amount</label>
              <input 
                type="number" 
                step="0.01" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                onKeyDown={e => { if (e.key === 'Enter') handleOk(); }}
              />
            </div>
            <button className="cp-btn" onClick={handleOk}>OK</button>
          </div>
          
          <div className="cp-grid-container">
            <table className="cp-grid">
              <thead>
                <tr>
                  <th>Select Y/N</th>
                  <th>Coupon/Promo #</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th style={{color: 'blue'}}>Coupon Amount</th>
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row, i) => (
                  <tr key={i}>
                    {row ? (
                      <>
                        <td>{row.select}</td>
                        <td>{row.promoNo}</td>
                        <td>{row.name}</td>
                        <td>{row.type}</td>
                        <td>{row.amount.toFixed(2)}</td>
                        <td>{row.couponAmount.toFixed(2)}</td>
                      </>
                    ) : (
                      <><td></td><td></td><td></td><td></td><td></td><td></td></>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px'}}>
            <span style={{fontWeight: 'bold'}}>Total: {totalAddedAmount}</span>
            <div className="cp-buttons">
              <button className="cp-btn" onClick={() => setGridData([])}>Reset</button>
              <button className="cp-btn" onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CouponPromoModal;
