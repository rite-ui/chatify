import { useState } from 'react';
import { format } from 'date-fns';
import { Trash2,  Reply, Smile, Bot, Check, CheckCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getSocket } from '../../services/socket.js';
import useAuthStore from '../../context/authStore.js';
import Avatar from '../ui/Avatar.jsx';

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

const MessageBubble = ({ message, isOwn, onReply, onDelete, conversationId }) => {
  const [showActions, setShowActions] = useState(false);
  const [showEmoji, setShowEmoji]     = useState(false);
  const { user }                      = useAuthStore();

  if (!message || message.isDeleted) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
        <span className="text-xs text-(--text-muted) italic px-4 py-1">
          🗑 This message was deleted
        </span>
      </div>
    );
  }

  const handleReact = (emoji) => {
    const socket = getSocket();
    socket?.emit('message:react', { messageId: message._id, emoji, conversationId });
    setShowEmoji(false);
  };

  const totalReactions = message.reactions?.reduce((acc, r) => acc + r.users.length, 0) || 0;

  return (
    <div
      className={`flex gap-2 mb-3 group animate-fade-in ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setShowEmoji(false); }}
    >
      {/* Avatar */}
      {!isOwn && <Avatar user={message.sender} size="sm" className="mt-auto mb-1" />}

      <div className={`flex flex-col gap-1 max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender name (group only) */}
        {!isOwn && (
          <span className="text-xs text-(--text-muted) px-1">{message.sender?.username}</span>
        )}

        {/* Reply preview */}
        {message.replyTo && (
          <div className={`text-xs px-3 py-1.5 rounded-lg opacity-70 border-l-2 border-brand-400 bg-(--bg-secondary) ${isOwn ? 'text-right' : ''}`}>
            <span className="font-medium">{message.replyTo.sender?.username}</span>
            <p className="truncate max-w-50">{message.replyTo.content}</p>
          </div>
        )}

        {/* Bubble */}
        <div className={`relative ${isOwn ? 'message-bubble-out' : 'message-bubble-in'}`}>
          {message.type === 'ai' && (
            <div className={`flex items-center gap-1 text-xs mb-1 ${isOwn ? 'text-brand-200' : 'text-brand-500'}`}>
              <Bot className="w-3 h-3" /> AI Response
            </div>
          )}
          <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert prose-p:my-0">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>

          {/* Time & status */}
          <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className={`text-[10px] ${isOwn ? 'text-white/60' : 'text-(--text-muted)'}`}>
              {format(new Date(message.createdAt), 'HH:mm')}
            </span>
            {message.isEdited && (
              <span className={`text-[10px] ${isOwn ? 'text-white/60' : 'text-(--text-muted)'}`}>
                · edited
              </span>
            )}
            {isOwn && (
              message.readBy?.length > 0
                ? <CheckCheck className="w-3 h-3 text-blue-300" />
                : <Check className="w-3 h-3 text-white/50" />
            )}
          </div>
        </div>

        {/* Reactions */}
        {totalReactions > 0 && (
          <div className="flex flex-wrap gap-1">
            {message.reactions.map((r) =>
              r.users.length > 0 ? (
                <button
                  key={r.emoji}
                  onClick={() => handleReact(r.emoji)}
                  className={`text-xs px-2 py-0.5 rounded-full border transition-all
                    ${r.users.includes(user?._id)
                      ? 'bg-brand-500/20 border-brand-500/40 text-brand-500'
                      : 'bg-(--bg-secondary) border-(--border) text-(--text-muted)'
                    }`}
                >
                  {r.emoji} {r.users.length}
                </button>
              ) : null
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {showActions && (
        <div className={`flex items-center gap-1 self-center ${isOwn ? 'flex-row-reverse' : ''}`}>
          <div className="relative">
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="p-1.5 rounded-lg hover:bg-(--bg-secondary) text-(--text-muted) hover:text-(--text-primary) transition-all"
            >
              <Smile className="w-3.5 h-3.5" />
            </button>
            {showEmoji && (
              <div className={`absolute bottom-8 ${isOwn ? 'right-0' : 'left-0'} flex gap-1 bg-(--bg-card) border border-(--border) rounded-xl p-2 shadow-xl z-10`}>
                {EMOJI_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReact(emoji)}
                    className="hover:scale-125 transition-transform text-base"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onReply(message)}
            className="p-1.5 rounded-lg hover:bg-(--bg-secondary) text-(--text-muted) hover:text-(--text-primary) transition-all"
          >
            <Reply className="w-3.5 h-3.5" />
          </button>

          {isOwn && (
            <button
              onClick={() => onDelete(message._id)}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-(--text-muted) hover:text-red-500 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
