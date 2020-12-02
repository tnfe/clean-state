## Clean-State
#### Introduce
1. Use React's latest syntax useContext and useState for state update and synchronization.
2. The architecture is simple and easy to use, the module layer granularity is fine and measurable, and the division is clear.
3. Native support for side effects, asynchronous and synchronous updates.
4. Excellent performance, can accurately update the target component to a certain extent
5. Small and exquisite, zero dependence, only more than 100 lines of code.

#### Install
```javascript
npm i clean-state --save
```

#### Usage
1. module definition
    ```javascript
    // user.ts
    export default {
      state: {
        name: ''
      },
      reducers: {
        setName({name}, currentState, dispatch) {
            return {...currentState, name}
        }
      },
      effects: {
        async setName({uId}) {
            const user = fetch.get(`xxx?uid=${uId}`)
            return {name: user.name}
        }
      },
    };
    ```

2.  module registration
    ```javascript
    // index.ts
    import createContainer, { bootstrap } from 'clean-state';
    import user from 'user'
    
    const modules = {user}

    const [initialState: _initialState, hooks] = bootstrap(modules)
    
    export default createContainer(hooks)
    export initialState = _initialState
    ```
    
3.  root node introduction
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
    
4.  component call
    ```javascript
    // page.ts
    import CState from 'index.ts';
    function Page() {
        const [state: {user}, dispatch] = CState.useModule()
        const change = useCallback(()=> {
            const payload = {...}
            dispatch.user.setName(payload)
        }, [])
        return <div>
            <button onClick={change}>modify</button>
            {user.name}
        <div>
    }
    ```

Note: Dispatch uses chain call, and call effect -> reducer with the same name in turn. When there is no side effect data modification, just declare reducers.