import API_BASE_URL from '../config.js';
import React, { useState } from 'react';
import './TaxReportModal.css';

function TaxReportModal({ onClose }) {
  const [useStore, setUseStore] = useState(false);
  const [storeStart, setStoreStart] = useState('Edison');
  const [storeEnd, setStoreEnd] = useState('Edison');

  const [useAcPeriod, setUseAcPeriod] = useState(false);
  const [acPeriodStart, setAcPeriodStart] = useState('');
  const [acPeriodEnd, setAcPeriodEnd] = useState('zzzz');

  const [useSalesDate, setUseSalesDate] = useState(false);
  const [salesDateStart, setSalesDateStart] = useState('');
  const [salesDateEnd, setSalesDateEnd] = useState('');

  const [useSalesNo, setUseSalesNo] = useState(false);
  const [salesNoStart, setSalesNoStart] = useState('');
  const [salesNoEnd, setSalesNoEnd] = useState('zzzz');

  const [useCustomerNo, setUseCustomerNo] = useState(false);
  const [customerStart, setCustomerStart] = useState('');
  const [customerEnd, setCustomerEnd] = useState('zzzz');

  const [reportFormat, setReportFormat] = useState('By TaxLocation');
  const [exportFormat, setExportFormat] = useState('PDF');

  const handleSubmit = async () => {
    try {
      const runDate = new Date().toLocaleDateString('en-US');
      
      let url = `${API_BASE_URL}/api/reports/tax?reportFormat=${encodeURIComponent(reportFormat)}`;
      
      if (useStore && storeStart && storeEnd) {
        url += `&storeStart=${encodeURIComponent(storeStart)}&storeEnd=${encodeURIComponent(storeEnd)}`;
      }
      if (useAcPeriod && acPeriodStart && acPeriodEnd) {
        url += `&acPeriodStart=${encodeURIComponent(acPeriodStart)}&acPeriodEnd=${encodeURIComponent(acPeriodEnd)}`;
      }
      if (useSalesDate && salesDateStart && salesDateEnd) {
        url += `&salesDateStart=${encodeURIComponent(salesDateStart)}&salesDateEnd=${encodeURIComponent(salesDateEnd)}`;
      }
      if (useSalesNo && salesNoStart && salesNoEnd) {
        url += `&salesNoStart=${encodeURIComponent(salesNoStart)}&salesNoEnd=${encodeURIComponent(salesNoEnd)}`;
      }
      if (useCustomerNo && customerStart && customerEnd) {
        url += `&customerStart=${encodeURIComponent(customerStart)}&customerEnd=${encodeURIComponent(customerEnd)}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      let csvContent = `Tax Charges Report,,,Run Date : ${runDate}\n`;
      csvContent += `Report Format: ${reportFormat}\n\n`;

      const dataArray = Array.isArray(result) ? result : (result.data || []);
      
      if (reportFormat === 'By TaxLocation') {
        csvContent += `Tax State,Tax Code,Net Sales,Tax Amount,Gross Amount\n`;
        let totalNet = 0;
        let totalTax = 0;
        let totalGross = 0;
        
        dataArray.forEach(row => {
          csvContent += `"${row.TaxState}","${row.TaxCode}",${row.NetSales},${row.TaxAmount},${row.GrossAmount}\n`;
          totalNet += row.NetSales;
          totalTax += row.TaxAmount;
          totalGross += row.GrossAmount;
        });
        csvContent += `TOTAL,,${totalNet.toFixed(2)},${totalTax.toFixed(2)},${totalGross.toFixed(2)}\n`;
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const objUrl = URL.createObjectURL(blob);
      link.setAttribute("href", objUrl);
      link.setAttribute("download", `TaxReport_${reportFormat.replace(/\s+/g, '')}.csv`);
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
    <div className="tax-report-overlay">
      <div className="tax-report-modal">
        <div className="tax-report-header">
          <span>Tax Report</span>
          <button className="tax-report-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="tax-report-body">
          <div className="tax-report-col-labels">
            <span>Start From</span>
            <span>End To</span>
          </div>
          
          <div className="tax-report-row">
            <div className="tax-report-label">Store #</div>
            <div className="tax-report-inputs">
              <input 
                type="checkbox" 
                className="tax-report-checkbox" 
                checked={useStore}
                onChange={e => setUseStore(e.target.checked)}
              />
              <input 
                type="text" 
                className="tax-report-input" 
                value={storeStart}
                onChange={e => setStoreStart(e.target.value)}
                disabled={!useStore}
              />
              <input 
                type="text" 
                className="tax-report-input" 
                value={storeEnd}
                onChange={e => setStoreEnd(e.target.value)}
                disabled={!useStore}
              />
            </div>
          </div>

          <div className="tax-report-row">
            <div className="tax-report-label">A/c Period #</div>
            <div className="tax-report-inputs">
              <input 
                type="checkbox" 
                className="tax-report-checkbox" 
                checked={useAcPeriod}
                onChange={e => setUseAcPeriod(e.target.checked)}
              />
              <input 
                type="text" 
                className="tax-report-input" 
                value={acPeriodStart}
                onChange={e => setAcPeriodStart(e.target.value)}
                disabled={!useAcPeriod}
              />
              <input 
                type="text" 
                className="tax-report-input" 
                value={acPeriodEnd}
                onChange={e => setAcPeriodEnd(e.target.value)}
                disabled={!useAcPeriod}
              />
            </div>
          </div>

          <div className="tax-report-row">
            <div className="tax-report-label">Sales Date</div>
            <div className="tax-report-inputs">
              <input 
                type="checkbox" 
                className="tax-report-checkbox" 
                checked={useSalesDate}
                onChange={e => setUseSalesDate(e.target.checked)}
              />
              <input 
                type="date" 
                className="tax-report-input" 
                value={salesDateStart}
                onChange={e => setSalesDateStart(e.target.value)}
                disabled={!useSalesDate}
              />
              <input 
                type="date" 
                className="tax-report-input" 
                value={salesDateEnd}
                onChange={e => setSalesDateEnd(e.target.value)}
                disabled={!useSalesDate}
              />
            </div>
          </div>

          <div className="tax-report-row">
            <div className="tax-report-label">Sales #</div>
            <div className="tax-report-inputs">
              <input 
                type="checkbox" 
                className="tax-report-checkbox" 
                checked={useSalesNo}
                onChange={e => setUseSalesNo(e.target.checked)}
              />
              <input 
                type="text" 
                className="tax-report-input" 
                value={salesNoStart}
                onChange={e => setSalesNoStart(e.target.value)}
                disabled={!useSalesNo}
              />
              <input 
                type="text" 
                className="tax-report-input" 
                value={salesNoEnd}
                onChange={e => setSalesNoEnd(e.target.value)}
                disabled={!useSalesNo}
              />
            </div>
          </div>

          <div className="tax-report-row">
            <div className="tax-report-label">Customer #</div>
            <div className="tax-report-inputs">
              <input 
                type="checkbox" 
                className="tax-report-checkbox" 
                checked={useCustomerNo}
                onChange={e => setUseCustomerNo(e.target.checked)}
              />
              <input 
                type="text" 
                className="tax-report-input" 
                value={customerStart}
                onChange={e => setCustomerStart(e.target.value)}
                disabled={!useCustomerNo}
              />
              <input 
                type="text" 
                className="tax-report-input" 
                value={customerEnd}
                onChange={e => setCustomerEnd(e.target.value)}
                disabled={!useCustomerNo}
              />
            </div>
          </div>
          
          <div className="tax-report-row">
            <div className="tax-report-label">Report Format</div>
            <select 
              className="tax-report-select"
              value={reportFormat}
              onChange={e => setReportFormat(e.target.value)}
            >
              <option value="By TaxLocation">By TaxLocation</option>
            </select>
          </div>
          
          <div className="tax-report-row" style={{ marginTop: '10px' }}>
            <div className="tax-report-label">Export Format</div>
            <div className="tax-report-radio-group">
              <label className="tax-report-radio-label">
                <input 
                  type="radio" 
                  name="exportFormat" 
                  value="PDF" 
                  checked={exportFormat === 'PDF'}
                  onChange={e => setExportFormat(e.target.value)}
                /> PDF
              </label>
              <label className="tax-report-radio-label">
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
          
          <div className="tax-report-footer">
            <button className="tax-report-btn" onClick={handleSubmit}>Submit</button>
            <button className="tax-report-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaxReportModal;
