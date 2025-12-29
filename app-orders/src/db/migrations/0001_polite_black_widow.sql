CREATE TABLE "custumers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"address" text NOT NULL,
	"state" text NOT NULL,
	"zip_code" text NOT NULL,
	"date_of_birth" date NOT NULL,
	"craeted_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "custumers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_custumers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."custumers"("id") ON DELETE no action ON UPDATE no action;