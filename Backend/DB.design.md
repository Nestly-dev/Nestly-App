# Database Relations Design

## Authentication & User Tables

```
users
- id (PK) uuid
- username varchar(50) unique
- email varchar(255) unique
- password_hash text
- auth_provider varchar(20)
- email_verified boolean
- created_at timestamp
- updated_at timestamp

user_profiles
- id (PK) uuid
- user_id (FK) uuid -> users.id
- first_name varchar(50)
- last_name varchar(50)
- phone_number varchar(20)
- date_of_birth date
- avatar_url text
- preferred_language varchar(10)
- preferred_currency varchar(3)
- created_at timestamp
- updated_at timestamp

## Hotel Related Tables
hotels
- id (PK) uuid
- name varchar(255)
- short_description text
- long_description text
- star_rating integer
- property_type varchar(50)
- built_year integer
- last_renovation_year integer
- chain_affiliation varchar(100)
- check_in_time time
- check_out_time time
- cancellation_policy text
- payment_options text[]
- status varchar(20)
- created_at timestamp
- updated_at timestamp

hotel_locations
- id (PK) uuid
- hotel_id (FK) uuid -> hotels.id
- street_address text
- city varchar(100)
- state varchar(100)
- country varchar(100)
- postal_code varchar(20)
- latitude decimal
- longitude decimal
- map_url text
- neighborhood_info text
- created_at timestamp
- updated_at timestamp

hotel_media
- id (PK) uuid
- hotel_id (FK) uuid -> hotels.id
- media_type varchar(20)
- url text
- created_at timestamp
- updated_at timestamp

## Room Related Tables
room_types
- id (PK) uuid
- hotel_id (FK) uuid -> hotels.id
- name varchar(100)
- description text
- max_occupancy integer
- num_beds integer
- bed_types text[]
- room_size decimal
- floor_level integer
- total_rooms integer
- created_at timestamp
- updated_at timestamp

room_pricing
- id (PK) uuid
- room_type_id (FK) uuid -> room_types.id
- base_price decimal
- currency varchar(3)
- tax_percentage decimal
- child_policy text
- created_at timestamp
- updated_at timestamp

price_modifiers
- id (PK) uuid
- room_type_id (FK) uuid -> room_types.id
- modifier_type varchar(50)
- percentage decimal
- start_date date
- end_date date
- created_at timestamp
- updated_at timestamp

## Booking Related Tables
bookings
- id (PK) uuid
- user_id (FK) uuid -> users.id
- hotel_id (FK) uuid -> hotels.id
- room_type_id (FK) uuid -> room_types.id
- check_in_date date
- check_out_date date
- num_guests integer
- total_price decimal
- currency varchar(3)
- payment_status varchar(20)
- cancellation_timestamp timestamp
- cancellation_reason text
- created_at timestamp
- updated_at timestamp

## Review System
reviews
- id (PK) uuid
- user_id (FK) uuid -> users.id
- hotel_id (FK) uuid -> hotels.id
- booking_id (FK) uuid -> bookings.id
- rating integer
- review_text text
- stay_date date
- created_at timestamp
- updated_at timestamp

review_media
- id (PK) uuid
- review_id (FK) uuid -> reviews.id
- url text
- created_at timestamp

## Content Discovery Tables
videos
- id (PK) uuid
- title varchar(255)
- video_url text
- thumbnail_url text
- duration interval
- category varchar(50)
- display_order integer
- view_count integer
- created_at timestamp
- updated_at timestamp

destinations
- id (PK) uuid
- name varchar(255)
- description text
- cover_image_url text
- location_data jsonb
- featured boolean
- display_order integer
- season_recommendations text[]
- created_at timestamp
- updated_at timestamp

sponsorships
- id (PK) uuid
- campaign_name varchar(255)
- content_type varchar(50)
- featured_item_id uuid
- start_date date
- end_date date
- target_audience jsonb
- created_at timestamp
- updated_at timestamp

deals
- id (PK) uuid
- hotel_id (FK) uuid -> hotels.id
- title varchar(255)
- description text
- original_price decimal
- discounted_price decimal
- discount_percentage decimal
- valid_from date
- valid_to date
- terms_conditions text
- available_inventory integer
- booking_count integer
- created_at timestamp
- updated_at timestamp

recommended_places
- id (PK) uuid
- name varchar(255)
- place_type varchar(50)
- reference_id uuid
- recommendation_reason text
- created_at timestamp
- updated_at timestamp

## User Engagement Tables
wishlists
- id (PK) uuid
- user_id (FK) uuid -> users.id
- hotel_id (FK) uuid -> hotels.id
- notes text
- created_at timestamp

search_history
- id (PK) uuid
- user_id (FK) uuid -> users.id
- search_query text
- filters jsonb
- results_count integer
- created_at timestamp

user_activity
- id (PK) uuid
- user_id (FK) uuid -> users.id
- activity_type varchar(50)
- target_id uuid
- device_info jsonb
- ip_address inet
- created_at timestamp

## Notification System
notifications
- id (PK) uuid
- user_id (FK) uuid -> users.id
- type varchar(50)
- title varchar(255)
- message text
- read boolean
- expiry_date timestamp
- created_at timestamp

## Support System
help_articles
- id (PK) uuid
- category varchar(100)
- title varchar(255)
- content text
- view_count integer
- related_articles uuid[]
- created_at timestamp
- updated_at timestamp

support_tickets
- id (PK) uuid
- user_id (FK) uuid -> users.id
- subject varchar(255)
- description text
- status varchar(50)
- priority varchar(20)
- resolution_notes text
- created_at timestamp
- updated_at timestamp

## Analytics Tables
user_analytics
- id (PK) uuid
- user_id (FK) uuid -> users.id
- page_views jsonb
- search_patterns jsonb
- booking_patterns jsonb
- session_duration interval
- device_info jsonb
- location_data jsonb
- created_at timestamp

business_metrics
- id (PK) uuid
- hotel_id (FK) uuid -> hotels.id
- metric_type varchar(50)
- value decimal
- period_start date
- period_end date
- created_at timestamp
```
