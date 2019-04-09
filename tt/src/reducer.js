import { UPDATE_INPUT } from './actionTypes'

export const reducer = (state, action) => {
  const getTime = (input, time) => {
    if (input.length < 2) return [0, Date.now()]
    const w = input.split(' ').length
    const m = (Date.now() - time) / 1000 / 60
    const wpm = Math.floor(w / m)
    return [wpm, time]
  }

  switch (action.type) {
    case UPDATE_INPUT: {
      if (state.sample === undefined) return state
      if (action.payload === undefined) return state
      const input = action.payload
      const trimmedSample = state.sample.slice(0, input.length)
      const match = trimmedSample === input
      const [wpm, time] = getTime(input, state.time)
      return { ...state, input, match, wpm, time }
    }
    default:
      return state
  }
}
