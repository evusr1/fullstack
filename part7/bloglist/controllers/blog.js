const blogRouter = require('express').Router()

const Blog = require('../models/blog')
const Comment = require('../models/comment')
const logger = require('../utils/logger')

const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comment', { content: 1 })

  response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: 0,
    user: user._id
  })

  let savedBlog = await blog.save()
  savedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
  savedBlog = await savedBlog.populate('comment', { content: 1 })

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.post('/:id/comments',  async (request, response) => {
  const blog = await Blog
    .findById(request.params.id)

  if(!blog)
    return response.status(404).end()

  const comment = new Comment({
    content: request.body.content,
    blog: blog._id
  })

  const savedComment = await comment.save()

  blog.comment = blog.comment.concat(savedComment._id)
  await blog.save()

  response.status(201).json(savedComment)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {

  const blog = await Blog.findById(request.params.id)
  if(!blog)
    return response.status(404).end()

  const user = request.user

  if(blog.user.toString() !== user.id.toString())
    return response.status(401).json({ error: 'token invalid' })

  user.blogs = user.blogs.filter(blogUser => blog.id !== blogUser.id)
  await user.save()

  await blog.remove()

  await Comment.deleteMany({ blog: request.params.id })

  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  logger.info(blog)
  let updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
  updatedBlog = await updatedBlog.populate('user', { username: 1, name: 1 })
  updatedBlog = await updatedBlog.populate('comment', { content: 1 })
  response.json(updatedBlog)
})

module.exports = blogRouter