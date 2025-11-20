import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Lesson endpoints
export const lessonAPI = {
  getAllLessons: (level) => api.get('/lessons', { params: { level } }),
  getLessonsByLevel: (level) => api.get(`/lessons/level/${level}`),
  getLesson: (identifier) => api.get(`/lessons/${identifier}`),
};

// Progress endpoints
export const progressAPI = {
  getProgress: () => api.get('/progress'),
  getLessonProgress: (lessonId) => api.get(`/progress/lesson/${lessonId}`),
  updateProgress: (lessonId, data) => api.post(`/progress/lesson/${lessonId}`, data),
  saveExerciseResult: (data) => api.post('/progress/exercise', data),
  getExerciseHistory: (lessonId) => api.get(`/progress/exercise/${lessonId}`),
};

export default api;
