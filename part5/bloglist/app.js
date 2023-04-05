const config = require('./utils/config')
const express = require('express')
require('express-async-errors')

const app = express()

const cors = require('cors')
const { tokenExtractor, errorHandler } = require('./utils/middleware')
const mongoose = require('mongoose')

const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')

mongoose.connect(config.mongoUrl)

app.use(cors())
app.use(express.json())

app.use(tokenExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(errorHandler)


module.exports = app