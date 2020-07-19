import * as React from 'react'

type Children = () => React.ReactNode

export const Hooks: (props: {
  children: Children
}) => ReturnType<Children>

export = Hooks