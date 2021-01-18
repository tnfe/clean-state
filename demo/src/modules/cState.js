import { useState, useEffect, useCallback } from "react"
import produce from "immer"
import EventEmitter from 'eventemitter3'

function splitPropertyAndMethod(modules) {
  const rootState = {}
  const rootReducers = {}
  const rootEffects = {}

  Object.keys(modules).forEach((key)=> {
    const module = modules[key]
    
    rootState[key] = {}
    rootReducers[key] = {}
    rootEffects[key] = {}

    Object.assign(rootState[key], module.state)
    Object.assign(rootReducers[key], module.reducers)
    Object.assign(rootEffects[key], module.effects)
  })

  return {rootState, rootReducers, rootEffects}
}

class Container {
  constructor(modules) {
    const initialData = splitPropertyAndMethod(modules)

    this.rootState = initialData.rootState
    this.rootReducers = initialData.rootReducers
    this.rootEffects = initialData.rootEffects

    this.emitter = new EventEmitter()
  }

  getRootState() {
    return this.rootState
  }
  
  getModule(namespace) {
    const combineModule = {}

    const assign = (k)=> {
      const module = {
        state: this.rootState[k],
        reducers: this.rootReducers[k],
        effects: this.rootEffects[k]
      }

      Object.assign(combineModule, {[k]: module})
    }

    if(Array.isArray(namespace)) {
      namespace.forEach(k => assign(k))
    }else {
      assign(namespace)
    }
    return combineModule
  }

  getState(namespace) {
    const combineModule = this.getModule(namespace)

    return Object.keys(combineModule).reduce((result, key)=> {
      result[key] = combineModule[key].state
      return result
    }, {})
  }

  setState(namespace, newState) {
    this.rootState = produce(this.rootState, draftState => {
      draftState[namespace] = newState
    })

    this.trigger(namespace)
  }

  addListener(namespace, listener) {
    if(Array.isArray(namespace)) {
      namespace.forEach(k=> this.emitter.on(k, listener))
    }else {
      this.emitter.on(namespace, listener)
    }
  }

  removeListener(namespace, listener) {
    if(Array.isArray(namespace)) {
      namespace.forEach(k=> this.emitter.removeListener(k, listener))
    }else {
      this.emitter.removeListener(namespace, listener)
    }
  }

  trigger(namespace) {
    this.emitter.emit(namespace)
  }
}

const bootstrap = (modules)=> {
  const container = new Container(modules)

  const dispatch = async (nameAndMethod, payload)=> {
    const [namespace, methodName] = nameAndMethod.split('/')
    const combineModule = container.getModule(namespace)

    const {state, reducers, effects} = combineModule[namespace]
    const rootState = container.getRootState()
    if(reducers[methodName]) {
      const newState = reducers[methodName]({state, rootState, payload, dispatch})
      container.setState(namespace, newState)
    }else if(effects[methodName]) {
      await effects[methodName]({state, payload, rootState, dispatch})
    }
  }

  function useModule(namespace) {
    const [, setState] = useState({})
    const combineState = container.getState(namespace)

    const setStateProxy = useCallback(()=> setState({}), [setState])
    useEffect(()=> {
      container.addListener(namespace, setStateProxy)

      return ()=> container.removeListener(namespace, setStateProxy)
    }, [namespace, setStateProxy])

    return combineState
  }

  return {useModule, dispatch}
}

export default bootstrap