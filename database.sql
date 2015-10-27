CREATE DATABASE `rpgbot` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `rpgbot`;

CREATE TABLE IF NOT EXISTS `classes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `class_name` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `commands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `file_name` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `active` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `players` (
  `user_id` varchar(50) NOT NULL,
  `gold` int(11) NOT NULL,
  `team_id` varchar(50) NOT NULL,
  `channel_name` varchar(50) NOT NULL,
  `created_at` bigint(20) NOT NULL,
  `updated_at` bigint(20) NOT NULL,
  `role` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `last_message_at` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

