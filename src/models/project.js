const db = require("../utils/db");

module.exports = {
  fetchUserProjectRoles: async (userId, projectIds = []) => {
    try {
      const idFilter =
        projectIds.length > 0 ? `AND project_id = ANY ($2)` : "AND 1 = $2";
      const text = `
        SELECT project_id,
               roles
          FROM user_project_roles
         WHERE user_id = $1
           ${idFilter}
      `;
      const { rows } = await db.query(text, [
        userId,
        projectIds.length > 0 ? projectIds : 1,
      ]);
      return rows;
    } catch (error) {
      throw new Error(error);
    }
  },
  fetchProjects: async (ids = []) => {
    try {
      const idFilter = ids.length > 0 ? `WHERE id = ANY ($1)` : "WHERE 1 = $1";
      const text = `
        SELECT *
          FROM projects
          ${idFilter}
      `;
      const { rows } = await db.query(text, [ids.length > 0 ? ids : 1]);
      return rows;
    } catch (error) {
      throw new Error(error);
    }
  },
};
