import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({
  blog,
  handleLike,
  handleRemove,
  canRemove
}) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const showWhenVisible = { display: visible ? '' : 'none' }
  const removeVisible = { display: canRemove ? '' : 'none' }
  const showButtonLabel = visible ? 'hide' : 'show'

  const user = blog.user ? blog.user.name : 'unknown'

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{showButtonLabel}</button>
      </div>
      <div style={showWhenVisible} className='togglableContent'>
        {blog.url} <br/>
        {blog.likes} <button onClick={() => handleLike(blog)} >like</button> <br/>
        {user} <br/>
        <button style={removeVisible} onClick={() => handleRemove(blog)}>remove</button>
      </div>
    </div>
  )
}

PropTypes.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  canRemove: PropTypes.func.isRequired
}

export default Blog