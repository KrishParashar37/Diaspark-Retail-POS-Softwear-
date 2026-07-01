import React, { useState, useEffect } from 'react';
import './ItemDetailModal.css';

function ItemDetailModal({ item, onClose, onSave }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    }
  }, [item]);

  if (!item) return null;

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="item-detail-overlay">
      <div className="item-detail-modal">
        <div className="item-detail-header">
          <span>Item Details</span>
          <button className="item-detail-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="item-detail-body">
          <div className="item-detail-row">
            <div className="item-detail-field">
              <label>Serial #</label>
              <input type="text" value={formData.serial || ''} onChange={(e) => handleChange(e, 'serial')} />
            </div>
            <div className="item-detail-field">
              <label>Style/ SKU #</label>
              <input type="text" value={formData.sku || ''} onChange={(e) => handleChange(e, 'sku')} />
            </div>
          </div>
          
          <div className="item-detail-row">
            <div className="item-detail-field">
              <label>Description</label>
              <input type="text" value={formData.description || ''} onChange={(e) => handleChange(e, 'description')} />
            </div>
          </div>

          <div className="item-detail-row">
            <div className="item-detail-field">
              <label>Detail Description</label>
              <input type="text" value={formData.detailDescription || ''} onChange={(e) => handleChange(e, 'detailDescription')} />
            </div>
          </div>

          <div className="item-detail-row">
            <div className="item-detail-field">
              <label>Category</label>
              <input type="text" value={formData.category || ''} onChange={(e) => handleChange(e, 'category')} />
            </div>
            <div className="item-detail-field">
              <label>Vendor</label>
              <input type="text" value={formData.vendor || ''} onChange={(e) => handleChange(e, 'vendor')} />
            </div>
            <div className="item-detail-field">
              <label>Vendor Style</label>
              <input type="text" value={formData.vendorStyle || ''} onChange={(e) => handleChange(e, 'vendorStyle')} />
            </div>
          </div>

          <div className="item-detail-row">
            <div className="item-detail-field">
              <label>Size</label>
              <input type="text" value={formData.size || ''} onChange={(e) => handleChange(e, 'size')} />
            </div>
            <div className="item-detail-field">
              <label>Location #</label>
              <input type="text" value={formData.location || ''} onChange={(e) => handleChange(e, 'location')} />
            </div>
          </div>
          
          <div className="item-detail-row">
            <div className="item-detail-field">
              <label>On Hand</label>
              <input type="text" value={formData.onHand || '0'} onChange={(e) => handleChange(e, 'onHand')} style={{textAlign: 'right'}} />
            </div>
            <div className="item-detail-field">
              <label>Retail Price ($)</label>
              <input type="number" value={formData.retailPrice !== undefined ? formData.retailPrice : (formData.price || 0)} onChange={(e) => handleChange(e, 'retailPrice')} style={{textAlign: 'right'}} step="0.01" />
            </div>
          </div>
        </div>
        
        <div className="item-detail-footer">
          <button className="modal-action-btn" onClick={() => onSave && onSave(formData)} style={{background: 'linear-gradient(to bottom, #7aa4db, #487ccc)', color: 'white', fontWeight: 'bold', border: '1px solid #3461a6', marginRight: '10px'}}>Save</button>
          <button className="modal-action-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailModal;
