ALTER TABLE `student_plans` MODIFY COLUMN `plan_type` enum('single','five','ten','annual','annual_solo','annual_duo','monthly_solo','monthly_duo','ten_solo','ten_duo','twenty_duo') NOT NULL;--> statement-breakpoint
ALTER TABLE `student_plans` ADD `secondary_student_name` varchar(120);--> statement-breakpoint
ALTER TABLE `student_plans` ADD `payer_name` varchar(120);