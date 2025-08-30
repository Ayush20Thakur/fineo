// API configuration for different environments
const getApiBase = () => {
  // In production (Vercel), use relative API routes
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return '/api';
  }
  
  // In development, use local server
  return 'http://localhost:8000';
};

export const API_BASE = getApiBase();

// Export for use in components
export default API_BASE;
