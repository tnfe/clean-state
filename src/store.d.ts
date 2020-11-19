import React from 'react';

export type UseHook<Value, State> = (initialState?: State) => Value
export type AnyObject = {
  [name: string]: any
}
export type Dispatch = (action: AnyAction, payload: AnyObject) => Promise<void>
export type Effect = (action: AnyAction, payload: AnyObject)=> any
export type Mutation = (payload: AnyObject, currentState: AnyObject, dispatch: Dispatch)=> any
export type ModulesFromMapObject = {[key: string]: Module}

export interface ContainerProviderProps<State = void> {
	initialState?: State
	children: React.ReactNode
}
export interface Container<Value, State = void> {
	Provider: React.ComponentType<ContainerProviderProps<State>>
	useContainer: () => Value
}
export interface AnyAction extends AnyObject {
  type: string,
}
export interface Module {
  namespace?: string,
  state: {[key: string]: any}
  effects: {[funName: string]: Effect}
  mutations: {[funName: string]: Mutation}
}
export interface HookReturn<State> {
  state: State,
  dispatch: (action: AnyAction, payload: AnyObject)=> Promise<void>
}
export interface BootstrapReturn<State> {
  state: State,
  useHook: (initialState: State)=> HookReturn<State>
}
