## Clean-State
####介绍
1.  使用 React 最新语法 useContext 和 useState 进行状态更新和同步。
2.  架构简单易用，module 层粒度精细可测，层次划分清晰。
3.  原生支持副作用，可异步更新和同步更新。
3.  小巧，零依赖，仅仅100行代码。

#### 使用
1.  模块注册
    ```javascript
    // index.ts
    import createContainer, { bootstrap } from 'src/store';
    import modules from 'xxx'
    
    // 返回初始状态和包装后的钩子函数
    const [initialState: _initialState, hooks] = bootstrap(modules) 
    export default createContainer(hooks)
    export initialState = _initialState
    ```
    
2.  根节点引入
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
    
3.  组件调用
    ```javascript
    // page.ts
    import Container from 'index.ts';
    function Page() {
        const [state, dispatch] = Container.useContainer()
        const change = useCallback(()=> {
            const payload = {...}
            dispatch({type: [namespace].[effect | mutation]}, payload)
        }, [])
        return <div>
            <button onClick={change}>修改</button>
            {state.[namespace].[value]}
        <div>
    }
    ```
    
#### 模块定义
```javascript
export default {
  // 模块注册名，为空时取export名
  namespace: 'moduleA', 
  // 状态定义
  state: {},
  // 状态修改
  mutations: {},
  // 副作用操作
  effects: {},
};
type effect = (action: AnyAction, payload: BaseObject)=> {[name: string]: any}
type mutation = (payload: BaseObject, currentState: BaseObject, dispatch: Dispatch)=> {[key in state]: any}
```
注：dispatch采用链式调用，依次同名调用 effect -> mutation。当不存在副作用数据修改时，只声明mutations即可。