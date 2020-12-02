## Clean-State
####介绍
1.  使用 React 最新语法 useContext 和 useState 进行状态更新和同步。
2.  架构简单易用，module 层粒度精细可测，划分清晰。
3.  原生支持副作用，可异步和同步更新。
4.  性能优异，一定程度上可以精确更新目标组件
5.  小巧，零依赖，仅100行代码。

#### 使用
1. 模块定义
    ```javascript
    // user.ts
    export default {
      // module state
      state: {
        name: ''
      },
      // 
      reducers: {
        setName({name}, currentState, dispatch) {
            return {...currentState, name}
        }
      },
      // 副作用操作
      effects: {
        async setName({uId}) {
            const user = fetch.get(`xxx?uid=${uId}`)
            return {name: user.name}
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
    // 返回初始状态和包装后的钩子函数
    const [initialState: _initialState, hooks] = bootstrap(modules) 
    export default createContainer(hooks)
    export initialState = _initialState
    ```
    
3.  根节点引入
    ```javascript
    // app.ts
    import Container, { initialState } from 'index.ts';
    function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
      // todo: 这里可以修改默认状态
      return <Container.Provider initialState={initialState}>
          <Component {...pageProps} />
        </Container.Provider>;
    }
    ```
    
4.  组件调用
    ```javascript
    // page.ts
    import CState from 'index.ts';
    function Page() {
        const [state: {user}, dispatch] = CState.useContainer()
        const change = useCallback(()=> {
            const payload = {...}
            dispatch.user.setName(payload)
        }, [])
        return <div>
            <button onClick={change}>修改</button>
            {user.name}
        <div>
    }
    ```

注：dispatch采用链式调用，依次同名调用 effect -> reducer。当不存在副作用数据修改时，只声明reducers即可。