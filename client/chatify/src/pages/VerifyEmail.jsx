import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowLeft, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { authAPI } from '../services/api.js';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    authAPI.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  // ✅ Object Mapping system with Lucide Icons and updated premium copy text
  const states = {
    loading: { 
      icon: <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto" />, 
      title: 'Verifying your email…', 
      sub: 'Synchronizing account signature parameters with server database.' 
    },
    success: { 
      icon: <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />, 
      title: 'Email verified!', 
      sub: 'Your communication matrix is now active. Authorization token cleared successfully.' 
    },
    error: { 
      icon: <XCircle className="w-10 h-10 text-red-500 mx-auto" />, 
      title: 'Verification failed', 
      sub: 'The link token has expired, modified, or passed its operational registry lifespan.' 
    },
  };

  const s = states[status];

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-(--bg-primary) text-(--text-primary) p-4 relative overflow-hidden transition-colors duration-200">
      
      {/* Background Aura Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-800/15 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10"
      >
        {/* Brand Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 mb-3.5">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-(--text-primary)">
            Chatify
          </h1>
        </div>

        {/* Core Content Glass Card Container */}
        <div className="bg-(--bg-card) border border-(--border) rounded-2xl p-8 shadow-xl backdrop-blur-xl text-center transition-all">
          
          {/* Dynamic Render Node Area */}
          <div className="py-4 space-y-4">
            <div className="mb-2">{s.icon}</div>
            <h2 className="text-base font-bold tracking-tight text-(--text-primary)">{s.title}</h2>
            <p className="text-(--text-muted) text-xs leading-relaxed px-4">{s.sub}</p>
          </div>

          {/* Action Dynamic Submit Controller */}
          <div className="mt-6 pt-2">
            {status === 'error' ? (
              <Link 
                to="/register" 
                className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-xl py-2.5 font-bold text-xs shadow-sm flex items-center justify-center transition-all active:scale-98"
              >
                Try Registering Again
              </Link>
            ) : (
              <Link 
                to="/login" 
                className={`w-full bg-brand-600 hover:bg-brand-700 text-white rounded-xl py-2.5 font-bold text-xs shadow-sm flex items-center justify-center transition-all active:scale-98 ${status === 'loading' ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Go to Login
              </Link>
            )}
          </div>

          {/* Fallback Footer back node redirection */}
          <div className="mt-6 pt-4 border-t border-(--border)/50 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-(--text-muted) hover:text-(--text-primary) transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;