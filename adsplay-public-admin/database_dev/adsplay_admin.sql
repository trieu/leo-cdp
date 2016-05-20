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
	(1009, 'hyhyhyhy', 'Nội dung kaka', 1),
	(1010, 'ftyt', 'du khong ai', 6),
	(1011, 'mimi', 'With the CSS code given above, you\'re now on your way to creating your 2-column website. You may also wish to check out the CSS navigation menu bar wizard as well, if you wish to add a CSS-driven navigation menu bar to your side panel that has mouse-over hover effects.Copyright © 2008-2014 by Christopher Heng. All rights reserved.', 2),
	(1012, 'jyjyjyjy', 'Chúng tôi mới nghe nói đối tác đặt lời mời và phải xem lịch trình như thế nào, có phù hợp hay không. Bên cạnh đó, chúng tôi cũng phải xem xét các điều khoản trong hợp đồng rồi mới có thể quyết định”, ông Nguyễn Tấn Anh, Trưởng đoàn bóng đá HAGL tiết lộ', 5),
	(1013, 'Công Phượng được mời', '<p class="Normal" style="text-align: justify; margin-bottom: 1em; padding: 0px; line-height: 18px; text-rendering: geometricprecision; font-family: arial; font-size: 14px;"><span style="margin: 0px; padding: 0px;"><b><strike>Chúng tôi mới nghe nói đối tác đặt lời mời và phải xem lịch trình như thế nào, có phù hợp hay không. Bên cạnh đó, chúng tôi cũng phải xem xét các điều khoản trong hợp đồng rồi mới có thể quyết định”, ông Nguyễn Tấn Anh, Trưởng đoàn bóng đá HAGL tiết lộ.</strike></b></span></p><p class="Normal" style="text-align: justify; margin-bottom: 1em; padding: 0px; line-height: 18px; text-rendering: geometricprecision; font-family: arial; font-size: 14px;"><b><strike><span style="margin: 0px; padding: 0px;">Đối tác mời Công Phượng đến Anh trong thời gian diễn ra sự kiện từ ngày 9/11 đến 11/11.&nbsp;</span><span style="margin: 0px; padding: 0px;">Nếu chuyến đi được thực hiện, Công Phượng sẽ song hành cùng Cristiano Ronaldo trong suốt sự kiện. Anh sẽ được thăm quan sân Old Trafford và Man Utd, CLB cũ của siêu sao đang khoác áo Real Madrid.</span></strike></b></p>', 2),
	(1014, 'hahahmiyh', 'hrhrhrmimimi', 5),
	(1015, 'ádf', 'àd', 2),
	(1016, 'Đại hội Đảng XII họp', '<div style="text-align: center;"><span style="font-family: arial; line-height: 18px;"><b><font size="3">Diễn ra từ ngày 20 đến 28/1, Đại hội Đảng lần thứ 12 họp phiên trù bị trong ngày đầu tiên và khai mạc chính thức ngày tiếp sau.</font></b></span></div>', 2),
	(1017, 'hahaha', '<p>ouyouyio</p>', 2),
	(1018, 'kain', '<ul style="margin-top:0pt;margin-bottom:0pt;"><li dir="ltr" style="list-style-type:disc;font-size:24px;font-family:Average;color:#CACACA;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:24px;font-family:Average;color:#CACACA;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">"</span><span style="font-size:24px;font-family:Average;color:#00FF00;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">MEAN</span><span style="font-size:24px;font-family:Average;color:#CACACA;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">" stands for "MongoDB Express.js AngularJS Node.js"</span></p></li><ul style="margin-top:0pt;margin-bottom:0pt;"><li dir="ltr" style="list-style-type:circle;font-size:18.666666666666664px;font-family:Average;color:#CACACA;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:24px;font-family:Average;color:#00FF00;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">M</span><span style="font-size:24px;font-family:Average;color:#CACACA;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">ongoDB as NoSQL &nbsp;database layer</span></p></li><li dir="ltr" style="list-style-type:circle;font-size:24px;font-family:Average;color:#CACACA;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:24px;font-family:Average;color:#00FF00;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">E</span><span style="font-size:24px;font-family:Average;color:#CACACA;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">xpress.js as &nbsp;minimal and flexible web application framework</span></p></li><li dir="ltr" style="list-style-type:circle;font-size:24px;font-family:Average;color:#CACACA;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:16pt;"><span style="font-size:24px;font-family:Average;color:#00FF00;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">A</span><span style="font-size:24px;font-family:Average;color:#CACACA;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre-wrap;">ngular.js for client-side front-end framework</span></p></li></ul></ul><p><span id="docs-internal-guid-18de6210-2b09-1e0d-c005-acc9e169312d"><span style="font-size: 24px; font-family: Average; color: rgb(0, 255, 0); font-weight: 700; vertical-align: baseline; white-space: pre-wrap; background-color: transparent;">N</span><span style="font-size: 24px; font-family: Average; color: rgb(202, 202, 202); vertical-align: baseline; white-space: pre-wrap; background-color: transparent;">ode.js as lightweight web server 123</span></span><br></p>', 2),
	(1019, 'fghfhf', '<p>fghfhfh</p>', 1),
	(1020, 'yyhhyh', '<p>dfggfg</p>', 1),
	(1021, 'df', '<p><br></p>', 8),
	(1022, 'DTNK', '<blockquote><ol><li>Let\'s get started by making a Rails app for a personal website. We\'ll explain each step in the next exercise.123456<br></li></ol></blockquote>', 5),
	(1023, 'pé mi', 'happy', 2),
	(1024, 'test', '', 1);
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
	(1, 'Pepsi123', 0, '0000-00-00 00:00:00'),
	(2, 'SusuKi', 0, '0000-00-00 00:00:00'),
	(3, 'Omo', 0, '0000-00-00 00:00:00'),
	(6, 'Sunsilk', 0, '0000-00-00 00:00:00');
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

-- Dumping data for table adsplay_admin.campaigns: ~5 rows (approximately)
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
INSERT IGNORE INTO `campaigns` (`id`, `campaign_name`, `brand_id`, `unit_title`, `product_id`, `sector_id`, `date_created`, `user_id`) VALUES
	(1, 'Pepsi Tet ', 2, 'gaga', 3, 1, '2015-08-25 14:59:38', 1),
	(2, 'Omo Lauching 2015', 2, 'haha', 2, 1, '2015-08-25 14:59:57', 1),
	(3, '7up Summer 123', 2, 'lala', 2, 2, '2015-08-26 11:53:24', 1),
	(4, 'Oppo Son Tung MT-P', 4, 'nana', 3, 4, '2015-08-26 11:53:22', 1),
	(19, 'test1', 1, 'test', 1, 1, NULL, 1),
	(20, 'Collapsible Lists', 3, 'uiui', 3, 3, '2016-05-19 06:08:07', 0),
	(21, 'Campaigns Pepsi light', 2, 'yuy', 2, 0, '2016-05-19 06:08:47', 0);
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

-- Dumping data for table adsplay_admin.groups: ~4 rows (approximately)
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

-- Dumping data for table adsplay_admin.media_files: ~5 rows (approximately)
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

-- Dumping data for table adsplay_admin.products: ~8 rows (approximately)
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT IGNORE INTO `products` (`id`, `product_name`, `brand_id`, `date_created`) VALUES
	(2, 'Instant noodle', 3, '0000-00-00 00:00:00'),
	(3, 'Condom', 6, '0000-00-00 00:00:00'),
	(4, 'Motor bike', 3, '0000-00-00 00:00:00'),
	(13, 'hhhhhhuuuuuuu', 3, '0000-00-00 00:00:00'),
	(15, 'Beer123', 3, '0000-00-00 00:00:00'),
	(16, 'hhhhhhhmimi123', 2, '0000-00-00 00:00:00'),
	(17, 'mimi', 3, '0000-00-00 00:00:00');
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
	(1014, 'Nhạc Số', 'http://nhacso.net/', 'Ban Dự Án FPT', 1),
	(1015, 'FPT Play', 'https://fptplay.net/', 'FPT Play', 5),
	(1016, 'FShare', 'https://www.fshare.v', 'Chia sẽ file', 2),
	(1017, 'test', 'http://test.com/', 'Test', 6),
	(1019, 'Dầu Dừa Xanh', 'http://dauduaxanh.co', 'Dầu dừa Bến Tre Nguyên Chất', 1),
	(1026, 'ggggggggggg', '', '', 1),
	(1027, 'ád', 'adsa', '', 1);
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
	(3, 'gtgtgtgtkian', 3, '0000-00-00 00:00:00'),
	(4, 'miyyyyiuiuiu', 4, '0000-00-00 00:00:00'),
	(5, 'Mobile devices', 15, '2015-08-26 11:52:41'),
	(23, 'testsector123456', 3, '0000-00-00 00:00:00'),
	(24, 'hyhyhyhyhy', 13, '0000-00-00 00:00:00'),
	(25, 'gtgtgtgt', 3, '0000-00-00 00:00:00'),
	(26, 'thu', 4, '0000-00-00 00:00:00'),
	(28, 'gagagaaga', 16, '0000-00-00 00:00:00');
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

-- Dumping data for table adsplay_admin.users: ~10 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT IGNORE INTO `users` (`id`, `ip_address`, `username`, `password`, `salt`, `email`, `activation_code`, `forgotten_password_code`, `remember_code`, `created_on`, `last_login`, `active`, `first_name`, `last_name`, `company`, `phone`) VALUES
	(1, 2130706433, 'administrator', '59beecdf7fc966e2f17fd8f65a4a9aeb09d4a3d4', '9462e8eee0', 'admin@admin.com', '', NULL, '9v/teNfe/R', 1268889823, 1463736213, 1, 'Admin', 'istrator', 'ADMINmimi', '0'),
	(5, 1270, 'DoKian', 'gYsYfIX90i4e20d1bbef2bdef551e29b76aab74f', NULL, 'khanhdtn@gmail.com', NULL, NULL, NULL, 1448957515, 1458288041, 1, 'Ki', 'An', 'Orient SoftWare', '0946828093'),
	(6, 1270, 'ngocuyen', '8L.wsk3L/A0264b20fb9f35a0f729b6ed1e8a5cb', NULL, 'ngocuyen@gmail.com', NULL, NULL, NULL, 1450151763, NULL, 1, 'ngoc', 'uyen', 'ConexXus', '01222060705'),
	(7, 1270, 'hhhuhu', 'nhxHnO/9ny60b1acd8884357ab6fc95f1249f1d3', NULL, 'ttt@gmail.com', NULL, NULL, NULL, 1452570861, NULL, 1, 'á', 'á', 'á', '345453453345'),
	(8, 1270, 'tttttt', 'Ql/IDbrT5h6987ea3b00814e70ad150b63e27e5e', NULL, 'yyyy@gmail.com', NULL, NULL, NULL, 1452571483, NULL, 1, 'ads', 'Aád', 'ád', '56564654645'),
	(9, 1270, 'admin', '$2y$08$WNvx3/LxT4yCR.QnpxJJkOPgsz1poGuWv', NULL, 'truongmi@mith.com', NULL, NULL, NULL, 1461642108, NULL, 1, 'Truong', 'Mi', NULL, NULL),
	(10, 1270, 'mithkian', 'ubjToZV5Go4ba618edc9535f2ce976fbb85b9910', NULL, 'mithkian@gmail.com', NULL, NULL, NULL, 1461666870, NULL, 1, 'MIMI', 'haha', 'FPT', '0961234567'),
	(11, 1270, 'kian tran', 'IMbbRJfpQnad2b03be8304945cd4e1d9d40de545', NULL, 'kiantran@gmail.com', NULL, NULL, NULL, 1462333002, NULL, 1, 'kian', 'tran', 'orient', '0946828093'),
	(12, 1270, 'khoi anh', 'qYniPQtRt6666445eeba4a1f1ea267ad8b33a59f', NULL, 'khoianh@gmail.com', NULL, NULL, NULL, 1462509766, NULL, 1, 'khoi', 'anh', 'FPT', '0123456789'),
	(13, 1270, 'mi trương', '0bKz3BM8799833837872fefb190f5ec3353307f6', NULL, 'truonghoangmi@gmail.com', NULL, NULL, NULL, 1463388353, 1463468088, 1, 'Mi', 'Trương', 'FPT', '0946828093'),
	(14, 1270, 'fgd dfg', 'tdEJ3RyRsS9a4b66f004295cb5d2839e52a18be4', NULL, 'trttr@gmail.com', NULL, NULL, NULL, 1463474044, NULL, 1, 'fgd', 'dfg', 'gggg', '1234567890');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;


-- Dumping structure for table adsplay_admin.users_groups
CREATE TABLE IF NOT EXISTS `users_groups` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` mediumint(8) unsigned NOT NULL,
  `group_id` mediumint(8) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table adsplay_admin.users_groups: ~11 rows (approximately)
/*!40000 ALTER TABLE `users_groups` DISABLE KEYS */;
INSERT IGNORE INTO `users_groups` (`id`, `user_id`, `group_id`) VALUES
	(7, 2, 2),
	(15, 5, 3),
	(16, 6, 1),
	(17, 6, 2),
	(18, 7, 1),
	(19, 8, 1),
	(20, 9, 1),
	(21, 10, 2),
	(26, 1, 1),
	(27, 1, 2),
	(28, 11, 3),
	(29, 12, 3),
	(30, 13, 3),
	(31, 14, 3);
/*!40000 ALTER TABLE `users_groups` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
