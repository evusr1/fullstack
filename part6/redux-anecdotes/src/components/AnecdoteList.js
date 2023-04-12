import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import Filter from './Filter.js'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => { 
    return state.anecdotes.filter(anecdote =>  anecdote.content.includes(state.filter))
      .sort((a, b) => b.votes - a.votes)
  })
                      
                      
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`You voted for '${anecdote.content}'`, 10))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter/>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList