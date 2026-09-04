import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Reports API Helpers
export const submitReportApi = async (reportData) => {
  const response = await api.post('/reports', reportData);
  return response.data;
};

export const fetchReportsApi = async () => {
  const response = await api.get('/reports');
  return response.data;
};

export const updateReportApi = async (id, updateData) => {
  const response = await api.put(`/reports/${id}`, updateData);
  return response.data;
};

export const deleteReportApi = async (id) => {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
};

// Schedules API Helpers
export const fetchSchedulesApi = async () => {
  const response = await api.get('/schedules');
  return response.data;
};

export const createScheduleApi = async (scheduleData) => {
  const response = await api.post('/schedules', scheduleData);
  return response.data;
};

export const updateScheduleApi = async (id, updateData) => {
  const response = await api.put(`/schedules/${id}`, updateData);
  return response.data;
};

export const deleteScheduleApi = async (id) => {
  const response = await api.delete(`/schedules/${id}`);
  return response.data;
};

export default api;