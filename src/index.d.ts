import * as React from 'react'

type RenderFunction = () => React.ReactElement

export const Hooks: (props: {
  children: RenderFunction
}) => ReturnType<RenderFunction>

export const hooks: (children: RenderFunction) => ReturnType<RenderFunction>

export = hooks