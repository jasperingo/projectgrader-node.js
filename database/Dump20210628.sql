CREATE DATABASE  IF NOT EXISTS `projectgrader` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `projectgrader`;
-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: projectgrader
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `app_admin`
--

DROP TABLE IF EXISTS `app_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_admin` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_admin`
--

LOCK TABLES `app_admin` WRITE;
/*!40000 ALTER TABLE `app_admin` DISABLE KEYS */;
INSERT INTO `app_admin` VALUES (1,'Ifeanyi Paul','$2b$10$Ff0IurMy2c/qrn7vXqpB6.B1Wfx/Q1fgDhyCIokovjp..fEcYW/Yi','2021-06-24 19:56:44'),(2,'Robort Tiny','$2b$10$Ff0IurMy2c/qrn7vXqpB6.B1Wfx/Q1fgDhyCIokovjp..fEcYW/Yi','2021-06-24 19:56:44');
/*!40000 ALTER TABLE `app_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `external_supervisor`
--

DROP TABLE IF EXISTS `external_supervisor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `external_supervisor` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `external_supervisor`
--

LOCK TABLES `external_supervisor` WRITE;
/*!40000 ALTER TABLE `external_supervisor` DISABLE KEYS */;
INSERT INTO `external_supervisor` VALUES (1,'Prof. Patrick Bradford','patrickbrad@gmail.com','$2b$10$Ff0IurMy2c/qrn7vXqpB6.B1Wfx/Q1fgDhyCIokovjp..fEcYW/Yi','2021-06-21 09:27:23'),(2,'Mr. Nelson West','nelswest@yahoo.com','$2b$10$Ff0IurMy2c/qrn7vXqpB6.B1Wfx/Q1fgDhyCIokovjp..fEcYW/Yi','2021-06-21 09:27:23'),(3,'Marker Pen','mpen@rocketmail.com','$2b$10$vXpPG2SB0XJt57tnJY4fKuu9evAq6diuOmloR953MxnmlIA2SY4zO','2021-06-25 23:41:10');
/*!40000 ALTER TABLE `external_supervisor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hod`
--

DROP TABLE IF EXISTS `hod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hod` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `department` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hod`
--

LOCK TABLES `hod` WRITE;
/*!40000 ALTER TABLE `hod` DISABLE KEYS */;
INSERT INTO `hod` VALUES (1,'Prof. Peter Dury','Information Technology','$2b$10$Ff0IurMy2c/qrn7vXqpB6.B1Wfx/Q1fgDhyCIokovjp..fEcYW/Yi','2021-06-21 02:48:46'),(2,'Engr. Solomon Wesley','Computer Science','$2b$10$Ff0IurMy2c/qrn7vXqpB6.B1Wfx/Q1fgDhyCIokovjp..fEcYW/Yi','2021-06-21 02:48:46'),(4,'Prof. Ramson Yam','Software Engineering','$2b$10$Ff0IurMy2c/qrn7vXqpB6.B1Wfx/Q1fgDhyCIokovjp..fEcYW/Yi','2021-06-25 15:17:21'),(5,'Engr. Jellof Rice','Project Managemant Technology','$2b$10$2fR5ZV.6T.Mpksex06QdbutxDL7.pfx1ho9EL6x9a9fDj2qGXysUW','2021-06-25 22:45:44');
/*!40000 ALTER TABLE `hod` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internal_supervisor`
--

DROP TABLE IF EXISTS `internal_supervisor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `internal_supervisor` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internal_supervisor`
--

LOCK TABLES `internal_supervisor` WRITE;
/*!40000 ALTER TABLE `internal_supervisor` DISABLE KEYS */;
INSERT INTO `internal_supervisor` VALUES (1,'Prof. Luke Raymond','lukeray@gmail.com','Information Technology','$2b$10$Ff0IurMy2c/qrn7vXqpB6.B1Wfx/Q1fgDhyCIokovjp..fEcYW/Yi','2021-06-21 09:41:20'),(2,'Engr. Raphael Israel','israelraf@yahoo.com','Information Technology','$2b$10$Ff0IurMy2c/qrn7vXqpB6.B1Wfx/Q1fgDhyCIokovjp..fEcYW/Yi','2021-06-21 09:41:20'),(3,'Mr. John Gab','jg@gmail.com','Information Technology','$2b$10$Ff0IurMy2c/qrn7vXqpB6.B1Wfx/Q1fgDhyCIokovjp..fEcYW/Yi','2021-06-23 06:16:18'),(4,'Mr. Hen Feathers','henf@yahoo.com','Computer Science','$2b$10$gacD/mMGf.sEtRFRRV3XBeSTzgFiLVWbV5BpYcH3abCGwb2ZvjRqG','2021-06-25 23:24:27');
/*!40000 ALTER TABLE `internal_supervisor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `student_id` bigint(20) NOT NULL,
  `internal_supervisor_id` bigint(20) NOT NULL,
  `external_supervisor_id` bigint(20) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `section` varchar(50) NOT NULL,
  `grade_at` datetime DEFAULT NULL,
  `external_score` double DEFAULT NULL,
  `internal_score` double DEFAULT NULL,
  `visitation_score` double DEFAULT NULL,
  `paper_work_score` int(11) DEFAULT NULL,
  `participation_score` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `internal_supervisor_id` (`internal_supervisor_id`),
  KEY `external_supervisor_id` (`external_supervisor_id`),
  CONSTRAINT `project_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  CONSTRAINT `project_ibfk_2` FOREIGN KEY (`internal_supervisor_id`) REFERENCES `internal_supervisor` (`id`),
  CONSTRAINT `project_ibfk_3` FOREIGN KEY (`external_supervisor_id`) REFERENCES `external_supervisor` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (1,1,1,1,'Information Technology','2020/2021','2021-06-28 09:54:49',56,23,90,1,1,'2021-06-21 09:54:49'),(2,2,1,1,'Information Technology','2020/2021','2021-06-28 09:54:49',NULL,NULL,70,1,0,'2021-06-21 09:54:49'),(3,3,1,1,'Information Technology','2020/2021','2021-06-28 09:54:49',NULL,NULL,NULL,NULL,NULL,'2021-06-21 09:54:49'),(4,4,1,1,'Information Technology','2020/2021','2021-06-28 09:54:49',NULL,NULL,NULL,NULL,NULL,'2021-06-21 09:54:49'),(5,5,2,1,'Information Technology','2020/2021','2021-06-28 09:54:49',NULL,NULL,NULL,NULL,NULL,'2021-06-21 09:54:49'),(6,6,2,1,'Information Technology','2020/2021','2021-06-28 09:54:49',NULL,NULL,NULL,NULL,NULL,'2021-06-21 09:54:49'),(7,7,2,1,'Information Technology','2020/2021','2021-06-28 09:54:49',NULL,NULL,NULL,NULL,NULL,'2021-06-21 09:54:49'),(8,8,2,1,'Information Technology','2020/2021','2021-06-28 09:54:49',NULL,NULL,NULL,NULL,NULL,'2021-06-21 09:54:49'),(9,9,1,NULL,'Information Technology','2019/2021',NULL,NULL,NULL,NULL,NULL,NULL,'2020-06-23 01:10:39'),(10,11,3,1,'Information Technology','2020/2021','2021-06-28 09:54:49',NULL,NULL,NULL,NULL,NULL,'2021-06-23 06:18:46'),(11,10,3,1,'Information Technology','2020/2021','2021-06-28 09:54:49',NULL,NULL,NULL,NULL,NULL,'2021-06-23 06:18:46'),(12,12,4,2,'Computer Science','2020/2021','2021-07-02 00:00:00',NULL,NULL,NULL,NULL,NULL,'2021-06-27 03:35:04'),(13,15,4,2,'Computer Science','2020/2021','2021-07-02 00:00:00',NULL,NULL,NULL,NULL,NULL,'2021-06-27 03:35:04');
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('OPO9yHkoRlb2DjH29mh7mRU-6uopVERL',1624920004,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),('eSBbWflwiGpmPh7hOvWLH588tI94Hv8R',1624961979,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),('zn8Q0vAWmYqtVPRDldBC5T5nYJqeEi3_',1625003529,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"user\":{\"type\":\"es\",\"id\":1,\"name\":\"Prof. Patrick Bradford\"}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `matric_number` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1,'Chioma Rice','2015848747x','Information Technology',500,'2021-06-21 02:45:02'),(2,'Peter Rice','201584sd47x','Information Technology',500,'2021-06-21 02:45:02'),(3,'Ben Tony','2015348740x','Information Technology',500,'2021-06-21 02:45:02'),(4,'Austin Gift','2015848000x','Information Technology',500,'2021-06-21 02:45:02'),(5,'Glory Maxwell','2015873447x','Information Technology',500,'2021-06-21 02:45:02'),(6,'James John','2015cj7747x','Information Technology',500,'2021-06-21 02:45:02'),(7,'Paul Smith','20158as984x','Information Technology',500,'2021-06-21 02:45:02'),(8,'Daniel Franklin','201584wew7z','Information Technology',500,'2021-06-21 02:45:02'),(9,'Grace Matt','2016kdk04kdz','Information Technology',500,'2021-06-23 01:10:07'),(10,'Gate Bell','201485ks894z','Information Technology',500,'2021-06-23 06:18:04'),(11,'Alfred Richy','2015837938kz','Information Technology',500,'2021-06-23 06:18:04'),(12,'Red Yellow','2016iek93i0','Computer Science',500,'2021-06-25 17:49:14'),(13,'Bomb Tower','2016kwo33d4','Computer Science',500,'2021-06-27 02:48:36'),(14,'Grape Apple','2015fke9495','Computer Science',500,'2021-06-27 02:49:21'),(15,'Ant Hill','2015830j382','Computer Science',500,'2021-06-27 02:50:16');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-28 23:05:02
