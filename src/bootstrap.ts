import { useEffect, useCallback, useState } from 'react';
import Container from './container';
import { Bootstrap } from '../index.d';

const bootstrap: Bootstrap = <Modules>(modules: Modules) => {
  const container = new Container(modules);

  const dispatch: any = (
    nameAndMethod: string,
    payload: Record<string, any>,
  ) => {
    const [namespace, methodName] = nameAndMethod.split('/');
    const combineModule = container.getModule(namespace);

    const { state, reducers, effects } = combineModule[namespace];
    const rootState = container.getRootState();
    if (reducers[methodName]) {
      const newState = reducers[methodName]({
        state,
        rootState,
        payload,
        dispatch,
      });
      container.setState(namespace, newState);
    } else if (effects[methodName]) {
      return effects[methodName]({ state, payload, rootState, dispatch });
    }
  };

  const injectFns = (reducersOrEffects) => {
    Object.keys(reducersOrEffects).forEach((key) => {
      if (!dispatch[key]) dispatch[key] = {};
      const reducers = rootReducers[key];
      const fns = {};
      Object.keys(reducers).forEach((fnKey) => {
        fns[fnKey] = (payload: Record<string, any>) =>
          dispatch(`${key}/fnKey`, payload);
      });
    });
  };

  const useModule: any = function (namespace: string | string[]) {
    const [, setState] = useState({});
    const combineState = container.getState(namespace);

    const setStateProxy = useCallback(() => setState({}), [setState]);
    useEffect(() => {
      container.addListener(namespace, setStateProxy);

      return () => container.removeListener(namespace, setStateProxy);
    }, [namespace, setStateProxy]);

    return combineState;
  };

  const rootReducers = container.getRootReducers();
  const rootEffects = container.getRootEffects();
  injectFns(rootReducers);
  injectFns(rootEffects);

  return { useModule, dispatch };
};

export default bootstrap;
