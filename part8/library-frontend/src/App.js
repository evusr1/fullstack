import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useApolloClient, useSubscription } from '@apollo/client'

import { ALL_BOOKS, BOOK_ADDED } from './queries'

import Recommended from './components/Recommended'

export const updateCacheMultipleQueries = (cache, queries, addedBook) => {
  const uniqByTitle = (a) => {
      let seen = new Set()
      return a.filter((item) => {
        let k = item.title
        return seen.has(k) ? false : seen.add(k)
      })
  }
  queries.forEach((query) => 
    cache.updateQuery(query, ( data ) => {
      if(data && data.allBooks) {
        return {
          allBooks: uniqByTitle(data.allBooks.concat(addedBook))
        }
      }
    })
  )
}

const App = () => {
  const client = useApolloClient()

  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('library-app-token')
    if(token)
      setToken(token)
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} added`)

      const queries = addedBook.genres.map((genre) => {
        return { query: ALL_BOOKS, variables: { genre } }
      })

      updateCacheMultipleQueries(client.cache, 
        [
          { query: ALL_BOOKS,
            variables: {
              genre: null,
            },
          },
          ...queries
        ],
        addedBook,
      )
    }
  })

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

      <LoginForm show={!token && page === 'login'} setToken={setToken} setPage={setPage} />

      <Recommended show={ page === 'recommended'} />
    </div>
  )
}

export default App
