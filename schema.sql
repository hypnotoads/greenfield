-- ---
-- Globals
-- ---
DROP DATABASE IF EXISTS `NList`;

CREATE DATABASE `NList`;

USE NList;

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'users'
--
-- ---

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(55) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `reputation` INTEGER UNSIGNED DEFAULT NULL,
  `photo_path` VARCHAR(500) DEFAULT NULL,
  `bookmarked` INTEGER UNSIGNED DEFAULT NULL,
  `languages` INTEGER UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'users'
--
-- ---

DROP TABLE IF EXISTS `user_voted`;

CREATE TABLE `user_voted` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_users` INTEGER UNSIGNED DEFAULT NULL,
  `id_resources` INTEGER UNSIGNED DEFAULT NULL,
  `vote` INTEGER DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'resources'
--
-- ---

DROP TABLE IF EXISTS `resources`;

CREATE TABLE `resources` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_languages` INTEGER UNSIGNED NOT NULL,
  `id_sub_topic` INTEGER UNSIGNED DEFAULT NULL,
  `id_resource_type` INTEGER UNSIGNED NOT NULL,
  `title` VARCHAR(30) DEFAULT NULL,
  `link` VARCHAR(2000) NOT NULL,
  `keywords` VARCHAR(255) DEFAULT NULL,
  `likes` INTEGER UNSIGNED DEFAULT NULL,  
  `dislikes` INTEGER UNSIGNED DEFAULT NULL,
  `date_added` DATETIME NOT NULL,
  `date_updated` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'comments'
--
-- ---

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_resources` INTEGER UNSIGNED NOT NULL,
  `id_users` INTEGER UNSIGNED DEFAULT NULL,
  `title` VARCHAR(30) DEFAULT NULL,
  `comment` VARCHAR(2000) NOT NULL,
  `likes` INTEGER UNSIGNED DEFAULT NULL,  
  `dislikes` INTEGER UNSIGNED DEFAULT NULL,
  `date_added` DATETIME NOT NULL,
  `date_updated` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'languages'
--
-- ---

DROP TABLE IF EXISTS `languages`;

CREATE TABLE `languages` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `logo` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'resource_type'
--
-- ---

DROP TABLE IF EXISTS `resource_type`;

CREATE TABLE `resource_type` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(55) NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'sub_topic'
--
-- ---

DROP TABLE IF EXISTS `sub_topic`;

CREATE TABLE `sub_topic` (
  `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  `topic` VARCHAR(55) NOT NULL,
  PRIMARY KEY (`id`)
);
-- ---
-- Foreign Keys
-- ---

ALTER TABLE `resources` ADD FOREIGN KEY (id_languages) REFERENCES `languages` (`id`);
ALTER TABLE `resources` ADD FOREIGN KEY (id_resource_type) REFERENCES `resource_type` (`id`);

ALTER TABLE `comments` ADD FOREIGN KEY (id_resources) REFERENCES `resources` (`id`);
ALTER TABLE `comments` ADD FOREIGN KEY (id_users) REFERENCES `users` (`id`);
-- ALTER TABLE `resources` ADD FOREIGN KEY (id_sub_topic) REFERENCES `sub_topic` (`id`);
ALTER TABLE `user_voted` ADD FOREIGN KEY (id_users) REFERENCES `users` (`id`);
ALTER TABLE `user_voted` ADD FOREIGN KEY (id_resources) REFERENCES `resources` (`id`);


-- ---
-- Table Properties
-- ---

-- ALTER TABLE `users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `users_voted` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `resources` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `languages` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `resource_type` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data --use the below templates to insert template data from the get go
-- ---

-- INSERT INTO `users` (`id`,`name`,`email`,`password`,`photo_path`,`bookmarked`,`languages`) VALUES
-- ('','','','','','','');

-- INSERT INTO `resources` (`id_sub_topic`,`id_languages`,`id_resource_type`,`link`,`keywords`,`likes`,`dislikes`,`date_added`) VALUES
-- (1, 2, 2,'http://google.com','Testing Testing', 1,0 ,NOW());


-- Languages Test Data
-- INSERT INTO `languages` (`id`,`name`) VALUES
-- ('','');
  INSERT INTO `languages` (`name`, `logo`) VALUES
  ('C language', 'c'),
  ('C++ language', 'cplusplus'),
  ('C# language', 'csharp'),
  ('CSS language', 'css3'),
  ('Deployment language', 'heroku'),
  ('.Net language', 'dot-net'),
  ('Git language', 'git'),
  ('Go language', 'go'),
  ('Html language', 'html5'),
  ('Java language', 'java'),
  ('Javascript language', 'javascript'),
  ('Php language', 'php'),
  ('Python language', 'python'),
  ('Ruby language', 'ruby'),
  ('MySql language', 'sql');

-- this will create an id_languages of 1 via auto_increment for the sub_topics below



-- Resource Type Test Data
-- INSERT INTO `resource_type` (`type`) VALUES
-- ('Forum'), ('Article'), ('Video');

INSERT INTO `resource_type` (`type`) VALUES
('Article'), ('Book'), ('Forum'), ('Video');


INSERT INTO `sub_topic` (`topic`) VALUES
('Bootstrap'),
('Jeet'),
('Less'),
('Sass'),
('Amazon Web Services'),
('Apache'),
('Bower'),
('Docker'),
('Grunt'),
('Gulp'),
('Heroku'),
('Bitbucket'),
('Github'),
('Gitlab'),
('angularjs'),
('Backbonejs'),
('CoffeeScript'),
('D3js'),
('Jquery'),
('Krakenjs'),
('Meteor'),
('Mongo'),
('Nodejs'),
('React'),
('CodeIgniter'),
('Doctrine'),
('Laravel'),
('Symfony'),
('Yii'),
('Django'),
('Rails'),
('MySql'),
('PostgreSql'),
('');
