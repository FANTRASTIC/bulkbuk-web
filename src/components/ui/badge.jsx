import React from 'react'

export function Badge({ children, className = '', variant, style = {}, ...props }) {
  const base = 'inline-flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-full'
  const bg = variant === 'secondary' ? 'rgba(6,182,212,0.12)' : 'rgba(148,163,184,0.12)'
  const color = variant === 'secondary' ? 'var(--primary)' : 'var(--muted)'
  return (
    <span className={base + ' ' + className} style={{ backgroundColor: 'var(--badge-bg, ' + bg + ')', color, ...style }} {...props}>
      {children}
    </span>
  )
}

export default Badge
