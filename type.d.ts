import React from 'react';

export interface Module {
  state?: Record<string, any>;
  reducers?: Record<string, Reducer>;
  effects?: Record<string, Effect<any>>;
}

export type BaseModules = Record<string, Module>;

export type RootState<Modules> = {
  [key in keyof Modules]: Modules[key]['state'];
};

export type UseHook<Value, State> = (initialState?: State) => Value;

export type AnyObject = Record<string, any>;

export type Dispatch = (type: string, payload: AnyObject) => any;

export type EffectProps<T> = {
  payload: AnyObject;
  dispatch: AnyObject;
  rootState: T;
};

export type Effect<T> = (props: EffectProps<T>) => any;

export type Reducer = (
  payload: AnyObject,
  currentState: Record<string, any>,
) => any;

export interface HookReturn<Modules extends BaseModules> {
  state: RootState<Modules>;
  dispatch: InnerDispatch<Modules>;
}

export interface BootstrapReturn<Modules> {
  initialState: RootState<Modules>;
  useHook: (initialState: RootState<Modules>) => HookReturn<Modules>;
}

export interface ContainerProviderProps<State = void> {
  initialState?: State;
  children: React.ReactNode;
}

export interface Container<Value, State = void> {
  Provider: React.ComponentType<ContainerProviderProps<State>>;
  useModule: () => Value;
}

export type RootEffects<Modules extends BaseModules> = {
  [key in keyof Modules]: Modules[key]['effects'] extends undefined
    ? Record<string, any>
    : {
        [fnKey in keyof Modules[key]['effects']]: (
          payload?: Parameters<Modules[key]['effects'][fnKey]>[0]['payload'],
        ) => any;
      };
};

export type RootReducers<Modules extends BaseModules> = {
  [key in keyof Modules]: Modules[key]['reducers'] extends undefined
    ? Record<string, any>
    : {
        [fnKey in keyof Modules[key]['reducers']]: (
          payload?: Parameters<Modules[key]['reducers'][fnKey]>[0]['payload'],
        ) => any;
      };
};

export type InnerDispatch<Modules> = Dispatch &
  RootEffects<Modules> &
  RootReducers<Modules>;

export type MixinModule<C extends Module, M extends BaseModules> = {
  [key in keyof M]: {
    state: M[key]['state'] & C['state'];
    reducers: M[key]['reducers'] & C['reducers'];
    effects: M[key]['effects'] & C['effects'];
  };
};
