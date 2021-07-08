const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { RolePasser } = require("./utils/directive");
const User = require("./models/user");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    passer: RolePasser,
  },
  context: async ({ req }) => {
    const name = req.headers.authorization;
    const user = await User.initUser(name);
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
