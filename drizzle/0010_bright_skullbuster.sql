CREATE TABLE `student_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_name` varchar(120) NOT NULL,
	`email` varchar(320),
	`phone` varchar(30),
	`plan_type` enum('single','five','ten','annual') NOT NULL,
	`amount_cents` int NOT NULL,
	`payment_status` enum('pending','paid') NOT NULL DEFAULT 'pending',
	`payment_method` enum('cash','bank_transfer','card','cheque','direct_debit','other') NOT NULL DEFAULT 'bank_transfer',
	`paid_date` date,
	`expires_date` date,
	`total_courses` int NOT NULL DEFAULT 0,
	`used_courses` int NOT NULL DEFAULT 0,
	`internal_note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_plans_id` PRIMARY KEY(`id`)
);
