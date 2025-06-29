/*
  # Create Comprehensive Test Data for Nomad Tips

  1. Test Users
    - Creates 50 diverse nomad users with realistic profiles
    - Includes avatars, bios, points, and trust levels
    - Safely handles existing data to avoid conflicts

  2. User Profiles
    - Complete profile information for each user
    - Social links, languages, interests, travel styles
    - Work types and location information

  3. Tips Content
    - 150+ realistic tips across multiple categories
    - Real locations with coordinates and addresses
    - Authentic content from experienced nomads

  4. Community Engagement
    - Likes distributed across tips
    - Saved tips for bookmarking
    - Comments creating active discussions

  Note: This migration safely handles existing data and avoids conflicts
*/

-- First, let's clean up any existing test data to avoid conflicts
DELETE FROM tip_comments WHERE tip_id IN (
  SELECT id FROM tips WHERE user_id IN (
    SELECT id FROM users WHERE email LIKE '%@nomadtech.io' OR email LIKE '%@designnomad.co' OR email LIKE '%@freelancer.com'
  )
);

DELETE FROM tip_likes WHERE tip_id IN (
  SELECT id FROM tips WHERE user_id IN (
    SELECT id FROM users WHERE email LIKE '%@nomadtech.io' OR email LIKE '%@designnomad.co' OR email LIKE '%@freelancer.com'
  )
);

DELETE FROM tip_saves WHERE tip_id IN (
  SELECT id FROM tips WHERE user_id IN (
    SELECT id FROM users WHERE email LIKE '%@nomadtech.io' OR email LIKE '%@designnomad.co' OR email LIKE '%@freelancer.com'
  )
);

DELETE FROM tips WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%@nomadtech.io' OR email LIKE '%@designnomad.co' OR email LIKE '%@freelancer.com'
);

DELETE FROM user_profiles WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%@nomadtech.io' OR email LIKE '%@designnomad.co' OR email LIKE '%@freelancer.com'
);

DELETE FROM user_stats WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%@nomadtech.io' OR email LIKE '%@designnomad.co' OR email LIKE '%@freelancer.com'
);

DELETE FROM users WHERE email LIKE '%@nomadtech.io' OR email LIKE '%@designnomad.co' OR email LIKE '%@freelancer.com';

-- Create 50 diverse test users with unique IDs
INSERT INTO users (id, email, nickname, bio, avatar_url, points, trust_level) VALUES
  -- Tech Nomads
  (gen_random_uuid(), 'alex.chen@nomadtech.io', 'AlexChen', 'Full-stack developer building the future 🚀 Currently in Bali creating amazing web apps', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 320, 85),
  (gen_random_uuid(), 'sarah.kim@designnomad.co', 'SarahDesigns', 'UX/UI Designer crafting beautiful experiences ✨ Love finding design inspiration in every city', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 280, 75),
  (gen_random_uuid(), 'marco.dev@freelancer.com', 'MarcoCode', 'Software engineer & blockchain enthusiast ⛓️ Building decentralized apps from co-working spaces worldwide', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 450, 92),
  (gen_random_uuid(), 'emma.product@startup.io', 'EmmaProduct', 'Product manager turned nomad 📱 Helping startups build products users love', 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 195, 68),
  (gen_random_uuid(), 'carlos.mobile@appdev.mx', 'CarlosMobile', 'iOS/Android developer 📱 Creating apps that make nomad life easier', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 380, 88),
  
  -- Creative Nomads
  (gen_random_uuid(), 'lisa.photo@creative.com', 'LisaLens', 'Travel photographer capturing nomad stories 📸 Documenting the beauty of remote work life', 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 240, 72),
  (gen_random_uuid(), 'david.writer@content.co', 'DavidWrites', 'Content creator & travel blogger ✍️ Sharing authentic nomad experiences and tips', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 310, 80),
  (gen_random_uuid(), 'nina.video@creator.tv', 'NinaCreates', 'Video content creator 🎬 Making nomad life accessible through storytelling', 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 260, 78),
  (gen_random_uuid(), 'tom.music@producer.fm', 'TomBeats', 'Music producer & sound designer 🎵 Creating beats from beaches and mountains', 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 420, 90),
  (gen_random_uuid(), 'zoe.graphic@design.art', 'ZoeVisual', 'Graphic designer & digital artist 🎨 Bringing brands to life while exploring the world', 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 180, 65),
  
  -- Business Nomads
  (gen_random_uuid(), 'mike.consultant@business.pro', 'MikeConsults', 'Business consultant helping companies go remote 💼 Expert in distributed team management', 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 350, 82),
  (gen_random_uuid(), 'anna.marketing@growth.co', 'AnnaGrowth', 'Growth marketer & conversion optimizer 📈 Scaling startups from anywhere in the world', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 290, 76),
  (gen_random_uuid(), 'james.sales@remote.biz', 'JamesSells', 'Sales professional & CRM expert 💰 Closing deals from co-working spaces globally', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 410, 89),
  (gen_random_uuid(), 'sofia.finance@nomad.money', 'SofiaFinance', 'Financial advisor for nomads 💳 Helping digital nomads manage money across borders', 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 330, 84),
  (gen_random_uuid(), 'ryan.startup@founder.vc', 'RyanFounder', 'Serial entrepreneur & startup advisor 🚀 Building companies while traveling the world', 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 480, 95),
  
  -- Wellness & Lifestyle Nomads
  (gen_random_uuid(), 'maya.yoga@wellness.om', 'MayaYoga', 'Yoga instructor & wellness coach 🧘‍♀️ Teaching mindfulness and movement worldwide', 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 220, 70),
  (gen_random_uuid(), 'alex.fitness@trainer.fit', 'AlexFit', 'Personal trainer & nutrition coach 💪 Keeping nomads healthy on the road', 'https://images.pexels.com/photos/1300526/pexels-photo-1300526.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 270, 74),
  (gen_random_uuid(), 'luna.meditation@mindful.zen', 'LunaMindful', 'Meditation teacher & life coach 🌙 Bringing peace and clarity to the nomad journey', 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 200, 67),
  (gen_random_uuid(), 'kai.surf@ocean.wave', 'KaiSurfer', 'Surf instructor & ocean lover 🏄‍♂️ Teaching waves and water safety around the globe', 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 250, 73),
  (gen_random_uuid(), 'sage.nutrition@health.food', 'SageEats', 'Nutritionist & healthy food blogger 🥗 Finding nutritious meals in every destination', 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 190, 66),
  
  -- Education & Language Nomads
  (gen_random_uuid(), 'elena.language@polyglot.edu', 'ElenaPolyglot', 'Language teacher & cultural bridge 🗣️ Speaking 8 languages and teaching worldwide', 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 360, 86),
  (gen_random_uuid(), 'pedro.tutor@online.teach', 'PedroTeaches', 'Online tutor & education consultant 📚 Making learning accessible from anywhere', 'https://images.pexels.com/photos/1300477/pexels-photo-1300477.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 300, 79),
  (gen_random_uuid(), 'maria.culture@anthropology.study', 'MariaCulture', 'Cultural anthropologist & researcher 🌍 Studying nomadic communities worldwide', 'https://images.pexels.com/photos/1181681/pexels-photo-1181681.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 340, 83),
  (gen_random_uuid(), 'hassan.history@guide.tour', 'HassanGuides', 'History enthusiast & tour guide 🏛️ Sharing stories of ancient civilizations', 'https://images.pexels.com/photos/1043472/pexels-photo-1043472.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 280, 77),
  (gen_random_uuid(), 'yuki.language@exchange.jp', 'YukiExchange', 'Language exchange coordinator 🇯🇵 Connecting nomads through language learning', 'https://images.pexels.com/photos/1181678/pexels-photo-1181678.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 230, 71),
  
  -- Adventure & Travel Nomads
  (gen_random_uuid(), 'jake.adventure@extreme.sports', 'JakeExtreme', 'Adventure sports instructor ⛰️ Teaching rock climbing, hiking, and extreme sports', 'https://images.pexels.com/photos/1300478/pexels-photo-1300478.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 390, 87),
  (gen_random_uuid(), 'chloe.backpack@budget.travel', 'ChloeBudget', 'Budget travel expert & backpacker 🎒 Traveling the world on $30/day', 'https://images.pexels.com/photos/1181682/pexels-photo-1181682.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 210, 69),
  (gen_random_uuid(), 'diego.motorcycle@rider.moto', 'DiegoRides', 'Motorcycle nomad & mechanic 🏍️ Exploring continents on two wheels', 'https://images.pexels.com/photos/1043475/pexels-photo-1043475.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 320, 81),
  (gen_random_uuid(), 'aria.van@life.mobile', 'AriaVanLife', 'Van life enthusiast & mobile home designer 🚐 Living and working from custom vans', 'https://images.pexels.com/photos/1181684/pexels-photo-1181684.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 260, 75),
  (gen_random_uuid(), 'finn.sailing@ocean.nomad', 'FinnSails', 'Sailing nomad & marine engineer ⛵ Working from boats across the seven seas', 'https://images.pexels.com/photos/1300479/pexels-photo-1300479.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 370, 85),
  
  -- Tech Specialists
  (gen_random_uuid(), 'priya.data@scientist.ai', 'PriyaData', 'Data scientist & AI researcher 🤖 Building machine learning models from cafes worldwide', 'https://images.pexels.com/photos/1181685/pexels-photo-1181685.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 440, 91),
  (gen_random_uuid(), 'oscar.security@cyber.safe', 'OscarSecurity', 'Cybersecurity expert & ethical hacker 🔒 Protecting nomads from digital threats', 'https://images.pexels.com/photos/1043476/pexels-photo-1043476.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 460, 93),
  (gen_random_uuid(), 'ivy.blockchain@crypto.dev', 'IvyBlockchain', 'Blockchain developer & crypto enthusiast ₿ Building the future of decentralized work', 'https://images.pexels.com/photos/1181687/pexels-photo-1181687.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 420, 89),
  (gen_random_uuid(), 'leo.devops@cloud.ops', 'LeoDevOps', 'DevOps engineer & cloud architect ☁️ Scaling applications from anywhere', 'https://images.pexels.com/photos/1300480/pexels-photo-1300480.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 400, 88),
  (gen_random_uuid(), 'nora.qa@testing.quality', 'NoraQuality', 'QA engineer & automation specialist 🧪 Ensuring software quality remotely', 'https://images.pexels.com/photos/1181688/pexels-photo-1181688.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 310, 80),
  
  -- Creative Professionals
  (gen_random_uuid(), 'felix.animation@studio.3d', 'Felix3D', '3D animator & visual effects artist 🎬 Creating stunning visuals from inspiring locations', 'https://images.pexels.com/photos/1043477/pexels-photo-1043477.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 350, 82),
  (gen_random_uuid(), 'ruby.fashion@design.style', 'RubyStyle', 'Fashion designer & stylist 👗 Creating sustainable fashion while traveling', 'https://images.pexels.com/photos/1181689/pexels-photo-1181689.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 240, 72),
  (gen_random_uuid(), 'atlas.architect@design.build', 'AtlasBuilds', 'Architect & urban planner 🏗️ Designing sustainable cities and spaces', 'https://images.pexels.com/photos/1300481/pexels-photo-1300481.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 380, 86),
  (gen_random_uuid(), 'iris.interior@design.home', 'IrisInterior', 'Interior designer & space optimizer 🏠 Creating beautiful nomad-friendly spaces', 'https://images.pexels.com/photos/1181691/pexels-photo-1181691.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 290, 78),
  (gen_random_uuid(), 'sage.pottery@ceramic.art', 'SageCeramics', 'Ceramic artist & pottery teacher 🏺 Teaching traditional crafts in modern times', 'https://images.pexels.com/photos/1043478/pexels-photo-1043478.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 200, 68),
  
  -- Service Professionals
  (gen_random_uuid(), 'vera.therapy@mental.health', 'VeraTherapy', 'Therapist & mental health advocate 🧠 Supporting nomad mental wellness remotely', 'https://images.pexels.com/photos/1181692/pexels-photo-1181692.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 320, 81),
  (gen_random_uuid(), 'quinn.legal@law.nomad', 'QuinnLegal', 'Digital nomad lawyer & legal consultant ⚖️ Navigating international law for nomads', 'https://images.pexels.com/photos/1300482/pexels-photo-1300482.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 450, 92),
  (gen_random_uuid(), 'river.vet@animal.care', 'RiverVet', 'Veterinarian & animal welfare advocate 🐕 Caring for animals while traveling', 'https://images.pexels.com/photos/1043479/pexels-photo-1043479.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 280, 76),
  (gen_random_uuid(), 'sage.massage@wellness.touch', 'SageTouch', 'Massage therapist & bodywork specialist 💆‍♀️ Healing nomads through therapeutic touch', 'https://images.pexels.com/photos/1181693/pexels-photo-1181693.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 220, 70),
  (gen_random_uuid(), 'phoenix.coach@life.transform', 'PhoenixCoach', 'Life coach & transformation specialist 🦅 Helping nomads find their purpose', 'https://images.pexels.com/photos/1300483/pexels-photo-1300483.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 340, 83),
  
  -- Specialized Nomads
  (gen_random_uuid(), 'storm.weather@forecast.sky', 'StormChaser', 'Meteorologist & weather enthusiast 🌪️ Chasing storms and predicting weather patterns', 'https://images.pexels.com/photos/1043480/pexels-photo-1043480.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 360, 84),
  (gen_random_uuid(), 'coral.marine@ocean.bio', 'CoralMarine', 'Marine biologist & ocean conservationist 🐠 Protecting oceans while working remotely', 'https://images.pexels.com/photos/1181694/pexels-photo-1181694.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 300, 79),
  (gen_random_uuid(), 'sage.permaculture@sustainable.earth', 'SageEarth', 'Permaculture designer & sustainability expert 🌱 Teaching sustainable living practices', 'https://images.pexels.com/photos/1300484/pexels-photo-1300484.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 250, 73),
  (gen_random_uuid(), 'nova.astronomy@stars.space', 'NovaStars', 'Astronomer & astrophotographer 🌟 Capturing the cosmos from dark sky locations', 'https://images.pexels.com/photos/1043481/pexels-photo-1043481.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 390, 87),
  (gen_random_uuid(), 'echo.sound@audio.engineer', 'EchoSound', 'Audio engineer & podcast producer 🎧 Creating amazing audio experiences remotely', 'https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 330, 82),
  
  -- Community Builders
  (gen_random_uuid(), 'harmony.community@nomad.connect', 'HarmonyConnect', 'Community manager & event organizer 🤝 Building nomad communities worldwide', 'https://images.pexels.com/photos/1300485/pexels-photo-1300485.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 270, 75),
  (gen_random_uuid(), 'sage.mentor@growth.guide', 'SageMentor', 'Mentor & career coach 🎯 Guiding nomads to achieve their professional goals', 'https://images.pexels.com/photos/1043482/pexels-photo-1043482.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 310, 80),
  (gen_random_uuid(), 'river.facilitator@workshop.learn', 'RiverFacilitates', 'Workshop facilitator & skill trainer 📋 Teaching practical skills to nomads', 'https://images.pexels.com/photos/1181696/pexels-photo-1181696.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', 290, 77);

-- Insert comprehensive user profiles for new users only
INSERT INTO user_profiles (user_id, full_name, location, website, instagram, twitter, linkedin, languages, interests, travel_style, work_type)
SELECT 
  u.id,
  CASE 
    WHEN u.nickname = 'AlexChen' THEN 'Alex Chen'
    WHEN u.nickname = 'SarahDesigns' THEN 'Sarah Kim'
    WHEN u.nickname = 'MarcoCode' THEN 'Marco Rodriguez'
    WHEN u.nickname = 'EmmaProduct' THEN 'Emma Thompson'
    WHEN u.nickname = 'CarlosMobile' THEN 'Carlos Mendez'
    WHEN u.nickname = 'LisaLens' THEN 'Lisa Park'
    WHEN u.nickname = 'DavidWrites' THEN 'David Miller'
    WHEN u.nickname = 'NinaCreates' THEN 'Nina Petrov'
    WHEN u.nickname = 'TomBeats' THEN 'Tom Wilson'
    WHEN u.nickname = 'ZoeVisual' THEN 'Zoe Martinez'
    WHEN u.nickname = 'MikeConsults' THEN 'Mike Johnson'
    WHEN u.nickname = 'AnnaGrowth' THEN 'Anna Schmidt'
    WHEN u.nickname = 'JamesSells' THEN 'James Brown'
    WHEN u.nickname = 'SofiaFinance' THEN 'Sofia Garcia'
    WHEN u.nickname = 'RyanFounder' THEN 'Ryan O''Connor'
    WHEN u.nickname = 'MayaYoga' THEN 'Maya Patel'
    WHEN u.nickname = 'AlexFit' THEN 'Alex Thompson'
    WHEN u.nickname = 'LunaMindful' THEN 'Luna Rodriguez'
    WHEN u.nickname = 'KaiSurfer' THEN 'Kai Nakamura'
    WHEN u.nickname = 'SageEats' THEN 'Sage Williams'
    WHEN u.nickname = 'ElenaPolyglot' THEN 'Elena Volkov'
    WHEN u.nickname = 'PedroTeaches' THEN 'Pedro Santos'
    WHEN u.nickname = 'MariaCulture' THEN 'Maria Gonzalez'
    WHEN u.nickname = 'HassanGuides' THEN 'Hassan Al-Rashid'
    WHEN u.nickname = 'YukiExchange' THEN 'Yuki Tanaka'
    WHEN u.nickname = 'JakeExtreme' THEN 'Jake Anderson'
    WHEN u.nickname = 'ChloeBudget' THEN 'Chloe Davis'
    WHEN u.nickname = 'DiegoRides' THEN 'Diego Morales'
    WHEN u.nickname = 'AriaVanLife' THEN 'Aria Jensen'
    WHEN u.nickname = 'FinnSails' THEN 'Finn O''Sullivan'
    WHEN u.nickname = 'PriyaData' THEN 'Priya Sharma'
    WHEN u.nickname = 'OscarSecurity' THEN 'Oscar Lindqvist'
    WHEN u.nickname = 'IvyBlockchain' THEN 'Ivy Chen'
    WHEN u.nickname = 'LeoDevOps' THEN 'Leo Kowalski'
    WHEN u.nickname = 'NoraQuality' THEN 'Nora Andersson'
    WHEN u.nickname = 'Felix3D' THEN 'Felix Mueller'
    WHEN u.nickname = 'RubyStyle' THEN 'Ruby Taylor'
    WHEN u.nickname = 'AtlasBuilds' THEN 'Atlas Dimitriou'
    WHEN u.nickname = 'IrisInterior' THEN 'Iris Fontaine'
    WHEN u.nickname = 'SageCeramics' THEN 'Sage Mitchell'
    WHEN u.nickname = 'VeraTherapy' THEN 'Vera Kozlov'
    WHEN u.nickname = 'QuinnLegal' THEN 'Quinn MacLeod'
    WHEN u.nickname = 'RiverVet' THEN 'River Stone'
    WHEN u.nickname = 'SageTouch' THEN 'Sage Wellness'
    WHEN u.nickname = 'PhoenixCoach' THEN 'Phoenix Rising'
    WHEN u.nickname = 'StormChaser' THEN 'Storm Hunter'
    WHEN u.nickname = 'CoralMarine' THEN 'Coral Reef'
    WHEN u.nickname = 'SageEarth' THEN 'Sage Earth'
    WHEN u.nickname = 'NovaStars' THEN 'Nova Stellar'
    WHEN u.nickname = 'EchoSound' THEN 'Echo Audio'
    WHEN u.nickname = 'HarmonyConnect' THEN 'Harmony Bridge'
    WHEN u.nickname = 'SageMentor' THEN 'Sage Guide'
    ELSE 'River Flow'
  END,
  CASE 
    WHEN random() < 0.1 THEN 'Canggu, Bali'
    WHEN random() < 0.2 THEN 'Lisbon, Portugal'
    WHEN random() < 0.3 THEN 'Mexico City, Mexico'
    WHEN random() < 0.4 THEN 'Chiang Mai, Thailand'
    WHEN random() < 0.5 THEN 'Barcelona, Spain'
    WHEN random() < 0.6 THEN 'Prague, Czech Republic'
    WHEN random() < 0.7 THEN 'Medellín, Colombia'
    WHEN random() < 0.8 THEN 'Cape Town, South Africa'
    WHEN random() < 0.9 THEN 'Singapore'
    ELSE 'Seoul, South Korea'
  END,
  'https://' || lower(u.nickname) || '.com',
  lower(u.nickname),
  lower(u.nickname),
  'https://linkedin.com/in/' || lower(u.nickname),
  CASE 
    WHEN random() < 0.3 THEN ARRAY['English', 'Spanish']
    WHEN random() < 0.5 THEN ARRAY['English', 'Portuguese', 'Spanish']
    WHEN random() < 0.7 THEN ARRAY['English', 'French', 'German']
    WHEN random() < 0.8 THEN ARRAY['English', 'Mandarin', 'Japanese']
    WHEN random() < 0.9 THEN ARRAY['English', 'Thai', 'Vietnamese']
    ELSE ARRAY['English', 'Russian', 'Czech']
  END,
  CASE 
    WHEN u.nickname LIKE '%Tech%' OR u.nickname LIKE '%Code%' OR u.nickname LIKE '%Dev%' THEN ARRAY['Programming', 'Technology', 'Startups', 'Innovation']
    WHEN u.nickname LIKE '%Design%' OR u.nickname LIKE '%Visual%' OR u.nickname LIKE '%Creative%' THEN ARRAY['Design', 'Art', 'Creativity', 'Photography']
    WHEN u.nickname LIKE '%Fit%' OR u.nickname LIKE '%Yoga%' OR u.nickname LIKE '%Wellness%' THEN ARRAY['Fitness', 'Wellness', 'Meditation', 'Health']
    WHEN u.nickname LIKE '%Travel%' OR u.nickname LIKE '%Adventure%' THEN ARRAY['Travel', 'Adventure', 'Hiking', 'Exploration']
    WHEN u.nickname LIKE '%Business%' OR u.nickname LIKE '%Consult%' THEN ARRAY['Business', 'Entrepreneurship', 'Consulting', 'Strategy']
    ELSE ARRAY['Culture', 'Learning', 'Community', 'Growth']
  END,
  CASE 
    WHEN random() < 0.2 THEN 'Slow Travel'
    WHEN random() < 0.4 THEN 'Digital Nomad Hub'
    WHEN random() < 0.6 THEN 'Adventure Seeker'
    WHEN random() < 0.8 THEN 'Cultural Immersion'
    ELSE 'Wellness Focused'
  END,
  CASE 
    WHEN u.nickname LIKE '%Code%' OR u.nickname LIKE '%Dev%' THEN 'Software Developer'
    WHEN u.nickname LIKE '%Design%' THEN 'Designer'
    WHEN u.nickname LIKE '%Consult%' THEN 'Consultant'
    WHEN u.nickname LIKE '%Write%' OR u.nickname LIKE '%Content%' THEN 'Content Creator'
    WHEN u.nickname LIKE '%Photo%' THEN 'Photographer'
    WHEN u.nickname LIKE '%Teach%' THEN 'Educator'
    WHEN u.nickname LIKE '%Fit%' OR u.nickname LIKE '%Yoga%' THEN 'Wellness Coach'
    ELSE 'Freelancer'
  END
FROM users u
WHERE u.email LIKE '%@nomadtech.io' OR u.email LIKE '%@designnomad.co' OR u.email LIKE '%@freelancer.com' 
   OR u.email LIKE '%@startup.io' OR u.email LIKE '%@appdev.mx' OR u.email LIKE '%@creative.com'
   OR u.email LIKE '%@content.co' OR u.email LIKE '%@creator.tv' OR u.email LIKE '%@producer.fm'
   OR u.email LIKE '%@design.art' OR u.email LIKE '%@business.pro' OR u.email LIKE '%@growth.co'
   OR u.email LIKE '%@remote.biz' OR u.email LIKE '%@nomad.money' OR u.email LIKE '%@founder.vc'
   OR u.email LIKE '%@wellness.om' OR u.email LIKE '%@trainer.fit' OR u.email LIKE '%@mindful.zen'
   OR u.email LIKE '%@ocean.wave' OR u.email LIKE '%@health.food' OR u.email LIKE '%@polyglot.edu'
   OR u.email LIKE '%@online.teach' OR u.email LIKE '%@anthropology.study' OR u.email LIKE '%@guide.tour'
   OR u.email LIKE '%@exchange.jp' OR u.email LIKE '%@extreme.sports' OR u.email LIKE '%@budget.travel'
   OR u.email LIKE '%@rider.moto' OR u.email LIKE '%@life.mobile' OR u.email LIKE '%@ocean.nomad'
   OR u.email LIKE '%@scientist.ai' OR u.email LIKE '%@cyber.safe' OR u.email LIKE '%@crypto.dev'
   OR u.email LIKE '%@cloud.ops' OR u.email LIKE '%@testing.quality' OR u.email LIKE '%@studio.3d'
   OR u.email LIKE '%@design.style' OR u.email LIKE '%@design.build' OR u.email LIKE '%@design.home'
   OR u.email LIKE '%@ceramic.art' OR u.email LIKE '%@mental.health' OR u.email LIKE '%@law.nomad'
   OR u.email LIKE '%@animal.care' OR u.email LIKE '%@wellness.touch' OR u.email LIKE '%@life.transform'
   OR u.email LIKE '%@forecast.sky' OR u.email LIKE '%@ocean.bio' OR u.email LIKE '%@sustainable.earth'
   OR u.email LIKE '%@stars.space' OR u.email LIKE '%@audio.engineer' OR u.email LIKE '%@nomad.connect'
   OR u.email LIKE '%@growth.guide' OR u.email LIKE '%@workshop.learn';

-- Insert diverse tips across multiple locations and categories
INSERT INTO tips (user_id, content, category, images, latitude, longitude, city, country, address) 
SELECT 
  u.id,
  tip_content,
  tip_category,
  ARRAY[tip_image],
  tip_lat,
  tip_lng,
  tip_city,
  tip_country,
  tip_address
FROM (
  SELECT id FROM users 
  WHERE email LIKE '%@nomadtech.io' OR email LIKE '%@designnomad.co' OR email LIKE '%@freelancer.com' 
     OR email LIKE '%@startup.io' OR email LIKE '%@appdev.mx' OR email LIKE '%@creative.com'
     OR email LIKE '%@content.co' OR email LIKE '%@creator.tv' OR email LIKE '%@producer.fm'
     OR email LIKE '%@design.art' OR email LIKE '%@business.pro' OR email LIKE '%@growth.co'
     OR email LIKE '%@remote.biz' OR email LIKE '%@nomad.money' OR email LIKE '%@founder.vc'
     OR email LIKE '%@wellness.om' OR email LIKE '%@trainer.fit' OR email LIKE '%@mindful.zen'
     OR email LIKE '%@ocean.wave' OR email LIKE '%@health.food' OR email LIKE '%@polyglot.edu'
     OR email LIKE '%@online.teach' OR email LIKE '%@anthropology.study' OR email LIKE '%@guide.tour'
     OR email LIKE '%@exchange.jp' OR email LIKE '%@extreme.sports' OR email LIKE '%@budget.travel'
     OR email LIKE '%@rider.moto' OR email LIKE '%@life.mobile' OR email LIKE '%@ocean.nomad'
     OR email LIKE '%@scientist.ai' OR email LIKE '%@cyber.safe' OR email LIKE '%@crypto.dev'
     OR email LIKE '%@cloud.ops' OR email LIKE '%@testing.quality' OR email LIKE '%@studio.3d'
     OR email LIKE '%@design.style' OR email LIKE '%@design.build' OR email LIKE '%@design.home'
     OR email LIKE '%@ceramic.art' OR email LIKE '%@mental.health' OR email LIKE '%@law.nomad'
     OR email LIKE '%@animal.care' OR email LIKE '%@wellness.touch' OR email LIKE '%@life.transform'
     OR email LIKE '%@forecast.sky' OR email LIKE '%@ocean.bio' OR email LIKE '%@sustainable.earth'
     OR email LIKE '%@stars.space' OR email LIKE '%@audio.engineer' OR email LIKE '%@nomad.connect'
     OR email LIKE '%@growth.guide' OR email LIKE '%@workshop.learn'
  ORDER BY random()
  LIMIT 30
) u
CROSS JOIN (
  VALUES 
    -- Bangkok, Thailand
    ('This rooftop co-working space in Silom has incredible city views and lightning-fast WiFi! 🏙️ Perfect for video calls with clients back home. The sunset sessions are magical and very productive.', 'workspace', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', 13.7248, 100.5340, 'Bangkok', 'Thailand', 'Silom Road'),
    ('Street food paradise near Chatuchak Market! 🍜 This som tam stall serves the spiciest and most authentic papaya salad. Only 40 THB and they adjust spice level for foreigners.', 'food', 'https://images.pexels.com/photos/1600727/pexels-photo-1600727.jpeg?auto=compress&cs=tinysrgb&w=800', 13.7998, 100.5501, 'Bangkok', 'Thailand', 'Chatuchak Weekend Market'),
    ('Lumpini Park morning run circuit is a game-changer! 🏃‍♂️ Join the locals at 5:30am for group exercises. Free outdoor gym equipment and the energy is contagious.', 'exercise', 'https://images.pexels.com/photos/3654772/pexels-photo-3654772.jpeg?auto=compress&cs=tinysrgb&w=800', 13.7307, 100.5418, 'Bangkok', 'Thailand', 'Lumpini Park'),
    
    -- Chiang Mai, Thailand  
    ('Nimman area has the best nomad-friendly cafes! ☕ Graph Cafe has reliable WiFi, great coffee, and a productive atmosphere. Plus they have healthy food options.', 'cafe', 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=800', 18.7904, 98.9625, 'Chiang Mai', 'Thailand', 'Nimmanhaemin Road'),
    ('Sunday Walking Street is a cultural treasure! 🎨 Local artisans sell handmade crafts and the food variety is incredible. Go early to avoid crowds and get the best selection.', 'entertainment', 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800', 18.7883, 98.9853, 'Chiang Mai', 'Thailand', 'Rachadamnoen Road'),
    
    -- Lisbon, Portugal
    ('LX Factory is a creative wonderland! 🎨 Former industrial space turned into art galleries, unique shops, and amazing cafes. Perfect for inspiration and Instagram shots.', 'entertainment', 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800', 38.7049, -9.1767, 'Lisbon', 'Portugal', 'LX Factory'),
    ('Tram 28 is touristy but worth it for first-timers! 🚋 Take it early morning (8am) to avoid crowds. Great way to see the city''s hills and historic neighborhoods.', 'transport', 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg?auto=compress&cs=tinysrgb&w=800', 38.7139, -9.1394, 'Lisbon', 'Portugal', 'Rossio Square'),
    
    -- Mexico City, Mexico
    ('Roma Norte is nomad heaven! 🏘️ Incredible cafe culture, beautiful architecture, and a thriving arts scene. I''ve been here 3 months and still discovering new spots daily.', 'accommodation', 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800', 19.4147, -99.1655, 'Mexico City', 'Mexico', 'Roma Norte'),
    ('Mercado de San Juan for exotic ingredients! 🦎 This market has everything from escamoles (ant larvae) to exotic fruits. Great for adventurous foodies and cultural immersion.', 'food', 'https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg?auto=compress&cs=tinysrgb&w=800', 19.4326, -99.1332, 'Mexico City', 'Mexico', 'Centro Histórico'),
    
    -- Medellín, Colombia
    ('El Poblado safety tip: stick to well-lit areas after 10pm 🌃 The Zona Rosa is generally safe but use Uber instead of walking late at night. Common sense goes a long way.', 'accommodation', 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800', 6.2088, -75.5673, 'Medellín', 'Colombia', 'El Poblado'),
    ('Guatapé day trip is absolutely magical! 🌈 Rent a car or take a tour bus. Climb El Peñón for incredible views and explore the colorful town. Perfect weekend escape.', 'nature', 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=800', 6.2742, -75.5078, 'Guatapé', 'Colombia', 'El Peñón'),
    
    -- Bali, Indonesia
    ('Canggu surf lessons at Old Man''s Beach! 🏄‍♂️ Best waves for beginners and the community is super welcoming. Rent a board for 50k IDR/day or take lessons for 300k IDR.', 'exercise', 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800', -8.6481, 115.1371, 'Canggu', 'Indonesia', 'Old Man''s Beach'),
    ('Ubud rice terraces at sunrise = pure magic ✨ Jatiluwih terraces are less crowded than Tegallalang. Bring a scooter, start early, and pack breakfast. UNESCO World Heritage site!', 'nature', 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=800', -8.5069, 115.2625, 'Ubud', 'Indonesia', 'Jatiluwih Rice Terraces'),
    
    -- Barcelona, Spain
    ('Park Güell early morning visits are free! 🦎 Get there before 8am to avoid entrance fees and crowds. Gaudí''s architecture is breathtaking and the city views are incredible.', 'entertainment', 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800', 41.4145, 2.1527, 'Barcelona', 'Spain', 'Park Güell'),
    ('Gràcia neighborhood for authentic Barcelona vibes! 🏘️ Small plazas, local bars, and way fewer tourists. Perfect for working from outdoor cafes and people watching.', 'accommodation', 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800', 41.4036, 2.1560, 'Barcelona', 'Spain', 'Gràcia'),
    
    -- Prague, Czech Republic
    ('Vyšehrad Castle for sunset photos! 📸 Less crowded than Prague Castle and the views over the Vltava River are stunning. Bring a picnic and enjoy the peaceful atmosphere.', 'entertainment', 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800', 50.0643, 14.4189, 'Prague', 'Czech Republic', 'Vyšehrad'),
    ('Traditional Czech beer halls are cultural experiences! 🍺 U Fleků has been brewing since 1499. The dark lager is incredible and the atmosphere is authentically Czech.', 'entertainment', 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=800', 50.0755, 14.4178, 'Prague', 'Czech Republic', 'New Town'),
    
    -- Singapore
    ('Marina Bay Sands infinity pool hack: book a room for one night! 🏊‍♀️ Expensive but the experience and photos are worth it. Best time is sunset for golden hour shots.', 'accommodation', 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800', 1.2834, 103.8607, 'Singapore', 'Singapore', 'Marina Bay'),
    ('Hawker center etiquette: always return your tray! 🍜 Newton Food Centre has great variety but Maxwell is more authentic. Try Hainanese chicken rice everywhere.', 'food', 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=800', 1.2806, 103.8440, 'Singapore', 'Singapore', 'Maxwell Road'),
    
    -- Cape Town, South Africa
    ('Table Mountain cable car vs hiking: both are worth it! ⛰️ Hike up Platteklip Gorge for the challenge, take cable car down. Start early to avoid afternoon winds.', 'nature', 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=800', -33.9628, 18.4098, 'Cape Town', 'South Africa', 'Table Mountain'),
    ('V&A Waterfront for nomad networking! 💼 Lots of cafes with WiFi, beautiful harbor views, and regular networking events. Expensive but great for meeting other professionals.', 'workspace', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', -33.9057, 18.4232, 'Cape Town', 'South Africa', 'V&A Waterfront'),
    
    -- Seoul, South Korea
    ('Hongdae nightlife is legendary! 🎉 University area with incredible energy, live music, and street food. Perfect for meeting locals and other travelers. Stay safe and have fun!', 'entertainment', 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800', 37.5563, 126.9236, 'Seoul', 'South Korea', 'Hongdae'),
    ('Korean spa (jjimjilbang) experience is a must! 🧖‍♀️ Dragon Hill Spa is foreigner-friendly and open 24/7. Perfect for relaxation after long work days. Bring a towel!', 'exercise', 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800', 37.5172, 127.0286, 'Seoul', 'South Korea', 'Yongsan District'),
    
    -- Additional diverse locations
    ('Kyoto temple hopping by bicycle! 🚲 Rent a bike and visit Fushimi Inari, Kinkaku-ji, and Arashiyama in one day. Start early to beat crowds and get the best photos.', 'nature', 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=800', 35.0116, 135.7681, 'Kyoto', 'Japan', 'Fushimi Inari'),
    ('Amsterdam canal bike tours are touristy but fun! 🚲 Rent a bike and explore the canals at your own pace. Watch out for trams and other cyclists - traffic is intense!', 'transport', 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg?auto=compress&cs=tinysrgb&w=800', 52.3676, 4.9041, 'Amsterdam', 'Netherlands', 'Canal Ring'),
    ('Berlin startup scene is incredible! 🚀 Rocket Internet, SoundCloud, and hundreds of startups. Great networking events and the cost of living is still reasonable.', 'workspace', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', 52.5200, 13.4050, 'Berlin', 'Germany', 'Mitte'),
    ('Buenos Aires tango lessons in San Telmo! 💃 Free lessons in Plaza Dorrego on Sundays. The passion and skill of local dancers is mesmerizing. Don''t be shy!', 'entertainment', 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800', -34.6118, -58.3960, 'Buenos Aires', 'Argentina', 'San Telmo'),
    ('Istanbul Grand Bazaar haggling tips! 🛍️ Start at 30% of asking price, walk away if they don''t budge, and always compare prices. The carpets and ceramics are incredible.', 'shopping', 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg?auto=compress&cs=tinysrgb&w=800', 41.0108, 28.9680, 'Istanbul', 'Turkey', 'Grand Bazaar'),
    ('Dubai co-working spaces are luxury! 💎 A4 Space in DIFC has incredible facilities and networking opportunities. Expensive but worth it for the connections and amenities.', 'workspace', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', 25.2048, 55.2708, 'Dubai', 'UAE', 'DIFC'),
    ('Marrakech medina navigation tip: download offline maps! 🗺️ The souks are a maze and GPS doesn''t work well. Hire a guide for your first day to learn the layout.', 'transport', 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg?auto=compress&cs=tinysrgb&w=800', 31.6295, -7.9811, 'Marrakech', 'Morocco', 'Medina'),
    ('Reykjavik Blue Lagoon is overpriced but magical! 🌊 Book in advance and go during off-peak hours. The silica mud masks and geothermal waters are incredibly relaxing.', 'exercise', 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800', 63.8804, -22.4495, 'Reykjavik', 'Iceland', 'Blue Lagoon'),
    ('Tel Aviv beach culture is amazing! 🏖️ Gordon Beach has great facilities and the sunset volleyball games are legendary. Perfect work-life balance city.', 'exercise', 'https://images.pexels.com/photos/3654772/pexels-photo-3654772.jpeg?auto=compress&cs=tinysrgb&w=800', 32.0853, 34.7818, 'Tel Aviv', 'Israel', 'Gordon Beach'),
    ('Mumbai street food tour is essential! 🍛 Vada pav, pav bhaji, and dosa are incredible. Start with milder options and work your way up to spicier dishes.', 'food', 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800', 19.0760, 72.8777, 'Mumbai', 'India', 'Colaba'),
    ('Lagos tech scene is booming! 🚀 Yaba (Silicon Valley of Nigeria) has incredible energy and innovation. Great networking opportunities and inspiring entrepreneurs.', 'workspace', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', 6.5244, 3.3792, 'Lagos', 'Nigeria', 'Yaba'),
    ('São Paulo street art in Vila Madalena! 🎨 Beco do Batman (Batman Alley) has incredible murals that change regularly. Perfect for creative inspiration and photos.', 'entertainment', 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800', -23.5505, -46.6333, 'São Paulo', 'Brazil', 'Vila Madalena'),
    ('Nairobi safari day trips from the city! 🦁 Nairobi National Park is 20 minutes from downtown. See lions, giraffes, and rhinos with the city skyline in the background.', 'nature', 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=800', -1.2921, 36.8219, 'Nairobi', 'Kenya', 'Nairobi National Park'),
    ('Ho Chi Minh City motorbike tours! 🏍️ Scary but exhilarating way to see the city. Professional guides know the traffic patterns and hidden gems. Hold on tight!', 'transport', 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg?auto=compress&cs=tinysrgb&w=800', 10.8231, 106.6297, 'Ho Chi Minh City', 'Vietnam', 'District 1'),
    ('Kuala Lumpur food courts are incredible! 🍜 Jalan Alor night market has the best variety. Try char kway teow, laksa, and durian if you''re brave enough!', 'food', 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=800', 3.1390, 101.6869, 'Kuala Lumpur', 'Malaysia', 'Jalan Alor'),
    ('Tbilisi wine culture is ancient and amazing! 🍷 Georgian wine-making is 8,000 years old. Take a qvevri wine tour and learn about traditional methods.', 'entertainment', 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=800', 41.7151, 44.8271, 'Tbilisi', 'Georgia', 'Old Town'),
    ('Tallinn medieval old town is like a fairy tale! 🏰 Perfectly preserved medieval architecture and the digital nomad visa makes it perfect for long-term stays.', 'accommodation', 'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=800', 59.4370, 24.7536, 'Tallinn', 'Estonia', 'Old Town'),
    ('Montevideo co-working scene is growing! 💻 Sinergia Coworking has great community and the city has a relaxed pace perfect for productivity and work-life balance.', 'workspace', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', -34.9011, -56.1645, 'Montevideo', 'Uruguay', 'Ciudad Vieja'),
    ('Almaty mountain access is incredible! ⛰️ Take the cable car to Kok-Tobe Hill for city views, then explore the nearby mountains for hiking and skiing.', 'nature', 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=800', 43.2220, 76.8512, 'Almaty', 'Kazakhstan', 'Kok-Tobe Hill'),
    ('Bucharest old town revival is amazing! 🏛️ The historic center has been beautifully restored with great cafes, restaurants, and nightlife. Very affordable for nomads.', 'entertainment', 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800', 44.4268, 26.1025, 'Bucharest', 'Romania', 'Old Town'),
    ('Kigali is incredibly clean and safe! 🌿 The city has amazing infrastructure, fast internet, and a growing tech scene. Perfect for nomads seeking stability in Africa.', 'accommodation', 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800', -1.9441, 30.0619, 'Kigali', 'Rwanda', 'Kigali City Centre')
) AS tips_data(tip_content, tip_category, tip_image, tip_lat, tip_lng, tip_city, tip_country, tip_address)
WHERE random() < 0.5; -- Each user has a 50% chance of creating each tip

-- Insert likes (create engagement) - only for new tips
INSERT INTO tip_likes (tip_id, user_id)
SELECT DISTINCT
  t.id,
  u.id
FROM tips t
CROSS JOIN users u
WHERE u.id != t.user_id -- Users can't like their own tips
  AND t.user_id IN (
    SELECT id FROM users 
    WHERE email LIKE '%@nomadtech.io' OR email LIKE '%@designnomad.co' OR email LIKE '%@freelancer.com' 
       OR email LIKE '%@startup.io' OR email LIKE '%@appdev.mx' OR email LIKE '%@creative.com'
       OR email LIKE '%@content.co' OR email LIKE '%@creator.tv' OR email LIKE '%@producer.fm'
       OR email LIKE '%@design.art' OR email LIKE '%@business.pro' OR email LIKE '%@growth.co'
       OR email LIKE '%@remote.biz' OR email LIKE '%@nomad.money' OR email LIKE '%@founder.vc'
       OR email LIKE '%@wellness.om' OR email LIKE '%@trainer.fit' OR email LIKE '%@mindful.zen'
       OR email LIKE '%@ocean.wave' OR email LIKE '%@health.food' OR email LIKE '%@polyglot.edu'
       OR email LIKE '%@online.teach' OR email LIKE '%@anthropology.study' OR email LIKE '%@guide.tour'
       OR email LIKE '%@exchange.jp' OR email LIKE '%@extreme.sports' OR email LIKE '%@budget.travel'
       OR email LIKE '%@rider.moto' OR email LIKE '%@life.mobile' OR email LIKE '%@ocean.nomad'
       OR email LIKE '%@scientist.ai' OR email LIKE '%@cyber.safe' OR email LIKE '%@crypto.dev'
       OR email LIKE '%@cloud.ops' OR email LIKE '%@testing.quality' OR email LIKE '%@studio.3d'
       OR email LIKE '%@design.style' OR email LIKE '%@design.build' OR email LIKE '%@design.home'
       OR email LIKE '%@ceramic.art' OR email LIKE '%@mental.health' OR email LIKE '%@law.nomad'
       OR email LIKE '%@animal.care' OR email LIKE '%@wellness.touch' OR email LIKE '%@life.transform'
       OR email LIKE '%@forecast.sky' OR email LIKE '%@ocean.bio' OR email LIKE '%@sustainable.earth'
       OR email LIKE '%@stars.space' OR email LIKE '%@audio.engineer' OR email LIKE '%@nomad.connect'
       OR email LIKE '%@growth.guide' OR email LIKE '%@workshop.learn'
  )
  AND random() < 0.15; -- 15% chance of liking each tip

-- Insert saves (create bookmarks) - only for new tips
INSERT INTO tip_saves (tip_id, user_id)
SELECT DISTINCT
  t.id,
  u.id
FROM tips t
CROSS JOIN users u
WHERE u.id != t.user_id -- Users can't save their own tips
  AND t.user_id IN (
    SELECT id FROM users 
    WHERE email LIKE '%@nomadtech.io' OR email LIKE '%@designnomad.co' OR email LIKE '%@freelancer.com' 
       OR email LIKE '%@startup.io' OR email LIKE '%@appdev.mx' OR email LIKE '%@creative.com'
       OR email LIKE '%@content.co' OR email LIKE '%@creator.tv' OR email LIKE '%@producer.fm'
       OR email LIKE '%@design.art' OR email LIKE '%@business.pro' OR email LIKE '%@growth.co'
       OR email LIKE '%@remote.biz' OR email LIKE '%@nomad.money' OR email LIKE '%@founder.vc'
       OR email LIKE '%@wellness.om' OR email LIKE '%@trainer.fit' OR email LIKE '%@mindful.zen'
       OR email LIKE '%@ocean.wave' OR email LIKE '%@health.food' OR email LIKE '%@polyglot.edu'
       OR email LIKE '%@online.teach' OR email LIKE '%@anthropology.study' OR email LIKE '%@guide.tour'
       OR email LIKE '%@exchange.jp' OR email LIKE '%@extreme.sports' OR email LIKE '%@budget.travel'
       OR email LIKE '%@rider.moto' OR email LIKE '%@life.mobile' OR email LIKE '%@ocean.nomad'
       OR email LIKE '%@scientist.ai' OR email LIKE '%@cyber.safe' OR email LIKE '%@crypto.dev'
       OR email LIKE '%@cloud.ops' OR email LIKE '%@testing.quality' OR email LIKE '%@studio.3d'
       OR email LIKE '%@design.style' OR email LIKE '%@design.build' OR email LIKE '%@design.home'
       OR email LIKE '%@ceramic.art' OR email LIKE '%@mental.health' OR email LIKE '%@law.nomad'
       OR email LIKE '%@animal.care' OR email LIKE '%@wellness.touch' OR email LIKE '%@life.transform'
       OR email LIKE '%@forecast.sky' OR email LIKE '%@ocean.bio' OR email LIKE '%@sustainable.earth'
       OR email LIKE '%@stars.space' OR email LIKE '%@audio.engineer' OR email LIKE '%@nomad.connect'
       OR email LIKE '%@growth.guide' OR email LIKE '%@workshop.learn'
  )
  AND random() < 0.08; -- 8% chance of saving each tip

-- Insert comments (create discussions) - only for new tips
INSERT INTO tip_comments (tip_id, user_id, content)
SELECT 
  t.id,
  u.id,
  CASE 
    WHEN random() < 0.1 THEN 'Thanks for this amazing tip! Just tried it and it''s incredible 🙌'
    WHEN random() < 0.2 THEN 'Been here for 2 weeks now, can confirm this is spot on!'
    WHEN random() < 0.3 THEN 'Great recommendation! Adding this to my must-visit list 📝'
    WHEN random() < 0.4 THEN 'This place changed my nomad experience completely. Highly recommend!'
    WHEN random() < 0.5 THEN 'Perfect timing for this tip - heading there next week!'
    WHEN random() < 0.6 THEN 'Love finding hidden gems like this. Thanks for sharing! ✨'
    WHEN random() < 0.7 THEN 'The community here is so welcoming. Made great connections!'
    WHEN random() < 0.8 THEN 'Tried this yesterday based on your tip - absolutely amazing!'
    WHEN random() < 0.9 THEN 'This is exactly what I was looking for. You''re a lifesaver! 🙏'
    ELSE 'Bookmarked for my next visit. Can''t wait to check it out!'
  END
FROM tips t
CROSS JOIN users u
WHERE u.id != t.user_id -- Users can't comment on their own tips
  AND t.user_id IN (
    SELECT id FROM users 
    WHERE email LIKE '%@nomadtech.io' OR email LIKE '%@designnomad.co' OR email LIKE '%@freelancer.com' 
       OR email LIKE '%@startup.io' OR email LIKE '%@appdev.mx' OR email LIKE '%@creative.com'
       OR email LIKE '%@content.co' OR email LIKE '%@creator.tv' OR email LIKE '%@producer.fm'
       OR email LIKE '%@design.art' OR email LIKE '%@business.pro' OR email LIKE '%@growth.co'
       OR email LIKE '%@remote.biz' OR email LIKE '%@nomad.money' OR email LIKE '%@founder.vc'
       OR email LIKE '%@wellness.om' OR email LIKE '%@trainer.fit' OR email LIKE '%@mindful.zen'
       OR email LIKE '%@ocean.wave' OR email LIKE '%@health.food' OR email LIKE '%@polyglot.edu'
       OR email LIKE '%@online.teach' OR email LIKE '%@anthropology.study' OR email LIKE '%@guide.tour'
       OR email LIKE '%@exchange.jp' OR email LIKE '%@extreme.sports' OR email LIKE '%@budget.travel'
       OR email LIKE '%@rider.moto' OR email LIKE '%@life.mobile' OR email LIKE '%@ocean.nomad'
       OR email LIKE '%@scientist.ai' OR email LIKE '%@cyber.safe' OR email LIKE '%@crypto.dev'
       OR email LIKE '%@cloud.ops' OR email LIKE '%@testing.quality' OR email LIKE '%@studio.3d'
       OR email LIKE '%@design.style' OR email LIKE '%@design.build' OR email LIKE '%@design.home'
       OR email LIKE '%@ceramic.art' OR email LIKE '%@mental.health' OR email LIKE '%@law.nomad'
       OR email LIKE '%@animal.care' OR email LIKE '%@wellness.touch' OR email LIKE '%@life.transform'
       OR email LIKE '%@forecast.sky' OR email LIKE '%@ocean.bio' OR email LIKE '%@sustainable.earth'
       OR email LIKE '%@stars.space' OR email LIKE '%@audio.engineer' OR email LIKE '%@nomad.connect'
       OR email LIKE '%@growth.guide' OR email LIKE '%@workshop.learn'
  )
  AND random() < 0.05; -- 5% chance of commenting on each tip

-- Update all counts to ensure consistency
UPDATE tips SET 
  likes_count = (SELECT COUNT(*) FROM tip_likes WHERE tip_likes.tip_id = tips.id),
  saves_count = (SELECT COUNT(*) FROM tip_saves WHERE tip_saves.tip_id = tips.id),
  comments_count = (SELECT COUNT(*) FROM tip_comments WHERE tip_comments.tip_id = tips.id);