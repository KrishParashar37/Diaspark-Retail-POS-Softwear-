import React, { useState } from 'react';
import CategoryLookupModal from './CategoryLookupModal';
import VendorLookupModal from './VendorLookupModal';
import LaborGroupLookupModal from './LaborGroupLookupModal';
import LaborCategoryLookupModal from './LaborCategoryLookupModal';
import LaborLookupModal from './LaborLookupModal';
import './RepairDetailModal.css';

function BookIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12">
      <path d="M2 3 L8 2 L14 3 L14 13 L8 12 L2 13 Z" fill="white" stroke="#333" strokeWidth="1" />
      <line x1="8" y1="2" x2="8" y2="12" stroke="#333" strokeWidth="1" />
    </svg>
  );
}

function RepairDetailModal({ onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('Merchandise Description');
  const [selectedItemType, setSelectedItemType] = useState('Jewelry');
  
  const [repairRows, setRepairRows] = useState([
    { id: 1, group: 'JR', category: 'JR', laborNo: 'JR', desc: 'Jewelry Repair', retail: '0.00', disc: '0.00', price: '0.00', qty: '1', ext: '0.00', taxable: true }
  ]);
  const [salesPersons, setSalesPersons] = useState([]);
  const [appraiserList, setAppraiserList] = useState([]);

  const [metalColor, setMetalColor] = useState('');
  const [metalType, setMetalType] = useState('');
  const [repairInstruction, setRepairInstruction] = useState('Jewelry Repair');
  const [brand, setBrand] = useState('');

  const [stoneDetails, setStoneDetails] = useState({
    center: { Color: '', Shape: '', Type: '', Quantity: '', 'MM Size': '', Carat: '', Damage: '', 'Grade Report #': '' },
    side1: { Color: '', Shape: '', Type: '', Quantity: '', 'MM Size': '', Carat: '', Damage: '' },
    side2: { Color: '', Shape: '', Type: '', Quantity: '', 'MM Size': '', Carat: '', Damage: '' }
  });
  
  const [itemDescription, setItemDescription] = useState('Care Plan');

  const handleStoneChange = (stoneType, field, value) => {
    setStoneDetails(prev => ({
      ...prev,
      [stoneType]: {
        ...prev[stoneType],
        [field]: value
      }
    }));
  };

  const [itemCondition, setItemCondition] = useState('');
  const [watchGender, setWatchGender] = useState('');
  const [watchMovement, setWatchMovement] = useState('');
  const [watchMetal, setWatchMetal] = useState('');
  const [watchBandType, setWatchBandType] = useState('');
  const [watchSerial, setWatchSerial] = useState('');
  const [watchCaseSize, setWatchCaseSize] = useState('');

  React.useEffect(() => {
    if (selectedItemType !== 'Watch') {
      let descLines = [];
      if (brand) {
        descLines.push(`Brand: ${brand}`);
      }
      
      const formatStone = (s, prefix) => {
        let parts = [];
        if (s.Color) parts.push(`Color: ${s.Color}`);
        if (s.Shape) parts.push(`Shape: ${s.Shape}`);
        if (s.Type) parts.push(`Type: ${s.Type}`);
        if (s.Quantity) parts.push(`Qty: ${s.Quantity}`);
        if (s['MM Size']) parts.push(`MM Size: ${s['MM Size']}`);
        if (s.Carat) parts.push(`Carat: ${s.Carat}`);
        if (parts.length > 0) return `${prefix}: ${parts.join(', ')}`;
        return null;
      };

      const cDesc = formatStone(stoneDetails.center, 'Center Stone');
      if (cDesc) descLines.push(cDesc);
      
      const s1Desc = formatStone(stoneDetails.side1, 'Side Stone 1');
      if (s1Desc) descLines.push(s1Desc);
      
      const s2Desc = formatStone(stoneDetails.side2, 'Side Stone 2');
      if (s2Desc) descLines.push(s2Desc);

      if (descLines.length > 0) {
        setItemDescription(descLines.join('\n'));
      } else {
        setItemDescription('');
      }
      
      let condLines = [];
      if (stoneDetails.center.Damage) condLines.push(`Center Stone: Damage: ${stoneDetails.center.Damage}`);
      if (stoneDetails.side1.Damage) condLines.push(`Side Stone 1: Damage: ${stoneDetails.side1.Damage}`);
      if (stoneDetails.side2.Damage) condLines.push(`Side Stone 2: Damage: ${stoneDetails.side2.Damage}`);
      
      if (condLines.length > 0) {
        setItemCondition(condLines.join('\n'));
      } else {
        setItemCondition('');
      }
    } else {
      let descParts = [];
      if (watchGender) descParts.push(watchGender);
      if (watchMetal) descParts.push(watchMetal);
      if (watchMovement) descParts.push(watchMovement);
      if (watchCaseSize) descParts.push(watchCaseSize);
      if (watchBandType) descParts.push(watchBandType);
      
      let finalDesc = descParts.join(' ');
      if (finalDesc) {
        setItemDescription(finalDesc);
      } else {
        setItemDescription(brand ? brand : '');
      }
    }
  }, [stoneDetails, brand, selectedItemType, watchGender, watchMetal, watchMovement, watchCaseSize, watchBandType]);

  React.useEffect(() => {
    const newInstruction = repairRows.map(row => row.desc).filter(Boolean).join(', ');
    if (newInstruction) {
      setRepairInstruction(newInstruction);
    } else {
      setRepairInstruction('');
    }
  }, [repairRows]);

  React.useEffect(() => {
    fetch('http://localhost:5001/api/salespersons')
      .then(res => res.json())
      .then(data => setSalesPersons(data))
      .catch(err => console.error(err));

    fetch('http://localhost:5001/api/appraisers')
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => setAppraiserList(data))
      .catch(err => console.error(err));
  }, []);

  const handleAddRow = () => {
    setRepairRows([...repairRows, {
      id: Date.now(), group: '', category: '', laborNo: '', desc: '', retail: '0.00', disc: '0.00', price: '0.00', qty: '1', ext: '0.00', taxable: true
    }]);
  };

  const handleRemoveRow = () => {
    if (repairRows.length > 1) {
      setRepairRows(repairRows.slice(0, -1));
    }
  };

  const typeOptions = ['', 'Color Stone', 'Diamond', 'Other', 'Black', 'Blue', 'Brown', 'Colorless', 'Green', 'Multi Color', 'Orange', 'Purple', 'Red', 'White', 'Yellow'];
  const shapeOptions = ['', 'Asscher', 'Bagutte', 'Cushion', 'Emerald', 'Heart', 'Marquise', 'Mixed Shape', 'Oval', 'Pear', 'Princess', 'Radiant', 'Round', 'Vilandi Diamond'];

  const genderOptions = ['', 'Gents', 'Ladies', 'Other'];
  const watchMetalOptions = ['', 'Ceramic', 'Electroplated', 'Other', 'Rose Gold', 'Stainless Steel', 'Titanium', 'White Gold', 'Yellow Gold'];
  const caseSizeOptions = ['', 'Large (41mm+)', 'Medium (31-40mm)', 'Small (20-30mm)'];
  const movementOptions = ['', 'Automatic', 'Manual', 'Other', 'Quartz'];
  const bandTypeOptions = ['', 'Bracelet', 'Strap'];
  const movementConditionOptions = ['', 'Moisture/water', 'Not Running', 'Running', 'Runs fast', 'Runs slow'];
  const crystalOptions = ['', 'Chipped', 'Cracked', 'Scratched'];
  const dialOptions = ['', 'Damaged', 'Dirty/Spotted', 'Discolored/Worn', 'Tritium Inactive'];
  const braceletOptions = ['', 'Damaged', 'Worn/scratches'];
  const handsOptions = ['', 'Bent', 'Missing', 'Rusted'];
  const bandStrapOptions = ['', 'Damaged', 'Worn'];
  const linksOptions = ['', 'Damaged', 'Worn/scratches'];
  const caseOptions = ['', 'Damaged', 'Dented', 'Scratched'];
  const caseBackOptions = ['', 'Damaged', 'Dented', 'Scratched'];
  const bezelOptions = ['', 'Dented/damaged', 'Worn/Scratched'];
  const crownOptions = ['', 'Damaged', 'Worn/scratches'];

  const [categoryNo, setCategoryNo] = useState('');
  const [showCategoryLookup, setShowCategoryLookup] = useState(false);
  const [vendorNo, setVendorNo] = useState('');
  const [showVendorLookup, setShowVendorLookup] = useState(false);
  
  const [showLaborGroupLookup, setShowLaborGroupLookup] = useState(false);
  const [showLaborCategoryLookup, setShowLaborCategoryLookup] = useState(false);
  const [showLaborLookup, setShowLaborLookup] = useState(false);
  const [activeLaborRowId, setActiveLaborRowId] = useState(null);
  
  const [reasonSelections, setReasonSelections] = useState({});

  const handleSave = () => {
    let itemAmt = 0;
    repairRows.forEach(row => {
      itemAmt += parseFloat(row.price || 0) * parseInt(row.qty || 1);
    });

    const payload = {
      order_no: `REP-${Date.now()}`,
      customer_id: 1,
      salesperson: 'DEMO',
      item_amt: itemAmt,
      tax_amt: itemAmt * 0.08,
      net_amt: itemAmt * 1.08,
      paid_amt: 0,
      balance_amt: itemAmt * 1.08,
      special_instructions: 'Jewelry/Watch Repair',
      vendor: vendorNo,
      repairRows: repairRows.map(row => ({
        laborNo: row.laborNo,
        desc: row.desc,
        qty: row.qty,
        price: row.price,
        ext: parseFloat(row.price || 0) * parseInt(row.qty || 1),
        category: categoryNo || row.category
      }))
    };

    // We no longer call fetch('/api/repairs') here.
    // The repair will be saved by SalesPage.jsx via /api/transactions
    // which now handles 'Repair' transaction types and inserts into pos_orders.
    if (onSave) {
      onSave({ 
        sku: payload.order_no, 
        serial: "REPAIR", 
        description: repairRows.map(r => r.desc).join(', ') || "Repair Service", 
        price: payload.net_amt, 
        qty: 1, 
        category: "Repair",
        repairDetails: {
          itemType: selectedItemType,
          category: categoryNo,
          metalType: metalType,
          metalColor: metalColor,
          brand: brand,
          stoneDetails: stoneDetails,
          itemDescription: itemDescription,
          itemCondition: itemCondition,
          repairInstruction: repairInstruction,
          repairRows: repairRows,
          watchGender: watchGender,
          watchMovement: watchMovement,
          watchMetal: watchMetal,
          watchBandType: watchBandType,
          watchSerial: watchSerial,
          watchCaseSize: watchCaseSize
        }
      });
    } else {
      onClose();
    }
  };

  return (
    <div className="repair-detail-modal-overlay">
      <div className="repair-detail-modal-content">
        <div className="repair-detail-header">
          <span>Repair Detail</span>
          <button className="repair-detail-close-btn" onClick={onClose}>x</button>
        </div>
        
        <div className="repair-detail-body">
          <div className="repair-top-section">
            <div className="repair-top-left">
              <div className="repair-radio-group">
                <label><input type="radio" name="itemType" checked={selectedItemType === 'Jewelry'} onChange={() => setSelectedItemType('Jewelry')} /> Jewelry</label>
                <label><input type="radio" name="itemType" checked={selectedItemType === 'Watch'} onChange={() => setSelectedItemType('Watch')} /> Watch</label>
                <label><input type="radio" name="itemType" checked={selectedItemType === 'Giftware'} onChange={() => setSelectedItemType('Giftware')} /> Giftware</label>
                <label><input type="radio" name="itemType" checked={selectedItemType === 'Diamond'} onChange={() => setSelectedItemType('Diamond')} /> Diamond</label>
                <label><input type="radio" name="itemType" checked={selectedItemType === 'Metal'} onChange={() => setSelectedItemType('Metal')} /> Metal</label>
              </div>

              <div className="repair-form-row">
                <label>Metal Color</label>
                <select className="repair-select" style={{ width: '100px' }} value={metalColor} onChange={e => setMetalColor(e.target.value)}>
                  <option></option>
                  <option>OTHER</option>
                  <option>PINK</option>
                  <option>TWO-TONE</option>
                  <option>WHITE</option>
                  <option>YELLOW</option>
                </select>
                <label style={{ minWidth: '60px' }}>Metal Type</label>
                <select className="repair-select" style={{ width: '100px' }} value={metalType} onChange={e => setMetalType(e.target.value)}>
                  <option></option>
                  <option>10KT</option>
                  <option>14KT</option>
                  <option>18KT</option>
                  <option>PLAT</option>
                  <option>Silver</option>
                </select>
                <label style={{ minWidth: '60px' }}>Category #</label>
                <input type="text" className="repair-input" style={{ width: '100px' }} value={categoryNo} onChange={(e) => setCategoryNo(e.target.value)} />
                <div className="repair-icon-btn" onClick={() => setShowCategoryLookup(true)} style={{cursor: 'pointer'}}><BookIcon /></div>
              </div>

              <div className="repair-form-row">
                <label>Vendor #</label>
                <input type="text" className="repair-input" style={{ width: '100px' }} value={vendorNo} onChange={(e) => setVendorNo(e.target.value)} />
                <div className="repair-icon-btn" onClick={() => setShowVendorLookup(true)} style={{cursor: 'pointer'}}><BookIcon /></div>
                <label style={{ minWidth: '70px' }}>Vendor Style#</label>
                <input type="text" className="repair-input" style={{ width: '120px' }} />
                <label style={{ minWidth: '80px' }}>Declared Value*</label>
                <input type="text" className="repair-input" style={{ width: '70px' }} />
              </div>

              <div className="repair-form-row" style={{ marginTop: '5px' }}>
                <label style={{ minWidth: '50px', visibility: 'hidden' }}>Spacer</label>
                <label style={{ minWidth: 'auto', marginRight: '10px' }}><input type="radio" name="estimateType" defaultChecked /> Estimate</label>
                <label style={{ minWidth: 'auto', marginRight: '5px' }}>From</label>
                <input type="text" className="repair-input" style={{ width: '60px' }} />
                <label style={{ minWidth: 'auto', marginRight: '5px', marginLeft: '5px' }}>To</label>
                <input type="text" className="repair-input" style={{ width: '60px' }} />
              </div>

              <div className="repair-form-row" style={{ marginTop: '10px' }}>
                <label style={{ minWidth: 'auto', marginRight: '10px' }}><input type="checkbox" /> No Warranty</label>
                <label style={{ minWidth: 'auto', marginRight: '10px' }}><input type="checkbox" /> New Sale</label>
                <label style={{ minWidth: 'auto', marginRight: '5px' }}>Purchase Date</label>
                <input type="date" className="repair-input" style={{ width: '110px' }} />
                <label style={{ minWidth: 'auto', marginRight: '5px', marginLeft: '10px' }}>Size</label>
                <select className="repair-select" style={{ width: '60px' }}>
                  <option></option>
                  {Array.from({ length: 61 }, (_, i) => 1 + i * 0.25).map(size => (
                    <option key={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="repair-top-right">
              <label><span style={{ marginRight: '5px' }}>JM Warranty</span><input type="checkbox" /></label>
              <label><span style={{ marginRight: '5px' }}>First Sizing</span><input type="checkbox" /></label>
              <label><span style={{ marginRight: '5px' }}>Annual CPR</span><input type="checkbox" /></label>
              <label><span style={{ marginRight: '5px' }}>Other</span><input type="checkbox" /></label>
              <label><span style={{ marginRight: '5px' }}>Comeback</span><input type="checkbox" /></label>
            </div>
          </div>

          <div className="repair-tabs">
            {['Merchandise Description', 'Repair Detail', 'Reasons'].map(tab => (
              <div 
                key={tab} 
                className={`repair-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
          
          <div className="repair-tab-content">
            {activeTab === 'Merchandise Description' && (
              <>
                {selectedItemType === 'Watch' ? (
                  <div className="repair-stone-grid" style={{ padding: '0', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginRight: '10px' }}>
                        <div className="repair-form-row">
                          <label style={{ width: '70px', textAlign: 'right', marginRight: '5px' }}>Gender</label>
                          <select className="repair-select" style={{ width: '90px' }} value={watchGender} onChange={e => setWatchGender(e.target.value)}>
                            {genderOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                          </select>
                        </div>
                        <div className="repair-form-row">
                          <label style={{ width: '70px', textAlign: 'right', marginRight: '5px' }}>Movement</label>
                          <select className="repair-select" style={{ width: '90px' }} value={watchMovement} onChange={e => setWatchMovement(e.target.value)}>
                            {movementOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginRight: '10px' }}>
                        <div className="repair-form-row">
                          <label style={{ width: '70px', textAlign: 'right', marginRight: '5px' }}>Metal</label>
                          <select className="repair-select" style={{ width: '90px' }} value={watchMetal} onChange={e => setWatchMetal(e.target.value)}>
                            {watchMetalOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                          </select>
                        </div>
                        <div className="repair-form-row">
                          <label style={{ width: '70px', textAlign: 'right', marginRight: '5px' }}>Band Type</label>
                          <select className="repair-select" style={{ width: '90px' }} value={watchBandType} onChange={e => setWatchBandType(e.target.value)}>
                            {bandTypeOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div className="repair-form-row">
                          <label style={{ width: '60px', textAlign: 'right', marginRight: '5px' }}>Brand</label>
                          <input type="text" className="repair-input" style={{ width: '90px' }} value={brand} onChange={e => setBrand(e.target.value)} />
                        </div>
                        <div className="repair-form-row">
                          <label style={{ width: '60px', textAlign: 'right', marginRight: '5px' }}>Case Size</label>
                          <select className="repair-select" style={{ width: '90px' }} value={watchCaseSize} onChange={e => setWatchCaseSize(e.target.value)}>
                            {caseSizeOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '10px' }}>
                        <div className="repair-form-row">
                          <label style={{ width: '60px', textAlign: 'right', marginRight: '5px' }}>Serial #</label>
                          <input type="text" className="repair-input" style={{ width: '100px' }} value={watchSerial} onChange={e => setWatchSerial(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '200px' }}>
                        {['Movement', 'Crystal', 'Dial', 'Hands', 'Bracelet', 'Band/Strap', 'Links'].map(label => (
                          <div className="repair-form-row" key={label}>
                            <label style={{ width: '90px', textAlign: 'right', marginRight: '5px' }}>{label}</label>
                            <select className="repair-select" style={{ width: '90px' }}>
                              {label === 'Movement' && movementConditionOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                              {label === 'Crystal' && crystalOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                              {label === 'Dial' && dialOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                              {label === 'Hands' && handsOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                              {label === 'Bracelet' && braceletOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                              {label === 'Band/Strap' && bandStrapOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                              {label === 'Links' && linksOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '200px' }}>
                        {['Case', 'Case Back', 'Bezel', 'Crown'].map(label => (
                          <div className="repair-form-row" key={label}>
                            <label style={{ width: '80px', textAlign: 'right', marginRight: '5px' }}>{label}</label>
                            <select className="repair-select" style={{ width: '90px' }}>
                              {label === 'Case' && caseOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                              {label === 'Case Back' && caseBackOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                              {label === 'Bezel' && bezelOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                              {label === 'Crown' && crownOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="repair-stone-grid">
              <div className="repair-form-row" style={{ marginBottom: '15px' }}>
                <label style={{ width: '80px', marginRight: '10px' }}>Brand</label>
                <select className="repair-select" style={{ width: '100px' }} value={brand} onChange={e => setBrand(e.target.value)}>
                  <option></option>
                  <option>Diamond</option>
                </select>
              </div>
              
              <div className="repair-stone-header">
                <div style={{ width: '80px', marginRight: '10px' }}></div>
                <div className="repair-stone-col" style={{ textAlign: 'center' }}>Center Stone</div>
                <div className="repair-stone-col" style={{ textAlign: 'center' }}>Side Stones</div>
                <div className="repair-stone-col" style={{ textAlign: 'center' }}>Side Stones</div>
              </div>
              
              {['Color', 'Shape', 'Type', 'Quantity', 'MM Size', 'Carat', 'Damage', 'Grade Report #'].map((label, index) => (
                <div className="repair-stone-row" key={label} style={{ marginBottom: '3px' }}>
                  <div className="repair-stone-label">{label}</div>
                  
                  <div className="repair-stone-col">
                    {['Shape', 'Type'].includes(label) ? (
                      <select className="repair-select" style={{ width: '100%' }} value={stoneDetails.center[label] || ''} onChange={e => handleStoneChange('center', label, e.target.value)}>
                        <option></option>
                        {label === 'Shape' && shapeOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                        {label === 'Type' && typeOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                      </select>
                    ) : (
                      <input type="text" className="repair-input" style={{ width: label === 'Grade Report #' ? '100%' : '100%' }} value={stoneDetails.center[label] || ''} onChange={e => handleStoneChange('center', label, e.target.value)} />
                    )}
                  </div>
                  
                  <div className="repair-stone-col">
                    {label !== 'Grade Report #' && (
                      ['Shape', 'Type'].includes(label) ? (
                        <select className="repair-select" style={{ width: '100%' }} value={stoneDetails.side1[label] || ''} onChange={e => handleStoneChange('side1', label, e.target.value)}>
                          <option></option>
                          {label === 'Shape' && shapeOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                          {label === 'Type' && typeOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                        </select>
                      ) : (
                        <input type="text" className="repair-input" style={{ width: '100%' }} value={stoneDetails.side1[label] || ''} onChange={e => handleStoneChange('side1', label, e.target.value)} />
                      )
                    )}
                  </div>
                  
                  <div className="repair-stone-col">
                    {label !== 'Grade Report #' && (
                      ['Shape', 'Type'].includes(label) ? (
                        <select className="repair-select" style={{ width: '100%' }} value={stoneDetails.side2[label] || ''} onChange={e => handleStoneChange('side2', label, e.target.value)}>
                          <option></option>
                          {label === 'Shape' && shapeOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                          {label === 'Type' && typeOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                        </select>
                      ) : (
                        <input type="text" className="repair-input" style={{ width: '100%' }} value={stoneDetails.side2[label] || ''} onChange={e => handleStoneChange('side2', label, e.target.value)} />
                      )
                    )}
                  </div>
                </div>
              ))}
                  </div>
                )}
            
            <div className="repair-textareas">
              {/* Serial # was moved to the Watch grid */}
              <div className="repair-textarea-group">
                <label>Item Description</label>
                <textarea className="repair-textarea" value={itemDescription} onChange={e => setItemDescription(e.target.value)}></textarea>
              </div>
              <div className="repair-textarea-group">
                <label>Repair Instruction</label>
                <textarea className="repair-textarea" value={repairInstruction} onChange={e => setRepairInstruction(e.target.value)}></textarea>
              </div>
              <div className="repair-textarea-group">
                <label>Item Condition</label>
                <textarea className="repair-textarea" value={itemCondition} onChange={e => setItemCondition(e.target.value)}></textarea>
              </div>
            </div>
              </>
            )}
            
            {activeTab === 'Repair Detail' && (
              <div className="repair-detail-grid" style={{ padding: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                  <span style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '20px', color: '#0056b3' }} title="Add Row" onClick={handleAddRow}>+</span>
                  <span style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '24px', color: '#c00', lineHeight: '20px' }} title="Remove Row" onClick={handleRemoveRow}>-</span>
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', fontWeight: 'bold' }}>
                      <th style={{ padding: '5px' }}>Labor Group</th>
                      <th style={{ padding: '5px' }}>Labor Category</th>
                      <th style={{ padding: '5px' }}>Labor #</th>
                      <th style={{ padding: '5px' }}>Description</th>
                      <th style={{ padding: '5px', textAlign: 'right' }}>Retail Price</th>
                      <th style={{ padding: '5px', textAlign: 'right' }}>Unit Discount</th>
                      <th style={{ padding: '5px', textAlign: 'right' }}>Price</th>
                      <th style={{ padding: '5px', textAlign: 'right' }}>Qty</th>
                      <th style={{ padding: '5px', textAlign: 'right' }}>Ext. Price</th>
                      <th style={{ padding: '5px', textAlign: 'center' }}>Taxable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repairRows.map((row) => (
                      <tr key={row.id}>
                        <td style={{ padding: '5px' }}>
                          <div style={{ display: 'flex' }}>
                            <input type="text" value={row.group} onChange={(e) => {
                              const val = e.target.value;
                              setRepairRows(repairRows.map(r => r.id === row.id ? { ...r, group: val } : r));
                            }} className="repair-input" style={{ width: '40px' }} />
                            <div className="repair-icon-btn" style={{cursor: 'pointer'}} onClick={() => {
                              setActiveLaborRowId(row.id);
                              setShowLaborGroupLookup(true);
                            }}><BookIcon /></div>
                          </div>
                        </td>
                        <td style={{ padding: '5px' }}>
                          <div style={{ display: 'flex' }}>
                            <input type="text" value={row.category} onChange={(e) => {
                              const val = e.target.value;
                              setRepairRows(repairRows.map(r => r.id === row.id ? { ...r, category: val } : r));
                            }} className="repair-input" style={{ width: '50px' }} />
                            <div className="repair-icon-btn" style={{cursor: 'pointer'}} onClick={() => {
                              setActiveLaborRowId(row.id);
                              setShowLaborCategoryLookup(true);
                            }}><BookIcon /></div>
                          </div>
                        </td>
                        <td style={{ padding: '5px' }}>
                          <div style={{ display: 'flex' }}>
                            <input type="text" value={row.laborNo} onChange={(e) => {
                              const val = e.target.value;
                              setRepairRows(repairRows.map(r => r.id === row.id ? { ...r, laborNo: val } : r));
                            }} className="repair-input" style={{ width: '50px' }} />
                            <div className="repair-icon-btn" style={{cursor: 'pointer'}} onClick={() => {
                              setActiveLaborRowId(row.id);
                              setShowLaborLookup(true);
                            }}><BookIcon /></div>
                          </div>
                        </td>
                        <td style={{ padding: '5px' }}>
                          <input type="text" value={row.desc} onChange={(e) => setRepairRows(repairRows.map(r => r.id === row.id ? { ...r, desc: e.target.value } : r))} className="repair-input" style={{ width: '150px' }} />
                        </td>
                        <td style={{ padding: '5px' }}>
                          <input type="text" value={row.retail} onChange={(e) => setRepairRows(repairRows.map(r => r.id === row.id ? { ...r, retail: e.target.value } : r))} className="repair-input" style={{ width: '60px', textAlign: 'right' }} />
                        </td>
                        <td style={{ padding: '5px' }}>
                          <input type="text" value={row.disc} onChange={(e) => setRepairRows(repairRows.map(r => r.id === row.id ? { ...r, disc: e.target.value } : r))} className="repair-input" style={{ width: '60px', textAlign: 'right' }} />
                        </td>
                        <td style={{ padding: '5px' }}>
                          <input type="text" value={row.price} onChange={(e) => setRepairRows(repairRows.map(r => r.id === row.id ? { ...r, price: e.target.value } : r))} className="repair-input" style={{ width: '60px', textAlign: 'right' }} />
                        </td>
                        <td style={{ padding: '5px' }}>
                          <input type="text" value={row.qty} onChange={(e) => setRepairRows(repairRows.map(r => r.id === row.id ? { ...r, qty: e.target.value } : r))} className="repair-input" style={{ width: '30px', textAlign: 'right' }} />
                        </td>
                        <td style={{ padding: '5px' }}>
                          <input type="text" value={row.ext} className="repair-input" style={{ width: '60px', textAlign: 'right', backgroundColor: '#ebebeb', color: '#666' }} readOnly />
                        </td>
                        <td style={{ padding: '5px', textAlign: 'center' }}>
                          <input type="checkbox" defaultChecked={row.taxable} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'Reasons' && (
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '20px', padding: '10px 10px 0 10px', fontSize: '14px', fontWeight: 'bold', color: '#004c70' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <input type="radio" name="reasonType" /> Resize
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <input type="radio" name="reasonType" defaultChecked /> Repair
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <input type="radio" name="reasonType" /> Remake
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <input type="radio" name="reasonType" /> Service
                  </label>
                </div>
                
                <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                  <div style={{ flex: 1, border: '1px solid #aaa', backgroundColor: '#fff', height: '300px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '1px solid #aaa', textAlign: 'left' }}>
                          <th style={{ padding: '5px', width: '80px', borderRight: '1px solid #e0e0e0', fontWeight: 'bold' }}>Select YN</th>
                          <th style={{ padding: '5px', fontWeight: 'bold' }}>Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          'Bishops', 'Annual check', 'Clean/polish', 'Tighten Prongs', 
                          'Re-Rhodium White', 'Re-Rhodium Black', 'Solder / Broken Piece', 
                          'Replace Stone', 'Re-set stone', 'Retip Prongs', 'Tighten loose stones'
                        ].map((reason, i) => (
                          <tr key={reason} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f9f9f9', borderBottom: '1px solid #f0f0f0' }}>
                            <td 
                              style={{ padding: '5px', borderRight: '1px solid #f0f0f0', textAlign: 'center', cursor: 'pointer', userSelect: 'none' }}
                              onClick={() => {
                                setReasonSelections(prev => {
                                  const current = prev[reason];
                                  let next = 'Y';
                                  if (current === 'Y') next = 'N';
                                  else if (current === 'N') next = '';
                                  return { ...prev, [reason]: next };
                                });
                              }}
                            >
                              {reasonSelections[reason] || ''}
                            </td>
                            <td style={{ padding: '5px', color: '#333' }}>{reason}</td>
                          </tr>
                        ))}
                        {/* Empty rows to fill space */}
                        {Array.from({ length: 5 }).map((_, i) => (
                          <tr key={`empty-${i}`} style={{ backgroundColor: (11 + i) % 2 === 0 ? '#fff' : '#f9f9f9', height: '26px' }}>
                            <td style={{ borderRight: '1px solid #f0f0f0' }}></td>
                            <td></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="repair-textareas" style={{ flex: 1 }}>
                    <div className="repair-textarea-group">
                      <label>Item Description</label>
                      <textarea className="repair-textarea" defaultValue="Care Plan" style={{ height: '80px' }}></textarea>
                    </div>
                    <div className="repair-textarea-group" style={{ marginTop: '10px' }}>
                      <label>Repair Instruction</label>
                      <textarea className="repair-textarea" defaultValue="Jewelry Repair" style={{ height: '80px' }}></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="repair-detail-footer">
          <button className="repair-btn" onClick={handleSave}>OK</button>
          <button className="repair-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
      {showCategoryLookup && <CategoryLookupModal onClose={() => setShowCategoryLookup(false)} onSelect={(data) => setCategoryNo(data.code)} />}
      {showVendorLookup && <VendorLookupModal onClose={() => setShowVendorLookup(false)} onSelect={(data) => setVendorNo(data.code)} />}
      {showLaborGroupLookup && (
        <LaborGroupLookupModal 
          onClose={() => setShowLaborGroupLookup(false)} 
          onSelect={(data) => {
            setRepairRows(repairRows.map(r => r.id === activeLaborRowId ? { ...r, group: data.groupNum } : r));
            setShowLaborGroupLookup(false);
          }} 
        />
      )}
      {showLaborCategoryLookup && (
        <LaborCategoryLookupModal 
          onClose={() => setShowLaborCategoryLookup(false)} 
          onSelect={(data) => {
            setRepairRows(repairRows.map(r => r.id === activeLaborRowId ? { ...r, category: data.categoryNum } : r));
            setShowLaborCategoryLookup(false);
          }} 
        />
      )}
      {showLaborLookup && (
        <LaborLookupModal 
          onClose={() => setShowLaborLookup(false)} 
          onSelect={(data) => {
            setRepairRows(repairRows.map(r => r.id === activeLaborRowId ? { ...r, laborNo: data.laborNum, desc: data.desc, retail: data.price, price: data.price } : r));
            setShowLaborLookup(false);
          }} 
        />
      )}
    </div>
  );
}

export default RepairDetailModal;
