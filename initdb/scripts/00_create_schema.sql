CREATE SCHEMA proj;
GRANT ALL ON SCHEMA proj TO devuser;

-- change search_path on a connection-level
SET search_path TO proj;

-- change search_path on a database-level
ALTER database "devdb" SET search_path TO proj;