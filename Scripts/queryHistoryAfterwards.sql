SET search_path TO research_center;
ALTER TABLE users ADD COLUMN passwords TEXT;

SET search_path TO research_center;
UPDATE users SET passwords = 'dummypassword' where passwords IS NULL;

SET search_path TO research_center;
ALTER TABLE users ALTER COLUMN passwords SET NOT NULL;


SET search_path TO research_center;
CREATE TABLE registration_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user',
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

