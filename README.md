# render-hooks

Use hooks anywhere in your render tree by wrapping your components in a `hooks` function.

See the example below for some use cases where this might be helpful:

```js
import * as React from "react";
import hooks from "@lewisl9029/render-hooks";

const Example = ({ colors }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      {isOpen
        ? // Ever wanted to to call a hook within a branching path?
          hooks(() => (
            <Modal
              close={React.useCallback(() => setIsOpen(false), [setIsOpen])}
            >
              <ul>
                {colors.map((color) =>
                  // Or within a mapping function?
                  hooks(() => (
                    <li style={useMemo(() => ({ color }), [color])}>{color}</li>
                  ))
                )}
              </ul>
            </Modal>
          ))
        : null}
    </div>
  );
};
```

## Motivation

By now I'm sure we're all deeply familiar with the infamous Rules of Hooks:

> Don’t call Hooks inside loops, conditions, or nested functions.

https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level

Often, to adhere to these rules, we end up adding extra layers of indirection into our render function in the form of components whose sole purpose is to act as a container for hook calls.

Consider the case of a simple Modal component that accepts a `close` function, where we would like to memoize the `close` function using `useCallback`.

We may want to write code that looks like this:

```js
const Example = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      {isOpen ? (
        // This violates the rule of hooks on branching
        <Modal close={React.useCallback(() => setIsOpen(false), [setIsOpen])}>
          Blah
        </Modal>
      ) : null}
    </div>
  );
};
```

But due to the rule of hooks on branching, we're instead forced to write code that looks like this:

```js
const ModalWrapper = ({ setIsOpen }) => (
  <Modal close={React.useCallback(() => setIsOpen(false), [setIsOpen])}>
    Blah
  </Modal>
);

const Example = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return <div>{isOpen ? <ModalWrapper setIsOpen={setIsOpen} /> : null}</div>;
};
```

So we're forced to add an extra layer of indirection to what used to be a simple, self-contained render function, in addition to being forced to write a bunch of boilerplate for creating the new component and drilling in all the necessary props (TypeScript users will feel double the pain here as they'd have to duplicate type declarations for the drilled-in props as well).

Some readers may point out that they _prefer_ the latter version to the earlier one, as they might feel encapsulating everything in that branch into a `ModalWrapper` component reduces noise and improves readability, i.e. that it's a _useful_ layer of indirection.

That's a perfectly valid position to take, but I'd like to remind those readers that the decision on whether or not to add any layer of indirection should reflect a value judgement on whether or not we feel the indirection is actually useful (inherently subjective and should be made on case-by-case basis), not forced upon us by some arbitrary implementation detail of the library we're using.

This is where `render-hooks` comes in.

## Installation

```js
npm i @lewisl9029/render-hooks
```

or

```
yarn add @lewisl9029/render-hooks
```

## Usage

```js
import * as React from "react";
import hooks from "@lewisl9029/render-hooks";

const Example = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      {isOpen
        ? // use hooks anywhere in the tree, without introducing another component
          hooks(() => (
            <Modal
              close={React.useCallback(() => setIsOpen(false), [setIsOpen])}
            >
              Blah
            </Modal>
          ))
        : null}
    </div>
  );
};
```

The `hooks` function from `render-hooks` acts as a component boundary for all of your hook calls. You can add it anywhere inside the render tree to call hooks in a way that would otherwise have violated the rules of hooks, without adding any additional layers of indirection.

Note that it also works great for looping:

```js
import * as React from "react";
import hooks from "@lewisl9029/render-hooks";

const Example = ({ colors }) => {
  return (
    <ul>
      {colors.map((color) =>
        hooks(() => (
          <li style={useMemo(() => ({ color }), [color])}>{color}</li>
        ))
      )}
    </ul>
  );
};
```

However, keep in mind that you still have to obey the rules of hooks within the `hooks` function:

```js
import * as React from "react";
import hooks from "@lewisl9029/render-hooks";

const Example = ({ colors }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      {isOpen
        ? hooks(() => (
            <Modal
              close={React.useCallback(() => setIsOpen(false), [setIsOpen])}
            >
              <ul>
                {colors.map((color) => (
                  // This still violates the rule of hooks on looping
                  <li style={useMemo(() => ({ color }), [color])}>{color}</li>
                ))}
              </ul>
            </Modal>
          ))
        : null}
    </div>
  );
};
```

We can, however, nest additional layers of the `hooks` function to arbitrary depths to work around this:

```js
import * as React from "react";
import hooks from "@lewisl9029/render-hooks";

const Example = ({ colors }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      {isOpen
        ? hooks(() => (
            <Modal
              close={React.useCallback(() => setIsOpen(false), [setIsOpen])}
            >
              <ul>
                {colors.map((color) =>
                  // All good now
                  hooks(() => (
                    <li style={useMemo(() => ({ color }), [color])}>{color}</li>
                  ))
                )}
              </ul>
            </Modal>
          ))
        : null}
    </div>
  );
};
```

(Though the extra levels of indenting could make code impractical to read past a certain point, so at some point we may still want to break down into separate components.)

Now we can go back to adding indirection only when we feel it's useful, instead of being forced to every time we want to call a hook inside a branch or loop.

## Linting

If you're using [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks), you'll get errors when trying to use `render-hooks` due to the plugin not recognizing that `hooks` can be treated as a valid component boundary.

I've created a fork of the plugin at https://www.npmjs.com/package/@lewisl9029/eslint-plugin-react-hooks to add support for this pattern. The changes are [very naive](https://github.com/lewisl9029/react/pull/1/files) however, so I do anticipate plenty of edge cases. Please feel free to report any issues you find with the plugin here.

## How it works

The implementation is literally 2 lines:

```js
export const Hooks = ({ children }) => children();
export const hooks = (children) => React.createElement(Hooks, { children });
```

By packaging it as a library I'm mostly trying to promote the pattern and make it easier to get people started using it. Feel free to simply copy paste this into your project and use it directly, replacing the eslint plugin with my fork from above. I hope to eventually document this pattern in an RFC so we can get official support for it in the linting rule without having to maintain a fork.

## Alternative API

Before v2, we provided a `Hooks` component as the default export that can be used like this:

```js
import * as React from 'react'
import Hooks from '@lewisl9029/render-hooks'

const Example = ({ colors }) => {
  const [isOpen, setIsOpen] = React.useState(false)
      
  return (
    <div>
      {isOpen ? 
        <Hooks>
          {() => (
            <Modal 
              close={React.useCallback(() => setIsOpen(false), [setIsOpen])}
            >
              <ul>
                {colors.map((color) => 
                  // All good now
                  <Hooks>
                    {() => <li style={useMemo(() => ({ color }), [color])}>{color}</li>}
                  </Hooks>
                )}
              </ul>
            </Modal>
          )}
        </Hooks> : 
        null
      }
    </div>
  )
}
```

Since v2, the default export has been changed to the newly introduced `hooks` function, which ends up being a lot more ergonomic to use due to the much simpler syntax and lower levels of indentation.

However, we do still provide the `Hooks` component as a named export for backwards compatibility, and for anyone who happens to prefer the old API. Simply change your import statement to:

```js
import { Hooks } from '@lewisl9029/render-hooks'
```

The linting rule fork will continue to support both variants.

## License

[MIT](https://github.com/lewisl9029/render-hooks/blob/master/src/LICENSE.txt)
