import React from 'react'

export function DropdownMenu({ children }) {
  return <div className="dropdown-menu">{children}</div>
}

export function DropdownMenuTrigger({ children, asChild }) {
  return <span>{children}</span>
}

export function DropdownMenuContent({ children, align }) {
  return <div>{children}</div>
}

export function DropdownMenuItem({ children, ...props }) {
  return (
    <div {...props}>
      {children}
    </div>
  )
}

export default DropdownMenu
