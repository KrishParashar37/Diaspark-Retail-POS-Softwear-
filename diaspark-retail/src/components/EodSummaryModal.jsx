import React, { useState, useEffect } from 'react';

function EodSummaryModal({ isOpen, onClose, defaultDate }) {
  const [exportFormat, setExportFormat] = useState('PDF');
  const [useDate, setUseDate] = useState(true);
  const [dateStr, setDateStr] = useState(defaultDate || '2026-06-15');
  const [reportFormat, setReportFormat] = useState('Tender Payment');

  useEffect(() => {
    if (defaultDate) setDateStr(defaultDate);
  }, [defaultDate]);

  if (!isOpen) return null;

  const generateExcel = () => {
    const summaryUrl = `http://localhost:5001/api/reports/tender-summary${useDate && dateStr ? '?date=' + dateStr : ''}`;
    const detailsUrl = `http://localhost:5001/api/reports/tender-details${useDate && dateStr ? '?date=' + dateStr : ''}`;

    Promise.all([
      fetch(summaryUrl).then(res => res.json()),
      fetch(detailsUrl).then(res => res.json())
    ])
      .then(([summaryData, detailsData]) => {
        const tenderSummary = summaryData.status === 'success' ? summaryData.data : [];
        const tenderDetails = detailsData.status === 'success' ? detailsData.data : [];
        const grandTotal = tenderSummary.reduce((sum, ts) => sum + Number(ts.total), 0);
        
        let rowsHtml = '';
        tenderSummary.forEach(ts => {
          rowsHtml += `
            <tr>
              <td>Zon ${ts.payment_type.toUpperCase()}</td>
              <td>ZON-${ts.payment_type}</td>
              <td style="text-align: right;">1</td>
              <td style="text-align: right;">$${Number(ts.total).toFixed(2)}</td>
              <td style="text-align: right;">$0.00</td>
              <td style="text-align: right;">$${Number(ts.total).toFixed(2)}</td>
            </tr>
          `;
        });

        const tableHtml = `
          <html xmlns:x="urn:schemas-microsoft-com:office:excel">
          <head>
            <style>
              td, th { font-family: Arial; font-size: 13px; }
              th { text-align: left; border-bottom: 1px solid #000; }
            </style>
          </head>
          <body>
          <table style="width: 800px;">
            <tr>
              <td colspan="6" style="text-align: center; font-size: 16px; font-weight: bold;">Demosparkle</td>
            </tr>
            <tr>
              <td colspan="6" style="text-align: center; font-size: 14px; font-weight: bold;">Edison</td>
            </tr>
            <tr>
              <td colspan="2"><b>Terminal #: POS</b></td>
              <td colspan="2" style="text-align: center; font-weight: bold;">Tender Summary</td>
              <td colspan="2" style="text-align: right; font-weight: bold;">Tender Date : ${useDate ? dateStr : 'All'}</td>
            </tr>
            <tr>
              <td colspan="6"><b>Batch #: ${useDate ? dateStr.replace(/-/g, '') : 'ALL'}-POS</b></td>
            </tr>
            <tr><td colspan="6"></td></tr>
            <tr>
              <th>Tender Type</th>
              <th>Tender SubType</th>
              <th style="text-align: right;">#Trans</th>
              <th style="text-align: right;">Tendered</th>
              <th style="text-align: right;">Change</th>
              <th style="text-align: right;">Net Amount</th>
            </tr>
            ${rowsHtml}
            <tr>
              <td><b>Total</b></td>
              <td></td>
              <td style="text-align: right;"><b>${tenderSummary.length}</b></td>
              <td style="text-align: right;"><b>$${grandTotal.toFixed(2)}</b></td>
              <td style="text-align: right;"><b>$0.00</b></td>
              <td style="text-align: right;"><b>$${grandTotal.toFixed(2)}</b></td>
            </tr>
            <tr><td colspan="6"></td></tr>
            
            <!-- Details Section Header -->
            <tr><td colspan="6"><b>Details :</b></td></tr>
            <tr>
              <th style="border-bottom: none;">Trans Date</th>
              <th style="border-bottom: none;">Trans #</th>
              <th style="border-bottom: none; text-align: right;">Amount</th>
              <th style="border-bottom: none; text-align: right;">Change</th>
              <th style="border-bottom: none;">Customer Code</th>
              <th style="border-bottom: none;">Customer Name</th>
            </tr>
            <tr><td colspan="6" style="border-top: 1px solid #000;"></td></tr>
            
            ${tenderDetails.length > 0 ? tenderDetails.map(d => `
              <tr>
                <td>${d.trans_date}</td>
                <td>${d.trans_no}</td>
                <td style="text-align: right;">$${Number(d.payment_amt).toFixed(2)}</td>
                <td style="text-align: right;">$0.00</td>
                <td>${d.customer_code}</td>
                <td>${d.customer_name}</td>
              </tr>
            `).join('') : `<tr><td colspan="6" style="text-align:center;">No transactions found for this date.</td></tr>`}

            <tr>
              <td><b>Net Total</b></td>
              <td></td>
              <td style="text-align: right;"><b>$${tenderDetails.reduce((sum, d) => sum + Number(d.payment_amt), 0).toFixed(2)}</b></td>
              <td colspan="3"></td>
            </tr>
            <tr><td colspan="6" style="border-bottom: 2px solid #000;"></td></tr>
            <tr>
              <td colspan="2"><b>Grand Total</b></td>
              <td style="text-align: right;"><b>$${tenderDetails.reduce((sum, d) => sum + Number(d.payment_amt), 0).toFixed(2)}</b></td>
              <td colspan="3"></td>
            </tr>
          </table>
          </body>
          </html>
        `;

        const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Tender_Summary.xls';
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
        borderRadius: '3px', width: '380px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 10px', backgroundColor: '#eef3f7', borderBottom: '1px solid #ccc',
          borderTopLeftRadius: '2px', borderTopRightRadius: '2px'
        }}>
          <h3 style={{ margin: 0, fontSize: '13px', color: '#003366', fontWeight: 'bold' }}>EOD Summary</h3>
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
            <span style={{ fontSize: '13px', width: '80px', textAlign: 'right' }}>Report Format</span>
            <select 
              value={reportFormat} 
              onChange={(e) => setReportFormat(e.target.value)}
              style={{ width: '150px', border: '1px solid #aaa', padding: '3px 5px', fontSize: '13px' }}
            >
              <option value="Tender Payment">Tender Payment</option>
              {/* Add more options as needed */}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '30px' }}>
            <span style={{ fontSize: '13px', width: '80px', textAlign: 'right' }}>Export Format</span>
            <div style={{ display: 'flex', gap: '15px' }}>
              <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input type="radio" name="eodExportFormat" value="PDF" checked={exportFormat === 'PDF'} onChange={() => setExportFormat('PDF')} style={{ margin: 0 }} /> PDF
              </label>
              <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input type="radio" name="eodExportFormat" value="Excel" checked={exportFormat === 'Excel'} onChange={() => setExportFormat('Excel')} style={{ margin: 0 }} /> Excel
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

export default EodSummaryModal;
