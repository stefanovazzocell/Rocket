SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE `banned` (
  `ip` varchar(40) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `links` (
  `short` char(88) NOT NULL,
  `data` varchar(2048) NOT NULL,
  `hash` char(88) NOT NULL,
  `views` int(10) UNSIGNED NOT NULL DEFAULT '1000',
  `expiration` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `logs` (
  `id` char(128) NOT NULL,
  `tax` int(10) UNSIGNED NOT NULL,
  `expire` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `banned`
  ADD PRIMARY KEY (`ip`);

ALTER TABLE `links`
  ADD PRIMARY KEY (`short`);

ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);
