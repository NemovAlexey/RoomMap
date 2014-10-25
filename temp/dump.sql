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
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Идентификатор записи',
  `id_description` int(11) NOT NULL COMMENT 'Идентификатор описания',
  `id_level` set('1','2','3','4') DEFAULT NULL COMMENT 'Идентификатор уровня',
  `content` text COMMENT 'Текстовое содержимое',
  `last_update` datetime DEFAULT NULL COMMENT 'Дата последнего обновления',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `descriptions`
--

LOCK TABLES `descriptions` WRITE;
/*!40000 ALTER TABLE `descriptions` DISABLE KEYS */;
INSERT INTO `descriptions` VALUES (1,1,'1,2','<p style=\"text-align: justify;\"><img alt=\"\" src=\"http://primamedia.ru/f/big/254/253346.jpg\" style=\"width: 200px; height: 133px; float: left; margin-right: 10px; margin-bottom: 10px;\" />Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты.Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президентыКорпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты. Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты. Корпус №20 Дальневосточного федерального университета (ДВФУ) на острове Русском в период с 6 по 9 сентября станет самым охраняемым местом на территории кампуса. Именно здесь пройдет встреча лидеров экономик АТЭС &ndash; участниц форума АТЭС. Корр. РИА PrimaMedia прошли дорогой, по которой пойдут президенты.</p>','0000-00-00 00:00:00');
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
  `id_levels` set('1','2','3','4') DEFAULT NULL COMMENT 'В какие уровни входит',
  `id_layer` int(11) DEFAULT NULL COMMENT 'К какому слою относится',
  `min_x` float DEFAULT NULL COMMENT 'Нижний левый X квадрата',
  `min_y` float DEFAULT NULL COMMENT 'Нижний левый Y квадрата',
  `max_x` float DEFAULT NULL COMMENT 'Верхний правый X квадрата',
  `max_y` float DEFAULT NULL COMMENT 'Верхний правый Y квадрата',
  `id_title` int(11) DEFAULT NULL COMMENT 'Идентификатор подсказки',
  `id_description` int(11) DEFAULT NULL COMMENT 'Идентификатор описания',
  `content` text COMMENT 'SVG контент',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='Таблица объектов SVG';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objects`
--

LOCK TABLES `objects` WRITE;
/*!40000 ALTER TABLE `objects` DISABLE KEYS */;
INSERT INTO `objects` VALUES (1,'1,2',0,300,4628.57,700,5028.57,1,1,'{\"type\":\"circle\",\"params\": {\"r\":200}}'),(2,'1',0,375,-65,1150,350,2,2,'{\"type\":\"polygon\",\"params\":{\"points\":[[3842.85,1185.71],[1542.85,1185.71],[1542.85,957.14],[1257.14,957.14],[1257.14,28.57],[1542.85,28.57],[1542.85,-199.99],[3842.85,-199.99]]}}');
/*!40000 ALTER TABLE `objects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `titles`
--

DROP TABLE IF EXISTS `titles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `titles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_title` int(11) DEFAULT NULL COMMENT 'Идентификатор подсказки',
  `id_level` set('1','2','3','4') DEFAULT NULL COMMENT 'Идентификатор уровня',
  `title` tinytext COMMENT 'Текст подсказки',
  `last_update` timestamp NULL DEFAULT NULL COMMENT 'Дата последнего обновления',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='Подсказки';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `titles`
--

LOCK TABLES `titles` WRITE;
/*!40000 ALTER TABLE `titles` DISABLE KEYS */;
INSERT INTO `titles` VALUES (1,1,'1','Это центр поля','2014-08-31 12:07:35'),(2,2,'1','Зал заседаний','2014-08-31 17:09:07');
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

-- Dump completed on 2014-10-25 20:57:17
