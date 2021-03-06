USE kiohub;

DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS user_pinned_projects;
DROP TABLE IF EXISTS project_collaborators;
DROP TABLE IF EXISTS users_emails;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS attachments;
DROP TABLE IF EXISTS related_projects;
DROP TABLE IF EXISTS project_semesters;
DROP TABLE IF EXISTS semesters;
DROP TABLE IF EXISTS project_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS project_settings;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS project_types;
DROP TABLE IF EXISTS project_status;
DROP TABLE IF EXISTS licences;

CREATE TABLE licences (
    licence_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(60) NOT NULL
);

CREATE TABLE project_status (
    status_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name NVARCHAR(20) NOT NULL
);

CREATE TABLE project_types (
    type_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name NVARCHAR(20) NOT NULL
);

CREATE TABLE projects (
    project_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title_PL NVARCHAR(255) NOT NULL,
    title_ENG NVARCHAR(255),
    description_PL NVARCHAR(2000),
    description_ENG NVARCHAR(2000),
    publication_date DATE,
    is_published BIT,
    licence_id INT UNSIGNED REFERENCES licences,
    type_id INT UNSIGNED REFERENCES project_types,
    status_id INT UNSIGNED REFERENCES project_status
);

CREATE TABLE project_settings (
    project_id INT UNSIGNED NOT NULL PRIMARY KEY REFERENCES projects,
    licence_visible SMALLINT,
    supervisor_visible SMALLINT,
    publication_date_visible SMALLINT,
    tags_visible SMALLINT,
    semesters_visible SMALLINT,
    related_projects_visible SMALLINT
);

CREATE TABLE tags (
    tag_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name NVARCHAR(30) NOT NULL
);

CREATE TABLE project_tags (
    project_id INT UNSIGNED NOT NULL REFERENCES projects,
    tag_id INT UNSIGNED NOT NULL REFERENCES tags,
    PRIMARY KEY (project_id, tag_id)
);

CREATE TABLE semesters (
    semester_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

CREATE TABLE project_semesters (
    project_id INT UNSIGNED NOT NULL REFERENCES projects,
    semester_id INT UNSIGNED NOT NULL REFERENCES semesters,
    PRIMARY KEY (project_id, semester_id)
);

CREATE TABLE related_projects (
    project_id INT UNSIGNED NOT NULL REFERENCES projects,
    related_project_id INT UNSIGNED NOT NULL REFERENCES projects,
    PRIMARY KEY (project_id, related_project_id)
);

CREATE TABLE attachments (
    attachment_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    file_name NVARCHAR(255) NOT NULL,
    file_location NVARCHAR(350) NOT NULL,
    file_size BIGINT UNSIGNED NOT NULL,
    type NVARCHAR(30) NOT NULL,
    visibility INT,
    is_main_photo BIT,
    project_id INT NOT NULL REFERENCES projects
);

CREATE TABLE users (
    user_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    first_name NVARCHAR(20),
    last_name NVARCHAR(30),
    is_supervisor SMALLINT(1) NOT NULL DEFAULT 0
);

CREATE TABLE users_emails (
	id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
	user_id INT UNSIGNED NOT NULL REFERENCES users,
    email VARCHAR(50) NOT NULL
);

CREATE TABLE project_collaborators (
    project_id INT UNSIGNED NOT NULL REFERENCES projects,
    user_id INT UNSIGNED NOT NULL REFERENCES users,
	user_data_visible SMALLINT(1) NOT NULL,
    is_supervisor SMALLINT(1) NOT NULL,
    PRIMARY KEY (project_id, user_id)
);

CREATE TABLE user_pinned_projects (
    user_id INT UNSIGNED NOT NULL REFERENCES users,
    pinned_project_id INT UNSIGNED NOT NULL REFERENCES projects,
    PRIMARY KEY (user_id, pinned_project_id)
);

CREATE TABLE notes (
    note_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    content NVARCHAR(500) NOT NULL,
    publication_date DATE NOT NULL,
    is_private BIT,
    owner_id INT UNSIGNED NOT NULL REFERENCES users,
    project_id INT UNSIGNED NOT NULL REFERENCES projects
);