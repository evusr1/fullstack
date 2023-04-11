import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { notificationSet, notificationRemove } from '../reducers/notificationReducer'


const AnecdoteForm = () => {
    const dispatch = useDispatch()
  
    const addAnecdote = (event) => {
      event.preventDefault()
  
      const content = event.target.anecdote.value
      dispatch(createAnecdote(content))

      dispatch(notificationSet(`You created '${content}'`))

      setTimeout(() => {
        dispatch(notificationRemove())
      }, 5000);
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div><input name="anecdote"/></div>
                <button>create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm