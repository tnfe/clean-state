const common = {
  reducers: {
    setValue<State>({payload, state}: {payload: Record<string, any>, state: State}): State {
      return {...state, ...payload}
    }
  }
}

export default common;