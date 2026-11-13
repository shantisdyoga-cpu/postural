CREATE TABLE `financial_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`transaction_date` date NOT NULL,
	`type` enum('income','expense') NOT NULL,
	`amount_cents` int NOT NULL,
	`category` varchar(120) NOT NULL,
	`payment_method` enum('cash','bank_transfer','card','cheque','direct_debit','other') NOT NULL DEFAULT 'bank_transfer',
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `financial_transactions_id` PRIMARY KEY(`id`)
);
