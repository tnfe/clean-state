import { Module, MixinModule } from '../index.d';

/**
 * Mix in common variables and methods for all modules
 * @param {object} common
 * @param {object} modules
 */
const mixin = <C extends Module, M extends Record<string, Module>>(
  common: C,
  modules: M,
): MixinModule<C, M> => {
  const keys = Object.keys(modules);
  keys.forEach((key) => {
    const module = modules[key];
    module.state = module.state || {};
    module.reducers = module.reducers || {};
    module.effects = module.effects || {};
    // state mixin
    if (common.state) Object.assign(module.state, common.state);
    // reducer mixin
    if (common.reducers) Object.assign(module.reducers, common.reducers);
    // effects mixin
    if (common.effects) Object.assign(module.effects, common.effects);
  });

  return modules as MixinModule<C, M>;
};

export default mixin;
