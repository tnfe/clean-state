import { useState, useCallback } from 'react';
import { Module, BootstrapReturn, ModulesFromMapObject, HookReturn, Effect, Mutation,  AnyAction, AnyObject } from './store';

/**
 * 启动项目
 * 挂载 modules 对象集合
 * 生成 state 和 dispatch
 * @param modules 模型对象集合
 */
function bootstrap<State>(modules: {[key: string]: Module}): BootstrapReturn<State> {
  const moduleKeys = Object.keys(modules);
  const state = {} as State;
  const moduleCache: ModulesFromMapObject = {};
  moduleKeys.forEach((key) => {
    const module = modules[key];
    const name = module.namespace || key;
    state[name] = module.state;
    moduleCache[name] = module;
  });

  function useHook(initialState: State): HookReturn<State>  {
    const [hookState, setHookState] = useState(initialState);
    const dispatch = useCallback(async (action: AnyAction, payload: AnyObject): Promise<void> => {
      const { type } = action;
      try {
        let result = payload;
        const [moduleName, moduleFun] = type.split('.');
        const module = moduleCache[moduleName];
        const { effects, mutations } = module;
        // if module is not exist
        if (!module) {
          console.error(`${moduleName} is not registry in store`);
          return;
        }
        const effect: Effect | null = effects[moduleFun];
        const mutation: Mutation = mutations[moduleFun];
        // 有副作用先行处理
        if (effect) {
          result = await effect(action, payload);
        }
        setHookState((prevState) => {
          const currentState = prevState[moduleName];
          const newState = mutation(result, currentState, dispatch);
          return { ...prevState, [moduleName]: newState };
        });
      } catch (err) {
        console.error(`${type} run error: ${err.stack}`);
      }
    }, []);

    return { state: hookState, dispatch };
  }

  return { state, useHook };
}

export default bootstrap;
