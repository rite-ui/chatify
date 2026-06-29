import { useEffect } from 'react';
import useSocket from '../hooks/useSocket.js';
import useAuthStore from '../context/authStore.js';
import Sidebar from '../components/layouts/Sidebar.jsx';
import ChatWindow from '../components/chat/ChatWindow.jsx';

const Chat = () => {
  const { fetchMe, user, loading } = useAuthStore() || {};
  
  // ✅ FIXED: Execute socket triggers securely inside individual lifecycle node hooks
  useSocket(); 

  useEffect(() => {
    if (typeof fetchMe === 'function') {
      fetchMe();
    }
  }, [fetchMe]);

  // ─── OPTIONAL PRE-RENDER PIPELINE PROTECTION ────────────────────────────
  if (loading && !user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-(--bg-primary) flex-col gap-3 transition-colors duration-200">
        <span className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-(--text-muted) tracking-wider uppercase animate-pulse">
          Syncing Core Data Packets…
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-(--bg-primary) text-(--text-primary) antialiased select-none transition-colors duration-200">
      
      {/* 1. Sidebar Stream Interface */}
      <Sidebar />
      
      {/* 2. Main Terminal Content Pipeline */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        <ChatWindow />
      </div>

    </div>
  );
};

export default Chat;