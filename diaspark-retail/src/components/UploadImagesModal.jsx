import React, { useState, useRef } from 'react';
import './UploadImagesModal.css';

function UploadImagesModal({ onClose }) {
  const [images, setImages] = useState([]);
  const [defaultImageId, setDefaultImageId] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    setImages(prev => {
      const updated = [...prev, ...newImages];
      if (updated.length > 0 && !defaultImageId) {
        setDefaultImageId(updated[0].id);
      }
      return updated;
    });
  };

  const handleBrowseComputer = () => {
    fileInputRef.current?.click();
  };

  const handleDummyImage = (sourceName) => {
    const newImage = {
      id: Math.random().toString(36).substr(2, 9),
      name: `dummy_${sourceName}_${Math.floor(Math.random() * 1000)}.jpg`,
      url: 'https://via.placeholder.com/50'
    };
    setImages(prev => {
      const updated = [...prev, newImage];
      if (updated.length > 0 && !defaultImageId) {
        setDefaultImageId(updated[0].id);
      }
      return updated;
    });
  };

  const handleDelete = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
    if (defaultImageId === id) {
      setDefaultImageId(null);
    }
  };
  return (
    <div className="upload-overlay">
      <div className="upload-modal">
        <div className="upload-header">
          <span>Upload Images</span>
          <button className="upload-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="upload-body">
          <input type="file" multiple accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
          <div className="upload-links-row">
            <span className="upload-link" onClick={handleBrowseComputer}>Browse From Computer</span>
            <span className="upload-link" onClick={() => handleDummyImage('photo')}>Take Photo</span>
            <span className="upload-link" onClick={() => handleDummyImage('iphone')}>Browse Iphone Images</span>
          </div>
          
          <div className="upload-grid-container">
            <div className="upload-grid-header">
              <div>Image</div>
              <div>Name</div>
              <div>Default</div>
              <div>Delete</div>
            </div>
            <div className="upload-grid-body">
              {images.map(img => (
                <div key={img.id} className="upload-grid-row">
                  <div>
                    <img src={img.url} alt={img.name} style={{ width: '40px', height: '40px', objectFit: 'cover', border: '1px solid #ccc' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', wordBreak: 'break-all' }}>{img.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <input 
                      type="radio" 
                      name="defaultImage" 
                      checked={defaultImageId === img.id} 
                      onChange={() => setDefaultImageId(img.id)} 
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span onClick={() => handleDelete(img.id)} style={{ color: 'red', fontWeight: 'bold', fontSize: '20px', cursor: 'pointer', lineHeight: '10px' }}>-</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="upload-footer">
          <button className="upload-action-btn" onClick={onClose}>OK</button>
          <button className="upload-action-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default UploadImagesModal;
