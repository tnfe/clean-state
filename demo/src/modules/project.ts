const state = {
  project: '百花'
}

const user = {
  state,
  reducers: {
    setProject({payload, state}: any) {
      return {...state, ...payload}
    }
  },
}

export default user;