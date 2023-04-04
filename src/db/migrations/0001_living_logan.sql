CREATE TABLE `extra_todos` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`todo_id` bigint
);

ALTER TABLE users MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());