import * as React from 'react'

type Children = () => React.ReactElement

export const Hooks: (props: {
  children: Children
}) => ReturnType<Children>

export = Hooks