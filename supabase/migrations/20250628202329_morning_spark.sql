/*
  # Create tips table

  1. New Tables
    - `tips`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `content` (text)
      - `location_name` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `city` (text)
      - `country` (text)
      - `category` (text)
      - `photos` (text array, optional)
      - `likes_count` (integer, default 0)
      - `saves_count` (integer, default 0)
      - `comments_count` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `tips` table
    - Add policies for CRUD operations
*/

-- Create tips table
CREATE TABLE IF NOT EXISTS tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  location_name text NOT NULL,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  category text NOT NULL CHECK (category IN (
    'food', 'cafe', 'coworking', 'accommodation', 'transport',
    'entertainment', 'shopping', 'health', 'nature', 'culture'
  )),
  photos text[],
  likes_count integer DEFAULT 0,
  saves_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read tips"
  ON tips
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create tips"
  ON tips
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tips"
  ON tips
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tips"
  ON tips
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_tips_updated_at ON tips;
CREATE TRIGGER update_tips_updated_at
  BEFORE UPDATE ON tips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tips_user_id_idx ON tips(user_id);
CREATE INDEX IF NOT EXISTS tips_location_idx ON tips(latitude, longitude);
CREATE INDEX IF NOT EXISTS tips_city_idx ON tips(city);
CREATE INDEX IF NOT EXISTS tips_category_idx ON tips(category);
CREATE INDEX IF NOT EXISTS tips_created_at_idx ON tips(created_at DESC);