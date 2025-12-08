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
    // Only clear auth and redirect if this is an authenticated request that failed
    // Don't redirect for guest users accessing public content
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      // User had a token but it's invalid/expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if we're on a protected page
      const protectedRoutes = ['/dashboard', '/profile'];
      const currentPath = window.location.pathname;
      if (protectedRoutes.some(route => currentPath.startsWith(route))) {
        window.location.href = '/login';
      }
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
