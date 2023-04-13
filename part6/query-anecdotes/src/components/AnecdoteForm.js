import { useMutation, useQueryClient } from 'react-query'
import { useNotificationDispatch } from '../NotificationContext.js'
import { createAnecdote } from '../requests.js'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()

  const notificationDispatch = useNotificationDispatch()
  const newAnecdoteMutation = useMutation(createAnecdote, {
      onError: (error) => {
        console.log('test', error)
        notificationDispatch({ type: 'SET', payload: error.response.data.error})
        setTimeout(() => notificationDispatch({ type: 'REMOVE'}), 5000)
      },
      onSuccess: (response) => {
        console.log(response)
        notificationDispatch({ type: 'SET', payload: `anecdote '${response.content}' created`})
        setTimeout(() => notificationDispatch({ type: 'REMOVE'}), 5000)
        queryClient.invalidateQueries('anecdotes')
      }
    }
  )

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    newAnecdoteMutation.mutate({ content, votes: 0 })
    console.log('new anecdote')
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
