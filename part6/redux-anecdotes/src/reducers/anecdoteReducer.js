import { createSlice } from '@reduxjs/toolkit'

import anecdotesService from '../services/anecdotes'

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAnecdote(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdotesService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const updatedAnecdote = await anecdotesService.update({ ...anecdote, votes: anecdote.votes + 1 })
    dispatch(updateAnecdote(updatedAnecdote))
  }
}

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    updateAnecdote(state, action) {
      const anecdoteChanged = action.payload
      return state.map(anecdote => 
        anecdote.id !== anecdoteChanged.id ? anecdote : anecdoteChanged
      ) 
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdote(state, action) {
      return action.payload
    }
  }
})

export const { updateAnecdote, appendAnecdote, setAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer