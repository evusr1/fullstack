const { ApolloServer } = require('@apollo/server')
const { GraphQLError } = require('graphql')
const { startStandaloneServer } = require('@apollo/server/standalone')

const { v1: uuid } = require('uuid')

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')




require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to ', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log('error connecting to MongoDB, ', error.message)
  })

const typeDefs = `
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String]!
    id: ID!
  }
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]!
    ): Book,
    editAuthor(
      name: String!
      setBornTo: Int
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments({}),
    authorCount: async () => Author.countDocuments({}),
    allBooks: async (root, args) => {
      if(!args.author && !args.genre)
        return Book.find({})
          .populate('author')
      
      let query = {};

      if(args.author) {
        const author = await Author.findOne({ name: args.author })
        if(!author)
          return null;

        query.author =  author._id
      }
      
      query.genres = args.genre

        return Book.find(query)
          .populate('author')
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => Book.countDocuments({ author: root.id })
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if ( !currentUser )
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })

      let author = await Author.findOne({ name: args.author})

      if(!author) {
        author =  new Author({
          name: args.author
        })

        try {
          await author.save()
        } catch(error) {
          throw new GraphQLError('Saving book failed', {
            extension: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })          
        }

      }

      const newBook = new Book({ ...args, author: author._id})
      try {
        await newBook.save()
      } catch(error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })          
      }

      return newBook.populate('author')
    },
    editAuthor: async (root, args, { currentUser }) => {
      if ( !currentUser )
      throw new GraphQLError('not authenticated', {
        extensions: {
          code: 'BAD_USER_INPUT',
        }
      })

      if(!args.name)
        return null;

      let author = await Author.findOne({ name: args.name})

      if(!author)
       return author;

      author.born = args.setBornTo;

      return author.save()
    },

    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQL('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if ( auth && auth.startsWith('Bearer ') ) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id)
      
      return { currentUser }
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
