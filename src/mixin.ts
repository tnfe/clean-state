import { Module, MixinModule } from '../type';

// 对模块混入公共方法
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
    if (common.state) Object.assign(module.state, common.state);
    if (common.reducers) Object.assign(module.reducers, common.reducers);
    if (common.effects) Object.assign(module.effects, common.effects);
  });

  return modules as MixinModule<C, M>;
};

export default mixin;
