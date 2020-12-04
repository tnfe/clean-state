import { useState, useCallback, useMemo } from 'react';
import { getInitialState, extractFns } from './helper';
import {
  BootstrapReturn,
  RootState,
  Effect,
  Reducer,
  AnyObject,
  InnerDispatch,
} from 'src/types/store';

/**
 * 启动项目
 * 挂载 modules 对象集合
 * 生成 state 和 dispatch
 * @param modules 模型对象集合
 */
function bootstrap<Modules>(
  modules: Modules,
): BootstrapReturn<RootState<Modules>, Modules> {
  const initialState = getInitialState(modules);

  // 钩子函数，代理状态处理
  function useHook(_initialState: RootState<Modules>) {
    const [hookState, setHookState] = useState(_initialState);

    const dispatch = useCallback(
      async (type: string, payload: AnyObject): Promise<any> => {
        let resolver;
        let rejector;
        try {
          const [moduleName, moduleFun] = type.split('.');
          const module = modules[moduleName];
          // 当 module 不存在
          if (!module) {
            console.error(`${moduleName} is not registry in store`);
            return;
          }

          const { reducers = {}, effects = {} } = module;
          // 副作用先行处理
          const effect: Effect = effects[moduleFun];
          const result = effect ? await effect(payload, dispatch) : payload;

          // 处理mutation方法
          setHookState((prevState) => {
            const reducer: Reducer<RootState<Modules>> = reducers[moduleFun];
            const currentState = prevState[moduleName];
            const newState = reducer(result, currentState);
            const compound = { ...prevState, [moduleName]: newState };
            resolver(compound);
            return compound;
          });
        } catch (err) {
          console.error(`${type} run error: ${err.stack}`);
          rejector(err);
        }
        return new Promise((resolve, reject) => {
          resolver = resolve;
          rejector = reject;
        });
      },
      [],
    );

    useMemo(() => {
      const keys = Object.keys(modules);
      const map = {};

      keys.forEach((key: string) => {
        const { effects = {}, reducers = {} } = modules[key];
        const rFns = extractFns(key, dispatch)(reducers);
        const eFns = extractFns(key, dispatch)(effects);
        map[key] = { ...rFns, ...eFns };
      });
      return Object.assign(dispatch, map);
    }, [dispatch]);
    const innerDispatch = dispatch as typeof dispatch & InnerDispatch<Modules>;
    return { state: hookState, dispatch: innerDispatch };
  }

  return { initialState, useHook };
}

export default bootstrap;
