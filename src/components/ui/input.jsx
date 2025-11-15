import React from 'react'

const BASE = 'rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition'

export const Input = React.forwardRef(({ className = '', style = {}, ...props }, ref) => {
  const mergedStyle = {
    backgroundColor: 'var(--surface)',
    color: 'var(--text)',
    borderColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.06)',
    ...style,
  }
  return <input ref={ref} className={`${BASE} ${className}`} style={mergedStyle} {...props} />
})

Input.displayName = 'Input'
export default Input
