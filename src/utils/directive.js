const { SchemaDirectiveVisitor } = require("apollo-server");
const { defaultFieldResolver } = require("graphql");
const { checkContractSum } = require("../polars/helpers");

class RoleRequires extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { appRoles, projRoles } = this.args;
    const originalResolve = field.resolve || defaultFieldResolver;

    field.resolve = async function (...args) {
      const context = args[2];
      context.user.requires = { appRoles, projRoles };
      const resp = await originalResolve.apply(this, args);

      if (args[3].fieldName === "contract_sum") {
        await checkContractSum(args);
      }

      return resp;
    };
  }
}

module.exports = { RoleRequires };
