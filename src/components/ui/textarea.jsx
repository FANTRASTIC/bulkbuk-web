import React from 'react'

const BASE = 'rounded-md px-3 py-2 text-sm focus:outline-none'

export const Textarea = React.forwardRef(({ className = '', style = {}, ...props }, ref) => {
  const mergedStyle = {
    backgroundColor: 'var(--surface)',
    color: 'var(--text)',
    border: '1px solid rgba(0,0,0,0.06)',
    ...style,
  }
  return <textarea ref={ref} className={`${BASE} ${className}`} style={mergedStyle} {...props} />
})

export default Textarea
