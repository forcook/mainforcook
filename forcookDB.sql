-- MySQL dump 10.13  Distrib 9.0.1, for macos13.7 (arm64)
--
-- Host: localhost    Database: forcook
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) NOT NULL,
  `category_type` enum('recipe','ingredient') NOT NULL,
  `description` text,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `favorite_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`favorite_id`),
  UNIQUE KEY `user_id` (`user_id`,`recipe_id`),
  KEY `recipe_id` (`recipe_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredients` (
  `ingredient_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category_id` int DEFAULT NULL,
  `nutrition_info` text,
  PRIMARY KEY (`ingredient_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `ingredients_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients`
--

LOCK TABLES `ingredients` WRITE;
/*!40000 ALTER TABLE `ingredients` DISABLE KEYS */;
INSERT INTO `ingredients` VALUES (1,'양파',NULL,NULL),(2,'마늘',NULL,NULL),(3,'불고기',NULL,NULL),(4,'양파',NULL,NULL),(5,'마늘',NULL,NULL),(6,'불고기',NULL,NULL),(7,'양파',NULL,NULL),(8,'마늘',NULL,NULL),(9,'불고기',NULL,NULL),(10,'양파',NULL,NULL),(11,'마늘',NULL,NULL),(12,'불고기',NULL,NULL),(13,'양파',NULL,NULL),(14,'마늘',NULL,NULL),(15,'불고기',NULL,NULL),(16,'양파',NULL,NULL),(17,'마늘',NULL,NULL),(18,'불고기',NULL,NULL),(19,'양파',NULL,NULL),(20,'마늘',NULL,NULL),(21,'불고기',NULL,NULL),(22,'양파',NULL,NULL),(23,'마늘',NULL,NULL),(24,'불고기',NULL,NULL),(25,'양파',NULL,NULL),(26,'마늘',NULL,NULL),(27,'불고기',NULL,NULL),(28,'양파',NULL,NULL),(29,'마늘',NULL,NULL),(30,'불고기',NULL,NULL),(31,'양파',NULL,NULL),(32,'마늘',NULL,NULL),(33,'불고기',NULL,NULL),(34,'불고기',NULL,NULL),(35,'불고기',NULL,NULL),(36,'불고기',NULL,NULL),(37,'불고기',NULL,NULL),(38,'불고기',NULL,NULL),(39,'불고기',NULL,NULL),(40,'양파',NULL,NULL),(41,'마늘',NULL,NULL),(42,'양파',NULL,NULL),(43,'마늘',NULL,NULL),(44,'닭',NULL,NULL),(45,'양파',NULL,NULL),(46,'마늘',NULL,NULL),(47,'고추',NULL,NULL),(48,'양파',NULL,NULL),(49,'불고기',NULL,NULL);
/*!40000 ALTER TABLE `ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_categories`
--

DROP TABLE IF EXISTS `recipe_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_categories` (
  `recipe_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`recipe_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `recipe_categories_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  CONSTRAINT `recipe_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_categories`
--

LOCK TABLES `recipe_categories` WRITE;
/*!40000 ALTER TABLE `recipe_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `recipe_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_ingredients`
--

DROP TABLE IF EXISTS `recipe_ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_ingredients` (
  `recipe_id` int NOT NULL,
  `ingredient_id` int NOT NULL,
  `amount` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`recipe_id`,`ingredient_id`),
  KEY `ingredient_id` (`ingredient_id`),
  CONSTRAINT `recipe_ingredients_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  CONSTRAINT `recipe_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_ingredients`
--

LOCK TABLES `recipe_ingredients` WRITE;
/*!40000 ALTER TABLE `recipe_ingredients` DISABLE KEYS */;
INSERT INTO `recipe_ingredients` VALUES (2,1,NULL),(2,2,NULL),(2,3,NULL),(3,4,NULL),(3,5,NULL),(3,6,NULL),(4,7,NULL),(4,8,NULL),(4,9,NULL),(5,10,NULL),(5,11,NULL),(5,12,NULL),(6,13,NULL),(6,14,NULL),(6,15,NULL),(7,16,NULL),(7,17,NULL),(7,18,NULL),(8,19,NULL),(8,20,NULL),(8,21,NULL),(9,22,NULL),(9,23,NULL),(9,24,NULL),(10,25,NULL),(10,26,NULL),(10,27,NULL),(11,28,NULL),(11,29,NULL),(11,30,NULL),(12,31,NULL),(12,32,NULL),(12,33,NULL),(13,34,NULL),(14,35,NULL),(15,36,NULL),(16,37,NULL),(17,38,NULL),(18,39,NULL),(19,40,NULL),(19,41,NULL),(20,42,NULL),(20,43,NULL),(20,44,NULL),(21,45,NULL),(21,46,NULL),(21,47,NULL),(22,48,NULL),(22,49,NULL);
/*!40000 ALTER TABLE `recipe_ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipes` (
  `recipe_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `steps` text,
  `total_time` int DEFAULT NULL,
  `difficulty` enum('Easy','Medium','Hard') DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `category` enum('meat','vegetarian') NOT NULL,
  PRIMARY KEY (`recipe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
INSERT INTO `recipes` VALUES (1,'불고기볶음',NULL,'재료 준비\r\n재료 조리\r\n요리 시작\r\n요리 끝',31,'Easy',NULL,'meat'),(2,'불고기볶음',NULL,'조리 한다\r\n요리 한다\r\n완성시킨다',31,'Easy',NULL,'meat'),(3,'불고기볶음',NULL,'조리 한다\r\n요리 한다\r\n완성시킨다',31,'Easy',NULL,'meat'),(4,'불고기볶음',NULL,'조리 한다\r\n요리 한다\r\n완성시킨다',31,'Easy',NULL,'meat'),(5,'불고기볶음',NULL,'조리 한다\r\n요리 한다\r\n완성시킨다',31,'Easy',NULL,'meat'),(6,'불고기볶음',NULL,'조리 한다\r\n요리 한다\r\n완성시킨다',31,'Easy',NULL,'meat'),(7,'불고기볶음',NULL,'조리 한다\r\n요리 한다\r\n완성시킨다',31,'Easy',NULL,'meat'),(8,'불고기볶음',NULL,'조리 한다\r\n요리 한다\r\n완성시킨다',31,'Easy',NULL,'meat'),(9,'불고기볶음',NULL,'조리 한다\r\n요리 한다\r\n완성시킨다',31,'Easy',NULL,'meat'),(10,'불고기볶음',NULL,'조리 한다\r\n요리 한다\r\n완성시킨다',31,'Easy',NULL,'meat'),(11,'불고기볶음',NULL,'조리 한다\r\n요리 한다\r\n완성시킨다',31,'Easy',NULL,'meat'),(12,'불고기볶음',NULL,'조리 한다\r\n요리 한다\r\n완성시킨다',31,'Easy',NULL,'meat'),(13,'불고기볶음',NULL,'섞는다\r\n요리한다\r\n완성',31,'Easy','1731587450811.jpg','meat'),(14,'불고기볶음',NULL,'섞는다\r\n요리한다\r\n완성',31,'Easy','1731587455144.jpg','meat'),(15,'불고기볶음',NULL,'섞는다\r\n요리한다\r\n완성',31,'Easy','1731587455567.jpg','meat'),(16,'불고기볶음',NULL,'섞는다\r\n요리한다\r\n완성',31,'Easy','1731587455734.jpg','meat'),(17,'불고기볶음',NULL,'섞는다\r\n요리한다\r\n완성',31,'Easy','1731587455890.jpg','meat'),(18,'불고기볶음',NULL,'섞는다\r\n요리한다\r\n완성',31,'Easy','1731587474417.jpg','meat'),(19,'불고기볶음',NULL,'1\r\n2\r\n3\r\n',31,'Easy','1731587847757.jpg','meat'),(20,'닭고기요리','닭고기 요리로 닭을 볶은 요리다','재료 준비\r\n재료 손질\r\n요리',31,'Easy','1731590000863.jpg','meat'),(21,'테스트1','테스트 요리 입닌다','테스트1\r\n테스트2\r\n테스트3',31,'Medium','1731590621627.jpg','meat'),(22,'테스트2','123412412','12123123\r\n41224124\r\n\r\n412241',31,'Medium','1731591116053.jpg','meat');
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_search_history`
--

DROP TABLE IF EXISTS `user_search_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_search_history` (
  `search_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `search_term` varchar(100) DEFAULT NULL,
  `search_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`search_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_search_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_search_history`
--

LOCK TABLES `user_search_history` WRITE;
/*!40000 ALTER TABLE `user_search_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_search_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'엄요준','$2a$12$waB/djp3lEdwek6JT3LI4e5q4BjZNSHw6YjGEQZsSk0j.iODnhWeK','dydy8899@naver.com','2024-11-14 12:16:07');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-15 19:04:40
