// Central API configuration
// On Vercel: set VITE_API_BASE_URL in Vercel Environment Variables
// On local: set in .env.local file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export default API_BASE_URL;
