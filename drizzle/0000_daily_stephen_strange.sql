CREATE TABLE `todos` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`user_id` int);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`password_hash` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()));
--> statement-breakpoint
ALTER TABLE `todos` ADD CONSTRAINT `todos_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;