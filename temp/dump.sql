CREATE DATABASE  IF NOT EXISTS `RoomMap` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `RoomMap`;
-- MySQL dump 10.13  Distrib 5.6.13, for Win32 (x86)
--
-- Host: 127.0.0.1    Database: RoomMap
-- ------------------------------------------------------
-- Server version	5.6.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `descriptions`
--

DROP TABLE IF EXISTS `descriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `descriptions` (
  `id_description` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Идентификатор записи',
  `content` text COMMENT 'Текстовое содержимое',
  `last_update` datetime DEFAULT NULL COMMENT 'Дата последнего обновления',
  PRIMARY KEY (`id_description`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `descriptions`
--

LOCK TABLES `descriptions` WRITE;
/*!40000 ALTER TABLE `descriptions` DISABLE KEYS */;
INSERT INTO `descriptions` VALUES (1,'<p style=\"text-align: justify;\"><img alt=\"\" src=\"http://primamedia.ru/f/big/254/253346.jpg\" style=\"width: 200px; height: 133px; float: left; margin-right: 10px; margin-bottom: 10px;\" />Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты.Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президентыКорпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты. Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты. Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты.</p>','0000-00-00 00:00:00'),(2,'<p style=\"text-align: justify;\"><img alt=\"\" src=\"http://primamedia.ru/f/big/254/253346.jpg\" style=\"width: 200px; height: 133px; float: left; margin-right: 10px; margin-bottom: 10px;\" />Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты.Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президентыКорпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты. Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты. Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты.Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты.Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президентыКорпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты. Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты. Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты.Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты.Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президентыКорпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты. Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты. Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты.</p>','0000-00-00 00:00:00'),(3,'Смерть здесь',NULL),(4,'asdf',NULL);
/*!40000 ALTER TABLE `descriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `layers`
--

DROP TABLE IF EXISTS `layers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `layers` (
  `id_layer` int(11) NOT NULL AUTO_INCREMENT,
  `layer_code` varchar(45) DEFAULT NULL COMMENT 'Код для url и папка хранения',
  `layer_name` varchar(100) DEFAULT NULL,
  `layer_description` varchar(200) DEFAULT NULL COMMENT 'Описание слоя в JSON для языков',
  PRIMARY KEY (`id_layer`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='Таблица содержит список слоев';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `layers`
--

LOCK TABLES `layers` WRITE;
/*!40000 ALTER TABLE `layers` DISABLE KEYS */;
INSERT INTO `layers` VALUES (1,'communicate','{\"rus\":\"Коммуникации\",\"eng\":\"Communicate\"}','{\"rus\":\"Слой отображает коммуникации\",\"eng\":\"Layer show the communicate\"}'),(2,'net','{\"rus\":\"Сети\",\"eng\":\"Net\"}','{\"rus\":\"Устройство локальной сети\",\"eng\":\"Structure of local net\"}');
/*!40000 ALTER TABLE `layers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `levels`
--

DROP TABLE IF EXISTS `levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `levels` (
  `id_level` int(11) NOT NULL AUTO_INCREMENT,
  `level_name` varchar(100) DEFAULT NULL,
  `level_description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id_level`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='Таблица уровней';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `levels`
--

LOCK TABLES `levels` WRITE;
/*!40000 ALTER TABLE `levels` DISABLE KEYS */;
INSERT INTO `levels` VALUES (1,'{\"rus\":\"1 этаж\",\"eng\":\"1 floor\"}','{\"rus\":\"1 этаж\",\"eng\":\"1 floor\"}'),(2,'{\"rus\":\"2 этаж\",\"eng\":\"2 floor\"}','{\"rus\":\"2 этаж\",\"eng\":\"2  floor\"}');
/*!40000 ALTER TABLE `levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objects`
--

DROP TABLE IF EXISTS `objects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objects` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Идентификтаор',
  `id_level` int(11) DEFAULT NULL COMMENT 'В какие уровни входит',
  `id_layer` int(11) DEFAULT NULL COMMENT 'К какому слою относится',
  `min_x` float DEFAULT NULL COMMENT 'Нижний левый X квадрата',
  `min_y` float DEFAULT NULL COMMENT 'Нижний левый Y квадрата',
  `max_x` float DEFAULT NULL COMMENT 'Верхний правый X квадрата',
  `max_y` float DEFAULT NULL COMMENT 'Верхний правый Y квадрата',
  `id_title` int(11) DEFAULT NULL COMMENT 'Идентификатор подсказки',
  `id_description` int(11) DEFAULT NULL COMMENT 'Идентификатор описания',
  `content` text COMMENT 'SVG контент',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COMMENT='Таблица объектов SVG';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objects`
--

LOCK TABLES `objects` WRITE;
/*!40000 ALTER TABLE `objects` DISABLE KEYS */;
INSERT INTO `objects` VALUES (1,1,0,394.5,4723.5,603.5,4932.5,1,1,'{\"type\":\"circle\",\"params\":{\"r\":209}}'),(2,1,0,1242,-199,3842,1185,2,2,'{\"type\":\"polygon\",\"params\":{\"points\":[[3842,1185],[1542,1171],[1542,1014],[1242,1014],[1242,85],[1557,85],[1557,-185],[3828,-199]]}}'),(9,1,0,3967,-3518,4375,-3110,3,3,'{\"type\":\"circle\",\"params\":{\"r\":408}}'),(10,1,2,2442,257,3457,728,4,4,'{\"type\":\"polygon\",\"params\":{\"points\":[[2785,714],[3442,728],[3457,614],[3214,257],[2585,300],[2442,728]]}}');
/*!40000 ALTER TABLE `objects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `titles`
--

DROP TABLE IF EXISTS `titles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `titles` (
  `id_title` int(11) NOT NULL AUTO_INCREMENT,
  `title` tinytext COMMENT 'Текст подсказки',
  `last_update` timestamp NULL DEFAULT NULL COMMENT 'Дата последнего обновления',
  PRIMARY KEY (`id_title`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='Подсказки';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `titles`
--

LOCK TABLES `titles` WRITE;
/*!40000 ALTER TABLE `titles` DISABLE KEYS */;
INSERT INTO `titles` VALUES (1,'Это центр поля1','2014-08-31 12:07:35'),(2,'Конференц-зал','2014-08-31 17:09:07'),(3,'Круг смерти','2015-01-06 19:27:32'),(4,'sdaf','2015-01-06 19:43:08');
/*!40000 ALTER TABLE `titles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-01-07  0:12:48
