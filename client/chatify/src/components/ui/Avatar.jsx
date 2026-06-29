

// ✅ FIXED: Using pure Tailwind v4 native shorthand colors for dynamic statuses
const statusColors = {
  online:  'bg-emerald-500',
  away:    'bg-amber-500',
  offline: 'bg-gray-400 dark:bg-gray-600',
};

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

// Safe responsive map for the status indicators
const statusSizeMap = {
  xs: 'w-1.5 h-1.5 border-[1px]',
  sm: 'w-2 h-2 border-[1.5px]',
  md: 'w-2.5 h-2.5 border-2',
  lg: 'w-3 h-3 border-2',
  xl: 'w-4 h-4 border-2',
};

const Avatar = ({ user, size = 'md', showStatus = false, className = '' }) => {
  const username = user?.username || user?.name || 'User';
  
  // Safe extraction for 2 letter initials (e.g., "Ritesh Dev" -> "RD")
  const initials = username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '??';

  // Dynamic deterministic gradients based on name length to give a premium UI look
  const gradients = [
    'from-brand-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
  ];
  const selectedGradient = gradients[username.length % gradients.length];

  // Fallback support for both avatar and avatarUrl schemas
  const imageSource = user?.avatar || user?.avatarUrl;

  return (
    <div className={`relative inline-flex shrink-0 select-none ${className}`}>
      
      {/* ✅ FIXED: Corrected v4 gradient compilation wrapper with rounded-xl look */}
      <div className={`${sizeMap[size] || sizeMap.md} rounded-xl overflow-hidden bg-linear-to-br ${selectedGradient} flex items-center justify-center font-bold text-white shadow-xs`}>
        {imageSource ? (
          <img
            src={imageSource}
            alt={username}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Online/Offline Badge Element */}
      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizeMap[size] || statusSizeMap.md} rounded-full border-(--bg-card) shadow-xs transition-colors duration-200 ${statusColors[user?.status || 'offline']}`}
        />
      )}
    </div>
  );
};

export default Avatar;