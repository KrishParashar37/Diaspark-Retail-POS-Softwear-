import React, { useState, useEffect } from 'react';
import './PriceQtyDiscountModal.css';

function PriceQtyDiscountModal({ item, onClose, onSave }) {
  const [formData, setFormData] = useState({
    discountCode: '',
    discountPercent: '0.00',
    retailPrice: '0.00',
    unitDiscount: '0.00',
    quantity: '1',
    unitPrice: '0.00',
    extPrice: '0.00',
    notes: ''
  });

  useEffect(() => {
    if (item) {
      const qty = item.qty ? parseFloat(item.qty) : 1;
      const price = item.price ? parseFloat(item.price) : 0;
      const retailPrice = item.retailPrice ? parseFloat(item.retailPrice) : price;
      
      setFormData({
        discountCode: item.discountCode || '',
        discountPercent: item.discountPercent || '0.00',
        retailPrice: retailPrice.toFixed(2),
        unitDiscount: item.unitDiscount || '0.00',
        quantity: qty.toString(),
        unitPrice: price.toFixed(2),
        extPrice: (qty * price).toFixed(2),
        notes: item.notes || ''
      });
    }
  }, [item]);

  const handleChange = (field, value) => {
    let newData = { ...formData, [field]: value };

    // Auto-calculate logic
    let qty = parseFloat(newData.quantity) || 0;
    let unitPrice = parseFloat(newData.unitPrice) || 0;
    let retailPrice = parseFloat(newData.retailPrice) || 0;
    let discountPercent = parseFloat(newData.discountPercent) || 0;
    let unitDiscount = parseFloat(newData.unitDiscount) || 0;

    if (field === 'discountPercent') {
      unitDiscount = retailPrice * (discountPercent / 100);
      unitPrice = retailPrice - unitDiscount;
      newData.unitDiscount = unitDiscount.toFixed(2);
      newData.unitPrice = unitPrice.toFixed(2);
    } else if (field === 'unitDiscount') {
      unitPrice = retailPrice - unitDiscount;
      discountPercent = retailPrice > 0 ? (unitDiscount / retailPrice) * 100 : 0;
      newData.discountPercent = discountPercent.toFixed(2);
      newData.unitPrice = unitPrice.toFixed(2);
    } else if (field === 'unitPrice') {
      unitDiscount = retailPrice - unitPrice;
      discountPercent = retailPrice > 0 ? (unitDiscount / retailPrice) * 100 : 0;
      newData.unitDiscount = unitDiscount.toFixed(2);
      newData.discountPercent = discountPercent.toFixed(2);
    }

    // Update ext price
    newData.extPrice = (qty * parseFloat(newData.unitPrice || 0)).toFixed(2);

    setFormData(newData);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...item,
        qty: formData.quantity,
        price: formData.unitPrice,
        retailPrice: formData.retailPrice,
        discountCode: formData.discountCode,
        discountPercent: formData.discountPercent,
        unitDiscount: formData.unitDiscount,
        notes: formData.notes
      });
    }
  };

  return (
    <div className="pqd-overlay">
      <div className="pqd-modal">
        <div className="pqd-header">
          <span>Price, Qty & Discount</span>
          <button className="pqd-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="pqd-body">
          <div className="pqd-top-section">
            <div className="pqd-left-cols">
              <div className="pqd-field-group">
                <label>Discount Code</label>
                <input 
                  type="text" 
                  style={{ width: '120px' }} 
                  value={formData.discountCode} 
                  onChange={(e) => handleChange('discountCode', e.target.value)} 
                />
              </div>
              <div className="pqd-field-group">
                <label>Discount(%)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  style={{ width: '80px', textAlign: 'right' }} 
                  value={formData.discountPercent} 
                  onChange={(e) => handleChange('discountPercent', e.target.value)} 
                />
              </div>
            </div>
            <div className="pqd-right-cols">
              <div className="pqd-field-group">
                <label>Retail Price</label>
                <input 
                  type="text" 
                  className="pqd-readonly" 
                  style={{ width: '100px', textAlign: 'right' }} 
                  value={formData.retailPrice} 
                  readOnly 
                />
              </div>
              <div className="pqd-field-group">
                <label>Unit Discount</label>
                <input 
                  type="number" 
                  step="0.01" 
                  style={{ width: '100px', textAlign: 'right' }} 
                  value={formData.unitDiscount} 
                  onChange={(e) => handleChange('unitDiscount', e.target.value)} 
                />
              </div>
            </div>
          </div>
          
          <div className="pqd-divider"></div>
          
          <div className="pqd-calc-section">
            <div className="pqd-calc-item">
              <label>Quantity</label>
              <input 
                type="number" 
                style={{ width: '60px', textAlign: 'right' }} 
                value={formData.quantity} 
                onChange={(e) => handleChange('quantity', e.target.value)} 
              />
            </div>
            <span className="pqd-operator">X</span>
            <div className="pqd-calc-item">
              <label>Unit Price</label>
              <input 
                type="number" 
                step="0.01" 
                className="pqd-highlight-input" 
                style={{ width: '100px', textAlign: 'right' }} 
                value={formData.unitPrice} 
                onChange={(e) => handleChange('unitPrice', e.target.value)} 
              />
            </div>
            <span className="pqd-operator">=</span>
            <div className="pqd-calc-item">
              <label style={{ fontWeight: 'bold' }}>Ext. Price</label>
              <input 
                type="text" 
                className="pqd-readonly" 
                style={{ width: '110px', textAlign: 'right' }} 
                value={formData.extPrice} 
                readOnly 
              />
            </div>
          </div>
          
          <div className="pqd-notes-section">
            <textarea 
              value={formData.notes} 
              onChange={(e) => handleChange('notes', e.target.value)}
            ></textarea>
          </div>
        </div>
        
        <div className="pqd-footer">
          <button className="pqd-btn pqd-btn-ok" onClick={handleSave}>OK</button>
          <button className="pqd-btn pqd-btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default PriceQtyDiscountModal;
