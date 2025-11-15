import React from 'react'

export function Label({ children, className = '', htmlFor, style = {}, ...props }) {
  return (
    <label 
      htmlFor={htmlFor} 
      className={className} 
      style={{
        color: 'var(--text)',
        ...style,
      }}
      {...props}
    >
      {children}
    </label>
  )
}

export default Label
