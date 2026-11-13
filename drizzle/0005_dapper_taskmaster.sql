CREATE TABLE `availability_blocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`block_date` date NOT NULL,
	`start_time` varchar(5) NOT NULL,
	`reason` varchar(240),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `availability_blocks_id` PRIMARY KEY(`id`),
	CONSTRAINT `availability_blocks_date_time_unique` UNIQUE(`block_date`,`start_time`)
);
--> statement-breakpoint
ALTER TABLE `booking_requests` MODIFY COLUMN `requestType` enum('first_course','individual_course','phone_call','question') NOT NULL DEFAULT 'first_course';