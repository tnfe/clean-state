import {useCallback} from 'react'
import {useModule, dispatch} from '../modules'

const Tag = ()=> {
  const {project} = useModule('project')

  const onChange = useCallback((e)=> {
    const {target} = e
    dispatch('project/setValue', {name: target.value})
  })

  console.log('tag update')
  return <div>
    <div>
      tag: {project.name}
    </div>
    <input onChange={onChange}></input>
  </div>
}

export default Tag;