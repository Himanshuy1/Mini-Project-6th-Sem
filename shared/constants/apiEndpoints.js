const BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
  : 'http://localhost:5000';

export const API_BASE_URL = `${BASE}/api`;
export const NEWS_ENDPOINT = '/news';
export const REFRESH_ENDPOINT = '/news/refresh';
export const VERIFY_ENDPOINT = '/news/verify';
