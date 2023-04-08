import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({
  handleCreate
}) => {
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    await handleCreate({ url, title, author })

    setUrl('')
    setAuthor('')
    setTitle('')
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
                title:
          <input
            type = "text"
            value = {title}
            id = "title"
            onChange = {({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
                author:
          <input
            type = "text"
            value = {author}
            id = "author"
            onChange = {({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
                url:
          <input
            type = "text"
            value = {url}
            id = "url"
            onChange = {({ target }) => setUrl(target.value)}
          />
        </div>
        <div>
          <button type="submit" id="create-button" >create</button>
        </div>
      </form>
    </>
  )
}

PropTypes.propTypes = {
  handleCreate: PropTypes.func.isRequired
}

export default BlogForm