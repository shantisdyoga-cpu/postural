CREATE TABLE `booking_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(30) NOT NULL,
	`requestType` enum('first_course','question') NOT NULL DEFAULT 'first_course',
	`preferredSlot` enum('wednesday','friday','either') NOT NULL DEFAULT 'either',
	`message` text,
	`status` enum('pending','confirmed','declined') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `booking_requests_id` PRIMARY KEY(`id`)
);
