import {useCallback} from 'react'
import { useModule, dispatch } from './modules'
import Project from './components/Project'
import './App.css';

function App() {
  const { user } = useModule('user')
  const onChange = useCallback((e)=> {
    const {target} = e
    dispatch.user.setValue({name: target.value})
  }, [])

  const onClick = useCallback(()=> {
    dispatch.user.fetchNameAndSet()
  }, [])

  console.log('app update')
  return (
    <div className="App">
      <div>
        <div>
          name: {user.name}
        </div>
        <div>
          修改用户名: <input onChange={onChange}></input>
        </div>
        <button onClick={onClick}>获取用户名</button>
      </div>
      <hr></hr>
      <Project></Project>
    </div>
  );
}

export default App;