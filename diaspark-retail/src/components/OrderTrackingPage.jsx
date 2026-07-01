import React, { useState, useEffect } from 'react'
import './OrderTrackingPage.css'

function OrderTrackingPage({ onNavigate }) {
  const [trackingData, setTrackingData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeTab, setActiveTab] = useState('Special Order');
  const [activeBottomTab, setActiveBottomTab] = useState('Payment Detail');
  
  const [filters, setFilters] = useState({
    special: '', lastName: '', firstName: '', orderDate: '', estYear: '',
    shipDate: '', cf: '', ack: '', esti: '', po: '', cnt: '', rec: '',
    st: '', co: '', salesPerson: '', rush: '', workbag: '', currentStage: '',
    stageDueDate: '', vendor: '', customerConfi: '', item: '', name: '', saleDescription: ''
  });

  // Real-time clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = (tab) => {
    const currentTab = typeof tab === 'string' ? tab : activeTab;
    fetch(`http://localhost:5001/api/orders?orderType=${encodeURIComponent(currentTab)}`)
      .then(res => res.json())
      .then(data => {
        setTrackingData(data);
        setSelectedRow(null);
      })
      .catch(err => console.error("Error fetching orders:", err));
  };

  // Fetch data initially and when activeTab changes
  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleResetFilter = () => {
    setFilters({
      special: '', lastName: '', firstName: '', orderDate: '', estYear: '',
      shipDate: '', cf: '', ack: '', esti: '', po: '', cnt: '', rec: '',
      st: '', co: '', salesPerson: '', rush: '', workbag: '', currentStage: '',
      stageDueDate: '', vendor: '', customerConfi: '', item: '', name: '', saleDescription: ''
    });
  };

  const handleExport = () => {
    if (filteredData.length === 0) return;
    const headers = Object.keys(filteredData[0]).join(',');
    const rows = filteredData.map(obj => Object.values(obj).map(v => `"${v}"`).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenOrder = () => {
    if (selectedRow === null) {
      alert("Please select an order first.");
      return;
    }
    const order = filteredData[selectedRow];
    alert(`Opening Order: ${order.special}\nCustomer: ${order.firstName} ${order.lastName}\nItem: ${order.name}`);
  };

  const handleFinalize = async () => {
    if (selectedRow === null) {
      alert("Please select an order first.");
      return;
    }
    const order = filteredData[selectedRow];
    if (order.currentStage === "CO") {
      alert(`Order ${order.special} is already finalized.`);
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${order.id}/finalize`, { method: 'PUT' });
      if (res.ok) {
        alert(`Successfully finalized Order: ${order.special}`);
        fetchData();
        setSelectedRow(null);
      } else {
        alert('Failed to finalize order');
      }
    } catch (e) {
      console.error(e);
      alert('Error finalizing order');
    }
  };

  const handlePayment = () => {
    if (selectedRow === null) {
      alert("Please select an order first.");
      return;
    }
    const order = filteredData[selectedRow];
    alert(`Opening Payment for Order: ${order.special}\nAmount: Pending`);
  };

  const filteredData = trackingData.filter(row => {
    return Object.keys(filters).every(key => {
      if (!filters[key]) return true;
      const rowVal = String(row[key] || '').toLowerCase();
      return rowVal.includes(filters[key].toLowerCase());
    });
  });

  const columns = [
    { key: 'special', label: 'Special #', width: '80px' },
    { key: 'lastName', label: 'Last Name', width: '80px' },
    { key: 'firstName', label: 'First Name', width: '80px' },
    { key: 'orderDate', label: 'Order Date', width: '80px' },
    { key: 'estYear', label: 'estir', width: '50px' },
    { key: 'shipDate', label: 'Ship Date', width: '80px' },
    { key: 'cf', label: 'CF', width: '40px' },
    { key: 'ack', label: 'ACK', width: '40px' },
    { key: 'esti', label: 'ESTI', width: '40px' },
    { key: 'po', label: 'PO', width: '40px' },
    { key: 'cnt', label: 'CNT', width: '40px' },
    { key: 'rec', label: 'REC', width: '40px' },
    { key: 'st', label: 'ST', width: '40px' },
    { key: 'co', label: 'CO', width: '40px' },
    { key: 'salesPerson', label: 'SalesPerso', width: '100px' },
    { key: 'rush', label: 'Rush', width: '40px' },
    { key: 'workbag', label: 'Workbag #', width: '80px' },
    { key: 'currentStage', label: 'Current Stage', width: '100px' },
    { key: 'stageDueDate', label: 'Stage Due D', width: '80px' },
    { key: 'vendor', label: 'Vendor #', width: '80px' },
    { key: 'customerConfi', label: 'Customer Confi', width: '100px' },
    { key: 'item', label: 'Item #', width: '100px' },
    { key: 'name', label: 'Name', width: '200px' },
    { key: 'saleDescription', label: 'Sale Description', width: '250px' }
  ];

  return (
    <div className="tracking-page-container">
      {/* Header */}
      <div className="tracking-header">
        <div className="tracking-header-left">
          <div className="home-btn-container">
            <button className="home-btn" onClick={() => onNavigate('dashboard')}>
              <img src="/icons/home-icon.png" alt="Home" style={{ width: '20px', height: '20px', opacity: 0 }} />
              <div style={{ position: 'absolute', top: '10px', left: '15px' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="orange" strokeWidth="2" fill="none">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
            </button>
          </div>
          <div className="custom-dropdown-container">
            <button className="custom-dropdown-button">
              <span className="custom-dropdown-button-text">Order Tracking</span>
              <span className="custom-dropdown-arrow">▼</span>
            </button>
          </div>
        </div>
        <div className="tracking-header-right">
          <span>{currentTime.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' })} {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          <span style={{ marginLeft: '15px', marginRight: '15px' }}>Demosparkle - Edison - POS</span>
          <button className="help-btn" onClick={() => alert('Opening Help Documentation...')}>Help</button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="tracking-main-tabs">
        <div className={`tracking-tab ${activeTab === 'Special Order' ? 'active' : ''}`} onClick={() => setActiveTab('Special Order')} style={{ cursor: 'pointer' }}>Special Order</div>
        <div className="tracking-tab-separator">|</div>
        <div className={`tracking-tab ${activeTab === 'Repair Order' ? 'active' : ''}`} onClick={() => setActiveTab('Repair Order')} style={{ cursor: 'pointer' }}>Repair Order</div>
        <div className="tracking-tab-separator">|</div>
        <div className={`tracking-tab ${activeTab === 'Layaway Order' ? 'active' : ''}`} onClick={() => setActiveTab('Layaway Order')} style={{ cursor: 'pointer' }}>Layaway Order</div>
        <div className="tracking-tab-separator">|</div>
        <div className={`tracking-tab ${activeTab === 'Custom Order' ? 'active' : ''}`} onClick={() => setActiveTab('Custom Order')} style={{ cursor: 'pointer' }}>Custom Order</div>
      </div>

      {/* Action Buttons */}
      <div className="tracking-action-bar">
        <button className="tracking-btn" onClick={() => fetchData(activeTab)}>Refresh</button>
        <button className="tracking-btn" onClick={handleResetFilter}>Reset Filter</button>
        <button className="tracking-btn" onClick={handleExport}>Export</button>
        <button className="tracking-btn" onClick={handleOpenOrder}>Open Order</button>
        <button className="tracking-btn" onClick={handleFinalize}>Finalize</button>
        <button className="tracking-btn" onClick={handlePayment}>Payment(Open order)</button>
      </div>

      {/* Data Grid */}
      <div className="tracking-grid-section">
        <div className="tracking-grid-inner" style={{ minWidth: '2050px' }}>
          <div className="tracking-grid-header">
            {columns.map(col => (
              <div key={col.key} style={{ width: col.width, minWidth: col.width, flexShrink: 0 }}>{col.label}</div>
            ))}
          </div>
          <div className="tracking-grid-filter-row">
            {columns.map(col => (
              <div key={col.key} style={{ width: col.width, minWidth: col.width, flexShrink: 0 }}>
                <input 
                  type="text" 
                  value={filters[col.key]} 
                  onChange={(e) => handleFilterChange(col.key, e.target.value)} 
                />
              </div>
            ))}
          </div>
          <div className="tracking-grid-body">
            {filteredData.map((row, index) => (
              <div key={index} 
                   className="tracking-grid-row" 
                   style={{ backgroundColor: selectedRow === index ? '#b8def9' : 'transparent', cursor: 'pointer' }}
                   onClick={() => setSelectedRow(index)}>
                {columns.map(col => (
                  <div key={col.key} style={{ width: col.width, minWidth: col.width, flexShrink: 0, textAlign: ['cnt','rec','st','co','rush','cf','ack','esti','po'].includes(col.key) ? 'center' : 'left' }}>
                    {row[col.key] || ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Detail Section */}
      <div className="tracking-payment-section">
        <div className="tracking-payment-header-tabs">
          <div className={`tracking-payment-tab ${activeBottomTab === 'Payment Detail' ? 'active' : ''}`} onClick={() => setActiveBottomTab('Payment Detail')}>Payment Detail</div>
          <div className={`tracking-payment-tab ${activeBottomTab === 'Activity' ? 'active' : ''}`} onClick={() => setActiveBottomTab('Activity')}>Activity</div>
          <div className={`tracking-payment-tab ${activeBottomTab === 'Labor/Parts' ? 'active' : ''}`} onClick={() => setActiveBottomTab('Labor/Parts')}>Labor/Parts</div>
        </div>
        <div className="tracking-payment-grid">
          {activeBottomTab === 'Payment Detail' && (
            <>
              <div className="tracking-payment-grid-header">
                <div style={{ flex: 1 }}>Type #</div>
                <div style={{ flex: 1 }}>Paid Amt</div>
                <div style={{ flex: 1 }}>Payment Type #</div>
                <div style={{ flex: 1 }}>Check Type</div>
                <div style={{ flex: 1 }}>Credit Card Type</div>
                <div style={{ flex: 1 }}>Last Four Digit</div>
                <div style={{ flex: 1 }}>Transaction #</div>
                <div style={{ flex: 1 }}>Cashier #</div>
                <div style={{ flex: 1 }}>Terminal #</div>
              </div>
              <div className="tracking-payment-grid-body">
                {selectedRow !== null && (
                  <div className="tracking-grid-row" style={{ borderBottom: 'none' }}>
                    <div style={{ flex: 1, padding: '0 5px' }}>1</div>
                    <div style={{ flex: 1, padding: '0 5px' }}>$500.00</div>
                    <div style={{ flex: 1, padding: '0 5px' }}>Credit Card</div>
                    <div style={{ flex: 1, padding: '0 5px' }}>-</div>
                    <div style={{ flex: 1, padding: '0 5px' }}>Visa</div>
                    <div style={{ flex: 1, padding: '0 5px' }}>1234</div>
                    <div style={{ flex: 1, padding: '0 5px' }}>TRX-98765</div>
                    <div style={{ flex: 1, padding: '0 5px' }}>{filteredData[selectedRow]?.salesPerson || 'ADMIN'}</div>
                    <div style={{ flex: 1, padding: '0 5px' }}>TERM-1</div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeBottomTab === 'Activity' && (
            <>
              <div className="tracking-payment-grid-header">
                <div style={{ flex: 1 }}>Date</div>
                <div style={{ flex: 2 }}>Activity Type</div>
                <div style={{ flex: 3 }}>Notes</div>
                <div style={{ flex: 1 }}>User</div>
              </div>
              <div className="tracking-payment-grid-body">
                {selectedRow !== null && (
                  <div className="tracking-grid-row" style={{ borderBottom: 'none' }}>
                    <div style={{ flex: 1, padding: '0 5px' }}>{filteredData[selectedRow]?.orderDate || 'N/A'}</div>
                    <div style={{ flex: 2, padding: '0 5px' }}>Order Created</div>
                    <div style={{ flex: 3, padding: '0 5px' }}>Initial order setup and pending payment.</div>
                    <div style={{ flex: 1, padding: '0 5px' }}>{filteredData[selectedRow]?.salesPerson || 'ADMIN'}</div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeBottomTab === 'Labor/Parts' && (
            <>
              <div className="tracking-payment-grid-header">
                <div style={{ flex: 1 }}>Item #</div>
                <div style={{ flex: 2 }}>Description</div>
                <div style={{ flex: 1 }}>Qty</div>
                <div style={{ flex: 1 }}>Cost</div>
              </div>
              <div className="tracking-payment-grid-body">
                {selectedRow !== null && (
                  <div className="tracking-grid-row" style={{ borderBottom: 'none' }}>
                    <div style={{ flex: 1, padding: '0 5px' }}>{filteredData[selectedRow]?.item || 'N/A'}</div>
                    <div style={{ flex: 2, padding: '0 5px' }}>{filteredData[selectedRow]?.saleDescription || 'Labor & Parts'}</div>
                    <div style={{ flex: 1, padding: '0 5px' }}>1</div>
                    <div style={{ flex: 1, padding: '0 5px' }}>$0.00</div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderTrackingPage
