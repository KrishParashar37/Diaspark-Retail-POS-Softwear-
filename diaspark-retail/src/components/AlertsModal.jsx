import React, { useState } from 'react';
import './AlertsModal.css';

const AlertsModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="alerts-modal">
        {/* Header */}
        <div className="modal-header">
          <span>Alerts</span>
          <button className="close-btn" onClick={onClose} title="Close">&times;</button>
        </div>
        
        {/* Grid Container */}
        <div className="alerts-grid-container">
          <table className="alerts-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Category #</th>
                <th style={{ width: '15%' }}>Priority</th>
                <th style={{ width: '30%' }}>Question</th>
                <th style={{ width: '30%' }}>Answer</th>
                <th style={{ width: '10%' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 !== 0 ? '#fcfcfc' : 'white' }}>
                  <td>&nbsp;</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form Container */}
        <div className="alerts-form-container">
          <div className="alerts-form-column">
            <div className="alerts-form-row">
              <label>Category #</label>
              <select className="alerts-select">
                <option></option>
                <option>Can't Warranty</option>
                <option>Delay</option>
                <option>Estimate Sent</option>
                <option>Waiting for Components</option>
                <option>Wating for Customer Approval</option>
              </select>
            </div>
            <div className="alerts-form-row">
              <label style={{ paddingTop: '2px' }}>Question</label>
              <textarea className="alerts-textarea"></textarea>
            </div>
          </div>
          <div className="alerts-form-column">
            <div className="alerts-form-row">
              <label>Priority</label>
              <select className="alerts-select" defaultValue="Medium">
                <option value="High">High</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
              </select>
            </div>
            <div className="alerts-form-row">
              <label style={{ paddingTop: '2px' }}>Answer</label>
              <textarea className="alerts-textarea"></textarea>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="alerts-footer">
          <button className="alerts-btn">Update/Add</button>
          <button className="alerts-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AlertsModal;
