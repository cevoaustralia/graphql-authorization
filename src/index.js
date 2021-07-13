const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { initOso } = require("./polars/loads");
const { AuthDirective } = require("./utils/directive");
const User = require("./models/user");
const Project = require("./models/project");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    auth: AuthDirective,
  },
  context: async ({ req }) => {
    const oso = await initOso();
    const user = await User.initUser(req.headers.name);
    user.userProjGroups = await Project.fetchUserProjectGroups(user.id);
    return {
      user: user,
      oso: oso,
    };
  },
});

server
  .listen({
    port: 5000,
  })
  .then(() => {
    console.log(`
    Server is running!
    Listening on port 5000
    Explore at https://studio.apollographql.com/sandbox
  `);
  });
