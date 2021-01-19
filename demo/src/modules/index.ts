import user from './user'
import bootstrap from '../../../src/index'

const modules = { user }

export const {useModule, dispatch}  = bootstrap(modules);