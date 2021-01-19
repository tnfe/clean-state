export interface Module {
  state?: Record<string, any>;
  reducers?: Record<string, any>;
  effects?: Record<string, any>;
}

export type Bootstrap = <Modules>(
  modules: Modules,
) => {
  useModule: UseModule<Modules>;
  dispatch: InnerDispatch<Modules>;
};

export type NameSpaceDeclare<Modules> = keyof Modules | (keyof Modules)[];

export type UseModule<
  Modules extends Record<string, Module>,
  NameSpace extends NameSpaceDeclare = keyof Modules
> = (namespace: NameSpace) => CombineState<Modules, NameSpace>;

export type CombineState<
  Modules extends Record<string, Module>,
  Namespace extends NameSpaceDeclare
> = Namespace extends keyof Modules
  ? Modules[Namespace]['state']
  : { [key in Namespace]: Modules[key]['state'] };

export type RootEffects<Modules> = {
  [key in keyof Modules]: Modules[key]['effects'] extends undefined
    ? Record<string, any>
    : {
        [fnKey in keyof Modules[key]['effects']]: (
          payload?: Parameters<Modules[key]['effects'][fnKey]>[0]['payload'],
        ) => any;
      };
};

export type RootReducers<Modules> = {
  [key in keyof Modules]: Modules[key]['reducers'] extends undefined
    ? Record<string, any>
    : {
        [fnKey in keyof Modules[key]['reducers']]: (
          payload?: Parameters<Modules[key]['reducers'][fnKey]>[0]['payload'],
        ) => any;
      };
};

export type Dispatch = (
  namespace: string,
  payload?: Record<string, any>,
) => any;

export type InnerDispatch<Modules> = Dispatch &
  RootEffects<Modules> &
  RootReducers<Modules>;

export type MixinModule<C, M> = {
  [key in keyof M]: {
    state: M[key]['state'] & C['state'];
    reducers: M[key]['reducers'] & C['reducers'];
    effects: M[key]['effects'] & C['effects'];
  };
};

export declare const bootstrap: Bootstrap;
