import {
  pgTable,
  text,
  uuid,
  varchar,
  timestamp,
  boolean,
  date,
  integer,
  time,
  decimal,
  jsonb,
  interval,
  inet,
} from "drizzle-orm/pg-core";

// userTable & Profiles
export const userTable = pgTable('user_table', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password'),
  auth_provider: varchar('auth_provider', { length: 20 }).default('email'),
  email_verified: boolean('email_verified').default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => userTable.id, { onDelete: 'cascade' }).notNull(),
  first_name: varchar('first_name', { length: 50 }),
  last_name: varchar('last_name', { length: 50 }),
  phone_number: varchar('phone_number', { length: 20 }),
  date_of_birth: date('date_of_birth'),
  avatar_url: text('avatar_url'),
  preferred_language: varchar('preferred_language', { length: 10 }).default('en'),
  preferred_currency: varchar('preferred_currency', { length: 3 }).default('USD'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Hotels
export const hotels = pgTable('hotels', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  short_description: text('short_description'),
  long_description: text('long_description'),
  star_rating: integer('star_rating').notNull(),
  property_type: varchar('property_type', { length: 50 }).notNull(),
  built_year: integer('built_year'),
  last_renovation_year: integer('last_renovation_year'),
  chain_affiliation: varchar('chain_affiliation', { length: 100 }),
  check_in_time: time('check_in_time').notNull(),
  check_out_time: time('check_out_time').notNull(),
  cancellation_policy: text('cancellation_policy'),
  payment_options: text('payment_options').array(),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const hotelLocations = pgTable('hotel_locations', {
  id: uuid('id').defaultRandom().primaryKey(),
  hotel_id: uuid('hotel_id').references(() => hotels.id, { onDelete: 'cascade' }).notNull(),
  street_address: text('street_address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  postal_code: varchar('postal_code', { length: 20 }),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  map_url: text('map_url'),
  neighborhood_info: text('neighborhood_info'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const hotelMedia = pgTable('hotel_media', {
  id: uuid('id').defaultRandom().primaryKey(),
  hotel_id: uuid('hotel_id').references(() => hotels.id, { onDelete: 'cascade' }).notNull(),
  media_type: varchar('media_type', { length: 20 }).notNull(),
  url: text('url').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Rooms
export const roomTypes = pgTable('room_types', {
  id: uuid('id').defaultRandom().primaryKey(),
  hotel_id: uuid('hotel_id').references(() => hotels.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  max_occupancy: integer('max_occupancy').notNull(),
  num_beds: integer('num_beds').notNull(),
  bed_types: text('bed_types').array(),
  room_size: decimal('room_size', { precision: 10, scale: 2 }),
  floor_level: integer('floor_level'),
  total_rooms: integer('total_rooms').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const roomPricing = pgTable('room_pricing', {
  id: uuid('id').defaultRandom().primaryKey(),
  room_type_id: uuid('room_type_id').references(() => roomTypes.id, { onDelete: 'cascade' }).notNull(),
  base_price: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  tax_percentage: decimal('tax_percentage', { precision: 5, scale: 2 }).notNull(),
  child_policy: text('child_policy'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const priceModifiers = pgTable('price_modifiers', {
  id: uuid('id').defaultRandom().primaryKey(),
  room_type_id: uuid('room_type_id').references(() => roomTypes.id, { onDelete: 'cascade' }).notNull(),
  modifier_type: varchar('modifier_type', { length: 50 }).notNull(),
  percentage: decimal('percentage', { precision: 5, scale: 2 }).notNull(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Bookings
export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => userTable.id).notNull(),
  hotel_id: uuid('hotel_id').references(() => hotels.id).notNull(),
  room_type_id: uuid('room_type_id').references(() => roomTypes.id).notNull(),
  check_in_date: date('check_in_date').notNull(),
  check_out_date: date('check_out_date').notNull(),
  num_guests: integer('num_guests').notNull(),
  total_price: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  payment_status: varchar('payment_status', { length: 20 }).notNull(),
  cancellation_timestamp: timestamp('cancellation_timestamp'),
  cancellation_reason: text('cancellation_reason'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Reviews
export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => userTable.id).notNull(),
  hotel_id: uuid('hotel_id').references(() => hotels.id).notNull(),
  booking_id: uuid('booking_id').references(() => bookings.id).notNull(),
  rating: integer('rating').notNull(),
  review_text: text('review_text'),
  stay_date: date('stay_date').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const reviewMedia = pgTable('review_media', {
  id: uuid('id').defaultRandom().primaryKey(),
  review_id: uuid('review_id').references(() => reviews.id, { onDelete: 'cascade' }).notNull(),
  urls: text('urls').array(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Content Discovery
export const videos = pgTable('videos', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  video_url: text('video_url').notNull(),
  thumbnail_url: text('thumbnail_url'),
  duration: interval('duration'),
  category: varchar('category', { length: 50 }),
  display_order: integer('display_order'),
  view_count: integer('view_count').default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const destinations = pgTable('destinations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  cover_image_url: text('cover_image_url'),
  location_data: jsonb('location_data'),
  featured: boolean('featured').default(false),
  display_order: integer('display_order'),
  season_recommendations: text('season_recommendations').array(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const sponsorships = pgTable('sponsorships', {
  id: uuid('id').defaultRandom().primaryKey(),
  campaign_name: varchar('campaign_name', { length: 255 }).notNull(),
  content_type: varchar('content_type', { length: 50 }).notNull(),
  featured_item_id: uuid('featured_item_id').notNull(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  target_audience: jsonb('target_audience'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const deals = pgTable('deals', {
  id: uuid('id').defaultRandom().primaryKey(),
  hotel_id: uuid('hotel_id').references(() => hotels.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  original_price: decimal('original_price', { precision: 10, scale: 2 }).notNull(),
  discounted_price: decimal('discounted_price', { precision: 10, scale: 2 }).notNull(),
  discount_percentage: decimal('discount_percentage', { precision: 5, scale: 2 }).notNull(),
  valid_from: date('valid_from').notNull(),
  valid_to: date('valid_to').notNull(),
  terms_conditions: text('terms_conditions'),
  available_inventory: integer('available_inventory').notNull(),
  booking_count: integer('booking_count').default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const recommendedPlaces = pgTable('recommended_places', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  place_type: varchar('place_type', { length: 50 }).notNull(),
  reference_id: uuid('reference_id').notNull(),
  recommendation_reason: text('recommendation_reason'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// User Engagement
export const wishlists = pgTable('wishlists', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => userTable.id).notNull(),
  hotel_id: uuid('hotel_id').references(() => hotels.id).notNull(),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

export const searchHistory = pgTable('search_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => userTable.id).notNull(),
  search_query: text('search_query').notNull(),
  filters: jsonb('filters'),
  results_count: integer('results_count'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

export const userActivity = pgTable('user_activity', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => userTable.id).notNull(),
  activity_type: varchar('activity_type', { length: 50 }).notNull(),
  target_id: uuid('target_id'),
  device_info: jsonb('device_info'),
  ip_address: inet('ip_address'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => userTable.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  read: boolean('read').default(false),
  expiry_date: timestamp('expiry_date'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Support System
export const helpArticles = pgTable('help_articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  category: varchar('category', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  view_count: integer('view_count').default(0),
  related_articles: uuid('related_articles').array(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});
