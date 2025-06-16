# React QR Scanner Pro

A lightweight and customizable React QR scanner package with separate components for camera scanning and image upload.

## Installation

```bash
npm install react-qr-scanner-pro
```

## Usage

### Camera Scanner

```jsx
import React from 'react';
import { QrCameraScanner } from 'react-qr-scanner-pro';

const App = () => {
  const handleResult = (data, qrCode) => {
    console.log('QR Code scanned:', data);
    // Handle the scanned data
  };

  const handleError = (error) => {
    console.error('Scanner error:', error);
  };

  return (
    <div>
      <h1>QR Camera Scanner</h1>
      <QrCameraScanner
        onResult={handleResult}
        onError={handleError}
        style={{ border: '2px solid #ccc' }}
        videoStyle={{ borderRadius: '10px' }}
        facingMode="environment" // or "user" for front camera
        scanDelay={100}
      />
    </div>
  );
};

export default App;
```

### Image Uploader

```jsx
import React from 'react';
import { QrImageUploader } from 'react-qr-scanner-pro';

const App = () => {
  const handleResult = (data, qrCode) => {
    console.log('QR Code from image:', data);
    // Handle the scanned data
  };

  const handleError = (error) => {
    console.error('Upload error:', error);
  };

  return (
    <div>
      <h1>QR Image Uploader</h1>
      <QrImageUploader
        onResult={handleResult}
        onError={handleError}
        buttonText="Upload QR Image"
        showPreview={true}
        style={{ backgroundColor: '#f5f5f5', padding: '20px' }}
        buttonStyle={{ backgroundColor: '#28a745' }}
      />
    </div>
  );
};

export default App;
```

## Props

### QrCameraScanner Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onResult` | `function` | - | Callback when QR code is detected `(data, qrCodeObject) => {}` |
| `onError` | `function` | - | Callback for errors `(error) => {}` |
| `style` | `object` | `{}` | Custom styles for container |
| `videoStyle` | `object` | `{}` | Custom styles for video element |
| `className` | `string` | `''` | CSS class for container |
| `videoClassName` | `string` | `''` | CSS class for video element |
| `facingMode` | `string` | `'environment'` | Camera facing mode: 'environment' or 'user' |
| `scanDelay` | `number` | `100` | Delay between scans in milliseconds |

### QrImageUploader Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onResult` | `function` | - | Callback when QR code is detected `(data, qrCodeObject) => {}` |
| `onError` | `function` | - | Callback for errors `(error) => {}` |
| `style` | `object` | `{}` | Custom styles for container |
| `inputStyle` | `object` | `{}` | Custom styles for file input |
| `buttonStyle` | `object` | `{}` | Custom styles for upload button |
| `className` | `string` | `''` | CSS class for container |
| `inputClassName` | `string` | `''` | CSS class for file input |
| `buttonClassName` | `string` | `''` | CSS class for upload button |
| `buttonText` | `string` | `'Choose Image'` | Text for upload button |
| `acceptedFormats` | `string` | `'image/*'` | Accepted file formats |
| `showPreview` | `boolean` | `true` | Show image preview |
| `previewStyle` | `object` | `{}` | Custom styles for preview image |

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first.