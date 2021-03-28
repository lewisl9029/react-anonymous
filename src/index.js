import * as React from 'react'

export const Boundary = ({ children }) => children()
export const boundary = (children) => React.createElement(Boundary, { children })

export default boundary