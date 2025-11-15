import React, { useEffect } from 'react'

export function Dialog({ open = false, onOpenChange, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  if (!open) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onOpenChange?.(false)
        }
      }}
    >
      <div 
        className="relative rounded-lg shadow-lg max-h-[90vh] overflow-hidden"
        style={{
          backgroundColor: 'var(--surface)',
          color: 'var(--text)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function DialogContent({ children, className = '', ...props }) {
  return (
    <div 
      className={`p-6 overflow-y-auto max-h-[calc(90vh-80px)] ${className}`} 
      style={{
        backgroundColor: 'var(--surface)',
        color: 'var(--text)',
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function DialogHeader({ children, className = '', ...props }) {
  return (
    <div 
      className={`border-b px-6 py-4 ${className}`}
      style={{
        borderColor: 'rgba(255,255,255,0.06)',
        backgroundColor: 'var(--surface)',
        color: 'var(--text)',
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function DialogTitle({ children, className = '', ...props }) {
  return (
    <h2 
      className={`text-lg font-semibold ${className}`}
      style={{ color: 'var(--text)' }}
      {...props}
    >
      {children}
    </h2>
  )
}

export default Dialog
