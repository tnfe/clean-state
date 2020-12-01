import { RootState, AnyObject, Dispatch } from './type';

// 按照命名空间展平 modules 对象
export const getInitialState = <Modules>(
  modules: Modules,
): RootState<Modules> => {
  const entries = Object.entries(modules);
  const initialState = {} as RootState<Modules>;
  entries.forEach(([key, module]) => {
    initialState[key] = module.state; // 暂存 state
  });
  return initialState;
};

// 提取 reducers 和 effects 方法
export const extractFns = (namespace: string, next: Dispatch) => (
  fns = {},
): Record<string, any> =>
  Object.keys(fns).reduce((result, fnKey) => {
    const fn = (payload: AnyObject) => {
      const type = `${namespace}.${fnKey}`;
      return next(type, payload);
    };
    return { ...result, [fnKey]: fn };
  }, {});
