import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ info }) => {
  if(!info.message)
    return
  const style = {
    color: info.type ==='error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'Solid',
    boderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  return (
    <div style={style}>
      {info.message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')


  const [info, setInfo] = useState({messsage: null})

  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  
  useEffect(() => {
    const loggeduserJSON = window.localStorage.getItem('loggedBlogsappUser')
    if(loggeduserJSON) {
      const userReturned = JSON.parse(loggeduserJSON)
      setUser(userReturned)
      blogService.setToken(userReturned.token)
    }
  }, [])

  const notifyWith = (message, type='info') => {
    setInfo({
      message, type
    })

    setTimeout(() => {
      setInfo({ message: null })
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const userReturned = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogsappUser', JSON.stringify(userReturned)
      )
      blogService.setToken(userReturned.token)
      
      setUser(userReturned)
      setUsername('')
      setPassword('')
      notifyWith(`Logged in as ${userReturned.name}`)

    } catch(exception) {
      if(exception.response.data.error)
        notifyWith(exception.response.data.error, 'error')
    }

  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogsappUser')
    setUser(null)
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    try {

      const createdBlog = await blogService.create({
        title, author, url
      })

      setUrl('')
      setAuthor('')
      setTitle('')

      setBlogs(blogs.concat(createdBlog))
      notifyWith(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
    } catch(exception) {
      if(exception.response.data.error)
        notifyWith(exception.response.data.error, 'error')
    }
  }

  const loginForm = () => (
    <>
      <h2>login to application</h2>
      <Notification info={info}/>
      <form onSubmit={ handleLogin }>
        <div>
          username
            <input
              type = "text"
              value = {username}
              name = "username"
              onChange = {({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
          password
            <input
              type = "password"
              value = {password}
              name = "password"
              onChange = {({ target }) => setPassword(target.value)}
            />
        </div>
        <div>
          <button type="submit">login</button>
        </div>
      </form>
    </>
  )
  const blogForm = () => (
    <form onSubmit={handleCreate}> 
    <div>
        title:
          <input
            type = "text"
            value = {title}
            name = "title"
            onChange = {({ target }) => setTitle(target.value)}
          />
      </div>
      <div>
        author:
          <input
            type = "text"
            value = {author}
            name = "author"
            onChange = {({ target }) => setAuthor(target.value)}
          />
      </div>
      <div>
        url:
          <input
            type = "text"
            value = {url}
            name = "url"
            onChange = {({ target }) => setUrl(target.value)}
          />
      </div>
      <div>
        <button type="submit">create</button>
      </div>
    </form>
  )
  const blogsList = () => (
    <>
      <h2>blogs</h2>
      <Notification info={info}/>
      <div>{ user.name } logged in <button onClick={ handleLogout }>logout</button></div>
      <br/>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      {blogForm()}
    </>
  )

  return (
    <div>
      { user==null && loginForm() }
      { user !== null && blogsList() }
    </div>
  )
}

export default App