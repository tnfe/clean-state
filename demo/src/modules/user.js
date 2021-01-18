const user = {
  state: {
    name: 'test'
  },
  reducers: {
    setValue({payload, preState}) {
      return {...payload, preState}
    }
  }
}

export default user;