import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { notificationSet, notificationRemove } from '../reducers/notificationReducer'
import Filter from './Filter.js'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => { 
    return state.anecdotes.filter(anecdote =>  anecdote.content.includes(state.filter))
      .sort((a, b) => b.votes - a.votes)
  })
                      
                      
  const dispatch = useDispatch()

  const vote = (id, content) => {
    console.log('vote', id)
    dispatch(voteAnecdote(id))
    dispatch(notificationSet(`You voted for '${content}'`))

    setTimeout(() => {
      dispatch(notificationRemove())
    }, 5000);
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
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList