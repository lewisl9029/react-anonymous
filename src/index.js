import * as React from 'react'

export const Hooks = ({ children }) => children()
export const hooks = (children) => React.createElement(Hooks, { children })

export default hooks