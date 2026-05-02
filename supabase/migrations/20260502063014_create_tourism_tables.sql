/*
  # Indian Tourister - Tourism Website Schema

  1. New Tables
    - `destinations`
      - `id` (uuid, primary key)
      - `name` (text) - destination name
      - `description` (text)
      - `image_url` (text) - Pexels image URL
      - `package_amount` (numeric) - price in INR
      - `distance_km` (integer) - distance from Bengaluru in km
      - `duration_days` (integer)
      - `category` (text) - beach, hill, heritage, wildlife, etc.
      - `created_at` (timestamptz)

    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `destination_id` (uuid, references destinations)
      - `travel_date` (date)
      - `num_travelers` (integer)
      - `total_amount` (numeric)
      - `status` (text) - pending, confirmed, cancelled
      - `payment_status` (text) - pending, paid, failed
      - `payment_ref` (text)
      - `created_at` (timestamptz)

  2. Security
    - RLS enabled on both tables
    - Destinations are publicly readable
    - Bookings are only accessible by owner
*/

CREATE TABLE IF NOT EXISTS destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  package_amount numeric NOT NULL DEFAULT 0,
  distance_km integer NOT NULL DEFAULT 0,
  duration_days integer NOT NULL DEFAULT 1,
  category text NOT NULL DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Destinations are publicly viewable"
  ON destinations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  destination_id uuid NOT NULL REFERENCES destinations(id),
  travel_date date NOT NULL,
  num_travelers integer NOT NULL DEFAULT 1,
  total_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'pending',
  payment_ref text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

INSERT INTO destinations (name, description, image_url, package_amount, distance_km, duration_days, category) VALUES
  ('Goa Beaches', 'Pristine beaches, vibrant nightlife, and Portuguese heritage. Enjoy sun, sand, and seafood along the Konkan coast.', 'https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg', 12999, 556, 5, 'beach'),
  ('Munnar Hill Station', 'Lush tea gardens, misty hills, and cool climate make Munnar Kerala''s crown jewel for nature lovers.', 'https://images.pexels.com/photos/1660995/pexels-photo-1660995.jpeg', 8999, 470, 4, 'hill'),
  ('Ooty Nilgiris', 'The Queen of Hill Stations with scenic toy train rides, botanical gardens, and refreshing mountain air.', 'https://images.pexels.com/photos/2122361/pexels-photo-2122361.jpeg', 6999, 270, 3, 'hill'),
  ('Mysore Heritage', 'Royal palaces, grand Dasara celebrations, and exquisite silk — Mysore is Karnataka''s cultural capital.', 'https://images.pexels.com/photos/3697742/pexels-photo-3697742.jpeg', 4999, 150, 2, 'heritage'),
  ('Coorg Coffee Trail', 'Walk through misty coffee plantations, witness cascading waterfalls, and experience Kodava culture.', 'https://images.pexels.com/photos/1537086/pexels-photo-1537086.jpeg', 7499, 260, 3, 'nature'),
  ('Kerala Backwaters', 'Glide through tranquil lagoons on a houseboat, surrounded by swaying palms and serene village life.', 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg', 14999, 580, 5, 'water'),
  ('Hampi Ruins', 'Ancient Vijayanagara empire ruins spread across boulder-strewn landscape — a UNESCO World Heritage Site.', 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg', 5499, 340, 3, 'heritage'),
  ('Agra Taj Mahal', 'Witness the eternal monument of love, the Taj Mahal, along with Agra Fort and Fatehpur Sikri.', 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg', 18999, 1900, 4, 'heritage'),
  ('Rajasthan Desert Tour', 'Camel rides on golden dunes, majestic forts, vibrant bazaars, and the magic of Rajputana culture.', 'https://images.pexels.com/photos/1007431/pexels-photo-1007431.jpeg', 22999, 1900, 7, 'heritage'),
  ('Andaman Islands', 'Crystal-clear turquoise waters, coral reefs, pristine beaches, and unique flora and fauna.', 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg', 29999, 2200, 7, 'beach'),
  ('Wayanad Wildlife', 'Dense forests, tribal culture, wildlife sanctuaries, and breathtaking viewpoints in Kerala''s highlands.', 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg', 7999, 280, 3, 'wildlife'),
  ('Pondicherry French Town', 'French colonial architecture, serene beaches, ashrams, and exquisite cuisine along the Coromandel coast.', 'https://images.pexels.com/photos/2104742/pexels-photo-2104742.jpeg', 5999, 310, 3, 'beach'),
  ('Shimla Manali', 'Snow-capped peaks, adventure sports, apple orchards, and stunning Himalayan vistas in Himachal Pradesh.', 'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg', 25999, 2600, 8, 'hill'),
  ('Darjeeling Tea Garden', 'Sunrise over Kanchenjunga, toy train rides, aromatic tea gardens, and rich Nepali-Bengali culture.', 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg', 19999, 1900, 6, 'hill'),
  ('Varanasi Holy City', 'Ancient ghats on the Ganges, evening aarti, temples, and the spiritual heartbeat of India.', 'https://images.pexels.com/photos/2482452/pexels-photo-2482452.jpeg', 16999, 1700, 4, 'spiritual'),
  ('Leh Ladakh', 'Moon-like landscapes, Buddhist monasteries, high-altitude lakes, and the ultimate biking adventure.', 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg', 34999, 3000, 10, 'adventure'),
  ('Sundarbans Delta', 'World''s largest mangrove forest, Royal Bengal Tigers, and unique ecosystem at the Ganges delta.', 'https://images.pexels.com/photos/598745/pexels-photo-598745.jpeg', 13999, 1800, 5, 'wildlife'),
  ('Kaziranga Rhino Park', 'Home to two-thirds of the world''s one-horned rhinos. Jeep safaris through lush Assam floodplains.', 'https://images.pexels.com/photos/52500/elephant-africa-african-elephant-animal-52500.jpeg', 21999, 2200, 6, 'wildlife'),
  ('Puri Jagannath', 'Sacred Jagannath Temple, Puri beach, Chilika Lake, and vibrant Odishan handicrafts and culture.', 'https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg', 10999, 1100, 4, 'spiritual'),
  ('Rann of Kutch', 'Vast white salt desert, full moon festival, tribal art, and the unique landscape of Gujarat.', 'https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg', 17999, 1600, 5, 'nature'),
  ('Coimbatore Temples', 'Ancient Tamil temples, Vellingiri Hills, textile heritage, and gateway to the Nilgiri hills.', 'https://images.pexels.com/photos/3577561/pexels-photo-3577561.jpeg', 4499, 360, 2, 'heritage'),
  ('Nainital Lake District', 'Serene Himalayan lake, boat rides, cable car, lush forests, and charming colonial hill town.', 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg', 20999, 2400, 6, 'hill'),
  ('Gokarna Beach Retreat', 'Unspoiled beaches, Om Beach, temple town atmosphere, and the perfect off-beat coastal getaway.', 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg', 5499, 480, 3, 'beach')
ON CONFLICT DO NOTHING;
