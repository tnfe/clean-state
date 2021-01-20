const state = {
  count: 0
}

const user = {
  state,
  reducers: {
    increaseCount({payload, state}: any) {
      const {count} = state
      const {num} = payload
      return {...state, count: count + num}
    }
  },
}

export default user;