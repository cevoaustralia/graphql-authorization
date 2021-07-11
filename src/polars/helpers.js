const { ForbiddenError } = require("apollo-server");

const checkContractSum = async (args) => {
  const oso = args[2].oso;
  const user = args[2].user;
  console.log(JSON.stringify(user));
  const items = !(args[0] instanceof Array) ? [args[0]] : args[0];
  for (const item of items) {
    const isAllowed = await oso.isAllowed(user, "contract_sum", item);
    console.log(isAllowed);
    if (!isAllowed) {
      throw new ForbiddenError(
        JSON.stringify({
          name: args[3].fieldName,
          requires: user.requires,
        })
      );
    }
  }
};

module.exports = { checkContractSum };
