-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.6.16 - MySQL Community Server (GPL)
-- Server OS:                    Win32
-- HeidiSQL Version:             8.3.0.4694
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping database structure for adsplay_admin
CREATE DATABASE IF NOT EXISTS `adsplay_admin` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `adsplay_admin`;


-- Dumping structure for table adsplay_admin.advertisers
CREATE TABLE IF NOT EXISTS `advertisers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8 NOT NULL,
  `contact_info` text CHARACTER SET utf8 NOT NULL,
  `user_id` mediumint(8) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1025 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.advertisers: ~16 rows (approximately)
/*!40000 ALTER TABLE `advertisers` DISABLE KEYS */;
INSERT IGNORE INTO `advertisers` (`id`, `name`, `contact_info`, `user_id`) VALUES
	(1009, 'iTVad-Overlay-Toshib', 'Overlay Toshiba', 1),
	(1010, 'FptPlay-EPL- MU-AFC', 'FptPlay', 1),
	(1011, 'Nhacso-Promotion-And', 'Nhacso', 2),
	(1012, 'Samsung S6 Ad-PC', 'Samsung', 3),
	(1013, 'Romano', 'Romano', 2),
	(1014, 'LotteDatViet-Miracle', 'LotteDatViet', 3),
	(1015, 'FptPlay-BreakingAd-U', 'FptPlay-BreakingAd', 1);
/*!40000 ALTER TABLE `advertisers` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.brands
CREATE TABLE IF NOT EXISTS `brands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(250) COLLATE utf8_unicode_ci DEFAULT '0',
  `campaign_id` int(11) DEFAULT '0',
  `date_created` datetime DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.brands: ~4 rows (approximately)
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT IGNORE INTO `brands` (`id`, `brand_name`, `campaign_id`, `date_created`) VALUES
	(1, 'Pepsi', 0, '0000-00-00 00:00:00'),
	(2, 'SusuKi', 0, '0000-00-00 00:00:00'),
	(3, 'Omo', 0, '0000-00-00 00:00:00'),
	(6, 'Sunsilk', 0, '0000-00-00 00:00:00'),
	(7, 'Omachi', 0, '2016-05-23 11:30:37'),
	(8, 'Oppo', 0, '2016-05-23 11:33:15');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.campaigns
CREATE TABLE IF NOT EXISTS `campaigns` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `campaign_name` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `unit_title` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `sector_id` int(11) DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `user_id` mediumint(8) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.campaigns: ~7 rows (approximately)
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
INSERT IGNORE INTO `campaigns` (`id`, `campaign_name`, `brand_id`, `unit_title`, `product_id`, `sector_id`, `date_created`, `user_id`) VALUES
	(1, 'Pepsi Tet promo', 2, 'pepsi', 2, 2, '2016-05-19 06:08:47', 2),
	(2, 'Omo Lauching 2016', 3, 'omo', 3, 3, '2016-05-19 06:08:07', 4),
	(4, 'Oppo Son Tung MT-P', 6, 'oppo', 3, 4, '2015-08-26 11:53:22', 1),
	(5, '7up Summer Come', 1, '7up', 1, 1, '2016-05-23 11:08:54', 1);
/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.creatives
CREATE TABLE IF NOT EXISTS `creatives` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `description` varchar(1000) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `campaign_id` int(10) unsigned NOT NULL,
  `status` smallint(5) unsigned NOT NULL,
  `ad_type` smallint(5) unsigned NOT NULL,
  `created_date` int(10) unsigned NOT NULL,
  `expired_date` int(10) unsigned NOT NULL,
  `skip_offset` smallint(5) unsigned NOT NULL,
  `duration` int(10) unsigned NOT NULL,
  `click_through` varchar(500) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `media_id` int(10) unsigned NOT NULL,
  `advertiser_id` int(10) unsigned NOT NULL,
  `is3rdAd` smallint(5) unsigned DEFAULT '0',
  `vast_3rd_url` varchar(500) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1003 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.creatives: ~2 rows (approximately)
/*!40000 ALTER TABLE `creatives` DISABLE KEYS */;
INSERT IGNORE INTO `creatives` (`id`, `name`, `description`, `campaign_id`, `status`, `ad_type`, `created_date`, `expired_date`, `skip_offset`, `duration`, `click_through`, `media_id`, `advertiser_id`, `is3rdAd`, `vast_3rd_url`) VALUES
	(1001, 'Vespa', 'Demo Creative', 20, 2, 1, 1443079257, 1444867200, 15, 20, 'http://google.com.vn', 2, 2, 0, 'http://uuu'),
	(1002, 'Coca Cola', 'New Creative', 1, 2, 1, 1443079427, 1444867200, 15, 20, 'http://google.com.vn', 3, 1, 0, 'https://facebook.com');
/*!40000 ALTER TABLE `creatives` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.delivery_settings
CREATE TABLE IF NOT EXISTS `delivery_settings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `creative_id` int(10) unsigned DEFAULT NULL,
  `run_date` int(10) unsigned NOT NULL,
  `targeting_locations` varchar(1000) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `frequency` smallint(5) unsigned NOT NULL DEFAULT '0',
  `dayparts` varchar(1000) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `targeting_reach` int(10) unsigned NOT NULL,
  `targeting_publishers` varchar(1000) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `targeting_categories` varchar(1000) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `targeting_devices` varchar(1000) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `audience_age_groups` varchar(1000) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `audience_gender_groups` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `buying_model` smallint(5) unsigned NOT NULL DEFAULT '1',
  `running_schedules` varchar(1000) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.delivery_settings: ~0 rows (approximately)
/*!40000 ALTER TABLE `delivery_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `delivery_settings` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.devices
CREATE TABLE IF NOT EXISTS `devices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.devices: ~0 rows (approximately)
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.device_models
CREATE TABLE IF NOT EXISTS `device_models` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci DEFAULT '0',
  `device_id` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.device_models: ~0 rows (approximately)
/*!40000 ALTER TABLE `device_models` DISABLE KEYS */;
/*!40000 ALTER TABLE `device_models` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.groups
CREATE TABLE IF NOT EXISTS `groups` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.groups: ~3 rows (approximately)
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT IGNORE INTO `groups` (`id`, `name`, `description`) VALUES
	(1, 'superAdmin', 'Super Admin'),
	(2, 'admin', 'Admin'),
	(3, 'members', 'General User');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.login_attempts
CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(15) NOT NULL,
  `login` varchar(100) NOT NULL,
  `time` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table adsplay_admin.login_attempts: ~0 rows (approximately)
/*!40000 ALTER TABLE `login_attempts` DISABLE KEYS */;
/*!40000 ALTER TABLE `login_attempts` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.media_files
CREATE TABLE IF NOT EXISTS `media_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `path` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `check_sum` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.media_files: ~6 rows (approximately)
/*!40000 ALTER TABLE `media_files` DISABLE KEYS */;
INSERT IGNORE INTO `media_files` (`id`, `path`, `type`, `size`, `check_sum`) VALUES
	(1, 'FPTPlay-HD.mp4', NULL, NULL, NULL),
	(2, 'FPTPlay-HD.mp4', 'video', 2268, NULL),
	(3, 'FPTPlay.mp4', 'video', 2268, NULL),
	(4, 'FPTPlay.mp4', 'video', 2268, NULL),
	(5, 'lottedatviet-smartkey.mp4', 'video', 1080, NULL),
	(6, 'ngam-6-00f61.png', 'image', 143, NULL);
/*!40000 ALTER TABLE `media_files` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.meta
CREATE TABLE IF NOT EXISTS `meta` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `first_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `ext_info` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.meta: ~26 rows (approximately)
/*!40000 ALTER TABLE `meta` DISABLE KEYS */;
INSERT IGNORE INTO `meta` (`id`, `user_id`, `first_name`, `last_name`, `ext_info`) VALUES
	(2, 3, 'Trieu', 'Nguyen', '0'),
	(12, 16, 'Mi', 'Truong', '0'),
	(13, 15, 'tantrieuf31', 'databased', '0'),
	(19, 23, 'MIMI', 'hhhhhh', '0'),
	(20, 24, '0', '0', '0'),
	(21, 29, '0', '0', '0'),
	(22, 30, '0', '0', '0'),
	(23, 36, 'hahaha', 'hahaha', NULL),
	(24, 37, 'Trương Mi', 'Trương Mi', NULL),
	(25, 38, 'MIMIMI', 'MIMIMI', NULL),
	(26, 39, 'gggggggggggggg', 'gggggggggggggg', NULL),
	(27, 40, 'sdfsdfsf', 'sdfsdfsf', NULL),
	(28, 41, 'fghfhgfhfhf', 'fghfhgfhfhf', NULL),
	(29, 42, 'sdfgdgdg', 'sdfgdgdg', NULL),
	(30, 43, 'hhhhhhhhhhhhhhhhh', 'hhhhhhhhhhhhhhhhh', NULL),
	(31, 44, 'ttttt', 'ttttt', NULL),
	(32, 45, 'rrrrrrr', 'rrrrrrr', '0'),
	(33, 46, 'rrrrrrrrrrrrrrrrrr', 'rrrrrrrrrrrrrrrrrr', '0'),
	(34, 47, 'fffffffffffff', 'fffffffffffff', '0'),
	(35, 48, 'rrrr', 'rrrr', '0'),
	(36, 49, 'rrrr', 'rrrr', '0'),
	(37, 50, 'eeeee', 'eeeee', '0'),
	(38, 51, 'eeeee', 'eeeee', '0'),
	(39, 52, 'hhhhhhhhhhh', 'hhhhhhhhhhh', '0'),
	(40, 53, 'trangtt@fpt.com.vn', 'trangtt@fpt.com.vn', NULL),
	(41, 54, 'tantrieuf31', 'tantrieuf31', '0');
/*!40000 ALTER TABLE `meta` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.pages
CREATE TABLE IF NOT EXISTS `pages` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL,
  `controller` varchar(50) DEFAULT NULL,
  `view` varchar(50) DEFAULT '',
  `url` varchar(50) DEFAULT NULL,
  `menu` varchar(50) DEFAULT NULL,
  `order` int(2) unsigned DEFAULT NULL,
  `require_login` int(1) unsigned DEFAULT '0',
  `group_id` int(10) unsigned DEFAULT '0',
  `parent_id` int(10) unsigned DEFAULT NULL,
  `active` int(1) unsigned DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

-- Dumping data for table adsplay_admin.pages: 3 rows
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT IGNORE INTO `pages` (`id`, `title`, `controller`, `view`, `url`, `menu`, `order`, `require_login`, `group_id`, `parent_id`, `active`) VALUES
	(1, 'Home', 'welcome', '', NULL, 'main', 1, 0, 0, NULL, 1),
	(16, 'Admin Control Panel', 'auth', '', NULL, NULL, NULL, 0, 1, NULL, 1),
	(9, 'Home', 'welcome', '', NULL, 'bottom', 0, 1, 0, NULL, 1);
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT '0',
  `brand_id` int(11) DEFAULT '0',
  `date_created` datetime DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.products: ~7 rows (approximately)
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT IGNORE INTO `products` (`id`, `product_name`, `brand_id`, `date_created`) VALUES
	(1, 'Instant noodle', 7, '0000-00-00 00:00:00'),
	(2, 'Yamaha', 2, '0000-00-00 00:00:00'),
	(3, 'Motor bike', 2, '0000-00-00 00:00:00'),
	(4, 'Softdrink', 1, '0000-00-00 00:00:00'),
	(5, 'Mobile phone', 8, '0000-00-00 00:00:00');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.publishers
CREATE TABLE IF NOT EXISTS `publishers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8 NOT NULL,
  `page_url` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `contact_info` text CHARACTER SET utf8 NOT NULL,
  `user_id` mediumint(8) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1028 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.publishers: ~7 rows (approximately)
/*!40000 ALTER TABLE `publishers` DISABLE KEYS */;
INSERT IGNORE INTO `publishers` (`id`, `name`, `page_url`, `contact_info`, `user_id`) VALUES
	(1, 'Nhạc Số', 'http://nhacso.net/', 'Ban Dự Án FPT', 1),
	(2, 'FPT Play', 'https://fptplay.net/', 'FPT Play', 1),
	(3, 'FShare', 'https://www.fshare.v', 'Chia sẽ file', 2),
	(4, 'test', 'http://test.com/', 'Test', 3),
	(5, 'Dầu Dừa Xanh', 'http://dauduaxanh.co', 'Dầu dừa Bến Tre Nguyên Chất', 1);
/*!40000 ALTER TABLE `publishers` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.sectors
CREATE TABLE IF NOT EXISTS `sectors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sector_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT '0',
  `product_id` int(11) DEFAULT '0',
  `date_created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.sectors: ~8 rows (approximately)
/*!40000 ALTER TABLE `sectors` DISABLE KEYS */;
INSERT IGNORE INTO `sectors` (`id`, `sector_name`, `product_id`, `date_created`) VALUES
	(1, 'Beverage', 4, '0000-00-00 00:00:00'),
	(2, 'Packaged food', 1, '0000-00-00 00:00:00'),
	(3, 'Mobile devices', 5, '2015-08-26 11:52:41'),
	(4, 'Personal care', 2, '0000-00-00 00:00:00'),
	(5, 'Automotive', 3, '0000-00-00 00:00:00');
/*!40000 ALTER TABLE `sectors` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.targeting_categories
CREATE TABLE IF NOT EXISTS `targeting_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci DEFAULT '0',
  `publisher_id` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.targeting_categories: ~0 rows (approximately)
/*!40000 ALTER TABLE `targeting_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `targeting_categories` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.targeting_keywords
CREATE TABLE IF NOT EXISTS `targeting_keywords` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword` varchar(50) COLLATE utf8_unicode_ci DEFAULT '0',
  `category_id` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.targeting_keywords: ~0 rows (approximately)
/*!40000 ALTER TABLE `targeting_keywords` DISABLE KEYS */;
/*!40000 ALTER TABLE `targeting_keywords` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `ip_address` int(10) unsigned NOT NULL,
  `username` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `salt` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `activation_code` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `forgotten_password_code` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `remember_code` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_on` int(11) unsigned NOT NULL,
  `last_login` int(11) unsigned DEFAULT NULL,
  `active` tinyint(1) unsigned DEFAULT NULL,
  `first_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `company` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.users: ~11 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT IGNORE INTO `users` (`id`, `ip_address`, `username`, `password`, `salt`, `email`, `activation_code`, `forgotten_password_code`, `remember_code`, `created_on`, `last_login`, `active`, `first_name`, `last_name`, `company`, `phone`) VALUES
	(1, 2130706433, 'administrator', '59beecdf7fc966e2f17fd8f65a4a9aeb09d4a3d4', '9462e8eee0', 'admin@admin.com', '', NULL, '9v/teNfe/R', 1268889823, 1463995531, 1, 'Admin', 'istrator', 'ADMINmimi', '0'),
	(2, 1270, 'DoKian', 'gYsYfIX90i4e20d1bbef2bdef551e29b76aab74f', NULL, 'khanhdtn@gmail.com', NULL, NULL, NULL, 1448957515, 1458288041, 1, 'Ki', 'An', 'Orient SoftWare', '0946828093'),
	(3, 1270, 'ngocuyen', '8L.wsk3L/A0264b20fb9f35a0f729b6ed1e8a5cb', NULL, 'ngocuyen@gmail.com', NULL, NULL, NULL, 1450151763, NULL, 1, 'ngoc', 'uyen', 'ConexXus', '01222060705'),
	(4, 1270, 'mi trương', '0bKz3BM8799833837872fefb190f5ec3353307f6', NULL, 'truonghoangmi@gmail.com', NULL, NULL, NULL, 1463388353, 1463994521, 1, 'Mi', 'Trương', 'FPT', '0946828093');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.users_groups
CREATE TABLE IF NOT EXISTS `users_groups` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` mediumint(8) unsigned NOT NULL,
  `group_id` mediumint(8) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.users_groups: ~14 rows (approximately)
/*!40000 ALTER TABLE `users_groups` DISABLE KEYS */;
INSERT IGNORE INTO `users_groups` (`id`, `user_id`, `group_id`) VALUES
	(7, 1, 1),
	(15, 2, 2),
	(16, 3, 3),
	(17, 4, 3);
/*!40000 ALTER TABLE `users_groups` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
