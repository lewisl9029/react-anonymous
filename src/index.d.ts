import * as React from 'react'

type RenderFunction = () => React.ReactElement

export const Anonymous: (props: {
  children: RenderFunction,
  key: string,
}) => ReturnType<RenderFunction>

export = Anonymous