ALTER TABLE "users" ADD COLUMN "token" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_token_unique" UNIQUE("token");