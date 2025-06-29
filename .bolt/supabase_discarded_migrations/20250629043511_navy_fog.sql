/*
  # Create a single test user for demo

  1. Approach
    - Create one realistic test user with complete profile
    - Add a few sample tips from this user
    - This will work with the auth system properly

  2. Test User
    - Email: demo@nomadtips.com
    - Nickname: DemoNomad
    - Complete profile and some tips
*/

-- Insert a single demo user (this represents an authenticated user)
-- Note: In production, this would be created through the signup process
-- For demo purposes, we'll create the profile data that would be created after signup

DO $$
DECLARE
    demo_user_id uuid := '550e8400-e29b-41d4-a716-446655440001';
BEGIN
    -- Check if user already exists, if not insert
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = demo_user_id) THEN
        -- Temporarily disable triggers to allow direct insert
        ALTER TABLE users DISABLE TRIGGER ALL;
        
        INSERT INTO users (id, email, nickname, bio, points, trust_level, created_at) VALUES
        (demo_user_id, 'demo@nomadtips.com', 'DemoNomad', 'Full-stack developer 💻 | 2 years in Bangkok | Coffee addict ☕', 450, 85, '2024-01-15T08:30:00Z');
        
        -- Re-enable triggers
        ALTER TABLE users ENABLE TRIGGER ALL;
    END IF;
END $$;

-- Insert user profile
INSERT INTO user_profiles (user_id, full_name, location, website, instagram, twitter, linkedin, languages, interests, travel_style, work_type) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Alex Johnson', 'Bangkok, Thailand', 'https://alexcodes.dev', 'alexbangkok', 'alex_codes_th', 'https://linkedin.com/in/alexjohnson', ARRAY['English', 'Thai', 'Spanish'], ARRAY['Coding', 'Coffee', 'Muay Thai', 'Street Food'], 'Slow travel', 'Software Development')
ON CONFLICT (user_id) DO NOTHING;

-- Insert a few sample tips from this user
INSERT INTO tips (id, user_id, content, category, images, latitude, longitude, city, country, address, likes_count, comments_count, saves_count, created_at) VALUES
('tip-demo-001', '550e8400-e29b-41d4-a716-446655440001', 'Amazing coworking cafe in Thonglor! Super fast WiFi (200+ Mbps), plenty of power outlets, and the best flat white in Bangkok ☕ Open 24/7 and very nomad-friendly. They even have phone booths for calls!', 'cafe', ARRAY['https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7308, 100.5418, 'Bangkok', 'Thailand', 'Thonglor District', 15, 3, 8, '2024-12-20T09:30:00Z'),

('tip-demo-002', '550e8400-e29b-41d4-a716-446655440001', 'Premium coworking space in Silom! Day pass is 500 THB, monthly unlimited is 8000 THB. Amazing facilities: meeting rooms, printing, fast WiFi, and great networking events 💻', 'workspace', ARRAY['https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7307, 100.5418, 'Bangkok', 'Thailand', 'Silom District', 22, 2, 12, '2024-12-21T10:00:00Z'),

('tip-demo-003', '550e8400-e29b-41d4-a716-446655440001', 'Essential apps for Bangkok nomads: Grab (transport), Foodpanda (delivery), Google Translate (Thai), and Wise (banking). Download these before you arrive! 📱', 'other', NULL, 13.7563, 100.5018, 'Bangkok', 'Thailand', NULL, 35, 8, 25, '2024-12-21T20:15:00Z')
ON CONFLICT (id) DO NOTHING;

-- Initialize user stats
INSERT INTO user_stats (user_id, tips_count, likes_received, comments_received, saves_received, cities_visited, countries_visited, last_activity)
SELECT 
  '550e8400-e29b-41d4-a716-446655440001',
  COUNT(DISTINCT t.id),
  COALESCE(SUM(t.likes_count), 0),
  COALESCE(SUM(t.comments_count), 0),
  COALESCE(SUM(t.saves_count), 0),
  COUNT(DISTINCT t.city),
  COUNT(DISTINCT t.country),
  MAX(t.created_at)
FROM tips t
WHERE t.user_id = '550e8400-e29b-41d4-a716-446655440001'
ON CONFLICT (user_id) DO UPDATE SET
  tips_count = EXCLUDED.tips_count,
  likes_received = EXCLUDED.likes_received,
  comments_received = EXCLUDED.comments_received,
  saves_received = EXCLUDED.saves_received,
  cities_visited = EXCLUDED.cities_visited,
  countries_visited = EXCLUDED.countries_visited,
  last_activity = EXCLUDED.last_activity,
  updated_at = now();