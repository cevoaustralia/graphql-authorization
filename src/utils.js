const db = require("./utils/db");

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
