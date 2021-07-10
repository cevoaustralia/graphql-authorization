const db = require("../utils/db");

module.exports = {
  fetchUserProjectIds: async (userId) => {
    try {
      const text = `
        SELECT project_id
          FROM user_project_roles
         WHERE user_id = $1
           AND role = 'contributor'
      `;
      const { rows } = await db.query(text, [userId]);
      return rows.map((r) => r.project_id);
    } catch (error) {
      throw new Error(error);
    }
  },
  fetchProject: async (id) => {
    try {
      const text = `
        SELECT *
          FROM projects
         WHERE id = $1
      `;
      const { rows } = await db.query(text, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },
  fetchProjects: async () => {
    try {
      const text = `
        SELECT *
          FROM projects
      `;
      const { rows } = await db.query(text);
      return rows;
    } catch (error) {
      throw new Error(error);
    }
  },
};
