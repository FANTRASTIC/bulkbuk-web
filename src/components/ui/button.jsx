import React from 'react'

const BASE = 'inline-flex items-center gap-2 rounded-md text-sm font-medium transition select-none'

export function Button({ children, className = '', variant, size, style: userStyle = {}, ...props }) {
  const baseClasses = `${BASE} px-3 py-2 ${className}`.trim()

  // choose inline colors using CSS variables so theme toggles affect them
  const primaryStyle = {
    backgroundColor: 'var(--primary)',
    color: 'white',
    borderColor: 'transparent',
  }

  const outlineStyle = {
    backgroundColor: 'var(--surface)',
    color: 'var(--text)',
    border: '1px solid rgba(255,255,255,0.06)',
  }

  const ghostStyle = {
    backgroundColor: 'transparent',
    color: 'var(--text)',
  }

  const destructiveStyle = {
    backgroundColor: '#dc2626',
    color: 'white',
    borderColor: 'transparent',
  }

  const chosen = variant === 'outline' ? outlineStyle : variant === 'ghost' ? ghostStyle : variant === 'destructive' ? destructiveStyle : variant === 'secondary' ? outlineStyle : primaryStyle

  return (
    <button className={baseClasses} style={{ ...chosen, ...userStyle }} {...props}>
      {children}
    </button>
  )
}

export default Button
