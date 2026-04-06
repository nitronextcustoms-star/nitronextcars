import React from 'react';
import PropTypes from 'prop-types';

export const Label = ({ htmlFor, children, className = '', required = false, srOnly = false, ...props }) => {
  const base = `block text-sm font-medium text-muted-foreground ${className}`;
  if (srOnly) {
    return (
      <label htmlFor={htmlFor} className="sr-only" {...props}>
        {children}{required ? ' *' : ''}
      </label>
    );
  }

  return (
    <label htmlFor={htmlFor} className={base} {...props}>
      {children}{required ? ' *' : ''}
    </label>
  );
};

export default Label;

Label.propTypes = {
  htmlFor: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  required: PropTypes.bool,
  srOnly: PropTypes.bool
};
