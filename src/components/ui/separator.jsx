import React from 'react'

export function Separator({ className = '', ...props }) {
  return <hr className={className} {...props} />
}

export default Separator
