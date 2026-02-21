// Redirect handler utility
export const redirectHandler = {
  // Store intended destination
  setRedirect(destination) {
    if (destination) {
      localStorage.setItem('redirectAfterLogin', destination);
      console.log('📍 Redirect set:', destination);
    }
  },

  // Get and clear redirect
  getRedirect() {
    const redirect = localStorage.getItem('redirectAfterLogin');
    localStorage.removeItem('redirectAfterLogin');
    return redirect;
  },

  // Handle post-login navigation
  handlePostLogin(navigate, defaultPath = '/dashboard') {
    const redirect = this.getRedirect();
    if (redirect) {
      console.log('➡️ Redirecting to:', redirect);
      navigate(redirect);
    } else {
      console.log('➡️ Redirecting to default:', defaultPath);
      navigate(defaultPath);
    }
  },

  // Clear redirect
  clearRedirect() {
    localStorage.removeItem('redirectAfterLogin');
  }
};