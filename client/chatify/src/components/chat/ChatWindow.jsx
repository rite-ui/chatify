import { useEffect, useRef, useState, useCallback } from 'react';
import { Bot, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useChatStore from '../../context/chatStore.js';
import useAuthStore from '../../context/authStore.js';
import { chatAPI, aiAPI } from '../../services/api.js';
import MessageBubble from './MessageBubble.jsx';
import MessageInput from './MessageInput.jsx';
import Avatar from '../ui/Avatar.jsx';

const TypingIndicator = ({ users }) => {
  if (!users?.length) return null;
  const names = users.map((u) => u.username).join(', ');
  return (
    <div className="flex items-center gap-2 px-4 pb-2 animate-fade-in">
      <div className="flex gap-0.5 items-center bg-(--bg-card) border border-(--border) rounded-xl px-3 py-2 shadow-sm">
        <span className="typing-dot" style={{ animationDelay: '0ms' }} />
        <span className="typing-dot" style={{ animationDelay: '200ms' }} />
        <span className="typing-dot" style={{ animationDelay: '400ms' }} />
        <span className="text-xs text-(--text-muted) ml-2">{names} typing…</span>
      </div>
    </div>
  );
};

const ChatWindow = () => {
  const { activeConversation, messages, typingUsers, msgLoading, fetchMessages } = useChatStore();
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
  const typing   = typingUsers[convId] || [];

  useEffect(() => {
    if (convId) fetchMessages(convId);
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
      await chatAPI.deleteMessage(messageId);
    } catch {
      toast.error('Failed to delete message');
    }
  };

  const handleSummarize = async () => {
    setSummaryLoading(true);
    try {
      const { data } = await aiAPI.summarize(convId);
      setSummary(data.summary);
      setShowSummary(true);
    } catch {
      toast.error('Could not summarize conversation');
    } finally {
      setSummaryLoading(false);
    }
  };

  // Get display info
  const getOtherParticipant = () => {
    if (activeConversation?.type === 'group') return null;
    return activeConversation?.participants?.find((p) => p._id !== user?._id);
  };

  const headerName =
    activeConversation?.type === 'group'
      ? activeConversation.name
      : getOtherParticipant()?.username || 'Unknown';

  const headerSub =
    activeConversation?.type === 'group'
      ? `${activeConversation.participants?.length} members`
      : getOtherParticipant()?.status === 'online'
      ? 'Online'
      : 'Offline';

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
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-(--bg-primary)">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-(--border) bg-(--bg-card) shrink-0">
        {activeConversation.type === 'group' ? (
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {headerName.slice(0, 2).toUpperCase()}
          </div>
        ) : (
          <Avatar user={getOtherParticipant()} size="md" showStatus />
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-(--text-primary) truncate">{headerName}</h2>
          <p className={`text-xs ${headerSub === 'Online' ? 'text-emerald-500' : 'text-(--text-muted)'}`}>
            {headerSub}
          </p>
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleSummarize}
            disabled={summaryLoading}
            title="Summarize with AI"
            className="btn-ghost px-3 py-2 text-xs"
          >
            {summaryLoading ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : <Bot className="w-4 h-4" />}
            <span className="hidden sm:inline">Summarize</span>
          </button>
        </div>
      </div>

      {/* AI Summary Panel */}
      <AnimatePresence>
        {showSummary && summary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-4 mt-3 p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-brand-500 font-semibold">
                <Bot className="w-4 h-4" /> AI Summary
              </div>
              <button onClick={() => setShowSummary(false)} className="text-(--text-muted) hover:text-(--text-primary) text-xs">
                ✕
              </button>
            </div>
            <p className="text-(--text-primary) leading-relaxed whitespace-pre-wrap">{summary}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-0"
      >
        {msgLoading ? (
          <div className="flex justify-center py-8">
            <svg className="w-6 h-6 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
        ) : convMsgs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-(--bg-secondary) flex items-center justify-center text-3xl">💬</div>
            <p className="text-(--text-muted) text-sm">No messages yet. Say hello!</p>
          </div>
        ) : (
          convMsgs.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isOwn={msg.sender?._id === user?._id}
              onReply={setReplyTo}
              onDelete={handleDelete}
              conversationId={convId}
            />
          ))
        )}

        <TypingIndicator users={typing} />
        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom btn */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-24 right-6 w-9 h-9 rounded-full bg-brand-600 text-white shadow-lg flex items-center justify-center hover:bg-brand-500 transition-colors z-10"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input */}
      <MessageInput
        conversationId={convId}
        replyTo={replyTo}
        onClearReply={() => setReplyTo(null)}
      />
    </div>
  );
};

export default ChatWindow;
