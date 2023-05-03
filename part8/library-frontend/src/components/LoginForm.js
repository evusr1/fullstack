import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client"
import { useApolloClient } from '@apollo/client'

import { LOGIN_USER, ME } from "../queries"

const LoginForm = ({setToken, show, setPage}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN_USER, {
    refetchQueries: [ { query: ME } ]
  })

  const client = useApolloClient()
  
  useEffect(() => {
    if(result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-app-token', token)
      client.resetStore().then(() => {
        setPage('books')
      })
    }
  }, [result.data, setToken, setPage, client])

  if (!show) {
    return null
  }

  const handleLogin = (e) => {
    e.preventDefault();

    login({variables: {username, password}})
  }

  return (
    <>
      <h2>Login</h2>

      <form onSubmit={handleLogin} >
        <div>
          Username: <input type="text" onChange={({target}) => setUsername(target.value)} value={username}/>
        </div>
        <div>
          Password: <input type="password" onChange={({target}) => setPassword(target.value)} value={password}/>
        </div>
        <div>
          <button>login</button>
        </div>
      </form>
    </>
  )
}

export default LoginForm