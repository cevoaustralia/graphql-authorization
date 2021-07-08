const db = require("../utils/db");

class User {
  constructor(id, name, role) {
    this.id = id;
    this.name = name;
    this.role = role;
  }

  static async initUser(name) {
    try {
      const text = `
        SELECT *
          FROM users
         WHERE name = $1
      `;
      const { rows } = await db.query(text, [name]);
      return new this(rows[0].id, rows[0].name, rows[0].role);
    } catch (error) {
      return new this(0, "anonymous", "guest");
    }
  }

  static async fetchUsers() {
    try {
      const text = `
        SELECT *
          FROM users
      `;
      const { rows } = await db.query(text);
      return rows.map((row) => new this(row.id, row.name, row.role));
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = User;
