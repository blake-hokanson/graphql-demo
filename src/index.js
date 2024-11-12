const path = require('path')
const fs = require('fs')

const {ApolloServer} = require('apollo-server');

const links = [
  {
    id: 'link-0',
    description: 'this is a link',
    url: 'www.example.com',
  },{
    id: 'link-1',
    description: 'this is also a link',
    url: 'www.google.com',
  }
  ]

const resolvers = {
  Query: {
    info: () => 'this is a string',
    feed: (parent, args) => {
      if (args.filter_id) {
        return links.filter(link => link.id === args.filter_id);
      }
      return links;
    },
  },
  Mutation: {
    post: (parent, args) => {
      const id = links.length;
      link = {
        id: `link-${id}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    }
  }
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

/*

query{
  feed {
    id
    url
    description
  }
}

// FILTER

query{
  feed (filter_id: "link-1") {
    id
    url
    description
  }
}

// ALIAS

query{
  link1: feed (filter_id: "link-0") {
    id
    url
    description
  }
  link2:feed (filter_id: "link-1") {
    id
    url
    description
  }
}

// FRAGMENT

query{
  link1: feed (filter_id: "link-0") {
    ...linkFields
  }
  link2:feed (filter_id: "link-1") {
    ...linkFields
  }
}

fragment linkFields on Link {
  id
  url
  description
}

// FRAGMENT VARS

query ($id: String = "link-0"){
  ...link
}

fragment link on Query {
  feed (filter_id: $id) {
    id
    url
    description
  }
}

*/
