import React, { useRef, useState } from 'react';
import jsQR from 'jsqr';

const QrImageUploader = ({
  onResult,
  onError,
  style = {},
  inputStyle = {},
  buttonStyle = {},
  className = '',
  inputClassName = '',
  buttonClassName = '',
  buttonText = 'Choose Image',
  acceptedFormats = 'image/*',
  showPreview = true,
  previewStyle = {}
}) => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const processImage = (file) => {
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
      if (showPreview) {
        setPreview(e.target.result);
      }
    };

    img.onload = () => {
      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        setIsProcessing(false);

        if (code && code.data) {
          if (onResult) {
            onResult(code.data, code);
          }
        } else {
          const errorMessage = 'No QR code found in the image';
          setError(errorMessage);
          if (onError) {
            onError(new Error(errorMessage));
          }
        }
      } catch (err) {
        setIsProcessing(false);
        const errorMessage = `Error processing image: ${err.message}`;
        setError(errorMessage);
        if (onError) {
          onError(err);
        }
      }
    };

    img.onerror = () => {
      setIsProcessing(false);
      const errorMessage = 'Error loading image';
      setError(errorMessage);
      if (onError) {
        onError(new Error(errorMessage));
      }
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const errorMessage = 'Please select a valid image file';
      setError(errorMessage);
      if (onError) {
        onError(new Error(errorMessage));
      }
      return;
    }

    processImage(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearPreview = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const defaultStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
    ...style
  };

  const defaultInputStyle = {
    display: 'none',
    ...inputStyle
  };

  const defaultButtonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
    ...buttonStyle
  };

  const defaultPreviewStyle = {
    maxWidth: '300px',
    maxHeight: '300px',
    marginTop: '1rem',
    borderRadius: '8px',
    objectFit: 'contain',
    ...previewStyle
  };

  return (
    <div style={defaultStyle} className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats}
        onChange={handleFileChange}
        style={defaultInputStyle}
        className={inputClassName}
      />

      <button
        onClick={handleButtonClick}
        disabled={isProcessing}
        style={{
          ...defaultButtonStyle,
          backgroundColor: isProcessing ? '#6c757d' : defaultButtonStyle.backgroundColor,
          cursor: isProcessing ? 'not-allowed' : 'pointer'
        }}
        className={buttonClassName}
      >
        {isProcessing ? 'Processing...' : buttonText}
      </button>

      {showPreview && preview && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <img
            src={preview}
            alt="QR Code Preview"
            style={defaultPreviewStyle}
          />
          <br />
          <button
            onClick={clearPreview}
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Clear
          </button>
        </div>
      )}

      {error && (
        <p style={{
          color: 'red',
          marginTop: '1rem',
          textAlign: 'center',
          fontSize: '0.875rem'
        }}>
          {error}
        </p>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default QrImageUploader;