import API_BASE_URL from '../config.js';
import React, { useState, useEffect } from 'react';

function SalespersonSummaryModal({ isOpen, onClose, defaultDate }) {
  const [exportFormat, setExportFormat] = useState('PDF');
  const [usePeriod, setUsePeriod] = useState(false);
  const [periodFrom, setPeriodFrom] = useState('');
  const [periodTo, setPeriodTo] = useState('zzzz');
  const [useDate, setUseDate] = useState(true);
  const [dateFrom, setDateFrom] = useState(defaultDate || '2026-06-15');
  const [dateTo, setDateTo] = useState(defaultDate || '2026-06-15');

  useEffect(() => {
    if (defaultDate) {
      setDateFrom(defaultDate);
      setDateTo(defaultDate);
    }
  }, [defaultDate]);

  if (!isOpen) return null;

  const generateExcel = () => {
    const detailsUrl = `${API_BASE_URL}/api/reports/tender-details${useDate && dateFrom ? '?date=' + dateFrom : ''}`;
    fetch(detailsUrl)
      .then(res => res.json())
      .then(data => {
        const tenderDetails = data.status === 'success' ? data.data : [];
        const tableHtml = `
          <html xmlns:x="urn:schemas-microsoft-com:office:excel">
          <head>
            <style>
              td, th { font-family: Arial; font-size: 13px; }
              th { text-align: left; border-bottom: 1px solid #000; }
            </style>
          </head>
          <body>
          <table>
            <tr><td colspan="5" style="text-align: center; font-size: 16px; font-weight: bold;">Demosparkle</td></tr>
            <tr><td colspan="5" style="text-align: center; font-size: 14px;">Salesperson Summary</td></tr>
            <tr>
              <td colspan="3"><b>Report Date: ${useDate ? dateFrom : 'All'}</b></td>
            </tr>
            <tr><td colspan="5"></td></tr>
            <tr>
              <th>Trans Date</th>
              <th>Trans #</th>
              <th style="text-align: right;">Amount</th>
              <th>Customer Code</th>
              <th>Customer Name</th>
            </tr>
            ${tenderDetails.length > 0 ? tenderDetails.map(d => `
              <tr>
                <td>${d.trans_date}</td>
                <td>${d.trans_no}</td>
                <td style="text-align: right;">$${Number(d.payment_amt).toFixed(2)}</td>
                <td>${d.customer_code}</td>
                <td>${d.customer_name}</td>
              </tr>
            `).join('') : `<tr><td colspan="5" style="text-align:center;">No transactions found for this date.</td></tr>`}
            <tr><td colspan="5" style="border-bottom: 2px solid #000;"></td></tr>
            <tr>
              <td colspan="2"><b>Grand Total</b></td>
              <td style="text-align: right;"><b>$${tenderDetails.reduce((sum, d) => sum + Number(d.payment_amt), 0).toFixed(2)}</b></td>
              <td colspan="2"></td>
            </tr>
          </table>
          </body>
          </html>
        `;

        const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Salesperson_Summary.xls';
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
        borderRadius: '3px', width: '420px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 10px', backgroundColor: '#eef3f7', borderBottom: '1px solid #ccc',
          borderTopLeftRadius: '2px', borderTopRightRadius: '2px'
        }}>
          <h3 style={{ margin: 0, fontSize: '13px', color: '#003366', fontWeight: 'bold' }}>Salesperson Register</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', padding: 0, color: '#333'
          }}>✖</button>
        </div>

        {/* Body */}
        <div style={{ backgroundColor: 'white', padding: '25px 20px', display: 'flex', flexDirection: 'column', gap: '15px', margin: '2px', border: '1px solid #ccc' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '100px 20px 100px 100px', gap: '10px', alignItems: 'center' }}>
            <div style={{ gridColumn: '3' }}>
              <span style={{ fontSize: '13px', fontWeight: 'normal' }}>Start From</span>
            </div>
            <div style={{ gridColumn: '4' }}>
              <span style={{ fontSize: '13px', fontWeight: 'normal' }}>End To</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '100px 20px 100px 100px', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', textAlign: 'right' }}>A/C Period #</span>
            <input type="checkbox" checked={usePeriod} onChange={(e) => setUsePeriod(e.target.checked)} style={{ margin: 0 }} />
            <input type="text" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} disabled={!usePeriod}
                   style={{ width: '100%', border: '1px solid #aaa', padding: '3px 5px', fontSize: '13px', backgroundColor: usePeriod ? 'white' : '#eee', boxSizing: 'border-box' }} />
            <input type="text" value={periodTo} onChange={(e) => setPeriodTo(e.target.value)} disabled={!usePeriod}
                   style={{ width: '100%', border: '1px solid #aaa', padding: '3px 5px', fontSize: '13px', backgroundColor: usePeriod ? 'white' : '#eee', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '100px 20px 100px 100px', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', textAlign: 'right' }}>Date</span>
            <input type="checkbox" checked={useDate} onChange={(e) => setUseDate(e.target.checked)} style={{ margin: 0 }} />
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} disabled={!useDate}
                   onClick={(e) => { try { e.target.showPicker(); } catch(err) {} }}
                   style={{ width: '100%', border: '1px solid #aaa', padding: '3px 5px', fontSize: '13px', backgroundColor: useDate ? 'white' : '#eee', boxSizing: 'border-box', cursor: useDate ? 'pointer' : 'default' }} />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} disabled={!useDate}
                   onClick={(e) => { try { e.target.showPicker(); } catch(err) {} }}
                   style={{ width: '100%', border: '1px solid #aaa', padding: '3px 5px', fontSize: '13px', backgroundColor: useDate ? 'white' : '#eee', boxSizing: 'border-box', cursor: useDate ? 'pointer' : 'default' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
            <span style={{ fontSize: '13px', width: '100px', textAlign: 'right' }}>Export Format</span>
            <div style={{ display: 'flex', gap: '15px' }}>
              <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input type="radio" name="salesSummaryExportFormat" value="PDF" checked={exportFormat === 'PDF'} onChange={() => setExportFormat('PDF')} style={{ margin: 0 }} /> PDF
              </label>
              <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input type="radio" name="salesSummaryExportFormat" value="Excel" checked={exportFormat === 'Excel'} onChange={() => setExportFormat('Excel')} style={{ margin: 0 }} /> Excel
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

export default SalespersonSummaryModal;
