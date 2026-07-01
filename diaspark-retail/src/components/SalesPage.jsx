import React, { useState, useEffect } from 'react'
import './SalesPage.css'
import './DatePicker.css'
import {
  SalesIcon, WishlistIcon, ReturnExchangeIcon, TradeInIcon, VoidTransactionsIcon
} from './icons'
import CustomerLookupModal from './CustomerLookupModal'
import SkuLookupModal from './SkuLookupModal'
import ItemLookupModal from './ItemLookupModal'
import SalespersonModal from './SalespersonModal'
import TransactionLookupModal from './TransactionLookupModal'
import AlertsModal from './AlertsModal'
import ActionModal from './ActionModal'
import PaymentModal from './PaymentModal'
import TradeInItemDetailModal from './TradeInItemDetailModal'
import ItemDetailModal from './ItemDetailModal'
import SpecialOrderDetailModal from './SpecialOrderDetailModal'
import PriceQtyDiscountModal from './PriceQtyDiscountModal'
import RepairDetailModal from './RepairDetailModal'
import CustomOrderDetailModal from './CustomOrderDetailModal'
import NotesAttachmentModal from './NotesAttachmentModal'
import UploadImagesModal from './UploadImagesModal'
import CarePlanModal from './CarePlanModal'
import PrintModal from './PrintModal'
import ShippingAddressModal from './ShippingAddressModal'
import CustomerComponentModal from './CustomerComponentModal'
import CustomerInfoView from './CustomerInfoView'

function BookIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12">
      <path d="M2 3 L8 2 L14 3 L14 13 L8 12 L2 13 Z" fill="white" stroke="#333" strokeWidth="1" />
      <line x1="8" y1="2" x2="8" y2="12" stroke="#333" strokeWidth="1" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12">
      <rect x="2" y="3" width="12" height="11" fill="white" stroke="#333" strokeWidth="1" />
      <line x1="2" y1="7" x2="14" y2="7" stroke="#333" strokeWidth="1" />
      <rect x="10" y="8" width="3" height="3" fill="#dd4444" />
      <line x1="4" y1="2" x2="4" y2="4" stroke="#333" strokeWidth="1" />
      <line x1="12" y1="2" x2="12" y2="4" stroke="#333" strokeWidth="1" />
    </svg>
  )
}

const salesOptions = [
  'Sales', 'Return/Exchange', 'Special Order', 'Repair', 'Quick Repair',
  'Layaway', 'Appraisal', 'Gift Certficate', 'Gift Card', 'Cancel Order',
  'Payment(Open Orders)', 'Payment On Account', 'Finalize Sale', 'Trade In',
  'Void Transactions', 'Customer Info', 'SKU Info', 'Custom Order',
  'Wish List', 'Physical Inventory', 'END OF DAY CLOSEOUT'
];

function SalesPage({ onNavigate, initialOption = 'Sales' }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(initialOption);

  React.useEffect(() => {
    setSelectedOption(initialOption);
    fetchNextTransId();
  }, [initialOption]);

  const fetchNextTransId = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/transactions/next');
      if (response.ok) {
        const data = await response.json();
        setNextTransId(prev => {
          const fetchedId = parseInt(data.nextId);
          const currentId = parseInt(prev);
          const nextId = (currentId && currentId >= fetchedId) ? (currentId + 1).toString() : data.nextId.toString();
          setCustomTransNo(nextId);
          return nextId;
        });
      }
    } catch (error) {
      console.error('Error fetching next trans id:', error);
    }
  };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showShipDatePicker, setShowShipDatePicker] = useState(false);
  const [showCustomerLookup, setShowCustomerLookup] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [isShipToChecked, setIsShipToChecked] = useState(false);
  const [showSkuLookup, setShowSkuLookup] = useState(false);
  const [showTransactionLookup, setShowTransactionLookup] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showItemLookup, setShowItemLookup] = useState(false);
  const [showSalespersonModal, setShowSalespersonModal] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTradeInModal, setShowTradeInModal] = useState(false);
  const [tradeInCategory, setTradeInCategory] = useState('Gold Purchase');
  const [showItemDetailModal, setShowItemDetailModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCarePlanModal, setShowCarePlanModal] = useState(false);
  const [carePlanForIndex, setCarePlanForIndex] = useState(null);
  const [customTransNo, setCustomTransNo] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showCustomerComponentModal, setShowCustomerComponentModal] = useState(false);
  const [lastSavedInvoiceId, setLastSavedInvoiceId] = useState(null);
  const [lastSavedTransNo, setLastSavedTransNo] = useState(null);
  const [nextTransId, setNextTransId] = useState('');

  const [customer, setCustomer] = useState(null);
  const [customerLabelText, setCustomerLabelText] = useState('Customer');
  const [customerTotalSales, setCustomerTotalSales] = useState(0);
  
  const [itemLabelText, setItemLabelText] = useState(localStorage.getItem('customItemLabel') || 'Item #');
  const [isEditingItemLabel, setIsEditingItemLabel] = useState(false);
  
  const [skuLabelText, setSkuLabelText] = useState(localStorage.getItem('customSkuLabel') || 'Style/ SKU #');
  const [isEditingSkuLabel, setIsEditingSkuLabel] = useState(false);

  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(null);

  const handleSaveInlineCustomer = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/customers/${editedCustomer.customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedCustomer),
      });

      if (response.ok) {
        setCustomer(editedCustomer);
        setIsEditingCustomer(false);
      } else {
        const errorText = await response.text();
        alert(`Failed to update customer. Status: ${response.status}, Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      alert(`Error updating customer: ${error.message}`);
    }
  };

  useEffect(() => {
    if (customer && customer.id) {
      fetch(`http://localhost:5001/api/customer-sales/${customer.id}`)
        .then(res => res.json())
        .then(data => setCustomerTotalSales(data.totalSalesAmount || 0))
        .catch(err => console.error("Error fetching customer sales:", err));
    } else {
      setCustomerTotalSales(0);
    }
  }, [customer]);
  const [salesperson, setSalesperson] = useState('');
  const [salespersonsList, setSalespersonsList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/salespersons')
      .then(res => res.json())
      .then(data => setSalespersonsList(data))
      .catch(err => console.error("Error fetching salespersons:", err));
  }, []);
  const [gridData, setGridData] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);
  const [skuSearchText, setSkuSearchText] = useState('');
  const [barcodeSearchText, setBarcodeSearchText] = useState('');
  const [catalogItems, setCatalogItems] = useState([]);
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);

  // Fetch catalog items when SKU search text changes
  useEffect(() => {
    if (skuSearchText.length >= 1) {
      fetch(`http://localhost:5001/api/catalog-items?search=${encodeURIComponent(skuSearchText)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCatalogItems(data);
            setShowCatalogDropdown(true);
          }
        })
        .catch(err => console.error('Error fetching catalog items:', err));
    } else {
      setCatalogItems([]);
      setShowCatalogDropdown(false);
    }
  }, [skuSearchText]);

  const handleSelectCatalogItem = (item) => {
    setGridData([...gridData, {
      sku: item.code,
      serial: item.code,
      description: item.description,
      qty: 1,
      price: item.price,
      wt: 0,
      category: 'SALE'
    }]);
    setSkuSearchText('');
    setShowCatalogDropdown(false);
  };

  const handleBarcodeEnter = (e) => {
    if (e.key === 'Enter' && barcodeSearchText.trim() !== '') {
      fetch(`http://localhost:5001/api/catalog-items?search=${encodeURIComponent(barcodeSearchText)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            handleSelectCatalogItem(data[0]);
            setBarcodeSearchText('');
          } else {
            alert('Item not found for barcode: ' + barcodeSearchText);
          }
        })
        .catch(err => console.error('Error fetching barcode item:', err));
    }
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const [shipSelectedDate, setShipSelectedDate] = useState(new Date());
  const [shipCurrentMonth, setShipCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const [shippingAddress, setShippingAddress] = useState(null);

  // Real-time clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const itemAmount = gridData.reduce((sum, item) => sum + (parseFloat(item.qty || 1) * parseFloat(item.price || 0)), 0);
  const taxRate = 6.6250;
  const taxAmount = itemAmount * (taxRate / 100);
  const shipAmount = 0.00;

  const totalAmount = (itemAmount + taxAmount + shipAmount).toFixed(2);
  const itemAmountStr = itemAmount.toFixed(2);
  const taxAmountStr = taxAmount.toFixed(2);

  const receivedAmount = paymentsData.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const receivedAmountStr = receivedAmount.toFixed(2);
  const amountDueVal = parseFloat(totalAmount) - receivedAmount;
  const amountDueStr = Math.max(0, amountDueVal).toFixed(2);

  return (
    <div className="sales-page-container">
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

      {/* Form Section */}
      <div className="sales-form-section">
        <div className="form-row" style={{ marginLeft: '45px', alignItems: 'flex-start' }}>
          {selectedOption === 'Appraisal' && (
            <div style={{ display: 'flex', width: '100%', gap: '30px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="form-group" style={{ marginBottom: '25px' }}>
                  <label style={{ minWidth: '80px', textAlign: 'right' }}>Customer*</label>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="form-input-with-icon" style={{ border: '1px solid #5ab0e2', boxShadow: '0 0 3px #5ab0e2', width: '150px' }}>
                      <input type="text" value={customer ? `${customer.firstName} ${customer.lastName}` : ''} readOnly />
                      <div className="form-input-icon" onClick={() => setShowCustomerLookup(true)}><BookIcon /></div>
                    </div>
                    {customer && (
                      <span style={{ fontSize: '11px', color: '#0056b3', fontWeight: 'bold', marginTop: '2px' }}>
                        Total Sales: ${customerTotalSales.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ fontSize: '10px', marginLeft: '90px', marginBottom: '20px' }}>,,</span>
                <div style={{ display: 'flex', gap: '10px', marginLeft: '90px' }}>
                  <label><input type="checkbox" /> Do Not Track</label>
                  <label><input type="checkbox" /> Do Not Call</label>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div className="form-group" style={{ padding: 0 }}>
                  <label style={{ minWidth: '150px', textAlign: 'right', fontWeight: 'bold' }}>Document {customerLabelText} #</label>
                  <input type="text" placeholder={`Document ${customerLabelText} Code`} style={{ width: '250px' }} />
                </div>
                <div style={{ display: 'flex', gap: '5px', paddingLeft: '155px' }}>
                  <input type="text" placeholder="First Name" style={{ width: '122px' }} />
                  <input type="text" placeholder="Last Name" style={{ width: '123px' }} />
                </div>
                <div style={{ paddingLeft: '155px' }}>
                  <input type="text" placeholder="Address1" style={{ width: '250px' }} />
                </div>
                <div style={{ paddingLeft: '155px' }}>
                  <input type="text" placeholder="Address2" style={{ width: '250px' }} />
                </div>
                <div style={{ display: 'flex', gap: '5px', paddingLeft: '155px' }}>
                  <input type="text" placeholder="City" style={{ width: '120px' }} />
                  <input type="text" placeholder="State" style={{ width: '60px' }} />
                  <input type="text" placeholder="Zip" style={{ width: '60px' }} />
                </div>
                <div style={{ paddingLeft: '155px' }}>
                  <input type="text" placeholder="Phone" style={{ width: '250px' }} />
                </div>
                <div style={{ paddingLeft: '155px' }}>
                  <input type="text" placeholder="Email" style={{ width: '250px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '30px', marginTop: '10px' }}>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ minWidth: '80px', textAlign: 'right' }}>Salesperson</label>
                    <input type="text" className="sales-select" style={{ width: '220px' }} value={salesperson} onChange={(e) => setSalesperson(e.target.value)} />
                  </div>
                </div>
                <div className="form-group" style={{ padding: 0 }}>
                  <label style={{ minWidth: '80px', textAlign: 'right' }}>Cashier</label>
                  <select className="sales-select" style={{ width: '220px' }}>
                    <option>Diaspark Admin(ADMIN)</option>
                    <option>Vinod Jain(Vinod)</option>
                    <option>Dave Rodies(dave)</option>
                    <option>Ghad Slim(ghad)</option>
                    <option>Marry Disuja(Marry)</option>
                  </select>
                </div>
                <div className="form-group" style={{ padding: 0 }}>
                  <label style={{ minWidth: '80px', textAlign: 'right' }}>Department</label>
                  <input type="text" value="POS" readOnly className="sales-select" style={{ width: '220px', backgroundColor: '#f0f0f0' }} />
                </div>
              </div>
            </div>
          )}
          {(selectedOption === 'Payment (Open Order)' || selectedOption === 'Payment On Account') ? (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', paddingBottom: '10px' }}>
                <div className="form-group" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 0, padding: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <label style={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold' }}>Payment By</label>
                    <div className="form-input-with-icon" style={{ border: '1px solid #5ab0e2', boxShadow: '0 0 3px #5ab0e2', width: '150px' }}>
                      <input type="text" />
                      <div className="form-input-icon" onClick={() => setShowCustomerLookup(true)} style={{ cursor: 'pointer' }}><BookIcon /></div>
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', position: 'relative', left: '90px', top: '2px' }}>,,</span>
                </div>

                {selectedOption === 'Payment (Open Order)' ? (
                  <>
                    <div className="form-group" style={{ marginLeft: '10px', padding: 0 }}>
                      <input type="checkbox" style={{ margin: '0 5px 0 0' }} disabled />
                      <label style={{ minWidth: 'auto', marginRight: '5px', color: '#999', fontWeight: 'bold' }}>Ship To</label>
                      <div className="form-input-with-icon" style={{ borderColor: '#ccc', width: '150px' }}>
                        <input type="text" style={{ backgroundColor: '#f0f0f0', width: '100%' }} readOnly disabled />
                        <div className="form-input-icon gray"><BookIcon /></div>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginLeft: '30px', padding: 0 }}>
                      <label style={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold' }}>{customerLabelText}*</label>
                      <div className="form-input-with-icon" style={{ borderColor: '#ccc', width: '150px', flexDirection: 'column', alignItems: 'flex-start', border: 'none' }}>
                        <div style={{ display: 'flex', border: '1px solid #ccc', width: '100%', height: '22px' }}>
                          <input type="text" style={{ width: '100%' }} value={customer ? `${customer.firstName} ${customer.lastName}` : ''} readOnly />
                          <div className="form-input-icon gray" onClick={() => setShowCustomerLookup(true)} style={{ cursor: 'pointer' }}><BookIcon /></div>
                        </div>
                        {customer && (
                          <span style={{ fontSize: '11px', color: '#0056b3', fontWeight: 'bold', marginTop: '2px' }}>
                            Total Sales: ${customerTotalSales.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '30px' }}>
                      <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold' }}>Salesperson</label>
                        <input type="text" className="sales-select" style={{ borderColor: '#ccc', width: '220px' }} value={salesperson} onChange={(e) => setSalesperson(e.target.value)} />
                      </div>
                      <div className="form-group" style={{ padding: 0 }}>
                        <label style={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold' }}>Cashier</label>
                        <select className="sales-select" style={{ width: '220px' }}>
                          <option>Diaspark Admin(ADMIN)</option>
                          <option>Vinod Jain(Vinod)</option>
                          <option>Dave Rodies(dave)</option>
                          <option>Ghad Slim(ghad)</option>
                          <option>Marry Disuja(Marry)</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '60px' }}>
                      <div className="form-group" style={{ padding: 0, justifyContent: 'flex-end' }}>
                        <label style={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold' }}>Received Amt</label>
                        <input type="text" defaultValue="0.00" style={{ width: '80px', textAlign: 'right', border: '1px solid #999', padding: '1px 3px', height: '18px' }} />
                      </div>
                      <div className="form-group" style={{ padding: 0, justifyContent: 'flex-end' }}>
                        <label style={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold' }}>Applied Amt</label>
                        <input type="text" defaultValue="0.00" readOnly style={{ width: '80px', textAlign: 'right', border: '1px solid #999', padding: '1px 3px', height: '18px', backgroundColor: '#d9d9d9' }} />
                      </div>
                      <div className="form-group" style={{ padding: 0, justifyContent: 'flex-end' }}>
                        <label style={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold' }}>Balance Amt</label>
                        <input type="text" defaultValue="" readOnly style={{ width: '80px', textAlign: 'right', border: '1px solid #999', padding: '1px 3px', height: '18px', backgroundColor: '#d9d9d9' }} />
                      </div>
                    </div>

                    <div className="form-group" style={{ padding: 0, alignSelf: 'flex-start', marginRight: '10px' }}>
                      <label style={{ minWidth: '60px', textAlign: 'right', fontWeight: 'bold' }}>Cashier</label>
                      <select className="sales-select" style={{ width: '160px', border: '1px solid #5ab0e2', boxShadow: '0 0 3px #5ab0e2' }}>
                        <option>Diaspark Admin(ADMIN)</option>
                        <option>Vinod Jain(Vinod)</option>
                        <option>Dave Rodies(dave)</option>
                        <option>Ghad Slim(ghad)</option>
                        <option>Marry Disuja(Marry)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {selectedOption === 'Payment (Open Order)' && (
                <div style={{ display: 'flex', gap: '10px', marginLeft: '500px', fontSize: '11px' }}>
                  <label><input type="checkbox" defaultChecked /> CRM</label>
                  <label><input type="checkbox" /> Do Not Call For This Transaction</label>
                  <label><input type="checkbox" /> Gift Sale</label>
                </div>
              )}
            </div>
          ) : null}
          {selectedOption === 'Gift Certificate' && (
            <div style={{ display: 'flex', width: '100%', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div className="form-group" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 0, padding: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <label style={{ minWidth: '80px', textAlign: 'right' }}>{customerLabelText}*</label>
                      <div className="form-input-with-icon" style={{ border: '1px solid #5ab0e2', boxShadow: '0 0 3px #5ab0e2', width: '150px' }}>
                        <input type="text" />
                        <div className="form-input-icon" onClick={() => setShowCustomerLookup(true)}><BookIcon /></div>
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', position: 'relative', left: '90px', top: '2px' }}>,,</span>
                  </div>

                  <div className="form-group" style={{ marginLeft: '10px', padding: 0 }}>
                    <input type="checkbox" style={{ margin: '0 5px 0 0' }} disabled />
                    <label style={{ minWidth: 'auto', marginRight: '5px', color: '#999' }}>Ship To</label>
                    <div className="form-input-with-icon" style={{ borderColor: '#ccc', width: '150px' }}>
                      <input type="text" style={{ backgroundColor: '#f0f0f0', width: '100%' }} readOnly disabled />
                      <div className="form-input-icon gray"><BookIcon /></div>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginLeft: '10px', padding: 0, position: 'relative' }}>
                    <label style={{ minWidth: '80px', textAlign: 'right' }}>Buying For*</label>
                    <div className="form-input-with-icon" style={{ border: '1px solid #5ab0e2', boxShadow: '0 0 3px #5ab0e2', width: '150px' }}>
                      <input type="text" style={{ width: '100%' }} />
                      <div className="form-input-icon" onClick={() => setShowCustomerLookup(true)}><BookIcon /></div>
                    </div>
                    <span style={{ fontSize: '10px', position: 'absolute', top: '25px', left: '90px' }}>,,</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginLeft: '90px', marginTop: '10px' }}>
                  <label><input type="checkbox" /> Do Not Track</label>
                  <label><input type="checkbox" /> Do Not Call</label>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '15px' }}>
                  <div style={{ display: 'flex', backgroundColor: '#e0e0e0', padding: '5px', fontWeight: 'bold', fontSize: '11px', border: '1px solid #ccc' }}>
                    <div style={{ width: '150px' }}>Certificate #</div>
                    <div style={{ width: '80px', textAlign: 'right' }}>Item Value</div>
                    <div style={{ width: '80px', textAlign: 'right' }}>Tax Value</div>
                    <div style={{ flex: 1, textAlign: 'right' }}>Gift Certificate Value</div>
                  </div>
                  <div style={{ display: 'flex', padding: '5px', border: '1px solid #ccc', borderTop: 'none', backgroundColor: '#e5e5e5' }}>
                    <div style={{ width: '150px' }}>1000900000</div>
                    <div style={{ width: '80px', textAlign: 'right' }}><input type="text" style={{ width: '70px', textAlign: 'right' }} defaultValue="0.00" /></div>
                    <div style={{ width: '80px', textAlign: 'right' }}><input type="text" style={{ width: '70px', textAlign: 'right' }} defaultValue="0.00" /></div>
                    <div style={{ flex: 1, textAlign: 'right' }}><input type="text" style={{ width: '100px', textAlign: 'right', backgroundColor: '#d0d0d0' }} readOnly defaultValue="0.00" /></div>
                  </div>
                </div>

                <div className="input-bar-row" style={{ marginTop: '15px', padding: '0', justifyContent: 'flex-start', border: 'none', background: 'transparent' }}>
                  <button className="action-btn" style={{ background: 'linear-gradient(to bottom, #7aa4db, #487ccc)', color: 'white', padding: '0 10px', minWidth: '40px', fontWeight: 'bold', border: '1px solid #3461a6', height: '22px' }}>...</button>
                  <div className="form-group" style={{ marginLeft: '10px' }}>
                    {isEditingSkuLabel ? (
                      <input 
                        type="text" 
                        autoFocus
                        style={{ minWidth: '70px', width: '80px', fontWeight: 'bold', marginRight: '5px' }}
                        value={skuLabelText}
                        onChange={(e) => setSkuLabelText(e.target.value)}
                        onBlur={() => {
                          setIsEditingSkuLabel(false);
                          localStorage.setItem('customSkuLabel', skuLabelText || 'Style/ SKU #');
                          if (!skuLabelText) setSkuLabelText('Style/ SKU #');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setIsEditingSkuLabel(false);
                            localStorage.setItem('customSkuLabel', skuLabelText || 'Style/ SKU #');
                            if (!skuLabelText) setSkuLabelText('Style/ SKU #');
                          }
                        }}
                      />
                    ) : (
                      <label 
                        style={{ minWidth: '70px', fontWeight: 'bold', cursor: 'pointer', borderBottom: '1px dashed #999' }}
                        onClick={() => setIsEditingSkuLabel(true)}
                        title="Click to rename"
                      >
                        {skuLabelText}
                      </label>
                    )}
                    <div className="form-input-with-icon" style={{ borderColor: '#ccc' }}>
                      <input type="text" style={{ width: '150px' }} />
                      <div className="form-input-icon" onClick={() => setShowSkuLookup(true)} style={{ cursor: 'pointer' }}><BookIcon /></div>
                    </div>
                  </div>
                  <div className="form-group" style={{ marginLeft: '10px' }}>
                    <label style={{ minWidth: '50px', fontWeight: 'bold' }}>Serial #</label>
                    <div className="form-input-with-icon" style={{ borderColor: '#ccc' }}>
                      <input type="text" style={{ width: '150px' }} />
                      <div className="form-input-icon" onClick={() => setShowItemLookup(true)} style={{ cursor: 'pointer' }}><BookIcon /></div>
                    </div>
                  </div>
                  <div style={{ marginLeft: '10px', color: 'red', fontWeight: 'bold', fontSize: '20px', cursor: 'pointer' }}>-</div>
                </div>

                <div className="data-grid-section" style={{ marginTop: '5px', minHeight: '150px' }}>
                  <div className="grid-header" style={{ gridTemplateColumns: '1fr 1fr 2fr 1fr 0.5fr 1fr 0.5fr', padding: '5px' }}>
                    <div>Style/ SKU #</div>
                    <div>Serial #</div>
                    <div>Description</div>
                    <div style={{ textAlign: 'center', color: 'blue' }}>Item Price</div>
                    <div style={{ textAlign: 'center', color: 'blue' }}>Qty</div>
                    <div style={{ textAlign: 'center', color: 'blue' }}>Item Amt</div>
                    <div style={{ textAlign: 'right' }}>Tax</div>
                  </div>
                  <div className="grid-body" style={{ display: 'flex', flexDirection: 'column' }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '300px' }}>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ minWidth: '80px', textAlign: 'right' }}>Salesperson</label>
                  <div className="form-input-with-icon" style={{ border: '1px solid #ccc', width: '200px', height: '22px' }}>
                    <input type="text" style={{ width: '100%', padding: '0 4px' }} value={salesperson} onChange={(e) => setSalesperson(e.target.value)} />
                    <div className="form-input-icon" onClick={() => setShowSalespersonModal(true)}>
                      <BookIcon />
                    </div>
                  </div>
                </div>
                <div className="form-group" style={{ padding: 0, justifyContent: 'flex-end' }}>
                  <label style={{ minWidth: '80px', textAlign: 'right' }}>Cashier</label>
                  <select className="sales-select" style={{ width: '200px' }}>
                    <option>Diaspark Admin(ADMIN)</option>
                    <option>Vinod Jain(Vinod)</option>
                    <option>Dave Rodies(dave)</option>
                    <option>Ghad Slim(ghad)</option>
                    <option>Marry Disuja(Marry)</option>
                  </select>
                </div>
                <div className="form-group" style={{ padding: 0, justifyContent: 'flex-end' }}>
                  <label style={{ minWidth: '80px', textAlign: 'right' }}>Department</label>
                  <input type="text" value="POS" readOnly className="sales-select" style={{ width: '200px', backgroundColor: '#f0f0f0' }} />
                </div>
                <div className="form-group" style={{ padding: 0, justifyContent: 'flex-end' }}>
                  <label style={{ minWidth: '80px', textAlign: 'right', color: '#999' }}>Tax Code</label>
                  <div className="form-input-with-icon" style={{ borderColor: '#ccc', width: '200px' }}>
                    <input type="text" style={{ backgroundColor: '#f0f0f0', width: '100%' }} value="NJ-08817" readOnly disabled />
                    <div className="form-input-icon gray"><BookIcon /></div>
                  </div>
                </div>

                <div className="form-group" style={{ padding: 0, justifyContent: 'flex-end', marginTop: '10px' }}>
                  <label style={{ minWidth: '130px', textAlign: 'right', fontWeight: 'bold' }}>Bridge Reference #</label>
                  <input type="text" style={{ width: '150px', border: '1px solid #ccc' }} />
                </div>
                <div className="form-group" style={{ padding: 0, justifyContent: 'flex-end' }}>
                  <label style={{ minWidth: '130px', textAlign: 'right', fontWeight: 'bold' }}>Bridge Reference Date</label>
                  <div className="form-input-with-icon" style={{ width: '150px' }}>
                    <input type="text" style={{ width: '100%', border: '1px solid #ccc' }} defaultValue="05/27/2027" />
                    <div className="form-input-icon gray" style={{ padding: '0 2px' }}>
                      <CalendarIcon />
                    </div>
                  </div>
                </div>
                <div className="form-group" style={{ padding: 0, justifyContent: 'flex-end' }}>
                  <label style={{ minWidth: '130px', textAlign: 'right', fontWeight: 'bold' }}>Bridge Authorization #</label>
                  <input type="text" style={{ width: '150px', border: '1px solid #ccc' }} />
                </div>
                <div className="form-group" style={{ padding: 0, justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                  <label style={{ minWidth: '130px', textAlign: 'right', fontWeight: 'bold' }}>Remark</label>
                  <textarea style={{ width: '150px', height: '60px', border: '1px solid #ccc', resize: 'none' }} />
                </div>
              </div>
            </div>
          )}
          {selectedOption === 'Gift Card' && (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <div style={{ display: 'flex', width: '100%' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flex: 1 }}>
                  <div className="form-group" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 0, padding: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <label style={{ minWidth: '80px', textAlign: 'right' }}>{customerLabelText}*</label>
                      <div className="form-input-with-icon" style={{ border: '1px solid #5ab0e2', boxShadow: '0 0 3px #5ab0e2', width: '150px', flexDirection: 'column', alignItems: 'flex-start', border: 'none' }}>
                        <div style={{ display: 'flex', border: '1px solid #5ab0e2', width: '100%', height: '22px' }}>
                          <input type="text" value={customer ? `${customer.firstName} ${customer.lastName}` : ''} readOnly />
                          <div className="form-input-icon" onClick={() => setShowCustomerLookup(true)}><BookIcon /></div>
                        </div>
                        {customer && (
                          <span style={{ fontSize: '11px', color: '#0056b3', fontWeight: 'bold', marginTop: '2px' }}>
                            Total Sales: ${customerTotalSales.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', position: 'relative', left: '90px', top: '2px' }}>,,</span>
                  </div>

                  <div className="form-group" style={{ marginLeft: '10px', padding: 0 }}>
                    <input type="checkbox" style={{ margin: '0 5px 0 0' }} disabled />
                    <label style={{ minWidth: 'auto', marginRight: '5px' }}>Ship To</label>
                    <div className="form-input-with-icon" style={{ borderColor: '#ccc', width: '150px' }}>
                      <input type="text" style={{ backgroundColor: '#f0f0f0', width: '100%' }} readOnly disabled />
                      <div className="form-input-icon gray"><BookIcon /></div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '300px' }}>
                  <div className="form-group" style={{ padding: 0, justifyContent: 'flex-end' }}>
                    <label style={{ minWidth: '80px', textAlign: 'right' }}>Salesperson</label>
                    <div className="form-input-with-icon" style={{ border: '1px solid #ccc', width: '200px', height: '22px' }}>
                      <input type="text" style={{ width: '100%', padding: '0 4px' }} value={salesperson} onChange={(e) => setSalesperson(e.target.value)} />
                      <div className="form-input-icon" onClick={() => setShowSalespersonModal(true)}>
                        <BookIcon />
                      </div>
                    </div>
                  </div>
                  <div className="form-group" style={{ padding: 0, justifyContent: 'flex-end' }}>
                    <label style={{ minWidth: '80px', textAlign: 'right' }}>Cashier</label>
                    <select className="sales-select" style={{ width: '200px' }}>
                      <option>Diaspark Admin(ADMIN)</option>
                      <option>Vinod Jain(Vinod)</option>
                      <option>Dave Rodies(dave)</option>
                      <option>Ghad Slim(ghad)</option>
                      <option>Marry Disuja(Marry)</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ padding: 0, justifyContent: 'flex-end' }}>
                    <label style={{ minWidth: '80px', textAlign: 'right' }}>Department</label>
                    <input type="text" value="POS" readOnly className="sales-select" style={{ width: '200px', backgroundColor: '#f0f0f0' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginLeft: '90px', marginTop: '30px', marginBottom: '10px' }}>
                <label><input type="checkbox" /> Do Not Track</label>
                <label><input type="checkbox" /> Do Not Call</label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #ccc', marginTop: '10px' }}>
                <div style={{ display: 'flex', backgroundColor: '#e0e0e0', padding: '5px', fontWeight: 'bold', fontSize: '11px', borderBottom: '1px solid #ccc' }}>
                  <div style={{ width: '200px' }}>Gift Card #</div>
                  <div style={{ width: '100px', textAlign: 'right' }}>Value</div>
                  <div style={{ flex: 1, paddingLeft: '10px' }}>Charge Value</div>
                </div>
                <div style={{ display: 'flex', backgroundColor: '#f9f9f9', height: '100px' }}>
                  <div style={{ width: '200px', padding: '5px' }}>
                    <input type="text" style={{ width: '100%', backgroundColor: '#e0e0e0', border: '1px solid #ccc', padding: '2px' }} />
                  </div>
                  <div style={{ width: '100px', padding: '5px' }}>
                    <input type="text" style={{ width: '100%', textAlign: 'right', border: '1px solid #ccc', padding: '2px' }} defaultValue="0.00" />
                  </div>
                  <div style={{ width: '100px', padding: '5px' }}>
                    <input type="text" style={{ width: '100%', textAlign: 'right', border: '1px solid #ccc', padding: '2px' }} defaultValue="0.00" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', padding: '5px 20px', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <label><input type="checkbox" /> Manual</label>
                      <label><input type="checkbox" defaultChecked /> Swipe</label>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <label style={{ fontWeight: 'bold', minWidth: '40px' }}>*Lane</label>
                      <select style={{ width: '80px', border: '1px solid #ccc' }}><option>1</option></select>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <label style={{ fontWeight: 'bold', minWidth: '40px' }}>#Host</label>
                      <select style={{ width: '80px', border: '1px solid #ccc' }}><option>285</option></select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '5px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button style={{ background: 'linear-gradient(to bottom, #72ba60, #4ca03c)', color: 'white', fontWeight: 'bold', border: '1px solid #3c822e', borderRadius: '3px', padding: '2px 10px' }}>*Activate</button>
                      <button style={{ background: 'linear-gradient(to bottom, #e0e0e0, #c0c0c0)', color: '#666', fontWeight: 'bold', border: '1px solid #aaa', borderRadius: '3px', padding: '2px 10px' }}>*Reload</button>
                      <button style={{ background: 'linear-gradient(to bottom, #72ba60, #4ca03c)', color: 'white', fontWeight: 'bold', border: '1px solid #3c822e', borderRadius: '3px', padding: '2px 10px' }}>*Balance</button>
                      <button style={{ background: 'linear-gradient(to bottom, #e0e0e0, #c0c0c0)', color: '#666', fontWeight: 'bold', border: '1px solid #aaa', borderRadius: '3px', padding: '2px 10px' }}>*Reverse</button>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button style={{ background: 'linear-gradient(to bottom, #72ba60, #4ca03c)', color: 'white', fontWeight: 'bold', border: '1px solid #3c822e', borderRadius: '3px', padding: '2px 10px', minWidth: '70px' }}>#Issue</button>
                      <button style={{ background: 'linear-gradient(to bottom, #e0e0e0, #c0c0c0)', color: '#666', fontWeight: 'bold', border: '1px solid #aaa', borderRadius: '3px', padding: '2px 10px', minWidth: '70px' }}>#Reload</button>
                      <button style={{ background: 'linear-gradient(to bottom, #72ba60, #4ca03c)', color: 'white', fontWeight: 'bold', border: '1px solid #3c822e', borderRadius: '3px', padding: '2px 10px', minWidth: '70px' }}>#Balance</button>
                      <button style={{ background: 'linear-gradient(to bottom, #e0e0e0, #c0c0c0)', color: '#666', fontWeight: 'bold', border: '1px solid #aaa', borderRadius: '3px', padding: '2px 10px', minWidth: '70px' }}>#Void</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedOption === 'Customer Info' && (
            <CustomerInfoView
              onSelectCustomer={(cust) => setCustomer(cust)}
              onAction={(action, cust) => {
                setCustomer(cust);
                setSelectedOption(action);
              }}
            />
          )}

          {(selectedOption !== 'Payment On Account' && selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Appraisal' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card' && selectedOption !== 'Customer Info') && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: '350px' }}>
                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  {customer ? (
                    <label style={{ color: 'blue', cursor: 'pointer', fontWeight: 'bold', minWidth: '140px', textAlign: 'right', paddingTop: '3px' }} onClick={() => { setIsEditingCustomer(true); setEditedCustomer({ ...customer }); }}>Edit {customer.firstName} {customer.lastName}</label>
                  ) : (
                    <label style={{ minWidth: '140px', textAlign: 'right', paddingTop: '3px' }}>{customerLabelText}*</label>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="form-input-with-icon" style={{ border: '1px solid #5ab0e2', boxShadow: '0 0 3px #5ab0e2', width: '200px' }}>
                      <input type="text" value={customer ? `DAVY-${String(customer.customerId).padStart(5, '0')}` : ''} readOnly />
                      <div className="form-input-icon" onClick={() => setShowCustomerLookup(true)}>
                        <BookIcon />
                      </div>
                    </div>
                    {customer && !isEditingCustomer && (
                      <div style={{ fontSize: '12px', marginTop: '2px', lineHeight: '1.4' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{customer.firstName} {customer.lastName}</div>
                        <div>{customer.addressLine}</div>
                        <div>{customer.city}{customer.stateName ? `, ${customer.stateName}` : ''}{customer.zipCode ? `, ${customer.zipCode}` : ''}, US</div>
                        <div>{customer.mobile}</div>
                        <div>{customer.email}</div>
                      </div>
                    )}
                    {customer && isEditingCustomer && (
                      <div style={{ fontSize: '12px', marginTop: '2px', lineHeight: '1.4', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <input style={{ width: '98px', border: '1px solid #ccc', padding: '1px 2px' }} value={editedCustomer.firstName} onChange={(e) => setEditedCustomer({ ...editedCustomer, firstName: e.target.value })} placeholder="First Name" />
                          <input style={{ width: '98px', border: '1px solid #ccc', padding: '1px 2px' }} value={editedCustomer.lastName} onChange={(e) => setEditedCustomer({ ...editedCustomer, lastName: e.target.value })} placeholder="Last Name" />
                        </div>
                        <input style={{ width: '200px', border: '1px solid #ccc', padding: '1px 2px' }} value={editedCustomer.addressLine} onChange={(e) => setEditedCustomer({ ...editedCustomer, addressLine: e.target.value })} placeholder="Address" />
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <input style={{ width: '80px', border: '1px solid #ccc', padding: '1px 2px' }} value={editedCustomer.city} onChange={(e) => setEditedCustomer({ ...editedCustomer, city: e.target.value })} placeholder="City" />
                          <input style={{ width: '50px', border: '1px solid #ccc', padding: '1px 2px' }} value={editedCustomer.stateName} onChange={(e) => setEditedCustomer({ ...editedCustomer, stateName: e.target.value })} placeholder="State" />
                          <input style={{ width: '62px', border: '1px solid #ccc', padding: '1px 2px' }} value={editedCustomer.zipCode} onChange={(e) => setEditedCustomer({ ...editedCustomer, zipCode: e.target.value })} placeholder="Zip" />
                        </div>
                        <input style={{ width: '200px', border: '1px solid #ccc', padding: '1px 2px' }} value={editedCustomer.mobile} onChange={(e) => setEditedCustomer({ ...editedCustomer, mobile: e.target.value })} placeholder="Phone" />
                        <input style={{ width: '200px', border: '1px solid #ccc', padding: '1px 2px' }} value={editedCustomer.email} onChange={(e) => setEditedCustomer({ ...editedCustomer, email: e.target.value })} placeholder="Email" />
                        <div style={{ display: 'flex', gap: '5px', marginTop: '2px' }}>
                          <button onClick={handleSaveInlineCustomer} style={{ background: 'linear-gradient(to bottom, #72ba60, #4ca03c)', color: 'white', padding: '2px 8px', border: '1px solid #3c822e', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                          <button onClick={() => setIsEditingCustomer(false)} style={{ background: 'linear-gradient(to bottom, #e0e0e0, #c0c0c0)', padding: '2px 8px', border: '1px solid #aaa', borderRadius: '3px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {customer && (
                  <>
                    <div className="form-group" style={{ marginTop: '5px' }}>
                      <label style={{ fontWeight: 'bold', minWidth: '140px', textAlign: 'right' }}>Assigned Salesperson</label>
                      <span style={{ fontSize: '13px' }}>{customer.salesperson || 'WILLIAM SCHILDER'}</span>
                    </div>

                    <div className="form-group">
                      <label style={{ minWidth: '140px' }}></label>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center', fontSize: '12px', marginLeft: '5px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 'normal' }}>
                          <input type="checkbox" defaultChecked /> CRM
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 'normal' }}>
                          <input type="checkbox" defaultChecked /> Do Not Call For This Transaction
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 'normal' }}>
                          <input type="checkbox" /> Gift Sale
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '20px', marginRight: '20px' }}>
                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', minWidth: '70px', justifyContent: 'flex-end', marginRight: '5px' }}>
                    <input type="checkbox" style={{ margin: '0 5px 0 0' }} checked={isShipToChecked} onChange={(e) => setIsShipToChecked(e.target.checked)} />
                    <label style={{ minWidth: 'auto', marginRight: '0', paddingTop: '1px' }}>Ship To</label>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="form-input-with-icon" style={{ borderColor: '#aaa', width: '200px' }}>
                      <input type="text" value={shippingAddress ? `${shippingAddress.firstName} ${shippingAddress.lastName} - ${shippingAddress.address1}` : ''} style={{ backgroundColor: isShipToChecked ? '#fff' : '#e5e5e5', width: '100%', border: 'none', outline: 'none', padding: '2px 5px' }} readOnly />
                      <div
                        className="form-input-icon"
                        style={{
                          background: isShipToChecked ? 'linear-gradient(to bottom, #7ca0e6, #507bce)' : '#f0f0f0',
                          borderLeft: '1px solid #aaa',
                          cursor: isShipToChecked ? 'pointer' : 'default',
                          color: isShipToChecked ? 'white' : '#888',
                          padding: '0 6px'
                        }}
                        onClick={() => isShipToChecked && setShowShippingModal(true)}
                      >
                        <BookIcon />
                      </div>
                    </div>
                    {customer && (
                      <div style={{ fontSize: '12px', marginTop: '2px', lineHeight: '1.4', fontWeight: 'bold' }}>
                        <div>{customer.firstName} {customer.lastName}</div>
                      </div>
                    )}
                  </div>
                </div>

                {(selectedOption === 'Layaway' || selectedOption === 'Special Order' || selectedOption === 'Custom Order' || selectedOption === 'Repair') && (
                  <>
                    {selectedOption !== 'Repair' && (
                      <div className="form-group" style={{ justifyContent: 'flex-end', marginTop: '5px' }}>
                        <label style={{ minWidth: 'auto', marginRight: '5px' }}>Hard Ship Date</label>
                        <input type="checkbox" defaultChecked />
                      </div>
                    )}
                    <div className="form-group" style={{ justifyContent: 'flex-end', position: 'relative' }}>
                      <label style={{ minWidth: 'auto', marginRight: '5px' }}>
                        {selectedOption === 'Repair' ? 'Approx Compl. Date' : 'Ship Date'}
                      </label>
                      <div className="form-input-with-icon" style={{ width: '100px' }}>
                        <input type="text" style={{ width: '100%' }} value={`${String(shipSelectedDate.getMonth() + 1).padStart(2, '0')}/${String(shipSelectedDate.getDate()).padStart(2, '0')}/${shipSelectedDate.getFullYear()}`} readOnly />
                        <div className="form-input-icon gray" style={{ padding: '0 2px', cursor: 'pointer' }} onClick={() => setShowShipDatePicker(!showShipDatePicker)}>
                          <CalendarIcon />
                        </div>
                      </div>
                      {showShipDatePicker && (
                        <div className="date-picker-popup">
                          <div className="date-picker-header">
                            <button onClick={() => setShipCurrentMonth(new Date(shipCurrentMonth.getFullYear(), shipCurrentMonth.getMonth() - 1, 1))}>◀</button>
                            <div className="date-picker-month-year">
                              {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][shipCurrentMonth.getMonth()]} <span>{shipCurrentMonth.getFullYear()}</span>
                              <span style={{ fontSize: '10px' }}>↕</span>
                            </div>
                            <button onClick={() => setShipCurrentMonth(new Date(shipCurrentMonth.getFullYear(), shipCurrentMonth.getMonth() + 1, 1))}>▶</button>
                          </div>
                          <div className="date-picker-grid">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="date-picker-day-name">{d}</div>)}
                            {[...Array(new Date(shipCurrentMonth.getFullYear(), shipCurrentMonth.getMonth(), 1).getDay())].map((_, i) => <div key={`empty-${i}`}></div>)}
                            {[...Array(new Date(shipCurrentMonth.getFullYear(), shipCurrentMonth.getMonth() + 1, 0).getDate())].map((_, i) => {
                              const day = i + 1;
                              const isSelected = shipSelectedDate.getDate() === day && shipSelectedDate.getMonth() === shipCurrentMonth.getMonth() && shipSelectedDate.getFullYear() === shipCurrentMonth.getFullYear();
                              return (
                                <div
                                  key={day}
                                  className={`date-picker-day ${isSelected ? 'selected' : ''}`}
                                  onClick={() => {
                                    setShipSelectedDate(new Date(shipCurrentMonth.getFullYear(), shipCurrentMonth.getMonth(), day));
                                    setShowShipDatePicker(false);
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
                    {selectedOption === 'Layaway' ? (
                      <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                        <label style={{ minWidth: 'auto', marginRight: '5px' }}>Next Due Date</label>
                        <div className="form-input-with-icon" style={{ width: '100px' }}>
                          <input type="text" style={{ width: '100%' }} />
                          <div className="form-input-icon gray" style={{ padding: '0 2px' }}>
                            <CalendarIcon />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                          <label style={{ minWidth: 'auto', marginRight: '5px' }}>Rush Order</label>
                          <input type="checkbox" />
                        </div>
                        <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                          <label style={{ minWidth: 'auto', marginRight: '5px' }}>Christmas Order</label>
                          <input type="checkbox" />
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          )}
          {selectedOption !== 'Customer Info' && (
            <div className="right-form-block">
              {(selectedOption !== 'Payment On Account' && selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Appraisal' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card') && (
                <div className="form-group">
                  <label>Salesperson</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="form-input-with-icon" style={{ border: '1px solid #ccc', width: '250px', height: '22px' }}>
                      <input type="text" style={{ width: '100%', padding: '0 4px' }} value={salesperson} onChange={(e) => setSalesperson(e.target.value)} />
                      <div className="form-input-icon" onClick={() => setShowSalespersonModal(true)}>
                        <BookIcon />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {(selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Appraisal' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card') && (
                <div className="form-group">
                  <label>Cashier</label>
                  <select className="sales-select" style={{ width: '250px' }}>
                    <option>Diaspark Admin(ADMIN)</option>
                    <option>Vinod Jain(Vinod)</option>
                    <option>Dave Rodies(dave)</option>
                    <option>Ghad Slim(ghad)</option>
                    <option>Marry Disuja(Marry)</option>
                    <option>Vinod Jain(Vinod)</option>
                    <option>Dave Rodies(dave)</option>
                  </select>
                </div>
              )}
              {(selectedOption !== 'Payment On Account' && selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Appraisal' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card') && (
                <div className="form-group">
                  <label>{(selectedOption === 'Layaway' || selectedOption === 'Finalize Sale' || selectedOption === 'Special Order' || selectedOption === 'Custom Order' || selectedOption === 'Repair') ? 'Department' : 'Terminal'}</label>
                  <input type="text" value="POS" readOnly className="sales-select" style={{ width: '250px', backgroundColor: '#e5e5e5' }} />
                </div>
              )}
              {(selectedOption !== 'Void Transactions' && selectedOption !== 'Payment On Account' && selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Appraisal' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card' && selectedOption !== 'Repair' && selectedOption !== 'Customer Info') && (
                <div className="form-group">
                  <label>Online Review</label>
                  <select className="sales-select" style={{ width: '250px' }}>
                    <option></option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              )}
              {(selectedOption !== 'Void Transactions' && selectedOption !== 'Payment On Account' && selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card' && selectedOption !== 'Customer Info') && (
                <div className="form-group" style={{ position: 'relative' }}>
                  <label>Ref#/Date</label>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <input type="text" className="sales-select" style={{ width: '145px' }} />
                    <div className="form-input-with-icon" style={{ width: '95px' }}>
                      <input type="text" style={{ width: '100%' }} value={`${String(selectedDate.getMonth() + 1).padStart(2, '0')}/${String(selectedDate.getDate()).padStart(2, '0')}/${selectedDate.getFullYear()}`} readOnly />
                      <div className="form-input-icon gray" style={{ padding: '0 2px' }} onClick={() => setShowDatePicker(!showDatePicker)}>
                        <CalendarIcon />
                      </div>
                    </div>
                  </div>

                  {showDatePicker && (
                    <div className="date-picker-popup">
                      <div className="date-picker-header">
                        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>◀</button>
                        <div className="date-picker-month-year">
                          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][currentMonth.getMonth()]} <span>{currentMonth.getFullYear()}</span>
                          <span style={{ fontSize: '10px' }}>↕</span>
                        </div>
                        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>▶</button>
                      </div>
                      <div className="date-picker-grid">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="date-picker-day-name">{d}</div>)}

                        {[...Array(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay())].map((_, i) => <div key={`empty-${i}`}></div>)}

                        {[...Array(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate())].map((_, i) => {
                          const day = i + 1;
                          const isSelected = selectedDate.getDate() === day &&
                            selectedDate.getMonth() === currentMonth.getMonth() &&
                            selectedDate.getFullYear() === currentMonth.getFullYear();
                          return (
                            <div
                              key={day}
                              className={`date-picker-day ${isSelected ? 'selected' : ''}`}
                              onClick={() => {
                                setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
                                setShowDatePicker(false);
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
              )}

              {(selectedOption === 'Layaway' || selectedOption === 'Finalize Sale' || selectedOption === 'Special Order' || selectedOption === 'Custom Order' || selectedOption === 'Repair') && (
                <div className="form-group">
                  <label>{selectedOption === 'Finalize Sale' ? 'Sales Category' : 'Order Category'}</label>
                  <select className="sales-select" style={{ width: '250px' }}>
                    <option>InHouse</option>
                    <option>Overseas</option>
                    <option>Wholesale Sale</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {selectedOption !== 'Customer Info' && (
          <div className="checkbox-group">
            {selectedOption === 'Payment On Account' ? null :
              selectedOption === 'Trade In' ? (
                <>
                  <label className="checkbox-item"><input type="checkbox" /> Do Not Track</label>
                  <label className="checkbox-item"><input type="checkbox" /> Do Not Call</label>
                  <label className="checkbox-item"><input type="checkbox" /> Gift Sale</label>
                </>
              ) : selectedOption === 'Void Transactions' ? (
                <>
                  <label className="checkbox-item"><input type="checkbox" /> Do Not Track</label>
                  <label className="checkbox-item"><input type="checkbox" /> Do Not Call</label>
                </>
              ) : (
                <>
                  <label className="checkbox-item"><input type="checkbox" defaultChecked /> CRM</label>
                  <label className="checkbox-item"><input type="checkbox" /> Do Not Call For This Transaction</label>
                  <label className="checkbox-item"><input type="checkbox" /> Gift Sale</label>
                </>
              )}
          </div>
        )}
      </div>

      {selectedOption !== 'Customer Info' && (
        <>
          {/* Input Bar & Grid Section */}
          {selectedOption === 'Quick Repair' ? (
            <div className="quick-repair-section">
              <div className="qr-col" style={{ width: '350px' }}>
                <div className="qr-radio-group">
                  <label><input type="radio" name="qr_type" defaultChecked /> Jewelry</label>
                  <label><input type="radio" name="qr_type" /> Watch</label>
                  <label><input type="radio" name="qr_type" /> Giftware</label>
                  <label><input type="radio" name="qr_type" /> Diamond</label>
                  <label><input type="radio" name="qr_type" /> Metal</label>
                </div>
                <div className="form-group" style={{ justifyContent: 'space-between', marginTop: '10px' }}>
                  <label style={{ minWidth: 'auto', textAlign: 'left' }}>Description</label>
                  <input type="text" style={{ width: '250px' }} defaultValue="REPAIR-JEWELRY" />
                </div>
                <div className="form-group" style={{ justifyContent: 'space-between' }}>
                  <label style={{ minWidth: 'auto', textAlign: 'left' }}>Declared Value*</label>
                  <input type="text" style={{ width: '150px', textAlign: 'right' }} defaultValue="0.00" />
                </div>
                <div className="upload-images-link" onClick={() => setShowUploadModal(true)} style={{ color: 'blue', fontWeight: 'bold', cursor: 'pointer', display: 'inline-block' }}>Upload Images</div>
              </div>

              <div className="qr-col" style={{ flex: 1, paddingLeft: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Item Description</label>
                  <textarea className="qr-textarea"></textarea>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Repair Instruction</label>
                  <textarea className="qr-textarea"></textarea>
                </div>
              </div>

              <div className="qr-col" style={{ width: '300px' }}>
                <div className="qr-radio-group" style={{ marginBottom: '15px' }}>
                  <label><input type="radio" name="qr_action" /> Resize</label>
                  <label><input type="radio" name="qr_action" defaultChecked /> Repair</label>
                  <label><input type="radio" name="qr_action" /> Remake</label>
                  <label><input type="radio" name="qr_action" /> Service</label>
                </div>
                <div className="qr-listbox">
                  <div className="qr-listbox-header">
                    <div style={{ width: '80px' }}>Select YN</div>
                    <div>Name</div>
                  </div>
                  <div className="qr-listbox-row"><div></div><div>Re-Rhodium Black</div></div>
                  <div className="qr-listbox-row"><div></div><div>Solder / Broken Piece</div></div>
                  <div className="qr-listbox-row"><div></div><div>Replace Stone</div></div>
                  <div className="qr-listbox-row"><div></div><div>Re-set stone</div></div>
                  <div className="qr-listbox-row"><div></div><div>Retip Prongs</div></div>
                  <div className="qr-listbox-row"><div></div><div>Tighten loose stones</div></div>
                </div>
              </div>
            </div>
          ) : selectedOption !== 'Gift Card' ? (
            <>
              {/* Non-Quick Repair Input Row */}
              <div className="input-bar-row" style={selectedOption === 'Void Transactions' ? { justifyContent: 'center' } : (selectedOption === 'Cancel Order' || selectedOption === 'Payment (Open Order)' || selectedOption === 'Finalize Sale' || selectedOption === 'Payment On Account') ? { justifyContent: 'flex-start' } : { padding: 0 }}>
                {selectedOption === 'Void Transactions' ? (
                  <div className="form-group">
                    <label style={{ minWidth: '90px', fontWeight: 'bold' }}>Transaction #</label>
                    <div className="form-input-with-icon">
                      <input type="text" style={{ width: '250px' }} />
                      <div className="form-input-icon" onClick={() => setShowTransactionLookup(true)} style={{ cursor: 'pointer' }}><BookIcon /></div>
                    </div>
                  </div>
                ) : (selectedOption === 'Cancel Order' || selectedOption === 'Payment (Open Order)') ? (
                  <>
                    <div className="form-group" style={{ marginRight: '15px', padding: '8px 10px' }}>
                      <label style={{ minWidth: '90px', fontWeight: 'bold' }}>Transaction #</label>
                      <div className="form-input-with-icon">
                        <input type="text" style={{ width: '150px' }} />
                        <div className="form-input-icon" onClick={() => setShowTransactionLookup(true)} style={{ cursor: 'pointer' }}><BookIcon /></div>
                      </div>
                    </div>
                    {(selectedOption === 'Payment (Open Order)' || selectedOption === 'Payment On Account') ? (
                      <div style={{ display: 'flex', flex: 1, backgroundColor: '#f0f0f0', borderLeft: '1px solid #ccc', padding: '10px' }}>
                        <div style={{ flex: 1, fontWeight: 'bold', borderRight: '1px solid #ccc', paddingLeft: '10px' }}>Trans Type</div>
                        <div style={{ flex: 1, fontWeight: 'bold', borderRight: '1px solid #ccc', paddingLeft: '10px' }}>Trans #</div>
                        <div style={{ flex: 1, fontWeight: 'bold', borderRight: '1px solid #ccc', paddingLeft: '10px' }}>Trans Date</div>
                        <div style={{ flex: 1, fontWeight: 'bold', paddingLeft: '10px' }}>Delivery Type</div>
                      </div>
                    ) : (
                      <>
                        <div className="form-group"><label>Trans Type</label></div>
                        <div className="form-group" style={{ marginLeft: '40px' }}><label>Trans #</label></div>
                        <div className="form-group" style={{ marginLeft: '40px' }}><label>Trans Date</label></div>
                        <div className="form-group" style={{ marginLeft: '40px' }}><label>Delivery Type</label></div>
                      </>
                    )}
                  </>
                ) : selectedOption === 'Finalize Sale' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '8px 10px', width: '100%' }}>
                    <div className="form-group">
                      <select className="sales-select" style={{ width: '120px' }}>
                        <option>Layaway</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ marginRight: '15px' }}>
                      <label style={{ minWidth: '90px', fontWeight: 'bold' }}>Transaction #</label>
                      <div className="form-input-with-icon">
                        <input type="text" style={{ width: '150px' }} value={customTransNo} onChange={e => setCustomTransNo(e.target.value)} />
                        <div className="form-input-icon"><BookIcon /></div>
                      </div>
                    </div>
                  </div>
                ) : selectedOption === 'Payment On Account' ? null : selectedOption === 'Special Order' || selectedOption === 'Custom Order' || selectedOption === 'Repair' ? (
                  <div style={{ width: '100%' }}>
                    <div className="order-tabs-container">
                      <div className="order-tab active" style={{ marginLeft: '15px' }}>
                        {selectedOption === 'Special Order' ? 'Special Order 1' : selectedOption === 'Custom Order' ? 'SKU 1' : 'Repair 1'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 15px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc', fontSize: '11px', fontWeight: 'bold', color: 'blue' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                          <div onClick={() => setGridData([...gridData, { serial: '', description: '', qty: 1, wt: '', price: 0, extPrice: 0 }])} style={{ cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', color: '#00008b', lineHeight: '10px', fontFamily: 'monospace' }}>+</div>
                          <div onClick={() => gridData.length > 0 && setGridData(gridData.slice(0, -1))} style={{ cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', color: '#cc0000', lineHeight: '10px', fontFamily: 'monospace' }}>-</div>
                        </div>
                        {selectedOption === 'Repair' && (
                          <div className="form-group" style={{ margin: '0 10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <label style={{ minWidth: '85px', fontWeight: 'bold', color: 'black' }}>Transaction #</label>
                            <div className="form-input-with-icon" style={{ display: 'flex' }}>
                              <input type="text" style={{ width: '120px', height: '20px', fontSize: '12px', border: '1px solid #ccc' }} value={customTransNo} onChange={e => setCustomTransNo(e.target.value)} />
                              <div className="form-input-icon" onClick={() => setShowTransactionLookup(true)} style={{ height: '20px', width: '20px', backgroundColor: '#5c7ec4', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><BookIcon /></div>
                            </div>
                          </div>
                        )}
                        <span onClick={() => setShowItemDetailModal(true)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>{selectedOption === 'Repair' ? 'Repair Detail' : 'Serial #/Order Detail'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '30px', paddingRight: '20px' }}>
                        <span onClick={() => setShowCustomerComponentModal(true)} style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue', fontWeight: 'bold' }}>Customer Component</span>
                        {selectedOption === 'Repair' && <span onClick={() => setShowAlertsModal(true)} style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue', fontWeight: 'bold' }}>Alerts</span>}
                        <span onClick={() => setShowNotesModal(true)} style={{ fontSize: '18px', color: '#555', cursor: 'pointer', display: 'inline-block' }}>📎</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '8px 10px', width: '100%' }}>
                    {selectedOption === 'Return/Exchange' && (
                      <button className="action-btn new" style={{ marginRight: '15px' }} onClick={() => setShowTransactionLookup(true)}>Return</button>
                    )}
                    {selectedOption === 'Appraisal' ? (
                      <div className="form-group">
                        <label style={{ minWidth: '90px', fontWeight: 'bold' }}>Transaction #</label>
                        <div className="form-input-with-icon">
                          <input type="text" style={{ width: '150px' }} value={customTransNo} onChange={e => setCustomTransNo(e.target.value)} />
                          <div className="form-input-icon"><BookIcon /></div>
                        </div>
                      </div>
                    ) : selectedOption === 'Gift Certificate' ? null : (
                      <div className="form-group">
                        <label style={{ minWidth: '60px' }}>Barcode #</label>
                        <input
                          type="text"
                          className="sales-select"
                          style={{ width: '150px' }}
                          value={barcodeSearchText}
                          onChange={(e) => setBarcodeSearchText(e.target.value)}
                          onKeyDown={handleBarcodeEnter}
                          placeholder="Scan/Enter"
                        />
                      </div>
                    )}
                    {selectedOption !== 'Gift Certificate' && (
                      <>
                        <div className="form-group" style={{ position: 'relative' }}>
                          {isEditingSkuLabel ? (
                            <input 
                              type="text" 
                              autoFocus
                              style={{ minWidth: '70px', width: '80px', marginRight: '5px' }}
                              value={skuLabelText}
                              onChange={(e) => setSkuLabelText(e.target.value)}
                              onBlur={() => {
                                setIsEditingSkuLabel(false);
                                localStorage.setItem('customSkuLabel', skuLabelText || 'Style/ SKU #');
                                if (!skuLabelText) setSkuLabelText('Style/ SKU #');
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setIsEditingSkuLabel(false);
                                  localStorage.setItem('customSkuLabel', skuLabelText || 'Style/ SKU #');
                                  if (!skuLabelText) setSkuLabelText('Style/ SKU #');
                                }
                              }}
                            />
                          ) : (
                            <label 
                              style={{ minWidth: '70px', cursor: 'pointer', borderBottom: '1px dashed #999' }}
                              onClick={() => setIsEditingSkuLabel(true)}
                              title="Click to rename"
                            >
                              {skuLabelText}
                            </label>
                          )}
                          <div className="form-input-with-icon">
                            <input
                              type="text"
                              style={{ width: '250px' }}
                              value={skuSearchText}
                              onChange={(e) => setSkuSearchText(e.target.value)}
                              onFocus={() => { if (catalogItems.length > 0) setShowCatalogDropdown(true); }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && catalogItems.length > 0) {
                                  handleSelectCatalogItem(catalogItems[0]);
                                }
                              }}
                              placeholder="Type to search items..."
                            />
                            <div className="form-input-icon" onClick={() => setShowSkuLookup(true)}><BookIcon /></div>
                          </div>
                          {showCatalogDropdown && catalogItems.length > 0 && (
                            <div style={{
                              position: 'absolute', top: '100%', left: '80px', width: '500px',
                              maxHeight: '250px', overflowY: 'auto', backgroundColor: 'white',
                              border: '1px solid #4a7ab5', borderRadius: '3px', zIndex: 1000,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                            }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 80px', padding: '5px 8px', backgroundColor: '#4a6c98', color: 'white', fontWeight: 'bold', fontSize: '11px' }}>
                                <div>Code</div><div>Description</div><div style={{ textAlign: 'right' }}>Price</div>
                              </div>
                              {catalogItems.map((item, idx) => (
                                <div key={idx} onClick={() => handleSelectCatalogItem(item)} style={{
                                  display: 'grid', gridTemplateColumns: '150px 1fr 80px', padding: '4px 8px',
                                  cursor: 'pointer', fontSize: '11px',
                                  backgroundColor: idx % 2 === 0 ? '#fff' : '#f0f5ff',
                                  borderBottom: '1px solid #eee'
                                }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#cde0f7'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#fff' : '#f0f5ff'}
                                >
                                  <div style={{ color: '#336', fontWeight: 'bold' }}>{item.code}</div>
                                  <div>{item.description}</div>
                                  <div style={{ textAlign: 'right', color: '#060', fontWeight: 'bold' }}>{item.price.toFixed(2)}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="form-group">
                          {isEditingItemLabel ? (
                            <input 
                              type="text" 
                              autoFocus
                              style={{ minWidth: '50px', width: '60px', fontWeight: 'bold', marginRight: '5px' }}
                              value={itemLabelText}
                              onChange={(e) => setItemLabelText(e.target.value)}
                              onBlur={() => {
                                setIsEditingItemLabel(false);
                                localStorage.setItem('customItemLabel', itemLabelText || 'Item #');
                                if (!itemLabelText) setItemLabelText('Item #');
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setIsEditingItemLabel(false);
                                  localStorage.setItem('customItemLabel', itemLabelText || 'Item #');
                                  if (!itemLabelText) setItemLabelText('Item #');
                                }
                              }}
                            />
                          ) : (
                            <label 
                              style={{ minWidth: '50px', cursor: 'pointer', borderBottom: '1px dashed #999' }} 
                              onClick={() => setIsEditingItemLabel(true)}
                              title="Click to rename"
                            >
                              {itemLabelText}
                            </label>
                          )}
                          <div className="form-input-with-icon">
                            <input type="text" style={{ width: '250px' }} />
                            <div className="form-input-icon" onClick={() => setShowItemLookup(true)}><BookIcon /></div>
                          </div>
                          {(selectedOption === 'Layaway' || selectedOption === 'Appraisal') && (
                            <span style={{ fontSize: '18px', color: '#555', cursor: 'pointer', marginLeft: '15px' }}>📎</span>
                          )}
                        </div>
                      </>
                    )}
                    {selectedOption === 'Trade In' && (
                      <div style={{ display: 'flex', gap: '15px', marginLeft: 'auto' }}>
                        <button className="action-btn" style={{ background: 'linear-gradient(to bottom, #6bc06b, #4b9e4b)', border: '1px solid #3d8a3d', color: 'white', fontWeight: 'bold' }} onClick={() => { setTradeInCategory('Trade-In'); setShowTradeInModal(true); }}>TradeIn</button>
                        <button className="action-btn" style={{ background: 'linear-gradient(to bottom, #6bc06b, #4b9e4b)', border: '1px solid #3d8a3d', color: 'white', fontWeight: 'bold' }} onClick={() => { setTradeInCategory('Gold Purchase'); setShowTradeInModal(true); }}>Gold Purchase</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Data Grid Section */}
              {selectedOption !== 'Gift Certificate' && (
                <div className="data-grid-section">
                  <div className="grid-header" style={
                    selectedOption === 'Repair' ? { gridTemplateColumns: '1fr 2fr 0.5fr 0.5fr 1fr 1fr' } :
                      (selectedOption === 'Cancel Order' || selectedOption === 'Payment (Open Order)') ? { gridTemplateColumns: '2fr 4fr 1fr 1fr 1fr 1fr' } :
                        selectedOption === 'Payment On Account' ? { gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr', padding: '5px' } : {}
                  }>
                    {selectedOption === 'Payment On Account' ? (
                      <>
                        <div>Apply</div>
                        <div>Customer #</div>
                        <div>Store #</div>
                        <div>Trans Bk</div>
                        <div>Trans #</div>
                        <div>Trans Date</div>
                        <div>Due Date</div>
                        <div>Net Amt</div>
                        <div>Balance Amt</div>
                        <div>Apply Amt</div>
                      </>
                    ) : (
                      <>
                        {selectedOption === 'Gift Certificate' && <div>Style/ SKU #</div>}
                        <div>Serial #</div>
                        <div>Description</div>

                        {selectedOption === 'Repair' ? (
                          <>
                            <div style={{ textAlign: 'center' }}>Qty</div>
                            <div style={{ textAlign: 'center' }}>Wt</div>
                            <div style={{ textAlign: 'center' }}>SKU Price</div>
                            <div style={{ textAlign: 'right' }}>Value</div>
                          </>
                        ) : (selectedOption === 'Cancel Order' || selectedOption === 'Payment (Open Order)' || selectedOption === 'Finalize Sale' || selectedOption === 'Layaway' || selectedOption === 'Sales') ? (
                          <>
                            <div style={{ textAlign: 'right' }}>Qty</div>
                            <div style={{ textAlign: 'right' }}>Wt</div>
                            <div style={{ textAlign: 'right' }}>Price</div>
                            <div style={{ textAlign: 'right' }}>Ext. Price</div>
                          </>
                        ) : (selectedOption === 'Appraisal') ? (
                          <>
                            <div style={{ textAlign: 'right' }}>Qty</div>
                            <div style={{ textAlign: 'right' }}>Wt</div>
                            <div style={{ textAlign: 'right' }}>Fees</div>
                          </>
                        ) : selectedOption === 'Gift Certificate' ? (
                          <>
                            <div style={{ color: 'blue', textAlign: 'right' }}>Item Price</div>
                            <div style={{ color: 'blue', textAlign: 'right' }}>Qty</div>
                            <div style={{ color: 'blue', textAlign: 'right' }}>Item Amt</div>
                            <div style={{ textAlign: 'right' }}>Tax</div>
                          </>
                        ) : (
                          <>
                            <div style={{ textAlign: 'right' }}>Qty</div>
                            <div style={{ textAlign: 'right' }}>Wt</div>
                            <div style={{ textAlign: 'right' }}>SKU Price</div>
                            <div style={{ textAlign: 'right' }}>Value</div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <div className="grid-body" style={{ display: 'flex', flexDirection: 'column' }}>
                    {gridData.map((item, index) => (
                      <React.Fragment key={index}>
                        <div onClick={() => setSelectedRowIndex(index)} style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 2fr 0.5fr 0.5fr 1fr 1fr',
                          borderBottom: '1px solid #ccc',
                          padding: '5px',
                          backgroundColor: selectedRowIndex === index ? '#4b74c4' : (index % 2 === 0 ? '#fff' : '#f9f9f9'),
                          color: selectedRowIndex === index ? 'white' : 'black',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}>
                          <div><input type="text" value={item.serial || item.sku || ''} onChange={(e) => {
                            const newGrid = [...gridData];
                            newGrid[index].serial = e.target.value;
                            setGridData(newGrid);
                          }} style={{ width: '90%', border: 'none', background: 'transparent', color: selectedRowIndex === index ? 'white' : 'black' }} placeholder="Serial/SKU" /></div>
                          <div><input type="text" value={item.description || ''} onChange={(e) => {
                            const newGrid = [...gridData];
                            newGrid[index].description = e.target.value;
                            setGridData(newGrid);
                          }} style={{ width: '90%', border: 'none', background: 'transparent', color: selectedRowIndex === index ? 'white' : 'black' }} placeholder="Description" /></div>
                          <div style={{ textAlign: 'right' }}>
                            <input type="number" value={item.qty || 1} onChange={(e) => {
                              const newGrid = [...gridData];
                              newGrid[index].qty = e.target.value;
                              setGridData(newGrid);
                            }} style={{ width: '40px', textAlign: 'right', border: '1px solid #ccc', background: 'white', color: 'black' }} />
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <input type="number" value={item.wt || 0} onChange={(e) => {
                              const newGrid = [...gridData];
                              newGrid[index].wt = e.target.value;
                              setGridData(newGrid);
                            }} style={{ width: '50px', textAlign: 'right', border: '1px solid #ccc', background: 'white', color: 'black' }} step="0.01" />
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <input type="number" value={item.price || ''} onChange={(e) => {
                              const newGrid = [...gridData];
                              newGrid[index].price = e.target.value;
                              setGridData(newGrid);
                            }} style={{ width: '80px', textAlign: 'right', border: '1px solid #ccc', background: 'white', color: 'black' }} step="0.01" placeholder="0.00" />
                          </div>
                          <div style={{ textAlign: 'right' }}>{(parseFloat(item.qty || 1) * parseFloat(item.price || 0)).toFixed(2)}</div>
                        </div>
                        {selectedRowIndex === index && (
                          <div style={{
                            backgroundColor: '#4b74c4',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '5px 15px',
                            borderBottom: '1px solid #ccc'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                              <span onClick={() => setShowNotesModal(true)} style={{ fontSize: '18px', color: '#ffa500', cursor: 'pointer', display: 'inline-block' }}>📋</span>
                              {(selectedOption === 'Sales' || selectedOption === 'Finalize Sale') && item.sku !== 'CARE-PLAN-000' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '12px' }}>
                                  <span style={{ fontWeight: 'bold' }}>Care Plan</span>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                                    <input
                                      type="radio"
                                      name={`careplan-${index}`}
                                      checked={item.carePlan === true}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        setCarePlanForIndex(index);
                                        setShowCarePlanModal(true);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    Yes
                                  </label>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                                    <input
                                      type="radio"
                                      name={`careplan-${index}`}
                                      checked={item.carePlan === false || item.carePlan === undefined}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        const newGrid = [...gridData];
                                        newGrid[index].carePlan = false;
                                        // Remove any associated care plan line
                                        const filtered = newGrid.filter(g => g.carePlanForIndex !== index);
                                        setGridData(filtered);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    No
                                  </label>
                                </div>
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ color: 'white', fontSize: '13px' }}>{salesperson || 'No Salesperson'}</div>
                              <div style={{ display: 'flex', gap: '5px' }}>
                                <button className="grid-action-btn" onClick={(e) => { e.stopPropagation(); setShowSalespersonModal(true); }} style={{ padding: '2px 10px', background: 'linear-gradient(to bottom, #d6e8fb, #5c7ec4)', color: 'white', border: '1px solid white', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}>Salesperson</button>
                                <button className="grid-action-btn" onClick={(e) => { e.stopPropagation(); setSelectedRowIndex(index); setShowItemDetailModal(true); }} style={{ padding: '2px 10px', background: 'linear-gradient(to bottom, #d6e8fb, #5c7ec4)', color: 'white', border: '1px solid white', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}>Edit</button>
                                <button className="grid-action-btn" onClick={(e) => {
                                  e.stopPropagation();
                                  const newGrid = gridData.filter((_, i) => i !== index);
                                  setGridData(newGrid);
                                  setSelectedRowIndex(null);
                                }} style={{ padding: '2px 10px', background: 'linear-gradient(to bottom, #d6e8fb, #5c7ec4)', color: 'white', border: '1px solid white', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}>Remove</button>
                              </div>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                    {(selectedOption === 'Special Order' || selectedOption === 'Custom Order' || selectedOption === 'Repair') && (
                      <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#eef3fb' }}>
                        {/* Top Bar */}
                        <div style={{ backgroundColor: '#5c7ec4', padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
                          {selectedOption === 'Repair' ? (() => {
                            const repairItem = (selectedRowIndex !== null ? gridData[selectedRowIndex] : null) || gridData.find(item => item.category === 'Repair' || item.serial === 'REPAIR') || {};
                            return (
                              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12px' }}>
                                  <span style={{ fontWeight: 'bold' }}>REPAIR-SERVICE</span>
                                  <span style={{ color: '#ddd' }}>Approx Value {parseFloat(repairItem.price || 0).toFixed(2)}</span>
                                  <span style={{ color: '#ddd' }}>Qty {repairItem.qty || 1}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                                  <span>Jacob Levy, Ryan G.</span>
                                  <button onClick={() => setShowSalespersonModal(true)} style={{ padding: '2px 10px', background: 'linear-gradient(to bottom, #d6e8fb, #5c7ec4)', color: 'white', border: '1px solid white', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}>Salesperson</button>
                                </div>
                              </div>
                            );
                          })() : (
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                              <button onClick={() => setShowSalespersonModal(true)} style={{ padding: '2px 15px', fontSize: '11px', color: '#555', backgroundColor: '#e5e5e5', border: '1px solid #999', cursor: 'pointer', borderRadius: '2px' }}>Salesperson</button>
                            </div>
                          )}
                        </div>

                        {selectedOption === 'Repair' ? (() => {
                          const repairItem = (selectedRowIndex !== null ? gridData[selectedRowIndex] : null) || gridData.find(item => item.category === 'Repair' || item.serial === 'REPAIR') || {};
                          const details = repairItem.repairDetails || {};
                          const sd = details.stoneDetails || { center: {}, side1: {}, side2: {} };
                          const laborRows = details.repairRows || [];

                          return (
                            <div style={{ padding: '5px 10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {/* Info Line */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '11px', color: '#333' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><input type="checkbox" /> No Warranty</label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><input type="checkbox" /> Appraisal</label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><input type="checkbox" /> New Sale</label>
                                <span style={{ marginLeft: '20px' }}>Item Type - {details.itemType || ''}</span>
                                <span>Category # - {details.category || ''}</span>
                                <span>Metal Type - {details.metalType || ''}</span>
                                <span>Metal Color - {details.metalColor || ''}</span>
                              </div>

                              {/* Main Block */}
                              <div style={{ display: 'flex', gap: '20px', marginTop: '5px', paddingBottom: '10px' }}>
                                {/* Col 1 */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '80px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <div style={{ width: '35px', height: '35px', backgroundColor: 'black' }}></div>
                                    <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Estimate</span>
                                  </div>
                                  <div className="upload-images-link" onClick={() => setShowUploadModal(true)} style={{ color: 'blue', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px', textAlign: 'center' }}>Upload Images</div>
                                </div>

                                {/* Col 2: Details */}
                                {details.itemType === 'Watch' ? (
                                  <div style={{ width: '250px' }}>
                                    <table style={{ fontSize: '11px', color: 'black', fontWeight: 'bold', borderCollapse: 'collapse', textAlign: 'left', width: '100%' }}>
                                      <tbody>
                                        <tr>
                                          <td style={{ textAlign: 'right', paddingRight: '5px', fontWeight: 'normal' }}>Brand</td>
                                          <td>{details.brand || ''}</td>
                                          <td style={{ textAlign: 'right', paddingRight: '5px', fontWeight: 'normal' }}>Band Type</td>
                                          <td>{details.watchBandType || ''}</td>
                                        </tr>
                                        <tr>
                                          <td style={{ textAlign: 'right', paddingRight: '5px', fontWeight: 'normal' }}>Serial #</td>
                                          <td>{details.watchSerial || ''}</td>
                                          <td style={{ textAlign: 'right', paddingRight: '5px', fontWeight: 'normal' }}>Case Size</td>
                                          <td>{details.watchCaseSize || ''}</td>
                                        </tr>
                                        <tr>
                                          <td style={{ textAlign: 'right', paddingRight: '5px', fontWeight: 'normal' }}>Movement</td>
                                          <td>{details.watchMovement || ''}</td>
                                          <td style={{ textAlign: 'right', paddingRight: '5px', fontWeight: 'normal' }}>Metal</td>
                                          <td>{details.watchMetal || ''}</td>
                                        </tr>
                                        <tr>
                                          <td style={{ textAlign: 'right', paddingRight: '5px', fontWeight: 'normal' }}>Gender</td>
                                          <td>{details.watchGender || ''}</td>
                                          <td></td>
                                          <td></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div style={{ width: '220px' }}>
                                    <table style={{ fontSize: '11px', color: 'black', fontWeight: 'bold', borderCollapse: 'collapse', textAlign: 'center', width: '100%' }}>
                                      <thead>
                                        <tr>
                                          <th></th>
                                          <th style={{ padding: '0 5px' }}>Center Stone</th>
                                          <th style={{ padding: '0 5px' }}>Side Stone</th>
                                          <th style={{ padding: '0 5px' }}>Side Stone</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {['Type', 'Shape', 'Color', 'Quantity', 'Carat'].map(label => (
                                          <tr key={label}>
                                            <td style={{ textAlign: 'right', paddingRight: '5px', fontWeight: 'normal' }}>{label}</td>
                                            <td>{sd.center?.[label] || ''}</td>
                                            <td>{sd.side1?.[label] || ''}</td>
                                            <td>{sd.side2?.[label] || ''}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}

                                {/* Col 3: Text Areas */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, fontSize: '11px' }}>
                                  <div>
                                    <div style={{ marginBottom: '2px' }}>Item Description</div>
                                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.2', color: '#444' }}>{details.itemDescription || ''}</div>
                                  </div>
                                  <div>
                                    <div style={{ marginBottom: '2px' }}>Repair Instruction</div>
                                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.2', color: '#444' }}>{details.repairInstruction || ''}</div>
                                  </div>
                                </div>

                                {/* Col 4: Labor */}
                                <div style={{ width: '250px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  {laborRows.map((row, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span>{row.desc}</span>
                                      <div style={{ display: 'flex', gap: '20px' }}>
                                        <span>{row.qty}</span>
                                        <span style={{ textAlign: 'right', minWidth: '60px' }}>{parseFloat(row.ext || row.price || 0).toFixed(2)}</span>
                                      </div>
                                    </div>
                                  ))}
                                  <div style={{ borderTop: '1px solid #ccc', marginTop: '5px', paddingTop: '5px', display: 'flex', justifyContent: 'flex-end', gap: '30px', fontWeight: 'normal' }}>
                                    <span>Ext. Price</span>
                                    <span style={{ textAlign: 'right', minWidth: '60px' }}>{parseFloat(repairItem.price || 0).toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })() : (
                          <div style={{ padding: '10px', display: 'flex', justifyContent: 'flex-start' }}>
                            <div className="upload-images-link" onClick={() => setShowUploadModal(true)} style={{ color: 'blue', fontWeight: 'bold', cursor: 'pointer', display: 'inline-block' }}>Upload Images</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : null}

          {/* Footer Section */}
          <div className="sales-footer-section">
            <div className="deposit-block">
              {(selectedOption === 'Repair' || selectedOption === 'Quick Repair') && (
                <>
                  <div className="summary-row" style={{ fontWeight: 'bold', fontSize: '12px' }}>
                    <span style={{ width: '150px', textAlign: 'right', paddingRight: '10px' }}>Deposit Amount</span>
                    <span>{receivedAmountStr}</span>
                  </div>
                  <div className="summary-row" style={{ fontWeight: 'bold', fontSize: '11px' }}>
                    <span style={{ width: '150px', textAlign: 'right', marginTop: '5px', paddingRight: '10px' }}>Min Deposit Amount</span>
                    <span style={{ marginTop: '5px' }}>0.00</span>
                  </div>
                </>
              )}
            </div>

            <div className="footer-actions-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#000' }}>
                {nextTransId}
              </div>
              <div className="footer-buttons" style={{ display: 'flex', gap: '15px' }}>
                {(selectedOption !== 'Void Transactions' && selectedOption !== 'Cancel Order' && selectedOption !== 'Payment On Account' && selectedOption !== 'Gift Card') && (
                  <button className="action-btn" onClick={() => setShowActionModal(true)}>Action</button>
                )}

                {(selectedOption === 'Cancel Order' || selectedOption === 'Payment (Open Order)' || selectedOption === 'Payment On Account') && (
                  <button className="action-btn" style={{ background: 'linear-gradient(to bottom, #7aa4db, #487ccc)', color: 'white', fontWeight: 'bold', border: '1px solid #3461a6' }} onClick={() => setShowPaymentModal(true)}>Payment</button>
                )}
                {(selectedOption !== 'Void Transactions' && selectedOption !== 'Cancel Order' && selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Payment On Account') && (
                  <>
                    {(selectedOption === 'Sales' || selectedOption === 'Finalize Sale') && (
                      <button className="action-btn" onClick={() => {
                        setCarePlanForIndex(null);
                        setShowCarePlanModal(true);
                      }}>Care Plan</button>
                    )}
                  </>
                )}
                {(selectedOption !== 'Cancel Order' && selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Payment On Account') && (
                  <button className="action-btn" style={(selectedOption === 'Void Transactions' || selectedOption === 'Gift Card') ? { background: 'linear-gradient(to bottom, #7aa4db, #487ccc)', color: 'white', fontWeight: 'bold', border: '1px solid #3461a6' } : {}} onClick={() => setShowPaymentModal(true)}>Payment</button>
                )}
                <button className="action-btn" style={{ background: 'linear-gradient(to bottom, #7aa4db, #487ccc)', color: 'white', fontWeight: 'bold', border: '1px solid #3461a6' }} onClick={async () => {
                  if (gridData.length === 0) {
                    alert('Cannot save an empty transaction. Please add items first.');
                    return;
                  }
                  try {
                    const res = await fetch('http://localhost:5001/api/transactions', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        customerId: customer?.id || null,
                        salesperson: salesperson || 'Unknown',
                        totalAmount: totalAmount,
                        status: 'Completed',
                        transactionType: selectedOption,
                        salesCategory: 'InHouse',
                        department: 'POS',
                        cashier: 'Diaspark Admin(ADMIN)',
                        items: gridData,
                        payments: paymentsData,
                        transNo: customTransNo
                      })
                    });
                    if (res.ok) {
                      const data = await res.json();
                      const transactionId = data.transactionId;

                      for (const item of gridData) {
                        if (item.specialOrderDetails) {
                          try {
                            await fetch('http://localhost:5001/api/special-orders', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                invoice_id: transactionId,
                                trans_no: data.transNo,
                                sku: item.sku,
                                serial: item.serial,
                                description: item.description,
                                price: item.price,
                                qty: item.qty,
                                category: item.category,
                                ...item.specialOrderDetails
                              })
                            });
                          } catch (soErr) {
                            console.error('Error saving special order:', soErr);
                          }
                        }
                      }

                      setLastSavedInvoiceId(transactionId);
                      setLastSavedTransNo(data.transNo);
                      fetchNextTransId();
                      setShowPrintModal(true);
                    } else {
                      alert('Failed to save transaction.');
                    }
                  } catch (err) {
                    console.error(err);
                    alert('Error saving transaction.');
                  }
                }}>Save</button>
                <button
                  className="action-btn new"
                  style={{ background: 'linear-gradient(to bottom, #eb6a8f, #cf315e)', color: 'white', border: '1px solid #a32247', textShadow: '1px 1px 1px #a32247', fontWeight: 'bold' }}
                  onClick={() => {
                    setCustomer(null);
                    setSalesperson('');
                    setGridData([]);
                    setPaymentsData([]);
                    fetchNextTransId();
                  }}
                >
                  New
                </button>
              </div>
            </div>

            <div className="totals-box">
              {selectedOption !== 'Cancel Order' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card' && selectedOption !== 'Payment On Account' && (
                <div className="qty-box">
                  <div className="summary-row">
                    <input type="text" className="summary-val border" value="NJ-08817" readOnly style={{ width: '80px', textAlign: 'left' }} />
                    <div className="form-input-icon gray" style={{ height: '22px' }}><BookIcon /></div>
                    <span>{taxRate.toFixed(4)}</span>
                    <input type="text" className="summary-val border" value={taxAmountStr} readOnly />
                  </div>
                  <div className="summary-row">
                    <span>{selectedOption === 'Quick Repair' || selectedOption === 'Repair' ? 'Estimated Ship Amount' : 'Ship Amount'}</span>
                    <input type="text" className="summary-val blue" value={shipAmount.toFixed(2)} readOnly />
                  </div>
                  <div className="summary-row" style={{ marginTop: '5px' }}>
                    <span>Total Qty</span>
                    <span>{gridData.length}</span>
                    <span style={{ marginLeft: '10px' }}>Amount</span>
                    <input type="text" className="summary-val" value={totalAmount} readOnly />
                  </div>
                </div>
              )}
              {selectedOption === 'Gift Certificate' && (
                <div className="qty-box" style={{ border: 'none', justifyContent: 'flex-end', paddingRight: '20px' }}>
                  <div className="summary-row" style={{ justifyContent: 'flex-end' }}>
                    <span style={{ width: '80px', textAlign: 'right' }}>0.00</span>
                  </div>
                  <div className="summary-row" style={{ marginTop: '5px', justifyContent: 'flex-end' }}>
                    <span style={{ fontWeight: 'bold' }}>Total Amount</span>
                    <span style={{ width: '80px', textAlign: 'right' }}>0.00</span>
                  </div>
                </div>
              )}
              {selectedOption === 'Gift Card' && (
                <div className="qty-box" style={{ border: 'none', justifyContent: 'flex-end', paddingRight: '20px' }}>
                  <div className="summary-row" style={{ justifyContent: 'flex-end', gap: '5px' }}>
                    <input type="text" className="summary-val border" value="NOTAX" readOnly style={{ width: '80px', textAlign: 'left', fontWeight: 'bold' }} />
                    <div className="form-input-icon gray" style={{ height: '22px' }}><BookIcon /></div>
                  </div>
                  <div className="summary-row" style={{ marginTop: '5px', justifyContent: 'flex-end' }}>
                    <span style={{ minWidth: '80px', textAlign: 'right', marginRight: '20px' }}>Ship Amount</span>
                    <span style={{ color: 'blue', fontWeight: 'bold' }}>0.00</span>
                  </div>
                  <div className="summary-row" style={{ marginTop: '5px', justifyContent: 'flex-end' }}>
                    <span style={{ minWidth: '80px', textAlign: 'right', marginRight: '20px' }}>Total Amount</span>
                    <span style={{ color: 'black' }}>0.00</span>
                  </div>
                </div>
              )}

              <div className="amount-box" style={(selectedOption === 'Cancel Order' || selectedOption === 'Payment (Open Order)' || selectedOption === 'Payment On Account' || selectedOption === 'Gift Certificate' || selectedOption === 'Gift Card') ? { width: '300px' } : {}}>
                {(selectedOption === 'Cancel Order' || selectedOption === 'Payment (Open Order)') ? (
                  <>
                    <div className="amount-row">
                      <span>Item Amount</span>
                      <span>{itemAmountStr}</span>
                    </div>
                    <div className="amount-row">
                      <span>Deposited Amount</span>
                      <span>0.00</span>
                    </div>
                    <div className="amount-row bold">
                      <span>{selectedOption === 'Cancel Order' ? 'Returned Amt' : 'Balance Amount'}</span>
                      <span>{totalAmount}</span>
                    </div>
                    <div className="amount-row bold" style={{ color: receivedAmount > 0 ? 'green' : 'black' }}>
                      <span>Received</span>
                      <span>{receivedAmountStr}</span>
                    </div>
                    <div className="amount-row bold" style={{ color: parseFloat(amountDueStr) > 0 ? 'red' : 'black' }}>
                      <span>Amount Due</span>
                      <span>{amountDueStr}</span>
                    </div>
                  </>
                ) : selectedOption === 'Payment On Account' ? (
                  <>
                    <div className="amount-row">
                      <span>Amount To Take</span>
                      <span>{totalAmount}</span>
                    </div>
                    <div className="amount-row bold" style={{ color: receivedAmount > 0 ? 'green' : 'black' }}>
                      <span>Received</span>
                      <span>{receivedAmountStr}</span>
                    </div>
                    <div className="amount-row bold" style={{ color: parseFloat(amountDueStr) > 0 ? 'red' : 'black' }}>
                      <span>Amount Due</span>
                      <span>{amountDueStr}</span>
                    </div>
                  </>
                ) : (selectedOption === 'Gift Certificate' || selectedOption === 'Gift Card') ? (
                  <>
                    <div className="amount-row">
                      <span>Item Amount</span>
                      <span>{itemAmountStr}</span>
                    </div>
                    <div className="amount-row">
                      <span>Total</span>
                      <span>{totalAmount}</span>
                    </div>
                    <div className="amount-row bold" style={{ color: receivedAmount > 0 ? 'green' : 'black' }}>
                      <span>Received</span>
                      <span>{receivedAmountStr}</span>
                    </div>
                    <div className="amount-row bold" style={{ color: parseFloat(amountDueStr) > 0 ? 'red' : 'black' }}>
                      <span>Amount Due</span>
                      <span>{amountDueStr}</span>
                    </div>
                  </>
                ) : selectedOption === 'Appraisal' ? (
                  <>
                    <div className="amount-row">
                      <span>Total Fees</span>
                      <span>{itemAmountStr}</span>
                    </div>
                    <div className="amount-row">
                      <span>Total</span>
                      <span>{totalAmount}</span>
                    </div>
                    <div className="amount-row bold" style={{ color: receivedAmount > 0 ? 'green' : 'black' }}>
                      <span>Received</span>
                      <span>{receivedAmountStr}</span>
                    </div>
                    <div className="amount-row bold" style={{ color: parseFloat(amountDueStr) > 0 ? 'red' : 'black' }}>
                      <span>Amount Due</span>
                      <span>{amountDueStr}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="amount-row">
                      <span>{selectedOption === 'Repair' || selectedOption === 'Quick Repair' ? (selectedOption === 'Quick Repair' ? 'Estimate Amount' : 'Repair Amount') : 'Item Amount'}</span>
                      {selectedOption === 'Quick Repair' ? <input type="text" className="summary-val border" value="0.00" readOnly /> : <span>{itemAmountStr}</span>}
                    </div>
                    {selectedOption === 'Quick Repair' && (
                      <div className="amount-row">
                        <span>Repair Amount</span>
                        <span>0.00</span>
                      </div>
                    )}
                    <div className="amount-row">
                      <span>{selectedOption === 'Repair' || selectedOption === 'Quick Repair' ? 'Amount' : 'Total'}</span>
                      <span>{totalAmount}</span>
                    </div>
                    <div className="amount-row bold" style={{ color: receivedAmount > 0 && (selectedOption === 'Repair' || selectedOption === 'Quick Repair') ? 'green' : 'black' }}>
                      <span>{selectedOption === 'Repair' || selectedOption === 'Quick Repair' ? 'Deposited' : 'Received'}</span>
                      <span>{receivedAmountStr}</span>
                    </div>
                    <div className="amount-row bold" style={{ color: 'black' }}>
                      <span>{selectedOption === 'Repair' || selectedOption === 'Quick Repair' ? 'Balance' : 'Amount Due'}</span>
                      <span>{amountDueStr}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {showCustomerLookup && <CustomerLookupModal onClose={() => setShowCustomerLookup(false)} onSelect={(c) => setCustomer(c)} />}
      {showShippingModal && <ShippingAddressModal customer={customer} onClose={() => setShowShippingModal(false)} onSelect={(a) => {
        setShippingAddress(a);
        setShowShippingModal(false);
      }} />}
      {showSkuLookup && <SkuLookupModal onClose={() => setShowSkuLookup(false)} onSelect={(s) => {
        setGridData([...gridData, { sku: s.sku, serial: s.sku, description: s.description, qty: 1, price: s.price || s.retailPrice || 0, wt: 0, category: 'SALE' }]);
      }} />}
      {showItemLookup && (
        <ItemLookupModal onClose={() => setShowItemLookup(false)} onSelect={(item) => {
          setGridData([...gridData, { sku: item.sku, serial: item.serial, description: item.description, qty: 1, price: item.price || item.retailPrice || 0, wt: 0, category: 'SALE' }]);
        }} />
      )}
      {showAlertsModal && (
        <AlertsModal onClose={() => setShowAlertsModal(false)} />
      )}
      {showTransactionLookup && (
        <TransactionLookupModal
          onClose={() => setShowTransactionLookup(false)}
          onSelect={(data) => {
            // Mock adding a returned item
            setGridData([...gridData, {
              sku: 'RTN-ITEM',
              description: `Return for Trans #${data.trans}`,
              qty: -1,
              price: -Math.abs(parseFloat(data.netAmt.replace(/,/g, ''))),
              category: 'RETURN'
            }]);
          }}
        />
      )}
      {showSalespersonModal && <SalespersonModal onClose={() => setShowSalespersonModal(false)} onSelect={(salespersons) => setSalesperson(salespersons.map(s => s.name.split('(')[0].trim()).join(', '))} />}

      {showActionModal && (
        <ActionModal
          onClose={() => setShowActionModal(false)}
          onActionSelect={(action) => {
            setSelectedOption(action);
          }}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          totalAmount={totalAmount}
          onClose={() => setShowPaymentModal(false)}
          onComplete={(amounts, detailedPayments = []) => {
            if (detailedPayments.length > 0) {
              setPaymentsData(detailedPayments.map(dp => ({
                type: dp.method,
                amount: parseFloat(dp.amount),
                ...dp
              })));
            } else {
              const parsedPayments = Object.entries(amounts)
                .filter(([_, amount]) => parseFloat(amount) > 0)
                .map(([type, amount]) => ({ type, amount: parseFloat(amount) }));
              setPaymentsData(parsedPayments);
            }
            setShowPaymentModal(false);
          }}
        />
      )}

      {showTradeInModal && (
        <TradeInItemDetailModal
          defaultCategory={tradeInCategory}
          onClose={() => setShowTradeInModal(false)}
          onSelect={(item) => {
            setGridData([...gridData, item]);
            setShowTradeInModal(false);
          }}
        />
      )}

      {showItemDetailModal && (
        selectedOption === 'Special Order' ? (
          <SpecialOrderDetailModal
            onClose={() => setShowItemDetailModal(false)}
            onSave={(item) => {
              setGridData([...gridData, item]);
              setShowItemDetailModal(false);
            }}
          />
        ) : selectedOption === 'Repair' ? (
          <RepairDetailModal
            onClose={() => setShowItemDetailModal(false)}
            onSave={(item) => {
              setGridData([...gridData, item]);
              setShowItemDetailModal(false);
            }}
          />
        ) : selectedOption === 'Custom Order' ? (
          <CustomOrderDetailModal
            onClose={() => setShowItemDetailModal(false)}
            onSave={(item) => {
              setGridData([...gridData, item]);
              setShowItemDetailModal(false);
            }}
          />
        ) : (
          <PriceQtyDiscountModal
            item={selectedRowIndex !== null ? gridData[selectedRowIndex] : {}}
            onClose={() => setShowItemDetailModal(false)}
            onSave={(updatedItem) => {
              if (selectedRowIndex !== null) {
                const newGrid = [...gridData];
                // Make sure to parse prices and quantities correctly
                newGrid[selectedRowIndex] = { ...updatedItem, price: parseFloat(updatedItem.retailPrice || updatedItem.price || 0) };
                setGridData(newGrid);
              }
              setShowItemDetailModal(false);
            }}
          />
        )
      )}

      {showNotesModal && (
        <NotesAttachmentModal onClose={() => setShowNotesModal(false)} />
      )}

      {showUploadModal && (
        <UploadImagesModal onClose={() => setShowUploadModal(false)} />
      )}

      {showCarePlanModal && (
        <CarePlanModal
          onClose={() => setShowCarePlanModal(false)}
          onSelect={(plan) => {
            const carePlanItem = {
              sku: 'CARE-PLAN-000',
              serial: `CARE-PLAN / CARE-PLAN-000`,
              description: 'Care Plan',
              qty: 1,
              price: plan.price,
              wt: 0,
              category: 'SERVICE',
              carePlanCode: plan.plan,
              carePlanForIndex: carePlanForIndex
            };
            if (carePlanForIndex !== null) {
              const newGrid = [...gridData];
              newGrid[carePlanForIndex].carePlan = true;
              newGrid.splice(carePlanForIndex + 1, 0, carePlanItem);
              setGridData(newGrid);
            } else {
              setGridData([...gridData, carePlanItem]);
            }
            setShowCarePlanModal(false);
          }}
        />
      )}

      {showPrintModal && (
        <PrintModal
          onClose={() => setShowPrintModal(false)}
          onNew={() => {
            // Clear screen for new transaction
            setGridData([]);
            setPaymentsData([]);
            setCustomer(null);
            setSalesperson('');
            setShowPrintModal(false);
            fetchNextTransId();
          }}
          customerEmail={customer?.email || ''}
          customerCell={customer?.phone || ''}
          transactionData={{
            invoiceId: lastSavedInvoiceId,
            transNo: lastSavedTransNo,
            transType: selectedOption,
            date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
            customer: customer,
            items: gridData,
            payments: paymentsData,
            taxAmount: taxAmountStr,
            totalAmount: totalAmount,
            salesperson: salesperson
          }}
        />
      )}

      {showCustomerComponentModal && (
        <CustomerComponentModal
          onClose={() => setShowCustomerComponentModal(false)}
        />
      )}
    </div>
  )
}

export default SalesPage
