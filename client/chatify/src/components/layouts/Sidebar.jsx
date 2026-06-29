import { useEffect, useState } from 'react';
import { Plus, Search, LogOut, Sun, Moon, Zap, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useChatStore from '../../context/chatStore.js';
import useAuthStore from '../../context/authStore.js';
import useThemeStore from '../../context/themeStore.js';
import ConversationItem from '../chat/ConversationItem.jsx';
import NewConversationModal from '../chat/NewConversationModel.jsx';
import ProfileModal from './ProfileModal.jsx';
import Avatar from '../ui/Avatar.jsx';

const Sidebar = () => {
  const { conversations = [], fetchConversations, activeConversation, setActiveConversation, loading } = useChatStore() || {};
  const { user, logout } = useAuthStore() || {};
  const { theme, toggleTheme } = useThemeStore() || {};
  const [showNew, setShowNew] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (typeof fetchConversations === 'function') {
      fetchConversations();
    }
  }, [fetchConversations]);

  const filtered = conversations.filter((c) => {
    if (!search) return true;
    const other = c.participants?.find((p) => p._id !== (user?._id || "ME"));
    const name = c.type === 'group' ? c.name : other?.username || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <div className="w-75 lg:w-[320px] flex flex-col border-r border-(--border) bg-(--bg-card) shrink-0 h-full transition-colors duration-200">
        
        {/* ─── 🔥 FIXED BRAND LOGO HEADER BLOCK ─── */}
        <div className="px-5 py-4 border-b border-(--border)">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              {/* ✅ FIXED: Added rich solid brand color layers so Zap icon is fully visible in Light/Dark mode */}
              <div className="w-8.5 h-8.5 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                <Zap className="w-4.5 h-4.5 fill-current text-white animate-pulse" />
              </div>
              <span className="font-display font-black text-xl tracking-tight text-(--text-primary)">
                Chatify
              </span>
            </div>
            
            {/* System Actions */}
            <div className="flex items-center gap-1">
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-xl text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-secondary) transition-all active:scale-95" 
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>
              <button 
                onClick={() => setShowNew(true)} 
                className="p-2 rounded-xl text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-secondary) transition-all active:scale-95" 
                title="New conversation"
              >
                <Plus className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Clean Glassmorphic Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" />
            <input
              type="text"
              placeholder="Search conversations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 bg-(--bg-primary) border border-(--border) rounded-xl text-xs font-medium focus:outline-none focus:border-brand-500/50 text-(--text-primary) placeholder-(--text-muted) transition-all"
            />
          </div>
        </div>

        {/* Conversations Scroll Stream Container */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {loading ? (
            <div className="space-y-2 px-2 py-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-transparent">
                  <div className="w-10 h-10 rounded-full bg-(--bg-secondary) animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="h-3 bg-(--bg-secondary) rounded animate-pulse w-3/4" />
                    <div className="h-2.5 bg-(--bg-secondary) rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-center px-4">
              <div className="w-10 h-10 rounded-xl bg-(--bg-secondary) flex items-center justify-center border border-(--border)">
                <MessageSquare className="w-5 h-5 text-(--text-muted) opacity-60" />
              </div>
              <p className="text-xs font-medium text-(--text-muted) max-w-50">
                {search ? 'No data pipelines match your criteria.' : 'No active messaging nodes available.'}
              </p>
              {!search && (
                <button 
                  onClick={() => setShowNew(true)} 
                  className="bg-brand-600 hover:bg-brand-700 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition-all active:scale-95"
                >
                  Start conversation
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((conv) => (
                <motion.div
                  key={conv._id}
                  layout
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                >
                  <ConversationItem
                    conversation={conv}
                    isActive={activeConversation?._id === conv._id}
                    onClick={() => setActiveConversation(conv)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* User Interactive Footer Container Area */}
        <div className="px-3 py-3 border-t border-(--border) flex items-center gap-2 bg-(--bg-card) shrink-0 z-10">
          <button 
            onClick={() => setShowProfile(true)} 
            className="flex items-center gap-2 flex-1 min-w-0 rounded-xl p-2 hover:bg-(--bg-secondary) transition-all active:scale-98 text-left group"
          >
            <Avatar user={user || { username: "Ritesh Dev" }} size="sm" showStatus />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-(--text-primary) truncate group-hover:text-brand-500 transition-colors">
                {user?.username || "Ritesh Dev"}
              </p>
              <p className="text-[11px] font-medium text-(--text-muted) truncate mt-0.5">
                {user?.bio || 'Full Stack Pipeline Active…'}
              </p>
            </div>
          </button>
          <button 
            onClick={logout} 
            title="Logout Stream" 
            className="p-2.5 rounded-xl text-(--text-muted) hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <NewConversationModal isOpen={showNew} onClose={() => setShowNew(false)} />
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
};

export default Sidebar;