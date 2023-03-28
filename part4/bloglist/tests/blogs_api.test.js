const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    
    const promiseArray = blogObjects.map(blog => blog.save())

    await Promise.all(promiseArray)
})

test('all blogs are returned as json', async () => {
    response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    expect(response.body).toHaveLength(helper.initialBlogs.length)
}, 100000)



test('id is defined', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => expect(blog.id).toBeDefined())
}, 100000)

test('a valid blog can be added', async () => {
   await api
    .post('/api/blogs')
    .send(helper.newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

   const response = await api.get('/api/blogs')

   expect(response.body).toHaveLength(helper.initialBlogs.length + 1)

   const contentObjects = response.body.map(blog => {
        const newBlog = {...blog}
        delete newBlog.id
        delete newBlog.likes

        return newBlog
   })

   expect(contentObjects).toContainEqual(helper.newBlog)
}, 100000)

test('an invalid blog with likes cannot be added', async () => {
    const newBlogWithLikes = {...helper.newBlog, likes: 10}

    const newBlogWithNoLikes = {...helper.newBlog, likes: 0}

    await api
     .post('/api/blogs')
     .send(newBlogWithLikes)
 
    const response = await api.get('/api/blogs')

    const contentObjects = response.body.map(blog => {
        const newBlog = {...blog}
        delete newBlog.id

        return newBlog
   })

    expect(contentObjects).toContainEqual(newBlogWithNoLikes)
    
 }, 100000)
 
test('an invalid blog without url cannot be added', async () => {
    const newBlogWithoutURL = {...helper.newBlog}
    delete newBlogWithoutURL.url

    await api
    .post('/api/blogs')
    .send(newBlogWithoutURL)
    .expect(400)
    
}, 100000)

test('an invalid blog without title cannot be added', async () => {
    const newBlogWithoutTitle = {...helper.newBlog}
    delete newBlogWithoutTitle.title

    await api
    .post('/api/blogs')
    .send(newBlogWithoutTitle)
    .expect(400)

}, 100000)

afterAll(async () => {
    await mongoose.connection.close()
})