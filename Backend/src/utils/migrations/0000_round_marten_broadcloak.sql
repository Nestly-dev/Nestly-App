CREATE TABLE IF NOT EXISTS "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"hotel_id" uuid NOT NULL,
	"room_type_id" uuid NOT NULL,
	"check_in_date" date NOT NULL,
	"check_out_date" date NOT NULL,
	"num_guests" integer NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"payment_status" varchar(20) NOT NULL,
	"cancellation_timestamp" timestamp,
	"cancellation_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"original_price" numeric(10, 2) NOT NULL,
	"discounted_price" numeric(10, 2) NOT NULL,
	"discount_percentage" numeric(5, 2) NOT NULL,
	"valid_from" date NOT NULL,
	"valid_to" date NOT NULL,
	"terms_conditions" text,
	"available_inventory" integer NOT NULL,
	"booking_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "destinations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"cover_image_url" text,
	"location_data" jsonb,
	"featured" boolean DEFAULT false,
	"display_order" integer,
	"season_recommendations" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "help_articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"view_count" integer DEFAULT 0,
	"related_articles" uuid[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hotel_locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" uuid NOT NULL,
	"street_address" text NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"country" varchar(100) NOT NULL,
	"postal_code" varchar(20),
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"map_url" text,
	"neighborhood_info" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hotel_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" uuid NOT NULL,
	"media_type" varchar(20) NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hotels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"short_description" text,
	"long_description" text,
	"star_rating" integer NOT NULL,
	"property_type" varchar(50) NOT NULL,
	"built_year" integer,
	"last_renovation_year" integer,
	"chain_affiliation" varchar(100),
	"check_in_time" time NOT NULL,
	"check_out_time" time NOT NULL,
	"cancellation_policy" text,
	"payment_options" text[],
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false,
	"expiry_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "price_modifiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_type_id" uuid NOT NULL,
	"modifier_type" varchar(50) NOT NULL,
	"percentage" numeric(5, 2) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommended_places" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"place_type" varchar(50) NOT NULL,
	"reference_id" uuid NOT NULL,
	"recommendation_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "review_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" uuid NOT NULL,
	"urls" text[],
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"hotel_id" uuid NOT NULL,
	"booking_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"review_text" text,
	"stay_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "room_pricing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_type_id" uuid NOT NULL,
	"base_price" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"tax_percentage" numeric(5, 2) NOT NULL,
	"child_policy" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "room_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"max_occupancy" integer NOT NULL,
	"num_beds" integer NOT NULL,
	"bed_types" text[],
	"room_size" numeric(10, 2),
	"floor_level" integer,
	"total_rooms" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "search_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"search_query" text NOT NULL,
	"filters" jsonb,
	"results_count" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sponsorships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_name" varchar(255) NOT NULL,
	"content_type" varchar(50) NOT NULL,
	"featured_item_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"target_audience" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"activity_type" varchar(50) NOT NULL,
	"target_id" uuid,
	"device_info" jsonb,
	"ip_address" "inet",
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" varchar(50),
	"last_name" varchar(50),
	"phone_number" varchar(20),
	"date_of_birth" date,
	"avatar_url" text,
	"preferred_language" varchar(10) DEFAULT 'en',
	"preferred_currency" varchar(3) DEFAULT 'USD',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text,
	"auth_provider" varchar(20) DEFAULT 'email',
	"email_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_table_username_unique" UNIQUE("username"),
	CONSTRAINT "user_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"video_url" text NOT NULL,
	"thumbnail_url" text,
	"duration" interval,
	"category" varchar(50),
	"display_order" integer,
	"view_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wishlists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"hotel_id" uuid NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deals" ADD CONSTRAINT "deals_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hotel_locations" ADD CONSTRAINT "hotel_locations_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hotel_media" ADD CONSTRAINT "hotel_media_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "price_modifiers" ADD CONSTRAINT "price_modifiers_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review_media" ADD CONSTRAINT "review_media_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room_pricing" ADD CONSTRAINT "room_pricing_room_type_id_room_types_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_types"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room_types" ADD CONSTRAINT "room_types_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "search_history" ADD CONSTRAINT "search_history_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
