import produce from 'immer';
import EventEmitter from 'eventemitter3';
import { splitPropertyAndMethod } from './helper';

type Listener = () => void;

class Container {
  private rootState: Record<string, any>;
  private rootReducers: Record<string, any>;
  private rootEffects: Record<string, any>;
  private emitter: EventEmitter;

  constructor(modules) {
    const initialData = splitPropertyAndMethod(modules);

    this.rootState = initialData.rootState;
    this.rootReducers = initialData.rootReducers;
    this.rootEffects = initialData.rootEffects;

    this.emitter = new EventEmitter();
  }

  public getRootEffects() {
    return this.rootEffects;
  }

  public getRootReducers() {
    return this.rootReducers;
  }

  public getRootState() {
    return this.rootState;
  }

  public getModule(namespace: string | string[]) {
    const combineModule = {};

    const assign = (k: string) => {
      const module = {
        state: this.rootState[k],
        reducers: this.rootReducers[k],
        effects: this.rootEffects[k],
      };

      Object.assign(combineModule, { [k]: module });
    };

    if (Array.isArray(namespace)) {
      namespace.forEach((k) => assign(k));
    } else {
      assign(namespace);
    }
    return combineModule;
  }

  public getState(namespace: string | string[]) {
    const combineModule = this.getModule(namespace);

    return Object.keys(combineModule).reduce((result, key) => {
      result[key] = combineModule[key].state;
      return result;
    }, {});
  }

  public setState(namespace: string, newState: Record<string, any>): void {
    this.rootState = produce(this.rootState, (draftState) => {
      draftState[namespace] = newState;
    });

    this.trigger(namespace);
  }

  public addListener(namespace: string | string[], listener: Listener): void {
    if (Array.isArray(namespace)) {
      namespace.forEach((k) => this.emitter.on(k, listener));
    } else {
      this.emitter.on(namespace, listener);
    }
  }

  public removeListener(
    namespace: string | string[],
    listener: Listener,
  ): void {
    if (Array.isArray(namespace)) {
      namespace.forEach((k) => this.emitter.removeListener(k, listener));
    } else {
      this.emitter.removeListener(namespace, listener);
    }
  }

  public trigger(namespace: string): void {
    this.emitter.emit(namespace);
  }
}

export default Container;
