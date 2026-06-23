import { useEffect, useState } from 'react';
import { Plus, Search, Settings, LogOut, Sun, Moon, Zap, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useChatStore from '../../context/chatStore.js';
import useAuthStore from '../../context/authStore.js';
import useThemeStore from '../../context/themeStore.js';
import ConversationItem from '../chat/ConversationItem.jsx';
import NewConversationModal from '../chat/NewConversationModal.jsx';
import ProfileModal from './ProfileModal.jsx';
import Avatar from '../ui/Avatar.jsx';

const Sidebar = () => {
  const { conversations, fetchConversations, activeConversation, setActiveConversation, loading } = useChatStore();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showNew, setShowNew] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  const filtered = conversations.filter((c) => {
    if (!search) return true;
    const other = c.participants?.find((p) => p._id !== user?._id);
    const name = c.type === 'group' ? c.name : other?.username || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <div className="w-[300px] lg:w-[320px] flex flex-col border-r border-[var(--border)] bg-[var(--bg-card)] shrink-0">
        {/* Header */}
        <div className="px-4 py-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-[var(--text-primary)]">ChatApp</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={toggleTheme} className="btn-ghost p-2" title="Toggle theme">
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button onClick={() => setShowNew(true)} className="btn-ghost p-2" title="New conversation">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search conversations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
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
              <MessageSquare className="w-10 h-10 text-[var(--text-muted)]/40" />
              <p className="text-sm text-[var(--text-muted)]">
                {search ? 'No conversations match your search' : 'No conversations yet'}
              </p>
              {!search && (
                <button onClick={() => setShowNew(true)} className="btn-primary text-xs px-4 py-2">
                  <Plus className="w-3 h-3" /> Start a conversation
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

        {/* User footer */}
        <div className="px-3 py-3 border-t border-[var(--border)] flex items-center gap-2">
          <button onClick={() => setShowProfile(true)} className="flex items-center gap-2 flex-1 min-w-0 rounded-xl p-2 hover:bg-[var(--bg-secondary)] transition-colors">
            <Avatar user={user} size="sm" showStatus />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.username}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{user?.bio || 'Set a bio…'}</p>
            </div>
          </button>
          <button onClick={logout} title="Logout" className="btn-ghost p-2 text-[var(--text-muted)] hover:text-red-500">
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
