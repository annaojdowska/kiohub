USE kiohub;

DROP TABLE IF EXISTS licences;
DROP TABLE IF EXISTS project_status;
DROP TABLE IF EXISTS project_types;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS project_settings;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS project_tags;
DROP TABLE IF EXISTS semesters;
DROP TABLE IF EXISTS project_semesters;
DROP TABLE IF EXISTS related_projects;
DROP TABLE IF EXISTS attachments;
DROP TABLE IF EXISTS attachments_files;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS project_collaborators;
DROP TABLE IF EXISTS user_pinned_projects;
DROP TABLE IF EXISTS notes;

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
    is_published SMALLINT(1),
    licence_id INT UNSIGNED REFERENCES licences,
    type_id INT UNSIGNED REFERENCES project_types,
    status_id INT UNSIGNED REFERENCES project_status
);

CREATE TABLE project_settings (
	project_id INT UNSIGNED NOT NULL PRIMARY KEY REFERENCES projects,
    licence_visible SMALLINT(1),
    supervisor_visible SMALLINT(1),
    publication_date_visible SMALLINT(1),
    tags_visible SMALLINT(1),
    semesters_visible SMALLINT(1),
	related_projects_visible SMALLINT(1)
);

CREATE TABLE tags (
	tag_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
	name NVARCHAR(30) NOT NULL
);

CREATE TABLE project_tags (
	project_id INT UNSIGNED NOT NULL REFERENCES projects,
    tag_id INT UNSIGNED NOT NULL REFERENCES tags,
    PRIMARY KEY(project_id, tag_id)
);

CREATE TABLE semesters (
	semester_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
	name VARCHAR(20) NOT NULL
);

CREATE TABLE project_semesters (
	project_id INT UNSIGNED NOT NULL REFERENCES projects,
    semester_id INT UNSIGNED NOT NULL REFERENCES semesters,
    PRIMARY KEY(project_id, semester_id)
);

CREATE TABLE related_projects (
	project_id INT UNSIGNED NOT NULL REFERENCES projects,
    related_project_id INT UNSIGNED NOT NULL REFERENCES projects,
    PRIMARY KEY(project_id, related_project_id)
);

CREATE TABLE attachments (
	attachment_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    file_name NVARCHAR(255) NOT NULL,
    file_size MEDIUMINT UNSIGNED NOT NULL,
    type NVARCHAR(30) NOT NULL,
    visibility INT,    
    is_main_photo SMALLINT(1),
    project_id INT NOT NULL REFERENCES projects
);

CREATE TABLE attachments_files (
    attachments_id INT UNSIGNED NOT NULL PRIMARY KEY REFERENCES attachments,
    file LONGBLOB NOT NULL
);

CREATE TABLE users (
	user_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    first_name NVARCHAR(20) NOT NULL,
    last_name NVARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL
);

CREATE TABLE project_collaborators (
	project_id INT UNSIGNED NOT NULL REFERENCES projects,
    user_id INT UNSIGNED NOT NULL REFERENCES users,
	user_data_visible SMALLINT(1),
	is_supervisor SMALLINT(1),
    PRIMARY KEY(project_id, user_id)
);

CREATE TABLE user_pinned_projects (
    user_id INT UNSIGNED NOT NULL REFERENCES users,
	project_id INT UNSIGNED NOT NULL REFERENCES projects,
    PRIMARY KEY(user_id, project_id)
);

CREATE TABLE notes (
	note_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    content NVARCHAR(500) NOT NULL,
    publication_date DATE NOT NULL,
    is_private SMALLINT(1),
    owner_id INT UNSIGNED NOT NULL REFERENCES users,
    project_id INT UNSIGNED NOT NULL REFERENCES projects
);