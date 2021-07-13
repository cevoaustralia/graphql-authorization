const db = require("../utils/db");

class User {
  constructor(id, name, roles, requires, userProjRoles) {
    this.id = id;
    this.name = name;
    this.roles = roles;
    this.requires = requires;
    this.userProjRoles = userProjRoles;
  }

  isRequiredUserRole() {
    return !!this.roles.find(r => (this.requires.userRoles || []).includes(r))
  }

  isRequiredProjectRole(project) {
    const projRoles = this.requires.projRoles;
    const userProjRoles = (this.userProjRoles || [])
      .filter((up) => up.project_id === project.id)
      .map((up) => up.roles)
      .flat();
    return !!userProjRoles.find((r) => projRoles.includes(r));
  }

  static clone(user) {
    return new this(
      user.id,
      user.name,
      user.roles,
      user.requires,
      user.userProjRoles
    );
  }

  static async initUser(name) {
    try {
      return await this.fetchUsers(name);
    } catch (error) {
      return new this(0, "anonymous", ["guest"]);
    }
  }

  static async fetchUsers(name) {
    try {
      const where = !!name ? `WHERE u.name = '${name}'` : "WHERE 1 = 1";
      const text = `
        SELECT u.id, 
               u.name, 
               array_agg(r.role) AS roles
          FROM users u
          JOIN user_roles r
            ON u.id = r.user_id
          ${where}
      GROUP BY u.id,
               u.name               
      `;
      const { rows } = await db.query(text);
      if (!!name) {
        return new this(rows[0].id, rows[0].name, rows[0].roles);
      } else {
        return rows.map((row) => new this(row.id, row.name, row.roles));
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = User;
