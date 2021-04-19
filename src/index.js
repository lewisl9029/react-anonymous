import * as React from 'react'

export const Boundary = ({ children }) => children()
export const anonymous = (children, { key } = {}) => React.createElement(Boundary, { children, key })

export default anonymous