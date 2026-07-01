import React, { useState } from 'react';
import './PaymentModal.css';
import CreditCardModal from './CreditCardModal';
import FinanceModal from './FinanceModal';
import HouseAccountModal from './HouseAccountModal';
import GiftCardModal from './GiftCardModal';
import RefundCheckModal from './RefundCheckModal';
import WireTransferModal from './WireTransferModal';
import CouponPromoModal from './CouponPromoModal';
import GiftCertificateModal from './GiftCertificateModal';
import CashModal from './CashModal';
import CheckModal from './CheckModal';
import MercuryModal from './MercuryModal';

const paymentMethods = [
  "Mercury", "Check", "Cash", "Credit Card", "Finance", 
  "House Account", "Gift Card", "Refund Check", "WireTransfer", 
  "Coupon/Promo", "Gift Certificate"
];

function PaymentModal({ totalAmount = 2665.63, onClose, onComplete }) {
  const [amounts, setAmounts] = useState(
    paymentMethods.reduce((acc, method) => ({ ...acc, [method]: 0 }), {})
  );
  const [detailedPayments, setDetailedPayments] = useState([]);
  const [internalRemarks, setInternalRemarks] = useState('');
  const [customerRemarks, setCustomerRemarks] = useState('');

  const [showCreditCardModal, setShowCreditCardModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [showHouseAccountModal, setShowHouseAccountModal] = useState(false);
  const [showGiftCardModal, setShowGiftCardModal] = useState(false);
  const [showRefundCheckModal, setShowRefundCheckModal] = useState(false);
  const [showWireTransferModal, setShowWireTransferModal] = useState(false);
  const [showCouponPromoModal, setShowCouponPromoModal] = useState(false);
  const [showGiftCertificateModal, setShowGiftCertificateModal] = useState(false);
  
  const [showCashModal, setShowCashModal] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [showMercuryModal, setShowMercuryModal] = useState(false);

  const received = Object.values(amounts).reduce((a, b) => a + b, 0);
  const due = Math.max(0, parseFloat(totalAmount || 0) - received);

  const handleMethodClick = (method) => {
    if (due <= 0 && method !== 'Coupon/Promo' && method !== 'Gift Certificate') {
       // Only allow clicking if there's an amount due, except for specific ones
    }

    switch (method) {
      case 'Mercury':
        setShowMercuryModal(true);
        break;
      case 'Check':
        setShowCheckModal(true);
        break;
      case 'Cash':
        setShowCashModal(true);
        break;
      case 'Credit Card':
        setShowCreditCardModal(true);
        break;
      case 'Finance':
        setShowFinanceModal(true);
        break;
      case 'House Account':
        setShowHouseAccountModal(true);
        break;
      case 'Gift Card':
        setShowGiftCardModal(true);
        break;
      case 'Refund Check':
        setShowRefundCheckModal(true);
        break;
      case 'WireTransfer':
        setShowWireTransferModal(true);
        break;
      case 'Coupon/Promo':
        setShowCouponPromoModal(true);
        break;
      case 'Gift Certificate':
        setShowGiftCertificateModal(true);
        break;
      default:
        break;
    }
  };

  const handleClose = () => {
    if (onComplete) {
      onComplete(amounts, detailedPayments);
    } else {
      onClose();
    }
  };

  const handleAddPayment = (method, amountAdded, details = {}) => {
    setDetailedPayments(prev => [...prev, { method, amount: amountAdded, ...details }]);
    
    setAmounts(prev => {
      const newAmounts = { ...prev, [method]: prev[method] + amountAdded };
      const receivedNow = Object.values(newAmounts).reduce((a, b) => a + b, 0);
      const newDue = Math.max(0, parseFloat(totalAmount || 0) - receivedNow);

      if (newDue <= 0 && onComplete) {
        // Automatically close and complete when fully paid
        setTimeout(() => onComplete(newAmounts, [...detailedPayments, { method, amount: amountAdded, ...details }]), 300);
      }

      return newAmounts;
    });
  };

  return (
    <div className="pm-overlay">
      <div className="pm-container">
        <div className="pm-header">
          <span>Payment Methods</span>
          <button className="pm-header-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="pm-body">
          <div className="pm-left">
            {paymentMethods.map(method => (
              <div key={method} className="pm-row">
                <button className="pm-method-btn" onClick={() => handleMethodClick(method)}>
                  {method}
                </button>
                <span className="pm-amount">{amounts[method].toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="pm-right">
            <div className="pm-remarks-group">
              <label>Internal Remarks</label>
              <textarea 
                value={internalRemarks}
                onChange={e => setInternalRemarks(e.target.value)}
              />
            </div>
            <div className="pm-remarks-group">
              <label>Customer Remarks</label>
              <textarea 
                value={customerRemarks}
                onChange={e => setCustomerRemarks(e.target.value)}
              />
            </div>
            
            <div className="pm-totals">
              <div className="pm-total-row">
                <span>Total Amount</span>
                <span>{parseFloat(totalAmount || 0).toFixed(2)}</span>
              </div>
              <div className="pm-total-row">
                <span>Received</span>
                <span>{received.toFixed(2)}</span>
              </div>
              <div className="pm-total-row pm-due">
                <span>Amount Due</span>
                <span>{due.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pm-footer">
          <button className="pm-close-btn" onClick={handleClose}>Close</button>
        </div>
      </div>

      {showMercuryModal && (
        <MercuryModal 
          amountDue={due} 
          onClose={() => setShowMercuryModal(false)}
          onAddPayment={(amount, details) => handleAddPayment('Mercury', amount, details)}
        />
      )}

      {showCheckModal && (
        <CheckModal 
          amountDue={due} 
          onClose={() => setShowCheckModal(false)}
          onAddPayment={(amount, details) => handleAddPayment('Check', amount, details)}
        />
      )}

      {showCashModal && (
        <CashModal 
          amountDue={due} 
          onClose={() => setShowCashModal(false)}
          onAddPayment={(amount, details) => handleAddPayment('Cash', amount, details)}
        />
      )}

      {showCreditCardModal && (
        <CreditCardModal 
          amountDue={due} 
          onClose={() => setShowCreditCardModal(false)}
          onAddPayment={(amount, details) => handleAddPayment('Credit Card', amount, details)}
        />
      )}

      {showFinanceModal && (
        <FinanceModal 
          amountDue={due} 
          onClose={() => setShowFinanceModal(false)}
          onAddPayment={(amount, details) => {
            handleAddPayment('Finance', amount, details);
            setShowFinanceModal(false);
          }}
        />
      )}

      {showHouseAccountModal && (
        <HouseAccountModal 
          amountDue={due} 
          onClose={() => setShowHouseAccountModal(false)}
          onAddPayment={(amount, details) => {
            handleAddPayment('House Account', amount, details);
            setShowHouseAccountModal(false);
          }}
        />
      )}

      {showGiftCardModal && (
        <GiftCardModal 
          amountDue={due} 
          onClose={() => setShowGiftCardModal(false)}
          onAddPayment={(amount, details) => handleAddPayment('Gift Card', amount, details)}
        />
      )}

      {showRefundCheckModal && (
        <RefundCheckModal 
          amountDue={due} 
          onClose={() => setShowRefundCheckModal(false)}
          onAddPayment={(amount, details) => handleAddPayment('Refund Check', amount, details)}
        />
      )}

      {showWireTransferModal && (
        <WireTransferModal 
          amountDue={due} 
          onClose={() => setShowWireTransferModal(false)}
          onAddPayment={(amount, details) => handleAddPayment('WireTransfer', amount, details)}
        />
      )}

      {showCouponPromoModal && (
        <CouponPromoModal 
          onClose={() => setShowCouponPromoModal(false)}
          onAddPayment={(amount, details) => handleAddPayment('Coupon/Promo', amount, details)}
        />
      )}

      {showGiftCertificateModal && (
        <GiftCertificateModal 
          onClose={() => setShowGiftCertificateModal(false)}
          onAddPayment={(amount, details) => handleAddPayment('Gift Certificate', amount, details)}
        />
      )}
    </div>
  );
}

export default PaymentModal;
