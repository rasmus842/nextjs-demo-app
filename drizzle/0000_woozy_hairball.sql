CREATE TABLE `todos` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`user_id` bigint
);

CREATE TABLE `users` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`password_hash` varchar(256),
	`created_at` timestamp DEFAULT (now())
);

ALTER TABLE todos ADD CONSTRAINT todos_user_id_users_id_fk FOREIGN KEY (`user_id`) REFERENCES users(`id`) ;