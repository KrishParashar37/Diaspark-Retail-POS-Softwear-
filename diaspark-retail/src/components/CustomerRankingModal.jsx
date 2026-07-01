import API_BASE_URL from '../config.js';
import React, { useState } from 'react';
import './CustomerRankingModal.css';

function CustomerRankingModal({ onClose }) {
  const [date, setDate] = useState('');
  const [reportFormat, setReportFormat] = useState('Customer Ranking MTD');
  const [top, setTop] = useState('25');
  const [exportFormat, setExportFormat] = useState('PDF');

  const handleSubmit = async () => {
    try {
      const runDate = new Date().toLocaleDateString('en-US');
      
      let url = `${API_BASE_URL}/api/reports/customer-ranking?reportFormat=${encodeURIComponent(reportFormat)}&top=${top}`;
      
      if (date) {
        url += `&date=${encodeURIComponent(date)}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      let csvContent = `Customer Ranking Report,,,Run Date : ${runDate}\n`;
      csvContent += `Report Format: ${reportFormat},,,Date: ${date || runDate}\n\n`;
      csvContent += `Rank,Customer Code,Total Net Sales\n`;

      const dataArray = Array.isArray(result) ? result : (result.data || []);
      
      dataArray.forEach(row => {
        csvContent += `${row.Rank},"${row.CustomerCode}",${row.TotalSales}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const objUrl = URL.createObjectURL(blob);
      link.setAttribute("href", objUrl);
      link.setAttribute("download", `CustomerRankingReport.csv`);
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
    <div className="customer-ranking-overlay">
      <div className="customer-ranking-modal">
        <div className="customer-ranking-header">
          <span>Top Sales</span>
          <button className="customer-ranking-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="customer-ranking-body">
          <div className="customer-ranking-row">
            <div className="customer-ranking-label">Date</div>
            <input 
              type="date" 
              className="customer-ranking-input" 
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          
          <div className="customer-ranking-row">
            <div className="customer-ranking-label">Report Format</div>
            <select 
              className="customer-ranking-select"
              value={reportFormat}
              onChange={e => setReportFormat(e.target.value)}
            >
              <option value="Customer Ranking MTD">Customer Ranking MTD</option>
              <option value="Customer Ranking YTD">Customer Ranking YTD</option>
            </select>
          </div>

          <div className="customer-ranking-row">
            <div className="customer-ranking-label">Top</div>
            <input 
              type="number" 
              className="customer-ranking-input" 
              value={top}
              onChange={e => setTop(e.target.value)}
              min="1"
            />
          </div>
          
          <div className="customer-ranking-row" style={{ marginTop: '10px' }}>
            <div className="customer-ranking-label">Export Format</div>
            <div className="customer-ranking-radio-group">
              <label className="customer-ranking-radio-label">
                <input 
                  type="radio" 
                  name="exportFormat" 
                  value="PDF" 
                  checked={exportFormat === 'PDF'}
                  onChange={e => setExportFormat(e.target.value)}
                /> PDF
              </label>
              <label className="customer-ranking-radio-label">
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
          
          <div className="customer-ranking-footer">
            <button className="customer-ranking-btn" onClick={handleSubmit}>Submit</button>
            <button className="customer-ranking-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerRankingModal;
