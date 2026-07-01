import API_BASE_URL from '../config.js';
import React, { useState, useEffect } from 'react';
import './SalesPage.css';
import PrintEndOfDayCloseoutModal from './PrintEndOfDayCloseoutModal';
import EodSummaryModal from './EodSummaryModal';
import SalespersonReportModal from './SalespersonReportModal';
import SalespersonSummaryModal from './SalespersonSummaryModal';
import PaymentDetailModal from './PaymentDetailModal';

function EndOfDayCloseoutPage({ onNavigate }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showEodModal, setShowEodModal] = useState(false);
  const [showSalespersonReportModal, setShowSalespersonReportModal] = useState(false);
  const [showSalespersonSummaryModal, setShowSalespersonSummaryModal] = useState(false);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState('');

  const [denoms, setDenoms] = useState({
    '100': 0, '50': 0, '20': 0, '10': 0, '5': 0, '1': 0,
    '0.25': 0, '0.10': 0, '0.05': 0, '0.01': 0
  });
  const [additionalCash, setAdditionalCash] = useState(0);
  const [openingAmount, setOpeningAmount] = useState('');
  const [closeoutDate, setCloseoutDate] = useState('2026-06-15');

  const [tenderSummary, setTenderSummary] = useState([]);

  const fetchTenderSummary = (targetDate) => {
    const url = targetDate ? `${API_BASE_URL}/api/reports/tender-summary?date=${targetDate}` : `${API_BASE_URL}/api/reports/tender-summary`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setTenderSummary(data.data);
      })
      .catch(err => console.error("Error fetching tender summary", err));
  };

  useEffect(() => {
    fetchTenderSummary(closeoutDate);
  }, [closeoutDate]);

  const totalDenoms = Object.entries(denoms).reduce((sum, [val, qty]) => sum + (parseFloat(val) * qty), 0);
  const totalCash = totalDenoms + Number(additionalCash);
  
  const totalForDay = tenderSummary.reduce((sum, ts) => sum + Number(ts.total), 0);
  const checkDepositValue = tenderSummary.filter(ts => ts.payment_type.toUpperCase() === 'CHECK').reduce((sum, ts) => sum + Number(ts.total), 0);
  const bankDepositTotal = totalCash + checkDepositValue;
  const overShort = bankDepositTotal - totalForDay;

  const selectedOption = 'END OF DAY CLOSEOUT';

  const salesOptions = ['END OF DAY CLOSEOUT'];

  const handleSave = () => {
    const payload = {
      d100: denoms['100'] || 0,
      d50: denoms['50'] || 0,
      d20: denoms['20'] || 0,
      d10: denoms['10'] || 0,
      d5: denoms['5'] || 0,
      d1: denoms['1'] || 0,
      c25: denoms['0.25'] || 0,
      c10: denoms['0.10'] || 0,
      c5: denoms['0.05'] || 0,
      c1: denoms['0.01'] || 0,
      additionalCash: Number(additionalCash) || 0,
      totalCash: totalCash,
      openingAmount: Number(openingAmount) || 0,
      cashDeposit: totalCash,
      checkDeposit: checkDepositValue,
      bankDepositTotal: bankDepositTotal,
      overShort: overShort
    };

    fetch(`${API_BASE_URL}/api/end-of-day-closeout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          alert('End of Day Closeout saved successfully!');
        } else {
          alert('Error saving data: ' + data.message);
        }
      })
      .catch(err => {
        console.error("Error saving closeout", err);
        alert('Failed to save data. Make sure the backend is running.');
      });
  };

  // Real-time clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const denominations = [
    { val: '100', type: 'bill' },
    { val: '50', type: 'bill' },
    { val: '20', type: 'bill' },
    { val: '10', type: 'bill' },
    { val: '5', type: 'bill' },
    { val: '1', type: 'bill' },
    { type: 'spacer' },
    { val: '0.25', type: 'coin' },
    { val: '0.10', type: 'coin' },
    { val: '0.05', type: 'coin' },
    { val: '0.01', type: 'coin' },
  ];

  return (
    <div className="sales-page-container">
      <div className="sales-header">
        <div className="sales-header-left">
          <div className="home-btn-container">
            <button className="home-btn" onClick={() => onNavigate('dashboard')} title="Back to Dashboard">
              <svg viewBox="0 0 48 48" width="32" height="32" filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.5))">
                <rect x="12" y="24" width="24" height="18" fill="#f0f0f0" />
                <rect x="20" y="28" width="8" height="14" fill="#a0d8f0" stroke="#88b8d0" strokeWidth="1" />
                <polygon points="6,24 24,8 42,24 38,24 24,12 10,24" fill="#f89020" />
                <polygon points="10,24 24,12 38,24 36,24 24,14 12,24" fill="#ffb050" />
                <polygon points="24,8 42,24 38,24 24,12" fill="#d07010" />
              </svg>
            </button>
          </div>

          <div className="custom-dropdown-container">
            <div className="custom-dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="custom-dropdown-button-text">{selectedOption}</div>
              <div className="custom-dropdown-arrow">▼</div>
            </div>
            {dropdownOpen && (
              <div className="custom-dropdown-menu">
                {salesOptions.map(option => (
                  <div key={option} className={`custom-dropdown-item ${option === selectedOption ? 'active' : ''}`} onClick={() => setDropdownOpen(false)}>
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sales-header-right">
          <span>{currentTime.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' })}</span>
          <span style={{ marginLeft: '10px' }}>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          <span style={{ margin: '0 20px', fontWeight: 'bold' }}>Demosparkle - Edison - POS</span>
          <button style={{
            background: 'linear-gradient(to bottom, #a8e063, #5fac11)',
            border: '1px solid #4a870c',
            borderRadius: '4px',
            color: 'white',
            fontWeight: 'bold',
            padding: '5px 20px',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
            textShadow: '1px 1px 1px rgba(0,0,0,0.3)'
          }}>Help</button>
        </div>
      </div>

      <div style={{ flex: 1, backgroundColor: 'white', padding: '20px 50px', position: 'relative' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Terminal #</span>
            <span style={{ fontWeight: 'bold', fontSize: '13px', width: '130px' }}>POS</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Date</span>
            <input type="date" value={closeoutDate} onChange={(e) => setCloseoutDate(e.target.value)} onClick={(e) => { try { e.target.showPicker(); } catch(err) {} }} style={{ width: '130px', border: '1px solid #ccc', padding: '2px 5px', fontSize: '13px', height: '22px', boxSizing: 'border-box', cursor: 'pointer' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <span style={{ fontSize: '13px' }}>Total for the day $</span>
            <input type="text" value={totalForDay.toFixed(2)} readOnly style={{ width: '130px', textAlign: 'right', padding: '2px 5px', border: '1px solid #ccc', backgroundColor: '#e5e5e5' }} />
          </div>

          <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {denominations.map((denom, idx) => denom.type === 'spacer' ? (
              <div key={idx} style={{ height: '10px' }}></div>
            ) : (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                <input type="number" min="0" value={denoms[denom.val] || ''} onChange={e => setDenoms({ ...denoms, [denom.val]: Number(e.target.value) })} style={{ width: '40px', border: '1px solid #ccc', padding: '2px', textAlign: 'right' }} />
                <span>*</span>
                <input type="text" value={denom.val} readOnly style={{ width: '50px', textAlign: 'right', backgroundColor: '#e5e5e5', border: '1px solid #ccc', padding: '2px' }} />
                <span>=</span>
                <input type="text" value={((denoms[denom.val] || 0) * parseFloat(denom.val)).toFixed(2)} readOnly style={{ width: '130px', textAlign: 'right', backgroundColor: '#e5e5e5', border: '1px solid #ccc', padding: '2px' }} />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '12px' }}>Additional Cash</span>
            <input type="number" min="0" value={additionalCash || ''} onChange={e => setAdditionalCash(Number(e.target.value))} style={{ width: '130px', padding: '2px 5px', border: '1px solid #ccc', textAlign: 'right' }} />
          </div>
        </div>

        {/* Middle Area */}
        <div style={{ position: 'absolute', top: '105px', left: '420px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Total Cash $</span>
            <input type="text" value={totalCash.toFixed(2)} readOnly style={{ width: '130px', textAlign: 'right', padding: '2px 5px', border: '1px solid #ccc', backgroundColor: '#e5e5e5' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Opening Amount $</span>
            <input type="number" min="0" value={openingAmount} onChange={e => setOpeningAmount(e.target.value)} style={{ width: '130px', textAlign: 'right', padding: '2px 5px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Cash Deposit $</span>
            <input type="text" value={totalCash.toFixed(2)} readOnly style={{ width: '130px', textAlign: 'right', padding: '2px 5px', border: '1px solid #ccc', backgroundColor: '#e5e5e5' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Check Deposit $</span>
            <input type="text" value={checkDepositValue.toFixed(2)} readOnly style={{ width: '130px', textAlign: 'right', padding: '2px 5px', border: '1px solid #ccc', backgroundColor: '#e5e5e5' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '13px' }}>BANK DEPOSIT TOTAL $</span>
            <input type="text" value={bankDepositTotal.toFixed(2)} readOnly style={{ width: '130px', textAlign: 'right', padding: '2px 5px', border: '1px solid #ccc', backgroundColor: '#e5e5e5' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Over/Short $</span>
            <input type="text" value={overShort.toFixed(2)} readOnly style={{ width: '130px', textAlign: 'right', padding: '2px 5px', border: '1px solid #ccc', backgroundColor: '#e5e5e5' }} />
          </div>
        </div>

        <div style={{ position: 'absolute', top: '105px', left: '750px', display: 'flex', flexDirection: 'column', gap: '5px', width: '250px' }}>
          {tenderSummary.map((ts, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '3px', marginBottom: '3px' }}>
              <span 
                onClick={() => { setSelectedPaymentType('ZON-' + ts.payment_type); setShowPaymentDetail(true); }}
                style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', color: '#0000ee', textTransform: 'uppercase', textDecoration: 'underline' }}>
                ZON-{ts.payment_type}
              </span>
              <span style={{ fontSize: '13px' }}>{Number(ts.total).toFixed(2)}</span>
            </div>
          ))}
          {tenderSummary.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '5px', borderTop: '1px solid #ccc' }}>
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Total</span>
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>
                {tenderSummary.reduce((sum, ts) => sum + Number(ts.total), 0).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Buttons */}
        <div style={{ display: 'flex', gap: '15px', position: 'absolute', bottom: '30px', left: '20px' }}>
          <button onClick={handleSave} style={{
            background: 'linear-gradient(to bottom, #72ba60, #4ca03c)', border: '1px solid #3c822e', borderRadius: '3px', color: 'white', fontWeight: 'bold', padding: '8px 25px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', textShadow: '1px 1px 1px rgba(0,0,0,0.4)', fontSize: '14px'
          }}>Save</button>

          <button style={{
            background: 'linear-gradient(to bottom, #ffffff, #e0e0e0)', border: '1px solid #999', borderRadius: '3px', color: '#333', fontWeight: 'bold', padding: '8px 25px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', fontSize: '14px'
          }} onClick={() => {
            setDenoms({
              '100': 0, '50': 0, '20': 0, '10': 0, '5': 0, '1': 0,
              '0.25': 0, '0.10': 0, '0.05': 0, '0.01': 0
            });
            setAdditionalCash(0);
            setOpeningAmount('');
            setCloseoutDate('2026-06-15');
            fetchTenderSummary('2026-06-15');
          }}>Refresh</button>

          {['Cash/Check Summary', 'Tender Summary', 'Salesperson Report', 'Salesperson Summary'].map(btn => (
            <button key={btn} onClick={() => {
              if (btn === 'Cash/Check Summary') setShowPrintModal(true);
              if (btn === 'Tender Summary') setShowEodModal(true);
              if (btn === 'Salesperson Report') setShowSalespersonReportModal(true);
              if (btn === 'Salesperson Summary') setShowSalespersonSummaryModal(true);
            }} style={{
              background: 'linear-gradient(to bottom, #72ba60, #4ca03c)', border: '1px solid #3c822e', borderRadius: '3px', color: 'white', fontWeight: 'bold', padding: '8px 15px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', textShadow: '1px 1px 1px rgba(0,0,0,0.4)', fontSize: '14px'
            }}>{btn}</button>
          ))}

          <button style={{
            background: 'linear-gradient(to bottom, #eb6a8f, #cf315e)', border: '1px solid #a32247', borderRadius: '3px', color: 'white', fontWeight: 'bold', padding: '8px 20px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', textShadow: '1px 1px 1px #a32247', fontSize: '14px'
          }}>Open Cash Drawer</button>
        </div>

      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 10px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#e0e0e0', borderTop: '1px solid #999', marginTop: 'auto' }}>
        <div>current version: 5.8.9 <span style={{ marginLeft: '40px' }}>version date: 05/18/2026</span></div>
        <div style={{ color: '#555' }}>Copyright 2014-15, Diaspark Inc. USA.</div>
        <div style={{ color: '#0055aa', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); alert('Starting Remote Assistance session...'); }}>Remote Assistance</div>
      </div>
      <PrintEndOfDayCloseoutModal isOpen={showPrintModal} onClose={() => setShowPrintModal(false)} defaultDate={closeoutDate} />
      <EodSummaryModal isOpen={showEodModal} onClose={() => setShowEodModal(false)} defaultDate={closeoutDate} />
      <SalespersonReportModal isOpen={showSalespersonReportModal} onClose={() => setShowSalespersonReportModal(false)} defaultDate={closeoutDate} />
      <SalespersonSummaryModal isOpen={showSalespersonSummaryModal} onClose={() => setShowSalespersonSummaryModal(false)} defaultDate={closeoutDate} />
      <PaymentDetailModal isOpen={showPaymentDetail} onClose={() => setShowPaymentDetail(false)} paymentType={selectedPaymentType} closeoutDate={closeoutDate} />
    </div>
  );
}

export default EndOfDayCloseoutPage;
