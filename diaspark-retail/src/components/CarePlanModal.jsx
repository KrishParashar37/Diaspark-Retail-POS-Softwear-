import React, { useState } from 'react';
import './CarePlanModal.css';

const CARE_PLANS = [
  // Jewelry Plans
  { plan: 'JMJLRY01', duration: '6 Month Plan', price: 24.99 },
  { plan: 'JMJLRY02', duration: '6 Month Plan', price: 39.99 },
  { plan: 'JMJLRY03', duration: '6 Month Plan', price: 59.99 },
  { plan: 'JMJLRY04', duration: '6 Month Plan', price: 69.99 },
  { plan: 'JMJLRY05', duration: '6 Month Plan', price: 79.99 },
  { plan: 'JMJLRY06', duration: '6 Month Plan', price: 99.99 },
  { plan: 'JMJLRY07', duration: '6 Month Plan', price: 129.99 },
  { plan: 'JMJLRY08', duration: '6 Month Plan', price: 169.99 },
  { plan: 'JMJLRY09', duration: '6 Month Plan', price: 209.99 },
  { plan: 'JMJLRY10', duration: '6 Month Plan', price: 249.99 },
  { plan: 'JMJLRY11', duration: '6 Month Plan', price: 344.99 },
  { plan: 'JMJLRY12', duration: '6 Month Plan', price: 424.99 },
  { plan: 'JMJLRY13', duration: '6 Month Plan', price: 599.99 },
  { plan: 'JMJLRY14', duration: '6 Month Plan', price: 949.99 },
  { plan: 'JMJLRY15', duration: '6 Month Plan', price: 1299.99 },
  { plan: 'JMJLRY16', duration: '6 Month Plan', price: 1699.99 },
  // 18K Plans
  { plan: 'JMJ18L06', duration: '6 Month Plan', price: 159.99 },
  { plan: 'JMJ18L07', duration: '6 Month Plan', price: 199.99 },
  { plan: 'JMJ18L08', duration: '6 Month Plan', price: 224.99 },
  { plan: 'JMJ18L09', duration: '6 Month Plan', price: 239.99 },
  { plan: 'JMJ18L10', duration: '6 Month Plan', price: 279.99 },
  { plan: 'JMJ18L11', duration: '6 Month Plan', price: 329.99 },
  { plan: 'JMJ18L12', duration: '6 Month Plan', price: 379.99 },
  { plan: 'JMJ18L13', duration: '6 Month Plan', price: 424.99 },
  { plan: 'JMJ18L14', duration: '6 Month Plan', price: 479.99 },
  { plan: 'JMJ18L15', duration: '6 Month Plan', price: 529.99 },
  { plan: 'JMJ18L16', duration: '6 Month Plan', price: 749.99 },
  { plan: 'JMJ18L17', duration: '6 Month Plan', price: 899.99 },
  { plan: 'JMJ18L18', duration: '6 Month Plan', price: 1299.99 },
  { plan: 'JMJLRY17', duration: '6 Month Plan', price: 1699.99 },
  { plan: 'JMJLRY18', duration: '6 Month Plan', price: 1699.99 },
  { plan: 'JMJLRY19', duration: '6 Month Plan', price: 1699.99 },
];

export default function CarePlanModal({ onClose, onSelect }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleOK = () => {
    if (selectedIndex !== null) {
      onSelect(CARE_PLANS[selectedIndex]);
    }
    onClose();
  };

  return (
    <div className="careplan-overlay" onClick={onClose}>
      <div className="careplan-modal" onClick={(e) => e.stopPropagation()}>
        {/* Title Bar */}
        <div className="careplan-titlebar">
          <span className="careplan-title">JM Warranty Plans</span>
          <button className="careplan-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Header with logo and plan info */}
        <div className="careplan-header">
          <div className="careplan-logo">
            <div className="careplan-logo-icon">∞</div>
            <div className="careplan-logo-text">
              <span className="careplan-logo-name">Jewelers Mutual</span>
              <span className="careplan-logo-tagline">GROUP</span>
            </div>
          </div>
          <div className="careplan-plan-info">
            <span className="careplan-plan-type">CARE-PLAN</span>
            <span className="careplan-plan-separator">/</span>
            <span className="careplan-plan-code">CARE-PLAN-000</span>
          </div>
        </div>

        {/* Plans Table */}
        <div className="careplan-table-container">
          <table className="careplan-table">
            <thead>
              <tr>
                <th className="careplan-th-plan">Plan</th>
                <th className="careplan-th-duration">Duration</th>
                <th className="careplan-th-price">Price</th>
              </tr>
            </thead>
            <tbody>
              {CARE_PLANS.map((plan, index) => (
                <tr
                  key={index}
                  className={`careplan-row ${selectedIndex === index ? 'selected' : ''}`}
                  onClick={() => setSelectedIndex(index)}
                  onDoubleClick={() => { setSelectedIndex(index); handleOK(); }}
                >
                  <td className="careplan-td-plan">{plan.plan}</td>
                  <td className="careplan-td-duration">{plan.duration}</td>
                  <td className="careplan-td-price">{plan.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Buttons */}
        <div className="careplan-footer">
          <button className="careplan-ok-btn" onClick={handleOK}>OK</button>
          <button className="careplan-cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
