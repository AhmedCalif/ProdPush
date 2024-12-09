PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`owner_id` text NOT NULL,
	`status` text,
	`due_date` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_projects`("id", "name", "description", "owner_id", "status", "due_date", "created_at") SELECT "id", "name", "description", "owner_id", "status", "due_date", "created_at" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;--> statement-breakpoint
PRAGMA foreign_keys=ON;