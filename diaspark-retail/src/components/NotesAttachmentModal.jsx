import React, { useState, useRef } from 'react';
import './NotesAttachmentModal.css';

function NotesAttachmentModal({ onClose }) {
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [gridData, setGridData] = useState([
    {
      id: 'dummy1',
      date: '05-28-2026 18:07',
      user: 'ADMIN',
      fileName: '',
      notes: ''
    }
  ]);
  const fileInputRef = useRef(null);

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAdd = () => {
    if (!subject.trim() && !notes.trim() && !file) return;
    
    const now = new Date();
    const dateStr = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newRow = {
      id: Math.random().toString(36).substr(2, 9),
      date: dateStr,
      user: 'ADMIN',
      fileName: file ? file.name : '',
      notes: notes
    };
    
    setGridData([...gridData, newRow]);
    
    // Reset form
    setSubject('');
    setNotes('');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    setSubject('');
    setNotes('');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (id) => {
    setGridData(gridData.filter(row => row.id !== id));
  };
  return (
    <div className="notes-overlay">
      <div className="notes-modal">
        <div className="notes-header">
          <span>Notes & Attachment</span>
          <button className="notes-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="notes-body">
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
          
          <div className="notes-form-row">
            <label>Subject</label>
            <input type="text" className="notes-input" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <button className="notes-browse-btn" onClick={handleBrowse}>Browse</button>
            {file && <span style={{ fontSize: '11px', color: '#555', marginLeft: '5px' }}>{file.name}</span>}
          </div>
          
          <div className="notes-form-row align-top">
            <label>Notes</label>
            <textarea className="notes-textarea" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
          </div>
          
          <div className="notes-actions">
            <button className="notes-action-btn" onClick={handleAdd}>Add</button>
            <button className="notes-action-btn" onClick={handleReset}>Reset</button>
          </div>
          
          <div className="notes-grid">
            <div className="notes-grid-header">
              <div>Date</div>
              <div>User #</div>
              <div>File Name</div>
              <div>Notes</div>
              <div style={{ textAlign: 'center' }}>Delete</div>
            </div>
            {gridData.map(row => (
              <div className="notes-grid-row" key={row.id}>
                <div>{row.date}</div>
                <div>{row.user}</div>
                <div style={{ wordBreak: 'break-all' }}>{row.fileName}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'blue', cursor: 'pointer', fontWeight: 'bold' }}>View</span>
                  <input type="text" readOnly value={row.notes} style={{ width: '150px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', padding: '2px' }} />
                </div>
                <div 
                  style={{ textAlign: 'center', color: 'red', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px', lineHeight: '10px' }}
                  onClick={() => handleDelete(row.id)}
                >-</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="notes-footer">
          <button className="notes-close-action-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default NotesAttachmentModal;
