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

-- Create tip_likes table
CREATE TABLE IF NOT EXISTS tip_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  tip_id uuid REFERENCES tips(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tip_id)
);

-- Create tip_saves table
CREATE TABLE IF NOT EXISTS tip_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  tip_id uuid REFERENCES tips(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tip_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_id uuid REFERENCES tips(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE tip_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tip_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Tips policies
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

-- Tip likes policies
CREATE POLICY "Anyone can read tip likes"
  ON tip_likes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage their likes"
  ON tip_likes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Tip saves policies
CREATE POLICY "Users can read their saves"
  ON tip_saves
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can manage their saves"
  ON tip_saves
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can read comments"
  ON comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_tips_updated_at ON tips;
CREATE TRIGGER update_tips_updated_at
  BEFORE UPDATE ON tips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tips_user_id_idx ON tips(user_id);
CREATE INDEX IF NOT EXISTS tips_location_idx ON tips(latitude, longitude);
CREATE INDEX IF NOT EXISTS tips_city_idx ON tips(city);
CREATE INDEX IF NOT EXISTS tips_category_idx ON tips(category);
CREATE INDEX IF NOT EXISTS tips_created_at_idx ON tips(created_at DESC);

CREATE INDEX IF NOT EXISTS tip_likes_user_id_idx ON tip_likes(user_id);
CREATE INDEX IF NOT EXISTS tip_likes_tip_id_idx ON tip_likes(tip_id);

CREATE INDEX IF NOT EXISTS tip_saves_user_id_idx ON tip_saves(user_id);
CREATE INDEX IF NOT EXISTS tip_saves_tip_id_idx ON tip_saves(tip_id);

CREATE INDEX IF NOT EXISTS comments_tip_id_idx ON comments(tip_id);
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON comments(user_id);