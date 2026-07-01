import React from 'react'
import './Footer.css'

function Footer() {
  return (
    <div className="footer">
      <span className="footer-version">current version: 5.8.9</span>
      <span className="footer-date">version date: 05/18/2026</span>
      <span className="footer-copy">Copyright 2014-15, Diaspark Inc. USA.</span>
      <a href="#" className="footer-remote" onClick={(e) => { e.preventDefault(); alert('Starting Remote Assistance session...'); }}>Remote Assistance</a>
    </div>
  )
}

export default Footer
