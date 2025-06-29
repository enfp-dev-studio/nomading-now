/*
  # Create seed data for Bangkok nomads demo

  1. Seed Data
    - Create realistic user profiles for Bangkok nomads
    - Add diverse tips across all categories
    - Include user interactions (likes, saves, comments)
    - Populate user profiles and stats

  2. Approach
    - Temporarily disable foreign key constraint for demo data
    - Insert comprehensive seed data
    - Re-enable constraints
    - Update cached counts

  Note: In production, users would be created through the auth system
*/

-- Temporarily disable the foreign key constraint for demo purposes
ALTER TABLE users DISABLE TRIGGER ALL;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Insert demo users (these represent authenticated users in our demo)
INSERT INTO users (id, email, nickname, bio, points, trust_level, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'alex.nomad@example.com', 'AlexBangkok', 'Full-stack developer 💻 | 2 years in Bangkok | Coffee addict ☕', 450, 85, '2024-01-15T08:30:00Z'),
  ('550e8400-e29b-41d4-a716-446655440002', 'sarah.travels@example.com', 'SarahExplores', 'UX Designer 🎨 | Digital nomad since 2022 | Love street food 🍜', 320, 75, '2024-02-20T10:15:00Z'),
  ('550e8400-e29b-41d4-a716-446655440003', 'mike.codes@example.com', 'MikeCodes', 'Software engineer | Remote work enthusiast | Fitness lover 🏋️‍♂️', 280, 70, '2024-03-10T14:20:00Z'),
  ('550e8400-e29b-41d4-a716-446655440004', 'emma.writes@example.com', 'EmmaWrites', 'Content writer & blogger ✍️ | Documenting nomad life | Yoga practitioner 🧘‍♀️', 380, 80, '2024-01-25T09:45:00Z'),
  ('550e8400-e29b-41d4-a716-446655440005', 'david.markets@example.com', 'DavidMarketing', 'Digital marketer 📈 | Growth hacker | Bangkok food explorer 🍽️', 220, 65, '2024-04-05T16:30:00Z'),
  ('550e8400-e29b-41d4-a716-446655440006', 'lisa.designs@example.com', 'LisaDesigns', 'Graphic designer 🎨 | Freelancer | Art gallery enthusiast 🖼️', 340, 78, '2024-02-14T11:20:00Z'),
  ('550e8400-e29b-41d4-a716-446655440007', 'tom.consults@example.com', 'TomConsults', 'Business consultant 💼 | Startup advisor | Networking pro 🤝', 520, 90, '2024-01-08T07:15:00Z'),
  ('550e8400-e29b-41d4-a716-446655440008', 'anna.photos@example.com', 'AnnaPhotos', 'Travel photographer 📸 | Visual storyteller | Adventure seeker 🌍', 410, 82, '2024-03-22T13:10:00Z');

-- Re-enable triggers for users table
ALTER TABLE users ENABLE TRIGGER ALL;

-- Insert user profiles with detailed information
INSERT INTO user_profiles (user_id, full_name, location, website, instagram, twitter, linkedin, languages, interests, travel_style, work_type) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Alex Johnson', 'Bangkok, Thailand', 'https://alexcodes.dev', 'alexbangkok', 'alex_codes_th', 'https://linkedin.com/in/alexjohnson', ARRAY['English', 'Thai', 'Spanish'], ARRAY['Coding', 'Coffee', 'Muay Thai', 'Street Food'], 'Slow travel', 'Software Development'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Sarah Chen', 'Bangkok, Thailand', 'https://sarahdesigns.co', 'sarahexplores', 'sarah_ux_nomad', 'https://linkedin.com/in/sarahchen', ARRAY['English', 'Mandarin', 'Thai'], ARRAY['Design', 'Food', 'Temples', 'Markets'], 'Cultural immersion', 'UX/UI Design'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Mike Rodriguez', 'Bangkok, Thailand', NULL, 'mikecodes_bkk', NULL, 'https://linkedin.com/in/mikerodriguez', ARRAY['English', 'Spanish'], ARRAY['Fitness', 'Technology', 'Boxing', 'Coworking'], 'Active lifestyle', 'Software Engineering'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Emma Thompson', 'Bangkok, Thailand', 'https://emmawrites.blog', 'emmawritesbkk', 'emma_nomad_writer', NULL, ARRAY['English', 'French'], ARRAY['Writing', 'Yoga', 'Meditation', 'Local Culture'], 'Mindful travel', 'Content Writing'),
  ('550e8400-e29b-41d4-a716-446655440005', 'David Kim', 'Bangkok, Thailand', NULL, 'davidmarkets', 'david_growth_bkk', 'https://linkedin.com/in/davidkim', ARRAY['English', 'Korean', 'Thai'], ARRAY['Marketing', 'Food', 'Networking', 'Startups'], 'Business travel', 'Digital Marketing'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Lisa Andersson', 'Bangkok, Thailand', 'https://lisadesigns.studio', 'lisadesigns_bkk', NULL, NULL, ARRAY['English', 'Swedish', 'Thai'], ARRAY['Design', 'Art', 'Photography', 'Culture'], 'Creative exploration', 'Graphic Design'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Tom Wilson', 'Bangkok, Thailand', 'https://tomconsults.com', 'tomconsults', 'tom_business_th', 'https://linkedin.com/in/tomwilson', ARRAY['English', 'German'], ARRAY['Business', 'Networking', 'Golf', 'Fine Dining'], 'Business luxury', 'Business Consulting'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Anna Kowalski', 'Bangkok, Thailand', 'https://annaphotos.com', 'annaphotos_bkk', 'anna_photos_th', NULL, ARRAY['English', 'Polish', 'Thai'], ARRAY['Photography', 'Travel', 'Street Art', 'Adventure'], 'Adventure travel', 'Photography');

-- Insert realistic tips across Bangkok with proper coordinates
INSERT INTO tips (id, user_id, content, category, images, latitude, longitude, city, country, address, likes_count, comments_count, saves_count, created_at) VALUES
  -- Cafe tips
  ('tip-001', '550e8400-e29b-41d4-a716-446655440001', 'Amazing coworking cafe in Thonglor! Super fast WiFi (200+ Mbps), plenty of power outlets, and the best flat white in Bangkok ☕ Open 24/7 and very nomad-friendly. They even have phone booths for calls!', 'cafe', ARRAY['https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7308, 100.5418, 'Bangkok', 'Thailand', 'Thonglor District', 0, 0, 0, '2024-12-20T09:30:00Z'),
  
  ('tip-002', '550e8400-e29b-41d4-a716-446655440002', 'Hidden gem cafe in Ari! Local vibe, amazing Thai coffee, and super affordable. Perfect for morning work sessions. The owner speaks great English and loves chatting with nomads 😊', 'cafe', ARRAY['https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7794, 100.5426, 'Bangkok', 'Thailand', 'Ari District', 0, 0, 0, '2024-12-18T08:15:00Z'),
  
  -- Food tips
  ('tip-003', '550e8400-e29b-41d4-a716-446655440005', 'BEST pad thai in Bangkok! This street vendor near Saphan Phut has been here for 30+ years. Only 60 THB and portions are huge! Go around 7-8pm for the freshest ingredients 🍜', 'food', ARRAY['https://images.pexels.com/photos/1600727/pexels-photo-1600727.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7465, 100.5351, 'Bangkok', 'Thailand', 'Saphan Phut Market', 0, 0, 0, '2024-12-19T19:45:00Z'),
  
  ('tip-004', '550e8400-e29b-41d4-a716-446655440004', 'Incredible vegetarian restaurant in Sukhumvit! They have amazing mock meat dishes that even carnivores love. Very clean, AC, and English menu. Perfect for nomads with dietary restrictions 🌱', 'food', ARRAY['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7563, 100.5018, 'Bangkok', 'Thailand', 'Sukhumvit Road', 0, 0, 0, '2024-12-17T12:30:00Z'),
  
  -- Accommodation tips
  ('tip-005', '550e8400-e29b-41d4-a716-446655440007', 'Luxury serviced apartment in Sathorn with amazing city views! Monthly rates are very reasonable (35k THB), includes gym, pool, and coworking space. Perfect for longer stays 🏢', 'accommodation', ARRAY['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7200, 100.5300, 'Bangkok', 'Thailand', 'Sathorn District', 0, 0, 0, '2024-12-16T14:20:00Z'),
  
  ('tip-006', '550e8400-e29b-41d4-a716-446655440003', 'Great hostel in Khao San area with private rooms! Super social atmosphere, rooftop bar, and lots of nomads. Only 800 THB/night for private room with AC. Book in advance! 🏨', 'accommodation', ARRAY['https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7590, 100.4977, 'Bangkok', 'Thailand', 'Khao San Road', 0, 0, 0, '2024-12-15T16:45:00Z'),
  
  -- Workspace tips
  ('tip-007', '550e8400-e29b-41d4-a716-446655440001', 'Premium coworking space in Silom! Day pass is 500 THB, monthly unlimited is 8000 THB. Amazing facilities: meeting rooms, printing, fast WiFi, and great networking events 💻', 'workspace', ARRAY['https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7307, 100.5418, 'Bangkok', 'Thailand', 'Silom District', 0, 0, 0, '2024-12-21T10:00:00Z'),
  
  ('tip-008', '550e8400-e29b-41d4-a716-446655440006', 'Free coworking space in Central Embassy mall! Yes, completely free! Great for short work sessions, has WiFi and charging stations. Plus you can grab food from the amazing food court 🛍️', 'workspace', ARRAY['https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7440, 100.5416, 'Bangkok', 'Thailand', 'Central Embassy', 0, 0, 0, '2024-12-14T13:15:00Z'),
  
  -- Exercise tips
  ('tip-009', '550e8400-e29b-41d4-a716-446655440003', 'Authentic Muay Thai gym in Thonglor! Very welcoming to beginners, English-speaking trainers, and great workout. 500 THB per session or 6000 THB monthly. Amazing way to stay fit! 🥊', 'exercise', ARRAY['https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7280, 100.5450, 'Bangkok', 'Thailand', 'Thonglor District', 0, 0, 0, '2024-12-20T18:30:00Z'),
  
  ('tip-010', '550e8400-e29b-41d4-a716-446655440004', 'Beautiful yoga studio in Ari with English classes! Morning sessions at 7am are perfect before work. Very peaceful atmosphere and experienced teachers. Drop-in rate: 400 THB 🧘‍♀️', 'exercise', ARRAY['https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7800, 100.5400, 'Bangkok', 'Thailand', 'Ari District', 0, 0, 0, '2024-12-13T07:30:00Z'),
  
  -- Entertainment tips
  ('tip-011', '550e8400-e29b-41d4-a716-446655440008', 'Amazing rooftop bar in Sukhumvit with 360° city views! Happy hour 5-7pm with 50% off cocktails. Perfect for networking with other nomads and watching the sunset 🌅', 'entertainment', ARRAY['https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7540, 100.5020, 'Bangkok', 'Thailand', 'Sukhumvit Soi 11', 0, 0, 0, '2024-12-19T17:00:00Z'),
  
  ('tip-012', '550e8400-e29b-41d4-a716-446655440002', 'Cool art gallery in Thonglor showcasing local artists! Free entry, great for inspiration, and they often have opening nights with free drinks. Very Instagram-worthy! 🎨', 'entertainment', ARRAY['https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7320, 100.5480, 'Bangkok', 'Thailand', 'Thonglor District', 0, 0, 0, '2024-12-12T15:20:00Z'),
  
  -- Transport tips
  ('tip-013', '550e8400-e29b-41d4-a716-446655440005', 'Pro tip: Get a Rabbit Card for BTS/MRT! Much cheaper than individual tickets and works on buses too. You can top up at any station. Saves so much time and money! 🚇', 'transport', ARRAY['https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7563, 100.5018, 'Bangkok', 'Thailand', 'BTS Siam Station', 0, 0, 0, '2024-12-18T14:45:00Z'),
  
  ('tip-014', '550e8400-e29b-41d4-a716-446655440007', 'Best taxi app in Bangkok: Bolt! Usually cheaper than Grab and drivers are more reliable. Always use the app instead of street taxis to avoid scams. Works great for nomads! 🚗', 'transport', ARRAY['https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7500, 100.5200, 'Bangkok', 'Thailand', 'Central Bangkok', 0, 0, 0, '2024-12-17T11:30:00Z'),
  
  -- Shopping tips
  ('tip-015', '550e8400-e29b-41d4-a716-446655440006', 'Chatuchak Weekend Market is a must! Go early (8-9am) to avoid crowds. Amazing deals on clothes, accessories, and local crafts. Bring cash and bargaining skills! 🛍️', 'shopping', ARRAY['https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7998, 100.5501, 'Bangkok', 'Thailand', 'Chatuchak Market', 0, 0, 0, '2024-12-16T09:00:00Z'),
  
  ('tip-016', '550e8400-e29b-41d4-a716-446655440008', 'MBK Center for electronics and phone accessories! Great prices and lots of variety. Perfect for nomads who need tech gear. Always compare prices between shops! 📱', 'shopping', ARRAY['https://images.pexels.com/photos/1927574/pexels-photo-1927574.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7448, 100.5300, 'Bangkok', 'Thailand', 'MBK Center', 0, 0, 0, '2024-12-11T16:20:00Z'),
  
  -- Nature tips
  ('tip-017', '550e8400-e29b-41d4-a716-446655440004', 'Lumpini Park is perfect for morning runs! 6-7am is the best time - cooler weather and lots of locals exercising. Free outdoor gym equipment and beautiful lake views 🌳', 'nature', ARRAY['https://images.pexels.com/photos/3654772/pexels-photo-3654772.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7307, 100.5418, 'Bangkok', 'Thailand', 'Lumpini Park', 0, 0, 0, '2024-12-15T06:30:00Z'),
  
  ('tip-018', '550e8400-e29b-41d4-a716-446655440008', 'Benjakitti Park has amazing skyline views and is less crowded than Lumpini! Great for photography, especially during sunset. The lake reflection shots are incredible! 📸', 'nature', ARRAY['https://images.pexels.com/photos/3889855/pexels-photo-3889855.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7220, 100.5600, 'Bangkok', 'Thailand', 'Benjakitti Park', 0, 0, 0, '2024-12-10T18:00:00Z'),
  
  -- Other tips
  ('tip-019', '550e8400-e29b-41d4-a716-446655440001', 'Essential apps for Bangkok nomads: Grab (transport), Foodpanda (delivery), Google Translate (Thai), and Wise (banking). Download these before you arrive! 📱', 'other', NULL, 13.7563, 100.5018, 'Bangkok', 'Thailand', NULL, 0, 0, 0, '2024-12-21T20:15:00Z'),
  
  ('tip-020', '550e8400-e29b-41d4-a716-446655440002', 'Learn basic Thai phrases! "Sawasdee" (hello), "Kob khun" (thank you), "Mai pen rai" (no problem). Locals really appreciate the effort and it makes everything easier! 🇹🇭', 'other', NULL, 13.7563, 100.5018, 'Bangkok', 'Thailand', NULL, 0, 0, 0, '2024-12-14T12:00:00Z');

-- Insert realistic tip likes (creating engagement patterns)
INSERT INTO tip_likes (tip_id, user_id, created_at) VALUES
  -- Popular tips get likes from multiple users
  ('tip-001', '550e8400-e29b-41d4-a716-446655440002', '2024-12-20T10:00:00Z'),
  ('tip-001', '550e8400-e29b-41d4-a716-446655440003', '2024-12-20T10:15:00Z'),
  ('tip-001', '550e8400-e29b-41d4-a716-446655440004', '2024-12-20T11:30:00Z'),
  ('tip-001', '550e8400-e29b-41d4-a716-446655440005', '2024-12-20T14:20:00Z'),
  
  ('tip-003', '550e8400-e29b-41d4-a716-446655440001', '2024-12-19T20:00:00Z'),
  ('tip-003', '550e8400-e29b-41d4-a716-446655440002', '2024-12-19T20:30:00Z'),
  ('tip-003', '550e8400-e29b-41d4-a716-446655440006', '2024-12-19T21:15:00Z'),
  ('tip-003', '550e8400-e29b-41d4-a716-446655440007', '2024-12-20T08:00:00Z'),
  ('tip-003', '550e8400-e29b-41d4-a716-446655440008', '2024-12-20T09:30:00Z'),
  
  ('tip-009', '550e8400-e29b-41d4-a716-446655440001', '2024-12-20T19:00:00Z'),
  ('tip-009', '550e8400-e29b-41d4-a716-446655440002', '2024-12-20T19:15:00Z'),
  ('tip-009', '550e8400-e29b-41d4-a716-446655440004', '2024-12-20T20:00:00Z'),
  ('tip-009', '550e8400-e29b-41d4-a716-446655440007', '2024-12-21T07:30:00Z'),
  
  ('tip-011', '550e8400-e29b-41d4-a716-446655440001', '2024-12-19T18:00:00Z'),
  ('tip-011', '550e8400-e29b-41d4-a716-446655440003', '2024-12-19T18:30:00Z'),
  ('tip-011', '550e8400-e29b-41d4-a716-446655440005', '2024-12-19T19:45:00Z'),
  ('tip-011', '550e8400-e29b-41d4-a716-446655440006', '2024-12-20T10:20:00Z'),
  ('tip-011', '550e8400-e29b-41d4-a716-446655440007', '2024-12-20T11:15:00Z'),
  
  ('tip-013', '550e8400-e29b-41d4-a716-446655440002', '2024-12-18T15:00:00Z'),
  ('tip-013', '550e8400-e29b-41d4-a716-446655440003', '2024-12-18T16:30:00Z'),
  ('tip-013', '550e8400-e29b-41d4-a716-446655440004', '2024-12-18T17:45:00Z'),
  ('tip-013', '550e8400-e29b-41d4-a716-446655440006', '2024-12-19T08:20:00Z'),
  ('tip-013', '550e8400-e29b-41d4-a716-446655440007', '2024-12-19T09:10:00Z'),
  ('tip-013', '550e8400-e29b-41d4-a716-446655440008', '2024-12-19T12:30:00Z'),
  
  ('tip-019', '550e8400-e29b-41d4-a716-446655440002', '2024-12-21T20:30:00Z'),
  ('tip-019', '550e8400-e29b-41d4-a716-446655440003', '2024-12-21T21:00:00Z'),
  ('tip-019', '550e8400-e29b-41d4-a716-446655440004', '2024-12-21T21:15:00Z'),
  ('tip-019', '550e8400-e29b-41d4-a716-446655440005', '2024-12-21T22:00:00Z'),
  ('tip-019', '550e8400-e29b-41d4-a716-446655440006', '2024-12-22T08:30:00Z'),
  ('tip-019', '550e8400-e29b-41d4-a716-446655440007', '2024-12-22T09:45:00Z'),
  ('tip-019', '550e8400-e29b-41d4-a716-446655440008', '2024-12-22T10:20:00Z');

-- Insert tip saves (users saving useful tips)
INSERT INTO tip_saves (tip_id, user_id, created_at) VALUES
  ('tip-001', '550e8400-e29b-41d4-a716-446655440002', '2024-12-20T10:30:00Z'),
  ('tip-001', '550e8400-e29b-41d4-a716-446655440003', '2024-12-20T11:00:00Z'),
  ('tip-001', '550e8400-e29b-41d4-a716-446655440006', '2024-12-20T14:45:00Z'),
  
  ('tip-003', '550e8400-e29b-41d4-a716-446655440001', '2024-12-19T20:15:00Z'),
  ('tip-003', '550e8400-e29b-41d4-a716-446655440004', '2024-12-19T21:30:00Z'),
  ('tip-003', '550e8400-e29b-41d4-a716-446655440008', '2024-12-20T09:45:00Z'),
  
  ('tip-005', '550e8400-e29b-41d4-a716-446655440001', '2024-12-16T15:00:00Z'),
  ('tip-005', '550e8400-e29b-41d4-a716-446655440002', '2024-12-16T16:30:00Z'),
  ('tip-005', '550e8400-e29b-41d4-a716-446655440008', '2024-12-17T10:20:00Z'),
  
  ('tip-007', '550e8400-e29b-41d4-a716-446655440002', '2024-12-21T10:30:00Z'),
  ('tip-007', '550e8400-e29b-41d4-a716-446655440003', '2024-12-21T11:15:00Z'),
  ('tip-007', '550e8400-e29b-41d4-a716-446655440005', '2024-12-21T14:20:00Z'),
  
  ('tip-013', '550e8400-e29b-41d4-a716-446655440001', '2024-12-18T15:30:00Z'),
  ('tip-013', '550e8400-e29b-41d4-a716-446655440004', '2024-12-18T18:00:00Z'),
  ('tip-013', '550e8400-e29b-41d4-a716-446655440006', '2024-12-19T08:45:00Z'),
  ('tip-013', '550e8400-e29b-41d4-a716-446655440008', '2024-12-19T12:45:00Z'),
  
  ('tip-019', '550e8400-e29b-41d4-a716-446655440003', '2024-12-21T21:30:00Z'),
  ('tip-019', '550e8400-e29b-41d4-a716-446655440004', '2024-12-21T22:15:00Z'),
  ('tip-019', '550e8400-e29b-41d4-a716-446655440005', '2024-12-22T08:00:00Z'),
  ('tip-019', '550e8400-e29b-41d4-a716-446655440007', '2024-12-22T10:00:00Z');

-- Insert some comments on popular tips
INSERT INTO tip_comments (tip_id, user_id, content, created_at) VALUES
  ('tip-001', '550e8400-e29b-41d4-a716-446655440002', 'Just went there yesterday! Can confirm the WiFi is amazing and the coffee is top notch ☕', '2024-12-20T11:00:00Z'),
  ('tip-001', '550e8400-e29b-41d4-a716-446655440003', 'Thanks for the tip! Do they have good food options too?', '2024-12-20T12:30:00Z'),
  ('tip-001', '550e8400-e29b-41d4-a716-446655440001', 'Yes! They have sandwiches and salads. Perfect for lunch meetings 👍', '2024-12-20T13:15:00Z'),
  
  ('tip-003', '550e8400-e29b-41d4-a716-446655440002', 'OMG yes! This place is incredible. The aunt who runs it is so sweet too 😊', '2024-12-19T20:45:00Z'),
  ('tip-003', '550e8400-e29b-41d4-a716-446655440006', 'Been looking for authentic pad thai! What time do they usually run out?', '2024-12-19T21:00:00Z'),
  ('tip-003', '550e8400-e29b-41d4-a716-446655440005', 'Usually around 9pm, but weekends they stay later. Get there early! 🍜', '2024-12-19T21:30:00Z'),
  
  ('tip-009', '550e8400-e29b-41d4-a716-446655440004', 'This gym changed my life! The trainers are so patient with beginners 🥊', '2024-12-20T19:30:00Z'),
  ('tip-009', '550e8400-e29b-41d4-a716-446655440007', 'Do they rent gloves or do I need to bring my own?', '2024-12-20T20:15:00Z'),
  ('tip-009', '550e8400-e29b-41d4-a716-446655440003', 'They have rental gloves for 100 THB, but I recommend buying your own for hygiene 👍', '2024-12-21T08:00:00Z'),
  
  ('tip-011', '550e8400-e29b-41d4-a716-446655440005', 'Perfect spot for client meetings! The view really impresses 🌆', '2024-12-19T19:00:00Z'),
  ('tip-011', '550e8400-e29b-41d4-a716-446655440006', 'Great for dates too! Very romantic at sunset 💕', '2024-12-19T20:30:00Z'),
  
  ('tip-013', '550e8400-e29b-41d4-a716-446655440004', 'Game changer! Saved me so much money already. Thanks for the tip! 🙏', '2024-12-18T16:00:00Z'),
  ('tip-013', '550e8400-e29b-41d4-a716-446655440006', 'Where can I get the card? Any BTS station?', '2024-12-18T17:00:00Z'),
  ('tip-013', '550e8400-e29b-41d4-a716-446655440005', 'Yes, any BTS or MRT station. Just go to the ticket counter 🎫', '2024-12-18T18:30:00Z'),
  
  ('tip-019', '550e8400-e29b-41d4-a716-446655440003', 'Would add LINE app to this list - super useful for everything in Thailand!', '2024-12-21T21:00:00Z'),
  ('tip-019', '550e8400-e29b-41d4-a716-446655440004', 'And 7-Eleven app for finding the nearest store! They are everywhere 🏪', '2024-12-21T22:00:00Z');

-- Update tip counts based on the interactions we just inserted
UPDATE tips SET 
  likes_count = (SELECT COUNT(*) FROM tip_likes WHERE tip_id = tips.id),
  saves_count = (SELECT COUNT(*) FROM tip_saves WHERE tip_id = tips.id),
  comments_count = (SELECT COUNT(*) FROM tip_comments WHERE tip_id = tips.id);

-- Initialize user stats for all users
INSERT INTO user_stats (user_id, tips_count, likes_received, comments_received, saves_received, cities_visited, countries_visited, last_activity)
SELECT 
  u.id,
  COALESCE(tip_stats.tips_count, 0),
  COALESCE(tip_stats.likes_received, 0),
  COALESCE(tip_stats.comments_received, 0),
  COALESCE(tip_stats.saves_received, 0),
  COALESCE(tip_stats.cities_visited, 0),
  COALESCE(tip_stats.countries_visited, 0),
  COALESCE(tip_stats.last_activity, u.created_at)
FROM users u
LEFT JOIN (
  SELECT 
    t.user_id,
    COUNT(DISTINCT t.id) as tips_count,
    COALESCE(SUM(t.likes_count), 0) as likes_received,
    COALESCE(SUM(t.comments_count), 0) as comments_received,
    COALESCE(SUM(t.saves_count), 0) as saves_received,
    COUNT(DISTINCT t.city) as cities_visited,
    COUNT(DISTINCT t.country) as countries_visited,
    MAX(t.created_at) as last_activity
  FROM tips t
  GROUP BY t.user_id
) tip_stats ON u.id = tip_stats.user_id
ON CONFLICT (user_id) DO UPDATE SET
  tips_count = EXCLUDED.tips_count,
  likes_received = EXCLUDED.likes_received,
  comments_received = EXCLUDED.comments_received,
  saves_received = EXCLUDED.saves_received,
  cities_visited = EXCLUDED.cities_visited,
  countries_visited = EXCLUDED.countries_visited,
  last_activity = EXCLUDED.last_activity,
  updated_at = now();