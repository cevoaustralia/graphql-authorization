const db = require("../utils/db");

class User {
  constructor(id, name, groups, requires, userProjGroups) {
    this.id = id;
    this.name = name;
    this.groups = groups;
    this.requires = requires;
    this.userProjGroups = userProjGroups;
  }

  isRequiredUserGroup() {
    return !!this.groups.find((r) =>
      (this.requires.userGroups || []).includes(r)
    );
  }

  isRequiredProjectGroup(project) {
    const projGroups = this.requires.projGroups;
    const filteredGroups = (this.userProjGroups || [])
      .filter((up) => up.project_id === project.id)
      .map((up) => up.groups)
      .flat();
    return !!filteredGroups.find((r) => projGroups.includes(r));
  }

  filterAllowedProjectIds() {
    return ["1"];
  }

  static clone(user) {
    return new this(
      user.id,
      user.name,
      user.groups,
      user.requires,
      user.userProjGroups
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
               array_agg(g.user_group) AS groups
          FROM users u
          JOIN user_groups g
            ON u.id = g.user_id
          ${where}
      GROUP BY u.id,
               u.name               
      `;
      const { rows } = await db.query(text);
      if (!!name) {
        return new this(rows[0].id, rows[0].name, rows[0].groups);
      } else {
        return rows.map((row) => new this(row.id, row.name, row.groups));
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = User;
