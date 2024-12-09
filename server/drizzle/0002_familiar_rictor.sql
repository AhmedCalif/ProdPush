DROP INDEX IF EXISTS `users_email_unique`;--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "given_name" TO "given_name" text;--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "family_name" TO "family_name" text;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `created_at`;