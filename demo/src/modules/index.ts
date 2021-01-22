import user from './user'
import project from './project'
import common from './common'
import devtool from 'cs-redux-devtool'

import bootstrap, {mixin} from 'clean-state'

const modules = mixin(common, { user, project })

bootstrap.addPlugin(devtool)
export const {useModule, dispatch}  = bootstrap(modules);