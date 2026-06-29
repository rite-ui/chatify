import { forwardRef } from 'react';

const Input = forwardRef(({
  label, error, icon: Icon, rightIcon, className = '', ...props
}, ref) => (
  <div className="flex flex-col gap-1.5 w-full text-left group">
    {/* Label Layout */}
    {label && (
      <label className="text-xs font-bold text-(--text-primary) tracking-wide uppercase">
        {label}
      </label>
    )}
    
    <div className="relative w-full">
      {/* Left Icon Input Integration */}
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted) group-focus-within:text-brand-500 transition-colors pointer-events-none" />
      )}
      
      {/* Core Input Element */}
      <input
        ref={ref}
        className={`w-full py-2.5 bg-(--bg-primary) border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 text-(--text-primary) placeholder-(--text-muted) transition-all
          ${Icon ? 'pl-10' : 'pl-4'} 
          ${rightIcon ? 'pr-11' : 'pr-4'} 
          ${error 
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' 
            : 'border-(--border) focus:border-brand-500/60 focus:ring-brand-500/10'
          } ${className}`}
        {...props}
      />
      
      {/* Right Icon / Toggle Action Element */}
      {rightIcon && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
          {rightIcon}
        </div>
      )}
    </div>
    
    {/* Error Handling Messaging Node */}
    {error && (
      <p className="text-[11px] font-semibold text-red-500 flex items-center gap-1 mt-0.5 tracking-wide animate-pulse">
        <span className="text-xs">⚠️</span> {error}
      </p>
    )}
  </div>
));

Input.displayName = 'Input';
export default Input;