const config = require('./utils/config')
const express = require('express')
require('express-async-errors')

const app = express()

const cors = require('cors')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

const blogRouter = require('./controllers/blog')

mongoose.connect(config.mongoUrl)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogRouter)

app.use(middleware.errorHandler)


module.exports = app