import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState(0)

  const [editAuthor] = useMutation(EDIT_AUTHOR)

  const result = useQuery(ALL_AUTHORS)
  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors =  result.data.allAuthors;

  const handleEdit = (e) => {
    e.preventDefault();
    console.log('edit author', name)
    editAuthor({variables: {name, setBornTo: Number(born)}});
    setBorn(0);
    setName('');
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      { props.show === 'token' ? (
        <form onSubmit={handleEdit}>
          name<select onChange={({target})=>setName(target.value)} value={name}>
          <option value=''></option>
            {authors.map((a) => (
              <option value={a.name} key={a.name}> {a.name}</option>
            ))}
          </select><br/>
          born<input type="number" onChange={({target})=>setBorn(target.value)} value={born}/><br/>
          <button type="submit">update author</button>
        </form>
      ) : null }
    </div>
  )
}

export default Authors
