CREATE TABLE `student_portal_access` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_plan_id` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`token_hash` varchar(64) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`last_access_at` timestamp,
	`revoked_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `student_portal_access_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_portal_access_student_plan_id_unique` UNIQUE(`student_plan_id`),
	CONSTRAINT `student_portal_access_token_hash_unique` UNIQUE(`token_hash`)
);
