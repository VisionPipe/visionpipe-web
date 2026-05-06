CREATE TABLE "waitlist" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"feature" text NOT NULL,
	"source" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "waitlist_email_feature_unique" ON "waitlist" USING btree ("email","feature");