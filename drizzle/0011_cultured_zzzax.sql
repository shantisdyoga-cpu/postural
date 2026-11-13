CREATE TABLE `student_plan_payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_plan_id` int NOT NULL,
	`amount_cents` int NOT NULL,
	`payment_date` date NOT NULL,
	`payment_method` enum('cash','bank_transfer','card','cheque','direct_debit','other') NOT NULL DEFAULT 'bank_transfer',
	`note` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `student_plan_payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `student_plans` ADD `payment_plan` enum('one','two','three') DEFAULT 'one' NOT NULL;