const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.HOST || "localhost",
  port: 5432,
  database: "devdb",
  user: "devuser",
  password: "password",
});

module.exports = {
  query: async (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
