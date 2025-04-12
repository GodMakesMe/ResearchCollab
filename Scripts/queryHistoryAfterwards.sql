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

WITH random_data AS (
  SELECT 
    i,
    'Research Project ' || i AS title,
    'Description of research project ' || i AS description,
    start_dt,
    start_dt + (interval '1 day' * (365 * (1 + floor(random() * 5)))) AS end_dt,
    (ARRAY['ongoing', 'completed', 'on hold'])[floor(random() * 3 + 1)::int]::project_status AS status,
    (SELECT faculty_id FROM Faculty ORDER BY random() LIMIT 1) AS faculty_id
  FROM generate_series(1, 200) AS i,
       LATERAL (SELECT date '2015-01-01' + (random() * 3287)::int AS start_dt) AS t
)

INSERT INTO Research_Projects (title, description, start_date, end_date, status, faculty_id)
SELECT title, description, start_dt, end_dt, status, faculty_id
FROM random_data
RETURNING project_id;

