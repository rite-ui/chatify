import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layouts/Sidebar.jsx';
import ChatWindow from './components/chat/ChatWindow.jsx';
import useChatStore from './context/chatStore.js';
import useSocket from './hooks/useSocket.js'; // Global event listening pipeline

// ─── Main Chat Dashboard Area ──────────────────────────────────────────────
function MainChatLayout() {
  const activeConversation = useChatStore((state) => state.activeConversation);
  
  // Custom dummy hook activate kiya taaki compile logs pass rahein
  useSocket(); 

  return (
    <div className="flex h-screen w-screen bg-(--bg-primary) text-(--text-primary) overflow-hidden transition-colors duration-200">
      
      {/* 1. LEFT SIDEBAR */}
      <Sidebar />

      {/* 2. RIGHT CHAT WINDOW AREA */}
      <div className="flex-1 h-full min-w-0 relative">
        {activeConversation ? (
          /* Agar koi dummy side-item selected hai */
          <ChatWindow />
        ) : (
          /* Default Welcome Screen View */
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-(--bg-primary) select-none gap-3">
            <div className="w-16 h-16 rounded-2xl bg-(--bg-secondary) flex items-center justify-center text-3xl shadow-xs border border-(--border)">
              💬
            </div>
            <div>
              <h3 className="text-lg font-semibold text-(--text-primary)">
                Welcome to Chatify
              </h3>
              <p className="text-(--text-muted) text-xs max-w-xs leading-relaxed mt-1">
                Select a conversation from the sidebar to start chatting or checking data packets.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

// ─── Master Router Control (Zero Login Dependency) ──────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Entry Point direct chat component par set kar diya */}
        <Route path="/chat" element={<MainChatLayout />} />
        
        {/* Agar blank url '/' hit ho toh direct layout path par bypass kare */}
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </BrowserRouter>
  );
}