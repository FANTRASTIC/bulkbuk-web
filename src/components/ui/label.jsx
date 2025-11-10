import React from 'react'

export function Label({ children, className = '', htmlFor, ...props }) {
  return (
    <label htmlFor={htmlFor} className={className} {...props}>
      {children}
    </label>
  )
}

export default Label
