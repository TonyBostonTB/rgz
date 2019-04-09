import test from 'ava'
import { reducer } from '../src/reducer'
import { UPDATE_INPUT } from '../src/actionTypes'

test('test', t => {
  const state = reducer({ sample: 'a' }, { type: UPDATE_INPUT, payload: 'a' })
  t.deepEqual(
    { ...state, time: 0 },
    { sample: 'a', input: 'a', match: true, time: 0, wpm: 0 }
  )
})
