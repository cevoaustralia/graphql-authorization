const { ForbiddenError } = require("apollo-server");
const { initOso } = require("./loads");

const checkContractSum = async (args) => {
  const oso = await initOso();
  const user = args[2].user;
  const items = !(args[0] instanceof Array) ? [args[0]] : args[0];
  for (const item of items) {
    const isAllowed = await oso.isAllowed(
      user,
      "contract_sum",
      Object.keys(item)
    );
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
