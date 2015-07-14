/*
* Reset the database
*/
-- DROP TABLE players;
-- DROP TABLE classes;
-- DROP TABLE levels;

CREATE TABLE IF NOT EXISTS `classes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `class_name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `players` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(12) NOT NULL,
  `level` int unsigned DEFAULT 1,
  `xp` int unsigned NOT NULL Default 0,
  `gold` int(10) unsigned DEFAULT NULL,
  `class_id` int(10) unsigned NOT NULL DEFAULT '1',
  `created_at` bigint(20) DEFAULT NULL,
  `updated_at` text,
  `role` int(11) DEFAULT '0',
  `team_id` text NOT NULL,
  `last_message_at` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `fk_players_classes` (`class_id`),
  KEY `fk_players_levels` (`level`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `levels` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(20) NOT NULL,
  `xp_needed` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

ALTER TABLE `players`
  ADD CONSTRAINT `fk_players_classes` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`);

ALTER TABLE `players`
  ADD CONSTRAINT `fk_players_levels` FOREIGN KEY (`level`) REFERENCES `levels` (`id`);


INSERT INTO `classes` (`id`, `class_name`, `description`) VALUES
(1, 'Default', 'Default class'),
(2, 'developer', 'Devs class'),
(3, 'designer', 'Designer class, wow, such painting.');

INSERT INTO `levels` (`id`, `name`) VALUES
(1, 'Level 1'),
(2, 'Level 2'),
(3, 'Level 3');
