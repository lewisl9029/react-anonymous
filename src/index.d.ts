import * as React from 'react'

type RenderFunction = () => React.ReactElement

export const Boundary: (props: {
  children: RenderFunction
}) => ReturnType<RenderFunction>

export const boundary: (children: RenderFunction) => ReturnType<RenderFunction>

export = boundary