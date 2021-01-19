import { useEffect, useCallback, useState } from 'react';
import Container from './container';
import { Bootstrap } from '../index.d';

/**
 * This is FOX's entry method, connecting each individual module into a whole.
 * It exposes the user to which useModule hooks are used to register the module's state,
 * and to which dispatches are used to invoke the module's methods and side effects
 * @param {object} modules
 */
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

    // The side effects take precedence over the reducer execution
    if (effects[methodName]) {
      return effects[methodName]({ state, payload, rootState, dispatch });
    } else if (reducers[methodName]) {
      const newState = reducers[methodName]({
        state,
        rootState,
        payload,
        dispatch,
      });
      container.setState(namespace, newState);
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

  // Inject each module's reducer and effect method into the Dispatch
  const rootReducers = container.getRootReducers();
  const rootEffects = container.getRootEffects();
  injectFns(rootReducers);
  injectFns(rootEffects);

  return { useModule, dispatch };
};

export default bootstrap;
