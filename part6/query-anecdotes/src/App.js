import { useQuery, useQueryClient, useMutation } from 'react-query'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotificationDispatch } from './NotificationContext'

import { getAnecdotes, updateAnecdote } from './requests.js'

const App = () => {  
  const result = useQuery('anecdotes', getAnecdotes, 
  {
    retry: false
  })

  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const voteAnecdoteMutation = useMutation(updateAnecdote, {
      onSuccess: (response) => {
        notificationDispatch({ type: 'SET', payload: `anecdote '${response.content}' voted`})
        setTimeout(() => notificationDispatch({ type: 'REMOVE'}), 5000)
        queryClient.invalidateQueries('anecdotes')
      }
    }
  )
  if(result.isLoading) {
    return <div>loading data...</div>
  }

  if(result.isError) {
    return <div>anecdote service not available due to problems in the server</div>
  }


  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
