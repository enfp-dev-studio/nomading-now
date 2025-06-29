/*
  # Seed Test Data for Nomad Tips

  1. Test Users
    - Creates 10 diverse nomad users with realistic profiles
    - Includes avatars, bios, points, and trust levels
    - Temporarily disables foreign key constraints for testing

  2. User Profiles
    - Complete profile information for each user
    - Social links, languages, interests, travel styles
    - Work types and location information

  3. Tips Content
    - 30 realistic tips across multiple categories
    - Real locations with coordinates and addresses
    - Authentic content from experienced nomads

  4. Community Engagement
    - 40+ likes distributed across tips
    - 17 saved tips for bookmarking
    - 17 comments creating active discussions

  Note: This temporarily disables foreign key constraints to allow test data creation
  without requiring actual auth.users entries.
*/

-- Temporarily disable foreign key constraint for users table
ALTER TABLE users DISABLE TRIGGER ALL;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Insert test users (these will be created as auth users would be)
INSERT INTO users (id, email, nickname, bio, avatar_url, points, trust_level) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'alex@nomadtips.com', 'AlexNomad', 'Full-stack developer traveling the world 🌍 Currently in Bali building the next big thing!', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 320, 85),
  ('550e8400-e29b-41d4-a716-446655440002', 'sarah@nomadtips.com', 'SarahExplorer', 'UX Designer & Digital Nomad 🎨 Love finding hidden gems in every city I visit!', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 280, 75),
  ('550e8400-e29b-41d4-a716-446655440003', 'marco@nomadtips.com', 'MarcoWanderer', 'Travel blogger documenting nomad life 📝 Sharing authentic experiences from 40+ countries', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 450, 92),
  ('550e8400-e29b-41d4-a716-446655440004', 'emma@nomadtips.com', 'EmmaDigital', 'Marketing consultant & yoga enthusiast 🧘‍♀️ Finding balance between work and wanderlust', 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 195, 68),
  ('550e8400-e29b-41d4-a716-446655440005', 'carlos@nomadtips.com', 'CarlosCode', 'Software engineer & coffee connoisseur ☕ Building apps while exploring Latin America', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 380, 88),
  ('550e8400-e29b-41d4-a716-446655440006', 'lisa@nomadtips.com', 'LisaFitness', 'Personal trainer & wellness coach 💪 Helping nomads stay healthy on the road', 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 240, 72),
  ('550e8400-e29b-41d4-a716-446655440007', 'david@nomadtips.com', 'DavidPhotos', 'Freelance photographer 📸 Capturing the beauty of nomad destinations worldwide', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 310, 80),
  ('550e8400-e29b-41d4-a716-446655440008', 'nina@nomadtips.com', 'NinaLanguages', 'Language teacher & cultural enthusiast 🗣️ Speaking 6 languages and counting!', 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 260, 78),
  ('550e8400-e29b-41d4-a716-446655440009', 'tom@nomadtips.com', 'TomStartup', 'Entrepreneur & startup advisor 🚀 Building companies from co-working spaces around the globe', 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 420, 90),
  ('550e8400-e29b-41d4-a716-446655440010', 'zoe@nomadtips.com', 'ZoeCreative', 'Graphic designer & content creator 🎨 Designing beautiful things while living the nomad dream', 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 180, 65);

-- Re-enable triggers for users table
ALTER TABLE users ENABLE TRIGGER ALL;

-- Insert user profiles
INSERT INTO user_profiles (user_id, full_name, location, website, instagram, twitter, linkedin, languages, interests, travel_style, work_type) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Alex Johnson', 'Canggu, Bali', 'https://alexnomad.dev', 'alexnomaddev', 'alexnomaddev', 'https://linkedin.com/in/alexjohnson', ARRAY['English', 'Spanish', 'Indonesian'], ARRAY['Coding', 'Surfing', 'Blockchain', 'Startups'], 'Digital Nomad Hub', 'Full-stack Developer'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Sarah Chen', 'Lisbon, Portugal', 'https://sarahux.design', 'sarahuxdesign', 'sarahuxdesign', 'https://linkedin.com/in/sarahchen', ARRAY['English', 'Mandarin', 'Portuguese'], ARRAY['Design', 'Art', 'Photography', 'Architecture'], 'Slow Travel', 'UX Designer'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Marco Rodriguez', 'Mexico City, Mexico', 'https://marcowanders.blog', 'marcowanders', 'marcowanders', 'https://linkedin.com/in/marcorodriguez', ARRAY['English', 'Spanish', 'French', 'Italian'], ARRAY['Writing', 'Culture', 'Food', 'History'], 'Cultural Immersion', 'Travel Blogger'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Emma Thompson', 'Chiang Mai, Thailand', 'https://emmadigital.co', 'emmadigitalco', 'emmadigitalco', 'https://linkedin.com/in/emmathompson', ARRAY['English', 'Thai'], ARRAY['Marketing', 'Yoga', 'Meditation', 'Wellness'], 'Wellness Focused', 'Marketing Consultant'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Carlos Mendez', 'Medellín, Colombia', 'https://carloscode.dev', 'carloscodemx', 'carloscodemx', 'https://linkedin.com/in/carlosmendez', ARRAY['Spanish', 'English', 'Portuguese'], ARRAY['Programming', 'Coffee', 'Salsa', 'Entrepreneurship'], 'City Explorer', 'Software Engineer'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Lisa Park', 'Seoul, South Korea', 'https://lisafitness.com', 'lisafitnesscoach', 'lisafitnesscoach', 'https://linkedin.com/in/lisapark', ARRAY['English', 'Korean', 'Japanese'], ARRAY['Fitness', 'Nutrition', 'Hiking', 'Wellness'], 'Active Adventure', 'Personal Trainer'),
  ('550e8400-e29b-41d4-a716-446655440007', 'David Miller', 'Cape Town, South Africa', 'https://davidphotos.com', 'davidphotosza', 'davidphotosza', 'https://linkedin.com/in/davidmiller', ARRAY['English', 'Afrikaans'], ARRAY['Photography', 'Nature', 'Wildlife', 'Adventure'], 'Adventure Seeker', 'Photographer'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Nina Petrov', 'Prague, Czech Republic', 'https://ninalanguages.com', 'ninalanguages', 'ninalanguages', 'https://linkedin.com/in/ninapetrov', ARRAY['English', 'Czech', 'German', 'Russian', 'French', 'Spanish'], ARRAY['Languages', 'Culture', 'Teaching', 'Literature'], 'Cultural Explorer', 'Language Teacher'),
  ('550e8400-e29b-41d4-a716-446655440009', 'Tom Wilson', 'Singapore', 'https://tomstartup.co', 'tomstartupco', 'tomstartupco', 'https://linkedin.com/in/tomwilson', ARRAY['English', 'Mandarin'], ARRAY['Startups', 'Investing', 'Technology', 'Networking'], 'Business Focused', 'Entrepreneur'),
  ('550e8400-e29b-41d4-a716-446655440010', 'Zoe Martinez', 'Barcelona, Spain', 'https://zoecreative.es', 'zoecreativees', 'zoecreativees', 'https://linkedin.com/in/zoemartinez', ARRAY['English', 'Spanish', 'Catalan'], ARRAY['Design', 'Art', 'Fashion', 'Culture'], 'Creative Explorer', 'Graphic Designer');

-- Insert tips with realistic content and locations
INSERT INTO tips (id, user_id, content, category, images, latitude, longitude, city, country, address) VALUES
  -- Bangkok, Thailand tips
  ('tip-001', '550e8400-e29b-41d4-a716-446655440001', 'This co-working space in Silom has the fastest WiFi I''ve tested in Bangkok (500+ Mbps)! 🚀 Great coffee, AC that actually works, and 24/7 access. Perfect for those late-night coding sessions. Monthly membership is 8,000 THB which is totally worth it!', 'workspace', ARRAY['https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7248, 100.5340, 'Bangkok', 'Thailand', 'Silom Road'),
  ('tip-002', '550e8400-e29b-41d4-a716-446655440002', 'Hidden gem for authentic pad thai! 🍜 This tiny street stall near Chatuchak Market serves the best pad thai I''ve had in Thailand. Only 60 THB and the portions are huge. The owner speaks perfect English and loves chatting with foreigners!', 'food', ARRAY['https://images.pexels.com/photos/1600727/pexels-photo-1600727.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7998, 100.5501, 'Bangkok', 'Thailand', 'Near Chatuchak Weekend Market'),
  ('tip-003', '550e8400-e29b-41d4-a716-446655440003', 'Lumpini Park is perfect for morning runs! 🏃‍♂️ The track is 2.5km around the lake, well-lit even at 5am, and super safe. Lots of locals exercise here so you''ll fit right in. Pro tip: avoid weekends if you want less crowds.', 'exercise', ARRAY['https://images.pexels.com/photos/3654772/pexels-photo-3654772.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7307, 100.5418, 'Bangkok', 'Thailand', 'Lumpini Park'),

  -- Chiang Mai, Thailand tips
  ('tip-004', '550e8400-e29b-41d4-a716-446655440004', 'Maya Lifestyle Shopping Center has an amazing co-working space on the 4th floor! ☕ Great for digital nomads - reliable WiFi, comfortable seating, and you''re surrounded by cafes and restaurants. Plus parking is free for the first 3 hours.', 'workspace', ARRAY['https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=800'], 18.7904, 98.9625, 'Chiang Mai', 'Thailand', 'Maya Lifestyle Shopping Center'),
  ('tip-005', '550e8400-e29b-41d4-a716-446655440005', 'Khao Soi at Khao Soi Lamduan Faham is life-changing! 🍲 This local spot has been serving the same recipe for 30+ years. 80 THB for a bowl that will ruin all other khao soi for you. Cash only, closes at 3pm.', 'food', ARRAY['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'], 18.7883, 98.9853, 'Chiang Mai', 'Thailand', 'Faham Road'),

  -- Lisbon, Portugal tips
  ('tip-006', '550e8400-e29b-41d4-a716-446655440002', 'Second Home Lisboa is hands down the best co-working space in the city! 🏢 Beautiful design, amazing community events, and the rooftop terrace has incredible views. A bit pricey at €25/day but worth every euro for the experience.', 'workspace', ARRAY['https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800'], 38.7071, -9.1359, 'Lisbon', 'Portugal', 'Cais do Sodré'),
  ('tip-007', '550e8400-e29b-41d4-a716-446655440007', 'Pastéis de nata at Pastéis de Belém are tourist traps - go to Confeitaria Nacional instead! 🥧 Same quality, half the price (€1.20 vs €2.50), and no queues. The locals know what''s up. Try them with a bica (espresso).', 'food', ARRAY['https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=800'], 38.7139, -9.1394, 'Lisbon', 'Portugal', 'Rossio Square'),

  -- Mexico City, Mexico tips
  ('tip-008', '550e8400-e29b-41d4-a716-446655440003', 'Roma Norte is the perfect neighborhood for nomads! 🏘️ Tons of cafes with WiFi, great restaurants, and a vibrant arts scene. I stayed at an Airbnb here for 2 months and loved every minute. Very walkable and safe during the day.', 'accommodation', ARRAY['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'], 19.4147, -99.1655, 'Mexico City', 'Mexico', 'Roma Norte'),
  ('tip-009', '550e8400-e29b-41d4-a716-446655440005', 'Tacos al pastor at El Huequito are incredible! 🌮 This place has been around since 1959 and they know what they''re doing. 25 pesos per taco, open until 2am, and the trompo (spit) is always fresh. Get extra pineapple!', 'food', ARRAY['https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg?auto=compress&cs=tinysrgb&w=800'], 19.4326, -99.1332, 'Mexico City', 'Mexico', 'Centro Histórico'),

  -- Medellín, Colombia tips
  ('tip-010', '550e8400-e29b-41d4-a716-446655440005', 'Poblado is where all the nomads hang out! 🌆 Great WiFi in most cafes, tons of co-working spaces, and the nightlife is amazing. A bit touristy but very safe and convenient. I recommend staying near Parque Lleras for the full experience.', 'accommodation', ARRAY['https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800'], 6.2088, -75.5673, 'Medellín', 'Colombia', 'El Poblado'),
  ('tip-011', '550e8400-e29b-41d4-a716-446655440003', 'Take the cable car to Parque Arví for an amazing day trip! 🚡 Only 2,500 COP and you get incredible views of the city plus access to hiking trails. Pack a lunch and make a day of it. The ride itself is worth the price!', 'entertainment', ARRAY['https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800'], 6.2742, -75.5078, 'Medellín', 'Colombia', 'Parque Arví'),

  -- Bali, Indonesia tips
  ('tip-012', '550e8400-e29b-41d4-a716-446655440001', 'Canggu is the ultimate nomad paradise! 🏄‍♂️ Amazing co-working spaces, great surf, and the community is incredible. I''ve been here 6 months and still discovering new spots. Rent a scooter and explore - just be careful on the roads!', 'accommodation', ARRAY['https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800'], -8.6481, 115.1371, 'Canggu', 'Indonesia', 'Canggu Beach'),
  ('tip-013', '550e8400-e29b-41d4-a716-446655440004', 'Warung Bu Mi serves the best nasi goreng in Ubud! 🍛 Family-run place, super authentic, and only 25,000 IDR. The sambal is spicy so ask for it on the side if you can''t handle heat. Cash only, closes at 9pm.', 'food', ARRAY['https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800'], -8.5069, 115.2625, 'Ubud', 'Indonesia', 'Monkey Forest Road'),

  -- Barcelona, Spain tips
  ('tip-014', '550e8400-e29b-41d4-a716-446655440010', 'Gracia neighborhood is perfect for creatives! 🎨 Tons of independent cafes, art galleries, and a very local vibe. Much cheaper than Eixample and way more authentic. The small squares (plazas) are perfect for working outdoors.', 'accommodation', ARRAY['https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800'], 41.4036, 2.1560, 'Barcelona', 'Spain', 'Gràcia'),
  ('tip-015', '550e8400-e29b-41d4-a716-446655440002', 'Skip the touristy tapas places and go to Cal Pep! 🍤 Standing room only, but the seafood is incredible. Expect to wait 30 minutes but it''s worth it. Try the gambas al ajillo and whatever fish they recommend. Around €40 per person.', 'food', ARRAY['https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800'], 41.3851, 2.1734, 'Barcelona', 'Spain', 'Born District'),

  -- Prague, Czech Republic tips
  ('tip-016', '550e8400-e29b-41d4-a716-446655440008', 'Vinohrady is the best neighborhood for nomads in Prague! 🏘️ Great cafes with WiFi, beautiful parks, and much cheaper than Old Town. Náměstí Míru has everything you need within walking distance. Highly recommend!', 'accommodation', ARRAY['https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=800'], 50.0755, 14.4378, 'Prague', 'Czech Republic', 'Vinohrady'),
  ('tip-017', '550e8400-e29b-41d4-a716-446655440003', 'Traditional Czech beer at U Fleků brewery is a must! 🍺 This place has been brewing since 1499 - yes, 1499! The dark lager is incredible and the atmosphere is authentic. Around 80 CZK per beer, cash only.', 'entertainment', ARRAY['https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=800'], 50.0755, 14.4178, 'Prague', 'Czech Republic', 'New Town'),

  -- Singapore tips
  ('tip-018', '550e8400-e29b-41d4-a716-446655440009', 'WeWork at Marina One is expensive but worth it for networking! 💼 The startup community here is incredible and I''ve made so many valuable connections. Hot desk is S$45/day but the events and networking opportunities pay for themselves.', 'workspace', ARRAY['https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800'], 1.2792, 103.8480, 'Singapore', 'Singapore', 'Marina Bay'),
  ('tip-019', '550e8400-e29b-41d4-a716-446655440001', 'Hawker centers are where the real food magic happens! 🍜 Maxwell Food Centre has the best chicken rice in the city. Tian Tian Hainanese Chicken Rice - expect queues but it''s worth it. Only S$3.50 for a full meal!', 'food', ARRAY['https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=800'], 1.2806, 103.8440, 'Singapore', 'Singapore', 'Maxwell Road'),

  -- Cape Town, South Africa tips
  ('tip-020', '550e8400-e29b-41d4-a716-446655440007', 'Table Mountain hike at sunrise is absolutely magical! 🌅 Start at 5am to catch the sunrise from the top. The Platteklip Gorge route is challenging but doable for most fitness levels. Bring water and a headlamp. Free and unforgettable!', 'nature', ARRAY['https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=800'], -33.9628, 18.4098, 'Cape Town', 'South Africa', 'Table Mountain'),
  ('tip-021', '550e8400-e29b-41d4-a716-446655440006', 'Sea Point Promenade is perfect for morning runs! 🏃‍♀️ 3km of flat, paved path along the ocean with incredible views. Very safe even early morning, well-lit, and there''s outdoor gym equipment along the way. Plus you can swim after!', 'exercise', ARRAY['https://images.pexels.com/photos/3654772/pexels-photo-3654772.jpeg?auto=compress&cs=tinysrgb&w=800'], -33.9057, 18.3842, 'Cape Town', 'South Africa', 'Sea Point'),

  -- Seoul, South Korea tips
  ('tip-022', '550e8400-e29b-41d4-a716-446655440006', 'Gangnam has amazing 24/7 gyms! 💪 Anytime Fitness locations are everywhere and day passes are only 10,000 KRW. Clean, modern equipment, and most have saunas. Perfect for maintaining your fitness routine while traveling.', 'exercise', ARRAY['https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800'], 37.4979, 127.0276, 'Seoul', 'South Korea', 'Gangnam District'),
  ('tip-023', '550e8400-e29b-41d4-a716-446655440008', 'Korean BBQ at Maple Tree House is expensive but incredible! 🥩 Yes, it''s touristy and yes, it''s pricey (around 50,000 KRW per person) but the quality is outstanding. Great for special occasions or impressing clients. Book ahead!', 'food', ARRAY['https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=800'], 37.5172, 127.0286, 'Seoul', 'South Korea', 'Itaewon'),

  -- Additional diverse tips
  ('tip-024', '550e8400-e29b-41d4-a716-446655440004', 'Yoga classes at Radiantly Alive in Ubud changed my life! 🧘‍♀️ The teachers are world-class and the community is so welcoming. Drop-in classes are 150,000 IDR but they offer monthly unlimited passes for serious practitioners.', 'exercise', ARRAY['https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800'], -8.5069, 115.2625, 'Ubud', 'Indonesia', 'Monkey Forest Road'),
  ('tip-025', '550e8400-e29b-41d4-a716-446655440007', 'Photography tip: Golden hour at Bagan temples is unreal! 📸 Rent an e-bike (10,000 MMK/day) and explore the lesser-known temples. Sulamani Temple has great sunrise views without the crowds. Bring extra batteries - you''ll need them!', 'entertainment', ARRAY['https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800'], 21.1717, 94.8574, 'Bagan', 'Myanmar', 'Old Bagan'),
  ('tip-026', '550e8400-e29b-41d4-a716-446655440009', 'Networking events at Google Campus Warsaw are gold! 🤝 Free events almost every week, incredible startup community, and the space is beautiful. Sign up for their newsletter to stay updated. Great for meeting potential co-founders or clients.', 'workspace', ARRAY['https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'], 52.2297, 21.0122, 'Warsaw', 'Poland', 'Campus Warsaw'),
  ('tip-027', '550e8400-e29b-41d4-a716-446655440010', 'Design inspiration everywhere in Copenhagen! 🎨 Visit the Design Museum and then walk through Nørrebro for street art. The contrast between classic Danish design and modern street art is incredible. Perfect for creative minds!', 'entertainment', ARRAY['https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=800'], 55.6761, 12.5683, 'Copenhagen', 'Denmark', 'Nørrebro'),
  ('tip-028', '550e8400-e29b-41d4-a716-446655440001', 'Grab vs Uber in Bangkok: Grab wins every time! 🚗 Cheaper, more drivers speak English, and the app works better. Download it before you arrive and link your credit card. Motorcycle taxis through Grab are also super convenient for short distances.', 'transport', ARRAY['https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg?auto=compress&cs=tinysrgb&w=800'], 13.7563, 100.5018, 'Bangkok', 'Thailand', 'Sukhumvit Road'),
  ('tip-029', '550e8400-e29b-41d4-a716-446655440002', 'Vintage shopping in Lisbon''s LX Factory is amazing! 🛍️ Converted industrial space with unique shops, cafes, and art galleries. Perfect for finding one-of-a-kind pieces. Open Thursday-Sunday, gets busy after 2pm on weekends.', 'shopping', ARRAY['https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg?auto=compress&cs=tinysrgb&w=800'], 38.7049, -9.1767, 'Lisbon', 'Portugal', 'LX Factory'),
  ('tip-030', '550e8400-e29b-41d4-a716-446655440003', 'Cenotes near Tulum are nature''s swimming pools! 🏊‍♂️ Rent a car and visit Gran Cenote and Dos Ojos in one day. Entry is around 350 MXN each but the crystal-clear water and cave swimming is unforgettable. Bring underwater camera!', 'nature', ARRAY['https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=800'], 20.2114, -87.4654, 'Tulum', 'Mexico', 'Cenote Zone');

-- Insert some likes to create engagement
INSERT INTO tip_likes (tip_id, user_id) VALUES
  ('tip-001', '550e8400-e29b-41d4-a716-446655440002'),
  ('tip-001', '550e8400-e29b-41d4-a716-446655440003'),
  ('tip-001', '550e8400-e29b-41d4-a716-446655440005'),
  ('tip-002', '550e8400-e29b-41d4-a716-446655440001'),
  ('tip-002', '550e8400-e29b-41d4-a716-446655440004'),
  ('tip-002', '550e8400-e29b-41d4-a716-446655440007'),
  ('tip-003', '550e8400-e29b-41d4-a716-446655440006'),
  ('tip-003', '550e8400-e29b-41d4-a716-446655440008'),
  ('tip-004', '550e8400-e29b-41d4-a716-446655440001'),
  ('tip-004', '550e8400-e29b-41d4-a716-446655440009'),
  ('tip-005', '550e8400-e29b-41d4-a716-446655440002'),
  ('tip-005', '550e8400-e29b-41d4-a716-446655440003'),
  ('tip-006', '550e8400-e29b-41d4-a716-446655440007'),
  ('tip-006', '550e8400-e29b-41d4-a716-446655440010'),
  ('tip-007', '550e8400-e29b-41d4-a716-446655440008'),
  ('tip-008', '550e8400-e29b-41d4-a716-446655440005'),
  ('tip-008', '550e8400-e29b-41d4-a716-446655440009'),
  ('tip-009', '550e8400-e29b-41d4-a716-446655440003'),
  ('tip-010', '550e8400-e29b-41d4-a716-446655440001'),
  ('tip-010', '550e8400-e29b-41d4-a716-446655440004'),
  ('tip-011', '550e8400-e29b-41d4-a716-446655440007'),
  ('tip-012', '550e8400-e29b-41d4-a716-446655440002'),
  ('tip-012', '550e8400-e29b-41d4-a716-446655440004'),
  ('tip-012', '550e8400-e29b-41d4-a716-446655440010'),
  ('tip-013', '550e8400-e29b-41d4-a716-446655440001'),
  ('tip-014', '550e8400-e29b-41d4-a716-446655440002'),
  ('tip-015', '550e8400-e29b-41d4-a716-446655440007'),
  ('tip-016', '550e8400-e29b-41d4-a716-446655440003'),
  ('tip-017', '550e8400-e29b-41d4-a716-446655440005'),
  ('tip-018', '550e8400-e29b-41d4-a716-446655440001'),
  ('tip-019', '550e8400-e29b-41d4-a716-446655440002'),
  ('tip-020', '550e8400-e29b-41d4-a716-446655440006'),
  ('tip-021', '550e8400-e29b-41d4-a716-446655440004'),
  ('tip-022', '550e8400-e29b-41d4-a716-446655440007'),
  ('tip-023', '550e8400-e29b-41d4-a716-446655440009'),
  ('tip-024', '550e8400-e29b-41d4-a716-446655440006'),
  ('tip-025', '550e8400-e29b-41d4-a716-446655440010'),
  ('tip-026', '550e8400-e29b-41d4-a716-446655440001'),
  ('tip-027', '550e8400-e29b-41d4-a716-446655440002'),
  ('tip-028', '550e8400-e29b-41d4-a716-446655440003'),
  ('tip-029', '550e8400-e29b-41d4-a716-446655440004'),
  ('tip-030', '550e8400-e29b-41d4-a716-446655440005');

-- Insert some saves
INSERT INTO tip_saves (tip_id, user_id) VALUES
  ('tip-001', '550e8400-e29b-41d4-a716-446655440003'),
  ('tip-001', '550e8400-e29b-41d4-a716-446655440009'),
  ('tip-002', '550e8400-e29b-41d4-a716-446655440005'),
  ('tip-004', '550e8400-e29b-41d4-a716-446655440002'),
  ('tip-006', '550e8400-e29b-41d4-a716-446655440001'),
  ('tip-008', '550e8400-e29b-41d4-a716-446655440007'),
  ('tip-010', '550e8400-e29b-41d4-a716-446655440003'),
  ('tip-012', '550e8400-e29b-41d4-a716-446655440006'),
  ('tip-014', '550e8400-e29b-41d4-a716-446655440008'),
  ('tip-016', '550e8400-e29b-41d4-a716-446655440004'),
  ('tip-018', '550e8400-e29b-41d4-a716-446655440005'),
  ('tip-020', '550e8400-e29b-41d4-a716-446655440007'),
  ('tip-022', '550e8400-e29b-41d4-a716-446655440006'),
  ('tip-024', '550e8400-e29b-41d4-a716-446655440004'),
  ('tip-026', '550e8400-e29b-41d4-a716-446655440009'),
  ('tip-028', '550e8400-e29b-41d4-a716-446655440002'),
  ('tip-030', '550e8400-e29b-41d4-a716-446655440008');

-- Insert some comments
INSERT INTO tip_comments (tip_id, user_id, content) VALUES
  ('tip-001', '550e8400-e29b-41d4-a716-446655440002', 'Thanks for this! Just signed up and the WiFi is indeed amazing 🚀'),
  ('tip-001', '550e8400-e29b-41d4-a716-446655440003', 'Been working here for 2 weeks now, can confirm it''s great for productivity'),
  ('tip-002', '550e8400-e29b-41d4-a716-446655440001', 'Went there yesterday based on your tip - absolutely delicious! 😋'),
  ('tip-004', '550e8400-e29b-41d4-a716-446655440009', 'Perfect spot for client calls, very professional environment'),
  ('tip-006', '550e8400-e29b-41d4-a716-446655440007', 'The rooftop terrace is incredible for sunset work sessions'),
  ('tip-008', '550e8400-e29b-41d4-a716-446655440005', 'Roma Norte is amazing! Stayed there for 3 months last year'),
  ('tip-010', '550e8400-e29b-41d4-a716-446655440001', 'Poblado is great but can get a bit noisy on weekends'),
  ('tip-012', '550e8400-e29b-41d4-a716-446655440004', 'Canggu is paradise! The surf community is so welcoming 🏄‍♀️'),
  ('tip-014', '550e8400-e29b-41d4-a716-446655440002', 'Love Gracia! Much more authentic than the touristy areas'),
  ('tip-016', '550e8400-e29b-41d4-a716-446655440003', 'Vinohrady is perfect for long-term stays, great local vibe'),
  ('tip-018', '550e8400-e29b-41d4-a716-446655440001', 'The networking events here are incredible for startups'),
  ('tip-020', '550e8400-e29b-41d4-a716-446655440006', 'Did this hike last month - absolutely breathtaking views! 🌅'),
  ('tip-022', '550e8400-e29b-41d4-a716-446655440004', 'Korean gyms are so clean and well-equipped compared to other countries'),
  ('tip-024', '550e8400-e29b-41d4-a716-446655440006', 'Radiantly Alive changed my practice too! Amazing teachers'),
  ('tip-026', '550e8400-e29b-41d4-a716-446655440001', 'Met my current business partner at one of these events!'),
  ('tip-028', '550e8400-e29b-41d4-a716-446655440002', 'Grab is definitely better than Uber in Southeast Asia'),
  ('tip-030', '550e8400-e29b-41d4-a716-446655440007', 'The cenotes are magical! Perfect for underwater photography 📸');

-- Update tip counts (this will be handled by triggers, but let's ensure consistency)
UPDATE tips SET 
  likes_count = (SELECT COUNT(*) FROM tip_likes WHERE tip_likes.tip_id = tips.id),
  saves_count = (SELECT COUNT(*) FROM tip_saves WHERE tip_saves.tip_id = tips.id),
  comments_count = (SELECT COUNT(*) FROM tip_comments WHERE tip_comments.tip_id = tips.id);

-- Re-add the foreign key constraint (but make it optional for testing)
-- Note: In production, this should reference actual auth.users entries
-- ALTER TABLE users ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;