//import { useState, } from 'react';
import Sidebar from './components/layouts/Sidebar.jsx';
import useChatStore from './context/chatStore.js';

export default function App() {
  
  // 2. Local useState hatakar direct Zustand store se data aur helper function nikal liya
  const { activeConversation, setActiveConversation } = useChatStore();

  return (
    <div className="flex h-screen w-screen bg-(--bg-primary) text-(--text-primary) overflow-hidden transition-colors duration-200">
      
      {/* Humne saara dabba hata kar actual Component jod diya aur saari states bhej di */}
      <Sidebar />

      {/* ================= SLOT B: MAIN VIEW SHELL ================= */}
      <div className="flex-1 h-full flex flex-col justify-center items-center text-(--text-muted) bg-(--bg-primary)">
        {activeConversation ? (
          <div className="text-center space-y-2">
            <span className="text-4xl">💬</span>
            <div className="text-xl font-bold text-(--text-primary)">
              Streaming Chat Thread: <span className="text-(--brand-600)">{activeConversation.name}</span>
            </div>
            <button 
              onClick={() => setActiveConversation(null)}
              className="text-xs text-red-500 hover:underline cursor-pointer"
            >
              Close Thread
            </button>
          </div>
        ) : (
          <div className="text-center space-y-3 p-6 max-w-sm glass-card">
            <p className="text-lg font-bold text-(--text-primary)">Shell State Operational</p>
            <p className="text-xs text-(--text-muted) leading-relaxed">
              Parent routing configured. Click the simulation button below to trigger data routing test.
            </p>
            
            <button 
              onClick={() => setActiveConversation({ _id: "1", name: "Aman (MERN Dev)" })}
              className="btn-primary w-full text-xs py-2 mt-2 cursor-pointer"
            >
              Test State Propagation
            </button>
          </div>
        )}
      </div>

    </div>
  );
}