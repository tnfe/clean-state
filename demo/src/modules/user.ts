const state = {
  name: 'test'
}

const user = {
  state,
  reducers: {
    setName({payload, state}: any) {
      return {...state, ...payload}
    }
  },
  effects: {
    async fetchNameAndSet({dispatch}: any) {
      const name = await Promise.resolve('fetch_name')
      dispatch.user.setName({name})
    }
  }
}

export default user;