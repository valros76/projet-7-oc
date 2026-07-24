CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrer_id` int NOT NULL,
	`company_name` varchar(150) NOT NULL,
	`contact_first_name` varchar(100) NOT NULL,
	`contact_last_name` varchar(100) NOT NULL,
	`client_siret` varchar(14),
	`client_email` varchar(255) NOT NULL,
	`client_phone` varchar(20) NOT NULL,
	`mission_title` varchar(255) NOT NULL,
	`mission_start_date` date NOT NULL,
	`duration_days` int,
	`is_indefinite_duration` boolean NOT NULL DEFAULT false,
	`commission_rate` decimal(5,2) NOT NULL DEFAULT '10.00',
	`status` enum('pending','accepted','refused','finished') NOT NULL DEFAULT 'pending',
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `refresh_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires_at` datetime NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `refresh_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `refresh_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`role` enum('admin','referrer') NOT NULL DEFAULT 'referrer',
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`siret` varchar(14),
	`iban` varchar(34),
	`affiliate_code` varchar(50),
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_affiliate_code_unique` UNIQUE(`affiliate_code`)
);
--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_referrer_id_users_id_fk` FOREIGN KEY (`referrer_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_referrer_id` ON `leads` (`referrer_id`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `leads` (`status`);--> statement-breakpoint
CREATE INDEX `idx_token` ON `refresh_tokens` (`token`);--> statement-breakpoint
CREATE INDEX `idx_user_id` ON `refresh_tokens` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_email` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_affiliate_code` ON `users` (`affiliate_code`);