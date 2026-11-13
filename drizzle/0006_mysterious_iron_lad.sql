ALTER TABLE `availability_blocks` DROP INDEX `availability_blocks_date_time_unique`;--> statement-breakpoint
ALTER TABLE `availability_blocks` MODIFY COLUMN `start_time` varchar(5);--> statement-breakpoint
ALTER TABLE `availability_blocks` ADD `booking_type` enum('phone_call','individual_course') DEFAULT 'phone_call' NOT NULL;--> statement-breakpoint
ALTER TABLE `availability_blocks` ADD CONSTRAINT `availability_blocks_date_type_time_unique` UNIQUE(`block_date`,`booking_type`,`start_time`);