const user = {
  state: {
    name: 'test'
  },
  reducers: {
    setName({payload, state}) {
      return {...state, ...payload}
    }
  },
  effects: {
    async getName({payload, dispatch}) {
      const name = await Promise.resolve(payload.name)
      dispatch.user.setName({name})
    }
  }
}

export default user;