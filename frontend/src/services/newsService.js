import api from './api';
import { NEWS_ENDPOINT, REFRESH_ENDPOINT } from '../../../shared/constants/apiEndpoints.js';

export const getNews = async (filters = {}) => {
  try {
    const { data } = await api.get(NEWS_ENDPOINT, { params: filters });
    return data;
  } catch (error) {
    throw error;
  }
};

export const refreshNews = async (category = 'general') => {
  try {
    const { data } = await api.post(REFRESH_ENDPOINT, { category });
    return data;
  } catch (error) {
    throw error;
  }
};

export const verifyManualNews = async (formData) => {
  try {
    const { data } = await api.post('/news/verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
