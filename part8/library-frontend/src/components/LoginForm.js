import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client"

import { LOGIN_USER } from "../queries"

const LoginForm = ({setToken, show}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN_USER)

  useEffect(() => {
    if(result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-app-token', token)
    }
  }, [result.data, setToken])

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