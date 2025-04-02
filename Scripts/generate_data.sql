
INSERT INTO Users (name, email, phone, role) VALUES
('Admin User', 'admin@iiitd.ac.in', '9876543212', 'admin');

INSERT INTO Expertise (name) 
VALUES 
('Artificial Intelligence'),
('Machine Learning'),
('Data Science'),
('Cybersecurity'),
('Software Engineering'),
('Cloud Computing'),
('Blockchain Technology'),
('Human-Computer Interaction'),
('Quantum Computing'),
('Bioinformatics'),
('Internet of Things (IoT)'),
('Robotics'),
('Embedded Systems'),
('Wireless Communication'),
('Computer Vision'),
('Natural Language Processing'),
('Autonomous Systems'),
('Virtual Reality (VR)'),
('Augmented Reality (AR)'),
('Network Security'),
('Database Management'),
('Big Data Analytics'),
('Computational Neuroscience'),
('Computational Linguistics'),
('Cryptography'),
('Digital Signal Processing'),
('Renewable Energy Systems'),
('Biomedical Engineering'),
('Structural Engineering'),
('Environmental Science'),
('Nano-Technology'),
('Social Computing'),
('Theoretical Computer Science'),
('Software Verification'),
('High Performance Computing'),
('Geospatial Analysis'),
('Supply Chain Analytics'),
('Cognitive Science'),
('Education Technology'),
('Digital Forensics'),
('Wireless Sensor Networks'),
('Game Development'),
('Affective Computing'),
('Semantic Web'),
('Computational Biology'),
('Embedded AI'),
('Smart Cities'),
('Edge Computing'),
('Electronics and VLSI'),
('Software Testing'),
('Algorithm Design'),
('Computational Mathematics');


WITH inserted_faculty AS (
    INSERT INTO Users (name, email, phone, role)
    SELECT 
        'Dr. Faculty ' || i, 
        'faculty' || i || '@iiitd.ac.in', 
        '9876500' || i,
        'faculty'
    FROM generate_series(1, 500) AS i
    RETURNING user_id
)

INSERT INTO Faculty (user_id, department)
SELECT 
    user_id, 
    (ARRAY['CSE', 'CSD', 'CSAM', 'CSB', 'CSSS', 'ECE', 'EVE'])[floor(random()*7 + 1)]
FROM inserted_faculty;

INSERT INTO Faculty_Expertise (faculty_id, expertise_id)
SELECT 
    f.faculty_id, 
    e.skill_id
FROM Faculty f
JOIN (SELECT skill_id FROM Expertise ORDER BY RANDOM() LIMIT 2) e 
ON true;

ALTER TABLE Students ADD COLUMN IF NOT EXISTS program TEXT;

WITH inserted_students AS (
    INSERT INTO Users (name, email, phone, role)
    SELECT 
        'Student ' || i, 
        'student' || i || '@iiitd.ac.in', 
        '9876600' || i,
        'student'
    FROM generate_series(1, 3000) AS i
    RETURNING user_id
)

INSERT INTO Students (user_id, student_id, enrollment_year, program)
SELECT 
    user_id,
    21000 + ROW_NUMBER() OVER (),
    (21000 + ROW_NUMBER() OVER ()) / 1000 % 20,
    (ARRAY['CSE', 'CSD', 'CSAM', 'CSB', 'CSSS', 'ECE', 'EVE'])[floor(random()*7 + 1)]
FROM inserted_students;

INSERT INTO Student_Expertise (student_id, skill_id)
SELECT 
    s.student_id, 
    e.skill_id
FROM Students s
JOIN (SELECT skill_id FROM Expertise ORDER BY RANDOM() LIMIT 2) e 
ON true;


WITH inserted_projects AS (
    INSERT INTO Research_Projects (title, description, start_date, end_date, status, faculty_id)
    SELECT 
        'Research Project ' || i, 
        'Description of research project ' || i, 
        '2022-01-01', 
        '2025-12-31', 
        'ongoing', 
        (SELECT faculty_id FROM Faculty ORDER BY random() LIMIT 1)
    FROM generate_series(1, 200) AS i
    RETURNING project_id
)
INSERT INTO Research_Papers (project_id, title, publication_date, link)
SELECT 
    project_id, 
    'Research Paper ' || i, 
    '2023-12-01', 
    'https://example.com/research-paper' || i || '.pdf'
FROM inserted_projects, generate_series(1, 5) AS i; 

INSERT INTO Notifications (user_id, message, created_at, is_read)
SELECT 
    (SELECT user_id FROM Users WHERE role = 'student' ORDER BY RANDOM() LIMIT 1), 
    'Notification message ' || i, 
    CURRENT_TIMESTAMP, 
    FALSE
FROM generate_series(1, 10) AS i;

INSERT INTO Funding (project_id, source, amount, utilization_status)
SELECT 
    p.project_id, 
    'Funding Source ' || (i % 10 + 1), 
    (10000 + (i * 100)), 
    'pending'
FROM Research_Projects p
JOIN generate_series(1, 200) AS i ON true;

INSERT INTO project_applications (user_id, project_id, status, application_date)
SELECT 
    floor(random() * (SELECT max(user_id) FROM Users)) + 1,
    floor(random() * (SELECT max(project_id) FROM Projects)) + 1,
    CASE WHEN random() > 0.7 THEN 'accepted' WHEN random() > 0.4 THEN 'rejected' ELSE 'pending' END,
    NOW() - INTERVAL '1 day' * floor(random() * 365) -- Random date within the last year
FROM generate_series(1, 1000);
