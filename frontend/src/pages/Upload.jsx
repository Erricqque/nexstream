import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../lib/supabase';

const Upload = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [files, setFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [contentType, setContentType] = useState('video');
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
    language: 'en',
    ageRestriction: 'all',
    visibility: 'public',
    allowComments: true,
    allowDownloads: true,
    license: 'standard',
    price: 0,
    isFree: true
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setUser(user);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      id: Math.random().toString(36).substr(2, 9)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv', '.webm'],
      'audio/*': ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'],
      'application/zip': ['.zip', '.rar', '.7z'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 1073741824, // 1GB
    multiple: true
  });

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const generateThumbnail = async (videoFile) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(videoFile);
      
      video.onloadeddata = () => {
        video.currentTime = 1;
      };
      
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.8);
        
        URL.revokeObjectURL(video.src);
      };
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'tags') {
      setMetadata(prev => ({
        ...prev,
        tags: value.split(',').map(tag => tag.trim()).filter(tag => tag)
      }));
    } else if (name === 'isFree') {
      setMetadata(prev => ({
        ...prev,
        isFree: checked,
        price: checked ? 0 : prev.price
      }));
    } else {
      setMetadata(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadError('Please select at least one file');
      return;
    }

    if (!metadata.title) {
      setUploadError('Please enter a title');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      let uploadedCount = 0;
      
      for (let i = 0; i < files.length; i++) {
        const { file } = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}_${i}.${fileExt}`;
        const filePath = `content/${contentType}/${fileName}`;

        // Upload file
        const { error: uploadError } = await supabase.storage
          .from('content')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Generate thumbnail for videos
        let thumbnailPath = null;
        if (contentType === 'video') {
          try {
            const thumbnailBlob = await generateThumbnail(file);
            const thumbFileName = `${user.id}/thumbnails/${Date.now()}_${i}.jpg`;
            const { error: thumbError } = await supabase.storage
              .from('content')
              .upload(thumbFileName, thumbnailBlob);
            
            if (!thumbError) {
              thumbnailPath = thumbFileName;
            }
          } catch (thumbError) {
            console.error('Thumbnail generation failed:', thumbError);
          }
        }

        // Save metadata to database - using only columns that exist
        const { error: dbError } = await supabase
          .from('content')
          .insert([{
            user_id: user.id,
            title: metadata.title,
            description: metadata.description || '',
            content_type: contentType,
            category: metadata.category || 'uncategorized',
            tags: metadata.tags || [],
            language: metadata.language || 'en',
            age_restriction: metadata.ageRestriction || 'all',
            visibility: metadata.visibility || 'public',
            allow_comments: metadata.allowComments !== false,
            allow_downloads: metadata.allowDownloads !== false,
            license: metadata.license || 'standard',
            price: metadata.isFree ? 0 : (metadata.price || 0),
            is_free: metadata.isFree,
            file_url: filePath,
            thumbnail_url: thumbnailPath,
            file_size: file.size,
            file_type: file.type,
            status: 'approved',
            views_count: 0,
            likes_count: 0,
            downloads_count: 0,
            created_at: new Date()
          }]);

        if (dbError) {
          console.error('Database error:', dbError);
          throw new Error(dbError.message);
        }

        uploadedCount++;
        setUploadProgress((uploadedCount / files.length) * 100);
      }

      setUploadSuccess(true);
      
      // Navigate to dashboard after successful upload
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const categories = {
    video: ['Gaming', 'Music', 'Education', 'Entertainment', 'Sports', 'News', 'Technology', 'Lifestyle', 'Travel', 'Comedy'],
    audio: ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country', 'Reggae', 'Folk'],
    game: ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Puzzle', 'Multiplayer', 'Arcade', 'Simulation', 'Horror'],
    image: ['Photography', 'Art', 'Design', 'Illustration', '3D', 'Wallpaper'],
    document: ['E-book', 'PDF', 'Template', 'Resource', 'Tutorial']
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'sw', name: 'Swahili' }
  ];

  const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  };

  const fontSize = {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      padding: `${spacing.xl} ${spacing.xl}`,
      fontFamily: 'Inter, sans-serif'
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: spacing.xl }}
        >
          <h1 style={{
            fontSize: fontSize.xxl,
            marginBottom: spacing.xs,
            background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Upload Content
          </h1>
          <p style={{ color: '#888' }}>
            Share your creativity with the world
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: spacing.xs,
          marginBottom: spacing.xl
        }}>
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              style={{
                flex: 1,
                maxWidth: '200px',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step <= currentStep ? '#FF3366' : '#2a2a2a',
                color: step <= currentStep ? 'white' : '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: spacing.xs,
                fontWeight: 'bold'
              }}>
                {step}
              </div>
              <div style={{ 
                color: step <= currentStep ? '#FF3366' : '#666', 
                fontSize: fontSize.sm 
              }}>
                {step === 1 && 'Select Files'}
                {step === 2 && 'Add Details'}
                {step === 3 && 'Upload'}
              </div>
            </div>
          ))}
        </div>

        {/* Step 1: File Selection */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Content Type */}
            <div style={{ marginBottom: spacing.lg }}>
              <label style={{ color: '#888', display: 'block', marginBottom: spacing.sm }}>
                Content Type
              </label>
              <div style={{
                display: 'flex',
                gap: spacing.sm,
                flexWrap: 'wrap'
              }}>
                {['video', 'audio', 'image', 'game', 'document'].map(type => (
                  <button
                    key={type}
                    onClick={() => setContentType(type)}
                    style={{
                      padding: `${spacing.sm} ${spacing.lg}`,
                      background: contentType === type ? '#FF3366' : '#1a1a1a',
                      border: 'none',
                      borderRadius: '30px',
                      color: contentType === type ? 'white' : '#888',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      fontSize: fontSize.sm
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? '#FF3366' : '#333'}`,
                borderRadius: '15px',
                padding: spacing.xxl,
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragActive ? 'rgba(255,51,102,0.1)' : '#1a1a1a',
                transition: 'all 0.3s',
                marginBottom: spacing.lg
              }}
            >
              <input {...getInputProps()} />
              <div style={{ fontSize: '4rem', marginBottom: spacing.md }}>
                {isDragActive ? '📂' : '📁'}
              </div>
              <h3 style={{ marginBottom: spacing.sm }}>
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </h3>
              <p style={{ color: '#888', marginBottom: spacing.sm }}>
                or click to browse
              </p>
              <p style={{ color: '#666', fontSize: fontSize.xs }}>
                Supports: MP4, MOV, MP3, JPG, PNG, ZIP, PDF (up to 1GB)
              </p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div style={{ marginBottom: spacing.lg }}>
                <h3 style={{ marginBottom: spacing.md }}>Selected Files ({files.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                  {files.map(file => (
                    <div
                      key={file.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md,
                        padding: spacing.md,
                        background: '#1a1a1a',
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#2a2a2a',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem'
                      }}>
                        {contentType === 'video' ? '🎬' : 
                         contentType === 'audio' ? '🎵' : 
                         contentType === 'image' ? '🖼️' : '📄'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold' }}>{file.file.name}</div>
                        <div style={{ color: '#888', fontSize: fontSize.xs }}>
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#FF3366',
                          fontSize: fontSize.lg,
                          cursor: 'pointer'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setCurrentStep(2)}
                disabled={files.length === 0}
                style={{
                  padding: `${spacing.md} ${spacing.xl}`,
                  background: files.length === 0 ? '#2a2a2a' : '#FF3366',
                  border: 'none',
                  borderRadius: '30px',
                  color: files.length === 0 ? '#666' : 'white',
                  fontSize: fontSize.md,
                  fontWeight: '600',
                  cursor: files.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Continue to Details →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Metadata */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: spacing.xl,
              marginBottom: spacing.lg
            }}>
              <h3 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
                Content Details
              </h3>

              {/* Title */}
              <div style={{ marginBottom: spacing.lg }}>
                <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={metadata.title}
                  onChange={handleInputChange}
                  placeholder="Enter a catchy title"
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    background: '#2a2a2a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: fontSize.md
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: spacing.lg }}>
                <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={metadata.description}
                  onChange={handleInputChange}
                  placeholder="Describe your content"
                  rows="5"
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    background: '#2a2a2a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: fontSize.md,
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Category and Language */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: spacing.md,
                marginBottom: spacing.lg
              }}>
                <div>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Category
                  </label>
                  <select
                    name="category"
                    value={metadata.category}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: fontSize.md
                    }}
                  >
                    <option value="">Select category</option>
                    {categories[contentType]?.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Language
                  </label>
                  <select
                    name="language"
                    value={metadata.language}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: fontSize.md
                    }}
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div style={{ marginBottom: spacing.lg }}>
                <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={metadata.tags.join(', ')}
                  onChange={handleInputChange}
                  placeholder="gaming, tutorial, funny, music"
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    background: '#2a2a2a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: fontSize.md
                  }}
                />
              </div>

              {/* Age Restriction */}
              <div style={{ marginBottom: spacing.lg }}>
                <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                  Age Restriction
                </label>
                <select
                  name="ageRestriction"
                  value={metadata.ageRestriction}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    background: '#2a2a2a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: fontSize.md
                  }}
                >
                  <option value="all">All ages</option>
                  <option value="13+">13+</option>
                  <option value="18+">18+</option>
                </select>
              </div>

              {/* Visibility */}
              <div style={{ marginBottom: spacing.lg }}>
                <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                  Visibility
                </label>
                <select
                  name="visibility"
                  value={metadata.visibility}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    background: '#2a2a2a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: fontSize.md
                  }}
                >
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="private">Private</option>
                </select>
              </div>

              {/* License */}
              <div style={{ marginBottom: spacing.lg }}>
                <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                  License
                </label>
                <select
                  name="license"
                  value={metadata.license}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    background: '#2a2a2a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: fontSize.md
                  }}
                >
                  <option value="standard">Standard License</option>
                  <option value="creative_commons">Creative Commons</option>
                  <option value="copyright">All Rights Reserved</option>
                </select>
              </div>

              {/* Allow Comments/Downloads */}
              <div style={{
                display: 'flex',
                gap: spacing.xl,
                marginBottom: spacing.lg
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="allowComments"
                    checked={metadata.allowComments}
                    onChange={handleInputChange}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ color: '#888' }}>Allow comments</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="allowDownloads"
                    checked={metadata.allowDownloads}
                    onChange={handleInputChange}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ color: '#888' }}>Allow downloads</span>
                </label>
              </div>

              {/* Monetization */}
              <div style={{
                padding: spacing.lg,
                background: '#2a2a2a',
                borderRadius: '10px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="isFree"
                    checked={metadata.isFree}
                    onChange={handleInputChange}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ color: '#888' }}>Make this content free</span>
                </label>

                {!metadata.isFree && (
                  <div style={{ marginTop: spacing.md }}>
                    <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={metadata.price}
                      onChange={handleInputChange}
                      min="0.99"
                      step="0.01"
                      style={{
                        width: '200px',
                        padding: spacing.md,
                        background: '#2a2a2a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: fontSize.md
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  padding: `${spacing.md} ${spacing.xl}`,
                  background: '#2a2a2a',
                  border: 'none',
                  borderRadius: '30px',
                  color: 'white',
                  fontSize: fontSize.md,
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                style={{
                  padding: `${spacing.md} ${spacing.xl}`,
                  background: '#FF3366',
                  border: 'none',
                  borderRadius: '30px',
                  color: 'white',
                  fontSize: fontSize.md,
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Continue to Upload →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Upload */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: spacing.xxl,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: spacing.lg }}>
                {uploadSuccess ? '✅' : uploading ? '⏳' : '📤'}
              </div>

              <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.md }}>
                {uploadSuccess ? 'Upload Complete!' : 
                 uploading ? 'Uploading...' : 
                 'Ready to Upload'}
              </h2>

              <p style={{ color: '#888', marginBottom: spacing.lg }}>
                {uploadSuccess ? 'Your content has been uploaded successfully' :
                 uploading ? `${files.length} file(s) being uploaded` :
                 `You're about to upload ${files.length} file(s)`}
              </p>

              {uploading && (
                <div style={{ marginBottom: spacing.lg }}>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#2a2a2a',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: spacing.sm
                  }}>
                    <div
                      style={{
                        width: `${uploadProgress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #FF3366, #4FACFE)',
                        transition: 'width 0.3s'
                      }}
                    />
                  </div>
                  <p style={{ color: '#FF3366' }}>{Math.round(uploadProgress)}% complete</p>
                </div>
              )}

              {uploadError && (
                <div style={{
                  padding: spacing.md,
                  background: 'rgba(255,51,102,0.1)',
                  border: '1px solid #FF3366',
                  borderRadius: '8px',
                  color: '#FF3366',
                  marginBottom: spacing.lg
                }}>
                  {uploadError}
                </div>
              )}

              {!uploading && !uploadSuccess && (
                <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center' }}>
                  <button
                    onClick={() => setCurrentStep(2)}
                    style={{
                      padding: `${spacing.md} ${spacing.xl}`,
                      background: '#2a2a2a',
                      border: 'none',
                      borderRadius: '30px',
                      color: 'white',
                      fontSize: fontSize.md,
                      cursor: 'pointer'
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleUpload}
                    style={{
                      padding: `${spacing.md} ${spacing.xl}`,
                      background: '#FF3366',
                      border: 'none',
                      borderRadius: '30px',
                      color: 'white',
                      fontSize: fontSize.md,
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Start Upload
                  </button>
                </div>
              )}

              {uploadSuccess && (
                <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      setFiles([]);
                      setMetadata({
                        title: '',
                        description: '',
                        category: '',
                        tags: [],
                        language: 'en',
                        ageRestriction: 'all',
                        visibility: 'public',
                        allowComments: true,
                        allowDownloads: true,
                        license: 'standard',
                        price: 0,
                        isFree: true
                      });
                      setCurrentStep(1);
                      setUploadSuccess(false);
                    }}
                    style={{
                      padding: `${spacing.md} ${spacing.xl}`,
                      background: '#2a2a2a',
                      border: 'none',
                      borderRadius: '30px',
                      color: 'white',
                      fontSize: fontSize.md,
                      cursor: 'pointer'
                    }}
                  >
                    Upload More
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                      padding: `${spacing.md} ${spacing.xl}`,
                      background: '#FF3366',
                      border: 'none',
                      borderRadius: '30px',
                      color: 'white',
                      fontSize: fontSize.md,
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Go to Dashboard
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Upload;