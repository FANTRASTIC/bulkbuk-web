import React from 'react'

export function Tabs({ children, value, onValueChange }) {
  return <div>{children}</div>
}

export function TabsList({ children, className = '', ...props }) {
  return <div className={className} {...props}>{children}</div>
}

export function TabsTrigger({ children, value, className = '', ...props }) {
  return <button className={className} {...props}>{children}</button>
}

export function TabsContent({ children, value, className = '', ...props }) {
  return <div className={className} {...props}>{children}</div>
}

export default Tabs
