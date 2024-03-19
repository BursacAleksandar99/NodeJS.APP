/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP DATABASE IF EXISTS `aplikacija`;
CREATE DATABASE IF NOT EXISTS `aplikacija` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `aplikacija`;

DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `password_hash` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `administrator`;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`) VALUES
	(1, 'aleksandar', 'AEE3F9C9505D896CDEAF73F0F390185769A1C41CD0144E9F78B47E9CB6722B2F24F142BE974A1E481F16074F3B0AF44F9AD23DA19870C9F7627A0E7E7C097D74'),
	(2, 'jelena', '57586EC40DC5890993ADAEBD8684399A6AB999F9430E3FF3AB9C3E554B334499533A1B07B4737843F509CAE63977B7EE4637EE2F2C7CF0E856DAD71EFD88A273'),
	(3, 'pperic', '44F7BBC321F0FAEE0BFBF4282BC2C70813A3D03767978849DF04840FE14C05AB083CBD49183A6FF92B9A97D6DA7F2DBDC972F8B5F2C3EFD14C9F659996D478CC'),
	(6, 'mmilic', '95E8679C970A1AFD5F3FCFDFCD95E78CE02CEA9D6739C4D5CCADC298556C88B649B7B1BAABB1A28080EC484DDA102C5AD652D3F04CEBE4647DF645F26EC10A03'),
	(8, 'ZikoPopovic', '0080D93BDFFE4D155F472395E0CDF7C41E0184BEA043E5B1B16F15468DA84513EF86169A9621C67F3EA04D54CE7591E3E87405B400454DC1168007C93167FA09'),
	(9, 'admin', 'c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec'),
	(10, 'AleksandarBursac99', '6b6323a61306ca9171700ba55a0e7d2c0dd21da92aae35a7bbcf2190ffec46bb27c52f32f922ac42676b43f1c53552c89aa298e235843282518bd6b4ed28947c'),
	(11, 'JelenaDeniroRakic', '3c6f228c59376c681310bec6103b83fac483b9407f39da2196c65ead13af212d561e0438269163178d422a7ad92e6aa336b4319946162f75fb0709d288fb810d'),
	(12, 'Neki Tamo Lik', '98d7c4ce32d131d6259b9d372b2897310883c5a732adfcd6aa5b648cbd7c95d7e522dbbf2ce7b6c5f6a94a2a6674b571a182ed2397fbc75c8ddc17f224672fa3');

DROP TABLE IF EXISTS `article`;
CREATE TABLE IF NOT EXISTS `article` (
  `article_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `category_id` int unsigned NOT NULL DEFAULT (0),
  `excerpt` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('available','visible','hidden') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `is_promoted` tinyint unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`article_id`),
  KEY `FK_article_category` (`category_id`),
  CONSTRAINT `FK_article_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `article`;
INSERT INTO `article` (`article_id`, `name`, `category_id`, `excerpt`, `description`, `status`, `is_promoted`, `created_at`) VALUES
	(1, 'ACME HD11 1024GB', 5, 'Neki kratak teskt 2.....', 'Neki malo duzi teskt o proizvodu 2.', 'visible', 1, '2024-02-25 15:17:36'),
	(3, 'Sapphire Radeon RX 6700 XT', 1, 'Graficka kartica za malo ozbiljniji gaming!', 'Ovo je prava graficka kartica za korisnike koji zele da uzivaju u 14400p gamingu!', 'available', 1, '2024-02-27 22:44:14'),
	(4, 'Sapphire Radeon RX 6800 XT', 1, 'Graficka kartica za malo ozbiljniji gaming!', 'Ovo je prava graficka kartica za korisnike koji zele da uzivaju u 14400p gamingu!', 'available', 1, '2024-02-27 22:44:24'),
	(13, 'Sapphire Radeon RX 6600 XT', 1, 'Graficka kartica za gaming!', 'Ovo je prava graficka kartica za korisnike koji zele da uzivaju u 1080p gamingu!', 'available', 1, '2024-02-28 18:21:38'),
	(14, 'ACME HD11 1TB', 5, 'Neki kratak teskt...', 'Neki malo duzi tekst o proizvodu', 'available', 0, '2024-03-04 19:52:11'),
	(15, 'ACME HD11 1TB', 5, 'Neki kratak teskt...', 'Neki malo duzi tekst o proizvodu', 'available', 0, '2024-03-04 19:53:31'),
	(16, 'RTX 3060 12GB', 1, 'Graficka kartica za gaming!', 'Ovo je prava graficka kartica za korisnike koji zele da uzivaju u 1080p gamingu!', 'available', 1, '2024-03-12 01:06:32'),
	(17, 'ACME HD11 1TB', 5, 'Neki kratak teskt...', 'Neki malo duzi tekst o proizvodu', 'available', 0, '2024-03-13 01:41:13'),
	(18, 'RTX 3070 8GB', 1, 'Graficka kartica za gaming!', 'Ovo je prava graficka kartica za korisnike koji zele da uzivaju u 1080p gamingu!', 'available', 1, '2024-03-13 01:45:58'),
	(19, 'GTX 1060 6GB', 1, 'Najpopularnija graficka na steam-u!', 'Najpopularnija graficka na steam-u, jer je i dalje dobra!', 'available', 1, '2024-03-18 15:27:37'),
	(20, 'GTX 1060 6GB', 1, 'Najpopularnija graficka na steam-u!', 'Najpopularnija graficka na steam-u, jer je i dalje dobra!', 'available', 1, '2024-03-18 15:28:24'),
	(21, 'GTX 1060 6GB', 1, 'Najpopularnija graficka na steam-u!', 'Najpopularnija graficka na steam-u, jer je i dalje dobra!', 'available', 1, '2024-03-18 15:28:51'),
	(22, 'GTX 1070 8GB', 1, 'Najpopularnija graficka na steam-u!', 'Najpopularnija graficka na steam-u, jer je i dalje dobra!', 'available', 1, '2024-03-18 15:33:14'),
	(23, 'GTX 1070 8GB', 1, 'Najpopularnija graficka na steam-u!', 'Najpopularnija graficka na steam-u, jer je i dalje dobra!', 'available', 1, '2024-03-18 18:35:20'),
	(24, 'GTX 1080Ti 11GB', 1, 'Najjaca karta GTX serije!', 'I dalje tera sve u 1080p!', 'available', 1, '2024-03-19 14:59:26');

DROP TABLE IF EXISTS `article_feature`;
CREATE TABLE IF NOT EXISTS `article_feature` (
  `article_feature_id` int unsigned NOT NULL AUTO_INCREMENT,
  `feature_id` int unsigned NOT NULL DEFAULT '0',
  `article_id` int unsigned NOT NULL DEFAULT '0',
  `value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`article_feature_id`),
  UNIQUE KEY `uq_article_feature_feature_id_article_id` (`feature_id`,`article_id`),
  KEY `fk_article_feature_article_id` (`article_id`),
  CONSTRAINT `fk_article_feature_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_article_feature_feature_id` FOREIGN KEY (`feature_id`) REFERENCES `feature` (`feature_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `article_feature`;
INSERT INTO `article_feature` (`article_feature_id`, `feature_id`, `article_id`, `value`) VALUES
	(5, 3, 14, 'SSD'),
	(6, 1, 14, '1TB'),
	(7, 1, 15, '1TB'),
	(8, 3, 15, 'SSD'),
	(9, 3, 17, 'SSD'),
	(10, 1, 17, '1TB'),
	(11, 1, 1, '1024GB'),
	(12, 2, 1, 'SATA 3.0');

DROP TABLE IF EXISTS `article_price`;
CREATE TABLE IF NOT EXISTS `article_price` (
  `article_price_id` int unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int unsigned NOT NULL DEFAULT '0',
  `price` decimal(10,2) unsigned NOT NULL DEFAULT (0),
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`article_price_id`),
  KEY `fk_article_price_article_id` (`article_id`),
  CONSTRAINT `fk_article_price_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `article_price`;
INSERT INTO `article_price` (`article_price_id`, `article_id`, `price`, `created_at`) VALUES
	(1, 1, 45.00, '2024-02-25 16:51:02'),
	(2, 1, 43.56, '2024-02-25 16:51:19'),
	(3, 14, 56.89, '2024-03-04 19:52:11'),
	(4, 15, 56.89, '2024-03-04 19:53:31'),
	(5, 17, 56.89, '2024-03-13 01:41:13'),
	(6, 3, 400.69, '2024-03-14 01:31:16'),
	(7, 1, 57.11, '2024-03-14 01:43:31');

DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `cart_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`cart_id`) USING BTREE,
  KEY `fk_cart_user_id` (`user_id`),
  CONSTRAINT `fk_cart_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `cart`;

DROP TABLE IF EXISTS `cart_article`;
CREATE TABLE IF NOT EXISTS `cart_article` (
  `cart_article_id` int unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` int unsigned NOT NULL DEFAULT '0',
  `article_id` int unsigned NOT NULL DEFAULT '0',
  `quantity` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`cart_article_id`),
  UNIQUE KEY `uq_cart_article_cart_id_article_id` (`cart_id`,`article_id`),
  KEY `fkl_cart_article_article_id` (`article_id`),
  CONSTRAINT `fk_cart_article_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fkl_cart_article_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `cart_article`;

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `image_path` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `parent__category_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`),
  UNIQUE KEY `uq_category_image_path` (`image_path`),
  KEY `fk_category_parent__category_id` (`parent__category_id`),
  CONSTRAINT `fk_category_parent__category_id` FOREIGN KEY (`parent__category_id`) REFERENCES `category` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `category`;
INSERT INTO `category` (`category_id`, `name`, `image_path`, `parent__category_id`) VALUES
	(1, 'Racunarske komponente', 'assets/pc.jpg', NULL),
	(2, 'Kucna elektronika', 'assets/home/jpg', NULL),
	(4, 'Memorijski mediji update', 'assets/pc/memory.jpg', NULL),
	(5, 'Hard diskovi', 'assets/pc/memory/hdd.jpg', 4),
	(6, 'Laptopovi', 'images/1/laptop.jpg', NULL),
	(7, 'Graficke kartice', 'images/1/gpu.jpg', 1);

DROP TABLE IF EXISTS `feature`;
CREATE TABLE IF NOT EXISTS `feature` (
  `feature_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `category_id` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`feature_id`),
  UNIQUE KEY `uq_feature_name_category_id` (`name`,`category_id`),
  KEY `fk_feature_categoty_id` (`category_id`),
  CONSTRAINT `fk_feature_categoty_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `feature`;
INSERT INTO `feature` (`feature_id`, `name`, `category_id`) VALUES
	(1, 'Kapacitet', 5),
	(4, 'Radna memorija', 7),
	(3, 'Tehnologija', 5),
	(2, 'Tip', 5);

DROP TABLE IF EXISTS `order`;
CREATE TABLE IF NOT EXISTS `order` (
  `order_id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `cart_id` int unsigned NOT NULL DEFAULT (0),
  `status` enum('rejected','accepted','shipped','pending') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `uq_order_cart_id` (`cart_id`),
  CONSTRAINT `fk_order_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `order`;

DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int unsigned NOT NULL DEFAULT '0',
  `image_path` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_photo_image_path` (`image_path`),
  KEY `fk_photo_article_id` (`article_id`),
  CONSTRAINT `fk_photo_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `photo`;
INSERT INTO `photo` (`photo_id`, `article_id`, `image_path`) VALUES
	(1, 1, 'images/1/front.jpg'),
	(2, 1, 'images/1/label.jpg'),
	(3, 3, '2024312-8002827455-RX6700XT.jpg'),
	(4, 3, '2024312-8789889977-rx6700xt.jpg');

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `password_hash` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `forname` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `surname` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `phone_number` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_email` (`email`),
  UNIQUE KEY `uq_user_phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `user`;
INSERT INTO `user` (`user_id`, `email`, `password_hash`, `forname`, `surname`, `phone_number`) VALUES
	(1, 'test@test.rs', '90D921CFC45F9243082F8DFEA60919D70B47C8D1D9E1AF9C6F1294F53BE687D0CDDD4DBC9AE1DA8A6C1115E266CD2CC01EEF05CB8CE624FF3875A69FA0B29A3C', 'Pera', 'Peric', '+38166999999'),
	(2, 'stevica.bursac.no.1@gmail.com', '1B954FC70BFE61D2345D4B9A49951DECB1DCF1860DE94BE6836AA8BB2041CF3D967846FE3FB5D776310BCA5FF083AC49F2AEBFBEEC2F7029CAFCC2C423784CC7', 'Aleksandar', 'Bursac', '+381641272155'),
	(4, 'neki.tamo@gmail.com', '3627909A29C31381A071EC27F7C9CA97726182AED29A7DDD2E54353322CFB30ABB9E3A6DF2AC2C20FE23436311D678564D0C8D305930575F60E2D3D048184D79', 'Neki', 'Tamo', '+381641573555'),
	(6, 'neki.tamo99@gmail.com', 'BA3253876AED6BC22D4A6FF53D8406C6AD864195ED144AB5C87621B6C233B548BAEAE6956DF346EC8C17F5EA10F35EE3CBC514797ED7DDD3145464E2A0BAB413', 'Neki', 'Tamo', '+3814126791'),
	(7, 'neki.tamo999@gmail.com', 'E13EFC991A9BF44BBB4DA87CDBB725240184585CCAF270523170E008CF2A3B85F45F86C3DA647F69780FB9E971CAF5437B3D06D418355A68C9760C70A31D05C7', 'Neki', 'Saban', '+38161267941'),
	(9, 'aleksadnar.bursac99@gmail.com', '70E9B857ACA8D91BC6407F76262723939EA25CDAF74644820AFFFD28CFDBA12D84121FD225A1C7BDAC0C7D9116E04A08BDE682716E43D24AC31436B8EB8F575A', 'Aleksandar', 'Bursac', '+381612674214');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
