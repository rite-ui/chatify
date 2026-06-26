import { useState, useRef } from 'react';
import { Send, Image, X, Smile } from 'lucide-react';
import useChatStore from '../../context/chatStore.js';
import toast from 'react-hot-toast';

export default function MessageInput({ conversationId, replyTo, onClearReply }) {
  const [text, setText] = useState('');
  const { sendMessage } = useChatStore();
  const inputRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !conversationId) return;

    try {
      // Zustand store ke sendMessage action ko invoke kiya 🚀
      await sendMessage(conversationId, text.trim(), replyTo ? { _id: replyTo._id, content: replyTo.content } : null);

      // Clean form state after layout synchronization
      setText('');
      if (replyTo) onClearReply();
      inputRef.current?.focus();
    } catch (error) {
      toast.error('Failed to dispatch packet');
      console.error(error);
    }
  };

  return (
    <div className="p-4 border-t border-(--border) bg-(--bg-card) shrink-0 relative">
      
      {/* REPLY BANNER INLINE PREVIEW */}
      {replyTo && (
        <div className="mb-2 p-2 px-3 rounded-xl bg-(--bg-secondary) border border-(--border) flex items-center justify-between text-xs animate-fade-in">
          <div className="flex flex-col min-w-0 border-l-2 border-(--brand-600) pl-2">
            <span className="font-semibold text-[10px] text-(--brand-600)">
              Replying to message
            </span>
            <p className="text-(--text-muted) truncate text-[11px]">{replyTo.content}</p>
          </div>
          <button 
            onClick={onClearReply}
            className="p-1 rounded-full hover:bg-(--border) text-(--text-muted) transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* DISPATCH CONTROLLER FORM */}
      <form onSubmit={handleSend} className="flex items-center gap-2 relative">
        <div className="flex items-center gap-0.5">
          <button type="button" className="btn-ghost p-2.5 shrink-0 text-(--text-muted)" title="Attach image">
            <Image className="w-4 h-4" />
          </button>
          <button type="button" className="btn-ghost p-2.5 shrink-0 text-(--text-muted) hidden sm:inline-flex" title="Emoji panel">
            <Smile className="w-4 h-4" />
          </button>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message secure link…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input-field flex-1 h-10 pr-4 pl-4!"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          className={`p-2.5 rounded-xl transition-all duration-200 shrink-0 ${
            text.trim()
              ? 'bg-(--brand-600) text-white shadow-md hover:opacity-90 active:scale-95'
              : 'bg-(--bg-secondary) text-(--text-muted) cursor-not-allowed opacity-50'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}