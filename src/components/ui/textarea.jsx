import React from 'react';
import PropTypes from 'prop-types';

const textareaSize = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg'
};

export const Textarea = React.forwardRef(({
  className = '',
  rows = 3,
  size = 'md',
  invalid = false,
  ...props
}, ref) => {
  const base = `w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`;
  const classes = `${base} ${textareaSize[size] || textareaSize.md} ${invalid ? 'border-red-500' : 'border-border'} ${className}`;

  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={classes}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;

Textarea.propTypes = {
  className: PropTypes.string,
  rows: PropTypes.number,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  invalid: PropTypes.bool
};
