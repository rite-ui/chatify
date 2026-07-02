import { useEffect, useRef, useState, useCallback } from 'react';
import { Bot, Sparkles, ChevronDown, Phone, Video, Info, ArrowLeft } from 'lucide-react'; // 👈 ArrowLeft import kiya
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useChatStore from '../../context/chatStore.js';
import useAuthStore from '../../context/authStore.js';
import { chatAPI, aiAPI } from '../../services/api.js';
import MessageBubble from './MessageBubble.jsx';
import MessageInput from './MessageInput.jsx';
import Avatar from '../ui/Avatar.jsx';

// ─── MODERN TYPING INDICATOR (TAILWIND V4 SYNTAX) ───────────────────────────
const TypingIndicator = ({ users }) => {
  if (!users?.length) return null;
  const names = users.map((u) => u.username || 'Someone').join(', ');
  return (
    <div className="flex items-center gap-2 px-6 pb-3 animate-fade-in">
      <div className="flex items-center gap-2 bg-(--bg-card) border border-(--border) rounded-2xl px-4 py-2 shadow-xs backdrop-blur-md">
        <span className="flex gap-1 items-center">
          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" />
        </span>
        <span className="text-xs font-medium text-(--text-muted) ml-1">{names} typing…</span>
      </div>
    </div>
  );
};

const ChatWindow = () => {
  // 🌟 Added 'setActiveConversation' to clear state on back click
  const { activeConversation, setActiveConversation, messages, typingUsers, msgLoading, fetchMessages } = useChatStore();
  const { user } = useAuthStore();
  const [replyTo, setReplyTo] = useState(null);
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  const convId   = activeConversation?._id;
  const convMsgs = messages[convId] || [];
  const typing   = typingUsers[convId] ? Object.values(typingUsers[convId]) : [];

  useEffect(() => {
    if (convId && fetchMessages) fetchMessages(convId);
  }, [convId, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convMsgs.length, typing.length]);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
  }, []);

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleDelete = async (messageId) => {
    try {
      if (chatAPI?.deleteMessage) await chatAPI.deleteMessage(messageId);
    } catch {
      toast.error('Failed to delete message');
    }
  };

  const handleSummarize = async () => {
    setSummaryLoading(true);
    try {
      if (aiAPI?.summarize) {
        const { data } = await aiAPI.summarize(convId);
        setSummary(data.summary);
      } else {
        setSummary("AI Insight: All nodes operating securely. Sync protocol optimal.");
      }
      setShowSummary(true);
    } catch {
      toast.error('Could not summarize conversation');
    } finally {
      setSummaryLoading(false);
    }
  };

  const getOtherParticipant = () => {
    if (activeConversation?.type === 'group') return null;
    return activeConversation?.participants?.find((p) => p._id !== (user?._id || "ME"));
  };

  const headerName =
    activeConversation?.type === 'group'
      ? activeConversation.name
      : getOtherParticipant()?.username || 'User Node';

  const headerSub =
    activeConversation?.type === 'group'
      ? `${activeConversation.participants?.length || 0} members`
      : getOtherParticipant()?.status === 'online'
      ? 'Online'
      : 'Offline';

  // ─── 1. EMPTY STATE WELCOME WINDOW ────────────────────────────────────────
  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-(--bg-primary) gap-4 select-none h-full w-full transition-colors duration-200">
        <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-brand-500/10 to-purple-500/10 border border-brand-500/20 flex items-center justify-center shadow-xs">
          <Sparkles className="w-9 h-9 text-brand-500 animate-pulse" />
        </div>
        <div className="text-center px-4">
          <h3 className="text-lg font-bold text-(--text-primary) tracking-tight">
            Select a conversation stream
          </h3>
          <p className="text-(--text-muted) text-xs max-w-xs mt-1 leading-relaxed">
            Choose a private pipeline chat from the left sidebar panel to start syncing messages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full w-full flex flex-col min-w-0 overflow-hidden bg-(--bg-primary) relative transition-colors duration-200">
      
      {/* ─── 2. CHAT TOP HEADER BAR ─────────────────────────────────────────── */}
      <div className="h-18 flex items-center justify-between px-6 border-b border-(--border) bg-(--bg-card) shrink-0 z-10 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          
          {/* 🌟 FIXED: Responsive Back Arrow Control Node (Only displays on mobile viewports) */}
          <button 
            onClick={() => setActiveConversation(null)} 
            className="flex md:hidden p-2 -ml-2 rounded-xl text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-secondary) transition-all active:scale-95 cursor-pointer shrink-0"
            title="Go back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {activeConversation.type === 'group' ? (
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
              {headerName.slice(0, 2).toUpperCase()}
            </div>
          ) : (
            <Avatar user={getOtherParticipant() || { username: headerName, status: headerSub.toLowerCase() }} size="md" showStatus />
          )}
          <div className="min-w-0">
            <h2 className="font-semibold text-sm text-(--text-primary) truncate leading-snug">{headerName}</h2>
            <p className={`text-xs mt-0.5 font-medium ${headerSub === 'Online' ? 'text-emerald-500' : 'text-(--text-muted)'}`}>
              {headerSub}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 text-(--text-muted)">
          <button
            onClick={handleSummarize}
            disabled={summaryLoading}
            title="Summarize with AI"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {summaryLoading ? (
              <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : <Bot className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">AI Summary</span>
          </button>
          <div className="w-px h-4 bg-(--border) mx-1 hidden sm:block" />
          <button className="p-2 hover:text-(--text-primary) rounded-xl transition-colors hidden sm:block"><Phone className="w-4.5 h-4.5" /></button>
          <button className="p-2 hover:text-(--text-primary) rounded-xl transition-colors hidden sm:block"><Video className="w-4.5 h-4.5" /></button>
          <button className="p-2 hover:text-(--text-primary) rounded-xl transition-colors"><Info className="w-4.5 h-4.5" /></button>
        </div>
      </div>

      {/* ─── 3. AI SUMMARY BANNER NOTIFICATION ──────────────────────────────── */}
      <AnimatePresence>
        {showSummary && summary && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="px-6 py-3 bg-brand-500/5 border-b border-brand-500/20 text-sm overflow-hidden z-10"
          >
            <div className="max-w-5xl mx-auto bg-(--bg-card) border border-brand-500/20 p-4 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-brand-500 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} /> Generated Synopsis Node
                </div>
                <button onClick={() => setShowSummary(false)} className="text-(--text-muted) hover:text-(--text-primary) text-xs p-1 rounded-md hover:bg-(--bg-secondary)">
                  ✕
                </button>
              </div>
              <p className="text-(--text-primary) text-xs leading-relaxed font-medium whitespace-pre-wrap">{summary}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 4. SCROLLABLE MESSAGES FLOW STREAM ─────────────────────────────── */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-4 min-h-0 bg-(--bg-primary) scroll-smooth"
      >
        {msgLoading ? (
          <div className="h-full flex items-center justify-center">
            <span className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : convMsgs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-2">
            <div className="w-12 h-12 rounded-2xl bg-(--bg-secondary) flex items-center justify-center text-xl border border-(--border) shadow-xs">💬</div>
            <p className="text-(--text-primary) font-medium text-xs">No packets transmitted yet.</p>
            <p className="text-(--text-muted) text-[11px]">Type a greeting down below to trigger synchronization stream!</p>
          </div>
        ) : (
          convMsgs.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isOwn={msg.sender?._id === (user?._id || "ME")}
              onReply={setReplyTo}
              onDelete={handleDelete}
              conversationId={convId}
            />
          ))
        )}

        <TypingIndicator users={typing} />
        <div ref={bottomRef} />
      </div>

      {/* Floating Scroll to Bottom Controller */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToBottom}
            className="absolute bottom-24 right-6 w-9 h-9 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md flex items-center justify-center transition-all active:scale-90 z-20"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── 5. FIXED INPUT FIELD CHANNEL FOOTER ────────────────────────────── */}
      <div className="bg-(--bg-card) border-t border-(--border) shrink-0 z-10">
        <MessageInput
          conversationId={convId}
          replyTo={replyTo}
          onClearReply={() => setReplyTo(null)}
        />
      </div>

    </div>
  );
};

export default ChatWindow;