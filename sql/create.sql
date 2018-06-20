create database kiohub;
use kiohub;

create table Project (
	`id` int unsigned AUTO_INCREMENT,
	`title` nvarchar(30),
	PRIMARY KEY(`id`)
);