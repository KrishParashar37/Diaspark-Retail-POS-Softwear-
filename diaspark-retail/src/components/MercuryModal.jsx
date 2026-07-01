import React, { useState } from 'react';
import './MercuryModal.css';

function MercuryModal({ amountDue, onClose, onAddPayment }) {
  const [amount, setAmount] = useState(amountDue.toFixed(2));
  const [lane, setLane] = useState('1');
  const [host, setHost] = useState('285');
  const [gridData, setGridData] = useState([]);

  const handleProcess = () => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount !== 0) {
      const newEntry = {
        cardType: 'VISA',
        amount: parsedAmount,
        lastDigits: Math.floor(1000 + Math.random() * 9000).toString(),
        name: 'CUSTOMER',
        refNo: Math.floor(Math.random() * 1000000).toString(),
        authCode: 'AUTH123',
        acqRefData: 'ACQ987'
      };
      setGridData([...gridData, newEntry]);
      setAmount('0.00');
    }
  };

  const handleClose = () => {
    gridData.forEach(row => {
      onAddPayment(row.amount, {
        Mercury_RecordNo: row.refNo,
        Mercury_ProcessData: row.acqRefData,
        credit_card_last_four_digits: row.lastDigits,
        credit_card_type: row.cardType,
        credit_card_transaction_no: row.authCode
      });
    });
    onClose();
  };

  const totalAddedAmount = gridData.reduce((acc, row) => acc + row.amount, 0).toFixed(2);

  const displayRows = [...gridData];
  while (displayRows.length < 6) {
    displayRows.push(null);
  }

  return (
    <div className="merc-overlay">
      <div className="merc-container" style={{ width: '850px', background: '#d4d4d4' }}>
        <div className="merc-header">
          <span>Payment</span>
        </div>
        
        <div className="merc-body" style={{ background: '#d4d4d4', border: 'none', margin: '10px 15px', padding: '0', minHeight: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            {/* Left section: Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '200px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Amount</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleProcess(); }}
                  style={{ width: '100px', textAlign: 'right', padding: '2px' }} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>*Lane</label>
                <select value={lane} onChange={e => setLane(e.target.value)} style={{ width: '106px', padding: '2px' }}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>#Host</label>
                <select value={host} onChange={e => setHost(e.target.value)} style={{ width: '106px', padding: '2px' }}>
                  <option value="285">285</option>
                  <option value="07">07</option>
                  <option value="28">28</option>
                  <option value="29">29</option>
                  <option value="31">31</option>
                </select>
              </div>
            </div>

            {/* Middle section: Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button className="merc-btn" onClick={handleProcess} style={{ width: '90px' }}>*Swipe</button>
                <button className="merc-btn" onClick={handleProcess} style={{ width: '90px' }}>*Manual</button>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button className="merc-btn" onClick={handleProcess}>#Charge Card(Swipe)</button>
                <button className="merc-btn" onClick={handleProcess}>#Charge Card(Manual)</button>
              </div>
              <div>
                <button className="merc-btn" onClick={handleProcess} style={{ width: '180px' }}>Pay By Link</button>
              </div>
            </div>

            {/* Right section: Void Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '120px', alignItems: 'flex-end' }}>
              <button className="merc-btn" style={{ width: '80px' }}>*Void</button>
              <button className="merc-btn" style={{ width: '80px' }}>#Void</button>
            </div>
          </div>
          
          <div className="merc-grid-container" style={{ border: '1px solid #aaa', background: '#fff', height: '220px', overflowY: 'auto', marginBottom: '10px' }}>
            <table className="merc-grid" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ccc' }}>
                  <th style={{ padding: '6px', textAlign: 'left', borderRight: '1px solid #eee' }}>Card Type</th>
                  <th style={{ padding: '6px', textAlign: 'right', borderRight: '1px solid #eee' }}>Amount</th>
                  <th style={{ padding: '6px', textAlign: 'left', borderRight: '1px solid #eee' }}>Last Digits</th>
                  <th style={{ padding: '6px', textAlign: 'left', borderRight: '1px solid #eee' }}>Name</th>
                  <th style={{ padding: '6px', textAlign: 'left', borderRight: '1px solid #eee' }}>RefNo</th>
                  <th style={{ padding: '6px', textAlign: 'left', borderRight: '1px solid #eee' }}>AuthCode</th>
                  <th style={{ padding: '6px', textAlign: 'left' }}>AcqRefData</th>
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee', height: '28px' }}>
                    {row ? (
                      <>
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #eee' }}>{row.cardType}</td>
                        <td style={{ padding: '4px 6px', textAlign: 'right', borderRight: '1px solid #eee' }}>{row.amount.toFixed(2)}</td>
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #eee' }}>{row.lastDigits}</td>
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #eee' }}>{row.name}</td>
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #eee' }}>{row.refNo}</td>
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #eee' }}>{row.authCode}</td>
                        <td style={{ padding: '4px 6px' }}>{row.acqRefData}</td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #eee' }}></td>
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #eee' }}></td>
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #eee' }}></td>
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #eee' }}></td>
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #eee' }}></td>
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #eee' }}></td>
                        <td style={{ padding: '4px 6px' }}></td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginLeft: '120px', fontWeight: 'normal', fontSize: '13px', marginBottom: '15px' }}>{totalAddedAmount}</div>
              <div style={{ fontSize: '11px', color: '#333' }}>* triPOS</div>
            </div>
            <button className="merc-btn" onClick={handleClose} style={{ padding: '6px 25px', marginBottom: '5px' }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MercuryModal;
