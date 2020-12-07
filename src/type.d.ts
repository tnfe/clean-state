import React from 'react';

export type RootState<Modules extends Record<string, any>> = {
  [key in keyof Modules]: Modules[key]['state'];
};

export type UseHook<Value, State> = (initialState?: State) => Value;

export type AnyObject = Record<string, any>;

export type Dispatch = (type: string, payload: AnyObject) => Promise<any>;

export type Effect = (payload: AnyObject, dispatch: Dispatch) => any;

export type Reducer<RootState> = (
  payload: AnyObject,
  currentState: RootState,
) => any;

export interface HookReturn<RootState, Modules> {
  state: RootState;
  dispatch: Dispatch & InnerDispatch<Modules>;
}

export interface BootstrapReturn<RootState, Modules> {
  initialState: RootState;
  useHook: (initialState: RootState) => HookReturn<RootState, Modules>;
}

export interface ContainerProviderProps<State = void> {
  initialState?: State;
  children: React.ReactNode;
}

export interface Container<Value, State = void> {
  Provider: React.ComponentType<ContainerProviderProps<State>>;
  useModule: () => Value;
}

export type RootEffects<Modules extends Record<string, any>> = {
  [key in keyof Modules]: Modules[key]['effects'] extends undefined
    ? Record<string, unknown>
    : {
        [fnKey in keyof Modules[key]['effects']]: (
          payload: Parameters<Modules[key]['effects'][fnKey]>[0],
        ) => any;
      };
};

export type RootReducers<Modules extends Record<string, any>> = {
  [key in keyof Modules]: Modules[key]['reducers'] extends undefined
    ? Record<string, unknown>
    : {
        [fnKey in keyof Modules[key]['reducers']]: (
          payload: Parameters<Modules[key]['reducers'][fnKey]>[0],
        ) => any;
      };
};

export type InnerDispatch<Modules> = RootEffects<Modules> &
  RootReducers<Modules>;
