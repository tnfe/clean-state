import { useEffect, useCallback, useState } from 'react';
import EventEmitter from 'eventemitter3';
import Container from './container';
import { Bootstrap, Plugin } from '../index.d';

const DISPATCH_TYPE = 'CS_DISPATCH_TYPE';
const plugins: Plugin[] = [];

/**
 * This is CS's entry method, connecting each individual module into a whole.
 * It exposes the user to which useModule hooks are used to register the module's state,
 * and to which dispatches are used to invoke the module's methods and side effects
 * @param {object} modules
 */
const bootstrap: Bootstrap = <Modules>(modules: Modules) => {
  const container = new Container(modules);
  const pluginEmitter = new EventEmitter();

  // The only module method call that is exposed to the outside world
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
      pluginEmitter.emit(DISPATCH_TYPE, {
        type: nameAndMethod,
        payload,
      });
      return effects[methodName]({ state, payload, rootState, dispatch });
    } else if (reducers[methodName]) {
      const newState = reducers[methodName]({
        state,
        rootState,
        payload,
      });
      container.setState(namespace, newState);

      // Sync state to plugin
      pluginEmitter.emit(DISPATCH_TYPE, {
        type: nameAndMethod,
        payload,
        newState,
      });
    }
  };

  const injectFns = (reducersOrEffects) => {
    Object.keys(reducersOrEffects).forEach((key) => {
      if (!dispatch[key]) dispatch[key] = {};
      const originFns = reducersOrEffects[key];
      const fns = {};
      Object.keys(originFns).forEach((fnKey) => {
        fns[fnKey] = (payload: Record<string, any>) =>
          dispatch(`${key}/${fnKey}`, payload);
      });
      Object.assign(dispatch[key], fns);
    });
  };

  // This hook function exports the module state required by the user
  // and does the dependent binding of data to the view
  function useModule(namespace: string | string[]): any {
    const [, setState] = useState({});

    const setStateProxy = useCallback(() => setState({}), [setState]);

    useEffect(() => {
      container.addListener(namespace, setStateProxy);
      return () => container.removeListener(namespace, setStateProxy);
    }, [namespace, setStateProxy]);

    return container.getState(namespace);
  }

  // Inject each module's reducer and effect method into the Dispatch
  const rootReducers = container.getRootReducers();
  const rootEffects = container.getRootEffects();

  injectFns(rootReducers);
  injectFns(rootEffects);

  plugins.forEach((plugin) => plugin(modules, pluginEmitter));
  return { useModule: useModule as any, dispatch };
};

bootstrap.addPlugin = (plugin) => {
  plugins.push(plugin);
};
bootstrap.DISPATCH_TYPE = DISPATCH_TYPE;

export default bootstrap;
