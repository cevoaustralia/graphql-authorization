DROP TABLE IF EXISTS proj.users;
DROP TABLE IF EXISTS proj.projects;
DROP TABLE IF EXISTS proj.project_indicators;
DROP TABLE IF EXISTS proj.user_project_roles;

CREATE TABLE proj.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL 
);

COPY proj.users(name, role)
FROM '/tmp/users.csv' DELIMITER ',' CSV;