import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Zap, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api.js';
import Input from '../components/ui/Input.jsx';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset email sent! 📨');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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
            Reset Password
          </h1>
          <p className="text-(--text-muted) mt-1 text-xs font-medium">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* Core Card Container */}
        <div className="bg-(--bg-card) border border-(--border) rounded-2xl p-7 shadow-xl backdrop-blur-xl transition-all">
          {sent ? (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center text-xl animate-bounce">
                ✉️
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-(--text-primary)">Check your inbox</h3>
                <p className="text-xs text-(--text-muted) leading-relaxed">
                  We've sent a password reset link to <strong className="text-brand-500">{email}</strong>
                </p>
              </div>
              <div className="pt-2">
                <Link to="/login" className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-xl py-2.5 font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98">
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 disabled:pointer-events-none mt-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <span>Sending link...</span>
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

          {/* Footer Navigation */}
          <div className="mt-6 pt-4 border-t border-(--border)/50 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-(--text-muted) hover:text-(--text-primary) transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to login</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;