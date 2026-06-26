import { motion } from 'framer-motion';
import { Reply, Trash2 } from 'lucide-react';

export default function MessageBubble({ message, isOwn, onReply, onDelete }) {
  // Time formatted check
  const formattedTime = message.createdAt 
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full mb-3 ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`group relative max-w-[70%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        
        {/* Sender Name */}
        {!isOwn && message.sender?.username && (
          <span className="text-[11px] text-(--text-muted) mb-1 px-1">
            {message.sender.username}
          </span>
        )}

        {/* Message Panel Box */}
        <div className="relative flex items-center gap-2">
          
          {/* Bubble Background & Text Alignment */}
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm border transition-colors duration-150 ${
              isOwn
                ? 'bg-(--brand-600) border-(--brand-600) text-white rounded-br-none'
                : 'bg-(--bg-card) border-(--border) text-(--text-primary) rounded-bl-none'
            }`}
          >
            {/* Reply block inside bubble if any */}
            {message.replyTo && (
              <div className={`text-xs p-2 mb-1.5 rounded-lg border-l-2 ${
                isOwn 
                  ? 'bg-black/10 border-white/40 text-white/80' 
                  : 'bg-(--bg-secondary) border-(--brand-500) text-(--text-muted)'
              }`}>
                <p className="truncate text-[11px]">{message.replyTo.content}</p>
              </div>
            )}

            <p className="leading-relaxed wrap-break-word whitespace-pre-wrap">{message.content}</p>
            
            <span className={`text-[10px] block mt-1 text-right opacity-60 ${isOwn ? 'text-white' : 'text-(--text-muted)'}`}>
              {formattedTime}
            </span>
          </div>

          {/* Hover Action Panel */}
          <div className={`opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all duration-150 absolute top-1/2 -translate-y-1/2 ${
            isOwn ? '-left-20' : '-right-12'
          }`}>
            {/* Reply Button (Sab ke liye dikhega) */}
            <button
              onClick={() => onReply(message)}
              className="p-1 rounded-lg bg-(--bg-card) border border-(--border) text-(--text-muted) hover:text-(--text-primary) shadow-xs transition-colors"
              title="Reply"
            >
              <Reply className="w-3.5 h-3.5" />
            </button>

            {/* ✅ Trash2 aur onDelete ka use: Sirf apne messages par Delete option dikhao */}
            {isOwn && (
              <button
                onClick={() => onDelete(message._id)}
                className="p-1 rounded-lg bg-(--bg-card) border border-(--border) text-red-400 hover:text-red-500 hover:bg-red-500/10 shadow-xs transition-colors"
                title="Delete message"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}