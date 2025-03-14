import { useState } from "react"

function App() {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  // Randomly generated selected anecdotes
  const [selected, setSelected] = useState(0)
  // Array containing the voted of the anecdotes
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
  // Index of the most voted anecdote
  const [mostVoted, setMostVoted] = useState(0)

  const generateRandomAnecdote = () => {
    // Ensure the new anecdotes is different from the previous
    const prevSelected = selected
    while (true) { 
      const newSelected = Math.floor(Math.random() * anecdotes.length)
      if (newSelected !== prevSelected) {
        setSelected(newSelected)
        break
      }
    }
  }

  const handleVoting = () => {
    // Create a copy of the votes array
    const newVotes = [...votes]
    // Increment the votes of the selected anecdotes
    newVotes[selected] += 1
    setVotes(newVotes)
    // Check if it is the new most voted anecdote
    if (newVotes[selected] >= votes[mostVoted])
      setMostVoted(selected)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>Votes: {votes[selected]}</p>
      <button onClick={handleVoting}>vote</button>
      <button onClick={generateRandomAnecdote}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[mostVoted]}</p>
    </div>
  )
}

export default App
