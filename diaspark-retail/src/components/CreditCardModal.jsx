import React, { useState } from 'react';
import './CreditCardModal.css';

function CreditCardModal({ amountDue, onClose, onAddPayment }) {
  const [amount, setAmount] = useState(amountDue.toFixed(2));
  const [ccType, setCcType] = useState('');
  const [expiry, setExpiry] = useState('');
  const [lastFour, setLastFour] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('US');
  const [transactionNo, setTransactionNo] = useState('');

  const [gridData, setGridData] = useState([]);

  const handleOk = () => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      const newEntry = {
        processType: ccType || 'Manual',
        amount: parsedAmount,
        expiryDate: expiry,
        cvv: '',
        lastDigits: lastFour,
        firstName,
        lastName,
        transactionNo
      };
      setGridData([...gridData, newEntry]);
      onAddPayment(parsedAmount, {
        credit_card_last_four_digits: lastFour,
        credit_card_type: ccType,
        credit_card_expiry_mmyy: expiry,
        credit_card_first_name: firstName,
        credit_card_last_name: lastName,
        credit_card_transaction_no: transactionNo
      });
      // Reset form
      setAmount('0.00');
    }
  };

  const handleReset = () => {
    setAmount(amountDue.toFixed(2));
    setCcType('Visa');
    setExpiry('');
    setLastFour('');
    setFirstName('');
    setLastName('');
    setAddress('');
    setCity('');
    setState('');
    setZip('');
    setCountry('US');
    setTransactionNo('');
  };

  const handleClose = () => {
    onClose();
  };

  const totalAddedAmount = gridData.reduce((acc, row) => acc + row.amount, 0).toFixed(2);

  // Fill grid to 6 rows visually
  const displayRows = [...gridData];
  while (displayRows.length < 6) {
    displayRows.push(null);
  }

  return (
    <div className="cc-overlay">
      <div className="cc-container">
        <div className="cc-header">
          <span>Payment</span>
          <button className="cc-close-x" onClick={handleClose}>&times;</button>
        </div>
        
        <div className="cc-body">
          <div className="cc-form-section">
            <div className="cc-radio">
              <input type="radio" checked readOnly />
              <label>Manual Authorization</label>
            </div>
            
            <div className="cc-scan-row">
              <label>Scan Credit Card</label>
              <input type="text" className="cc-scan-input" />
            </div>
            
            <div className="cc-input-row">
              <label>Type</label>
              <select value={ccType} onChange={e => setCcType(e.target.value)} style={{width: '150px'}}>
                <option value=""></option>
                <option value="ZON-AMX">ZON-AMX</option>
                <option value="ZON-Debit Card">ZON-Debit Card</option>
                <option value="ZON-Discover">ZON-Discover</option>
                <option value="ZON-Visa/Mastercard">ZON-Visa/Mastercard</option>
              </select>
            </div>
            
            <div className="cc-input-row">
              <label>Expiry(MMYY)</label>
              <input type="text" value={expiry} maxLength="4" onChange={e => setExpiry(e.target.value)} style={{width: '60px'}} />
              <label style={{marginLeft: '10px'}}>Last Four Digit</label>
              <input type="text" value={lastFour} maxLength="4" onChange={e => setLastFour(e.target.value)} style={{width: '50px'}} />
            </div>
            
            <div className="cc-input-row">
              <label>Amount</label>
              <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="cc-amount-input" />
            </div>
            
            <div className="cc-input-row" style={{marginTop: '10px'}}>
              <label>First Name</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} style={{width: '150px'}} />
              <label style={{marginLeft: '10px'}}>Last Name</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} style={{width: '150px'}} />
            </div>
            
            <div className="cc-input-row">
              <label>Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} style={{width: '250px'}} />
            </div>
            
            <div className="cc-input-row">
              <label>City</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} style={{width: '80px'}} />
              <label style={{marginLeft: '5px'}}>State</label>
              <input type="text" value={state} onChange={e => setState(e.target.value)} style={{width: '40px'}} />
              <label style={{marginLeft: '5px'}}>Zip</label>
              <input type="text" value={zip} onChange={e => setZip(e.target.value)} style={{width: '60px'}} />
              <label style={{marginLeft: '5px'}}>Country</label>
              <input type="text" value={country} onChange={e => setCountry(e.target.value)} style={{width: '60px'}} />
            </div>
            
            <div className="cc-input-row" style={{marginTop: '10px'}}>
              <label>Transaction #</label>
              <input type="text" value={transactionNo} onChange={e => setTransactionNo(e.target.value)} style={{width: '200px'}} />
              
              <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                <button className="cc-btn" onClick={handleOk}>OK</button>
                <button className="cc-btn reset" onClick={handleReset}>Reset</button>
              </div>
            </div>
          </div>
          
          <div className="cc-grid-container">
            <table className="cc-grid">
              <thead>
                <tr>
                  <th>Process Type</th>
                  <th>Amount</th>
                  <th>Expiry Date</th>
                  <th>CVV</th>
                  <th>Last Digits</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Transaction #</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row, i) => (
                  <tr key={i}>
                    {row ? (
                      <>
                        <td>{row.processType}</td>
                        <td>{row.amount.toFixed(2)}</td>
                        <td>{row.expiryDate}</td>
                        <td>{row.cvv}</td>
                        <td>{row.lastDigits}</td>
                        <td>{row.firstName}</td>
                        <td>{row.lastName}</td>
                        <td>{row.transactionNo}</td>
                        <td></td>
                      </>
                    ) : (
                      <><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="cc-footer">
            <span className="cc-total">{totalAddedAmount}</span>
            <button className="cc-btn close" onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreditCardModal;
