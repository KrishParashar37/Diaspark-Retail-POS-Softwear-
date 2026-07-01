import React, { useState } from 'react';
import './CustomOrderDetailModal.css';
import StyleSkuLookupModal from './StyleSkuLookupModal';
import VendorLookupModal from './VendorLookupModal';
import StoneCodeLookupModal from './StoneCodeLookupModal';
import CustomerComponentModal from './CustomerComponentModal';

function CustomOrderDetailModal({ onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('Components');
  const [showStyleLookup, setShowStyleLookup] = useState(false);
  const [showVendorLookup, setShowVendorLookup] = useState(false);
  const [vendorId, setVendorId] = useState('');
  const [showStoneLookupRowId, setShowStoneLookupRowId] = useState(null);
  const [showCustomerComponentModal, setShowCustomerComponentModal] = useState(false);
  
  const [metalRows, setMetalRows] = useState([ { id: 1 }, { id: 2 } ]);
  const [diamondRows, setDiamondRows] = useState([
    { id: 1, code: '', type: '', color: '' },
    { id: 2, code: '', type: '', color: '' },
    { id: 3, code: '', type: '', color: '' },
    { id: 4, code: '', type: '', color: '' },
    { id: 5, code: '', type: '', color: '' }
  ]);

  const updateDiamondRow = (id, field, value) => {
    setDiamondRows(rows => rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeMetalRow = (id) => setMetalRows(metalRows.filter(r => r.id !== id));
  const removeDiamondRow = (id) => setDiamondRows(diamondRows.filter(r => r.id !== id));

  return (
    <div className="custom-detail-overlay">
      <div className="custom-detail-modal">
        <div className="custom-detail-header">
          <span>Serial #/Order Detail</span>
          <button className="custom-detail-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="custom-detail-body">
          {/* Top Form Section */}
          <div className="custom-top-section">
            <div className="custom-form-col">
               <div className="custom-form-row">
                 <label>Workflow Type</label>
                 <select defaultValue="Custom">
                   <option value="Custom">Custom</option>
                   <option value="Inventory/ Finished">Inventory/ Finished</option>
                   <option value="On Hand Inventory">On Hand Inventory</option>
                   <option value="Non-Inventory Item">Non-Inventory Item</option>
                 </select>
               </div>
               <div className="custom-form-row">
                 <label>Item Type</label>
                 <select defaultValue="Jewelry">
                   <option value="Jewelry">Jewelry</option>
                   <option value="Watch">Watch</option>
                   <option value="Giftware">Giftware</option>
                   <option value="Diamond">Diamond</option>
                   <option value="Metal">Metal</option>
                 </select>
                 <label style={{marginLeft: '20px'}}>Vendor #</label>
                 <div className="input-with-icon">
                    <input type="text" style={{width: '120px'}} value={vendorId} onChange={(e) => setVendorId(e.target.value)} />
                    <button className="book-icon-btn" onClick={() => setShowVendorLookup(true)}>
                      <svg viewBox="0 0 16 16" width="12" height="12">
                        <path d="M2 3 L8 2 L14 3 L14 13 L8 12 L2 13 Z" fill="white" stroke="#333" strokeWidth="1" />
                        <line x1="8" y1="2" x2="8" y2="12" stroke="#333" strokeWidth="1" />
                      </svg>
                    </button>
                 </div>
               </div>
               <div className="custom-form-row">
                 <label>Style/ SKU #</label>
                 <div className="input-with-icon">
                    <input type="text" style={{width: '120px'}} />
                    <button className="book-icon-btn" onClick={() => setShowStyleLookup(true)}>
                      <svg viewBox="0 0 16 16" width="12" height="12">
                        <path d="M2 3 L8 2 L14 3 L14 13 L8 12 L2 13 Z" fill="white" stroke="#333" strokeWidth="1" />
                        <line x1="8" y1="2" x2="8" y2="12" stroke="#333" strokeWidth="1" />
                      </svg>
                    </button>
                 </div>
                 <label style={{marginLeft: '20px', minWidth: '30px'}}>Size</label>
                 <select style={{width: '80px'}}>
                   <option></option>
                   {Array.from({ length: 30 }, (_, i) => 3.5 + i * 0.25).map(size => (
                     <option key={size} value={size}>{size}</option>
                   ))}
                 </select>
                 <label style={{marginLeft: '10px', minWidth: '40px'}}>Gender</label>
                 <select style={{width: '80px'}}>
                   <option></option>
                   <option value="Female">Female</option>
                   <option value="Male">Male</option>
                   <option value="NA">NA</option>
                   <option value="Unisex">Unisex</option>
                 </select>
               </div>
               <div className="custom-form-row">
                 <label>Description</label>
                 <input type="text" style={{width: '425px'}} />
                 <label style={{marginLeft: '10px', minWidth: '20px'}}>Qty</label>
                 <input type="text" defaultValue="1" style={{width: '30px', textAlign: 'center'}} />
               </div>
               <div className="custom-form-row">
                 <label>Sale Description</label>
                 <input type="text" style={{width: '425px'}} />
               </div>
            </div>
            
            <div className="custom-form-col-right">
              <div className="custom-form-row right-align">
                 <label>Retail Price</label>
                 <input type="text" style={{width: '100px'}} />
              </div>
              <div className="custom-form-row right-align" style={{justifyContent: 'flex-end', gap: '10px'}}>
                 <label style={{display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal'}}><input type="radio" name="priceType" /> Final Price</label>
                 <label style={{display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal'}}><input type="radio" name="priceType" defaultChecked /> Estimate</label>
              </div>
              <div className="custom-form-row right-align">
                 <label>From</label>
                 <input type="text" style={{width: '80px'}} />
                 <label style={{marginLeft: '10px'}}>To</label>
                 <input type="text" style={{width: '80px'}} />
              </div>
              <div className="custom-form-row right-align" style={{marginTop: '10px'}}>
                 <label>Item Price</label>
                 <input type="text" style={{width: '100px'}} />
              </div>
              <div style={{ marginTop: '15px', textAlign: 'right' }}>
                 <span onClick={() => setShowCustomerComponentModal(true)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}>Customer Component</span>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="custom-tabs-container">
            <div className={`custom-tab ${activeTab === 'Components' ? 'active' : ''}`} onClick={() => setActiveTab('Components')}>Components</div>
            <div className={`custom-tab ${activeTab === 'Other' ? 'active' : ''}`} onClick={() => setActiveTab('Other')}>Other</div>
          </div>
          
          <div className="custom-tab-content">
            {activeTab === 'Other' && (
              <div className="components-tab">
                 <div className="metal-section">
                   <div className="metal-header">
                     <div style={{flex: 2}}>Metal Type</div>
                     <div style={{flex: 1}}>Karatage</div>
                     <div style={{flex: 1}}>Color</div>
                     <div style={{flex: 1}}>Wt</div>
                     <div style={{flex: 2}}>Remarks</div>
                     <div style={{width: '20px'}}></div>
                   </div>
                   {/* Metal Rows */}
                   {metalRows.map((row) => (
                     <div className="metal-row" key={row.id}>
                       <select style={{flex: 2}}>
                         <option></option>
                         <option value="10 KT">10 KT</option>
                         <option value="18 KT">18 KT</option>
                         <option value="22 KT">22 KT</option>
                         <option value="24 KT">24 KT</option>
                         <option value="GOLD">GOLD</option>
                         <option value="PALLIDIUM">PALLIDIUM</option>
                         <option value="PLATINUM">PLATINUM</option>
                         <option value="STERLING SILVER(9">STERLING SILVER(9...</option>
                         <option value="TWO TONE">TWO TONE</option>
                         <option value="14 KT">14 KT</option>
                         <option value="23KT">23KT</option>
                       </select>
                       <select style={{flex: 1}}>
                         <option></option>
                         <option value="14K">14K</option>
                         <option value="18K">18K</option>
                         <option value="20K">20K</option>
                       </select>
                       <select style={{flex: 1}}>
                         <option></option>
                         <option value="BLACK GOLD">BLACK GOLD</option>
                         <option value="GREEN GOLD">GREEN GOLD</option>
                         <option value="ROSE GOLD">ROSE GOLD</option>
                         <option value="WHITE GOLD">WHITE GOLD</option>
                         <option value="YELLOW GOLD">YELLOW GOLD</option>
                       </select>
                       <input type="text" style={{flex: 1, textAlign: 'right'}} />
                       <input type="text" style={{flex: 2}} />
                       <div className="minus-icon" onClick={() => removeMetalRow(row.id)}>-</div>
                     </div>
                   ))}
                 </div>
                 
                 <div className="diamond-section">
                   <div style={{fontWeight: 'bold', marginBottom: '5px'}}>Diamond/Stone</div>
                   <div className="diamond-header">
                     <div style={{width: '70px'}}>Code</div>
                     <div style={{flex: 1}}>Type</div>
                     <div style={{flex: 1}}>Color</div>
                     <div style={{width: '30px'}}>Qty</div>
                     <div style={{width: '40px'}}>Size</div>
                     <div style={{flex: 1}}>Shape</div>
                     <div style={{flex: 1}}>Shade</div>
                     <div style={{width: '40px'}}>Ct Wt</div>
                     <div style={{width: '50px'}}>Total Wt</div>
                     <div style={{flex: 1}}>Clarity</div>
                     <div style={{flex: 1}}>Position</div>
                     <div style={{flex: 1.5}}>Remarks</div>
                     <div style={{width: '20px'}}></div>
                   </div>
                   {/* Diamond Rows */}
                   {diamondRows.map((row, index) => (
                     <div className="diamond-row" key={row.id}>
                       <div className="input-with-icon" style={{width: '70px'}}>
                         <input type="text" style={{width: '45px'}} value={row.code} onChange={(e) => updateDiamondRow(row.id, 'code', e.target.value)} />
                         <button className="book-icon-btn small" onClick={() => setShowStoneLookupRowId(row.id)}>
                           <svg viewBox="0 0 16 16" width="10" height="10">
                             <path d="M2 3 L8 2 L14 3 L14 13 L8 12 L2 13 Z" fill="white" stroke="#333" strokeWidth="1" />
                             <line x1="8" y1="2" x2="8" y2="12" stroke="#333" strokeWidth="1" />
                           </svg>
                         </button>
                       </div>
                       <select style={{flex: 1}} value={row.type} onChange={(e) => updateDiamondRow(row.id, 'type', e.target.value)}>
                         <option></option>
                         <option value="Alexandrite">Alexandrite</option>
                         <option value="Amber">Amber</option>
                         <option value="Amethyst">Amethyst</option>
                         <option value="AMTY">AMTY</option>
                         <option value="AQMN">AQMN</option>
                         <option value="Aquamarine">Aquamarine</option>
                         <option value="AXDT">AXDT</option>
                         <option value="Bloodstone">Bloodstone</option>
                         <option value="Carnelian">Carnelian</option>
                         <option value="Citrine">Citrine</option>
                         <option value="CTRN">CTRN</option>
                         <option value="DIAM">DIAM</option>
                         <option value="Diamond">Diamond</option>
                         <option value="Emerald">Emerald</option>
                         <option value="EMRL">EMRL</option>
                         <option value="Garnet">Garnet</option>
                         <option value="Iolite">Iolite</option>
                         <option value="Jade">Jade</option>
                         <option value="Jasper">Jasper</option>
                         <option value="Moonstone">Moonstone</option>
                         <option value="Onyx">Onyx</option>
                         <option value="Pearl">Pearl</option>
                         <option value="Ruby">Ruby</option>
                         <option value="Sapphire">Sapphire</option>
                         <option value="Spinel">Spinel</option>
                         <option value="Topaz">Topaz</option>
                         <option value="TOPZ">TOPZ</option>
                         <option value="TOU">TOU</option>
                         <option value="TSAV">TSAV</option>
                         <option value="Turquoise">Turquoise</option>
                       </select>
                       <select style={{flex: 1}} value={row.color} onChange={(e) => updateDiamondRow(row.id, 'color', e.target.value)}>
                         <option></option>
                         <option value="B">B</option>
                         <option value="Black">Black</option>
                         <option value="Blue">Blue</option>
                         <option value="D">D</option>
                         <option value="E">E</option>
                         <option value="F">F</option>
                         <option value="FANCY">FANCY</option>
                         <option value="FG">FG</option>
                         <option value="G">G</option>
                         <option value="Green">Green</option>
                         <option value="H">H</option>
                         <option value="I">I</option>
                         <option value="J">J</option>
                         <option value="K">K</option>
                         <option value="NCLR">NCLR</option>
                         <option value="P">P</option>
                         <option value="Purple">Purple</option>
                         <option value="Red">Red</option>
                         <option value="TT">TT</option>
                         <option value="W">W</option>
                         <option value="White">White</option>
                         <option value="WYR">WYR</option>
                         <option value="Y">Y</option>
                         <option value="Yellow">Yellow</option>
                       </select>
                       <input type="text" style={{width: '30px', textAlign: 'right'}} defaultValue={index === 0 ? "0" : ""} />
                       <input type="text" style={{width: '40px'}} />
                       <select style={{flex: 1}}>
                         <option></option>
                         <option value="Asscher">Asscher</option>
                         <option value="Bagutte">Bagutte</option>
                         <option value="Cushion">Cushion</option>
                         <option value="Emerald">Emerald</option>
                         <option value="Heart">Heart</option>
                         <option value="Marquise">Marquise</option>
                         <option value="Mixed Shape">Mixed Shape</option>
                         <option value="Oval">Oval</option>
                         <option value="Pear">Pear</option>
                         <option value="Princess">Princess</option>
                         <option value="Radiant">Radiant</option>
                         <option value="Round">Round</option>
                         <option value="Vilandi Diamond">Vilandi Diamond</option>
                       </select>
                       <select style={{flex: 1}}>
                         <option></option>
                         <option value="Black">Black</option>
                         <option value="Blue">Blue</option>
                         <option value="Brown">Brown</option>
                         <option value="Green">Green</option>
                         <option value="Yellow">Yellow</option>
                       </select>
                       <input type="text" style={{width: '40px', textAlign: 'right'}} defaultValue={index === 0 ? "0.00" : ""} />
                       <input type="text" style={{width: '50px', textAlign: 'right'}} defaultValue={index === 0 ? "0.00" : ""} />
                       <select style={{flex: 1}}>
                         <option></option>
                         <option value="FL">FL</option>
                         <option value="IF">IF</option>
                         <option value="SI1">SI1</option>
                         <option value="SI2">SI2</option>
                         <option value="VS1">VS1</option>
                         <option value="VS2">VS2</option>
                         <option value="VVS1">VVS1</option>
                         <option value="VVS2">VVS2</option>
                       </select>
                       <select style={{flex: 1}}>
                         <option></option>
                         <option value="Center Stone">Center Stone</option>
                         <option value="Halo">Halo</option>
                         <option value="Pave">Pave</option>
                         <option value="Side Stone">Side Stone</option>
                         <option value="Trillions">Trillions</option>
                       </select>
                       <input type="text" style={{flex: 1.5}} />
                       <div className="minus-icon" onClick={() => removeDiamondRow(row.id)}>-</div>
                     </div>
                   ))}
                 </div>
              </div>
            )}
            {activeTab === 'Components' && (
              <div className="other-tab">
                <div className="other-tab-col">
                  <div className="other-field">
                    <label>Center Stone</label>
                    <textarea></textarea>
                  </div>
                  <div className="other-field">
                    <label>Other Stone</label>
                    <textarea></textarea>
                  </div>
                </div>
                <div className="other-tab-col">
                  <div className="other-field">
                    <label>Customer Requirement</label>
                    <textarea style={{height: '100px'}}></textarea>
                  </div>
                  <div className="other-field">
                    <label>Order Instruction</label>
                    <textarea style={{height: '100px'}}></textarea>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="custom-detail-footer">
          <button className="custom-action-btn primary" onClick={() => {
            if (onSave) {
              onSave({ sku: "CUSTOM-001", serial: "CUST-SN", description: "Custom Order", price: 0, qty: 1, category: "Custom" });
            } else {
              onClose();
            }
          }}>OK</button>
          <button className="custom-action-btn secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
      {showStyleLookup && <StyleSkuLookupModal onClose={() => setShowStyleLookup(false)} />}
      {showVendorLookup && <VendorLookupModal onClose={() => setShowVendorLookup(false)} onSelect={(vendor) => setVendorId(vendor.code)} />}
      {showStoneLookupRowId !== null && (
        <StoneCodeLookupModal 
          onClose={() => setShowStoneLookupRowId(null)} 
          onSelect={(stone) => {
            updateDiamondRow(showStoneLookupRowId, 'code', stone.code);
            updateDiamondRow(showStoneLookupRowId, 'type', stone.stoneType);
            updateDiamondRow(showStoneLookupRowId, 'color', stone.color);
            setShowStoneLookupRowId(null);
          }} 
        />
      )}
      
      {showCustomerComponentModal && (
        <CustomerComponentModal 
          onClose={() => setShowCustomerComponentModal(false)}
        />
      )}
    </div>
  );
}

export default CustomOrderDetailModal;
