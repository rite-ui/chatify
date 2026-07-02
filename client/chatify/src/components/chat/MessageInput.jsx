import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useChatStore from '../../context/chatStore.js';
import useTyping from '../../hooks/useTyping.js';
import { aiAPI } from '../../services/api.js';

const MessageInput = ({ conversationId, replyTo, onClearReply }) => {
  const [content, setContent]     = useState('');
  const [aiMode, setAiMode]       = useState(false);
  const [aiPrompt, setAiPrompt]   = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const textareaRef               = useRef(null);
  const { sendMessage, addMessage } = useChatStore();
  const { startTyping, stopTyping } = useTyping(conversationId);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [content]);

  const handleSend = async () => {
    const text = content.trim();
    if (!text || !conversationId) return;
    setContent('');
    stopTyping();
    try {
      await sendMessage(conversationId, text, replyTo?._id || null);
      onClearReply?.();
    } catch (err) {
      toast.error('Failed to send message');
      setContent(text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setContent(e.target.value);
    if (e.target.value) startTyping();
    else stopTyping();
  };

  const handleAiSend = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const { data } = await aiAPI.chat({ prompt: aiPrompt, conversationId });
      if (data.message) addMessage(data.message);
      setAiPrompt('');
      setAiMode(false);
      toast.success('AI response added ✨');
    } catch {
      toast.error('AI request failed');
    } finally {
      setAiLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const { data } = await aiAPI.suggestReply(conversationId);
      setSuggestions(data.suggestions || []);
    } catch { /* silent */ }
  };

  return (
    <div className="p-4 border-t border-(--border) bg-(--bg-card)">
      {/* Reply Preview */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 mb-3 px-3 py-2 rounded-xl bg-brand-500/10 border border-brand-500/20"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-brand-500">
                Replying to {replyTo.sender?.username}
              </p>
              <p className="text-xs text-(--text-muted) truncate">{replyTo.content}</p>
            </div>
            <button onClick={onClearReply} className="text-(--text-muted) hover:text-(--text-primary)">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="flex flex-wrap gap-2 mb-3"
          >
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => { setContent(s); setSuggestions([]); textareaRef.current?.focus(); }}
                className="text-xs px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 hover:bg-brand-500/20 transition-colors"
              >
                {s}
              </button>
            ))}
            <button onClick={() => setSuggestions([])} className="text-xs text-(--text-muted) hover:text-(--text-primary)">
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Mode */}
      <AnimatePresence>
        {aiMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-3 rounded-xl bg-linear-to-r from-brand-600/10 to-purple-600/10 border border-brand-500/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4 text-brand-500" />
              <span className="text-xs font-semibold text-brand-500">AI Assistant</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
                placeholder="Ask AI anything..."
                className="input-field flex-1 py-2 text-xs"
                autoFocus
              />
              <button
                onClick={handleAiSend}
                disabled={aiLoading || !aiPrompt.trim()}
                className="btn-primary px-3 py-2 text-xs"
              >
                {aiLoading ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : <Send className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main input row */}
      <div className="flex items-end gap-2">
        {/* AI & Suggest buttons */}
        <div className="flex gap-1 pb-1">
          <button
            onClick={() => { setAiMode(!aiMode); setSuggestions([]); }}
            title="AI Assistant"
            className={`p-2 rounded-xl transition-all ${aiMode ? 'bg-brand-500/20 text-brand-500' : 'text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-secondary)'}`}
          >
            <Bot className="w-4 h-4" />
          </button>
          <button
            onClick={fetchSuggestions}
            title="Smart Reply Suggestions"
            className="p-2 rounded-xl text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-secondary) transition-all"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Shift+Enter for newline)"
            rows={1}
            className="input-field resize-none w-full leading-relaxed pr-12 py-3"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!content.trim()}
          className="btn-primary p-3 rounded-xl shrink-0 disabled:opacity-40 mb-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
