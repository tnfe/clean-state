# Clean-State

![logo](https://github.com/freezeYe/assets/blob/master/cs.png)

## 介绍
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
    import createContainer, { bootstrap } from '@tencent/clean-state';
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
    import Container, { initialState } from 'index.ts';
    function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
      // todo: here can modify initialState
      return <Container.Provider initialState={initialState}>
          <Component {...pageProps} />
        </Container.Provider>;
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

## 注意
Dispatch优先级为 effects -> reducers，同模块下函数不允许同名。

## 许可
clean-state在MIT License下允许使用。
