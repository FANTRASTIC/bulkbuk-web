import React from 'react'

export function Switch({ checked, onCheckedChange, className = '', ...props }) {
  const handleChange = (e) => {
    if (onCheckedChange) onCheckedChange(e.target.checked)
  }
  return (
    <label className={`relative inline-flex items-center cursor-pointer ${className}`} {...props}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="sr-only peer"
      />
      <div 
        className="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
        style={{
          backgroundColor: checked ? 'var(--primary)' : 'var(--muted)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      />
    </label>
  )
}

export default Switch
