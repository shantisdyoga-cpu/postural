CREATE TABLE `google_calendar_connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`account_email` varchar(320) NOT NULL,
	`calendar_id` varchar(255) NOT NULL DEFAULT 'primary',
	`encrypted_refresh_token` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `google_calendar_connections_id` PRIMARY KEY(`id`),
	CONSTRAINT `google_calendar_connections_account_email_unique` UNIQUE(`account_email`)
);
--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `google_event_id` varchar(255);--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `google_calendar_synced_at` timestamp;--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `google_calendar_sync_error` text;