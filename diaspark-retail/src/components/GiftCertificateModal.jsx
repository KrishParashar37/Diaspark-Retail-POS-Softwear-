import React, { useState } from 'react';
import './GiftCertificateModal.css';
import GiftCertificateLookupModal from './GiftCertificateLookupModal';

function GiftCertificateModal({ onClose, onAddPayment }) {
  const [gcNumber, setGcNumber] = useState('');
  const [newGcNumber, setNewGcNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date().toISOString().split('T')[0]);
  const [newValue, setNewValue] = useState('0.00');
  
  const [gridData, setGridData] = useState([]);
  const [showLookup, setShowLookup] = useState(false);

  const handleOk = () => {
    const amountVal = parseFloat(newValue) || 0;
    if (gcNumber && amountVal !== 0) {
      const newEntry = {
        gcValue: amountVal,
        gcNumber: gcNumber
      };
      setGridData([...gridData, newEntry]);
      setGcNumber('');
      setNewValue('0.00');
    }
  };

  const handleReset = () => {
    setGcNumber('');
    setNewGcNumber('');
    setNewValue('0.00');
  };

  const handleClose = () => {
    gridData.forEach(row => {
      onAddPayment(row.gcValue, {
        gift_certificate_face_amt: row.gcValue,
        // Using check_no loosely here to store the GC number since there's no specific GC number column in pos_invoice_payments besides reference_no or check_no
        reference_no: row.gcNumber 
      });
    });
    onClose();
  };

  const totalAddedAmount = gridData.reduce((acc, row) => acc + row.gcValue, 0).toFixed(2);

  const displayRows = [...gridData];
  while (displayRows.length < 5) {
    displayRows.push(null);
  }

  return (
    <div className="gcert-overlay">
      <div className="gcert-container">
        <div className="gcert-header">
          <span>Payment</span>
          <button className="gcert-close-x" onClick={handleClose}>&times;</button>
        </div>
        
        <div className="gcert-body">
          <div className="gcert-top-sections">
            <div className="gcert-left-section">
              <h3 className="gcert-title">Gift Certificate Detail</h3>
              <div className="gcert-form-group">
                <label>GC #</label>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <input 
                    type="text" 
                    value={gcNumber} 
                    onChange={e => setGcNumber(e.target.value)} 
                    onKeyDown={e => { if (e.key === 'Enter') handleOk(); }}
                    className="gcert-input-blue" 
                  />
                  <button className="gcert-book-btn" onClick={() => setShowLookup(true)}>📖</button>
                </div>
              </div>
              <div className="gcert-buttons">
                <button className="gcert-btn" onClick={handleOk}>OK</button>
                <button className="gcert-btn reset" onClick={handleReset}>Reset</button>
              </div>
            </div>
            
            <div className="gcert-right-section">
              <h3 className="gcert-title">Balance on new Gift Certificate</h3>
              <div className="gcert-form-group">
                <label>New GC #</label>
                <input type="text" value={newGcNumber} readOnly style={{backgroundColor: '#ccc', width: '120px'}} />
              </div>
              <div className="gcert-form-group">
                <label>Expiry Date</label>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} style={{width: '120px', padding: '2px'}} />
                </div>
              </div>
              <div className="gcert-form-group">
                <label>New Value</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={newValue} 
                  onChange={e => setNewValue(e.target.value)} 
                  onKeyDown={e => { if (e.key === 'Enter') handleOk(); }}
                  style={{width: '100px'}} 
                />
              </div>
            </div>
          </div>
          
          <div className="gcert-grid-container">
            <table className="gcert-grid">
              <thead>
                <tr>
                  <th style={{width: '30%'}}>GC Value</th>
                  <th style={{width: '30%'}}>GC #</th>
                  <th style={{width: '40%'}}></th>
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row, i) => (
                  <tr key={i}>
                    {row ? (
                      <>
                        <td>{row.gcValue.toFixed(2)}</td>
                        <td>{row.gcNumber}</td>
                        <td></td>
                      </>
                    ) : (
                      <><td></td><td></td><td></td></>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="gcert-footer">
            <span className="gcert-total">{totalAddedAmount}</span>
            <button className="gcert-btn close" onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
      
      {showLookup && (
        <GiftCertificateLookupModal 
          onClose={() => setShowLookup(false)}
          onSelect={(cert) => {
            setGcNumber(cert.gcNumber);
            setNewValue(cert.value.toFixed(2));
            setShowLookup(false);
          }}
        />
      )}
    </div>
  );
}

export default GiftCertificateModal;
