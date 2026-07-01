import React, { useState, useEffect } from 'react';
import './SalesPage.css';
import DatabaseViewer from './DatabaseViewer';
import SplitSalesSummaryModal from './SplitSalesSummaryModal';
import ClosedSalesModal from './ClosedSalesModal';
import SalesRankingModal from './SalesRankingModal';
import PaymentReportModal from './PaymentReportModal';
import TaxReportModal from './TaxReportModal';
import OpenOrderModal from './OpenOrderModal';
import CustomerRankingModal from './CustomerRankingModal';

function ReportsPage({ onNavigate }) {
  const [showRepairViewer, setShowRepairViewer] = useState(false);
  const [showSplitSalesModal, setShowSplitSalesModal] = useState(false);
  const [showClosedSalesModal, setShowClosedSalesModal] = useState(false);
  const [showSalesRankingModal, setShowSalesRankingModal] = useState(false);
  const [showPaymentReportModal, setShowPaymentReportModal] = useState(false);
  const [showTaxReportModal, setShowTaxReportModal] = useState(false);
  const [showOpenOrderModal, setShowOpenOrderModal] = useState(false);
  const [showCustomerRankingModal, setShowCustomerRankingModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedOption = 'Reports';

  const salesOptions = ['Reports'];

  // Real-time clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const btnStyle = {
    background: 'linear-gradient(to bottom, #86acf2, #5580e5)',
    border: '1px solid #436cc9',
    borderRadius: '3px',
    color: 'white',
    fontWeight: 'bold',
    padding: '8px 20px',
    width: '250px',
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    textShadow: '1px 1px 1px rgba(0,0,0,0.4)',
    textAlign: 'center'
  };

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

      <div style={{ flex: 1, backgroundColor: 'white', display: 'flex', padding: '50px' }}>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '5px' }}>Sales</h3>
            <button style={btnStyle} onClick={() => setShowSplitSalesModal(true)}>Split Sales Summary</button>
            <button style={btnStyle} onClick={() => setShowClosedSalesModal(true)}>Closed Sales</button>
            <button style={btnStyle} onClick={() => setShowSalesRankingModal(true)}>Salesperson Ranking</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '5px' }}>Payment</h3>
            <button style={btnStyle} onClick={() => setShowPaymentReportModal(true)}>Payment</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '5px' }}>Other</h3>
            <button style={btnStyle} onClick={() => setShowTaxReportModal(true)}>Tax Charged</button>
            <button style={btnStyle} onClick={() => setShowOpenOrderModal(true)}>Open Order</button>
            <button style={btnStyle} onClick={() => setShowCustomerRankingModal(true)}>Customer Ranking</button>
            <button style={{...btnStyle, background: 'linear-gradient(to bottom, #a8e063, #5fac11)', border: '1px solid #4a870c'}} onClick={() => setShowRepairViewer(true)}>Repair DB Data Viewer</button>
          </div>

        </div>
      </div>
      
      {showRepairViewer && (
        <div className="modal-overlay" onClick={() => setShowRepairViewer(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="modal-content" style={{width: '90vw', height: '90vh', maxWidth: '1200px', backgroundColor: 'white', padding: '20px', borderRadius: '5px', overflow: 'hidden', display: 'flex', flexDirection: 'column'}} onClick={e => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
              <h2>Repair DB Viewer</h2>
              <button onClick={() => setShowRepairViewer(false)} style={{padding: '5px 10px', cursor: 'pointer', background: '#ccc', border: 'none'}}>Close</button>
            </div>
            <div style={{flex: 1, overflow: 'auto', position: 'relative'}}>
              <DatabaseViewer />
            </div>
          </div>
        </div>
      )}

      {showSplitSalesModal && (
        <SplitSalesSummaryModal onClose={() => setShowSplitSalesModal(false)} />
      )}

      {showClosedSalesModal && (
        <ClosedSalesModal onClose={() => setShowClosedSalesModal(false)} />
      )}

      {showSalesRankingModal && (
        <SalesRankingModal onClose={() => setShowSalesRankingModal(false)} />
      )}

      {showPaymentReportModal && (
        <PaymentReportModal onClose={() => setShowPaymentReportModal(false)} />
      )}

      {showTaxReportModal && (
        <TaxReportModal onClose={() => setShowTaxReportModal(false)} />
      )}

      {showOpenOrderModal && (
        <OpenOrderModal onClose={() => setShowOpenOrderModal(false)} />
      )}

      {showCustomerRankingModal && (
        <CustomerRankingModal onClose={() => setShowCustomerRankingModal(false)} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 10px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#e0e0e0', borderTop: '1px solid #999', marginTop: 'auto' }}>
        <div>current version: 5.8.9 <span style={{ marginLeft: '40px' }}>version date: 05/18/2026</span></div>
        <div style={{ color: '#555' }}>Copyright 2014-15, Diaspark Inc. USA.</div>
        <div style={{ color: '#0055aa', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); alert('Starting Remote Assistance session...'); }}>Remote Assistance</div>
      </div>
    </div>
  );
}

export default ReportsPage;
