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
    async getName({payload, dispatch}: any) {
      const name = await Promise.resolve(payload.name)
      dispatch.user.setName({name})
    }
  }
}

export default user;