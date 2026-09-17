import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  error,
  iconLeft,
  iconRight,
  onIconRightClick,
  className = '',
  ...props
}) {
  const hasIconLeft = !!iconLeft;
  const hasIconRight = !!iconRight;

  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <div className="input-container">
        {hasIconLeft && (
          <div className="input-icon-left">
            {iconLeft}
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`input-field ${hasIconLeft ? 'with-icon-left' : ''} ${hasIconRight ? 'with-icon-right' : ''} ${error ? 'has-error' : ''}`}
          {...props}
        />
        {hasIconRight && (
          <div className="input-icon-right" onClick={onIconRightClick}>
            {iconRight}
          </div>
        )}
      </div>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
}
