import React from 'react';
import PropTypes from 'prop-types';

const sizeClasses = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg'
};

const variantClasses = {
  default: 'bg-card border-border',
  ghost: 'bg-transparent border-transparent'
};

export const Input = React.forwardRef(({
  className = '',
  variant = 'default',
  size = 'md',
  invalid = false,
  ...props
}, ref) => {
  const base = 'w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary';
  const classes = `${base} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.default} ${invalid ? 'border-red-500' : 'border-border'} ${className}`;

  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={classes}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;

Input.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  invalid: PropTypes.bool
};
