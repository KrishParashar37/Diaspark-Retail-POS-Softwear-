import React from 'react';
import './ActionModal.css';

function ActionModal({ onClose, onActionSelect }) {
  const handleActionClick = (actionName) => {
    if (onActionSelect) {
      onActionSelect(actionName);
    }
    onClose();
  };

  return (
    <div className="action-modal-overlay">
      <div className="action-modal">
        <div className="action-header">
          <span>Action</span>
          <button className="action-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="action-body">
          <button className="action-link" onClick={() => handleActionClick('Layaway')}>
            Layaway
          </button>
          
          <button className="action-link" onClick={() => handleActionClick('Wishlist')}>
            Wishlist
          </button>
          
          <button className="action-link" onClick={() => handleActionClick('Put On Hold')}>
            Put On Hold
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActionModal;
