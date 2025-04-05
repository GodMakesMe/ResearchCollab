-- SQL Script: Creating Tables for Research Collaboration Database

-- Define ENUM types for PostgreSQL
CREATE SCHEMA research_center;
SET search_path TO research_center;
CREATE TYPE user_role AS ENUM ('faculty', 'student', 'admin');
CREATE TYPE project_status AS ENUM ('ongoing', 'completed', 'on hold');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'interview');
CREATE TYPE funding_status AS ENUM ('pending', 'utilized', 'partial');

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    role user_role NOT NULL
);

CREATE TABLE Expertise (
    skill_id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE Faculty (
    faculty_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
 
CREATE TABLE Faculty_Expertise (   -- Many to Many relation Act as junction
    faculty_id INT REFERENCES Faculty(faculty_id) ON DELETE CASCADE,
    expertise_id INT REFERENCES Expertise(skill_id) ON DELETE CASCADE,
    PRIMARY KEY (faculty_id, expertise_id)
);

CREATE TABLE Students (
    student_id SERIAL PRIMARY KEY, 
    user_id INT UNIQUE NOT NULL,
    enrollment_year INT NOT NULL,
    program VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Student_Expertise (   -- Many to Many relation Act as junction
    student_id INT REFERENCES Students(student_id) ON DELETE CASCADE,
    skill_id INT REFERENCES Expertise(skill_id) ON DELETE CASCADE,
    PRIMARY KEY (student_id, skill_id)
); 


CREATE TABLE Research_Projects ( 
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    status project_status NOT NULL,
    faculty_id INT NOT NULL,
    FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id) ON DELETE CASCADE
);

CREATE TABLE Funding (
    funding_id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    source VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    utilization_status funding_status NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Research_Projects(project_id) ON DELETE CASCADE
);

CREATE TABLE Collaborators (
    collaborator_id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    collaborator_name VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES Research_Projects(project_id) ON DELETE CASCADE
);

CREATE TABLE Research_Papers (
    paper_id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    publication_date DATE NOT NULL,
    link TEXT,
    FOREIGN KEY (project_id) REFERENCES Research_Projects(project_id) ON DELETE CASCADE
);

CREATE TABLE Notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);


ALTER TABLE users ADD COLUMN passwords TEXT;
UPDATE users SET passwords = 'dummypassword' where passwords IS NULL;
ALTER TABLE users ALTER COLUMN passwords SET NOT NULL;
ALTER TABLE users RENAME COLUMN passwords TO password;

CREATE TABLE registration_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user',
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);