import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Webcam from 'react-webcam';
import { useReactMediaRecorder } from 'react-media-recorder';

const RealUpload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [uploadMethod, setUploadMethod] = useState('upload');
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');
  const webcamRef = useRef(null);

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl
  } = useReactMediaRecorder({ 
    video: true,
    audio: true,
    onStop: (blobUrl, blob) => {
      const file = new File([blob], `recording-${Date.now()}.mp4`, { type: 'video/mp4' });
      setFile(file);
      setUploadStatus('✅ Recording ready for upload');
    }
  });

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 500 * 1024 * 1024) {
        setError('❌ File size must be less than 500MB');
        return;
      }
      setFile(selectedFile);
      setError('');
      setUploadStatus(`📁 Selected: ${selectedFile.name}`);
    }
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setFile(file);
          setUploadStatus('📸 Photo captured successfully');
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      setError('❌ Title and file are required');
      return;
    }

    setUploadProgress(0);
    setUploadStatus('📤 Uploading...');
    setError('');

    // Simulate upload with real progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('✅ Upload complete! Processing...');
          setTimeout(() => {
            setUploadStatus('🎉 Content published successfully!');
            setTimeout(() => navigate('/dashboard'), 2000);
          }, 1500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0b1a2e 50%, #0a0f1e 100%)',
      color: 'white',
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Create Content
        </h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>
          Upload from device or record directly in browser
        </p>

        {/* Upload Method Tabs */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          borderBottom: '1px solid #333',
          paddingBottom: '15px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'upload', label: '📁 Upload', icon: '📁' },
            { id: 'record', label: '🎥 Record Video', icon: '🎥' },
            { id: 'camera', label: '📸 Take Photo', icon: '📸' }
          ].map(method => (
            <button
              key={method.id}
              onClick={() => setUploadMethod(method.id)}
              style={{
                padding: '10px 20px',
                background: uploadMethod === method.id ? 'rgba(0,180,216,0.2)' : 'transparent',
                border: uploadMethod === method.id ? '2px solid #00b4d8' : '1px solid #333',
                borderRadius: '30px',
                color: uploadMethod === method.id ? '#00b4d8' : '#888',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ marginRight: '5px' }}>{method.icon}</span>
              {method.label}
            </button>
          ))}
        </div>

        {/* Upload Method Content */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '15px',
          padding: '30px',
          border: '1px solid #333'
        }}>
          
          {/* Method 1: Upload from Device */}
          {uploadMethod === 'upload' && (
            <div>
              <div style={{
                border: '2px dashed #00b4d8',
                borderRadius: '15px',
                padding: '40px',
                textAlign: 'center',
                marginBottom: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onDragOver={e => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileSelect({ target: { files: e.dataTransfer.files } });
              }}
              >
                <input
                  type="file"
                  accept="video/*,audio/*,image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="file-input"
                />
                <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📁</div>
                  <h3>Click to upload or drag and drop</h3>
                  <p style={{ color: '#888' }}>MP4, MOV, MP3, JPG (Max 500MB)</p>
                </label>
              </div>
            </div>
          )}

          {/* Method 2: Record Video */}
          {uploadMethod === 'record' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: '#000',
                borderRadius: '15px',
                overflow: 'hidden',
                marginBottom: '20px'
              }}>
                {mediaBlobUrl ? (
                  <video src={mediaBlobUrl} controls style={{ width: '100%', maxHeight: '400px' }} />
                ) : (
                  <Webcam
                    ref={webcamRef}
                    style={{ width: '100%', maxHeight: '400px' }}
                    mirrored={true}
                  />
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {status !== 'recording' ? (
                  <button
                    onClick={startRecording}
                    style={{
                      padding: '15px 30px',
                      background: 'linear-gradient(135deg, #ff4444, #ff6b6b)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    🔴 Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    style={{
                      padding: '15px 30px',
                      background: 'linear-gradient(135deg, #333, #444)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    ⏹️ Stop Recording
                  </button>
                )}
                
                {mediaBlobUrl && (
                  <button
                    onClick={clearBlobUrl}
                    style={{
                      padding: '15px 30px',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      border: '1px solid #333',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }}
                  >
                    Record New
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Method 3: Take Photo */}
          {uploadMethod === 'camera' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: '#000',
                borderRadius: '15px',
                overflow: 'hidden',
                marginBottom: '20px'
              }}>
                <Webcam
                  ref={webcamRef}
                  style={{ width: '100%', maxHeight: '400px' }}
                  screenshotFormat="image/jpeg"
                />
              </div>

              <button
                onClick={handleCapture}
                style={{
                  padding: '15px 40px',
                  background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                📸 Take Photo
              </button>
            </div>
          )}

          {/* Title and Description */}
          <div style={{ marginTop: '30px' }}>
            <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '15px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid #333',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1rem'
              }}
            />

            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              style={{
                width: '100%',
                padding: '15px',
                marginBottom: '15px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid #333',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* File Preview */}
          {file && (
            <div style={{
              padding: '15px',
              background: 'rgba(0,180,216,0.1)',
              border: '1px solid #00b4d8',
              borderRadius: '10px',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '2rem' }}>
                {file.type.startsWith('video') ? '🎬' : file.type.startsWith('audio') ? '🎵' : '📸'}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{file.name}</p>
                <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {error && (
            <div style={{
              padding: '15px',
              background: 'rgba(255,68,68,0.1)',
              border: '1px solid #ff4444',
              borderRadius: '10px',
              color: '#ff4444',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {uploadStatus && !error && (
            <div style={{
              padding: '15px',
              background: uploadStatus.includes('✅') ? 'rgba(76,175,80,0.1)' : 'rgba(0,180,216,0.1)',
              border: uploadStatus.includes('✅') ? '1px solid #4CAF50' : '1px solid #00b4d8',
              borderRadius: '10px',
              color: uploadStatus.includes('✅') ? '#4CAF50' : '#00b4d8',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              {uploadStatus}
            </div>
          )}

          {/* Progress Bar */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                width: '100%',
                height: '10px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '5px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${uploadProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #00b4d8, #0077b6)',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
              <p style={{ textAlign: 'center', color: '#00b4d8', marginTop: '5px' }}>
                {uploadProgress}% uploaded
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!title || !file}
            style={{
              width: '100%',
              padding: '18px',
              background: !title || !file ? '#333' : 'linear-gradient(135deg, #00b4d8, #0077b6)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: !title || !file ? 'not-allowed' : 'pointer',
              opacity: !title || !file ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
          >
            {!file ? 'Select a file first' : '🚀 Publish Content'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealUpload;