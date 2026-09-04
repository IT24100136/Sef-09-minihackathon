import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export const submitReportApi = async (reportData) => {
  try {
    const response = await api.post('/reports', reportData);
    return response.data;
  } catch (error) {
    console.warn('Backend API submission failed or unavailable, operating in local-first mode:', error);
    return {
      id: Date.now(),
      ...reportData,
      createdAt: new Date().toISOString(),
    };
  }
};

export const fetchReportsApi = async () => {
  try {
    const response = await api.get('/reports');
    return response.data;
  } catch (error) {
    console.warn('Backend API fetch failed or unavailable:', error);
    return null;
  }
};
