USE `rpgbot`;

-- --------------------------------------------------------

--
-- Structure de la table `classes`
--

CREATE TABLE IF NOT EXISTS `classes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `class_name` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `commands`
--

CREATE TABLE IF NOT EXISTS `commands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `file_name` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `active` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

-- --------------------------------------------------------

--
-- Structure de la table `commands_triggers`
--

CREATE TABLE IF NOT EXISTS `commands_triggers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_command` int(11) NOT NULL,
  `id_trigger` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

-- --------------------------------------------------------

--
-- Structure de la table `players`
--

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
  `password` varchar(60) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `triggers`
--

CREATE TABLE IF NOT EXISTS `triggers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `called` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

-- --------------INSERT DEFAULT SCRIPTS ------------------
INSERT INTO `commands` (`id`, `name`, `file_name`, `description`, `active`) VALUES
(1, 'Good Night', 'good_night.js', 'Say bye to ppl.', 0),
(2, 'twitch', 'twitch.js', 'Check if streamers are online', 1),
(3, 'isup', 'isup.js', 'Check if websites are online', 1),
(4, 'youtube', 'youtube.js', 'Youtube search included right into slack', 1),
(5, 'money', 'money.js', 'Convertoooorrr', 1),
(6, 'bitcoin', 'btc.js', 'Bitcoin trends', 1),
(7, 'xkcd', 'xkcd.js', 'Xkcd right in Slack', 1),
(8, 'whois', 'whois.js', 'Whois command in Slack', 1),
(9, 'shortner', 'shortner.js', 'Urlshortner command', 1);

INSERT INTO `triggers` (`id`, `name`, `called`) VALUES
(1, 'bn', 0),
(2, 'bonne nuit', 0),
(3, 'twitch', 0),
(4, 'isup', 0),
(5, 'youtube', 0),
(6, 'yt', 0),
(7, 'convert', 0),
(10, 'btc', 0),
(11, 'bitcoin', 0),
(12, 'xkcd', 0),
(13, 'whois', 0),
(14, 'shortner', 0);

--
-- Contenu de la table `commands_triggers`
--

INSERT INTO `commands_triggers` (`id`, `id_command`, `id_trigger`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 3),
(4, 3, 4),
(5, 4, 5),
(6, 4, 6),
(7, 5, 7),
(10, 6, 10),
(11, 6, 11),
(12, 7, 12),
(13, 8, 13),
(14, 9, 14);
