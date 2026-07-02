import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useAuthStore from './context/authStore.js';
import useThemeStore from './context/themeStore.js';
import ProtectedRoute, { GuestRoute } from './components/auth/ProtectedRoute.jsx';

// 🌟 Import the custom ThemeToggle component
import ThemeToggle from './components/ui/ThemeToggle.jsx';

// Pages Matrix
import Login         from './pages/Login.jsx';
import Register      from './pages/Register.jsx';
import Chat          from './pages/Chat.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import VerifyEmail   from './pages/VerifyEmail.jsx';

const App = () => {
  // Safe extraction to monitor authorization recovery phase
  const { fetchMe, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => { 
    if (typeof fetchMe === 'function') {
      fetchMe(); 
    }
  }, [fetchMe]);

  // ⏳ Global Pre-loader Layer: Prevents UI jumps or flash locks while validating cookies/tokens
  if (isCheckingAuth) {
    return (
      <div className={`min-h-screen w-screen flex flex-col items-center justify-center transition-colors duration-200 ${theme === 'dark' ? 'bg-[#0f0f1a] text-[#f1f1f9]' : 'bg-[#f8f9fa] text-[#0f0f1a]'}`}>
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono tracking-widest opacity-70 animate-pulse uppercase">
          Initializing Chatify Node Protocols...
        </p>
      </div>
    );
  }
  return (
    <BrowserRouter>
    {/* 🌟 Global Theme Toggle Button Control — Rendered across ALL paths */}
    <ThemeToggle />
      {/* Dynamic Toast Network Context matching Theme parameters */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: theme === 'dark' ? '#16162a' : '#ffffff',
            color: theme === 'dark' ? '#f1f1f9' : '#0f0f1a',
            border: theme === 'dark' ? '1px solid #2a2a42' : '1px solid #e4e4f0',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          },
          success: { iconTheme: { primary: '#6c44f1', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      
      <Routes>
        {/*  1. Guest-only Routes (If user token exists, auto-redirect to dashboard) */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/reset-password/:token" element={<GuestRoute><ResetPassword /></GuestRoute>} />

        {/* 🔗 2. Public Route Matrix */}
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/*  3. Operational Protected Workspace Core */}
        <Route path="/" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

        {/*  4. Wildcard Overwrite Fallback Redirect Node */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App