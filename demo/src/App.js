import {useCallback} from 'react'
import {useModule, dispatch} from './modules'
import Tag from './component/tag'
import './App.css';

function App() {
  const { user } = useModule('user')

  const onChange = useCallback((e)=> {
    const {target} = e
    dispatch('user/setValue', {name: target.value})
  })

  console.log('app update')
  return (
    <div className="App">
      <div>
        {user.name}
      </div>
      <div>
        <input onChange={onChange}></input>
      </div>
      <Tag></Tag>
    </div>
  );
}

export default App;
