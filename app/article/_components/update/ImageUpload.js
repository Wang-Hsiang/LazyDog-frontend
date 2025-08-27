import React, { memo } from 'react';

const ImageUpload = memo(({ imageUrl, imagePreview, handleImageChange, error }) => {
  return (
    <div style={{ margin: '20px' }}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageChange(e.target.files[0])}
        style={{ marginBottom: '10px' }}
      />
      {imageUrl && !imagePreview && (
        <div>
          <h5 className='my-4'>當前圖片:</h5>
          <img
            src={imageUrl}
            alt="當前封面圖"
            style={{ maxWidth: '100%', height: '250px', marginBottom: '10px' }}
          />
        </div>
      )}
      {imagePreview && (
        <div>
          <h4>新圖片預覽:</h4>
          <img
            src={imagePreview}
            alt="預覽"
            style={{ maxWidth: '100%', height: '250px', marginBottom: '10px' }}
          />
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
});

export default ImageUpload;