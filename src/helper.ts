/**
 * Split Each module state and method
 * @param {object} modules
 */
export function splitPropertyAndMethod(modules: Record<string, any>) {
  const rootState = {};
  const rootReducers = {};
  const rootEffects = {};

  Object.keys(modules).forEach((key) => {
    const module = modules[key];

    rootState[key] = {};
    rootReducers[key] = {};
    rootEffects[key] = {};

    Object.assign(rootState[key], module.state);
    Object.assign(rootReducers[key], module.reducers);
    Object.assign(rootEffects[key], module.effects);
  });

  return { rootState, rootReducers, rootEffects };
}
