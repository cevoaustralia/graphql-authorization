DROP TABLE IF EXISTS proj.users;
DROP TABLE IF EXISTS proj.user_groups;
DROP TABLE IF EXISTS proj.projects;
DROP TABLE IF EXISTS proj.indicators;
DROP TABLE IF EXISTS proj.user_project_groups;

CREATE TABLE proj.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

COPY proj.users(name)
FROM '/tmp/users.csv' DELIMITER ',' CSV;

CREATE TABLE proj.user_groups (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    user_group VARCHAR(20) NOT NULL,
    CONSTRAINT fk_user_groups__user_id
        FOREIGN KEY(user_id)
            REFERENCES proj.users(id) ON DELETE CASCADE
);

COPY proj.user_groups(user_id, user_group)
FROM '/tmp/user_groups.csv' DELIMITER ',' CSV;

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

CREATE TABLE proj.user_project_groups (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    user_groups VARCHAR(20) [] NOT NULL,
    CONSTRAINT fk_user_project_groups__user_id
        FOREIGN KEY(user_id)
            REFERENCES proj.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_project_groups__project_id
        FOREIGN KEY(project_id)
            REFERENCES proj.projects(id) ON DELETE CASCADE
);

COPY proj.user_project_groups(user_id, project_id, user_groups)
FROM '/tmp/user_project_groups.csv' DELIMITER ',' CSV;