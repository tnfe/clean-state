<p align="right">
  <strong>
    <a href="./README.md">English</a> |
    <a href="./docs/README-zh-cn.md">中文</a>
  </strong>
</p>

<p align="center">
  <img width="650px" src="https://github.com/freezeYe/assets/blob/master/cs.png" />
</p>

<div align="center">
<a href="https://www.npmjs.com/clean-state" target="_blank"><img src="https://img.shields.io/npm/v/clean-state" alt="Npm Version" /></a>
<a href="https://www.npmjs.com/clean-state" target="_blank"><img src="https://img.shields.io/npm/l/clean-state?style=flat-square" alt="Package License" /></a>
<a href="https://www.npmjs.com/clean-state" target="_blank"><img src="https://img.shields.io/npm/dm/clean-state" alt="Downloads" /></a>
</div>

## Overview
🐻 Clean-State is a neat, compact state management tool. It drops all of React's historical baggage, uses native hooks to implement it, and gets rid of Redux's problem of invalid rendering during status updates. At the architectural level it is automatically organized through a very simple API. 🍋 If you're not building an aircraft carrier and you're tired of having a large, complex and unwield-of-use State management library, try clean-state. It is small and exquisite, the performance of the extreme can meet your needs.

## Features
1.  Using native hooks implementation, zero external dependencies.
2.  The structure is simple, the module layer granularity is fine and measurable, and the division is clear.
3.  Excellent performance, can do module level accurate update.
4.  Native support side effects.
5.  It's extremely small, just 200 lines of code.
6.  Just React syntax, zero learning access cost.
7.  TypeScript friendly and automatically deduces module types.
8.  Support for Redux - Tool debugging tool.
9.  Perfect support for RN.

## Installation
```javascript
npm i clean-state --save
```

## Usage
#### 1.Define a module
```javascript
// modules/user.ts
const state = {
  name: 'test'
}

const user = {
  state,
  reducers: {
    setName({payload, state}) {
      return {...state, ...payload}
    }
  },
  effects: {
    async fetchNameAndSet({dispatch}) {
      const name = await Promise.resolve('fetch_name')
      dispatch.user.setName({name})
    }
  }
}

export default user;
```

#### 2.Registration module
```javascript
// modules/index.ts
import user from './user'
import bootstrapfrom 'clean-state'

const modules = { user }
export const {useModule, dispatch}  = bootstrap(modules);
```

#### 3.Use the module
```javascript
// page.ts
import {useCallback} from 'react'
import { useModule, dispatch } from './modules'

function App() {
  /** 
   * Here you can also pass in an array and return multiple module states at the same time 
   * const {user, project} = useModule(['user', 'project'])
   */
  const { user } = useModule('user')
  const onChange = useCallback((e)=> {
    const { target } = e
    dispatch.user.setName({name: target.value})
  }, [])

  const onClick = useCallback(()=> {
    dispatch.user.fetchNameAndSet()
  }, [])

  return (
    <div className="App">
      <div>
        <div>
          name: {user.name}
        </div>
        <div>
          modify: <input onChange={onChange}></input>
        </div>
        <button onClick={onClick}>getUserName</button>
      </div>
    </div>
  );
}

export default App;
```

## Mixin

In many cases, there are common states, reducers, or effects between multiple modules, and here we expose the methods to prevent users from making duplicate declarations in each module.

```javascript
// common.ts
const common = {
  reducers: {
    setValue<State>({payload, state}: {payload: Record<string, any>, state: State}): State {
      return {...state, ...payload}
    }
  }
}
export default common;

// modules/index.ts
import commont from './common'
import user from './user'
import { mixin } from 'clean-state';

// Mix Common's setValue method into the User module
const modules = mixin(common, { user })

// You can now call the dispatch.user.setValue method on other pages
export const {useModule, dispatch}  = bootstrap(modules);

```

## Module
### `state`
Module state, which is a property object.
```
{
    name: 'zhangsan',
    order: 1
}
```
### `reducers`
A collection of handlers that change the state of a module, returning the latest state.
```
{
    setValue({payload, state, rootState}) {
        return {...payload, ...state}
    }
}
```

### `effects`
Module's collection of side effects methods that handle asynchronous calls.
```
{
    async fetchAndSetValue({payload, state, rootState, dispatch}) {
        const newOrder = await fetch('xxx')
        dispatch.user.setValue({order: newOrder})
    }
}
```

## API

### `bootstrap(modules)`
| Property | Description | Type |
| :----: | :----: | :----: |
| modules | A collection of registered modules | {string, Module} |

### `useModule(moduleName)`
| Property | Description | Type |
| :----: | :----: | :----: |
| moduleName | The name of the module used returns the corresponding status | string / string[] |

### `mixin(common, modules)`
| Property | Description | Type |
| :----: | :----: | :----: |
| common | Public modules that need to be injected | Module |
| modules | A collection of registered modules | Module |

### `dispatch.{moduleName}.{fnName}(payload)`
| Property | Description | Type |
| :----: | :----: | :----: |
| moduleName | The specific module name of the call should be registered in Bootstrap | string |
| fnName | The method name of the call module, reducer/effect | string |
| payload | The load value passed | object |


## Notice

Dispatch calls take precedence at effects-> reducers, so when there are reducers and effects with the same name under a module, only effects are executed.

## Issues

If you have better suggestions for this library, or have any problems using it, you can write them here: [https://github.com/tnfe/clean-state/issues](https://github.com/tnfe/clean-state/issues) 

## License
[MIT](./LICENSE)
