import React, { useState, useEffect } from 'react';
import './WishListPage.css';
import CustomerLookupModal from './CustomerLookupModal';
import SkuLookupModal from './SkuLookupModal';
import SalespersonModal from './SalespersonModal';

function BookIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12">
      <path d="M2 3 L8 2 L14 3 L14 13 L8 12 L2 13 Z" fill="white" stroke="#333" strokeWidth="1" />
      <line x1="8" y1="2" x2="8" y2="12" stroke="#333" strokeWidth="1" />
    </svg>
  );
}

const salesOptions = [
  'Sales', 'Return/Exchange', 'Special Order', 'Repair', 'Quick Repair',
  'Layaway', 'Appraisal', 'Gift Certficate', 'Gift Card', 'Cancel Order',
  'Payment(Open Orders)', 'Payment On Account', 'Finalize Sale', 'Trade In',
  'Void Transactions', 'Customer Info', 'SKU Info', 'Custom Order',
  'Wish List', 'Physical Inventory', 'END OF DAY CLOSEOUT'
];

function WishListPage({ onNavigate }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Wish List');
  const [showCustomerLookup, setShowCustomerLookup] = useState(false);
  const [showSkuLookup, setShowSkuLookup] = useState(false);
  const [showSalespersonModal, setShowSalespersonModal] = useState(false);

  // Real-time clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="wishlist-page-container">
      {/* Header Section */}
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
                  <div 
                    key={option}
                    className={`custom-dropdown-item ${option === selectedOption ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedOption(option);
                      setDropdownOpen(false);
                      if (option === 'Sales') onNavigate('sales');
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="sales-header-right">
          <span>{currentTime.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' })}</span>
          <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          <span>Demosparkle - Edison - POS</span>
          <button className="help-btn" onClick={() => alert('Opening Help Documentation...')}>Help</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="wishlist-content-area">
        <div className="wishlist-top-form">
          <div className="wishlist-form-left">
            <div className="wl-form-group">
              <label>Customer*</label>
              <div className="wl-input-with-icon" style={{ border: '1px solid #5ab0e2', boxShadow: '0 0 3px #5ab0e2' }}>
                <input type="text" />
                <div className="wl-icon-btn" onClick={() => setShowCustomerLookup(true)}>
                  <BookIcon />
                </div>
              </div>
            </div>
            
            <div className="wl-checkbox-group">
              <label className="wl-checkbox"><input type="checkbox" defaultChecked /> CRM</label>
              <label className="wl-checkbox"><input type="checkbox" /> Do Not Call For This Transaction</label>
              <label className="wl-checkbox"><input type="checkbox" /> Gift Sale</label>
            </div>
          </div>
          
          <div className="wishlist-form-right">
            <div className="wl-form-group">
              <label>Salesperson</label>
              <div className="wl-input-with-icon">
                <input type="text" style={{ width: '250px' }} />
                <div className="wl-icon-btn" onClick={() => setShowSalespersonModal(true)}>
                  <BookIcon />
                </div>
              </div>
            </div>
            <div className="wl-form-group">
              <label>Cashier</label>
              <select className="wl-select" style={{ width: '270px' }}>
                <option>Diaspark Admin(ADMIN)</option>
                <option>Vinod Jain(Vinod)</option>
              </select>
            </div>
            <div className="wl-form-group">
              <label>Department</label>
              <input type="text" value="POS" readOnly className="wl-select" style={{ width: '270px', backgroundColor: '#e5e5e5' }} />
            </div>
          </div>
        </div>

        {/* Input Bar Row */}
        <div className="wishlist-middle-bar">
          <div className="wl-form-group">
            <label style={{ minWidth: '70px', fontWeight: 'bold' }}>Style/ SKU #</label>
            <div className="wl-input-with-icon">
              <input type="text" style={{ width: '250px' }} />
              <div className="wl-icon-btn" onClick={() => setShowSkuLookup(true)}>
                <BookIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Data Grid Section */}
        <div className="wishlist-grid-section">
          <div className="wl-grid-header">
            <div style={{width: '12%'}}>Style/ SKU #</div>
            <div style={{width: '12%'}}>Serial #</div>
            <div style={{width: '30%'}}>Description</div>
            <div style={{width: '10%'}}>Salesperson #</div>
            <div style={{width: '7%'}}>On Hand</div>
            <div style={{width: '7%'}}>Other Store</div>
            <div style={{width: '5%'}}>Qty</div>
            <div style={{width: '5%'}}>Wt</div>
            <div style={{width: '6%'}}>Price</div>
            <div style={{width: '6%'}}>Ext. Price</div>
          </div>
          <div className="wl-grid-body">
            {/* Empty space matching screenshot */}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="wishlist-footer-section">
        <button className="wl-btn-save">Save</button>
        <button className="wl-btn-new">New</button>
      </div>

      {showCustomerLookup && <CustomerLookupModal onClose={() => setShowCustomerLookup(false)} />}
      {showSkuLookup && <SkuLookupModal onClose={() => setShowSkuLookup(false)} />}
      {showSalespersonModal && <SalespersonModal onClose={() => setShowSalespersonModal(false)} />}
    </div>
  );
}

export default WishListPage;
