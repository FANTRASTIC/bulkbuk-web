import React from 'react'

export function Switch({ checked, onCheckedChange, className = '', ...props }) {
  const handleChange = (e) => {
    if (onCheckedChange) onCheckedChange(e.target.checked)
  }
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      className={className}
      {...props}
    />
  )
}

export default Switch
