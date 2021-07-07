const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.HOST || "localhost",
  port: 5432,
  database: "devdb",
  user: "devuser",
  password: "password",
});
const db = {
  query: async (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};

const getUser = async (name) => {
  try {
    const text = `
      SELECT *
        FROM users
       WHERE name = $1
    `;
    const { rows } = await db.query(text, [name]);
    return rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

const fetchUsers = async () => {
  try {
    const text = `
      SELECT *
        FROM users
    `;
    const { rows } = await db.query(text);
    return rows;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { getUser, fetchUsers };
