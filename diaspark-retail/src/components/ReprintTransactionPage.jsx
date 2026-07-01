import React, { useState, useEffect } from 'react';
import './SalesPage.css';
import './DatePicker.css';
import CustomerLookupModal from './CustomerLookupModal';
import PrintModal from './PrintModal';

function ReprintTransactionPage({ onNavigate }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedOption = 'Reprint';
  const [showCustomerLookup, setShowCustomerLookup] = useState(false);
  const [customerNo, setCustomerNo] = useState('');
  
  const [transType, setTransType] = useState('All');
  const [transactionNo, setTransactionNo] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({ transType: 'All', customerNo: '', transactionNo: '' });
  const [showPrintModal, setShowPrintModal] = useState(false);
  
  const [fromDate, setFromDate] = useState(new Date('05/27/2026'));
  const [toDate, setToDate] = useState(new Date('05/27/2026'));
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [fromCurrentMonth, setFromCurrentMonth] = useState(new Date(2026, 4, 1)); // Month is 0-indexed, so 4 is May
  const [toCurrentMonth, setToCurrentMonth] = useState(new Date(2026, 4, 1));

  // Real-time clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const salesOptions = ['Reprint'];

  const BookIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5001/api/orders';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
        setAppliedFilters({ transType, customerNo, transactionNo });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReprint = () => {
    if (selectedTransaction) {
      setShowPrintModal(true);
    } else {
      alert('Please select a transaction to reprint.');
    }
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

      <div style={{ flex: 1, backgroundColor: '#f0f0f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '15px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '12px', width: '90px', textAlign: 'right' }}>Customer #</label>
            <div className="form-input-with-icon" style={{ borderRadius: '4px', overflow: 'hidden', width: '150px', backgroundColor: 'white', border: '1px solid #ccc' }}>
              <input type="text" value={customerNo} onChange={(e) => setCustomerNo(e.target.value)} style={{ width: '100%', padding: '2px 5px', border: 'none', outline: 'none' }} />
              <div className="form-input-icon" onClick={() => setShowCustomerLookup(true)} style={{ backgroundColor: '#86acf2', padding: '0 5px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}><BookIcon /></div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '12px', width: '90px', textAlign: 'right' }}>Trans Type</label>
              <select style={{ width: '120px', padding: '2px', border: '1px solid #ccc' }} value={transType} onChange={(e) => setTransType(e.target.value)}>
                <option>All</option>
                <option>Sales Receipt</option>
                <option>Exchange</option>
                <option>Gold Sales</option>
                <option>Special Order</option>
                <option>Custom Order</option>
                <option>Standard Order</option>
                <option>Repair Order</option>
                <option>Layaway</option>
                <option>Cancel Order</option>
                <option>Appraisal</option>
                <option>Payment</option>
                <option>Workbag</option>
                <option>Store Credit</option>
                <option>Refund Misc</option>
                <option>Trade In</option>
                <option>On Account</option>
                <option>Gift Card</option>
                <option>Void</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '12px' }}>Transaction #</label>
              <input type="text" style={{ width: '100px', padding: '2px', border: '1px solid #ccc' }} value={transactionNo} onChange={(e) => setTransactionNo(e.target.value)} />
            </div>

            <button onClick={handleSearch} disabled={loading} style={{
              background: 'linear-gradient(to bottom, #7aa4db, #487ccc)', border: '1px solid #3461a6', borderRadius: '3px', color: 'white', fontWeight: 'bold', padding: '5px 25px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', textShadow: '1px 1px 1px rgba(0,0,0,0.4)', fontSize: '14px', marginLeft: '50px'
            }}>{loading ? 'Searching...' : 'Search'}</button>

            <button onClick={handleReprint} style={{
              background: 'linear-gradient(to bottom, #7aa4db, #487ccc)', border: '1px solid #3461a6', borderRadius: '3px', color: 'white', fontWeight: 'bold', padding: '5px 25px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', textShadow: '1px 1px 1px rgba(0,0,0,0.4)', fontSize: '14px', marginLeft: '100px'
            }}>Reprint</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '12px', width: '90px', textAlign: 'right' }}>From Date</label>
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', width: '120px', backgroundColor: 'white' }}>
                  <input type="text" value={`${String(fromDate.getMonth() + 1).padStart(2, '0')}/${String(fromDate.getDate()).padStart(2, '0')}/${fromDate.getFullYear()}`} readOnly style={{ width: '100%', border: 'none', padding: '2px 5px', fontSize: '12px' }} />
                  <div onClick={() => setShowFromDatePicker(!showFromDatePicker)} style={{ padding: '0 3px', backgroundColor: '#eee', borderLeft: '1px solid #ccc', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon />
                  </div>
                </div>
                {showFromDatePicker && (
                  <div className="date-picker-popup" style={{ zIndex: 100 }}>
                    <div className="date-picker-header">
                      <button onClick={() => setFromCurrentMonth(new Date(fromCurrentMonth.getFullYear(), fromCurrentMonth.getMonth() - 1, 1))}>◀</button>
                      <div className="date-picker-month-year">
                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][fromCurrentMonth.getMonth()]} <span>{fromCurrentMonth.getFullYear()}</span>
                        <span style={{ fontSize: '10px' }}>↕</span>
                      </div>
                      <button onClick={() => setFromCurrentMonth(new Date(fromCurrentMonth.getFullYear(), fromCurrentMonth.getMonth() + 1, 1))}>▶</button>
                    </div>
                    <div className="date-picker-grid">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="date-picker-day-name">{d}</div>)}
                      {[...Array(new Date(fromCurrentMonth.getFullYear(), fromCurrentMonth.getMonth(), 1).getDay())].map((_, i) => <div key={`empty-${i}`}></div>)}
                      {[...Array(new Date(fromCurrentMonth.getFullYear(), fromCurrentMonth.getMonth() + 1, 0).getDate())].map((_, i) => {
                        const day = i + 1;
                        const isSelected = fromDate.getDate() === day && fromDate.getMonth() === fromCurrentMonth.getMonth() && fromDate.getFullYear() === fromCurrentMonth.getFullYear();
                        return (
                          <div 
                            key={day} 
                            className={`date-picker-day ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              setFromDate(new Date(fromCurrentMonth.getFullYear(), fromCurrentMonth.getMonth(), day));
                              setShowFromDatePicker(false);
                            }}
                          >
                            {day}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '12px' }}>To Date</label>
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', width: '120px', backgroundColor: 'white' }}>
                  <input type="text" value={`${String(toDate.getMonth() + 1).padStart(2, '0')}/${String(toDate.getDate()).padStart(2, '0')}/${toDate.getFullYear()}`} readOnly style={{ width: '100%', border: 'none', padding: '2px 5px', fontSize: '12px' }} />
                  <div onClick={() => setShowToDatePicker(!showToDatePicker)} style={{ padding: '0 3px', backgroundColor: '#eee', borderLeft: '1px solid #ccc', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon />
                  </div>
                </div>
                {showToDatePicker && (
                  <div className="date-picker-popup" style={{ zIndex: 100 }}>
                    <div className="date-picker-header">
                      <button onClick={() => setToCurrentMonth(new Date(toCurrentMonth.getFullYear(), toCurrentMonth.getMonth() - 1, 1))}>◀</button>
                      <div className="date-picker-month-year">
                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][toCurrentMonth.getMonth()]} <span>{toCurrentMonth.getFullYear()}</span>
                        <span style={{ fontSize: '10px' }}>↕</span>
                      </div>
                      <button onClick={() => setToCurrentMonth(new Date(toCurrentMonth.getFullYear(), toCurrentMonth.getMonth() + 1, 1))}>▶</button>
                    </div>
                    <div className="date-picker-grid">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="date-picker-day-name">{d}</div>)}
                      {[...Array(new Date(toCurrentMonth.getFullYear(), toCurrentMonth.getMonth(), 1).getDay())].map((_, i) => <div key={`empty-${i}`}></div>)}
                      {[...Array(new Date(toCurrentMonth.getFullYear(), toCurrentMonth.getMonth() + 1, 0).getDate())].map((_, i) => {
                        const day = i + 1;
                        const isSelected = toDate.getDate() === day && toDate.getMonth() === toCurrentMonth.getMonth() && toDate.getFullYear() === toCurrentMonth.getFullYear();
                        return (
                          <div 
                            key={day} 
                            className={`date-picker-day ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              setToDate(new Date(toCurrentMonth.getFullYear(), toCurrentMonth.getMonth(), day));
                              setShowToDatePicker(false);
                            }}
                          >
                            {day}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, borderTop: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.5fr 2fr 0.5fr 1fr 1fr 1fr 1fr', backgroundColor: 'white', borderBottom: '1px solid #ccc', padding: '5px 10px', fontWeight: 'bold', fontSize: '12px', color: '#333' }}>
            <div style={{ borderRight: '1px solid #ddd' }}>Trans #</div>
            <div style={{ borderRight: '1px solid #ddd', paddingLeft: '5px' }}>Trans Date</div>
            <div style={{ borderRight: '1px solid #ddd', paddingLeft: '5px' }}>Trans Type</div>
            <div style={{ borderRight: '1px solid #ddd', paddingLeft: '5px' }}>Customer #</div>
            <div style={{ borderRight: '1px solid #ddd', paddingLeft: '5px' }}>Customer Name</div>
            <div style={{ borderRight: '1px solid #ddd', paddingLeft: '5px', textAlign: 'right', paddingRight: '5px' }}>Qty</div>
            <div style={{ borderRight: '1px solid #ddd', paddingLeft: '5px' }}>Amount</div>
            <div style={{ borderRight: '1px solid #ddd', paddingLeft: '5px' }}>Status</div>
            <div style={{ borderRight: '1px solid #ddd', paddingLeft: '5px' }}>Salesperson #</div>
            <div style={{ paddingLeft: '5px' }}>Terminal #</div>
          </div>
          <div style={{ flex: 1, backgroundColor: 'white', overflowY: 'auto' }}>
            {(() => {
              const safeTransactions = Array.isArray(transactions) ? transactions : [];
              const filteredTransactions = safeTransactions.filter(tx => {
                if (!tx) return false;
                let match = true;
                
                const safeTransType = appliedFilters.transType || 'All';
                if (safeTransType !== 'All') {
                  const typeStr = safeTransType.toLowerCase();
                  const stageStr = tx.currentStage ? String(tx.currentStage).toLowerCase() : '';
                  
                  if (typeStr === 'repair order' && !stageStr.includes('repair')) {
                    match = false;
                  } else if (typeStr === 'sales receipt' && !(stageStr.includes('co') || stageStr.includes('pending') || stageStr.includes('sale'))) {
                    match = false;
                  } else if (typeStr !== 'repair order' && typeStr !== 'sales receipt') {
                    // For other types like 'Trade In', 'Special Order', just do a loose check if the stage string contains any part of it,
                    // or if stage string is empty, we might accidentally filter it. We'll be forgiving if stage is empty.
                    if (stageStr && !stageStr.includes(typeStr.split(' ')[0])) {
                      match = false;
                    }
                  }
                }
                
                if (appliedFilters.customerNo) {
                  const searchStr = String(appliedFilters.customerNo).toLowerCase();
                  const nameStr = `${tx.firstName || ''} ${tx.lastName || ''}`.toLowerCase();
                  const custIdStr = tx.customerId ? String(tx.customerId) : String(tx.id);
                  if (!nameStr.includes(searchStr) && !custIdStr.includes(searchStr)) {
                    match = false;
                  }
                }
                
                if (appliedFilters.transactionNo) {
                  const transSearchStr = String(appliedFilters.transactionNo).toLowerCase();
                  const specialStr = tx.special ? String(tx.special).toLowerCase() : '';
                  const idStr = String(tx.id);
                  if (!specialStr.includes(transSearchStr) && !idStr.includes(transSearchStr)) {
                    match = false;
                  }
                }
                
                return match;
              });
              
              return Array.from({ length: Math.max(20, filteredTransactions.length) }).map((_, i) => {
                const tx = filteredTransactions[i];
                return (
                  <div 
                    key={i} 
                    onClick={() => tx && setSelectedTransaction(tx)}
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr 1fr 1.5fr 2fr 0.5fr 1fr 1fr 1fr 1fr', 
                      borderBottom: '1px solid #eee', 
                      height: '24px', 
                      backgroundColor: selectedTransaction && tx && selectedTransaction.id === tx.id ? '#cce5ff' : (i % 2 === 0 ? 'white' : '#f9f9f9'),
                      cursor: tx ? 'pointer' : 'default',
                      fontSize: '12px',
                      alignItems: 'center'
                    }}>
                    <div style={{ borderRight: '1px solid #eee', paddingLeft: '5px' }}>{tx ? tx.special : ''}</div>
                    <div style={{ borderRight: '1px solid #eee', paddingLeft: '5px' }}>{tx ? tx.orderDate : ''}</div>
                    <div style={{ borderRight: '1px solid #eee', paddingLeft: '5px' }}>{tx ? tx.currentStage : ''}</div>
                    <div style={{ borderRight: '1px solid #eee', paddingLeft: '5px' }}>{tx ? tx.id : ''}</div>
                    <div style={{ borderRight: '1px solid #eee', paddingLeft: '5px' }}>{tx ? `${tx.firstName || ''} ${tx.lastName || ''}`.trim() : ''}</div>
                    <div style={{ borderRight: '1px solid #eee', paddingLeft: '5px', textAlign: 'right', paddingRight: '5px' }}>{tx ? '1' : ''}</div>
                    <div style={{ borderRight: '1px solid #eee', paddingLeft: '5px' }}>{tx ? '0.00' : ''}</div>
                    <div style={{ borderRight: '1px solid #eee', paddingLeft: '5px' }}>{tx ? tx.currentStage : ''}</div>
                    <div style={{ borderRight: '1px solid #eee', paddingLeft: '5px' }}>{tx ? tx.salesPerson : ''}</div>
                    <div style={{ paddingLeft: '5px' }}>{tx ? 'POS' : ''}</div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 10px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#e0e0e0', borderTop: '1px solid #999', marginTop: 'auto' }}>
        <div>current version: 5.8.9 <span style={{ marginLeft: '40px' }}>version date: 05/18/2026</span></div>
        <div style={{ color: '#555' }}>Copyright 2014-15, Diaspark Inc. USA.</div>
        <div style={{ color: '#0055aa', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); alert('Starting Remote Assistance session...'); }}>Remote Assistance</div>
      </div>
      {showCustomerLookup && (
        <CustomerLookupModal 
          onClose={() => setShowCustomerLookup(false)}
          onSelect={(cust) => {
            setCustomerNo(cust.id || cust.customerId);
            setShowCustomerLookup(false);
          }}
        />
      )}
      {showPrintModal && selectedTransaction && (
        <PrintModal
          onClose={() => setShowPrintModal(false)}
          onNew={() => setShowPrintModal(false)}
          transactionData={selectedTransaction}
        />
      )}
    </div>
  );
}

export default ReprintTransactionPage;
