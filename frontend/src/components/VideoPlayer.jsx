import React, { useState, useRef, useEffect } from 'react';

const VideoPlayer = ({ src, poster, title }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [pip, setPip] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onVolumeChange = () => setVolume(video.volume);
    const onLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('volumechange', onVolumeChange);
    video.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('volumechange', onVolumeChange);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    setShowControls(true);
    const timeout = setTimeout(() => {
      if (playing) {
        setShowControls(false);
      }
    }, 3000);
    setControlsTimeout(timeout);
  }, [playing, currentTime]);

  const togglePlay = () => {
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const handleSpeedChange = (speed) => {
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const togglePip = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setPip(false);
      } else {
        await videoRef.current.requestPictureInPicture();
        setPip(true);
      }
    } catch (error) {
      console.error('PiP error:', error);
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const skipForward = () => {
    videoRef.current.currentTime += 10;
  };

  const skipBackward = () => {
    videoRef.current.currentTime -= 10;
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#000',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
      onMouseMove={() => {
        setShowControls(true);
        if (controlsTimeout) clearTimeout(controlsTimeout);
        if (playing) {
          const timeout = setTimeout(() => setShowControls(false), 3000);
          setControlsTimeout(timeout);
        }
      }}
      onMouseLeave={() => {
        if (playing) {
          setShowControls(false);
        }
      }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          cursor: showControls ? 'default' : 'none'
        }}
        onClick={togglePlay}
      />

      {/* Big Play Button (shown when paused) */}
      {!playing && !showControls && (
        <div
          onClick={togglePlay}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            background: 'rgba(255,51,102,0.9)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '40px',
            boxShadow: '0 0 30px rgba(255,51,102,0.5)',
            transition: 'all 0.3s'
          }}
        >
          ▶️
        </div>
      )}

      {/* Custom Controls */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
        padding: '20px',
        opacity: showControls ? 1 : 0,
        transition: 'opacity 0.3s',
        pointerEvents: showControls ? 'auto' : 'none'
      }}>
        {/* Progress Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '10px'
        }}>
          <span style={{ color: 'white', fontSize: '0.8rem', minWidth: '45px' }}>
            {formatTime(currentTime)}
          </span>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="range"
              min="0"
              max="100"
              value={(currentTime / duration) * 100 || 0}
              onChange={handleSeek}
              style={{
                width: '100%',
                height: '4px',
                cursor: 'pointer',
                background: `linear-gradient(90deg, #ff3366 ${(currentTime / duration) * 100}%, #444 ${(currentTime / duration) * 100}%)`,
                WebkitAppearance: 'none',
                outline: 'none'
              }}
            />
          </div>
          <span style={{ color: 'white', fontSize: '0.8rem', minWidth: '45px' }}>
            {formatTime(duration)}
          </span>
        </div>

        {/* Control Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <button
            onClick={togglePlay}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '5px 10px',
              borderRadius: '4px'
            }}
          >
            {playing ? '⏸️' : '▶️'}
          </button>

          <button
            onClick={skipBackward}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '5px 10px',
              borderRadius: '4px'
            }}
          >
            ⏪ 10s
          </button>

          <button
            onClick={skipForward}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '5px 10px',
              borderRadius: '4px'
            }}
          >
            10s ⏩
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginLeft: '10px'
          }}>
            <span style={{ color: 'white', fontSize: '1rem' }}>
              {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              style={{
                width: '80px',
                cursor: 'pointer'
              }}
            />
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
            {/* Playback Speed */}
            <select
              value={playbackSpeed}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              style={{
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: '1px solid #444',
                borderRadius: '4px',
                padding: '5px',
                cursor: 'pointer'
              }}
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>

            {/* Picture in Picture */}
            <button
              onClick={togglePip}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '5px 10px',
                borderRadius: '4px'
              }}
            >
              {pip ? '⏏️' : '📺'}
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '5px 10px',
                borderRadius: '4px'
              }}
            >
              ⛶
            </button>
          </div>
        </div>

        {/* Title */}
        {title && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            opacity: showControls ? 1 : 0,
            transition: 'opacity 0.3s'
          }}>
            {title}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;