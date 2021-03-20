import {useCallback, memo} from 'react'
import {useModule, dispatch} from '../modules'

const Project = memo(()=> {

  const {project} = useModule('project')
  const increase = useCallback(()=> {
    dispatch.project.increaseCount({num: 1})
  }, [])

  console.log('project update')
  return <div>
    project count: {project.count}
    <button onClick={increase}>+</button>
  </div>
})

export default Project