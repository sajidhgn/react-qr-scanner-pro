import { useRef, useEffect, useState, useCallback } from 'react';
import jsQR from 'jsqr';

const QrCameraScanner = ({
  onResult,
  onError,
  style = {},
  videoStyle = {},
  facingMode = 'environment',
  scanDelay = 100,
  className = '',
  videoClassName = ''
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const scanIntervalRef = useRef(null);

  const stopCamera = useCallback(() => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const scanFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      return;
    }

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code && code.data) {
      stopCamera();
      if (onResult) {
        onResult(code.data, code);
      }
    }
  }, [onResult, stopCamera]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setIsScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        video.setAttribute('playsinline', true);
        video.setAttribute('muted', true);
        await video.play();

        // Start scanning
        scanIntervalRef.current = setInterval(scanFrame, scanDelay);
      }
    } catch (err) {
      const errorMessage = `Camera error: ${err.message}`;
      setError(errorMessage);
      setIsScanning(false);
      if (onError) {
        onError(err);
      }
    }
  }, [facingMode, scanFrame, scanDelay, onError]);

  useEffect(() => {
    startCamera();
    return stopCamera;
  }, [startCamera, stopCamera]);

  const defaultStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
    ...style
  };

  const defaultVideoStyle = {
    width: '100%',
    maxWidth: '500px',
    height: 'auto',
    borderRadius: '8px',
    ...videoStyle
  };

  if (error) {
    return (
      <div style={defaultStyle} className={className}>
        <p style={{ color: 'red', textAlign: 'center' }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div style={defaultStyle} className={className}>
      <video
        ref={videoRef}
        style={defaultVideoStyle}
        className={videoClassName}
        playsInline
        muted
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {isScanning && (
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Scanning for QR codes...
        </p>
      )}
    </div>
  );
};

export default QrCameraScanner;