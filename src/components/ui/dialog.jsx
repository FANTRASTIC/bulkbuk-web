import React from 'react'

export function Dialog({ open = false, onOpenChange, children }) {
  // Very small modal implementation; DialogContent handles layout
  return <div data-open={open}>{children}</div>
}

export function DialogContent({ children, className = '', ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export function DialogHeader({ children, className = '', ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className = '', ...props }) {
  return (
    <h2 className={className} {...props}>
      {children}
    </h2>
  )
}

export default Dialog
