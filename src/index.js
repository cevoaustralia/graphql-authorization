const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { getUser } = require("./utils");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const username = (req.headers && req.headers.username) || "";
    const user = await getUser(username);
    return {
      user: user,
    };
  },
});

server.listen().then(() => {
  console.log(`
    Server is running!
    Listening on port 4000
    Explore at https://studio.apollographql.com/sandbox
  `);
});
