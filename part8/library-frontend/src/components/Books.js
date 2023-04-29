import { useState } from 'react';
import {  useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

import BookList from './BookList'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_BOOKS)
  
  if (!props.show) {
    return null
  }
  
  if (result.loading)  {
    return <div>loading genre list...</div>
  }

  const books = result.data.allBooks
  const genresSet = new Set(books.reduce((genres, book) => [...genres, ...book.genres],[]))
  const genres = [...genresSet]

  return (
    <div>
      <h2>books</h2>
      <BookList genre={genre} />

      {genres.map((g) => <button key={g} value={g} onClick={() => setGenre(g)}>{g}</button>)}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

export default Books
