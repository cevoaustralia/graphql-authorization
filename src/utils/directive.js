const { ForbiddenError, SchemaDirectiveVisitor } = require("apollo-server");
const { defaultFieldResolver } = require("graphql");
const User = require("../models/user");

class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._userGroups = this.args.userGroups;
    type._projGroups = this.args.projGroups;
  }

  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._userGroups = this.args.userGroups;
    field._projGroups = this.args.projGroups;
  }

  ensureFieldsWrapped(objectType) {
    if (objectType._authFieldsWrapped) return;
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function (...args) {
        const userGroups = field._userGroups || objectType._userGroups;
        const projGroups = field._projGroups || objectType._projGroups;
        if (!userGroups && !projGroups) {
          return resolve.apply(this, args);
        }

        const context = args[2];
        context.user.requires = { userGroups, projGroups };

        // check permission of fields that have a specific parent type
        if (args[3].parentType.name == "Project") {
          const user = User.clone(context.user);
          if (!(await context.oso.isAllowed(user, "project_field", args[0]))) {
            throw new ForbiddenError(
              JSON.stringify({ requires: user.requires, groups: user.groups })
            );
          }
        }

        return resolve.apply(this, args);
      };
    });
  }
}

module.exports = { AuthDirective };
