import * as React from 'react'

export const Anonymous = ({ children }) => children()
export const anonymous = (children, { key } = {}) => React.createElement(Anonymous, { children, key })

export default anonymous