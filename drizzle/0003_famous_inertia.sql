ALTER TABLE `booking_requests` MODIFY COLUMN `requestType` enum('first_course','individual_course','question') NOT NULL DEFAULT 'first_course';--> statement-breakpoint
ALTER TABLE `booking_requests` MODIFY COLUMN `preferredSlot` enum('wednesday','friday','either','tuesday','thursday','saturday') NOT NULL DEFAULT 'either';--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `preferred_time` varchar(5);--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `duration_minutes` int DEFAULT 60 NOT NULL;