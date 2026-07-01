import React, { useState, useEffect } from 'react';
import './CustomerFormModal.css';

function CustomerFormModal({ mode, initialData, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobile: '', city: '', stateName: '', zipCode: '', addressLine: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if ((mode === 'edit' || mode === 'detail') && initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        mobile: initialData.mobile || '',
        city: initialData.city || '',
        stateName: initialData.stateName || '',
        zipCode: initialData.zipCode || '',
        addressLine: initialData.addressLine || ''
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const url = mode === 'edit' ? `http://localhost:5001/api/customers/${initialData.customerId}` : 'http://localhost:5001/api/customers';
    const method = mode === 'edit' ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        onSaved();
      } else {
        alert('Failed to save customer');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving customer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="customer-form-modal">
        <div className="modal-header">
          <span>{mode === 'edit' ? 'Edit Customer' : mode === 'detail' ? 'Customer Details' : 'New Customer'}</span>
          <button className="close-btn" onClick={onClose}>x</button>
        </div>
        <div className="customer-form-body">
          <div className="form-field"><label>First Name:</label><input name="firstName" value={formData.firstName} onChange={handleChange} disabled={mode === 'detail'} /></div>
          <div className="form-field"><label>Last Name:</label><input name="lastName" value={formData.lastName} onChange={handleChange} disabled={mode === 'detail'} /></div>
          <div className="form-field"><label>Email:</label><input name="email" value={formData.email} onChange={handleChange} disabled={mode === 'detail'} /></div>
          <div className="form-field"><label>Mobile:</label><input name="mobile" value={formData.mobile} onChange={handleChange} disabled={mode === 'detail'} /></div>
          <div className="form-field"><label>Address:</label><input name="addressLine" value={formData.addressLine} onChange={handleChange} disabled={mode === 'detail'} /></div>
          <div className="form-field"><label>City:</label><input name="city" value={formData.city} onChange={handleChange} disabled={mode === 'detail'} /></div>
          <div className="form-field"><label>State:</label><input name="stateName" value={formData.stateName} onChange={handleChange} disabled={mode === 'detail'} /></div>
          <div className="form-field"><label>Zip Code:</label><input name="zipCode" value={formData.zipCode} onChange={handleChange} disabled={mode === 'detail'} /></div>
        </div>
        <div className="modal-footer">
          <div className="footer-left"></div>
          <div className="footer-right">
            {mode !== 'detail' && <button className="modal-action-btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>}
            <button className="modal-action-btn" onClick={onClose}>{mode === 'detail' ? 'Close' : 'Cancel'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerFormModal;
