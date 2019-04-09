import React, { useReducer, useMemo, useContext, createContext } from 'react'
import { reducer } from './reducer.js'
import { UPDATE_INPUT } from './actionTypes'

const Context = createContext([{}, () => {}])

export const App = ({ sample }) => {
  const initialState = { sample, input: '', match: true, wpm: 0 }

  const [s, d] = useReducer(reducer, initialState)
  const context = useMemo(() => [s, d], [s, d])

  return (
    <div className="w5 mw-100 center">
      <Context.Provider value={context}>
        <Counter />
        <Input />
        <Copy />
      </Context.Provider>
    </div>
  )
}

const Input = () => {
  const [state, dispatch] = useContext(Context)

  return (
    <input
      className="bg-near-white outline-0 bb bw0 f3 w-100 center dark-gray serif pa2 tc"
      autoCapitalize="none"
      autoCorrect="off"
      autoComplete="off"
      type="text"
      placeholder="start typing..."
      autoFocus="autofocus"
      value={state.input}
      onChange={({ target: { value } }) =>
        dispatch({ type: UPDATE_INPUT, payload: value })
      }
    />
  )
}

const Counter = () => {
  const [state] = useContext(Context)
  return (
    <p className="serif pa2 gray tc">
      <span className="f1 tracked-tight">{state.wpm}</span>
      <span className="b f4"> wpm</span>
    </p>
  )
}

const Copy = () => {
  const [state] = useContext(Context)
  const trimmedSample = state.sample.slice(state.input.length)
  return (
    <pre className="tc">
      <span
        className={state.match ? 'green bg-washed-green' : 'red bg-washed-red'}
      >
        {state.input}
      </span>
      <span className="dark-gray">{trimmedSample}</span>
    </pre>
  )
}
