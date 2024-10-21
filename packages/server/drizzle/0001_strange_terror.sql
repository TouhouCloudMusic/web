DO $$ BEGIN
 CREATE TYPE "public"."artist_type" AS ENUM('Person', 'Group');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."date_precision" AS ENUM('Year', 'Month', 'Day');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."vote_level" AS ENUM('Boolean', 'Tiered');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."tag_type" AS ENUM('Genre', 'Descriptor');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alias_group" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "alias_group_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artist" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "artist_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(128) NOT NULL,
	"artist_type" "artist_type" NOT NULL,
	"text_alias" varchar(128)[],
	"alias_group_id" integer,
	"start_date" date,
	"start_date_prec" "date_precision",
	"end_date" date,
	"end_date_prec" "date_precision",
	"start_location" "location_tuple",
	"current_location" "location_tuple",
	"end_location" "location_tuple",
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artist_name_translation" (
	"artist_id" integer NOT NULL,
	"language" smallint NOT NULL,
	"name" varchar(128) NOT NULL,
	CONSTRAINT "artist_name_translation_artist_id_language_name_pk" PRIMARY KEY("artist_id","language","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group_member" (
	"member_id" integer NOT NULL,
	"group_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "label" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "label_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(128) NOT NULL,
	"founded_date" date,
	"founded_date_prec" "date_precision",
	"dissolved_date" date,
	"dissolved_date_prec" "date_precision",
	"founded_location" "location_tuple",
	"dissolved_location" "location_tuple",
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "label_founder" (
	"label_id" integer NOT NULL,
	"artist_id" integer NOT NULL,
	CONSTRAINT "label_founder_label_id_artist_id_pk" PRIMARY KEY("label_id","artist_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "label_name_translation" (
	"label_id" integer NOT NULL,
	"language" smallint NOT NULL,
	"name" varchar(128) NOT NULL,
	CONSTRAINT "label_name_translation_label_id_language_name_pk" PRIMARY KEY("label_id","language","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "language" (
	"id" smallint PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "release_type" (
	"id" smallint PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "music_role" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "music_role_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(128) NOT NULL,
	"alias" varchar(128)[],
	"short_desc" varchar(128),
	"description" text,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "music_role_inheritance" (
	"parent_id" integer NOT NULL,
	"children_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tag" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tag_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(128) NOT NULL,
	"type" "tag_type" NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "release" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "release_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(128) NOT NULL,
	"catalog_number" varchar(16),
	"recording_date_end_prec" "date_precision",
	"recording_date_end" date,
	"recording_date_start_prec" "date_precision",
	"recording_date_start" date,
	"release_date_prec" "date_precision",
	"release_date" date,
	"release_type" smallint NOT NULL,
	"total_disc" integer,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "release_artist" (
	"release_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	CONSTRAINT "release_artist_release_id_member_id_pk" PRIMARY KEY("release_id","member_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "release_credit" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "release_credit_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"artist_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	"display_name" varchar(128),
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"release_id" integer NOT NULL,
	"on" smallint[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "release_label" (
	"release_id" integer NOT NULL,
	"label_id" integer NOT NULL,
	CONSTRAINT "release_label_release_id_label_id_pk" PRIMARY KEY("release_id","label_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "release_title_translation" (
	"release_id" integer NOT NULL,
	"language" smallint NOT NULL,
	"title" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "release_track" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "release_track_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"release_id" integer NOT NULL,
	"song_id" integer NOT NULL,
	"track_order" integer NOT NULL,
	"track_number" varchar(4),
	"overwrite_title" varchar(128)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "release_track_credit" (
	"release_track_id" integer NOT NULL,
	"artist_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "song" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "song_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"languages" smallint[],
	"duration" interval hour to second,
	"lyric" text,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "song_artist" (
	"song_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	CONSTRAINT "song_artist_song_id_member_id_pk" PRIMARY KEY("song_id","member_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "song_title_translation" (
	"song_id" integer NOT NULL,
	"language" smallint NOT NULL,
	"title" varchar(128) NOT NULL,
	CONSTRAINT "song_title_translation_song_id_language_pk" PRIMARY KEY("song_id","language")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "session_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(16) NOT NULL,
	"email" varchar(128),
	"password" text NOT NULL,
	"location" "location_tuple",
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "artist" ADD CONSTRAINT "artist_alias_group_id_alias_group_id_fk" FOREIGN KEY ("alias_group_id") REFERENCES "public"."alias_group"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "artist_name_translation" ADD CONSTRAINT "artist_name_translation_artist_id_artist_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artist"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_member" ADD CONSTRAINT "group_member_member_id_artist_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."artist"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_member" ADD CONSTRAINT "group_member_group_id_artist_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."artist"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "label_founder" ADD CONSTRAINT "label_founder_label_id_label_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."label"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "label_founder" ADD CONSTRAINT "label_founder_artist_id_artist_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artist"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "label_name_translation" ADD CONSTRAINT "label_name_translation_label_id_label_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."label"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "music_role_inheritance" ADD CONSTRAINT "music_role_inheritance_parent_id_music_role_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."music_role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "music_role_inheritance" ADD CONSTRAINT "music_role_inheritance_children_id_music_role_id_fk" FOREIGN KEY ("children_id") REFERENCES "public"."music_role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release" ADD CONSTRAINT "release_release_type_release_type_id_fk" FOREIGN KEY ("release_type") REFERENCES "public"."release_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_artist" ADD CONSTRAINT "release_artist_release_id_release_id_fk" FOREIGN KEY ("release_id") REFERENCES "public"."release"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_artist" ADD CONSTRAINT "release_artist_member_id_artist_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."artist"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_credit" ADD CONSTRAINT "release_credit_artist_id_artist_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artist"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_credit" ADD CONSTRAINT "release_credit_role_id_music_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."music_role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_credit" ADD CONSTRAINT "release_credit_release_id_release_id_fk" FOREIGN KEY ("release_id") REFERENCES "public"."release"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_label" ADD CONSTRAINT "release_label_release_id_release_id_fk" FOREIGN KEY ("release_id") REFERENCES "public"."release"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_label" ADD CONSTRAINT "release_label_label_id_artist_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."artist"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_title_translation" ADD CONSTRAINT "release_title_translation_release_id_release_id_fk" FOREIGN KEY ("release_id") REFERENCES "public"."release"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_track" ADD CONSTRAINT "release_track_release_id_release_id_fk" FOREIGN KEY ("release_id") REFERENCES "public"."release"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_track" ADD CONSTRAINT "release_track_song_id_song_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."song"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_track_credit" ADD CONSTRAINT "release_track_credit_release_track_id_release_track_id_fk" FOREIGN KEY ("release_track_id") REFERENCES "public"."release_track"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_track_credit" ADD CONSTRAINT "release_track_credit_artist_id_artist_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artist"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "song_artist" ADD CONSTRAINT "song_artist_song_id_song_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."song"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "song_artist" ADD CONSTRAINT "song_artist_member_id_artist_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."artist"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "song_title_translation" ADD CONSTRAINT "song_title_translation_song_id_song_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."song"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "artist_name_translation_name_index" ON "artist_name_translation" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "group_member_member_id_group_id_index" ON "group_member" USING btree ("member_id","group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "label_name_translation_name_index" ON "label_name_translation" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "release_credit_artist_id_role_id_release_id_index" ON "release_credit" USING btree ("artist_id","role_id","release_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "song_title_translation_title_index" ON "song_title_translation" USING btree ("title");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_name_index" ON "user" USING btree ("name");