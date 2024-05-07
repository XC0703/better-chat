/*
 Navicat Premium Data Transfer

 Source Server         : MySQL
 Source Server Type    : MySQL
 Source Server Version : 80029
 Source Host           : localhost:3306
 Source Schema         : better-chat

 Target Server Type    : MySQL
 Target Server Version : 80029
 File Encoding         : 65001

 Date: 07/05/2024 22:04:47
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for friend
-- ----------------------------
DROP TABLE IF EXISTS `friend`;
CREATE TABLE `friend`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '好友ID，主键，自动创建',
  `user_id` int(0) NOT NULL COMMENT '所属用户ID',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '好友用户名',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '好友头像',
  `online_status` enum('online','offline') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'offline' COMMENT '好友在线状态，可选值为’online‘和’offline‘',
  `remark` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '好友备注',
  `group_id` int(0) NULL DEFAULT NULL COMMENT '好友所属分组ID，外键（与friend_group表的id字段）',
  `room` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '好友所在房间号',
  `unread_msg_count` int(0) NULL DEFAULT 0 COMMENT '好友未读消息数量',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间，自动创建',
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间，自动创建',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_group_id`(`group_id`) USING BTREE,
  CONSTRAINT `friend_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `friend_group` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of friend
-- ----------------------------
INSERT INTO `friend` VALUES (1, 3, 'polars', 'https://ui-avatars.com/api/?name=polars', 'online', 'polars', 5, '37620173-0c8e-4c8b-85ce-a03103b28f55', 0, '2023-08-15 23:32:10', '2024-04-28 22:39:34');
INSERT INTO `friend` VALUES (2, 1, 'xcgogogo', 'https://ui-avatars.com/api/?name=xcgogogo', 'online', 'xcgogogo', 3, '37620173-0c8e-4c8b-85ce-a03103b28f55', 0, '2023-08-15 23:32:10', '2024-04-28 21:11:37');
INSERT INTO `friend` VALUES (3, 2, 'scuyyds', 'https://ui-avatars.com/api/?name=scuyyds', 'online', 'scuyyds', 1, 'b8f59603-66bd-4af3-9e59-7c5938e48e0f', 0, '2023-08-15 23:32:55', '2024-04-28 22:39:59');
INSERT INTO `friend` VALUES (4, 1, 'xcgogogo', 'https://ui-avatars.com/api/?name=xcgogogo', 'online', 'xcgogogo', 2, 'b8f59603-66bd-4af3-9e59-7c5938e48e0f', 0, '2023-08-15 23:32:55', '2024-04-28 21:11:37');
INSERT INTO `friend` VALUES (5, 4, 'js', 'https://ui-avatars.com/api/?name=js', 'offline', 'js嘻嘻嘻', 7, 'e240f937-6478-4eec-9384-293e163550d5', 0, '2023-08-15 23:33:55', '2024-04-28 21:10:44');
INSERT INTO `friend` VALUES (6, 1, 'xcgogogo', 'https://ui-avatars.com/api/?name=xcgogogo', 'online', 'xcgogogo', 4, 'e240f937-6478-4eec-9384-293e163550d5', 0, '2023-08-15 23:33:55', '2024-04-28 21:11:37');
INSERT INTO `friend` VALUES (7, 1, 'xcgogogo', 'https://ui-avatars.com/api/?name=xcgogogo', 'online', 'xcgogogo', 6, '361a259a-0de8-40b5-8343-a60e03dc3ff4', 0, '2023-08-15 23:39:24', '2024-04-28 21:11:37');
INSERT INTO `friend` VALUES (8, 5, 'java', 'https://ui-avatars.com/api/?name=java', 'online', 'java', 1, '361a259a-0de8-40b5-8343-a60e03dc3ff4', 0, '2023-08-15 23:39:24', '2024-04-28 21:03:17');
INSERT INTO `friend` VALUES (9, 6, 'hello', 'https://ui-avatars.com/api/?name=hello', 'offline', 'hello', 5, 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 0, '2024-04-08 00:41:07', '2024-04-08 17:33:33');
INSERT INTO `friend` VALUES (10, 1, 'xcgogogo', 'https://ui-avatars.com/api/?name=xcgogogo', 'online', 'xcgogogo', 8, 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 0, '2024-04-08 00:41:07', '2024-04-28 21:11:37');
INSERT INTO `friend` VALUES (11, 5, 'java', 'https://ui-avatars.com/api/?name=java', 'online', 'java', 8, '7e2a6939-7db8-4d96-ad2d-1f8aa7be9cd8', 0, '2024-04-08 17:20:11', '2024-04-28 21:03:17');
INSERT INTO `friend` VALUES (12, 6, 'hello', 'https://ui-avatars.com/api/?name=hello', 'offline', 'hello', 6, '7e2a6939-7db8-4d96-ad2d-1f8aa7be9cd8', 0, '2024-04-08 17:20:11', '2024-04-08 17:33:33');
INSERT INTO `friend` VALUES (13, 5, 'java', 'https://ui-avatars.com/api/?name=java', 'online', 'java', 3, '810c8bf5-a0de-4e95-801b-2f5c86519320', 0, '2024-04-24 11:01:48', '2024-04-28 21:03:17');
INSERT INTO `friend` VALUES (14, 3, 'polars', 'https://ui-avatars.com/api/?name=polars', 'online', 'polars', 6, '810c8bf5-a0de-4e95-801b-2f5c86519320', 0, '2024-04-24 11:01:48', '2024-04-28 22:39:34');
INSERT INTO `friend` VALUES (15, 8, 'jsyyds', 'https://ui-avatars.com/api/?name=jsyyds', 'offline', 'jsyyds', 1, 'caa4d89c-0195-4f5d-9a60-b3ccdb8acf7c', 0, '2024-04-28 23:05:13', '2024-04-28 23:11:27');
INSERT INTO `friend` VALUES (16, 1, 'xcgogogo', '/uploads/image/cq9dOvGaIzgknpRNFJkCEu7q1tU3aeBu.jpeg', 'online', 'xcgogogo', 10, 'caa4d89c-0195-4f5d-9a60-b3ccdb8acf7c', 0, '2024-04-28 23:05:13', '2024-04-28 23:05:13');

-- ----------------------------
-- Table structure for friend_group
-- ----------------------------
DROP TABLE IF EXISTS `friend_group`;
CREATE TABLE `friend_group`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '好友分组ID，主键，自动创建',
  `user_id` int(0) NOT NULL COMMENT '所属用户ID，外键（与user表的id字段）',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '所属用户名',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '好友分组名称',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间，自动创建',
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间，自动创建',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id`) USING BTREE,
  CONSTRAINT `friend_group_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of friend_group
-- ----------------------------
INSERT INTO `friend_group` VALUES (1, 1, 'xcgogogo', '我的好友', '2023-08-15 23:29:49', '2023-08-15 23:29:49');
INSERT INTO `friend_group` VALUES (2, 2, 'scuyyds', '我的好友', '2023-08-15 23:30:20', '2023-08-15 23:30:20');
INSERT INTO `friend_group` VALUES (3, 3, 'polars', '我的好友', '2023-08-15 23:30:42', '2023-08-15 23:30:42');
INSERT INTO `friend_group` VALUES (4, 4, 'js', '我的好友', '2023-08-15 23:31:28', '2023-08-15 23:31:28');
INSERT INTO `friend_group` VALUES (5, 1, 'xcgogogo', '家人', '2023-08-15 23:38:30', '2023-08-15 23:38:30');
INSERT INTO `friend_group` VALUES (6, 5, 'java', '我的好友', '2023-08-15 23:39:03', '2023-08-15 23:39:03');
INSERT INTO `friend_group` VALUES (7, 1, 'xcgogogo', '无所谓', '2024-04-04 13:27:09', '2024-04-04 13:27:09');
INSERT INTO `friend_group` VALUES (8, 6, 'hello', '我的好友', '2024-04-07 16:33:52', '2024-04-07 16:33:52');
INSERT INTO `friend_group` VALUES (9, 7, 'ok', '我的好友', '2024-04-08 14:52:30', '2024-04-08 14:52:30');
INSERT INTO `friend_group` VALUES (10, 8, 'jsyyds', '我的好友', '2024-04-28 23:04:20', '2024-04-28 23:04:20');

-- ----------------------------
-- Table structure for group_chat
-- ----------------------------
DROP TABLE IF EXISTS `group_chat`;
CREATE TABLE `group_chat`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '群聊ID，主键，自动创建',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '群聊名称',
  `creator_id` int(0) NOT NULL COMMENT '创建者ID，外键（与user表的id字段）',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '群聊头像',
  `announcement` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '群公告',
  `room` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '群聊所在房间号',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间，自动创建',
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间，自动创建',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_creator_id`(`creator_id`) USING BTREE,
  CONSTRAINT `group_chat_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of group_chat
-- ----------------------------
INSERT INTO `group_chat` VALUES (1, '2222', 1, '/uploads/image/1jXXLGjAQBo9jEUlh6SPJMed937W6l2W.jpg', NULL, '9f1cb5ab-f37a-4017-8f71-478a3011f937', '2023-12-05 16:14:53', '2024-04-28 14:31:50');
INSERT INTO `group_chat` VALUES (2, '2222', 1, '/uploads/image/2L04FDI3euF8kL8tXyXHSh64xZoCv5pM.jpg', NULL, '04fad2cb-f255-46de-9da3-94733c9475b5', '2023-12-05 16:21:07', '2024-04-28 14:32:52');
INSERT INTO `group_chat` VALUES (3, '这是我的群', 1, '/uploads/image/2L04FDI3euF8kL8tXyXHSh64xZoCv5pM.jpg', '大家好才是真的好', '7213222d-e77f-429c-b410-083f155e89f3', '2023-12-05 19:41:33', '2024-04-28 14:32:54');
INSERT INTO `group_chat` VALUES (4, '这是我的群', 1, '/uploads/image/03EWxrtFRDgHIJdHSq7jXrQFfcZtj5Hm.png', '大家好才是真的好', 'a544b218-e311-456b-923c-355d940db95d', '2023-12-05 19:42:16', '2024-04-28 14:34:09');
INSERT INTO `group_chat` VALUES (5, '这是我的群', 1, '/uploads/image/2L04FDI3euF8kL8tXyXHSh64xZoCv5pM.jpg', '大家好才是真的好', 'ae845515-431f-4bb7-b48d-f84db284dcff', '2023-12-05 19:43:52', '2024-04-28 14:37:51');
INSERT INTO `group_chat` VALUES (6, '测试群', 1, '/uploads/image/5RM5zahMejgeJ4p23FyPtJb31oM5y0VY.jpg', '大家好才是真的好', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', '2023-12-05 19:44:56', '2024-04-28 14:40:20');
INSERT INTO `group_chat` VALUES (7, '这我群', 1, '/uploads/image/3zprt31SKEc2T1U6K8GzJFgPIBoXieOQ.jpg', '你好', 'c888419b-c04c-4fe6-873c-a42811984b6c', '2023-12-05 19:47:07', '2024-04-28 14:35:58');
INSERT INTO `group_chat` VALUES (8, '啊啊', 1, '/uploads/image/03EWxrtFRDgHIJdHSq7jXrQFfcZtj5Hm.png', '11212', '1dafde19-0820-42ae-8de2-9494ab3e9e52', '2023-12-05 19:48:20', '2024-04-28 14:34:51');
INSERT INTO `group_chat` VALUES (9, '1111', 1, '/uploads/image/03EWxrtFRDgHIJdHSq7jXrQFfcZtj5Hm.png', NULL, '9143e6d8-f02d-4d04-98b2-30b59c2d5aae', '2023-12-05 19:49:26', '2024-04-28 14:34:45');
INSERT INTO `group_chat` VALUES (10, '111212', 1, '/uploads/image/03EWxrtFRDgHIJdHSq7jXrQFfcZtj5Hm.png', NULL, 'c2b60254-afd3-4eeb-81f0-347834fa5488', '2023-12-05 19:52:02', '2024-04-28 14:34:43');
INSERT INTO `group_chat` VALUES (11, '111212', 1, '/uploads/image/03EWxrtFRDgHIJdHSq7jXrQFfcZtj5Hm.png', NULL, 'c7be605f-045f-4de6-ad92-84f303405c0c', '2023-12-05 19:52:49', '2024-04-28 14:34:41');
INSERT INTO `group_chat` VALUES (12, '新群', 1, '/uploads/image/5RM5zahMejgeJ4p23FyPtJb31oM5y0VY.jpg', NULL, '8cb9ab80-b7fc-4e81-a49b-582bb27e234b', '2023-12-05 22:45:06', '2024-04-28 14:36:52');
INSERT INTO `group_chat` VALUES (13, '2024顺利', 1, '/uploads/image/03EWxrtFRDgHIJdHSq7jXrQFfcZtj5Hm.png', '希望新的一年顺顺利利的', 'a33332a3-2426-4543-ae65-4bf2c660dbac', '2023-12-22 14:31:08', '2024-04-28 14:34:39');
INSERT INTO `group_chat` VALUES (14, '群群群', 1, '/uploads/image/3zprt31SKEc2T1U6K8GzJFgPIBoXieOQ.jpg', '呵呵呵呵', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', '2023-12-22 14:53:39', '2024-04-28 14:35:54');
INSERT INTO `group_chat` VALUES (15, '额的胡', 1, '/uploads/image/03EWxrtFRDgHIJdHSq7jXrQFfcZtj5Hm.png', NULL, '03163f39-5bd2-4b0f-aaa1-a88ba2a0858f', '2023-12-22 14:59:16', '2024-04-28 14:34:36');
INSERT INTO `group_chat` VALUES (16, '喂喂喂', 1, '/uploads/image/03EWxrtFRDgHIJdHSq7jXrQFfcZtj5Hm.png', NULL, '0648b855-141a-4a4b-bf91-e3b295fafc1a', '2023-12-22 15:00:11', '2024-04-28 14:34:32');
INSERT INTO `group_chat` VALUES (17, '2323', 1, '/uploads/image/03EWxrtFRDgHIJdHSq7jXrQFfcZtj5Hm.png', NULL, '31ca86d2-bee2-45e6-b991-a43d563ab44c', '2023-12-22 15:00:48', '2024-04-28 14:34:30');
INSERT INTO `group_chat` VALUES (18, '鸡哥粉丝群', 1, '/uploads/image/v660HpPxy0dyrTbZ6J7T6B5X6xC4seJg.jpeg', '姬霓太美', '47695eb7-358f-4206-99a8-67b14b405f74', '2024-04-09 00:25:12', '2024-04-09 00:25:12');

-- ----------------------------
-- Table structure for group_members
-- ----------------------------
DROP TABLE IF EXISTS `group_members`;
CREATE TABLE `group_members`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '群聊成员ID，主键，自动创建',
  `group_id` int(0) NOT NULL COMMENT '群聊ID，外键（与group_chat表的id字段）',
  `user_id` int(0) NOT NULL,
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id`) USING BTREE,
  INDEX `idx_group_id`(`group_id`) USING BTREE,
  CONSTRAINT `group_members_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `group_chat` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 38 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of group_members
-- ----------------------------
INSERT INTO `group_members` VALUES (1, 6, 1, 'xcgogogo', '2023-12-05 19:44:56', '2023-12-05 19:44:56');
INSERT INTO `group_members` VALUES (2, 7, 1, 'xcgogogo', '2023-12-05 19:47:07', '2023-12-05 19:47:07');
INSERT INTO `group_members` VALUES (3, 8, 3, 'polars', '2023-12-05 19:48:20', '2023-12-05 19:48:20');
INSERT INTO `group_members` VALUES (4, 8, 1, 'xcgogogo', '2023-12-05 19:48:20', '2023-12-05 19:48:20');
INSERT INTO `group_members` VALUES (5, 9, 3, 'polars', '2023-12-05 19:49:26', '2023-12-05 19:49:26');
INSERT INTO `group_members` VALUES (6, 9, 1, 'xcgogogo', '2023-12-05 19:49:26', '2023-12-05 19:49:26');
INSERT INTO `group_members` VALUES (7, 10, 3, 'polars', '2023-12-05 19:52:02', '2023-12-05 19:52:02');
INSERT INTO `group_members` VALUES (8, 10, 1, 'xcgogogo', '2023-12-05 19:52:02', '2023-12-05 19:52:02');
INSERT INTO `group_members` VALUES (9, 11, 3, 'polars', '2023-12-05 19:52:49', '2023-12-05 19:52:49');
INSERT INTO `group_members` VALUES (10, 11, 1, 'xcgogogo', '2023-12-05 19:52:49', '2023-12-05 19:52:49');
INSERT INTO `group_members` VALUES (11, 12, 5, 'java', '2023-12-05 22:45:06', '2023-12-05 22:45:06');
INSERT INTO `group_members` VALUES (12, 12, 4, 'js', '2023-12-05 22:45:06', '2023-12-05 22:45:06');
INSERT INTO `group_members` VALUES (13, 12, 3, 'polars', '2023-12-05 22:45:06', '2023-12-05 22:45:06');
INSERT INTO `group_members` VALUES (14, 12, 1, 'xcgogogo', '2023-12-05 22:45:06', '2023-12-05 22:45:06');
INSERT INTO `group_members` VALUES (15, 10, 5, 'java', '2023-12-22 13:14:36', '2023-12-22 13:14:36');
INSERT INTO `group_members` VALUES (16, 6, 5, 'java', '2023-12-22 13:15:01', '2023-12-22 13:15:01');
INSERT INTO `group_members` VALUES (17, 4, 1, 'xcgogogo', '2023-12-22 13:54:09', '2023-12-22 13:54:09');
INSERT INTO `group_members` VALUES (18, 5, 1, 'xcgogogo', '2023-12-22 13:55:40', '2023-12-22 13:55:40');
INSERT INTO `group_members` VALUES (19, 3, 1, 'xcgogogo', '2023-12-22 14:00:39', '2023-12-22 14:00:39');
INSERT INTO `group_members` VALUES (20, 13, 4, 'js', '2023-12-22 14:31:08', '2023-12-22 14:31:08');
INSERT INTO `group_members` VALUES (21, 13, 1, 'xcgogogo', '2023-12-22 14:31:08', '2023-12-22 14:31:08');
INSERT INTO `group_members` VALUES (22, 14, 5, 'java', '2023-12-22 14:53:39', '2023-12-22 14:53:39');
INSERT INTO `group_members` VALUES (23, 14, 2, 'scuyyds', '2023-12-22 14:53:39', '2023-12-22 14:53:39');
INSERT INTO `group_members` VALUES (24, 14, 1, 'xcgogogo', '2023-12-22 14:53:39', '2023-12-22 14:53:39');
INSERT INTO `group_members` VALUES (25, 15, 3, 'polars', '2023-12-22 14:59:16', '2023-12-22 14:59:16');
INSERT INTO `group_members` VALUES (26, 15, 1, 'xcgogogo', '2023-12-22 14:59:16', '2023-12-22 14:59:16');
INSERT INTO `group_members` VALUES (27, 16, 3, 'polars', '2023-12-22 15:00:11', '2023-12-22 15:00:11');
INSERT INTO `group_members` VALUES (28, 16, 1, 'xcgogogo', '2023-12-22 15:00:11', '2023-12-22 15:00:11');
INSERT INTO `group_members` VALUES (29, 17, 3, 'polars', '2023-12-22 15:00:48', '2023-12-22 15:00:48');
INSERT INTO `group_members` VALUES (30, 17, 1, 'xcgogogo', '2023-12-22 15:00:48', '2023-12-22 15:00:48');
INSERT INTO `group_members` VALUES (31, 7, 3, 'polars', '2023-12-22 15:43:54', '2023-12-22 15:43:54');
INSERT INTO `group_members` VALUES (32, 6, 3, 'polars', '2023-12-22 15:51:00', '2023-12-22 15:51:00');
INSERT INTO `group_members` VALUES (33, 18, 6, 'hello', '2024-04-09 00:25:12', '2024-04-09 00:25:12');
INSERT INTO `group_members` VALUES (34, 18, 4, 'js', '2024-04-09 00:25:12', '2024-04-09 00:25:12');
INSERT INTO `group_members` VALUES (35, 18, 1, 'xcgogogo', '2024-04-09 00:25:12', '2024-04-09 00:25:12');
INSERT INTO `group_members` VALUES (36, 7, 4, 'js', '2024-04-26 01:40:38', '2024-04-26 01:40:38');
INSERT INTO `group_members` VALUES (37, 6, 2, 'scuyyds', '2024-04-28 14:41:10', '2024-04-28 14:41:10');
INSERT INTO `group_members` VALUES (38, 6, 8, 'jsyyds', '2024-04-28 23:08:08', '2024-04-28 23:08:08');

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '消息ID，主键，自动创建',
  `sender_id` int(0) NOT NULL COMMENT '发送者ID，外键（与user表的id字段）',
  `receiver_id` int(0) NOT NULL COMMENT '接收者ID',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '消息内容',
  `room` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '房间号',
  `type` enum('private','group') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '消息类型，可选值为\'private\'和\'group\'\r',
  `media_type` enum('text','image','video','file') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '媒体类型，可选值为\'text\'、\'image\'、\'video\'和\'file\'',
  `file_size` int(0) NULL DEFAULT 0 COMMENT '文件大小，单位为B',
  `status` int(0) NOT NULL DEFAULT 0 COMMENT '消息状态，0未读，1已读，默认值为0',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间，自动创建',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `sender_id`(`sender_id`) USING BTREE,
  CONSTRAINT `message_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 171 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of message
-- ----------------------------
INSERT INTO `message` VALUES (1, 1, 3, '😁', '37620173-0c8e-4c8b-85ce-a03103b28f55', 'private', 'text', 0, 1, '2023-08-15 23:32:15');
INSERT INTO `message` VALUES (2, 1, 3, '请你务必休息🥰', '37620173-0c8e-4c8b-85ce-a03103b28f55', 'private', 'text', 0, 1, '2023-08-15 23:32:31');
INSERT INTO `message` VALUES (3, 1, 2, '/uploads/message/b8f59603_66bd_4af3_9e59_7c5938e48e0f/images/bqug8VS3Td2PVFn0iHFZ22bgxdGapkQC.png', 'b8f59603-66bd-4af3-9e59-7c5938e48e0f', 'private', 'image', 0, 1, '2023-08-15 23:33:02');
INSERT INTO `message` VALUES (4, 1, 4, '/uploads/message/e240f937_6478_4eec_9384_293e163550d5/file/TXT.txt', 'e240f937-6478-4eec-9384-293e163550d5', 'private', 'file', 24, 0, '2023-08-15 23:34:05');
INSERT INTO `message` VALUES (5, 1, 5, '请务必学习java🥰', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2023-08-15 23:39:47');
INSERT INTO `message` VALUES (6, 5, 1, '/uploads/message/361a259a_0de8_40b5_8343_a60e03dc3ff4/images/AaHcoM4P2XeWgNayQ5tZfhAsywfTTRGo.jpg', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'image', 0, 1, '2023-08-15 23:39:59');
INSERT INTO `message` VALUES (7, 5, 1, '/uploads/message/361a259a_0de8_40b5_8343_a60e03dc3ff4/images/61xSfBajSHYArEEiFHJZZCoLfjZPmHhI.jpg', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'image', 0, 1, '2023-08-15 23:40:04');
INSERT INTO `message` VALUES (8, 1, 5, '/uploads/message/361a259a_0de8_40b5_8343_a60e03dc3ff4/images/mrdguRQx071V34yKg9qIlSGJDRcH28fU.png', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'image', 0, 1, '2023-08-15 23:40:14');
INSERT INTO `message` VALUES (9, 1, 5, '/uploads/message/361a259a_0de8_40b5_8343_a60e03dc3ff4/video/6cJkQrnOJslrOc0DDqiMMeHmBl1WOWke.mp4', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'video', 0, 1, '2023-08-15 23:40:22');
INSERT INTO `message` VALUES (10, 1, 5, '/uploads/message/361a259a_0de8_40b5_8343_a60e03dc3ff4/file/TXT.txt', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'file', 24, 1, '2023-08-15 23:41:05');
INSERT INTO `message` VALUES (11, 5, 1, '/uploads/message/361a259a_0de8_40b5_8343_a60e03dc3ff4/file/HTML.html', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'file', 834, 1, '2023-08-15 23:41:16');
INSERT INTO `message` VALUES (12, 1, 5, '/uploads/message/361a259a_0de8_40b5_8343_a60e03dc3ff4/file/ZIP.zip', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'file', 16072984, 1, '2023-08-15 23:41:25');
INSERT INTO `message` VALUES (13, 1, 5, '111', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2023-12-01 21:19:01');
INSERT INTO `message` VALUES (14, 1, 5, '222', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2023-12-01 21:19:04');
INSERT INTO `message` VALUES (15, 1, 4, '222', 'e240f937-6478-4eec-9384-293e163550d5', 'private', 'text', 0, 0, '2023-12-01 21:19:08');
INSERT INTO `message` VALUES (16, 1, 1, '大家可以一起聊天了!!', '9f1cb5ab-f37a-4017-8f71-478a3011f937', 'group', 'text', 0, 0, '2023-12-05 16:14:53');
INSERT INTO `message` VALUES (17, 1, 2, '大家可以一起聊天了!!', '04fad2cb-f255-46de-9da3-94733c9475b5', 'group', 'text', 0, 0, '2023-12-05 16:21:07');
INSERT INTO `message` VALUES (18, 1, 3, '大家可以一起聊天了!!', '7213222d-e77f-429c-b410-083f155e89f3', 'group', 'text', 0, 0, '2023-12-05 19:41:33');
INSERT INTO `message` VALUES (19, 1, 4, '大家可以一起聊天了!!', 'a544b218-e311-456b-923c-355d940db95d', 'group', 'text', 0, 0, '2023-12-05 19:42:16');
INSERT INTO `message` VALUES (20, 1, 5, '大家可以一起聊天了!!', 'ae845515-431f-4bb7-b48d-f84db284dcff', 'group', 'text', 0, 0, '2023-12-05 19:43:52');
INSERT INTO `message` VALUES (21, 1, 6, '大家可以一起聊天了!!', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'text', 0, 0, '2023-12-05 19:44:56');
INSERT INTO `message` VALUES (22, 1, 7, '大家可以一起聊天了!!', 'c888419b-c04c-4fe6-873c-a42811984b6c', 'group', 'text', 0, 0, '2023-12-05 19:47:07');
INSERT INTO `message` VALUES (23, 1, 8, '大家可以一起聊天了!!', '1dafde19-0820-42ae-8de2-9494ab3e9e52', 'group', 'text', 0, 0, '2023-12-05 19:48:20');
INSERT INTO `message` VALUES (24, 1, 9, '大家可以一起聊天了!!', '9143e6d8-f02d-4d04-98b2-30b59c2d5aae', 'group', 'text', 0, 0, '2023-12-05 19:49:26');
INSERT INTO `message` VALUES (25, 1, 10, '大家可以一起聊天了!!', 'c2b60254-afd3-4eeb-81f0-347834fa5488', 'group', 'text', 0, 0, '2023-12-05 19:52:02');
INSERT INTO `message` VALUES (26, 1, 11, '大家可以一起聊天了!!', 'c7be605f-045f-4de6-ad92-84f303405c0c', 'group', 'text', 0, 0, '2023-12-05 19:52:49');
INSERT INTO `message` VALUES (27, 1, 12, '大家可以一起聊天了!!', '8cb9ab80-b7fc-4e81-a49b-582bb27e234b', 'group', 'text', 0, 0, '2023-12-05 22:45:06');
INSERT INTO `message` VALUES (28, 1, 13, '大家可以一起聊天了!!', 'a33332a3-2426-4543-ae65-4bf2c660dbac', 'group', 'text', 0, 0, '2023-12-22 14:31:08');
INSERT INTO `message` VALUES (29, 1, 14, '大家可以一起聊天了!!', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 0, '2023-12-22 14:53:39');
INSERT INTO `message` VALUES (30, 1, 15, '大家可以一起聊天了!!', '03163f39-5bd2-4b0f-aaa1-a88ba2a0858f', 'group', 'text', 0, 0, '2023-12-22 14:59:16');
INSERT INTO `message` VALUES (31, 1, 16, '大家可以一起聊天了!!', '0648b855-141a-4a4b-bf91-e3b295fafc1a', 'group', 'text', 0, 0, '2023-12-22 15:00:11');
INSERT INTO `message` VALUES (32, 1, 17, '大家可以一起聊天了!!', '31ca86d2-bee2-45e6-b991-a43d563ab44c', 'group', 'text', 0, 0, '2023-12-22 15:00:48');
INSERT INTO `message` VALUES (33, 1, 14, '11', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'private', 'text', 0, 0, '2024-01-27 16:43:56');
INSERT INTO `message` VALUES (34, 1, 2, '111', 'b8f59603-66bd-4af3-9e59-7c5938e48e0f', 'private', 'text', 0, 1, '2024-01-27 17:25:47');
INSERT INTO `message` VALUES (35, 1, 7, '🤕', 'c888419b-c04c-4fe6-873c-a42811984b6c', 'group', 'text', 0, 0, '2024-04-01 20:47:25');
INSERT INTO `message` VALUES (36, 1, 2, '1', 'b8f59603-66bd-4af3-9e59-7c5938e48e0f', 'private', 'text', 0, 1, '2024-04-01 22:39:00');
INSERT INTO `message` VALUES (37, 1, 2, 'hello', 'b8f59603-66bd-4af3-9e59-7c5938e48e0f', 'private', 'text', 0, 1, '2024-04-01 22:40:16');
INSERT INTO `message` VALUES (38, 1, 14, 'hello', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 0, '2024-04-01 22:46:52');
INSERT INTO `message` VALUES (39, 1, 14, '嘿嘿嘿', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 0, '2024-04-01 23:04:19');
INSERT INTO `message` VALUES (40, 1, 2, '乐乐乐', 'b8f59603-66bd-4af3-9e59-7c5938e48e0f', 'private', 'text', 0, 1, '2024-04-01 23:10:07');
INSERT INTO `message` VALUES (41, 1, 14, '嘻嘻嘻', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 0, '2024-04-01 23:25:38');
INSERT INTO `message` VALUES (42, 1, 2, '羡慕', 'b8f59603-66bd-4af3-9e59-7c5938e48e0f', 'private', 'text', 0, 1, '2024-04-01 23:25:54');
INSERT INTO `message` VALUES (43, 1, 2, '无语子', 'b8f59603-66bd-4af3-9e59-7c5938e48e0f', 'private', 'text', 0, 1, '2024-04-01 23:27:54');
INSERT INTO `message` VALUES (44, 1, 14, '无语子', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 0, '2024-04-01 23:31:23');
INSERT INTO `message` VALUES (45, 1, 14, '🤠', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 0, '2024-04-01 23:33:41');
INSERT INTO `message` VALUES (46, 1, 2, '😮‍💨', 'b8f59603-66bd-4af3-9e59-7c5938e48e0f', 'private', 'text', 0, 1, '2024-04-01 23:34:00');
INSERT INTO `message` VALUES (47, 1, 2, '🤡', 'b8f59603-66bd-4af3-9e59-7c5938e48e0f', 'private', 'text', 0, 1, '2024-04-01 23:35:40');
INSERT INTO `message` VALUES (48, 2, 14, '🤡', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 0, '2024-04-01 23:36:59');
INSERT INTO `message` VALUES (49, 1, 14, '😡', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 0, '2024-04-01 23:37:09');
INSERT INTO `message` VALUES (50, 1, 14, '🙃', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 0, '2024-04-01 23:37:16');
INSERT INTO `message` VALUES (51, 1, 2, '😡', 'b8f59603-66bd-4af3-9e59-7c5938e48e0f', 'private', 'text', 0, 1, '2024-04-01 23:37:34');
INSERT INTO `message` VALUES (52, 1, 2, '🤡', 'b8f59603-66bd-4af3-9e59-7c5938e48e0f', 'private', 'text', 0, 1, '2024-04-01 23:37:42');
INSERT INTO `message` VALUES (53, 2, 1, '😮‍💨', 'b8f59603-66bd-4af3-9e59-7c5938e48e0f', 'private', 'text', 0, 1, '2024-04-01 23:38:09');
INSERT INTO `message` VALUES (54, 2, 14, '🤖', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 0, '2024-04-01 23:38:22');
INSERT INTO `message` VALUES (55, 1, 14, '👾', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 0, '2024-04-01 23:39:12');
INSERT INTO `message` VALUES (56, 1, 14, '👻', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 0, '2024-04-02 09:48:58');
INSERT INTO `message` VALUES (57, 1, 14, '你好', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 0, '2024-04-02 09:49:18');
INSERT INTO `message` VALUES (58, 1, 14, '唉', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 0, '2024-04-02 09:53:05');
INSERT INTO `message` VALUES (59, 2, 1, '🤡', 'b8f59603-66bd-4af3-9e59-7c5938e48e0f', 'private', 'text', 0, 1, '2024-04-02 09:56:54');
INSERT INTO `message` VALUES (60, 2, 1, '为什么', 'b8f59603-66bd-4af3-9e59-7c5938e48e0f', 'private', 'text', 0, 1, '2024-04-02 09:58:51');
INSERT INTO `message` VALUES (61, 1, 14, '嘿嘿', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 0, '2024-04-02 09:59:56');
INSERT INTO `message` VALUES (62, 5, 14, '😠', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 0, '2024-04-02 10:01:50');
INSERT INTO `message` VALUES (63, 5, 14, '小丑', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 0, '2024-04-02 10:02:18');
INSERT INTO `message` VALUES (64, 5, 14, '你的强来了', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 1, '2024-04-02 10:20:09');
INSERT INTO `message` VALUES (65, 2, 14, '我不来\n', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 1, '2024-04-02 10:20:39');
INSERT INTO `message` VALUES (66, 5, 1, '你好撒', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-02 10:22:49');
INSERT INTO `message` VALUES (67, 5, 1, '我不好', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-02 10:24:06');
INSERT INTO `message` VALUES (68, 5, 1, '你很好', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-02 10:26:08');
INSERT INTO `message` VALUES (69, 1, 5, '不死', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-02 10:28:37');
INSERT INTO `message` VALUES (70, 1, 14, '/uploads/message/b7f56b6e_e823_4eb4_ab29_8d17470f6e6a/images/iHVSArzl3HoJZP9ea2cSnY4htes4AQGg.png', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'image', 0, 1, '2024-04-02 10:31:25');
INSERT INTO `message` VALUES (71, 1, 14, '/uploads/message/b7f56b6e_e823_4eb4_ab29_8d17470f6e6a/images/Z6n96gqaCnwK6Lbvb8TAXoJns0NQVYoX.png', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'image', 0, 1, '2024-04-02 10:32:19');
INSERT INTO `message` VALUES (72, 1, 14, '你好', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'text', 0, 1, '2024-04-02 11:20:38');
INSERT INTO `message` VALUES (73, 5, 14, '/uploads/message/b7f56b6e_e823_4eb4_ab29_8d17470f6e6a/images/Azf9eDqRx2iofjlBbk9IwtzeBB4lf0PV.png', 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 'group', 'image', 0, 1, '2024-04-02 11:20:49');
INSERT INTO `message` VALUES (74, 1, 7, '😵‍💫', 'c888419b-c04c-4fe6-873c-a42811984b6c', 'group', 'text', 0, 1, '2024-04-06 23:00:01');
INSERT INTO `message` VALUES (75, 1, 17, '🤮', '31ca86d2-bee2-45e6-b991-a43d563ab44c', 'group', 'text', 0, 1, '2024-04-08 15:07:15');
INSERT INTO `message` VALUES (76, 1, 6, '🤡', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'text', 0, 1, '2024-04-08 15:54:16');
INSERT INTO `message` VALUES (77, 6, 1, '😺', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'text', 0, 1, '2024-04-08 15:55:27');
INSERT INTO `message` VALUES (78, 1, 6, '😫', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'text', 0, 1, '2024-04-08 15:55:33');
INSERT INTO `message` VALUES (79, 6, 1, '/uploads/message/acd8ddc4_2e5e_4203_8834_f2d53b7a308f/image/s3Rf6DlugxVahrInJCIAyk0FFRGC4iJ6.png', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'image', 0, 1, '2024-04-08 15:55:40');
INSERT INTO `message` VALUES (80, 6, 1, '/uploads/message/acd8ddc4_2e5e_4203_8834_f2d53b7a308f/image/izYkoDxkHSJvP0CdA78i6djOmYdB7nHW.png', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'image', 0, 1, '2024-04-08 16:06:31');
INSERT INTO `message` VALUES (81, 6, 1, '/uploads/message/acd8ddc4_2e5e_4203_8834_f2d53b7a308f/image/xmQAeFZ9C1ZE2oP2LmTj6harBg8C8OYS.png', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'image', 0, 1, '2024-04-08 16:06:36');
INSERT INTO `message` VALUES (82, 6, 1, '/uploads/message/acd8ddc4_2e5e_4203_8834_f2d53b7a308f/video/K6bZjBqUlizDBnP9MWVaVpCBGWQT2iZj.mp4', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'video', 0, 1, '2024-04-08 16:07:48');
INSERT INTO `message` VALUES (83, 1, 6, '', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'file', 0, 1, '2024-04-08 16:08:24');
INSERT INTO `message` VALUES (84, 1, 6, '', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'file', 0, 1, '2024-04-08 16:08:24');
INSERT INTO `message` VALUES (85, 1, 6, '', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'file', 0, 1, '2024-04-08 16:24:33');
INSERT INTO `message` VALUES (86, 1, 6, '', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'file', 0, 1, '2024-04-08 16:24:33');
INSERT INTO `message` VALUES (87, 1, 6, '', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'file', 0, 1, '2024-04-08 16:25:34');
INSERT INTO `message` VALUES (88, 1, 6, '', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'file', 0, 1, '2024-04-08 16:25:36');
INSERT INTO `message` VALUES (89, 1, 6, '', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'file', 0, 1, '2024-04-08 16:25:36');
INSERT INTO `message` VALUES (90, 1, 6, '', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'file', 0, 1, '2024-04-08 16:25:36');
INSERT INTO `message` VALUES (91, 1, 6, '', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'file', 0, 1, '2024-04-08 16:25:37');
INSERT INTO `message` VALUES (92, 1, 6, '', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'file', 0, 1, '2024-04-08 16:25:37');
INSERT INTO `message` VALUES (93, 1, 6, '', '', 'private', 'file', 0, 0, '2024-04-08 16:25:38');
INSERT INTO `message` VALUES (94, 1, 6, '', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'file', 0, 1, '2024-04-08 16:25:39');
INSERT INTO `message` VALUES (95, 1, 6, '', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'file', 0, 1, '2024-04-08 16:25:40');
INSERT INTO `message` VALUES (96, 1, 6, '/uploads/message/acd8ddc4_2e5e_4203_8834_f2d53b7a308f/file/HTML.html', 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 'private', 'file', 834, 1, '2024-04-08 17:00:56');
INSERT INTO `message` VALUES (97, 1, 7, '/uploads/message/c888419b_c04c_4fe6_873c_a42811984b6c/file/TXT.txt', 'c888419b-c04c-4fe6-873c-a42811984b6c', 'group', 'file', 24, 1, '2024-04-08 17:06:44');
INSERT INTO `message` VALUES (98, 1, 7, '/uploads/message/c888419b_c04c_4fe6_873c_a42811984b6c/file/TXT.txt', 'c888419b-c04c-4fe6-873c-a42811984b6c', 'group', 'file', 24, 1, '2024-04-08 17:16:52');
INSERT INTO `message` VALUES (99, 1, 5, '1', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-08 17:29:01');
INSERT INTO `message` VALUES (100, 1, 5, '1', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-08 17:29:17');
INSERT INTO `message` VALUES (101, 1, 7, '/uploads/message/c888419b_c04c_4fe6_873c_a42811984b6c/file/TXT.txt', 'c888419b-c04c-4fe6-873c-a42811984b6c', 'group', 'file', 24, 1, '2024-04-08 17:35:38');
INSERT INTO `message` VALUES (102, 1, 7, '/uploads/message/c888419b_c04c_4fe6_873c_a42811984b6c/image/blXw99VOLjwB6awxSOLL797KFFBkn2ZU.jpg', 'c888419b-c04c-4fe6-873c-a42811984b6c', 'group', 'image', 0, 1, '2024-04-08 17:37:42');
INSERT INTO `message` VALUES (103, 1, 7, '/uploads/message/c888419b_c04c_4fe6_873c_a42811984b6c/image/ajkWpPpy872fwh3bjBA1d6qVx4maX7RU.jpg', 'c888419b-c04c-4fe6-873c-a42811984b6c', 'group', 'image', 0, 1, '2024-04-08 17:39:47');
INSERT INTO `message` VALUES (104, 5, 1, 'a', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-08 20:56:27');
INSERT INTO `message` VALUES (105, 5, 1, '1', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-08 20:56:43');
INSERT INTO `message` VALUES (106, 1, 5, '/uploads/message/361a259a_0de8_40b5_8343_a60e03dc3ff4/image/zOPtMGEI3Pnpy9ycThqDXYOl1ydmvhqA.jpg', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'image', 0, 1, '2024-04-08 20:58:42');
INSERT INTO `message` VALUES (107, 1, 5, '1', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-08 21:22:27');
INSERT INTO `message` VALUES (108, 1, 5, '1', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-08 21:23:44');
INSERT INTO `message` VALUES (109, 1, 5, '2', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-08 21:23:51');
INSERT INTO `message` VALUES (110, 1, 5, '3', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-08 21:23:58');
INSERT INTO `message` VALUES (111, 1, 5, 'sss', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-08 21:24:03');
INSERT INTO `message` VALUES (112, 1, 5, '222', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-08 21:24:22');
INSERT INTO `message` VALUES (113, 5, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/image/lI7mG6h6SJKTdNjmgiIUwPtxcIeJaRVR.png', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'image', 0, 1, '2024-04-08 21:26:43');
INSERT INTO `message` VALUES (114, 3, 6, '1', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'text', 0, 1, '2024-04-08 21:27:04');
INSERT INTO `message` VALUES (115, 5, 6, '1', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'text', 0, 1, '2024-04-08 21:31:07');
INSERT INTO `message` VALUES (116, 5, 6, '2', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'text', 0, 1, '2024-04-08 21:31:49');
INSERT INTO `message` VALUES (117, 5, 6, '3', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'text', 0, 1, '2024-04-08 21:31:52');
INSERT INTO `message` VALUES (118, 5, 1, '2', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-08 21:32:01');
INSERT INTO `message` VALUES (119, 5, 1, '3', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-08 21:32:03');
INSERT INTO `message` VALUES (120, 5, 1, '4', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-08 21:32:05');
INSERT INTO `message` VALUES (121, 1, 5, '1', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-08 21:32:22');
INSERT INTO `message` VALUES (122, 5, 1, '2', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-08 21:32:40');
INSERT INTO `message` VALUES (123, 1, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/image/eTaUQ9AAxvsPCK8iRVgnR3z8C3e14TQA.jpg', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'image', 0, 1, '2024-04-08 21:33:44');
INSERT INTO `message` VALUES (124, 1, 5, '👾', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-08 21:34:53');
INSERT INTO `message` VALUES (125, 1, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/image/n7MvvTV3MKViMDv3Qza7fWAo7qX5N7uA.jpg', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'image', 0, 1, '2024-04-08 21:36:29');
INSERT INTO `message` VALUES (126, 3, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/image/iL7zxwr7Wnbe3fOrHfJlyLgAvwqeE8vR.jpg', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'image', 0, 1, '2024-04-08 21:36:41');
INSERT INTO `message` VALUES (127, 1, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/file/TXT.txt', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'file', 24, 1, '2024-04-08 21:38:40');
INSERT INTO `message` VALUES (128, 5, 6, '', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'file', 0, 1, '2024-04-08 21:39:07');
INSERT INTO `message` VALUES (129, 5, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/file/ZIP.zip', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'file', 16072984, 1, '2024-04-08 21:39:28');
INSERT INTO `message` VALUES (130, 5, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/image/UEzKdput7rHVmvwF64Eq7I6CFWS7i1Xw.jpg', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'image', 0, 1, '2024-04-08 21:39:51');
INSERT INTO `message` VALUES (131, 1, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/image/jGReRQfrd0duEay3E4XY6F8bY0gnReoS.png', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'image', 0, 1, '2024-04-08 21:42:30');
INSERT INTO `message` VALUES (132, 5, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/video/cqX3jAlxkqgWpsWONe81GJEhYIalhvBw.mp4', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'video', 0, 1, '2024-04-08 21:42:46');
INSERT INTO `message` VALUES (133, 5, 6, '😀', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'text', 0, 1, '2024-04-08 21:44:22');
INSERT INTO `message` VALUES (134, 1, 6, '🤠', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'text', 0, 1, '2024-04-08 21:47:22');
INSERT INTO `message` VALUES (135, 5, 6, '😭', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'text', 0, 1, '2024-04-08 21:48:32');
INSERT INTO `message` VALUES (136, 5, 6, '嘿嘿嘿', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'text', 0, 1, '2024-04-08 21:49:24');
INSERT INTO `message` VALUES (137, 5, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/video/2jnX6IvA0ecyCvTMHq3BRUJacc6zt4Nx.mp4', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'video', 0, 1, '2024-04-08 21:50:05');
INSERT INTO `message` VALUES (138, 1, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/file/TXT.txt', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'file', 24, 1, '2024-04-08 21:50:24');
INSERT INTO `message` VALUES (139, 5, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/file/HTML.html', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'file', 834, 1, '2024-04-08 21:50:34');
INSERT INTO `message` VALUES (140, 5, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/image/8ZpPgL4rPoZGWS9jwjQyQzRPsoqCwd7m.jpg', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'image', 0, 1, '2024-04-08 21:50:44');
INSERT INTO `message` VALUES (141, 3, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/video/ibZuSQ7LE5Pn4DCWt9mH4COliVHLZlsW.mp4', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'video', 0, 1, '2024-04-08 21:59:17');
INSERT INTO `message` VALUES (142, 3, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/image/ve4tecAzTbmz2ACC5poSgIwd0XrGrp3w.png', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'image', 0, 1, '2024-04-08 22:00:37');
INSERT INTO `message` VALUES (143, 3, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/image/IVuN8xUvYdizUnpP7B1oihQuHjvuac1a.jpg', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'image', 0, 1, '2024-04-08 22:00:42');
INSERT INTO `message` VALUES (144, 3, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/video/lsLYRbgKwJPDE2uwbbZIoYHEs1SfPg4H.mp4', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'video', 0, 1, '2024-04-08 22:05:49');
INSERT INTO `message` VALUES (145, 3, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/file/better-chat项目演示视频.zip', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'file', 201711956, 1, '2024-04-08 22:08:44');
INSERT INTO `message` VALUES (146, 5, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/file/better-chat项目演示视频.zip', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'file', 201711956, 1, '2024-04-08 22:10:20');
INSERT INTO `message` VALUES (147, 1, 7, '1', 'c888419b-c04c-4fe6-873c-a42811984b6c', 'group', 'text', 0, 1, '2024-04-08 22:14:13');
INSERT INTO `message` VALUES (148, 1, 7, '/uploads/message/c888419b_c04c_4fe6_873c_a42811984b6c/image/ujKqLkZYwzSAupr5iz3i5DuFPPnbDg0m.png', 'c888419b-c04c-4fe6-873c-a42811984b6c', 'group', 'image', 0, 1, '2024-04-08 22:14:16');
INSERT INTO `message` VALUES (149, 1, 7, '/uploads/message/c888419b_c04c_4fe6_873c_a42811984b6c/image/YqAUycfJxq4FtLros5bgzeZlRcCZPVbl.png', 'c888419b-c04c-4fe6-873c-a42811984b6c', 'group', 'image', 0, 1, '2024-04-08 22:37:07');
INSERT INTO `message` VALUES (150, 1, 7, '/uploads/message/c888419b_c04c_4fe6_873c_a42811984b6c/image/wld3mjVvdsVnMeOnmukMrJXnKEJVWyrr.png', 'c888419b-c04c-4fe6-873c-a42811984b6c', 'group', 'image', 0, 1, '2024-04-08 22:37:22');
INSERT INTO `message` VALUES (151, 1, 7, '/uploads/message/c888419b_c04c_4fe6_873c_a42811984b6c/file/TXT.txt', 'c888419b-c04c-4fe6-873c-a42811984b6c', 'group', 'file', 24, 1, '2024-04-08 22:37:26');
INSERT INTO `message` VALUES (152, 1, 7, '/uploads/message/c888419b_c04c_4fe6_873c_a42811984b6c/image/zgpw6bimYAHbMwy5UpTwpi4RqYEySjIR.jpg', 'c888419b-c04c-4fe6-873c-a42811984b6c', 'group', 'image', 0, 1, '2024-04-08 22:38:50');
INSERT INTO `message` VALUES (153, 1, 7, '/uploads/message/c888419b_c04c_4fe6_873c_a42811984b6c/image/rTFSe54RpT06rjs8q0TiBxQPi7HNOdGY.png', 'c888419b-c04c-4fe6-873c-a42811984b6c', 'group', 'image', 0, 1, '2024-04-08 22:38:54');
INSERT INTO `message` VALUES (154, 1, 18, '大家可以一起聊天了!', '47695eb7-358f-4206-99a8-67b14b405f74', 'group', 'text', 0, 0, '2024-04-09 00:25:12');
INSERT INTO `message` VALUES (155, 1, 18, '1', '47695eb7-358f-4206-99a8-67b14b405f74', 'private', 'text', 0, 0, '2024-04-09 13:17:53');
INSERT INTO `message` VALUES (156, 1, 6, '1', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'text', 0, 1, '2024-04-09 13:21:03');
INSERT INTO `message` VALUES (157, 1, 6, '11', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'text', 0, 1, '2024-04-09 13:24:40');
INSERT INTO `message` VALUES (158, 1, 6, '瑞克五代好', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'text', 0, 1, '2024-04-09 13:24:47');
INSERT INTO `message` VALUES (159, 1, 6, '1111', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'text', 0, 1, '2024-04-09 13:25:37');
INSERT INTO `message` VALUES (160, 5, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/image/agCWFQn0FFcA6ENMCfFarFb5IppTa1yE.jpg', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'image', 0, 1, '2024-04-09 13:25:53');
INSERT INTO `message` VALUES (161, 1, 6, '/uploads/message/84b0a6e7_f458_4df6_9a1d_f64bb929a985/video/e0iQi8lgObNl0jqhSu1JnffAiO2QZOXX.mp4', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'video', 0, 1, '2024-04-09 13:26:38');
INSERT INTO `message` VALUES (162, 1, 6, '1', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'text', 0, 1, '2024-04-10 13:53:07');
INSERT INTO `message` VALUES (163, 1, 6, '1', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'text', 0, 1, '2024-04-26 01:40:03');
INSERT INTO `message` VALUES (164, 5, 6, '2', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'text', 0, 1, '2024-04-26 01:40:18');
INSERT INTO `message` VALUES (165, 1, 5, '/uploads/message/361a259a_0de8_40b5_8343_a60e03dc3ff4/image/6Vz9nbQzRtMda7P2aKKbePbg7qkNB87u.jpg', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'image', 0, 1, '2024-04-28 21:02:43');
INSERT INTO `message` VALUES (166, 1, 5, '/uploads/message/361a259a_0de8_40b5_8343_a60e03dc3ff4/file/ZIP.zip', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'file', 16072984, 1, '2024-04-28 21:03:30');
INSERT INTO `message` VALUES (167, 5, 1, '/uploads/message/361a259a_0de8_40b5_8343_a60e03dc3ff4/image/PRhzU9STzVTvPthTrBngHaAeqGzY3C5o.png', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'image', 0, 1, '2024-04-28 21:09:01');
INSERT INTO `message` VALUES (168, 1, 5, '毕业快乐', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'text', 0, 1, '2024-04-28 23:06:13');
INSERT INTO `message` VALUES (169, 1, 5, '/uploads/message/361a259a_0de8_40b5_8343_a60e03dc3ff4/image/pDlRrDeRPJnJ89kQ7gDrydJvpNwUrnX9.jpg', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'image', 0, 1, '2024-04-28 23:06:25');
INSERT INTO `message` VALUES (170, 1, 5, '/uploads/message/361a259a_0de8_40b5_8343_a60e03dc3ff4/file/ZIP.zip', '361a259a-0de8-40b5-8343-a60e03dc3ff4', 'private', 'file', 16072984, 1, '2024-04-28 23:06:37');
INSERT INTO `message` VALUES (171, 1, 6, '群友们好👽', '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 'group', 'text', 0, 1, '2024-04-28 23:07:52');

-- ----------------------------
-- Table structure for message_statistics
-- ----------------------------
DROP TABLE IF EXISTS `message_statistics`;
CREATE TABLE `message_statistics`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '消息统计ID，主键，自动创建',
  `room` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '房间号',
  `total` int(0) NOT NULL COMMENT '消息总数',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间，自动创建',
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间，自动创建',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of message_statistics
-- ----------------------------
INSERT INTO `message_statistics` VALUES (1, '37620173-0c8e-4c8b-85ce-a03103b28f55', 2, '2023-08-15 23:32:15', '2023-08-15 23:32:31');
INSERT INTO `message_statistics` VALUES (2, 'b8f59603-66bd-4af3-9e59-7c5938e48e0f', 14, '2023-08-15 23:33:02', '2024-04-02 09:58:51');
INSERT INTO `message_statistics` VALUES (3, 'e240f937-6478-4eec-9384-293e163550d5', 2, '2023-08-15 23:34:05', '2023-12-01 21:19:08');
INSERT INTO `message_statistics` VALUES (4, '361a259a-0de8-40b5-8343-a60e03dc3ff4', 37, '2023-08-15 23:39:47', '2024-04-28 23:06:37');
INSERT INTO `message_statistics` VALUES (5, '9f1cb5ab-f37a-4017-8f71-478a3011f937', 1, '2023-12-05 16:14:53', '2023-12-05 16:14:53');
INSERT INTO `message_statistics` VALUES (6, '04fad2cb-f255-46de-9da3-94733c9475b5', 1, '2023-12-05 16:21:07', '2023-12-05 16:21:07');
INSERT INTO `message_statistics` VALUES (7, '7213222d-e77f-429c-b410-083f155e89f3', 1, '2023-12-05 19:41:33', '2023-12-05 19:41:33');
INSERT INTO `message_statistics` VALUES (8, 'a544b218-e311-456b-923c-355d940db95d', 1, '2023-12-05 19:42:16', '2023-12-05 19:42:16');
INSERT INTO `message_statistics` VALUES (9, 'ae845515-431f-4bb7-b48d-f84db284dcff', 1, '2023-12-05 19:43:52', '2023-12-05 19:43:52');
INSERT INTO `message_statistics` VALUES (10, '84b0a6e7-f458-4df6-9a1d-f64bb929a985', 39, '2023-12-05 19:44:56', '2024-04-28 23:07:52');
INSERT INTO `message_statistics` VALUES (11, 'c888419b-c04c-4fe6-873c-a42811984b6c', 15, '2023-12-05 19:47:07', '2024-04-08 22:38:54');
INSERT INTO `message_statistics` VALUES (12, '1dafde19-0820-42ae-8de2-9494ab3e9e52', 1, '2023-12-05 19:48:20', '2023-12-05 19:48:20');
INSERT INTO `message_statistics` VALUES (13, '9143e6d8-f02d-4d04-98b2-30b59c2d5aae', 1, '2023-12-05 19:49:26', '2023-12-05 19:49:26');
INSERT INTO `message_statistics` VALUES (14, 'c2b60254-afd3-4eeb-81f0-347834fa5488', 1, '2023-12-05 19:52:02', '2023-12-05 19:52:02');
INSERT INTO `message_statistics` VALUES (15, 'c7be605f-045f-4de6-ad92-84f303405c0c', 1, '2023-12-05 19:52:49', '2023-12-05 19:52:49');
INSERT INTO `message_statistics` VALUES (16, '8cb9ab80-b7fc-4e81-a49b-582bb27e234b', 1, '2023-12-05 22:45:06', '2023-12-05 22:45:06');
INSERT INTO `message_statistics` VALUES (17, 'a33332a3-2426-4543-ae65-4bf2c660dbac', 1, '2023-12-22 14:31:08', '2023-12-22 14:31:08');
INSERT INTO `message_statistics` VALUES (18, 'b7f56b6e-e823-4eb4-ab29-8d17470f6e6a', 24, '2023-12-22 14:53:39', '2024-04-02 11:20:49');
INSERT INTO `message_statistics` VALUES (19, '03163f39-5bd2-4b0f-aaa1-a88ba2a0858f', 1, '2023-12-22 14:59:16', '2023-12-22 14:59:16');
INSERT INTO `message_statistics` VALUES (20, '0648b855-141a-4a4b-bf91-e3b295fafc1a', 1, '2023-12-22 15:00:11', '2023-12-22 15:00:11');
INSERT INTO `message_statistics` VALUES (21, '31ca86d2-bee2-45e6-b991-a43d563ab44c', 2, '2023-12-22 15:00:48', '2024-04-08 15:07:15');
INSERT INTO `message_statistics` VALUES (22, 'acd8ddc4-2e5e-4203-8834-f2d53b7a308f', 21, '2024-04-08 15:54:16', '2024-04-08 17:00:56');
INSERT INTO `message_statistics` VALUES (23, '47695eb7-358f-4206-99a8-67b14b405f74', 2, '2024-04-09 00:25:12', '2024-04-09 13:17:53');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '用户ID，主键，自动创建',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名，使用B树索引来保证唯一性',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户密码，是加盐加密后不可逆的字符串',
  `phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户手机号',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户头像',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户昵称',
  `salt` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '盐，用于密码加盐',
  `signature` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '用户签名',
  `created_at` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间，自动创建',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'xcgogogo', '33e893b41ad82c886f551250f2ae9b75', '18076879865', '/uploads/image/cq9dOvGaIzgknpRNFJkCEu7q1tU3aeBu.jpeg', 'xcgogogo', '1e2113', '这是我的个性', '2023-08-15 23:29:49');
INSERT INTO `user` VALUES (2, 'scuyyds', '47650eadb2838bee5546f838db4cd012', '19087876545', 'https://ui-avatars.com/api/?name=scuyyds', 'scuyyds', '882352', '', '2023-08-15 23:30:20');
INSERT INTO `user` VALUES (3, 'polars', 'c993a59a7a554a8656dddf500186b512', '16709878645', 'https://ui-avatars.com/api/?name=polars', 'polars', 'b2abf3', '', '2023-08-15 23:30:42');
INSERT INTO `user` VALUES (4, 'js', '5f0bd1cb4efcdd7491f6b79d14ffd56d', '15609876756', 'https://ui-avatars.com/api/?name=js', 'js', '02f6bd', '', '2023-08-15 23:31:28');
INSERT INTO `user` VALUES (5, 'java', '455d96fc94087c23ed66d29e1e7f9f70', '17877675634', 'https://ui-avatars.com/api/?name=java', 'java', '899d7b', '', '2023-08-15 23:39:03');
INSERT INTO `user` VALUES (6, 'hello', '10b57664bd5d30d155940649740650c8', '13098765467', 'https://ui-avatars.com/api/?name=hello', 'hello', 'f2e8b7', '', '2024-04-07 16:33:52');
INSERT INTO `user` VALUES (7, 'ok', '0eebfd937347077d500a97163fba5ce1', '13980876545', 'https://ui-avatars.com/api/?name=ok', 'ok', 'd7d7e8', '', '2024-04-08 14:52:30');
INSERT INTO `user` VALUES (8, 'jsyyds', '9c5caaab191469f9bbbd4169427835b1', '13087653453', 'https://ui-avatars.com/api/?name=jsyyds', 'jsyyds', '050249', '', '2024-04-28 23:04:20');

SET FOREIGN_KEY_CHECKS = 1;
