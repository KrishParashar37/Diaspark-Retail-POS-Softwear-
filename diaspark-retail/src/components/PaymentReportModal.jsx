import API_BASE_URL from '../config.js';
import React, { useState } from 'react';
import './PaymentReportModal.css';

function PaymentReportModal({ onClose }) {
  const [useDate, setUseDate] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [reportType, setReportType] = useState('Summary');
  const [exportFormat, setExportFormat] = useState('PDF');

  const handleSubmit = async () => {
    try {
      const runDate = new Date().toLocaleDateString('en-US');
      
      let fetchStart = '';
      let fetchEnd = '';

      if (useDate && startDate && endDate) {
        fetchStart = startDate;
        fetchEnd = endDate;
      }

      let url = `${API_BASE_URL}/api/reports/payments?reportType=${encodeURIComponent(reportType)}`;
      if (fetchStart && fetchEnd) {
        url += `&startDate=${encodeURIComponent(fetchStart)}&endDate=${encodeURIComponent(fetchEnd)}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      const startStr = fetchStart || '01/01/2026';
      const endStr = fetchEnd || runDate;

      let csvContent = `Payment History Report (${startStr} - ${endStr}),,,Run Date : ${runDate}\n`;
      csvContent += `Report Type: ${reportType}\n\n`;

      const dataArray = Array.isArray(result) ? result : (result.data || []);
      
      if (reportType === 'Summary') {
        csvContent += `Payment Type,Total Amount\n`;
        let grandTotal = 0;
        dataArray.forEach(row => {
          csvContent += `"${row.PaymentType}",${row.TotalAmount}\n`;
          grandTotal += row.TotalAmount;
        });
        csvContent += `TOTAL,${grandTotal.toFixed(2)}\n`;
      } else {
        csvContent += `Transaction #,Date,Invoice #,Payment Type,Amount,Customer #\n`;
        let grandTotal = 0;
        dataArray.forEach(row => {
          csvContent += `"${row.TransNo}","${row.TransDate}","${row.InvoiceNo}","${row.PaymentType}",${row.Amount},"${row.CustomerNo}"\n`;
          grandTotal += row.Amount;
        });
        csvContent += `TOTAL,,,,${grandTotal.toFixed(2)},\n`;
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const objUrl = URL.createObjectURL(blob);
      link.setAttribute("href", objUrl);
      link.setAttribute("download", `PaymentReport_${reportType.replace(/\s+/g, '')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onClose();
    } catch (err) {
      console.error(err);
      alert("Error generating report. Check console.");
    }
  };

  return (
    <div className="payment-report-overlay">
      <div className="payment-report-modal">
        <div className="payment-report-header">
          <span>Payment Report</span>
          <button className="payment-report-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="payment-report-body">
          <div className="payment-report-date-labels">
            <span>Start From</span>
            <span>End To</span>
          </div>
          
          <div className="payment-report-row">
            <div className="payment-report-label">Date</div>
            <div className="payment-report-date-inputs">
              <input 
                type="checkbox" 
                className="payment-report-checkbox" 
                checked={useDate}
                onChange={e => setUseDate(e.target.checked)}
              />
              <input 
                type="date" 
                className="payment-report-input" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                disabled={!useDate}
              />
              <input 
                type="date" 
                className="payment-report-input" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                disabled={!useDate}
              />
            </div>
          </div>
          
          <div className="payment-report-row">
            <div className="payment-report-label">Report Type</div>
            <select 
              className="payment-report-select"
              value={reportType}
              onChange={e => setReportType(e.target.value)}
            >
              <option value="Summary">Summary</option>
              <option value="Detail">Detail</option>
              <option value="Cash">Cash</option>
              <option value="Check">Check</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Gift Certificate">Gift Certificate</option>
              <option value="Finance">Finance</option>
              <option value="Store Credit">Store Credit</option>
            </select>
          </div>
          
          <div className="payment-report-row" style={{ marginTop: '10px' }}>
            <div className="payment-report-label">Export Format</div>
            <div className="payment-report-radio-group">
              <label className="payment-report-radio-label">
                <input 
                  type="radio" 
                  name="exportFormat" 
                  value="PDF" 
                  checked={exportFormat === 'PDF'}
                  onChange={e => setExportFormat(e.target.value)}
                /> PDF
              </label>
              <label className="payment-report-radio-label">
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
          
          <div className="payment-report-footer">
            <button className="payment-report-btn" onClick={handleSubmit}>Submit</button>
            <button className="payment-report-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentReportModal;
