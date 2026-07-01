import React from 'react'
import './MenuSection.css'

function MenuSection({ title, color, items, cols }) {
  return (
    <div className="menu-section">
      <div className="section-header" style={{ backgroundColor: color }}>
        {title}
      </div>
      <div
        className="section-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {items.map((item, index) => (
          item.icon === null && item.label === ''
            ? <div key={index} className="menu-btn-empty" />
            : (
              <button key={index} className="menu-btn">
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </button>
            )
        ))}
      </div>
    </div>
  )
}

export default MenuSection
