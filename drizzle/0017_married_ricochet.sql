ALTER TABLE `booking_requests` ADD `attendance_student_plan_id` int;--> statement-breakpoint
ALTER TABLE `booking_requests` ADD `attendance_course_deducted` int DEFAULT 0 NOT NULL;