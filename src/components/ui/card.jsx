import React from 'react'

export function Card({ children, className = '', ...props }) {
  const base = 'rounded-2xl'
  return (
    <div className={`${base} ${className}`} style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--card-shadow)' }} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={className} {...props}>
      {children}
    </p>
  )
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={className} {...props}>
      {children}
    </h3>
  )
}

export default Card
