import {useCallback} from 'react'
import {useModule, dispatch} from '../modules'

const Project = ()=> {

  const {project} = useModule('project')
  const increace = useCallback(()=> {
    dispatch.project.increaseCount({num: 1})
  }, [])

  console.log('project update')
  return <div>
    project count: {project.count}
    <button onClick={increace}>+</button>
  </div>
}

export default Project