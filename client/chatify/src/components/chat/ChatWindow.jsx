import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronDown, Sparkles, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useChatStore from '../../context/chatStore.js';
import MessageBubble from './MessageBubble.jsx';
import MessageInput from './MessageInput.jsx';

const TypingIndicator = ({ users }) => {
  if (!users?.length) return null;
  const names = users.map((u) => u.username).join(', ');
  return (
    <div className="flex items-center gap-2 px-4 pb-2 animate-fade-in">
      <div className="flex gap-0.5 items-center bg-(--bg-card) border border-(--border) rounded-xl px-3 py-2 shadow-sm">
        <span className="typing-dot animate-pulse bg-emerald-500 w-1.5 h-1.5 rounded-full" style={{ animationDelay: '0ms' }} />
        <span className="typing-dot animate-pulse bg-emerald-500 w-1.5 h-1.5 rounded-full" style={{ animationDelay: '200ms' }} />
        <span className="typing-dot animate-pulse bg-emerald-500 w-1.5 h-1.5 rounded-full" style={{ animationDelay: '400ms' }} />
        <span className="text-xs text-(--text-muted) ml-2">{names} typing…</span>
      </div>
    </div>
  );
};

const ChatWindow = () => {
  // Zustand hook call
  const { activeConversation, setActiveConversation, messages, msgLoading, typingUsers, fetchMessages } = useChatStore();
  const [replyTo, setReplyTo] = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  // ✅ Order Fixed: Pehle id read hogi, phir arrays map honge
  const convId = activeConversation?._id;
  const convMsgs = messages[convId] || [];
  const typing = typingUsers[convId] || [];

  // Conversation change hote hi fetch call safe execute karo
  useEffect(() => {
    if (convId && fetchMessages) fetchMessages(convId);
  }, [convId, fetchMessages]);

  // Naya message ya typing state badalte hi auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convMsgs.length, typing.length]);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
  }, []);

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-(--bg-primary) gap-4 select-none">
        <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-brand-500/20 to-brand-700/20 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-brand-500/60" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-display font-semibold text-(--text-primary) mb-1">
            Select a conversation
          </h3>
          <p className="text-(--text-muted) text-sm">
            Choose a chat from the sidebar or start a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden bg-(--bg-primary) relative">
      
      {/* 1. HEADER PANEL */}
      {/* ✅ Variable format brackets fixed */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-(--border) bg-(--bg-card) shrink-0">
        <div className="flex items-center gap-3">
          
          {/* ✅ Back Arrow Button added back */}
          <button 
            onClick={() => setActiveConversation(null)}
            className="p-1.5 rounded-lg hover:bg-(--bg-secondary) text-(--text-muted) hover:text-(--text-primary) md:hidden transition-colors mr-1"
            title="Back to chats"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-10 h-10 rounded-full bg-(--bg-secondary) text-(--brand-600) font-bold flex items-center justify-center">
            {activeConversation?.name ? activeConversation.name[0].toUpperCase() : 'C'}
          </div>
          <div>
            <h2 className="font-semibold text-(--text-primary) text-sm">{activeConversation?.name}</h2>
            <p className="text-[11px] text-emerald-500 font-medium">Online Stream</p>
          </div>
        </div>
      </div>

      {/* 2. MESSAGES STREAM CONTAINER */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
      >
        {msgLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-(--brand-600) border-t-transparent rounded-full animate-spin" />
          </div>
        ) : convMsgs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-2 opacity-60">
            <div className="text-2xl">💬</div>
            <p className="text-xs text-(--text-muted)">No telemetry frames yet. Say hello!</p>
          </div>
        ) : (
          convMsgs.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isOwn={msg.sender?._id === "ME"}
              onReply={setReplyTo}
              onDelete={() => {}}
              conversationId={convId}
            />
          ))
        )}
        
        {/* Dynamic Typing Wave layout inline sync */}
        <TypingIndicator users={typing} />
        <div ref={bottomRef} />
      </div>

      {/* 3. FLOATING SCROLL TO BOTTOM BUTTON */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-24 right-6 w-9 h-9 rounded-full bg-(--brand-600) text-white shadow-md flex items-center justify-center hover:opacity-90 transition-all z-10" 
          >
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 4. BOTTOM INPUT CONTROLLER */}
      <MessageInput 
        conversationId={convId}
        replyTo={replyTo}
        onClearReply={() => setReplyTo(null)}
      />
    </div>
  );
};

export default ChatWindow;