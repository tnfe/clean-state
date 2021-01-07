# Clean-State

<p align="center">
  <img width="650px" src="https://github.com/freezeYe/assets/blob/master/cs.png" />
</p>

<div align="center">
<a href="https://www.npmjs.com/clean-state" target="_blank"><img src="https://img.shields.io/npm/v/clean-state" alt="Npm Version" /></a>
<a href="https://www.npmjs.com/clean-state" target="_blank"><img src="https://img.shields.io/npm/l/clean-state?style=flat-square" alt="Package License" /></a>
<a href="https://www.npmjs.com/clean-state" target="_blank"><img src="https://img.shields.io/npm/dm/clean-state" alt="Downloads" /></a>
</div>

## 介绍
🐻 一款纯净小巧的状态管理器，使用react-hooks原生实现，自动连接module组织架构。🍋如果你不是要制造一艘航空母舰又厌烦了复杂且难用的大型状态管理库，那么不妨来试试Clean-State。它小巧玲珑、性能极致完全可以满足你的需求。

## 特性
1.  使用 React 最新语法 useContext 和 useState 进行状态更新和同步。
2.  架构简单易用，module 层粒度精细可测，划分清晰。
3.  原生支持副作用，可异步和同步更新。
4.  性能优异，一定程度上可以精确更新目标组件。
5.  小巧，零依赖，仅100多行代码。
6.  仅仅是react语法，零学习接入成本。

## 安装
```javascript
npm i clean-state --save
```

## 使用
1. 模块定义
```javascript
// user.ts
export default {
  state: {
    name: ''
  },
  reducers: {
    setName(payload, currentState) {
        const { name } = payload
        return {...currentState, name}
    }
  },
  effects: {
    async getUser{payload, rootState, dispatch}) {
        const { uId } = payload
        const user = await fetch.get(`xxx?uid=${uId}`)
        dispatch.user.setName({name: user.name})
    }
  },
};
```

2.  模块注册
```javascript
// index.ts
import createContainer, { bootstrap } from 'clean-state';
import user from 'user'

const modules = {user}

const setUp = bootstrap(modules);
const cState = createContainer(setUp.useHook);

export const { initialState } = setUp;
export const { Provider, useModule } = cState;
```
    
3.  根节点引入
```javascript
// app.ts
import { Provider, initialState } from 'index.ts';
function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  // todo: here can modify initialState
  return <Provider initialState={initialState}>
      <Component {...pageProps} />
    </Provider>;
}
```
    
4.  组件调用
```javascript
// page.ts
import { useModule } from 'index.ts';
function Page() {
    const [state: {user}, dispatch] = useModule()
    const change = useCallback(()=> {
        const payload =  { name: 'test' }
        dispatch.user.setName(payload)
    }, [])
    return <div>
        <button onClick={change}>modify</button>
        {user.name}
    <div>
}
```

## 混入
    在很多情况下，多个module之间会存在公共的state、reducers或者effects。

```javascript
// common.ts
export default {
  reducers: {
    setValue<T>(payload: Record<keyof T, any>, state: T): T {
      return { ...state, ...payload };
    },
  },
};

// index.ts
import commont from 'common'
import user from 'user'
import { mixin } from 'src/store';

// user 模块混入了common的setValue方法
const modules = mixin(common, { user })
...

```

## 注意
    Dispatch优先级为 effects -> reducers，同模块下函数不允许同名。

## 许可
[MIT](./LICENSE)
