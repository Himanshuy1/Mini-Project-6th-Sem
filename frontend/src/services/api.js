import axios from 'axios';
import { API_BASE_URL } from '../../../shared/constants/apiEndpoints.js';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptors here if needed for auth tokens

export default api;
