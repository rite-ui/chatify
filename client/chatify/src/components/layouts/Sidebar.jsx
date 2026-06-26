import { useState, useEffect } from 'react';
import { Plus, Search, LogOut, Sun, Moon, Zap, MessageSquare } from 'lucide-react';
import useThemeStore from '../../context/themeStore.js';
import useChatStore from '../../context/chatStore.js';

const Sidebar = () => {
  const { theme, toggleTheme } = useThemeStore();
  
  // 🚀 ZUSTAND SYNC: Ab real dynamic conversations aur states store se aa rahi hain!
  const { 
    conversations, 
    activeConversation, 
    setActiveConversation, 
    fetchConversations, 
    loading 
  } = useChatStore();
  
  const [search, setSearch] = useState('');

  // App mount hote hi database/store se real chat list pull karo
  useEffect(() => {
    if (fetchConversations) fetchConversations();
  }, [fetchConversations]);

  // Dynamic Search Filter Logic (Ab store wale actual data par chalega)
  const filtered = (conversations || []).filter((c) => {
    if (!search) return true;
    return c.name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className='w-75 lg:w-80 flex flex-col border-r border-(--border) bg-(--bg-card) shrink-0 h-full shadow-(--shadow)'>

      {/* 1. HEADER CONTROL PANEL */}
      <div className='px-4 py-4 border-b border-(--border)'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-xl bg-linear-to-br from-(--brand-600) to-(--brand-500) flex items-center justify-center shadow-md'>
              <Zap className='w-4 h-4 text-white' />
            </div>
            <span className="font-bold text-lg text-(--text-primary)">Chatify</span>
          </div>

          <div className='flex items-center gap-1'>
            <button onClick={toggleTheme} className="btn-ghost" title="Toggle theme">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="btn-ghost" title="New conversation">
              <Plus className='w-4 h-4' />
            </button>
          </div>
        </div>
        
        {/* SEARCH STREAM */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-(--text-muted)' />
          <input
            type="text"
            placeholder='Search conversations…'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9!"
          />
        </div>
      </div>

      {/* 2. DYNAMIC CHAT CHANNELS LIST */}
      <div className='flex-1 overflow-y-auto py-2 px-2 space-y-1'>
        {loading ? (
          /* Skeleton Loader Wave */
          <div className="space-y-2 px-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-(--bg-secondary)/40 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-(--bg-secondary) shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-(--bg-secondary) rounded w-3/4" />
                  <div className="h-2.5 bg-(--bg-secondary) rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-center px-4 text-(--text-muted)">
            <MessageSquare className="w-8 h-8 opacity-40" />
            <p className="text-sm">
              {search ? 'No conversations match your search' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          /* ACTUAL LIVE CHAT CHANNELS */
          filtered.map((conv) => {
            const isActive = activeConversation?._id === conv._id;
            
            // Render text check (Chahe database se plain format ho ya content block structure)
            const lastMsgPreview = conv.lastMessage?.content || conv.lastMessage?.text || "No messages yet…";

            return (
              <div
                key={conv._id}
                onClick={() => setActiveConversation(conv)}
                className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
              >
                {/* User Avatar Badge */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-(--bg-secondary) text-(--brand-600) font-bold flex items-center justify-center">
                    {conv.name ? conv.name[0].toUpperCase() : 'C'}
                  </div>
                  {conv.status && conv.status !== 'none' && (
                    <span className={`status-dot absolute bottom-0 right-0 ${conv.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  )}
                </div>

                {/* Metadata Fields */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-(--text-primary) truncate">{conv.name}</p>
                  <p className="text-xs text-(--text-muted) truncate">{lastMsgPreview}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. FOOTER: Profile Bar */}
      <div className='px-3 py-3 border-t border-(--border) flex items-center gap-2 bg-(--bg-card)'>
        <div className='flex items-center gap-2 flex-1 min-w-0 rounded-xl p-2 text-left'>
          <div className='w-8 h-8 rounded-full bg-(--brand-600) text-white flex items-center justify-center font-bold text-xs shrink-0'>
            ME
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-(--text-primary) truncate">Ritesh Dev</p>
            <p className="text-xs text-(--text-muted) truncate">MERN Stack Developer</p>
          </div>
        </div>
        <button className="btn-ghost text-red-500!" title="Logout">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
      
    </div>
  );
};

export default Sidebar;