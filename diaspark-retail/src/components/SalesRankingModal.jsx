import API_BASE_URL from '../config.js';
import React, { useState } from 'react';
import './SalesRankingModal.css';

function SalesRankingModal({ onClose }) {
  const [useDate, setUseDate] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [reportFormat, setReportFormat] = useState('Date Range');
  const [exportFormat, setExportFormat] = useState('PDF');

  const handleSubmit = async () => {
    try {
      const runDate = new Date().toLocaleDateString('en-US');
      let fetchStart = '';
      let fetchEnd = '';

      if (reportFormat === 'MTD') {
        const now = new Date();
        // first day of current month
        fetchStart = new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString('en-CA');
        // last day of current month
        fetchEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toLocaleDateString('en-CA');
      } else if (reportFormat === 'YTD') {
        const now = new Date();
        // first day of year
        fetchStart = new Date(now.getFullYear(), 0, 1).toLocaleDateString('en-CA');
        // last day of year
        fetchEnd = new Date(now.getFullYear(), 11, 31).toLocaleDateString('en-CA');
      } else {
        if (useDate && startDate && endDate) {
          fetchStart = startDate;
          fetchEnd = endDate;
        }
      }

      let url = `${API_BASE_URL}/api/reports/split-sales-summary?reportType=Sales%20Person`;
      if (fetchStart && fetchEnd) {
        url += `&startDate=${encodeURIComponent(fetchStart)}&endDate=${encodeURIComponent(fetchEnd)}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      const startStr = fetchStart || '01/01/2026';
      const endStr = fetchEnd || runDate;

      let csvContent = `Salesperson Ranking Summary (${startStr} - ${endStr}),,,Run Date : ${runDate}\n`;
      csvContent += `Rank,Name,Net Sales,Margin $,Margin %\n`;

      let totalNet = 0;
      let totalMargin = 0;

      const dataArray = Array.isArray(result) ? result : (result.data || []);

      dataArray.forEach((row, index) => {
        const groupName = row.GroupName || row.salespersonName || 'UNKNOWN';
        const net = row.NetSales !== undefined ? row.NetSales : (row.netSales || 0);
        const margin = row.Margin !== undefined ? row.Margin : (row.marginDollars || 0);
        const marginPct = row.MarginPct !== undefined ? row.MarginPct : (row.marginPercent || 0);

        csvContent += `${index + 1},"${groupName}",${net.toFixed(2)},${margin.toFixed(2)},${marginPct.toFixed(2)}\n`;
        totalNet += net;
        totalMargin += margin;
      });

      const totalMarginPct = totalNet > 0 ? ((totalMargin / totalNet) * 100) : 0;
      csvContent += `TOTAL,,${totalNet.toFixed(2)},${totalMargin.toFixed(2)},${totalMarginPct.toFixed(2)}\n`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const urlObject = URL.createObjectURL(blob);
      link.setAttribute("href", urlObject);
      link.setAttribute("download", `SalespersonRanking_${reportFormat}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onClose();
    } catch (error) {
      console.error("Error fetching salesperson ranking:", error);
      alert("Error generating report. Please check the backend connection.");
    }
  };

  return (
    <div className="sales-ranking-overlay">
      <div className="sales-ranking-modal">
        <div className="sales-ranking-header">
          <span>Salesperson Summary</span>
          <button className="sales-ranking-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="sales-ranking-body">
          <div className="sales-ranking-date-labels">
            <span>Start From</span>
            <span>End To</span>
          </div>
          
          <div className="sales-ranking-row">
            <div className="sales-ranking-label">Date</div>
            <div className="sales-ranking-date-inputs">
              <input 
                type="checkbox" 
                className="sales-ranking-checkbox" 
                checked={useDate}
                onChange={e => setUseDate(e.target.checked)}
              />
              <input 
                type="date" 
                className="sales-ranking-input" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                disabled={!useDate}
              />
              <input 
                type="date" 
                className="sales-ranking-input" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                disabled={!useDate}
              />
            </div>
          </div>
          
          <div className="sales-ranking-row">
            <div className="sales-ranking-label">Report Format</div>
            <select 
              className="sales-ranking-select"
              value={reportFormat}
              onChange={e => setReportFormat(e.target.value)}
            >
              <option value="Date Range">Date Range</option>
              <option value="MTD">MTD</option>
              <option value="YTD">YTD</option>
            </select>
          </div>
          
          <div className="sales-ranking-row" style={{ marginTop: '10px' }}>
            <div className="sales-ranking-label">Export Format</div>
            <div className="sales-ranking-radio-group">
              <label className="sales-ranking-radio-label">
                <input 
                  type="radio" 
                  name="exportFormat" 
                  value="PDF" 
                  checked={exportFormat === 'PDF'}
                  onChange={e => setExportFormat(e.target.value)}
                /> PDF
              </label>
              <label className="sales-ranking-radio-label">
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
          
          <div className="sales-ranking-footer">
            <button className="sales-ranking-btn" onClick={handleSubmit}>Submit</button>
            <button className="sales-ranking-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesRankingModal;
