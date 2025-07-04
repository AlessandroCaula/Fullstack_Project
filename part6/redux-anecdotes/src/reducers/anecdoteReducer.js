import { createSlice } from "@reduxjs/toolkit"
import anecdotesServices from "../services/anecdotes"

// Helper function to sort anecdotes by votes
const sortByVotes = anecdotes => {
  // Sort the anecdotes based on the number of votes and return them.
  // Create a shallow copy [...anecdotes]. Important cause .sort() changes the array is is called on. 
  // By copying it first, we keep the original Redux state array unchanged.
  return [...anecdotes].sort((a, b) => b.votes - a.votes)
}

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    // Increment the number of votes
    voteAnecdote(state, action) {
      const changedAnecdote = action.payload
      const id = changedAnecdote.id
      const updatedAnecdotes = state.map(anecdote => anecdote.id === id ? changedAnecdote : anecdote)
      // Sort the anecdotes by votes
      return sortByVotes(updatedAnecdotes)
    },
    // Add ne anecdote to the state array 
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return sortByVotes(action.payload)
    }
  }
})

export const { voteAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

// Initialize, getAll, the anecdotes saved in the server
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesServices.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

// Add a new note to the server and the state
export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdotesServices.createAnecdote(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

// Voting anecdote and updating the backend
export const updateAnecdote = content => {
  return async dispatch => {
    const updatedAnecdote = await anecdotesServices.voteAnecdote(content)
    dispatch(voteAnecdote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer