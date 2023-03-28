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

describe('listing blog posts in correct format', () => {
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
})

describe('adding a blog posts', () => {
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
     
     test('likes are stripped when adding', async () => {
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
})

describe('deletion of blog post', () => {
    test('delete a single blog post', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogsToDelete = blogsAtStart[0]
    
        await api
            .delete(`/api/blogs/${blogsToDelete.id}`)
            .expect(204)
        
        const blogsAtEnd = await helper.blogsInDb()
    
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    
        expect(blogsAtEnd).not.toContainEqual(blogsToDelete)
    }, 100000)
})

describe('update blog post', () => {
    test('update a blog post likes', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogsToUpdate = {...blogsAtStart[0], likes: blogsAtStart[0].likes + 1}
    
        const response = await api
                            .put(`/api/blogs/${blogsToUpdate.id}`)
                            .send(blogsToUpdate)
                            .expect('Content-Type', /application\/json/)
    
        expect(response.body.likes).toBe(blogsToUpdate.likes)
        
    }, 100000)
    
    test('update a blog post author', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogsToUpdate = {...blogsAtStart[0], author: "changed author"}
    
        const response = await api
                            .put(`/api/blogs/${blogsToUpdate.id}`)
                            .send(blogsToUpdate)
                            .expect('Content-Type', /application\/json/)
    
        expect(response.body.author).toBe(blogsToUpdate.author)
        
    }, 100000)
    
    test('update a blog post title', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogsToUpdate = {...blogsAtStart[0], title: "changed title"}
    
        const response = await api
                            .put(`/api/blogs/${blogsToUpdate.id}`)
                            .send(blogsToUpdate)
                            .expect('Content-Type', /application\/json/)
    
        expect(response.body.title).toBe(blogsToUpdate.title)
        
    }, 100000)
    
    test('update a blog post url', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogsToUpdate = {...blogsAtStart[0], url: "changed url"}
    
        const response = await api
                            .put(`/api/blogs/${blogsToUpdate.id}`)
                            .send(blogsToUpdate)
                            .expect('Content-Type', /application\/json/)
    
        expect(response.body.url).toBe(blogsToUpdate.url)
        
    }, 100000)
})

afterAll(async () => {
    await mongoose.connection.close()
})