import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useApolloClient } from '@apollo/client'
import Recommended from './components/Recommended'



const App = () => {
  const client = useApolloClient()

  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('library-app-token')
    if(token)
      setToken(token)
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token ? <button onClick={() => setPage('login')}>login</button> : null }
        {token ? <button onClick={() => setPage('add')}>add book</button> : null }
        {token ? <button onClick={() => setPage('recommended')}>recommended</button> : null }
        {token ? <button onClick={logout}>logout</button> : null }
        
      </div>

      <Authors show={
        page === 'authors' ? 
          token 
            ? 'token'
            : true
            : null
        } />

      <Books show={page === 'books'} />

      <NewBook show={ page === 'add'} />
      
      <Recommended show={ page === 'recommended'} />

      <LoginForm show={page === 'login'} setToken={setToken} />
    </div>
  )
}

export default App
