ALTER TABLE todos MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;
ALTER TABLE todos MODIFY COLUMN `user_id` int;
ALTER TABLE users MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;
ALTER TABLE users MODIFY COLUMN `password_hash` varchar(256) NOT NULL;