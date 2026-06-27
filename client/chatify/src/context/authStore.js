import { create } from 'zustand';

// Safe checking taaki agar token string na ho ya corrupt ho toh app crash na kare
const getInitialUser = () => {
  try {
    const savedUser = localStorage.getItem('token');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Failed to parse token/user from localStorage", error);
    return null;
  }
};

const useAuthStore = create((set) => ({
  // 1. Core Authentication States
  user: getInitialUser(), // ✅ FIXED: Ab page refresh karne par bhi user info save rahegi!
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  // 2. Action: Set User Session Manual / Direct Update
  setUser: (user) => {
    // ✅ FIXED: Memory sync ke sath storage sync bhi manage kiya
    if (user) {
      localStorage.setItem('token', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } else {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    }
  },

  // 3. Action: Login Handler Handshake
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      // ⚠️ Note: Future API integration block:
      // const res = await axios.post('/api/auth/login', { email, password });
      // const userData = res.data;

      const mockUserData = {
        _id: 'user_logged_in_luxe',
        username: 'Ritesh Dev',
        email: email || 'ritesh@luxe.com',
        bio: 'MERN Stack Developer',
        avatar: null,
        status: 'online'
      };
      
      localStorage.setItem('token', JSON.stringify(mockUserData));
      set({ user: mockUserData, isAuthenticated: true, loading: false });
      return mockUserData;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // 4. Action: Registration Pipeline
  register: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      // Future API Integration placeholder:
      // const res = await axios.post('/api/auth/register', { username, email, password });
      
      const mockUserData = {
        _id: 'user_logged_in_luxe',
        username: username,
        email: email,
        bio: 'Set a bio…',
        avatar: null,
        status: 'online'
      };
      
      localStorage.setItem('token', JSON.stringify(mockUserData));
      set({ user: mockUserData, isAuthenticated: true, loading: false });
      return mockUserData;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // 5. Action: Logout Stream Termination
  logout: async () => {
    set({ loading: true });
    try {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, loading: false, error: null });
    } catch (err) {
      console.error('Logout stream interrupted:', err);
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  // 6. Action: Update User Profile Cache Info
  updateProfile: (updatedData) => {
    set((state) => {
      if (!state.user) return state;
      const newUser = { ...state.user, ...updatedData };
      localStorage.setItem('token', JSON.stringify(newUser));
      return { user: newUser };
    });
  },

  // 7. Action: Error Clear Utility Node
  clearError: () => set({ error: null })
}));

export default useAuthStore;