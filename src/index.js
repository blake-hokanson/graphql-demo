const path = require('path')
const fs = require('fs')

const {ApolloServer} = require('apollo-server');

const links = [{
  id: 'link-0',
  description: 'this is a link',
  url: 'www.example.com',
}]

const resolvers = {
  Query: {
    info: () => 'this is a string',
    feed: () => links,
  },
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  },
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
});

server
  .listen()
  .then(({url}) =>
    console.log(`Server is running on ${url}`)
  );
