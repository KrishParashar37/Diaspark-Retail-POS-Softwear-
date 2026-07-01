import API_BASE_URL from '../config.js';
import React, { useState } from 'react';
import './PrintModal.css';
import { printReceipt } from '../utils/printReceipt';

export default function PrintModal({ onClose, onNew, customerEmail, customerCell, transactionData }) {
  const [printType, setPrintType] = useState('Repair Order');
  const [emailFrom, setEmailFrom] = useState('');
  const [emailTo, setEmailTo] = useState(customerEmail || '');
  const [updateCustomerEmail, setUpdateCustomerEmail] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);

  const handleUpdate = async () => {
    const custId = transactionData.customer?.id || transactionData.customer?.customerId || transactionData.customerId;
    if (!custId) {
      alert("No customer selected for this transaction to update.");
      return;
    }
    setIsUpdating(true);
    try {
      const updatedCustomer = {
        ...(transactionData.customer || {
          firstName: transactionData.firstName,
          lastName: transactionData.lastName,
          customerId: transactionData.customerId
        }),
        email: emailTo,
      };
      
      const res = await fetch(`${API_BASE_URL}/api/customers/${custId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCustomer)
      });
      if (res.ok) {
        alert("Customer contact info updated successfully!");
      } else {
        alert("Failed to update customer.");
      }
    } catch (err) {
      console.error("Error updating customer:", err);
      alert("Error updating customer.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEmail = async () => {
    if (!emailTo) {
      alert("Please enter an email address to send to.");
      return;
    }
    
    if (updateCustomerEmail) {
      await handleUpdate();
    }
    setIsEmailing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/send_email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailTo: emailTo,
          invoiceId: transactionData.invoiceId
        })
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.message || "Email sent successfully!");
      } else {
        alert("Failed to send email.");
      }
    } catch (err) {
      console.error("Error sending email:", err);
      alert("Error sending email.");
    } finally {
      setIsEmailing(false);
    }
  };

  return (
    <div className="printmodal-overlay" onClick={onClose}>
      <div className="printmodal-container" onClick={e => e.stopPropagation()}>
        {/* Title Bar */}
        <div className="printmodal-titlebar">
          <span className="printmodal-title">Print</span>
          <button className="printmodal-close-btn" onClick={onClose}>✖</button>
        </div>

        {/* Options */}
        <div className="printmodal-options">
          <label><input type="radio" name="printType" value="Receipt" checked={printType === 'Receipt'} onChange={e => setPrintType(e.target.value)} /> Receipt</label>
          <label><input type="radio" name="printType" value="Gift Receipt" checked={printType === 'Gift Receipt'} onChange={e => setPrintType(e.target.value)} /> Gift Receipt</label>
          <label><input type="radio" name="printType" value="New Sale Document" checked={printType === 'New Sale Document'} onChange={e => setPrintType(e.target.value)} /> New Sale Document</label>
          <label><input type="radio" name="printType" value="All" checked={printType === 'All'} onChange={e => setPrintType(e.target.value)} /> All</label>
        </div>

        {/* Contact Section */}
        <div className="printmodal-contact-section">
          <div className="printmodal-subtitle">Please Update Customer's Email & Cell #</div>
          
          <div className="printmodal-form-group">
            <label>Email From</label>
            <div className="printmodal-input-row">
              <input type="text" className="printmodal-input read-only" value={emailFrom || 'Shopify@diaspark.com'} readOnly />
              <div className="printmodal-placeholder-btn"></div>
            </div>
          </div>
          
          <div className="printmodal-form-group">
            <label>Email To #</label>
            <div className="printmodal-input-row">
              <input type="text" className="printmodal-input focus" value={emailTo} onChange={e => setEmailTo(e.target.value)} />
              <button className="printmodal-update-btn" onClick={handleUpdate}>{isUpdating ? '...' : 'Update'}</button>
            </div>
          </div>
          
          <div className="printmodal-form-group">
            <label>Cell #</label>
            <div className="printmodal-input-row">
              <input type="text" className="printmodal-input" defaultValue={customerCell || ''} />
              <button className="printmodal-update-btn" onClick={() => {}}>Update</button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="printmodal-actions">
          <div className="printmodal-action-row">
            <button className="printmodal-action-btn" onClick={() => { printReceipt(transactionData, printType); onClose(); }}>Print</button>
            <button className="printmodal-action-btn" onClick={() => { handleEmail(); onClose(); }} disabled={isEmailing}>{isEmailing ? '...' : 'Email'}</button>
          </div>
          <div className="printmodal-action-row">
            <button className="printmodal-action-btn" onClick={onNew}>Close & New</button>
            <button className="printmodal-action-btn" onClick={onClose}>Close & Stay</button>
          </div>
        </div>

      </div>
    </div>
  );
}
