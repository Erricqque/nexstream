import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Upload = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'video',
    category: '',
    tags: '',
    price: 0,
    isFree: true,
    thumbnail: null,
    file: null
  });

  // Preview URLs
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // Categories based on content type
  const categories = {
    video: ['Gaming', 'Music', 'Education', 'Entertainment', 'Sports', 'News', 'Technology', 'Lifestyle'],
    music: ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country'],
    game: ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Puzzle', 'Multiplayer', 'Arcade'],
    image: ['Photography', 'Art', 'Design', 'Illustration', '3D', 'Wallpaper'],
    document: ['E-book', 'PDF', 'Template', 'Resource']
  };

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Reset price if isFree is checked
    if (name === 'isFree' && checked) {
      setFormData(prev => ({ ...prev, price: 0 }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (!file) return;

    // Validate file size (max 500MB for videos, 100MB for others)
    const maxSize = formData.contentType === 'video' ? 500 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(`File too large. Max size: ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setFormData(prev => ({ ...prev, [name]: file }));
    setUploadError('');

    // Create preview
    if (name === 'thumbnail') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (name === 'file') {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        setFilePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.file) {
      setUploadError('Please fill all required fields');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError('');

    try {
      // 1. Upload file to Supabase Storage
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `content/${formData.contentType}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('content')
        .upload(filePath, formData.file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percent));
          }
        });

      if (uploadError) throw uploadError;

      // 2. Upload thumbnail if exists
      let thumbnailPath = null;
      if (formData.thumbnail) {
        const thumbExt = formData.thumbnail.name.split('.').pop();
        const thumbName = `${user.id}/thumbnails/${Date.now()}.${thumbExt}`;
        const { error: thumbError } = await supabase.storage
          .from('content')
          .upload(thumbName, formData.thumbnail);
        
        if (!thumbError) {
          thumbnailPath = thumbName;
        }
      }

      // 3. Get public URLs
      const { data: { publicUrl } } = supabase.storage
        .from('content')
        .getPublicUrl(filePath);

      const thumbnailUrl = thumbnailPath 
        ? supabase.storage.from('content').getPublicUrl(thumbnailPath).data.publicUrl 
        : null;

      // 4. Save metadata to database
      const { error: dbError } = await supabase
        .from('content')
        .insert([{
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          content_type: formData.contentType,
          category: formData.category,
          tags: formData.tags.split(',').map(tag => tag.trim()),
          price: formData.isFree ? 0 : formData.price,
          is_free: formData.isFree,
          file_url: publicUrl,
          thumbnail_url: thumbnailUrl,
          file_size: formData.file.size,
          file_type: formData.file.type,
          status: 'pending', // Needs review
          views_count: 0,
          likes_count: 0,
          downloads_count: 0
        }]);

      if (dbError) throw dbError;

      setUploadSuccess(true);
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

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #ff3366',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: 'white',
      padding: '40px 20px'
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
      `}</style>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ marginBottom: '40px' }}
        >
          <h1 style={{ 
            fontSize: '3rem', 
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #ff3366, #4facfe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Upload Content
          </h1>
          <p style={{ color: '#888' }}>
            Share your creativity with the world. Upload videos, music, games, and more.
          </p>
        </motion.div>

        {/* Upload Form */}
        <motion.form
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          style={{
            background: 'rgba(20,20,30,0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '30px',
            padding: '40px',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}
        >
          {/* Progress Bar */}
          <AnimatePresence>
            {uploading && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  marginBottom: '30px',
                  padding: '20px',
                  background: 'rgba(255,51,102,0.1)',
                  borderRadius: '15px',
                  border: '1px solid rgba(255,51,102,0.2)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Uploading... {uploadProgress}%</span>
                  <span style={{ color: '#ff3366' }}>{uploadProgress}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #ff3366, #4facfe)',
                      borderRadius: '3px'
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {uploadSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  marginBottom: '30px',
                  padding: '20px',
                  background: 'rgba(67, 233, 123, 0.1)',
                  borderRadius: '15px',
                  border: '1px solid rgba(67, 233, 123, 0.2)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎉</div>
                <h3 style={{ color: '#43e97b' }}>Upload Successful!</h3>
                <p style={{ color: '#888' }}>Redirecting to dashboard...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {uploadError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  marginBottom: '30px',
                  padding: '20px',
                  background: 'rgba(255,51,102,0.1)',
                  borderRadius: '15px',
                  border: '1px solid rgba(255,51,102,0.2)',
                  color: '#ff3366',
                  textAlign: 'center'
                }}
              >
                {uploadError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Fields */}
          <div style={{ display: 'grid', gap: '25px' }}>
            {/* Content Type Selection */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#888' }}>
                Content Type *
              </label>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {['video', 'music', 'game', 'image', 'document'].map(type => (
                  <motion.label
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '10px 20px',
                      background: formData.contentType === type 
                        ? 'linear-gradient(135deg, #ff3366, #4facfe)'
                        : 'rgba(255,255,255,0.05)',
                      borderRadius: '30px',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      border: formData.contentType === type 
                        ? 'none'
                        : '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <input
                      type="radio"
                      name="contentType"
                      value={type}
                      checked={formData.contentType === type}
                      onChange={handleInputChange}
                      style={{ display: 'none' }}
                    />
                    {type}
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#888' }}>
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter a catchy title"
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem'
                }}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#888' }}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your content"
                rows="5"
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            {/* Category Selection */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#888' }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem'
                }}
                required
              >
                <option value="">Select a category</option>
                {categories[formData.contentType]?.map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#888' }}>
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., gaming, tutorial, funny"
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Price Toggle */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isFree"
                  checked={formData.isFree}
                  onChange={handleInputChange}
                  style={{ width: '20px', height: '20px' }}
                />
                <span style={{ color: '#888' }}>Make this content free</span>
              </label>
            </div>

            {/* Price (if not free) */}
            {!formData.isFree && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label style={{ display: 'block', marginBottom: '10px', color: '#888' }}>
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0.99"
                  step="0.01"
                  placeholder="0.00"
                  style={{
                    width: '200px',
                    padding: '15px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </motion.div>
            )}

            {/* Thumbnail Upload */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#888' }}>
                Thumbnail Image
              </label>
              <div style={{
                border: '2px dashed rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: '30px',
                textAlign: 'center',
                cursor: 'pointer',
                background: thumbnailPreview ? 'none' : 'rgba(0,0,0,0.2)'
              }}
              onClick={() => document.getElementById('thumbnailInput').click()}
              >
                <input
                  id="thumbnailInput"
                  type="file"
                  name="thumbnail"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                {thumbnailPreview ? (
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview"
                    style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '10px' }}
                  />
                ) : (
                  <>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🖼️</div>
                    <p>Click to upload thumbnail (optional)</p>
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>Recommended: 1280x720</p>
                  </>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: '#888' }}>
                Content File *
              </label>
              <div style={{
                border: '2px dashed rgba(255,51,102,0.3)',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                cursor: 'pointer',
                background: formData.file ? 'rgba(255,51,102,0.05)' : 'rgba(0,0,0,0.2)',
                transition: 'all 0.3s'
              }}
              onClick={() => document.getElementById('fileInput').click()}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#ff3366'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,51,102,0.3)'}
              >
                <input
                  id="fileInput"
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  accept={
                    formData.contentType === 'video' ? 'video/*' :
                    formData.contentType === 'music' ? 'audio/*' :
                    formData.contentType === 'image' ? 'image/*' :
                    formData.contentType === 'game' ? '.zip,.html' :
                    '*/*'
                  }
                  style={{ display: 'none' }}
                  required
                />
                {filePreview ? (
                  formData.contentType === 'video' ? (
                    <video 
                      src={filePreview} 
                      controls
                      style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px' }}
                    />
                  ) : formData.contentType === 'image' ? (
                    <img 
                      src={filePreview} 
                      alt="Preview"
                      style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '10px' }}
                    />
                  ) : (
                    <>
                      <div style={{ fontSize: '4rem', marginBottom: '10px' }}>📁</div>
                      <p>{formData.file.name}</p>
                      <p style={{ color: '#888', fontSize: '0.9rem' }}>
                        {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </>
                  )
                ) : (
                  <>
                    <div style={{ fontSize: '4rem', marginBottom: '10px' }}>
                      {formData.contentType === 'video' ? '🎬' :
                       formData.contentType === 'music' ? '🎵' :
                       formData.contentType === 'game' ? '🎮' :
                       formData.contentType === 'image' ? '🖼️' : '📄'}
                    </div>
                    <p>Click to upload your {formData.contentType} file</p>
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>
                      Max size: {formData.contentType === 'video' ? '500MB' : '100MB'}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={uploading || uploadSuccess}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '20px',
                fontSize: '1.2rem',
                background: uploading || uploadSuccess
                  ? 'linear-gradient(135deg, #888, #666)'
                  : 'linear-gradient(135deg, #ff3366, #4facfe)',
                border: 'none',
                borderRadius: '15px',
                color: 'white',
                fontWeight: 'bold',
                cursor: uploading || uploadSuccess ? 'not-allowed' : 'pointer',
                marginTop: '20px',
                opacity: uploading || uploadSuccess ? 0.7 : 1
              }}
            >
              {uploading ? 'Uploading...' : 
               uploadSuccess ? 'Upload Successful!' : 
               'Upload Content'}
            </motion.button>
          </div>
        </motion.form>

        {/* Guidelines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: '40px',
            padding: '30px',
            background: 'rgba(20,20,30,0.4)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.03)'
          }}
        >
          <h3 style={{ marginBottom: '20px', color: '#888' }}>Upload Guidelines</h3>
          <div style={{ display: 'grid', gap: '15px', color: '#aaa' }}>
            <div>✅ Content must be original or you must have rights to upload</div>
            <div>✅ No copyrighted material without permission</div>
            <div>✅ No explicit or inappropriate content</div>
            <div>✅ All uploads are reviewed before going public</div>
            <div>✅ You earn 70% of all revenue from your content</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;