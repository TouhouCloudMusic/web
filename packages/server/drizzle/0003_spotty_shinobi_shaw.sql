CREATE TABLE IF NOT EXISTS "artist_localized_name" (
	"artist_id" integer NOT NULL,
	"language" smallint NOT NULL,
	"name" varchar(128) NOT NULL,
	CONSTRAINT "artist_localized_name_artist_id_language_name_pk" PRIMARY KEY("artist_id","language","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credit_role" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "credit_role_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(128) NOT NULL,
	"alias" varchar(128)[],
	"short_desc" varchar(128),
	"description" text,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credit_role_inheritance" (
	"parent_id" integer NOT NULL,
	"children_id" integer NOT NULL
);
--> statement-breakpoint
DROP TABLE "artist_name_translation";--> statement-breakpoint
DROP TABLE "music_role";--> statement-breakpoint
DROP TABLE "music_role_inheritance";--> statement-breakpoint
ALTER TABLE "release_credit" DROP CONSTRAINT "release_credit_role_id_music_role_id_fk";
--> statement-breakpoint
ALTER TABLE "queue" ALTER COLUMN "status" SET DEFAULT 'Open';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "artist_localized_name" ADD CONSTRAINT "artist_localized_name_artist_id_artist_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artist"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_role_inheritance" ADD CONSTRAINT "credit_role_inheritance_parent_id_credit_role_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."credit_role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_role_inheritance" ADD CONSTRAINT "credit_role_inheritance_children_id_credit_role_id_fk" FOREIGN KEY ("children_id") REFERENCES "public"."credit_role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "artist_localized_name_name_index" ON "artist_localized_name" USING btree ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_credit" ADD CONSTRAINT "release_credit_role_id_credit_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."credit_role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
