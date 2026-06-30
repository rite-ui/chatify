import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Zap, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api.js';
import Input from '../components/ui/Input.jsx';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    
    setLoading(true);
    try {
      await authAPI.resetPassword(token, form.password);
      toast.success('Password reset! Please log in. 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
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
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 text-white shadow-md shadow-brand-500/20 mb-3.5">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-(--text-primary)">
            New Password
          </h1>
          <p className="text-(--text-muted) mt-1 text-xs font-medium">
            Establish new security parameters for your account
          </p>
        </div>

        {/* Core Card Container */}
        <div className="bg-(--bg-card) border border-(--border) rounded-2xl p-7 shadow-xl backdrop-blur-xl transition-all">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <Input
              label="New Password"
              type={showPw ? 'text' : 'password'}
              icon={Lock}
              placeholder="min 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              rightIcon={
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  className="text-(--text-muted) hover:text-(--text-primary) p-0.5 focus:outline-none transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              placeholder="repeat password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
            />

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-xl py-2.5 font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 disabled:pointer-events-none mt-4 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span>Resetting...</span>
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

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

export default ResetPassword;