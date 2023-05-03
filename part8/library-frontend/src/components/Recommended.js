import {  useQuery } from '@apollo/client'
import {  ME } from '../queries'

import BookList from './BookList'

const Recommended = (props) => {
  const result = useQuery(ME)

  if (!props.show) {
    return null
  }
  
  if (result.loading)  {
    return <div>loading favorite genre...</div>
  }
  
  const genre = result.data.me ? result.data.me.favoriteGenre : null

  return (
    <div>
      <h2>recommended</h2>
      <BookList genre={genre} />
    </div>
  )
}

export default Recommended
