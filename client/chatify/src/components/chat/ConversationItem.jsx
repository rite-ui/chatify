import { formatDistanceToNow } from 'date-fns';
import Avatar from '../ui/Avatar.jsx';

const ConversationItem = ({ conversation, isActive, onClick }) => {
  // ✅ FIXED: Unused activeConversation state nikal diya linter ko happy rakhne ke liye
  const CURRENT_USER_ID = 'user_logged_in_luxe'; 

  const getDisplayInfo = () => {
    if (conversation.type === 'group' || conversation.isGroup) {
      return {
        name:   conversation.name,
        avatar: conversation.avatar,
        status: null,
        isGroup: true,
      };
    }
    
    const other = conversation.participants?.find((p) => p._id !== CURRENT_USER_ID) || conversation.participants?.[0];
    return {
      name:    other?.username || conversation.name || 'Unknown',
      avatar:  other?.avatar,
      status:  other?.status,
      isGroup: false,
      user:    other,
    };
  };

  const info        = getDisplayInfo();
  const lastMsg     = conversation.lastMessage;
  const lastContent = typeof lastMsg === 'string' ? lastMsg : (lastMsg?.content || 'No messages yet');
  
  const lastTime = conversation.updatedAt
    ? formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })
    : 'Just now';

  return (
    <div
      onClick={onClick}
      className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
      style={{ cursor: 'pointer' }}
    >
      <div className="relative">
        {info.isGroup ? (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-linear-to-br from-brand-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {info.name?.slice(0, 2).toUpperCase()}
          </div>
        ) : (
          <Avatar user={info.user} size="md" showStatus />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm text-(--text-primary) truncate">{info.name}</span>
          {lastTime && (
            <span className="text-xs text-(--text-muted) shrink-0">{lastTime}</span>
          )}
        </div>
        <p className="text-xs text-(--text-muted) truncate mt-0.5">
          {lastMsg?.sender?._id === CURRENT_USER_ID ? 'You: ' : ''}
          {lastContent}
        </p>
      </div>
    </div>
  );
};

export default ConversationItem;