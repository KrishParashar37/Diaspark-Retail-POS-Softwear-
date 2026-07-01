import React, { useState, useEffect } from 'react';

function PaymentDetailModal({ isOpen, onClose, paymentType, closeoutDate }) {
  const [details, setDetails] = useState([]);
  const [checkedIds, setCheckedIds] = useState(new Set());

  useEffect(() => {
    if (isOpen && paymentType) {
      // Map frontend UI names if needed, or pass exact paymentType
      const fetchType = paymentType.replace('ZON-', ''); 
      const url = `http://localhost:5001/api/reports/tender-details?payment_type=${fetchType}${closeoutDate ? '&date=' + closeoutDate : ''}`;
      
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            setDetails(data.data);
            // Default to all selected
            setCheckedIds(new Set(data.data.map(d => d.trans_no)));
          }
        })
        .catch(err => console.error("Error fetching tender details:", err));
    }
  }, [isOpen, paymentType, closeoutDate]);

  if (!isOpen) return null;

  const totalAmt = details.reduce((sum, d) => sum + Number(d.payment_amt || 0), 0);
  const checkedAmt = details
    .filter(d => checkedIds.has(d.trans_no))
    .reduce((sum, d) => sum + Number(d.payment_amt || 0), 0);
  const remaining = totalAmt - checkedAmt;

  const handleToggle = (id) => {
    const next = new Set(checkedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCheckedIds(next);
  };

  const handleToggleAll = () => {
    if (checkedIds.size === details.length && details.length > 0) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(details.map(d => d.trans_no)));
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1100
    }}>
      <div className="modal-content" style={{
        backgroundColor: '#f0f0f0', border: '1px solid #999',
        borderRadius: '3px', width: '850px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '5px 10px', borderBottom: '1px solid #ccc'
        }}>
          <h3 style={{ margin: 0, fontSize: '13px', color: '#000', fontWeight: 'bold' }}>Payment Detail</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', padding: 0, color: '#000'
          }}>✖</button>
        </div>

        {/* Body */}
        <div style={{ backgroundColor: 'white', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', margin: '2px', border: '1px solid #ccc' }}>
          
          <div style={{ overflowY: 'auto', maxHeight: '400px', border: '1px solid #ccc' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #ccc' }}>
                  <th style={{ padding: '5px', borderRight: '1px solid #eee' }}>Trans #</th>
                  <th style={{ padding: '5px', borderRight: '1px solid #eee' }}>Trans Date</th>
                  <th style={{ padding: '5px', borderRight: '1px solid #eee' }}>Payment Amt</th>
                  <th style={{ padding: '5px', borderRight: '1px solid #eee' }}>Customer Code</th>
                  <th style={{ padding: '5px', borderRight: '1px solid #eee' }}>Customer Name</th>
                  <th style={{ padding: '5px', borderRight: '1px solid #eee' }}>Ref Trans #</th>
                  <th style={{ padding: '5px', borderRight: '1px solid #eee' }}>Ref Trans Date</th>
                  <th style={{ padding: '5px', textAlign: 'center', color: '#0000ee', cursor: 'pointer', textDecoration: 'underline' }} onClick={handleToggleAll}>Select</th>
                </tr>
              </thead>
              <tbody>
                {details.map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '5px', borderRight: '1px solid #eee' }}>{d.trans_no}</td>
                    <td style={{ padding: '5px', borderRight: '1px solid #eee' }}>{d.trans_date}</td>
                    <td style={{ padding: '5px', borderRight: '1px solid #eee', textAlign: 'right' }}>{Number(d.payment_amt).toFixed(2)}</td>
                    <td style={{ padding: '5px', borderRight: '1px solid #eee' }}>{d.customer_code}</td>
                    <td style={{ padding: '5px', borderRight: '1px solid #eee' }}>{d.customer_name}</td>
                    <td style={{ padding: '5px', borderRight: '1px solid #eee' }}>{d.ref_trans_no}</td>
                    <td style={{ padding: '5px', borderRight: '1px solid #eee' }}>{d.ref_trans_date}</td>
                    <td style={{ padding: '5px', textAlign: 'center', color: '#0000ee', cursor: 'pointer' }} onClick={() => handleToggle(d.trans_no)}>
                      {checkedIds.has(d.trans_no) ? 'Y' : 'N'}
                    </td>
                  </tr>
                ))}
                {/* Fill empty rows to make it look like a grid if few items */}
                {Array.from({ length: Math.max(0, 10 - details.length) }).map((_, i) => (
                  <tr key={`empty-${i}`} style={{ borderBottom: '1px solid #eee', height: '26px' }}>
                    <td style={{ borderRight: '1px solid #eee' }}></td>
                    <td style={{ borderRight: '1px solid #eee' }}></td>
                    <td style={{ borderRight: '1px solid #eee' }}></td>
                    <td style={{ borderRight: '1px solid #eee' }}></td>
                    <td style={{ borderRight: '1px solid #eee' }}></td>
                    <td style={{ borderRight: '1px solid #eee' }}></td>
                    <td style={{ borderRight: '1px solid #eee' }}></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '10px', padding: '0 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', width: '80px', textAlign: 'right', fontSize: '13px' }}>Total :</span>
                <span style={{ fontSize: '13px' }}>{totalAmt.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', width: '80px', textAlign: 'right', fontSize: '13px' }}>Checked :</span>
                <span style={{ fontSize: '13px' }}>{checkedAmt.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid #ccc', width: '250px', marginTop: '5px', paddingTop: '5px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', width: '80px', textAlign: 'right', fontSize: '13px' }}>Remaining :</span>
                <span style={{ fontSize: '13px' }}>{remaining.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={onClose} style={{
                background: 'linear-gradient(to bottom, #7fb9ee, #5496d8)', border: '1px solid #4a84be', borderRadius: '3px',
                color: 'white', fontWeight: 'bold', padding: '6px 20px', cursor: 'pointer', textShadow: '0 1px 1px rgba(0,0,0,0.3)', width: '90px', fontSize: '13px'
              }}>Save</button>
              <button onClick={onClose} style={{
                background: 'linear-gradient(to bottom, #7fb9ee, #5496d8)', border: '1px solid #4a84be', borderRadius: '3px',
                color: 'white', fontWeight: 'bold', padding: '6px 20px', cursor: 'pointer', textShadow: '0 1px 1px rgba(0,0,0,0.3)', width: '90px', fontSize: '13px'
              }}>Cancel</button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default PaymentDetailModal;
