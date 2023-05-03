const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')

const jwt = require('jsonwebtoken')

const pubsub = new PubSub()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

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
    Mutation: {
      addBook: async (root, args, { currentUser }) => {
        if ( !currentUser )
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          })
  
        let author = await Author.findOne({ name: args.author})
  
        if(!author) {
          author =  new Author({
            name: args.author,
            bookCount: 1,
          })
        } else
          author.bookCount++;

        try {
          await author.save()
        } catch(error) {
          throw new GraphQLError('Saving book failed', {
            extension: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error,
            },
          })          
        }
        
        let newBook = new Book({ ...args, author: author._id})
        try {
          await newBook.save()
        } catch(error) {
          throw new GraphQLError('Saving book failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
              error,
            },
          })          
        }
        
        newBook = newBook.populate('author')

        pubsub.publish('BOOK_ADDED', { bookAdded: newBook})
        return newBook;
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
                error,
              },
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
  
        if ( !user || args.password !== 'secret' ) {
          throw new GraphQL('wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          })
        }
  
        const userForToken = {
          username: user.username,
          id: user._id,
        }
  
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      },
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
        },
    }
  }

module.exports = resolvers