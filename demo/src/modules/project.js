const user = {
  state: {
    name: 'project'
  },
  reducers: {
    setValue({payload, preState}) {
      return {...payload, preState}
    }
  }
}

export default user;