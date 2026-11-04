import api from './api';

export const authService = {
  signup: async (payload) => {
    return await api.post('/auth/signup', payload);
  },
  login: async (payload) => {
    return await api.post('/auth/login', payload);
  },
  getMe: async () => {
    return await api.get('/auth/me');
  },
  logout: async () => {
    return await api.post('/auth/logout');
  },
};

