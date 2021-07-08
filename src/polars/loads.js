const { Oso } = require("oso");
const User = require("../models/user");

const initOso = async () => {
  const oso = new Oso();
  oso.registerClass(User);
  await oso.loadFile("./src/polars/roles.polar");
  return oso;
};

module.exports = { initOso };
