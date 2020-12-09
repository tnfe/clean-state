import React from 'react';
import { ContainerProviderProps, UseHook, Container } from './type';

const EMPTY: unique symbol = Symbol();

export function createContainer<Value, State = void>(
  useHook: UseHook<Value, State>,
): Container<Value, State> {
  const Context = React.createContext<Value | typeof EMPTY>(EMPTY);

  function Provider(props: ContainerProviderProps<State>) {
    const value = useHook(props.initialState);
    return <Context.Provider value={value}>{props.children}</Context.Provider>;
  }

  function useModule(): Value {
    const value = React.useContext(Context);
    if (value === EMPTY) {
      throw new Error('Component must be wrapped with <Container.Provider>');
    }
    return value;
  }

  return { Provider, useModule };
}
