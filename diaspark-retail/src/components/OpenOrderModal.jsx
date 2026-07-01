import React, { useState } from 'react';
import './OpenOrderModal.css';

function OpenOrderModal({ onClose }) {
  const [useOrderNo, setUseOrderNo] = useState(false);
  const [orderStart, setOrderStart] = useState('');
  const [orderEnd, setOrderEnd] = useState('zzzz');

  const [useCustomerNo, setUseCustomerNo] = useState(false);
  const [customerStart, setCustomerStart] = useState('');
  const [customerEnd, setCustomerEnd] = useState('zzzz');

  const [useTransDate, setUseTransDate] = useState(false);
  const [transDateStart, setTransDateStart] = useState('');
  const [transDateEnd, setTransDateEnd] = useState('');

  const [exportFormat, setExportFormat] = useState('Excel');

  const handleSubmit = async () => {
    try {
      const runDate = new Date().toLocaleDateString('en-US');
      
      let url = `http://localhost:5001/api/reports/open-orders?exportFormat=${encodeURIComponent(exportFormat)}`;
      
      if (useOrderNo && orderStart && orderEnd) {
        url += `&orderStart=${encodeURIComponent(orderStart)}&orderEnd=${encodeURIComponent(orderEnd)}`;
      }
      if (useCustomerNo && customerStart && customerEnd) {
        url += `&customerStart=${encodeURIComponent(customerStart)}&customerEnd=${encodeURIComponent(customerEnd)}`;
      }
      if (useTransDate && transDateStart && transDateEnd) {
        url += `&transDateStart=${encodeURIComponent(transDateStart)}&transDateEnd=${encodeURIComponent(transDateEnd)}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      let csvContent = `Open Order Report,,,Run Date : ${runDate}\n\n`;
      csvContent += `Order #,Order Date,Customer ID,Salesperson,Net Amount,Balance Amount,Status\n`;

      const dataArray = Array.isArray(result) ? result : (result.data || []);
      
      let totalNet = 0;
      let totalBal = 0;
      
      dataArray.forEach(row => {
        csvContent += `"${row.OrderNo}","${row.OrderDate}","${row.CustomerID}","${row.Salesperson}",${row.NetAmount},${row.BalanceAmount},"${row.Status}"\n`;
        totalNet += row.NetAmount;
        totalBal += row.BalanceAmount;
      });
      csvContent += `TOTAL,,,,${totalNet.toFixed(2)},${totalBal.toFixed(2)},\n`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const objUrl = URL.createObjectURL(blob);
      link.setAttribute("href", objUrl);
      link.setAttribute("download", `OpenOrderReport.csv`);
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
    <div className="open-order-overlay">
      <div className="open-order-modal">
        <div className="open-order-header">
          <span>Open Order Report</span>
          <button className="open-order-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="open-order-body">
          <div className="open-order-col-labels">
            <span>Start From</span>
            <span>End To</span>
          </div>
          
          <div className="open-order-row">
            <div className="open-order-label">Order #</div>
            <div className="open-order-inputs">
              <input 
                type="checkbox" 
                className="open-order-checkbox" 
                checked={useOrderNo}
                onChange={e => setUseOrderNo(e.target.checked)}
              />
              <input 
                type="text" 
                className="open-order-input" 
                value={orderStart}
                onChange={e => setOrderStart(e.target.value)}
                disabled={!useOrderNo}
              />
              <input 
                type="text" 
                className="open-order-input" 
                value={orderEnd}
                onChange={e => setOrderEnd(e.target.value)}
                disabled={!useOrderNo}
              />
            </div>
          </div>

          <div className="open-order-row">
            <div className="open-order-label">Customer #</div>
            <div className="open-order-inputs">
              <input 
                type="checkbox" 
                className="open-order-checkbox" 
                checked={useCustomerNo}
                onChange={e => setUseCustomerNo(e.target.checked)}
              />
              <input 
                type="text" 
                className="open-order-input" 
                value={customerStart}
                onChange={e => setCustomerStart(e.target.value)}
                disabled={!useCustomerNo}
              />
              <input 
                type="text" 
                className="open-order-input" 
                value={customerEnd}
                onChange={e => setCustomerEnd(e.target.value)}
                disabled={!useCustomerNo}
              />
            </div>
          </div>

          <div className="open-order-row">
            <div className="open-order-label">Trans Date</div>
            <div className="open-order-inputs">
              <input 
                type="checkbox" 
                className="open-order-checkbox" 
                checked={useTransDate}
                onChange={e => setUseTransDate(e.target.checked)}
              />
              <input 
                type="date" 
                className="open-order-input" 
                value={transDateStart}
                onChange={e => setTransDateStart(e.target.value)}
                disabled={!useTransDate}
              />
              <input 
                type="date" 
                className="open-order-input" 
                value={transDateEnd}
                onChange={e => setTransDateEnd(e.target.value)}
                disabled={!useTransDate}
              />
            </div>
          </div>
          
          <div className="open-order-row" style={{ marginTop: '10px' }}>
            <div className="open-order-label">Export Format</div>
            <div className="open-order-radio-group">
              <label className="open-order-radio-label">
                <input 
                  type="radio" 
                  name="exportFormat" 
                  value="PDF" 
                  checked={exportFormat === 'PDF'}
                  onChange={e => setExportFormat(e.target.value)}
                /> PDF
              </label>
              <label className="open-order-radio-label">
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
          
          <div className="open-order-footer">
            <button className="open-order-btn" onClick={handleSubmit}>Submit</button>
            <button className="open-order-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpenOrderModal;
