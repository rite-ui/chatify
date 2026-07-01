import { create } from 'zustand';
import { authAPI } from '../services/api.js';
import { initSocket, disconnectSocket } from '../services/socket.js';

const useAuthStore = create((set, ) => ({
  user:      null,
  token:     localStorage.getItem('token'),
  loading:   false,
  error:     null,

  setUser: (user) => set({ user }),

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.login(credentials);
      localStorage.setItem('token', data.token);
      initSocket(data.token);
      set({ user: data.user, token: data.token, loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const { data: res } = await authAPI.register(data);
      localStorage.setItem('token', res.token);
      initSocket(res.token);
      set({ user: res.user, token: res.token, loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  logout: async () => {
    try { await authAPI.logout(); } catch {}
    localStorage.removeItem('token');
    disconnectSocket();
    set({ user: null, token: null });
  },

  fetchMe: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    set({ loading: true });
    try {
      const { data } = await authAPI.getMe();
      initSocket(token);
      set({ user: data.user, loading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  },

  updateProfile: async (profileData) => {
    try {
      const { data } = await authAPI.updateProfile(profileData);
      set({ user: data.user });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
