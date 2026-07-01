import React, { useState } from 'react';
import './SplitSalesSummaryModal.css';

function SplitSalesSummaryModal({ onClose }) {
  const [useDate, setUseDate] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('Sales Person');
  const [exportFormat, setExportFormat] = useState('PDF');

  const handleSubmit = async () => {
    // Determine title based on report type
    let titlePrefix = "Salesperson";
    if (reportType === 'Clerk') titlePrefix = 'Clerk';
    if (reportType === 'Item') titlePrefix = 'Item';
    if (reportType === 'State') titlePrefix = 'State';

    const runDate = new Date().toLocaleDateString('en-US');
    const startStr = useDate && startDate ? startDate : '01/01/2026';
    const endStr = useDate && endDate ? endDate : runDate;

    try {
      let url = `http://localhost:5001/api/reports/split-sales-summary?reportType=${encodeURIComponent(reportType)}`;
      if (useDate && startDate && endDate) {
        url += `&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      let csvContent = `${titlePrefix} Summary (${startStr} - ${endStr}),,,Run Date : ${runDate}\n`;
      
      // Customize headers based on report type
      if (reportType === 'State') {
        csvContent += `State,Net Sales,Margin $,Margin %\n`;
      } else if (reportType === 'Item') {
        csvContent += `Item Name,Net Sales,Margin $,Margin %\n`;
      } else if (reportType === 'Clerk') {
        csvContent += `Clerk #,Name,Net Sales,Margin $,Margin %\n`;
      } else {
        csvContent += `Salesperson #,Name,Net Sales,Margin $,Margin %\n`;
      }

      let totalNet = 0;
      let totalMargin = 0;

      const dataArray = Array.isArray(result) ? result : (result.data || []);

      dataArray.forEach(row => {
        const groupName = row.GroupName || row.salespersonName || 'UNKNOWN';
        const net = row.NetSales !== undefined ? row.NetSales : (row.netSales || 0);
        const margin = row.Margin !== undefined ? row.Margin : (row.marginDollars || 0);
        const marginPct = row.MarginPct !== undefined ? row.MarginPct : (row.marginPercent || 0);

        if (reportType === 'State' || reportType === 'Item') {
          // One column for group name
          csvContent += `"${groupName}",${net.toFixed(2)},${margin.toFixed(2)},${marginPct.toFixed(2)}\n`;
        } else {
          // Two columns (code/name)
          csvContent += `"${groupName}","${groupName}",${net.toFixed(2)},${margin.toFixed(2)},${marginPct.toFixed(2)}\n`;
        }
        
        totalNet += net;
        totalMargin += margin;
      });

      const totalMarginPct = totalNet > 0 ? ((totalMargin / totalNet) * 100) : 0;
      
      // Customize TOTAL row alignment based on column count
      if (reportType === 'State' || reportType === 'Item') {
        csvContent += `TOTAL,${totalNet.toFixed(2)},${totalMargin.toFixed(2)},${totalMarginPct.toFixed(2)}\n`;
      } else {
        csvContent += `TOTAL,,${totalNet.toFixed(2)},${totalMargin.toFixed(2)},${totalMarginPct.toFixed(2)}\n`;
      }

      // Create a Blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const urlObject = URL.createObjectURL(blob);
      link.setAttribute("href", urlObject);
      link.setAttribute("download", `SplitSalesSummary_${reportType.replace(/\s+/g, '')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onClose();
    } catch (error) {
      console.error("Error fetching split sales summary:", error);
      alert("Error generating report. Please check the backend connection.");
    }
  };

  return (
    <div className="split-sales-overlay">
      <div className="split-sales-modal">
        <div className="split-sales-header">
          <span>Sales Summary</span>
          <button className="split-sales-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="split-sales-body">
          <div className="split-sales-date-labels">
            <span>Start From</span>
            <span>End To</span>
          </div>
          
          <div className="split-sales-row">
            <div className="split-sales-label">Date</div>
            <div className="split-sales-date-inputs">
              <input 
                type="checkbox" 
                className="split-sales-checkbox" 
                checked={useDate}
                onChange={e => setUseDate(e.target.checked)}
              />
              <input 
                type="date" 
                className="split-sales-input" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                disabled={!useDate}
              />
              <input 
                type="date" 
                className="split-sales-input" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                disabled={!useDate}
              />
            </div>
          </div>
          
          <div className="split-sales-row">
            <div className="split-sales-label">Report Type</div>
            <select 
              className="split-sales-select"
              value={reportType}
              onChange={e => setReportType(e.target.value)}
            >
              <option value="Sales Person">Sales Person</option>
              <option value="Clerk">Clerk</option>
              <option value="Item">Item</option>
              <option value="State">State</option>
            </select>
          </div>
          
          <div className="split-sales-row" style={{ marginTop: '5px' }}>
            <div className="split-sales-label">Export Format</div>
            <div className="split-sales-radio-group">
              <label className="split-sales-radio-label">
                <input 
                  type="radio" 
                  name="exportFormat" 
                  value="PDF" 
                  checked={exportFormat === 'PDF'}
                  onChange={e => setExportFormat(e.target.value)}
                /> PDF
              </label>
              <label className="split-sales-radio-label">
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
        </div>
        
        <div className="split-sales-footer">
          <button className="split-sales-btn" onClick={handleSubmit}>Submit</button>
          <button className="split-sales-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default SplitSalesSummaryModal;
