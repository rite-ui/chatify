const statusColors = {
  online:  'status-online',
  away:    'status-away',
  offline: 'status-offline',
};

const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const Avatar = ({ user, size = 'md', showStatus = false, className = '' }) => {
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <div className={`relative shrink-0 ${className}`}>
      <div className={`${sizeMap[size]} rounded-full overflow-hidden bg-linear-to-br from-brand-500 to-brand-700 flex items-center justify-center font-semibold text-white`}>
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {showStatus && (
        <span
          className={`status-dot absolute bottom-0 right-0 ${statusColors[user?.status || 'offline']}`}
        />
      )}
    </div>
  );
};

export default Avatar;
