import user from './user'
import project from './project'
import bootstrap from './cState'

const modules = { user, project }

export const {useModule, dispatch} = bootstrap(modules)
