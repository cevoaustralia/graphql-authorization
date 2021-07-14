const db = require("../utils/db");

module.exports = {
  fetchUserProjectGroups: async (userId, projectIds = []) => {
    try {
      const idFilter =
        projectIds.length > 0 ? `AND project_id = ANY ($2)` : "AND 1 = $2";
      const text = `
        SELECT project_id,
               user_groups AS groups
          FROM user_project_groups
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
  fetchProjectIndicators: async (projectIds) => {
    try {
      const idFilter =
        projectIds.length > 0 ? `WHERE project_id = ANY ($1)` : "WHERE 1 = $1";
      const text = `
        SELECT *
          FROM indicators
          ${idFilter}
      `;
      const { rows } = await db.query(text, [
        projectIds.length > 0 ? projectIds : 1,
      ]);
      return rows;
    } catch (error) {
      throw new Error(error);
    }
  },
};
