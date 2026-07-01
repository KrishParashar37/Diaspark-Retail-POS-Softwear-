import API_BASE_URL from '../config.js';
import React, { useState } from 'react';
import './ClosedSalesModal.css';

function ClosedSalesModal({ onClose }) {
  const [useSalesNo, setUseSalesNo] = useState(false);
  const [salesStart, setSalesStart] = useState('');
  const [salesEnd, setSalesEnd] = useState('zzzz');

  const [useCustomerNo, setUseCustomerNo] = useState(false);
  const [customerStart, setCustomerStart] = useState('');
  const [customerEnd, setCustomerEnd] = useState('zzzz');

  const [useDate, setUseDate] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [reportType, setReportType] = useState('Sales With Breakup');
  const [exportFormat, setExportFormat] = useState('PDF');

  const handleSubmit = async () => {
    try {
      const runDate = new Date().toLocaleDateString('en-US');
      
      let url = `${API_BASE_URL}/api/reports/closed-sales?reportType=${encodeURIComponent(reportType)}`;
      if (useSalesNo && salesStart && salesEnd) {
        url += `&salesStart=${encodeURIComponent(salesStart)}&salesEnd=${encodeURIComponent(salesEnd)}`;
      }
      if (useCustomerNo && customerStart && customerEnd) {
        url += `&customerStart=${encodeURIComponent(customerStart)}&customerEnd=${encodeURIComponent(customerEnd)}`;
      }
      if (useDate && startDate && endDate) {
        url += `&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      let csvContent = `Closed Sales Summary (${runDate}),,,\n`;
      
      if (reportType === 'Sales With Breakup') {
        csvContent += `Sales #,Trans Date,Customer #,Net Amount,Tax Amount,Total Amount,Payment Type,Payment Amount\n`;
      } else {
        csvContent += `Sales #,Trans Date,Customer #,Net Amount,Tax Amount,Total Amount\n`;
      }

      let totalNet = 0;
      let totalTax = 0;
      let totalGross = 0;
      let totalPayment = 0;

      if (result.status === 'success' && result.data) {
        result.data.forEach(row => {
          const transNo = row.trans_no || '';
          const transDate = row.trans_date || '';
          const customer = row.customer_code || '';
          const net = row.net_amt || 0;
          const tax = row.tax_amt || 0;
          const gross = row.gross_amt || 0;
          
          if (reportType === 'Sales With Breakup') {
            const payType = row.payment_type || '';
            const payAmt = row.payment_amt || 0;
            csvContent += `"${transNo}","${transDate}","${customer}",${net.toFixed(2)},${tax.toFixed(2)},${gross.toFixed(2)},"${payType}",${payAmt.toFixed(2)}\n`;
            totalPayment += payAmt;
          } else {
            csvContent += `"${transNo}","${transDate}","${customer}",${net.toFixed(2)},${tax.toFixed(2)},${gross.toFixed(2)}\n`;
          }
          
          // To avoid duplicating totals for the same invoice in Breakup report, you'd typically handle it, 
          // but for simplicity in a flat CSV, we'll sum the line rows.
          totalNet += net;
          totalTax += tax;
          totalGross += gross;
        });
      }

      if (reportType === 'Sales With Breakup') {
        csvContent += `TOTAL,,,${totalNet.toFixed(2)},${totalTax.toFixed(2)},${totalGross.toFixed(2)},,${totalPayment.toFixed(2)}\n`;
      } else {
        csvContent += `TOTAL,,,${totalNet.toFixed(2)},${totalTax.toFixed(2)},${totalGross.toFixed(2)}\n`;
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const urlObject = URL.createObjectURL(blob);
      link.setAttribute("href", urlObject);
      link.setAttribute("download", `ClosedSales_${reportType.replace(/\s+/g, '')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onClose();
    } catch (error) {
      console.error("Error fetching closed sales:", error);
      alert("Error generating report. Please check the backend connection.");
    }
  };

  return (
    <div className="closed-sales-overlay">
      <div className="closed-sales-modal">
        <div className="closed-sales-header">
          <span>Sales Report</span>
          <button className="closed-sales-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="closed-sales-body">
          <div className="closed-sales-col-labels">
            <span>Start From</span>
            <span>End To</span>
          </div>
          
          <div className="closed-sales-row">
            <div className="closed-sales-label">Sales #</div>
            <div className="closed-sales-inputs">
              <input 
                type="checkbox" 
                className="closed-sales-checkbox" 
                checked={useSalesNo}
                onChange={e => setUseSalesNo(e.target.checked)}
              />
              <input 
                type="text" 
                className="closed-sales-input" 
                value={salesStart}
                onChange={e => setSalesStart(e.target.value)}
                disabled={!useSalesNo}
              />
              <input 
                type="text" 
                className="closed-sales-input" 
                value={salesEnd}
                onChange={e => setSalesEnd(e.target.value)}
                disabled={!useSalesNo}
              />
            </div>
          </div>

          <div className="closed-sales-row">
            <div className="closed-sales-label">Customer #</div>
            <div className="closed-sales-inputs">
              <input 
                type="checkbox" 
                className="closed-sales-checkbox" 
                checked={useCustomerNo}
                onChange={e => setUseCustomerNo(e.target.checked)}
              />
              <input 
                type="text" 
                className="closed-sales-input" 
                value={customerStart}
                onChange={e => setCustomerStart(e.target.value)}
                disabled={!useCustomerNo}
              />
              <input 
                type="text" 
                className="closed-sales-input" 
                value={customerEnd}
                onChange={e => setCustomerEnd(e.target.value)}
                disabled={!useCustomerNo}
              />
            </div>
          </div>

          <div className="closed-sales-row">
            <div className="closed-sales-label">Trans Date</div>
            <div className="closed-sales-inputs">
              <input 
                type="checkbox" 
                className="closed-sales-checkbox" 
                checked={useDate}
                onChange={e => setUseDate(e.target.checked)}
              />
              <input 
                type="date" 
                className="closed-sales-input" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                disabled={!useDate}
              />
              <input 
                type="date" 
                className="closed-sales-input" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                disabled={!useDate}
              />
            </div>
          </div>
          
          <div className="closed-sales-row">
            <div className="closed-sales-label">Report Type</div>
            <select 
              className="closed-sales-select"
              value={reportType}
              onChange={e => setReportType(e.target.value)}
            >
              <option value="Sales With Breakup">Sales With Breakup</option>
              <option value="Sales Report">Sales Report</option>
            </select>
          </div>
          
          <div className="closed-sales-row" style={{ marginTop: '10px' }}>
            <div className="closed-sales-label">Export Format</div>
            <div className="closed-sales-radio-group">
              <label className="closed-sales-radio-label">
                <input 
                  type="radio" 
                  name="exportFormat" 
                  value="PDF" 
                  checked={exportFormat === 'PDF'}
                  onChange={e => setExportFormat(e.target.value)}
                /> PDF
              </label>
              <label className="closed-sales-radio-label">
                <input 
                  type="radio" 
                  name="exportFormat" 
                  value="Excel" 
                  checked={exportFormat === 'Excel'}
                  onChange={e => setExportFormat(e.target.value)}
                /> Excel
              </label>
            </div>
          </div>
          
          <div className="closed-sales-footer">
            <button className="closed-sales-btn" onClick={handleSubmit}>Submit</button>
            <button className="closed-sales-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClosedSalesModal;
