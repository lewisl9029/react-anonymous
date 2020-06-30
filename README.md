# render-hooks

```js
const example = () => (
  <RenderState args={[false]}>
    {(isOpen, setIsOpen) =>
      isOpen ? (
        <RenderCallback args={[() => setIsOpen(false), [setIsOpen]]}>
          {(close) => <Modal close={close}>Blah</Modal>}
        </RenderCallback>
      ) : null
    }
  </RenderState>
)

const example2 = () => (
  <RenderHooks
    hooks={() => {
      const [isOpen, setIsOpen] = React.useState(false)
      const close = React.useCallback(() => setIsOpen(false), [setIsOpen])

      React.useEffect(() => {
        setIsOpen(true)
      }, [setIsOpen])

      return { isOpen, close }
    }}
  >
    {({ isOpen, close }) => (isOpen ? <Modal close={close}>Blah</Modal> : null)}
  </RenderHooks>
)
```
