import React, { useState, useEffect } from 'react';

function PrintEndOfDayCloseoutModal({ isOpen, onClose, defaultDate }) {
  const [exportFormat, setExportFormat] = useState('PDF');
  const [useDate, setUseDate] = useState(true);
  const [dateStr, setDateStr] = useState(defaultDate || '2026-06-15');

  useEffect(() => {
    if (defaultDate) setDateStr(defaultDate);
  }, [defaultDate]);

  if (!isOpen) return null;

  const generateExcel = () => {
    const summaryUrl = 'http://localhost:5001/api/reports/tender-summary' + (useDate && dateStr ? '?date=' + dateStr : '');
    const detailsUrl = 'http://localhost:5001/api/reports/tender-details' + (useDate && dateStr ? '?date=' + dateStr : '');

    Promise.all([
      fetch(summaryUrl).then(res => res.json()),
      fetch(detailsUrl).then(res => res.json())
    ])
      .then(([summaryData, detailsData]) => {
        const tenderSummary = summaryData.status === 'success' ? summaryData.data : [];
        const tenderDetails = detailsData.status === 'success' ? detailsData.data : [];

        const totalForDay = tenderSummary.reduce((sum, ts) => sum + Number(ts.total), 0);
        const checkDeposit = tenderSummary.filter(ts => ts.payment_type.toUpperCase() === 'CHECK').reduce((sum, ts) => sum + Number(ts.total), 0);
        const totalCash = tenderSummary.filter(ts => ts.payment_type.toUpperCase() === 'CASH').reduce((sum, ts) => sum + Number(ts.total), 0);
        const openingAmount = 0;
        const cashDeposit = totalCash;
        const bankDepositTotal = checkDeposit + cashDeposit;
        const overShort = 0;

        const tableHtml = `
          <html xmlns:x="urn:schemas-microsoft-com:office:excel">
          <head>
            <style>
              td { font-family: Arial; font-size: 13px; }
            </style>
          </head>
          <body>
          <table>
            <tr><td colspan="4" style="text-align: center; font-size: 16px; font-weight: bold;">Demosparkle</td></tr>
            <tr><td colspan="4" style="text-align: center; font-size: 14px;">Edison</td></tr>
            <tr>
              <td><b>Terminal #: POS</b></td>
              <td colspan="2" style="text-align: center; font-weight: bold;">Cash & Check Summary</td>
              <td style="text-align: right;">Tender date: ${useDate ? dateStr : 'All'}</td>
            </tr>
            <tr><td></td></tr>
            <tr>
              <td style="text-align: right;">Total for the day</td>
              <td style="background-color: #e5e5e5; text-align: right;">$${totalForDay.toFixed(2)}</td>
              <td colspan="2">(Auto Generated based on cash and check sales only)</td>
            </tr>
            <tr><td></td></tr>
            <tr>
              <td style="text-align: right;">Total Cash</td>
              <td style="background-color: #e5e5e5; text-align: right;">$${totalCash.toFixed(2)}</td>
              <td colspan="2">(Sum of the cash that is physically in the drawer)</td>
            </tr>
            <tr>
              <td style="text-align: right;">Opening Amount</td>
              <td style="background-color: #e5e5e5; text-align: right;">$${openingAmount.toFixed(2)}</td>
              <td colspan="2">(Sales Person Enters amount Manually)</td>
            </tr>
            <tr>
              <td style="text-align: right;">Cash Deposit</td>
              <td style="background-color: #e5e5e5; text-align: right;">$${cashDeposit.toFixed(2)}</td>
              <td colspan="2">(Total Cash - Opening Amount)</td>
            </tr>
            <tr>
              <td style="text-align: right;">Check Deposit</td>
              <td style="background-color: #e5e5e5; text-align: right;">$${checkDeposit.toFixed(2)}</td>
              <td colspan="2">(Amount from Tender Summary)</td>
            </tr>
            <tr>
              <td style="text-align: right;"><b>BANK DEPOSIT TOTAL</b></td>
              <td style="background-color: #e5e5e5; text-align: right;">$${bankDepositTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="text-align: right;">Over/Short</td>
              <td style="background-color: #e5e5e5; text-align: right;">$${overShort.toFixed(2)}</td>
            </tr>
            <tr><td colspan="4"></td></tr>
            <tr><td colspan="4"><b>Transaction Details:</b></td></tr>
            <tr>
              <th style="text-align: left;">Trans Date</th>
              <th style="text-align: left;">Trans #</th>
              <th style="text-align: right;">Amount</th>
              <th style="text-align: left;">Customer</th>
            </tr>
            ${tenderDetails.length > 0 ? tenderDetails.map(d => `
              <tr>
                <td>${d.trans_date}</td>
                <td>${d.trans_no}</td>
                <td style="text-align: right;">$${Number(d.payment_amt).toFixed(2)}</td>
                <td>${d.customer_name}</td>
              </tr>
            `).join('') : `<tr><td colspan="4" style="text-align:center;">No transactions found for this date.</td></tr>`}
          </table>
          </body>
          </html>
        `;

        const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Cash_Check_Summary.xls';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        onClose();
      })
      .catch(err => {
        console.error("Error", err);
        alert('Failed to generate excel report');
      });
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: '#e5e5e5', border: '1px solid #999',
        borderRadius: '3px', width: '350px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 10px', backgroundColor: '#eef3f7', borderBottom: '1px solid #ccc',
          borderTopLeftRadius: '2px', borderTopRightRadius: '2px'
        }}>
          <h3 style={{ margin: 0, fontSize: '13px', color: '#003366', fontWeight: 'bold' }}>Print End of Day Closeout</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', padding: 0, color: '#333'
          }}>✖</button>
        </div>

        {/* Body */}
        <div style={{ backgroundColor: 'white', padding: '25px 20px', display: 'flex', flexDirection: 'column', gap: '15px', margin: '2px', border: '1px solid #ccc' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '30px' }}>
            <span style={{ fontSize: '13px', width: '80px', textAlign: 'right' }}>Date</span>
            <input type="checkbox" checked={useDate} onChange={(e) => setUseDate(e.target.checked)} style={{ margin: 0 }} />
            <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} disabled={!useDate}
                   onClick={(e) => { try { e.target.showPicker(); } catch(err) {} }}
                   style={{ width: '120px', border: '1px solid #aaa', padding: '3px 5px', fontSize: '13px', backgroundColor: useDate ? 'white' : '#eee', cursor: useDate ? 'pointer' : 'default' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '30px' }}>
            <span style={{ fontSize: '13px', width: '80px', textAlign: 'right' }}>Export Format</span>
            <div style={{ display: 'flex', gap: '15px' }}>
              <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input type="radio" name="exportFormat" value="PDF" checked={exportFormat === 'PDF'} onChange={() => setExportFormat('PDF')} style={{ margin: 0 }} /> PDF
              </label>
              <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input type="radio" name="exportFormat" value="Excel" checked={exportFormat === 'Excel'} onChange={() => setExportFormat('Excel')} style={{ margin: 0 }} /> Excel
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
            <button onClick={generateExcel} style={{
              background: 'linear-gradient(to bottom, #7fb9ee, #5496d8)', border: '1px solid #4a84be', borderRadius: '3px',
              color: 'white', fontWeight: 'bold', padding: '6px 20px', cursor: 'pointer', textShadow: '0 1px 1px rgba(0,0,0,0.3)', width: '90px', fontSize: '13px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)'
            }}>Submit</button>
            <button onClick={onClose} style={{
              background: 'linear-gradient(to bottom, #7fb9ee, #5496d8)', border: '1px solid #4a84be', borderRadius: '3px',
              color: 'white', fontWeight: 'bold', padding: '6px 20px', cursor: 'pointer', textShadow: '0 1px 1px rgba(0,0,0,0.3)', width: '90px', fontSize: '13px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)'
            }}>Cancel</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PrintEndOfDayCloseoutModal;
