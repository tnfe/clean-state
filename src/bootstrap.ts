import { useState, useCallback, useRef, useMemo } from 'react';
import { getInitialState, extractFns } from './helper';
import {
  BootstrapReturn,
  RootState,
  Effect,
  Reducer,
  AnyObject,
  InnerDispatch,
} from '../type';

/**
 * 启动项目
 * 挂载 modules 对象集合
 * 生成 state 和 dispatch
 * @param modules 模型对象集合
 */
function bootstrap<Modules>(modules: Modules): BootstrapReturn<Modules> {
  const initialState = getInitialState(modules);

  // 钩子函数，代理状态处理
  function useHook(_initialState: RootState<Modules>) {
    const [rootState, setRootState] = useState(_initialState);
    const ref = useRef<RootState<Modules>>(rootState);

    const dispatch = useCallback((type: string, payload: AnyObject): any => {
      try {
        const [moduleName, moduleFun] = type.split('.');
        const module = modules[moduleName];
        // 当 module 不存在
        if (!module) {
          console.error(`${moduleName} is not registry in store`);
          return;
        }

        const { reducers = {}, effects = {} } = module;

        const effect: Effect<RootState<Modules>> = effects[moduleFun];
        const reducer: Reducer = reducers[moduleFun];

        // 副作用优先执行
        if (effect) {
          effect.bind(module);
          return effect({ payload, rootState: ref.current, dispatch });
        }

        // 处理reducer
        if (reducer) {
          reducer.bind(module);
          setRootState((prevState) => {
            const moduleState = prevState[moduleName];
            const newState = reducer(payload, moduleState);
            // immutable 形式替换数据
            const compound = { ...prevState, [moduleName]: newState };
            Object.assign(ref.current, compound);
            return compound;
          });
        }
      } catch (err) {
        console.error(`${type} run error: ${err.stack}`);
        return Promise.reject(err);
      }
    }, []);

    useMemo(() => {
      const keys = Object.keys(modules);
      const map = {};

      // 注入每个 module 的effects和reducers
      // 方便 dispath.module.fn 形式调用
      keys.forEach((key: string) => {
        const { effects = {}, reducers = {} } = modules[key];
        const rFns = extractFns(key, dispatch)(reducers);
        const eFns = extractFns(key, dispatch)(effects);
        map[key] = { ...rFns, ...eFns };
        Object.assign(modules[key], map[key]);
      });
      Object.assign(dispatch, map);
    }, [dispatch]);

    const innerDispatch = dispatch as InnerDispatch<Modules>;
    return { state: rootState, dispatch: innerDispatch };
  }

  return { initialState, useHook };
}

export default bootstrap;
