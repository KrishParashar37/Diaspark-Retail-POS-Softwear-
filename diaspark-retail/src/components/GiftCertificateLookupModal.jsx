import React, { useState } from 'react';
import './GiftCertificateLookupModal.css';

function GiftCertificateLookupModal({ onClose, onSelect }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [DUMMY_CERTIFICATES, setCertificates] = useState([]);
  
  React.useEffect(() => {
    fetch('http://localhost:5001/api/giftcertificates')
      .then(res => res.json())
      .then(data => setCertificates(data))
      .catch(err => console.error("Failed to fetch gift certificates:", err));
  }, []);

  const handleSelect = () => {
    if (selectedRow) {
      onSelect(selectedRow);
    }
  };

  const displayRows = [...DUMMY_CERTIFICATES];
  while (displayRows.length < 10) {
    displayRows.push(null);
  }

  return (
    <div className="gcl-overlay">
      <div className="gcl-container">
        <div className="gcl-header">
          <span>GiftCertificate Lookup</span>
          <button className="gcl-close-x" onClick={onClose}>&times;</button>
        </div>
        
        <div className="gcl-body">
          <div className="gcl-grid-container">
            <table className="gcl-grid">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Gift Certificate #</th>
                  <th style={{ width: '30%', textAlign: 'right' }}>Value</th>
                  <th style={{ width: '30%' }}>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row, i) => (
                  <tr 
                    key={i} 
                    className={selectedRow === row && row ? 'selected' : ''}
                    onClick={() => row && setSelectedRow(row)}
                    onDoubleClick={() => { if (row) onSelect(row); }}
                  >
                    {row ? (
                      <>
                        <td>{row.gcNumber}</td>
                        <td style={{ textAlign: 'right' }}>{row.value.toFixed(2)}</td>
                        <td>{row.expiryDate}</td>
                      </>
                    ) : (
                      <>
                        <td>&nbsp;</td>
                        <td></td>
                        <td></td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="gcl-footer">
            <button className="gcl-btn" onClick={handleSelect}>Select</button>
            <button className="gcl-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiftCertificateLookupModal;
