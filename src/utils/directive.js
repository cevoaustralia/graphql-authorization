const { ForbiddenError, SchemaDirectiveVisitor } = require("apollo-server");
const { defaultFieldResolver } = require("graphql");
const User = require("../models/user");

class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._userRoles = this.args.userRoles;
    type._projRoles = this.args.projRoles;
  }

  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._userRoles = this.args.userRoles;
    field._projRoles = this.args.projRoles;
  }

  ensureFieldsWrapped(objectType) {
    if (objectType._authFieldsWrapped) return;
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function (...args) {
        const userRoles = field._userRoles || objectType._userRoles;
        const projRoles = field._projRoles || objectType._projRoles;
        if (!userRoles && !projRoles) {
          return resolve.apply(this, args);
        }

        const context = args[2];
        context.user.requires = { userRoles, projRoles };

        // check permission of fields that have a specific parent type
        if (args[3].parentType.name == "Project") {
          const user = User.clone(context.user);
          if (!(await context.oso.isAllowed(user, "project_field", args[0]))) {
            throw new ForbiddenError(
              JSON.stringify({ requires: user.requires, roles: user.roles })
            );
          }
        }

        return resolve.apply(this, args);
      };
    });
  }
}

module.exports = { AuthDirective };
