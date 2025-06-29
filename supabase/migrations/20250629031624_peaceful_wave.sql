/*
  # Create user profiles and statistics tables

  1. New Tables
    - `user_profiles` (extended user information)
      - `user_id` (uuid, foreign key to users)
      - `full_name` (text, optional full name)
      - `location` (text, current location)
      - `website` (text, personal website)
      - `instagram` (text, Instagram handle)
      - `twitter` (text, Twitter handle)
      - `linkedin` (text, LinkedIn profile)
      - `languages` (text array, spoken languages)
      - `interests` (text array, interests/hobbies)
      - `travel_style` (text, travel preferences)
      - `work_type` (text, type of work)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_stats` (cached user statistics)
      - `user_id` (uuid, foreign key to users)
      - `tips_count` (integer, total tips written)
      - `likes_received` (integer, total likes on tips)
      - `comments_received` (integer, total comments on tips)
      - `saves_received` (integer, total saves on tips)
      - `cities_visited` (integer, unique cities from tips)
      - `countries_visited` (integer, unique countries from tips)
      - `last_activity` (timestamp, last tip or interaction)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can read public profile info
    - Users can only edit their own profiles
    - Stats are publicly readable but system-managed

  3. Functions
    - Function to update user statistics
    - Triggers to maintain stats consistency
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name text,
  location text,
  website text,
  instagram text,
  twitter text,
  linkedin text,
  languages text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  travel_style text,
  work_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  tips_count integer DEFAULT 0,
  likes_received integer DEFAULT 0,
  comments_received integer DEFAULT 0,
  saves_received integer DEFAULT 0,
  cities_visited integer DEFAULT 0,
  countries_visited integer DEFAULT 0,
  last_activity timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Anyone can read user profiles"
  ON user_profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User stats policies
CREATE POLICY "Anyone can read user stats"
  ON user_stats
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "System can manage user stats"
  ON user_stats
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update user statistics
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Determine which user's stats to update
  IF TG_TABLE_NAME = 'tips' THEN
    target_user_id := COALESCE(NEW.user_id, OLD.user_id);
  ELSIF TG_TABLE_NAME = 'tip_likes' THEN
    -- Update stats for the tip owner, not the liker
    SELECT user_id INTO target_user_id FROM tips WHERE id = COALESCE(NEW.tip_id, OLD.tip_id);
  ELSIF TG_TABLE_NAME = 'tip_comments' THEN
    -- Update stats for the tip owner, not the commenter
    SELECT user_id INTO target_user_id FROM tips WHERE id = COALESCE(NEW.tip_id, OLD.tip_id);
  ELSIF TG_TABLE_NAME = 'tip_saves' THEN
    -- Update stats for the tip owner, not the saver
    SELECT user_id INTO target_user_id FROM tips WHERE id = COALESCE(NEW.tip_id, OLD.tip_id);
  END IF;

  -- Update or insert user stats
  INSERT INTO user_stats (user_id, tips_count, likes_received, comments_received, saves_received, cities_visited, countries_visited, last_activity)
  SELECT 
    target_user_id,
    COALESCE(tips_count, 0),
    COALESCE(likes_count, 0),
    COALESCE(comments_count, 0),
    COALESCE(saves_count, 0),
    COALESCE(cities_count, 0),
    COALESCE(countries_count, 0),
    now()
  FROM (
    SELECT
      COUNT(DISTINCT t.id) as tips_count,
      COALESCE(SUM(t.likes_count), 0) as likes_count,
      COALESCE(SUM(t.comments_count), 0) as comments_count,
      COALESCE(SUM(t.saves_count), 0) as saves_count,
      COUNT(DISTINCT t.city) as cities_count,
      COUNT(DISTINCT t.country) as countries_count
    FROM tips t
    WHERE t.user_id = target_user_id
  ) stats
  ON CONFLICT (user_id) 
  DO UPDATE SET
    tips_count = EXCLUDED.tips_count,
    likes_received = EXCLUDED.likes_received,
    comments_received = EXCLUDED.comments_received,
    saves_received = EXCLUDED.saves_received,
    cities_visited = EXCLUDED.cities_visited,
    countries_visited = EXCLUDED.countries_visited,
    last_activity = EXCLUDED.last_activity,
    updated_at = now();

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for user stats updates
CREATE TRIGGER update_user_stats_on_tips
  AFTER INSERT OR UPDATE OR DELETE ON tips
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

CREATE TRIGGER update_user_stats_on_likes
  AFTER INSERT OR DELETE ON tip_likes
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

CREATE TRIGGER update_user_stats_on_comments
  AFTER INSERT OR DELETE ON tip_comments
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

CREATE TRIGGER update_user_stats_on_saves
  AFTER INSERT OR DELETE ON tip_saves
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- Create updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to initialize user profile and stats when user is created
CREATE OR REPLACE FUNCTION initialize_user_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile
  INSERT INTO user_profiles (user_id) VALUES (NEW.id);
  
  -- Create user stats
  INSERT INTO user_stats (user_id) VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to initialize user data
CREATE TRIGGER initialize_user_data_trigger
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION initialize_user_data();