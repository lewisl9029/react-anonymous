# render-hooks

```js
import * as React from 'react'
import Hooks from '@lewisl9029/render-hooks'

const Example = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setIsOpen(true)
  }, [setIsOpen])
      
  return (
    <div>
      {isOpen ? 
        // use hooks anywhere in the tree, without introducing another component
        <Hooks>
          {() => (
            <Modal 
              close={React.useCallback(() => setIsOpen(false), [setIsOpen])}
            >
              Blah
            </Modal>
          )}
        </Hooks> : 
        null
      }
    </div>
  )
}
```
