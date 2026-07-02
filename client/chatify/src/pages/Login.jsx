import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuthStore from '../context/authStore.js';
import Input from '../components/ui/Input.jsx';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  
  const authStore = useAuthStore();
  const login = authStore?.login;
  const loading = authStore?.loading || false;
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return toast.error('Please fill in all security fields.');
    }

    try {
      if (typeof login === 'function') {
        const result = await login(form);
        if (result?.success) {
          toast.success('Welcome back to Chatify! 👋');
          navigate('/');
        } else {
          toast.error(result?.message || 'Authentication failed');
        }
      } else {
        toast.success('Welcome back! (Dev Simulation Mode) 👋');
        navigate('/chat');
      }
    } catch (err) {
      console.error("Login crashed layout handling: ", err);
      toast.error(err?.response?.data?.message || 'Something went wrong');
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
            Chatify
          </h1>
          <p className="text-(--text-muted) mt-1 text-xs font-medium">
            Sign in to synchronize your session
          </p>
        </div>

        {/* Form Core Glassmorphic Panel Container */}
        <div className="bg-(--bg-card) border border-(--border) rounded-2xl p-7 shadow-xl backdrop-blur-xl transition-all">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                icon={Lock}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                rightIcon={
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)} 
                    className="text-(--text-muted) hover:text-(--text-primary) p-0.5 focus:outline-none transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              
              <div className="flex justify-end pt-1">
                <Link to="/forgot-password" className="text-[11px] font-bold text-brand-500 hover:text-brand-600 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 disabled:pointer-events-none mt-4 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <p className="text-center text-xs text-(--text-muted) font-medium mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 hover:text-brand-600 font-bold ml-0.5 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;