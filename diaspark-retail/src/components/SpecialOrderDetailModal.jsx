import React, { useState } from 'react';
import './SpecialOrderDetailModal.css';
import ItemCategoryLookupModal from './ItemCategoryLookupModal';
import StyleSkuLookupModal from './StyleSkuLookupModal';
import ItemLookupModal from './ItemLookupModal';
import VendorLookupModal from './VendorLookupModal';
import DiamondStoneLookupModal from './DiamondStoneLookupModal';
import LaborLookupModal from './LaborLookupModal';
import CustomerComponentModal from './CustomerComponentModal';

function SpecialOrderDetailModal({ onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('Item Info');
  const [subTab, setSubTab] = useState('Enter Components');
  const [showCustomerComponentModal, setShowCustomerComponentModal] = useState(false);

  // Form State
  const [workflowType, setWorkflowType] = useState('');
  const [itemType, setItemType] = useState('Jewelry');
  const [itemSubType, setItemSubType] = useState('Giftware');
  const [category, setCategory] = useState('');
  const [vendor, setVendor] = useState('');
  const [vendorStyle, setVendorStyle] = useState('');
  const [likeStyle, setLikeStyle] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');

  const [workDescription, setWorkDescription] = useState('');
  const [customerRequirement, setCustomerRequirement] = useState('');
  const [centerStone, setCenterStone] = useState('');
  const [otherStone, setOtherStone] = useState('');
  const [retailPrice, setRetailPrice] = useState('');

  const [qty, setQty] = useState('1');
  const [quote, setQuote] = useState('');
  const [total, setTotal] = useState('');

  const [components, setComponents] = useState([
    { id: 1, serial: '', diamond: '', labor: '', retail: '', discount: '', price: '', qty: '1', total: '' }
  ]);

  const [gridRow, setGridRow] = useState({
    serialNumber: '',
    diamondStone: '',
    laborOther: '',
    vendor: '',
    vendorStyle: '',
    itemType: 'Watch',
    itemSerial: '',
    description: '',
    retailPrice: '',
    unitDiscount: '0.00',
    price: '',
    qty: '1',
    totalPrice: ''
  });

  const handleGridChange = (field, value) => {
    setGridRow(prev => {
      const next = { ...prev, [field]: value };
      
      // If retail price or discount changes, recalculate price and total
      if (['retailPrice', 'unitDiscount'].includes(field)) {
        const retail = parseFloat(next.retailPrice) || 0;
        const disc = parseFloat(next.unitDiscount) || 0;
        const price = retail - disc;
        next.price = price.toFixed(2);
        
        const qty = parseFloat(next.qty) || 1;
        next.totalPrice = (price * qty).toFixed(2);
      } 
      // If price or quantity changes, recalculate only total
      else if (['price', 'qty'].includes(field)) {
        const price = parseFloat(next.price) || 0;
        const qty = parseFloat(next.qty) || 1;
        next.totalPrice = (price * qty).toFixed(2);
      }
      
      return next;
    });
  };

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showStyleSkuModal, setShowStyleSkuModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showDiamondStoneModal, setShowDiamondStoneModal] = useState(false);
  const [showLaborModal, setShowLaborModal] = useState(false);
  const [showGridFeatures, setShowGridFeatures] = useState(true);

  // Checkbox States
  const [poChecked, setPoChecked] = useState(false);
  const [rvChecked, setRvChecked] = useState(false);
  const [invnChecked, setInvnChecked] = useState(false);

  // Price Breakup States
  const [retailCompPrice, setRetailCompPrice] = useState('0.00');
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [discountAmt, setDiscountAmt] = useState('');

  const handleRetailCompPriceChange = (e) => {
    const val = e.target.value;
    setRetailCompPrice(val);
    if (discountPercent && !isNaN(val) && !isNaN(discountPercent)) {
      setDiscountAmt((parseFloat(val) * parseFloat(discountPercent) / 100).toFixed(2));
    }
  };

  const handleDiscountPercentChange = (e) => {
    const val = e.target.value;
    setDiscountPercent(val);
    if (val !== '' && !isNaN(val) && !isNaN(retailCompPrice)) {
      setDiscountAmt((parseFloat(retailCompPrice) * parseFloat(val) / 100).toFixed(2));
    } else if (val === '') {
      setDiscountAmt('');
    }
  };

  const handleDiscountAmtChange = (e) => {
    const val = e.target.value;
    setDiscountAmt(val);
    if (val !== '' && !isNaN(val) && parseFloat(retailCompPrice) > 0) {
      setDiscountPercent(((parseFloat(val) / parseFloat(retailCompPrice)) * 100).toFixed(2));
    } else if (val === '') {
      setDiscountPercent('');
    }
  };

  const currentDiscount = isNaN(parseFloat(discountAmt)) ? 0 : parseFloat(discountAmt);
  const currentRetail = isNaN(parseFloat(retailCompPrice)) ? 0 : parseFloat(retailCompPrice);
  const finalPriceCalc = (currentRetail - currentDiscount).toFixed(2);
  const displayRetail = currentRetail.toFixed(2);
  const displayDiscount = currentDiscount.toFixed(2);

  const handleSave = () => {
    if (onSave) {
      onSave({
        sku: likeStyle || "SO-001",
        serial: "SO-SN",
        description: description || "Special Order",
        price: parseFloat(total || quote || retailPrice || 0),
        qty: parseInt(qty || 1),
        category: category || "Special Order",
        // Extended special order details:
        specialOrderDetails: {
          metal_type: '', // To be filled if added to state
          metal_color: '',
          purity: '',
          finish: '',
          ring_size: size,
          vendor: vendor,
          special_instructions: workDescription,
          status: 'Pending',
          components: components.map(c => ({
            type: c.diamond ? 'Diamond' : (c.labor ? 'Labor' : 'Other'),
            desc: c.diamond || c.labor,
            qty: c.qty,
            price: c.price,
            total_price: c.total
          }))
        }
      });
    } else {
      onClose();
    }
  };

  return (
    <div className="special-detail-modal-overlay">
      <div className="special-detail-modal">
        <div className="special-detail-header">
          <span>Serial #/Order Detail</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="special-detail-body">
          {/* Main Tabs */}
          <div className="main-tabs">
            {['Item Info', 'Status', 'Activity', 'Upload'].map(tab => (
              <div
                key={tab}
                className={`main-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>

          {activeTab === 'Item Info' && (
            <div className="special-content-section">
              {/* Left and Middle Columns Container */}
              <div style={{ width: '480px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  {/* Left Column */}
                  <div className="left-column" style={{ width: '230px' }}>
                    <div className="form-row">
                      <label>Workflow Type</label>
                      <select value={workflowType} onChange={e => setWorkflowType(e.target.value)}>
                        <option value=""></option>
                        <option value="Custom">Custom</option>
                        <option value="Inventory/ Finished Item">Inventory/ Finished Item</option>
                        <option value="On Hand Inventory">On Hand Inventory</option>
                        <option value="Non-Inventory Item/ Non Unique">Non-Inventory Item/ Non Unique</option>
                      </select>
                    </div>

                    <div style={{ marginTop: '5px', marginBottom: '10px', display: 'flex', flexDirection: 'column' }}>
                      <div className="radio-group" style={{ marginBottom: itemType === 'Other' ? '5px' : '0' }}>
                        <label><input type="radio" name="type" checked={itemType === 'Jewelry'} onChange={() => setItemType('Jewelry')} /> Jewelry</label>
                        {workflowType !== 'Custom' && (
                          <label><input type="radio" name="type" checked={itemType === 'Watch'} onChange={() => setItemType('Watch')} /> Watch</label>
                        )}
                        <label><input type="radio" name="type" checked={itemType === 'Other'} onChange={() => setItemType('Other')} /> Other</label>
                        <label><input type="radio" name="type" checked={itemType === 'Metal'} onChange={() => setItemType('Metal')} /> Metal</label>
                      </div>
                      
                      {itemType === 'Other' && (
                        <div className="radio-group" style={{ marginTop: '0', marginBottom: '0' }}>
                          <label><input type="radio" name="subType" checked={itemSubType === 'Giftware'} onChange={() => setItemSubType('Giftware')} /> Giftware</label>
                          <label><input type="radio" name="subType" checked={itemSubType === 'Accessories'} onChange={() => setItemSubType('Accessories')} /> Accessories</label>
                        </div>
                      )}
                    </div>

                    <div className="form-row">
                      <label>Category #</label>
                      <input type="text" value={category} onChange={e => setCategory(e.target.value)} />
                      <span className="book-icon" onClick={() => setShowCategoryModal(true)}>📖</span>
                    </div>

                    <div className="form-row" style={{ marginTop: '10px' }}>
                      <label>Size</label>
                      <select value={size} onChange={e => setSize(e.target.value)} style={{ width: '60px' }}>
                        <option></option>
                        <option value="3.5">3.5</option>
                        <option value="3.75">3.75</option>
                        <option value="4">4</option>
                        <option value="4.25">4.25</option>
                        <option value="4.5">4.5</option>
                        <option value="4.75">4.75</option>
                        <option value="5">5</option>
                        <option value="5.25">5.25</option>
                        <option value="5.5">5.5</option>
                        <option value="5.75">5.75</option>
                        <option value="6">6</option>
                        <option value="6.5">6.5</option>
                        <option value="7">7</option>
                      </select>
                    </div>

                  </div>

                  {/* Middle/Vendor Column */}
                  <div className="left-column" style={{ width: '230px' }}>
                    {workflowType === 'Inventory/ Finished Item' && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '45px' }}>
                        <div className="form-row" style={{ justifyContent: 'flex-end' }}>
                          <label style={{ width: 'auto', marginRight: '5px' }}>Vendor #</label>
                          <input type="text" style={{ width: '100px' }} />
                          <span className="book-icon" onClick={() => setShowVendorModal(true)}>📖</span>
                        </div>
                        <div className="form-row" style={{ justifyContent: 'flex-end', marginTop: '25px' }}>
                          <label style={{ width: 'auto', marginRight: '5px' }}>Vendor Style#</label>
                          <input type="text" style={{ width: '100px' }} />
                          <span className="magnify-icon" style={{ cursor: 'pointer', fontSize: '14px', marginLeft: '2px' }}>🔍</span>
                        </div>
                        <div className="form-row" style={{ justifyContent: 'flex-end', marginTop: '5px' }}>
                          <label style={{ width: 'auto', marginRight: '5px' }}>Like Style/ SKU #</label>
                          <input type="text" value={likeStyle} onChange={e => setLikeStyle(e.target.value)} style={{ width: '100px' }} />
                          <span className="book-icon" onClick={() => setShowStyleSkuModal(true)}>📖</span>
                        </div>
                      </div>
                    )}

                    {(workflowType === '' || workflowType === 'On Hand Inventory' || workflowType === 'Non-Inventory Item/ Non Unique') && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '100px' }}>
                        <div className="form-row" style={{ justifyContent: 'flex-end' }}>
                          <label style={{ width: 'auto', marginRight: '5px' }}>Like Style/ SKU #</label>
                          <input type="text" value={likeStyle} onChange={e => setLikeStyle(e.target.value)} style={{ width: '100px' }} />
                          <span className="book-icon" onClick={() => setShowStyleSkuModal(true)}>📖</span>
                        </div>
                        <div className="form-row" style={{ justifyContent: 'flex-end', marginTop: '5px' }}>
                          <label style={{ width: 'auto', marginRight: '5px' }}>Serial #</label>
                          <input type="text" style={{ width: '100px' }} />
                          <span className="book-icon" onClick={() => setShowItemModal(true)}>📖</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Item Description spans both columns */}
                <div className="form-row" style={{ marginTop: '10px' }}>
                  <label>Item Description</label>
                  <input type="text" value={description} onChange={e => setDescription(e.target.value)} style={{ flex: 1, maxWidth: 'none' }} />
                </div>
              </div>

              {/* Right Column */}
              <div className="right-column" style={{ width: '430px' }}>
                <div className="form-row">
                  <label>Work Description</label>
                  <textarea value={workDescription} onChange={e => setWorkDescription(e.target.value)} style={{ width: '270px', height: '40px', resize: 'none', border: '1px solid #a9a9a9', padding: '3px', borderRadius: '2px', fontFamily: 'Arial, sans-serif' }}></textarea>
                </div>

                <div className="form-row">
                  <label>Customer Requirement</label>
                  <textarea value={customerRequirement} onChange={e => setCustomerRequirement(e.target.value)} style={{ width: '270px', height: '40px', resize: 'none', border: '1px solid #a9a9a9', padding: '3px', borderRadius: '2px', fontFamily: 'Arial, sans-serif' }}></textarea>
                </div>

                <div className="form-row" style={{ gap: '5px', marginTop: '25px' }}>
                  <label>Center Stone</label>
                  <input type="text" style={{ width: '90px' }} value={centerStone} onChange={e => setCenterStone(e.target.value)} />
                  <label style={{ width: 'auto', minWidth: '60px', textAlign: 'right' }}>Other Stone</label>
                  <input type="text" style={{ width: '115px' }} value={otherStone} onChange={e => setOtherStone(e.target.value)} />
                </div>

                <div className="form-row" style={{ marginTop: '5px' }}>
                  <label>Retail Price</label>
                  <input type="text" style={{ width: '150px' }} value={retailPrice} onChange={e => {
                    const val = e.target.value;
                    setRetailPrice(val);
                    setQuote(val);
                    const parsedQty = parseInt(qty) || 1;
                    const parsedQuote = parseFloat(val) || 0;
                    setTotal((parsedQty * parsedQuote).toFixed(2));
                  }} />
                </div>

                <div className="form-row calc-row" style={{ marginTop: '5px', gap: '5px' }}>
                  <label>Quantity</label>
                  <input type="text" value={qty} onChange={e => {
                    const val = e.target.value;
                    setQty(val);
                    const parsedQty = parseInt(val) || 1;
                    const parsedQuote = parseFloat(quote) || 0;
                    setTotal((parsedQty * parsedQuote).toFixed(2));
                  }} style={{ width: '30px', flex: 'none', textAlign: 'center' }} />
                  <span style={{ width: '10px', textAlign: 'center' }}>X</span>
                  <label style={{ width: '35px', textAlign: 'right' }}>Quote</label>
                  <input type="text" value={quote} onChange={e => {
                    const val = e.target.value;
                    setQuote(val);
                    const parsedQty = parseInt(qty) || 1;
                    const parsedQuote = parseFloat(val) || 0;
                    setTotal((parsedQty * parsedQuote).toFixed(2));
                  }} style={{ width: '60px', flex: 'none' }} />
                  <span style={{ width: '10px', textAlign: 'center' }}>=</span>
                  <label style={{ width: '35px', textAlign: 'right', fontWeight: 'bold' }}>Total</label>
                  <input type="text" value={total} onChange={e => setTotal(e.target.value)} style={{ width: '65px', flex: 'none' }} />
                </div>
                <div style={{ marginTop: '15px', textAlign: 'right' }}>
                   <span onClick={() => setShowCustomerComponentModal(true)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}>Customer Component</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Status' && (
            <div className="special-content-section" style={{ flexDirection: 'column', minHeight: '235px', padding: '10px 15px' }}>
              <div className="status-actions" style={{ display: 'flex', gap: '10px', marginBottom: '5px', paddingLeft: '5px' }}>
                <span style={{ color: '#487ccc', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>+</span>
                <span style={{ color: '#cc3333', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>-</span>
              </div>
              
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontWeight: 'bold', fontSize: '11px' }}>Vendor #</label>
                  <input type="text" style={{ width: '150px', border: '1px solid #a9a9a9', padding: '3px' }} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontWeight: 'bold', fontSize: '11px' }}>Item/Ref #</label>
                  <input type="text" placeholder="Item/Ref #" disabled style={{ width: '150px', border: '1px solid #a9a9a9', padding: '3px', backgroundColor: '#f5f5f5', fontStyle: 'italic', color: '#999' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontWeight: 'bold', fontSize: '11px' }}>Work</label>
                  <select style={{ width: '100px', border: '1px solid #a9a9a9', padding: '3px' }}>
                    <option></option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', width: '80px' }}>
                  <label style={{ fontWeight: 'bold', fontSize: '11px' }}>Sent</label>
                  <input type="checkbox" style={{ margin: '0' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', width: '80px' }}>
                  <label style={{ fontWeight: 'bold', fontSize: '11px' }}>Completed</label>
                  <input type="checkbox" style={{ margin: '0' }} />
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button className="custom-action-btn primary" style={{ width: 'auto', padding: '5px 20px', fontSize: '12px' }}>Order Placed To Vendor</button>
                <button className="custom-action-btn primary" style={{ width: 'auto', padding: '5px 20px', fontSize: '12px' }}>Receive At Store</button>
              </div>
            </div>
          )}

          {activeTab === 'Activity' && (
            <React.Fragment>
            <div className="special-content-section" style={{ flexDirection: 'column', height: '235px', padding: '0', backgroundColor: '#fff', border: '1px solid #ccc' }}>
              <div style={{ display: 'flex', backgroundColor: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>
                <div style={{ width: '150px', padding: '5px 10px', borderRight: '1px solid #ccc' }}>Date</div>
                <div style={{ width: '200px', padding: '5px 10px', borderRight: '1px solid #ccc' }}>Stage</div>
                <div style={{ flex: 1, padding: '5px 10px' }}>Remarks</div>
              </div>
              
              {/* Empty rows */}
              {[1, 2, 3, 4, 5, 6].map((row, idx) => (
                <div key={row} style={{ display: 'flex', borderBottom: '1px solid #eee', backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9', minHeight: '30px' }}>
                  <div style={{ width: '150px', borderRight: '1px solid #eee' }}></div>
                  <div style={{ width: '200px', borderRight: '1px solid #eee' }}></div>
                  <div style={{ flex: 1 }}></div>
                </div>
              ))}
              
              <div style={{ marginTop: 'auto', borderTop: '1px solid #ccc', padding: '2px', backgroundColor: '#e2e2e2', display: 'flex' }}>
                <button style={{ width: '18px', height: '18px', padding: 0, fontSize: '10px', border: '1px solid #a9a9a9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '2px' }}>◀</button>
              </div>
            </div>
            {/* Blank spacer to maintain modal height without rendering components */}
            <div style={{ minHeight: '165px' }}></div>
            </React.Fragment>
          )}

          {activeTab === 'Upload' && (
            <div className="special-content-section" style={{ flexDirection: 'column', flex: 1, minHeight: '410px', padding: '0', backgroundColor: '#e2e2e2', display: 'flex' }}>
              <div style={{ padding: '5px 10px', fontWeight: 'bold', fontSize: '11px', color: '#333' }}>Notes & Attachment</div>
              
              <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ width: '60px' }}>Subject</label>
                  <input type="text" style={{ flex: 1, border: '1px solid #a9a9a9', padding: '3px' }} />
                  <button className="custom-action-btn primary" style={{ marginLeft: '10px', padding: '3px 15px', height: '22px' }}>Browse...</button>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <label style={{ width: '60px', marginTop: '3px' }}>Notes</label>
                  <textarea style={{ flex: 1, height: '60px', border: '1px solid #a9a9a9', padding: '3px', resize: 'none' }}></textarea>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '5px' }}>
                  <button className="custom-action-btn primary" style={{ width: '80px', padding: '3px' }}>Add</button>
                  <button className="custom-action-btn primary" style={{ width: '80px', padding: '3px' }}>Reset</button>
                </div>
              </div>
              
              <div style={{ marginTop: '10px', borderTop: '1px solid #ccc', backgroundColor: '#fff', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', backgroundColor: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>
                  <div style={{ width: '120px', padding: '5px 10px', borderRight: '1px solid #ccc' }}>Date</div>
                  <div style={{ width: '120px', padding: '5px 10px', borderRight: '1px solid #ccc' }}>User #</div>
                  <div style={{ width: '200px', padding: '5px 10px', borderRight: '1px solid #ccc' }}>File Name</div>
                  <div style={{ flex: 1, padding: '5px 10px', borderRight: '1px solid #ccc' }}>Notes</div>
                  <div style={{ width: '80px', padding: '5px 10px', textAlign: 'center' }}>Delete</div>
                </div>
                
                {/* Sample row */}
                <div style={{ display: 'flex', borderBottom: '1px solid #eee', alignItems: 'center', backgroundColor: '#fff' }}>
                  <div style={{ width: '120px', padding: '5px 10px', borderRight: '1px solid #eee' }}>06-08-2026 12:56</div>
                  <div style={{ width: '120px', padding: '5px 10px', borderRight: '1px solid #eee' }}>ADMIN</div>
                  <div style={{ width: '200px', padding: '5px 10px', borderRight: '1px solid #eee', color: 'blue', fontWeight: 'bold', cursor: 'pointer' }}>View</div>
                  <div style={{ flex: 1, padding: '2px 10px', borderRight: '1px solid #eee' }}>
                    <input type="text" style={{ width: '100%', border: '1px solid #e0e0e0', padding: '3px', backgroundColor: '#f5f5f5' }} />
                  </div>
                  <div style={{ width: '80px', padding: '5px 10px', textAlign: 'center' }}>
                    <span style={{ color: '#cc3333', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px' }}>-</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Section */}
          {activeTab !== 'Activity' && activeTab !== 'Upload' && (
            <div className="bottom-section">
            <div className="sub-tabs">
              {['Enter Components', 'Price Breakup'].map(tab => (
                <div
                  key={tab}
                  className={`sub-tab ${subTab === tab ? 'active' : ''}`}
                  onClick={() => setSubTab(tab)}
                >
                  {tab}
                </div>
              ))}
            </div>

            {subTab === 'Enter Components' && (
              <div className="components-container" style={{ padding: '10px', display: 'flex', flexDirection: 'column', height: '250px', overflowY: 'scroll' }}>
                <div style={{ opacity: workflowType === 'Custom' ? 1 : 0.5, pointerEvents: workflowType === 'Custom' ? 'auto' : 'none', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label style={{ fontWeight: 'bold', fontSize: '11px' }}>Serial #</label>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input type="text" style={{ width: '130px', padding: '3px' }} value={gridRow.serialNumber} onChange={(e) => handleGridChange('serialNumber', e.target.value)} />
                        <span className="book-icon" style={{ marginLeft: '5px' }} onClick={() => setShowItemModal(true)}>📖</span>
                      </div>
                      <div style={{ display: 'flex', gap: '15px', marginTop: '2px' }}>
                        <button style={{ fontWeight: 'bold', color: '#1a3b70', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', padding: 0 }} onClick={() => setShowGridFeatures(true)}>+</button>
                        <button style={{ fontWeight: 'bold', color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', padding: 0 }} onClick={() => setShowGridFeatures(false)}>-</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label style={{ fontWeight: 'bold', fontSize: '11px' }}>Diamond/Stone</label>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input type="text" style={{ width: '200px', padding: '3px' }} value={gridRow.diamondStone} onChange={(e) => handleGridChange('diamondStone', e.target.value)} />
                        <span className="book-icon" style={{ marginLeft: '5px' }} onClick={() => setShowDiamondStoneModal(true)}>📖</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label style={{ fontWeight: 'bold', fontSize: '11px' }}>Labor & Other</label>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input type="text" style={{ width: '150px', padding: '3px' }} value={gridRow.laborOther} onChange={(e) => handleGridChange('laborOther', e.target.value)} />
                        <span className="book-icon" style={{ marginLeft: '5px' }} onClick={() => setShowLaborModal(true)}>📖</span>
                      </div>
                    </div>
                  </div>

                  {/* Data Grid row */}
                  {showGridFeatures && (
                    <div style={{ display: 'flex', marginTop: '5px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', gap: '5px', marginBottom: '2px' }}>
                        <div style={{ width: '100px', fontSize: '10px', fontWeight: 'bold' }}>Vendor/Style #</div>
                        <div style={{ width: '120px', fontSize: '10px', fontWeight: 'bold' }}>Item Type/Serial #</div>
                        <div style={{ width: '250px', fontSize: '10px', fontWeight: 'bold' }}>Description</div>
                        <div style={{ width: '70px', fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>Retail Price</div>
                        <div style={{ width: '70px', fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>Unit Discount</div>
                        <div style={{ width: '70px', fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>Price</div>
                        <div style={{ width: '40px', fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>Qty</div>
                        <div style={{ width: '80px', fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>Total Price</div>
                      </div>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input type="text" style={{ width: '80px', padding: '2px' }} value={gridRow.vendor} onChange={(e) => handleGridChange('vendor', e.target.value)} />
                            <span className="book-icon" style={{ marginLeft: '2px' }} onClick={() => setShowVendorModal(true)}>📖</span>
                          </div>
                          <input type="text" placeholder="Vendor Style #" style={{ width: '100px', padding: '2px', backgroundColor: '#fff', border: '1px solid #ccc', fontSize: '10px' }} value={gridRow.vendorStyle} onChange={(e) => handleGridChange('vendorStyle', e.target.value)} />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <select style={{ width: '120px', padding: '2px', height: '22px' }} value={gridRow.itemType} onChange={(e) => handleGridChange('itemType', e.target.value)}>
                            <option></option>
                            <option value="Diamond">Diamond</option>
                            <option value="Giftware">Giftware</option>
                            <option value="Gold">Gold</option>
                            <option value="Jewelry">Jewelry</option>
                            <option value="Labor">Labor</option>
                            <option value="Watch">Watch</option>
                          </select>
                          <input type="text" placeholder="Serial #" style={{ width: '120px', padding: '2px', backgroundColor: '#fff', border: '1px solid #ccc', fontSize: '10px' }} value={gridRow.itemSerial} onChange={(e) => handleGridChange('itemSerial', e.target.value)} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <textarea style={{ width: '250px', height: '46px', resize: 'none', padding: '2px', border: '1px solid #a9a9a9' }} value={gridRow.description} onChange={(e) => handleGridChange('description', e.target.value)}></textarea>
                        </div>

                        <input type="text" style={{ width: '70px', height: '22px', padding: '2px', border: '1px solid #a9a9a9' }} value={gridRow.retailPrice} onChange={(e) => handleGridChange('retailPrice', e.target.value)} />
                        <input type="text" style={{ width: '70px', height: '22px', padding: '2px', border: '1px solid #a9a9a9' }} value={gridRow.unitDiscount} onChange={(e) => handleGridChange('unitDiscount', e.target.value)} />
                        <input type="text" style={{ width: '70px', height: '22px', padding: '2px', border: '1px solid #a9a9a9' }} value={gridRow.price} onChange={(e) => handleGridChange('price', e.target.value)} />
                        <input type="text" style={{ width: '40px', height: '22px', padding: '2px', backgroundColor: '#fff', border: '1px solid #a9a9a9', textAlign: 'center' }} value={gridRow.qty} onChange={(e) => handleGridChange('qty', e.target.value)} />
                        <input type="text" style={{ width: '80px', height: '22px', padding: '2px', backgroundColor: '#e2e2e2', border: '1px solid #a9a9a9' }} value={gridRow.totalPrice} disabled />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px', gap: '5px', paddingTop: '15px' }}>
                      <div style={{ display: 'flex', gap: '5px', fontSize: '10px' }}>
                        <label><input type="checkbox" checked={poChecked} onChange={e => setPoChecked(e.target.checked)} /> PO</label>
                        <label><input type="checkbox" checked={rvChecked} onChange={e => setRvChecked(e.target.checked)} /> RV</label>
                        <label><input type="checkbox" checked={invnChecked} onChange={e => setInvnChecked(e.target.checked)} /> INVN</label>
                      </div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="custom-action-btn primary" style={{ width: '50px', padding: '2px', height: '22px', fontSize: '11px' }} onClick={() => setPoChecked(true)}>PO</button>
                        <button className="custom-action-btn primary" style={{ width: '60px', padding: '2px', height: '22px', fontSize: '11px' }} onClick={() => { setRvChecked(true); setInvnChecked(true); }}>Receive</button>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            )}
            {subTab === 'Price Breakup' && (
              <div className="components-container" style={{ padding: '15px 10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {/* Header row 1 */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ width: '80px' }}></div>
                  <div style={{ width: '100px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold' }}>Serial #</div>
                  <div style={{ width: '100px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold' }}>Component</div>
                  <div style={{ width: '80px' }}></div>
                  <div style={{ width: '100px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold' }}>Total</div>
                </div>

                {/* Retail Price Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '80px', textAlign: 'right', fontSize: '11px', fontWeight: 'bold' }}>Retail Price #</div>
                  <input type="text" style={{ width: '100px', backgroundColor: '#e2e2e2', border: '1px solid #a9a9a9', padding: '3px' }} disabled />
                  <input type="text" value={retailCompPrice} onChange={handleRetailCompPriceChange} style={{ width: '100px', border: '1px solid #a9a9a9', textAlign: 'right', padding: '3px' }} />
                  <div style={{ width: '80px' }}></div>
                  <input type="text" value={displayRetail} style={{ width: '100px', backgroundColor: '#e2e2e2', border: '1px solid #a9a9a9', textAlign: 'right', padding: '3px' }} disabled />
                </div>

                {/* Discount Headers Row */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <div style={{ width: '80px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold' }}>Discount Code</div>
                  <div style={{ width: '100px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold' }}>Discount(%)</div>
                  <div style={{ width: '100px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold' }}>Discount</div>
                </div>

                {/* Discount Inputs Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="text" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} style={{ width: '80px', border: '1px solid #a9a9a9', padding: '3px' }} />
                  <input type="text" value={discountPercent} onChange={handleDiscountPercentChange} style={{ width: '100px', border: '1px solid #a9a9a9', padding: '3px' }} />
                  <input type="text" value={discountAmt} onChange={handleDiscountAmtChange} style={{ width: '100px', border: '1px solid #a9a9a9', padding: '3px' }} />
                  <input type="text" value={displayDiscount} style={{ width: '80px', backgroundColor: '#e2e2e2', border: '1px solid #a9a9a9', textAlign: 'right', padding: '3px' }} disabled />
                  <input type="text" value={displayDiscount} style={{ width: '100px', backgroundColor: '#e2e2e2', border: '1px solid #a9a9a9', textAlign: 'right', padding: '3px' }} disabled />
                </div>

                {/* Separator line */}
                <div style={{ borderBottom: '1px solid #a9a9a9', width: '510px', marginTop: '5px', marginBottom: '5px' }}></div>

                {/* Final Price Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '190px', textAlign: 'right', fontSize: '11px', fontWeight: 'bold' }}>Final Price</div>
                  <input type="text" style={{ width: '100px', backgroundColor: '#e2e2e2', border: '1px solid #a9a9a9', textAlign: 'right', padding: '3px' }} defaultValue="0.00" disabled />
                  <input type="text" value={finalPriceCalc} style={{ width: '80px', backgroundColor: '#e2e2e2', border: '1px solid #a9a9a9', textAlign: 'right', padding: '3px' }} disabled />
                  <input type="text" value={finalPriceCalc} style={{ width: '100px', backgroundColor: '#e2e2e2', border: '1px solid #a9a9a9', textAlign: 'right', fontWeight: 'bold', padding: '3px' }} disabled />
                </div>
              </div>
            )}
          </div>
          )}
        </div>

        <div className="special-detail-footer">
          <button className="custom-action-btn primary" onClick={handleSave}>OK</button>
          <button className="custom-action-btn secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>

      { showCategoryModal && (
        <ItemCategoryLookupModal
          onClose={() => setShowCategoryModal(false)}
          onSelect={(cat) => {
            setCategory(cat.code);
          }}
        />
      )}

      {
        showStyleSkuModal && (
          <StyleSkuLookupModal
            onClose={() => setShowStyleSkuModal(false)}
            onSelect={(item) => {
              setLikeStyle(item.sku);
            }}
          />
        )
      }

      {
        showItemModal && (
          <ItemLookupModal
            onClose={() => setShowItemModal(false)}
            onSelect={(item) => {
              setDescription(item.description);
              setRetailPrice(item.retailPrice);
              handleGridChange('serialNumber', item.serial);
              handleGridChange('itemSerial', item.serial);
              handleGridChange('description', item.description);
              handleGridChange('retailPrice', item.retailPrice);
              handleGridChange('vendor', item.vendor);
              handleGridChange('vendorStyle', item.sku); // often sku is used for vendor style
              handleGridChange('itemType', item.category);
            }}
          />
        )
      }

      {
        showVendorModal && (
          <VendorLookupModal
            onClose={() => setShowVendorModal(false)}
            onSelect={(v) => {
              setVendor(v.code);
              handleGridChange('vendor', v.name);
            }}
          />
        )
      }

      {showDiamondStoneModal && (
        <DiamondStoneLookupModal
          onClose={() => setShowDiamondStoneModal(false)}
          onSelect={(item) => {
            handleGridChange('diamondStone', item.lot || item.sku);
            handleGridChange('description', item.name);
            handleGridChange('retailPrice', item.price);
            handleGridChange('itemType', item.type);
          }}
        />
      )}

      {showLaborModal && (
        <LaborLookupModal 
          onClose={() => setShowLaborModal(false)} 
          onSelect={(item) => {
            handleGridChange('laborOther', item.laborNum);
            handleGridChange('description', item.desc);
            handleGridChange('retailPrice', item.price);
            handleGridChange('itemType', 'Labor');
          }}
        />
      )}
    </div >
  );
}

export default SpecialOrderDetailModal;
