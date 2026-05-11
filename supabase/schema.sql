-- Mountain Tour Samui Database Schema
-- Run this in your Supabase SQL editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TOURS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS tours (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  cover_image TEXT,
  gallery TEXT[] DEFAULT '{}',
  price_adult DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_child DECIMAL(10,2),
  duration DECIMAL(4,1) NOT NULL DEFAULT 8,
  pickup_info TEXT,
  what_to_bring TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TOUR TRANSLATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS tour_translations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('en', 'th', 'zh')),
  title TEXT NOT NULL DEFAULT '',
  short_description TEXT DEFAULT '',
  full_description TEXT DEFAULT '',
  highlights JSONB DEFAULT '[]',
  itinerary JSONB DEFAULT '[]',
  included JSONB DEFAULT '[]',
  excluded JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tour_id, language)
);

-- =============================================
-- GALLERY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  category TEXT DEFAULT 'general',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BOOKINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT NOT NULL,
  hotel TEXT,
  tour_id UUID REFERENCES tours(id) ON DELETE SET NULL,
  travel_date DATE NOT NULL,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- REVIEWS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_country TEXT DEFAULT '',
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  tour_id UUID REFERENCES tours(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SITE SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ADMIN USERS TABLE (extends Supabase auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TRIGGERS: updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_tours_updated_at
  BEFORE UPDATE ON tours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_tour_translations_updated_at
  BEFORE UPDATE ON tour_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Tours: public read, admin write
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tours are publicly viewable" ON tours FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage tours" ON tours FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Tour translations: public read, admin write
ALTER TABLE tour_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tour translations are publicly viewable" ON tour_translations FOR SELECT USING (true);
CREATE POLICY "Admins can manage tour translations" ON tour_translations FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Gallery: public read, admin write
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery is publicly viewable" ON gallery FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery" ON gallery FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Bookings: insert public, admin full access
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage bookings" ON bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Reviews: public read, admin write
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved reviews are publicly viewable" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Admins can manage reviews" ON reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Site settings: public read, admin write
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site settings are publicly viewable" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Admin profiles: admin read only
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view profiles" ON admin_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "Admin can update own profile" ON admin_profiles FOR UPDATE USING (id = auth.uid());

-- =============================================
-- STORAGE BUCKETS
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('tour-images', 'tour-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view tour images" ON storage.objects FOR SELECT USING (bucket_id = 'tour-images');
CREATE POLICY "Admins can upload tour images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'tour-images' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can delete tour images" ON storage.objects FOR DELETE USING (
  bucket_id = 'tour-images' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "Public can view gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Admins can upload gallery" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'gallery' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can delete gallery" ON storage.objects FOR DELETE USING (
  bucket_id = 'gallery' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- =============================================
-- SEED DATA
-- =============================================

-- Default site settings
INSERT INTO site_settings (key, value) VALUES
  ('hero_title_en', 'Discover the Magic of Koh Samui'),
  ('hero_subtitle_en', 'Experience unforgettable island adventures'),
  ('contact_phone', '+66 95 618 2397'),
  ('contact_email', 'mountaintoursamui@gmail.com'),
  ('contact_whatsapp', '+66956182397'),
  ('google_maps_embed', ''),
  ('instagram_url', ''),
  ('facebook_url', ''),
  ('tiktok_url', '')
ON CONFLICT (key) DO NOTHING;

-- Sample reviews
INSERT INTO reviews (author_name, author_country, rating, comment, is_featured) VALUES
  ('Sarah Johnson', 'United Kingdom', 5, 'Absolutely amazing experience! Our guide was knowledgeable and friendly. The tour was well-organized and we saw the most beautiful parts of Koh Samui. Highly recommend Mountain Tour Samui!', true),
  ('Hans Mueller', 'Germany', 5, 'We booked the island tour and it was perfect. The driver was punctual, the itinerary was great, and we discovered hidden gems we would never have found on our own. Will book again!', true),
  ('Yuki Tanaka', 'Japan', 5, 'Best tour company in Koh Samui! Professional service, great communication, and the price was very reasonable. Our family had an incredible time. Thank you Mountain Tour Samui!', true),
  ('Chen Wei', 'China', 5, '非常专业的旅游公司！导游很友善，行程安排合理，让我们全家都玩得很开心。强烈推荐！', true),
  ('Marie Dupont', 'France', 5, 'Service excellent! Notre guide parlait plusieurs langues et connaissait parfaitement l île. Nous avons vécu une journée magique. Merci Mountain Tour Samui!', true),
  ('Michael Brown', 'Australia', 4, 'Great tour with beautiful scenery. The team was very professional and accommodating. Would definitely book again on our next visit to Samui!', true)
ON CONFLICT DO NOTHING;

-- Sample tour (with translations)
WITH new_tour AS (
  INSERT INTO tours (slug, price_adult, price_child, duration, is_featured, pickup_info, what_to_bring)
  VALUES (
    'samui-island-highlights',
    1500,
    750,
    8,
    true,
    'We pick you up from your hotel. Please provide your hotel name and room number when booking.',
    'Comfortable walking shoes, sunscreen, hat, camera, swimwear, and a light jacket.'
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
)
INSERT INTO tour_translations (tour_id, language, title, short_description, full_description, highlights, itinerary, included, excluded)
SELECT
  id,
  'en',
  'Koh Samui Island Highlights Tour',
  'Discover the best of Koh Samui in one amazing day — from sacred temples to stunning viewpoints and beautiful beaches.',
  '<p>Join us on the ultimate Koh Samui experience! This full-day tour takes you to the island''s most iconic landmarks and hidden treasures. Led by our expert local guides, you''ll discover the spiritual heart of Samui, marvel at panoramic ocean views, and relax on pristine beaches.</p><p>Our comfortable air-conditioned vehicle ensures a relaxing journey between destinations, while our guides share fascinating stories about the island''s history, culture, and traditions.</p>',
  '["Visit the Big Buddha Temple (Wat Phra Yai)", "Stunning viewpoints with panoramic sea views", "Secret waterfalls in the jungle", "Crystal clear swimming spots", "Traditional local lunch included", "Small group experience (max 8 people)"]',
  '[{"time": "08:00", "description": "Hotel pickup from your accommodation"}, {"time": "09:00", "description": "Visit Big Buddha Temple - the island''s most iconic landmark"}, {"time": "10:30", "description": "Explore Hin Ta and Hin Yai rocks"}, {"time": "12:00", "description": "Traditional Thai lunch at local restaurant"}, {"time": "13:30", "description": "Namuang Waterfall - swim in natural pools"}, {"time": "15:00", "description": "Secret viewpoint with stunning panoramic views"}, {"time": "16:30", "description": "Sunset at Chaweng Beach"}, {"time": "17:30", "description": "Return to your hotel"}]',
  '["Hotel pickup and drop-off", "Air-conditioned vehicle", "English-speaking guide", "Traditional Thai lunch", "Water and refreshments", "Entrance fees to all attractions"]',
  '["Personal expenses", "Tips for guides (appreciated)", "Alcoholic beverages", "Souvenirs"]'
FROM new_tour;
