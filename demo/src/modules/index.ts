import user from './user'
import project from './project'
import common from './common'
import bootstrap, {mixin} from 'clean-state'

const modules = mixin(common, { user, project })

export const {useModule, dispatch}  = bootstrap(modules);