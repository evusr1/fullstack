import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

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
  const [user, setUser] = useState(null)

  const [info, setInfo] = useState({ messsage: null })

  useEffect(() => {
    const getBlogs = async () => {
      const returnedBlogs = await blogService.getAll()
      const sortBlogs = returnedBlogs.sort((a, b) => b.likes - a.likes)

      setBlogs( sortBlogs )
    }
    getBlogs()
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

  const blogFormRef = useRef()
  const handleCreate = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat({
        ...createdBlog,
        user: {
          name : user.name,
          username : user.username
        }
      }))

      notifyWith(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)

      blogFormRef.current.toggleVisibility()
    } catch(exception) {
      if(exception.response.data.error)
        notifyWith(exception.response.data.error, 'error')
    }
  }

  const handleLike = async (oldBlog) => {
    try {
      const updatedBlog = await blogService.update({
        ...oldBlog,
        likes: oldBlog.likes + 1,
        user: oldBlog.user ? oldBlog.user.id : null
      })

      setBlogs(blogs
        .map(blog => {
          return blog.id === updatedBlog.id ? { ...updatedBlog, user: blog.user } : blog
        })
        .sort((a, b) => b.likes - a.likes))
    } catch(exception) {
      if(exception.response.data.error)
        notifyWith(exception.response.data.error, 'error')
    }
  }

  const handleRemove = async (removeBlog) => {
    if(window.confirm(`Remove blog ${removeBlog.title} by ${removeBlog.author}`)) {
      try {
        await blogService.remove(removeBlog)
        setBlogs(blogs.filter(blog => {
          return blog.id !== removeBlog.id
        }))
      } catch(exception) {
        if(exception.response.data.error)
          notifyWith(exception.response.data.error, 'error')
      }
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

  const blogsList = () => (
    <>
      <h2>blogs</h2>
      <Notification info={info}/>
      <div>{ user.name } logged in <button onClick={ handleLogout }>logout</button></div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm handleCreate={handleCreate} />
      </Togglable>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          handleRemove={handleRemove}
          canRemove={blog.user && blog.user.username === user.username}
        />
      )}
    </>
  )

  return (
    <div>
      { user===null && loginForm() }
      { user !== null && blogsList() }
    </div>
  )
}

export default App