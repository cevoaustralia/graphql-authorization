const { SchemaDirectiveVisitor } = require("apollo-server");
const { defaultFieldResolver } = require("graphql");

class RolePasser extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { appRoles, projRoles } = this.args;
    const originalResolve = field.resolve || defaultFieldResolver;

    field.resolve = async function (...args) {
      const context = args[2];
      context.requires = { appRoles, projRoles };
      return originalResolve.apply(this, args);
    };
  }
}

module.exports = { RolePasser };
