import { useEffect, useRef } from 'react';
import { Phone, Video, Info, Send, Smile, Paperclip } from 'lucide-react';
import useChatStore from '../../context/chatStore.js';
import useTyping from '../../hooks/useTyping.js';
import Avatar from '../ui/Avatar.jsx';

export default function ChatWindow() {
  const { activeConversation, messages, sendMessage, typingUsers } = useChatStore();
  const messagesEndRef = useRef(null);

  const convId = activeConversation?._id;
  const { startTyping, stopTyping } = useTyping(convId);

  const currentMessages = messages[convId] || [];
  const currentTypingMap = typingUsers[convId] || {};
  const typingUsernames = Object.values(currentTypingMap);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, typingUsernames]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get('message-input')?.trim();
    
    if (!text) return;

    e.currentTarget.reset();
    stopTyping();

    try {
      await sendMessage(convId, text);
    } catch (err) {
      console.error("❌ Failed to stream packet message:", err);
    }
  };

  if (!activeConversation) return null;

  const otherParticipant = activeConversation.participants?.find(p => p._id !== "ME");
  const chatName = activeConversation.type === 'group' ? activeConversation.name : (otherParticipant?.username || 'User');

  return (
    <div className="h-full w-full flex flex-col bg-[var(--bg-primary)] border-l border-[var(--border)]">
      
      {/* ─── 1. CHAT HEADER (Variable Repaired) ─── */}
      <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <Avatar user={otherParticipant} size="md" showStatus={activeConversation.type !== 'group'} />
          <div>
            {/* ✅ FIXED: --var-text-primary corrected to --text-primary */}
            <h4 className="text-sm font-semibold text-[var(--text-primary)] leading-tight">{chatName}</h4>
            <p className="text-xs text-emerald-500 font-medium mt-0.5">
              {activeConversation.type === 'group' ? `${activeConversation.participants?.length || 0} members` : (otherParticipant?.status === 'online' ? 'Online node' : 'Offline')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <button className="p-2 hover:text-[var(--text-primary)] transition-colors"><Phone className="w-4 h-4" /></button>
          <button className="p-2 hover:text-[var(--text-primary)] transition-colors"><Video className="w-4 h-4" /></button>
          <button className="p-2 hover:text-[var(--text-primary)] transition-colors"><Info className="w-4 h-4" /></button>
        </div>
      </div>

      {/* ─── 2. MESSAGES FLOW STREAM ─── */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-[var(--bg-primary)]">
        {currentMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-[var(--text-muted)]">
            No secure data packets exchanged yet. Start the synchronization stream below! 👇
          </div>
        ) : (
          currentMessages.map((msg) => {
            const isMe = msg.sender?._id === "ME";
            return (
              <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                {!isMe && <Avatar user={msg.sender} size="xs" />}
                <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-xs ${
                  isMe 
                    ? 'bg-indigo-600 dark:bg-brand-600 text-white rounded-br-none' 
                    : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-bl-none'
                }`}>
                  <p className="leading-relaxed break-words">{msg.content}</p>
                  <span className={`text-[10px] block mt-1 text-right ${isMe ? 'text-indigo-200 dark:text-brand-200' : 'text-[var(--text-muted)]'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Dynamic Live Typing Indicator Layout */}
        {typingUsernames.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] animate-pulse pl-8">
            <div className="flex gap-1 items-center bg-[var(--bg-card)] border border-[var(--border)] px-3 py-2 rounded-xl rounded-bl-none">
              <span className="font-medium text-indigo-600 dark:text-brand-500">{typingUsernames[0]}</span> is typing
              <span className="flex gap-0.5 ml-1">
                <span className="w-1 h-1 bg-[var(--text-muted)] rounded-full animate-bounce delay-100" />
                <span className="w-1 h-1 bg-[var(--text-muted)] rounded-full animate-bounce delay-200" />
                <span className="w-1 h-1 bg-[var(--text-muted)] rounded-full animate-bounce delay-300" />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ─── 3. BOTTOM SECURE INPUT CHANNEL ─── */}
      <div className="p-4 bg-[var(--bg-card)] border-t border-[var(--border)] shrink-0">
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2 max-w-5xl mx-auto relative w-full">
          <div className="flex items-center gap-1 text-[var(--text-muted)] shrink-0">
            <button type="button" className="p-2 hover:text-[var(--text-primary)] transition-colors"><Paperclip className="w-4 h-4" /></button>
          </div>
          
          <div className="flex-1 relative">
            <input
              type="text"
              name="message-input"
              autoComplete="off"
              placeholder="Type a secure message node..."
              onChange={startTyping}
              onBlur={stopTyping}
              className="w-full pl-4 pr-10 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 dark:focus:border-brand-500/50 text-[var(--text-primary)] placeholder-[var(--text-muted)]"
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <Smile className="w-4 h-4" />
            </button>
          </div>

          {/* ✅ FIXED: Fallback solid colors for Light Mode (`bg-indigo-600` / `text-white`) */}
          <button 
            type="submit" 
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-brand-600 dark:hover:bg-brand-700 text-white p-2.5 rounded-xl shadow-md transition-all active:scale-[0.97] shrink-0 flex items-center justify-center"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>

    </div>
  );
}