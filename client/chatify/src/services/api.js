import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register:       (data) => api.post('/auth/register', data),
  login:          (data) => api.post('/auth/login', data),
  logout:         ()     => api.post('/auth/logout'),
  getMe:          ()     => api.get('/auth/me'),
  verifyEmail:    (token)=> api.get(`/auth/verify-email/${token}`),
  forgotPassword: (email)=> api.post('/auth/forgot-password', { email }),
  resetPassword:  (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  updateProfile:  (data) => api.put('/auth/update-profile', data),
};

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const chatAPI = {
  getConversations:    ()       => api.get('/conversations'),
  createDirect:        (userId) => api.post('/conversations/direct', { userId }),
  createGroup:         (data)   => api.post('/conversations/group', data),
  getMessages:         (id, page=1) => api.get(`/messages/${id}?page=${page}`),
  deleteMessage:       (id)     => api.delete(`/messages/${id}`),
  searchUsers:         (q)      => api.get(`/users/search?q=${encodeURIComponent(q)}`),
};

// ─── AI ───────────────────────────────────────────────────────────────────────
export const aiAPI = {
  chat:           (data)   => api.post('/ai/chat', data),
  summarize:      (convId) => api.get(`/ai/summarize/${convId}`),
  suggestReply:   (convId) => api.get(`/ai/suggest-reply/${convId}`),
};

export default api;
