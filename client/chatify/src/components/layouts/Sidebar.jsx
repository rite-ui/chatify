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
  const { conversations, fetchConversations, activeConversation, setActiveConversation, loading } = useChatStore();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showNew, setShowNew] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { 
    if (fetchConversations) {
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
      {/* ✅ FIXED: Tailwind CSS bracket variables syntax applied safely */}
      <div className="w-[300px] lg:w-[320px] flex flex-col border-r border-[var(--border)] bg-[var(--bg-card)] shrink-0 h-full">
        
        {/* Header */}
        <div className="px-4 py-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-[var(--text-primary)]">Chatify</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={toggleTheme} className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="Toggle theme">
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>
              <button onClick={() => setShowNew(true)} className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="New conversation">
                <Plus className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search conversations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-brand-500/50 text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors"
            />
          </div>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
          {loading ? (
            <div className="space-y-2 px-2 py-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-[var(--bg-secondary)] rounded animate-pulse w-3/4" />
                    <div className="h-2.5 bg-[var(--bg-secondary)] rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-center px-4">
              <MessageSquare className="w-10 h-10 text-[var(--text-muted)] opacity-40" />
              <p className="text-sm text-[var(--text-muted)]">
                {search ? 'No conversations match your search' : 'No conversations yet'}
              </p>
              {!search && (
                <button onClick={() => setShowNew(true)} className="bg-brand-600 hover:bg-brand-700 text-white text-xs px-4 py-2 rounded-xl shadow-md transition-all">
                  Start a conversation
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((conv) => (
                <motion.div
                  key={conv._id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
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

        {/* User footer (Fallback Added for Ritesh Dev username profile tracking) */}
        <div className="px-3 py-3 border-t border-[var(--border)] flex items-center gap-2 bg-[var(--bg-card)]">
          <button onClick={() => setShowProfile(true)} className="flex items-center gap-2 flex-1 min-w-0 rounded-xl p-2 hover:bg-[var(--bg-secondary)] transition-colors text-left">
            <Avatar user={user || { username: "Ritesh Dev" }} size="sm" showStatus />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                {user?.username || "Ritesh Dev"}
              </p>
              <p className="text-xs text-[var(--text-muted)] truncate">
                {user?.bio || 'Full Stack Node Active…'}
              </p>
            </div>
          </button>
          <button onClick={logout} title="Logout" className="p-2 rounded-xl text-[var(--text-muted)] hover:text-red-500 transition-colors">
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