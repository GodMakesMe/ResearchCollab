SET search_path TO research_center;
ALTER TABLE users ADD COLUMN passwords TEXT;

SET search_path TO research_center;
UPDATE users SET passwords = 'dummypassword' where passwords IS NULL;

SET search_path TO research_center;
ALTER TABLE users ALTER COLUMN passwords SET NOT NULL;

