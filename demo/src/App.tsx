import {useCallback} from 'react'
import {useModule, dispatch} from './modules'
import './App.css';

function App() {
  const { user } = useModule('user')
  const onChange = useCallback((e)=> {
    const {target} = e
    dispatch.user.setName({name: target.value})
  }, [])

  return (
    <div className="App">
      <div>
        <div>
          name: {user.name}
        </div>
        <div>
          <input onChange={onChange}></input>
        </div>
      </div>
    </div>
  );
}

export default App;