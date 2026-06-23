import { useState, useEffect } from 'react';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [activeConversation, setActiveConversation] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="flex h-screen w-screen bg-(--bg-primary) text-(--text-primary) overflow-hidden transition-colors duration-200">
      
      {/* ================= SLOT A: SIDEBAR SHELL ================= */}
      <div className="w-75 lg:w-80 h-full border-r border-(--border) bg-(--bg-card) flex flex-col justify-between p-4 shrink-0 shadow-(--shadow)">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg tracking-tight bg-linear-to-r from-(--brand-600) to-(--brand-500) bg-clip-text text-transparent">
              Chatify Shell
            </span>
            <button onClick={toggleTheme} className="btn-ghost text-xs cursor-pointer">
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>
          <p className="text-xs text-(--text-muted)">
            Next step me banne wala Sidebar component yahan mount hoga.
          </p>
        </div>
        
        <div className="p-3 rounded-xl bg-(--bg-secondary) text-xs text-center font-semibold">
          Active Operator: Sanket Dev
        </div>
      </div>

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