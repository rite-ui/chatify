import { forwardRef } from 'react';

const Input = forwardRef(({
  label, error, icon: Icon, rightIcon, className = '', ...props
}, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-(--text-primary)">{label}</label>
    )}
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted) pointer-events-none" />
      )}
      <input
        ref={ref}
        className={`input-field ${Icon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${error ? 'border-red-500/60 focus:ring-red-500/40' : ''} ${className}`}
        {...props}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</div>
      )}
    </div>
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
));

Input.displayName = 'Input';
export default Input;
