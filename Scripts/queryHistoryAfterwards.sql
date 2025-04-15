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


CREATE TABLE research_center.Domains (
    domain_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    significance INTEGER CHECK (significance BETWEEN 1 AND 10)
);


WITH random_data AS (
    SELECT 
        'Domain ' || i AS name,
        floor(random() * 10 + 1)::int AS significance -- Random significance between 1 and 10
    FROM generate_series(1, 10) AS i  -- Generating 10 sample domains
)
INSERT INTO research_center.Domains (name, significance)
SELECT name, significance
FROM random_data;

WITH random_data AS (
    SELECT 
        'Domain ' || i+10 AS name,
        floor(random() * 10 + 1)::int AS significance -- Random significance between 1 and 10
    FROM generate_series(1, 100) AS i  -- Generating 10 sample domains
)
INSERT INTO research_center.Domains (name, significance)
SELECT name, significance
FROM random_data;

ALTER TABLE research_center.Research_Projects
ADD COLUMN students_needed INTEGER;
-- Add availability column
ALTER TABLE research_center.Research_Projects
ADD COLUMN availability VARCHAR(50);

-- Add the domain_id column to the Research_Projects table
ALTER TABLE research_center.Research_Projects
ADD COLUMN domain_id INT;

-- Add the foreign key constraint linking domain_id to Domains table
ALTER TABLE research_center.Research_Projects
ADD CONSTRAINT fk_project_domain
FOREIGN KEY (domain_id) REFERENCES research_center.Domains(domain_id)
ON DELETE SET NULL;  -- Optionally, set domain_id to NULL when the referenced domain is deleted


UPDATE research_center.Research_Projects
SET domain_id = 
    CASE
        WHEN random() < 0.5 THEN NULL  -- 50% chance to set NULL
        ELSE (SELECT domain_id FROM research_center.Domains ORDER BY random() LIMIT 1)  -- Random domain_id from Domains
    END;


UPDATE research_center.Research_Projects
SET students_needed = FLOOR(random() * 30) + 1;



SET search_path To research_center;
UPDATE research_projects
SET availability = CASE
    WHEN RANDOM() < 0.5 THEN 'Open'
    ELSE 'Closed'
END;


SET search_path TO research_center;

-- 1. Add a junction table for Project Skills
CREATE TABLE Project_Skills (
    project_id INT REFERENCES Research_Projects(project_id) ON DELETE CASCADE,
    skill_id INT REFERENCES Expertise(skill_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);

# Accidently runned twice
DO $$
DECLARE
    p_id INT;
    s_id INT;
    skill_ids INT[];
    num_skills INT;
    i INT;
BEGIN
    -- Loop through all project_ids
    FOR p_id IN SELECT project_id FROM Research_Projects LOOP

        -- Choose random number of skills to assign (e.g. 1 to 4)
        num_skills := floor(random() * 4 + 1)::INT;

        -- Get random skill_ids (distinct and shuffled)
        SELECT ARRAY(
            SELECT skill_id FROM Expertise
            ORDER BY random()
            LIMIT num_skills
        ) INTO skill_ids;

        -- Insert each selected skill_id into the junction table
        FOREACH s_id IN ARRAY skill_ids LOOP
            BEGIN
                INSERT INTO Project_Skills (project_id, skill_id)
                VALUES (p_id, s_id);
            EXCEPTION WHEN unique_violation THEN
                -- Skip if (project_id, skill_id) already exists
                CONTINUE;
            END;
        END LOOP;

    END LOOP;
END $$;


DO $$
DECLARE
    p_id INT;
    s_id INT;
    skill_ids INT[];
    num_skills INT;
    i INT;
BEGIN
    -- Loop through all project_ids
    FOR p_id IN SELECT project_id FROM Research_Projects LOOP

        -- Choose random number of skills to assign (e.g. 1 to 4)
        num_skills := floor(random() * 4 + 1)::INT;

        -- Get random skill_ids (distinct and shuffled)
        SELECT ARRAY(
            SELECT skill_id FROM Expertise
            ORDER BY random()
            LIMIT num_skills
        ) INTO skill_ids;

        -- Insert each selected skill_id into the junction table
        FOREACH s_id IN ARRAY skill_ids LOOP
            BEGIN
                INSERT INTO Project_Skills (project_id, skill_id)
                VALUES (p_id, s_id);
            EXCEPTION WHEN unique_violation THEN
                -- Skip if (project_id, skill_id) already exists
                CONTINUE;
            END;
        END LOOP;

    END LOOP;
END $$;









CREATE INDEX idx_domains_name ON research_center.Domains(name);

-- 5. Add an index for faster user name lookups (for professor filter)
CREATE INDEX idx_users_name ON research_center.Users(name);

-- 6. Add an index for faster skill name lookups
CREATE INDEX idx_expertise_name ON research_center.Expertise(name);

-- 7. Add indexes on foreign keys used in joins/filtering often
CREATE INDEX idx_research_projects_faculty_id ON research_center.Research_Projects(faculty_id);
CREATE INDEX idx_research_projects_domain_id ON research_center.Research_Projects(domain_id);
CREATE INDEX idx_project_skills_project_id ON research_center.Project_Skills(project_id);
CREATE INDEX idx_project_skills_skill_id ON research_center.Project_Skills(skill_id);
CREATE INDEX idx_faculty_user_id ON research_center.Faculty(user_id);