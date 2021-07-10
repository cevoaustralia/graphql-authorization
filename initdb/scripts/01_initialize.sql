DROP TABLE IF EXISTS proj.users;
DROP TABLE IF EXISTS proj.projects;
DROP TABLE IF EXISTS proj.indicators;
DROP TABLE IF EXISTS proj.user_project_roles;

CREATE TABLE proj.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL 
);

COPY proj.users(name, role)
FROM '/tmp/users.csv' DELIMITER ',' CSV;

CREATE TABLE proj.projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL, 
    contract_sum INT NOT NULL
);

COPY proj.projects(name, status, contract_sum)
FROM '/tmp/projects.csv' DELIMITER ',' CSV;

CREATE TABLE proj.indicators (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    risk INT NOT NULL, 
    quality INT NOT NULL,
    CONSTRAINT fk_indicators__project_id
        FOREIGN KEY(project_id)
            REFERENCES proj.projects(id) ON DELETE CASCADE
);

COPY proj.indicators(project_id, risk, quality)
FROM '/tmp/indicators.csv' DELIMITER ',' CSV;

CREATE TABLE proj.user_project_roles (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    role VARCHAR(20) NOT NULL,
    CONSTRAINT fk_user_project_roles__user_id
        FOREIGN KEY(user_id)
            REFERENCES proj.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_project_roles__project_id
        FOREIGN KEY(project_id)
            REFERENCES proj.projects(id) ON DELETE CASCADE
);

COPY proj.user_project_roles(user_id, project_id, role)
FROM '/tmp/user_project_roles.csv' DELIMITER ',' CSV;