const { GraphQLServer, MockList } = require('graphql-yoga')
const faker = require('faker')
const gql = require('graphql-tag')

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const typeDefs = gql`
  type Query {
    heroes(where: TitleWhereInput): [Title!]
  }

  input TitleWhereInput {
    filter: ContentFilterTypes
    type: ContentType
  }

  enum ContentFilterTypes {
    hot
    popular
  }

  """
  Available types of content
  """
  enum ContentType {
    movie
    series
  }

  """
  Available content providers
  """
  enum ContentProviderName {
    Netflix
    YouTube
  }

  """
  A title describes common fields for all resources
  """
  interface Title {
    id: ID!
    contentProviders: [ContentProvider!]!
    country: String
    description: String
    genres: [String]!
    rating: Float
    related: [Title!]
    title: String!
    type: ContentType!
  }

  """
  TV-series
  """
  type Series implements Title {
    # Implements
    id: ID!
    contentProviders: [ContentProvider!]!
    country: String
    description: String
    genres: [String]!
    rating: Float
    related: [Title!]
    title: String!
    type: ContentType!

    # Custom fields
    seasons: [SeriesSeason!]!
  }

  type SeriesSeason {
    episodes: [SeriesEpisode!]!
    seasonNumber: Int!
  }

  type SeriesEpisode {
    title: String
  }

  """
  Movies
  """
  type Movie implements Title {
    # Implements
    id: ID!
    contentProviders: [ContentProvider!]!
    country: String
    description: String
    genres: [String]!
    rating: Float
    related: [Title!]
    title: String!
    type: ContentType!

    # Custom fields
    duration: Int!
  }

  """
  Fields of a content provider
  """
  type ContentProvider {
    id: ID!
    name: ContentProviderName!
  }

`

const resolvers = {
  Query: {
    heroes: (_, { where = {} }) => {
      const types = ['movie', 'series']
      const providers = [
        { id: faker.random.uuid, name: 'Netflix' },
        { id: faker.random.uuid, name: 'YouTube' }
      ]

      return [...Array(5)].map(() => ({
        id: faker.random.uuid,
        contentProviders: [providers[getRandomInt(0, 1)]],
        title: faker.lorem.words(getRandomInt(1, 4)),
        type: where.type ? where.type : types[getRandomInt(0, 1)]
      }))
    }
  },

  Title: {
    __resolveType(obj) {
      switch (obj.type) {
        case 'movie':
          return 'Movie'
        case 'series':
          return 'Series'
        default:
          return null
      }
    }
  },

  Movie: {
    duration: () => faker.random.number(150)
  },

  Series: {
    seasons: () =>
      [...Array(2).keys()].map(i => ({
        episodes: [...Array(10)].map(() => ({
          title: faker.lorem.words(getRandomInt(1, 4))
        })),
        seasonNumber: i + 1
      }))
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(() => console.log('Server is running on localhost:4000'))
