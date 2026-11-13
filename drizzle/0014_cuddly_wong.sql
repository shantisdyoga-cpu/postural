CREATE TABLE `student_plan_course_adjustments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_plan_id` int NOT NULL,
	`action` enum('reduce','restore') NOT NULL,
	`previous_used_courses` int NOT NULL,
	`next_used_courses` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `student_plan_course_adjustments_id` PRIMARY KEY(`id`)
);
