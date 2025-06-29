/*
  # Create tips and user interaction tables

  1. New Tables
    - `tips`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `content` (text, tip content)
      - `category` (text, tip category)
      - `images` (text array, image URLs)
      - `latitude` (decimal, location latitude)
      - `longitude` (decimal, location longitude)
      - `city` (text, city name)
      - `country` (text, country name)
      - `address` (text, optional address)
      - `likes_count` (integer, cached count)
      - `comments_count` (integer, cached count)
      - `saves_count` (integer, cached count)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tip_likes`
      - `id` (uuid, primary key)
      - `tip_id` (uuid, foreign key to tips)
      - `user_id` (uuid, foreign key to users)
      - `created_at` (timestamp)
    
    - `tip_saves`
      - `id` (uuid, primary key)
      - `tip_id` (uuid, foreign key to tips)
      - `user_id` (uuid, foreign key to users)
      - `created_at` (timestamp)
    
    - `tip_comments`
      - `id` (uuid, primary key)
      - `tip_id` (uuid, foreign key to tips)
      - `user_id` (uuid, foreign key to users)
      - `content` (text, comment content)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Public read access for tips and comments
    - Private access for likes and saves

  3. Functions
    - Trigger functions to update cached counts
    - Updated_at trigger for tips and comments
*/

-- Create tips table
CREATE TABLE IF NOT EXISTS tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'other',
  images text[] DEFAULT '{}',
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  address text,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  saves_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tip_likes table
CREATE TABLE IF NOT EXISTS tip_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_id uuid REFERENCES tips(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tip_id, user_id)
);

-- Create tip_saves table
CREATE TABLE IF NOT EXISTS tip_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_id uuid REFERENCES tips(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tip_id, user_id)
);

-- Create tip_comments table
CREATE TABLE IF NOT EXISTS tip_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_id uuid REFERENCES tips(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tips_user_id_idx ON tips(user_id);
CREATE INDEX IF NOT EXISTS tips_category_idx ON tips(category);
CREATE INDEX IF NOT EXISTS tips_location_idx ON tips(latitude, longitude);
CREATE INDEX IF NOT EXISTS tips_created_at_idx ON tips(created_at DESC);
CREATE INDEX IF NOT EXISTS tip_likes_tip_id_idx ON tip_likes(tip_id);
CREATE INDEX IF NOT EXISTS tip_likes_user_id_idx ON tip_likes(user_id);
CREATE INDEX IF NOT EXISTS tip_saves_tip_id_idx ON tip_saves(tip_id);
CREATE INDEX IF NOT EXISTS tip_saves_user_id_idx ON tip_saves(user_id);
CREATE INDEX IF NOT EXISTS tip_comments_tip_id_idx ON tip_comments(tip_id);
CREATE INDEX IF NOT EXISTS tip_comments_user_id_idx ON tip_comments(user_id);

-- Enable RLS
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE tip_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tip_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE tip_comments ENABLE ROW LEVEL SECURITY;

-- Tips policies
CREATE POLICY "Anyone can read tips"
  ON tips
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create their own tips"
  ON tips
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tips"
  ON tips
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tips"
  ON tips
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Tip likes policies
CREATE POLICY "Anyone can read tip likes"
  ON tip_likes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage their own likes"
  ON tip_likes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Tip saves policies
CREATE POLICY "Users can read their own saves"
  ON tip_saves
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own saves"
  ON tip_saves
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Tip comments policies
CREATE POLICY "Anyone can read comments"
  ON tip_comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create comments"
  ON tip_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON tip_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON tip_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update tip counts
CREATE OR REPLACE FUNCTION update_tip_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'tip_likes' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE tips SET likes_count = likes_count + 1 WHERE id = NEW.tip_id;
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE tips SET likes_count = likes_count - 1 WHERE id = OLD.tip_id;
      RETURN OLD;
    END IF;
  ELSIF TG_TABLE_NAME = 'tip_saves' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE tips SET saves_count = saves_count + 1 WHERE id = NEW.tip_id;
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE tips SET saves_count = saves_count - 1 WHERE id = OLD.tip_id;
      RETURN OLD;
    END IF;
  ELSIF TG_TABLE_NAME = 'tip_comments' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE tips SET comments_count = comments_count + 1 WHERE id = NEW.tip_id;
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE tips SET comments_count = comments_count - 1 WHERE id = OLD.tip_id;
      RETURN OLD;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for count updates
CREATE TRIGGER tip_likes_count_trigger
  AFTER INSERT OR DELETE ON tip_likes
  FOR EACH ROW EXECUTE FUNCTION update_tip_counts();

CREATE TRIGGER tip_saves_count_trigger
  AFTER INSERT OR DELETE ON tip_saves
  FOR EACH ROW EXECUTE FUNCTION update_tip_counts();

CREATE TRIGGER tip_comments_count_trigger
  AFTER INSERT OR DELETE ON tip_comments
  FOR EACH ROW EXECUTE FUNCTION update_tip_counts();

-- Create updated_at triggers
CREATE TRIGGER update_tips_updated_at
  BEFORE UPDATE ON tips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tip_comments_updated_at
  BEFORE UPDATE ON tip_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();