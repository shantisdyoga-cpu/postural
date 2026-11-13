CREATE TABLE `workshop_waitlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workshop_waitlist_id` PRIMARY KEY(`id`),
	CONSTRAINT `workshop_waitlist_email_unique` UNIQUE(`email`)
);
