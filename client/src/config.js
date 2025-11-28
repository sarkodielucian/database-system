// API Configuration
// In production (Vercel), use relative paths since frontend and backend are on same domain
// In development, use localhost
export const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';
