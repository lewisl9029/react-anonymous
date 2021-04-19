import * as React from 'react'

type RenderFunction = () => React.ReactElement

export const Anonymous: (props: {
  children: RenderFunction
}) => ReturnType<RenderFunction>

export const anonymous: (children: RenderFunction, options?: { key?: string }) => ReturnType<RenderFunction>

export = anonymous