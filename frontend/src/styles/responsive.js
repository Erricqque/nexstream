// Responsive design utilities for NexStream
export const breakpoints = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1280
};

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth <= 480,
    isTablet: window.innerWidth > 480 && window.innerWidth <= 768,
    isLaptop: window.innerWidth > 768 && window.innerWidth <= 1024,
    isDesktop: window.innerWidth > 1024
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 480,
        isTablet: window.innerWidth > 480 && window.innerWidth <= 768,
        isLaptop: window.innerWidth > 768 && window.innerWidth <= 1024,
        isDesktop: window.innerWidth > 1024
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Responsive spacing utility
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px'
};

// Responsive font sizes
export const fontSize = {
  xs: 'clamp(0.75rem, 2vw, 0.875rem)',
  sm: 'clamp(0.875rem, 2.5vw, 1rem)',
  md: 'clamp(1rem, 3vw, 1.25rem)',
  lg: 'clamp(1.25rem, 4vw, 1.5rem)',
  xl: 'clamp(1.5rem, 5vw, 2rem)',
  xxl: 'clamp(2rem, 6vw, 2.5rem)'
};

// Responsive container
export const containerStyle = {
  width: '100%',
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '0 clamp(16px, 5vw, 40px)'
};