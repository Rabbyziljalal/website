-- ============================================================
-- Supabase SQL Migration Script
-- Run this in your Supabase SQL Editor to create all required tables
-- ============================================================

-- Education Timeline Data
CREATE TABLE IF NOT EXISTS portfolio_education (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education Cards (Skills, Achievements, Certifications)
CREATE TABLE IF NOT EXISTS portfolio_education_cards (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements Data
CREATE TABLE IF NOT EXISTS portfolio_achievements (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Career Timeline Data
CREATE TABLE IF NOT EXISTS portfolio_timeline (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects Data
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Stats Data
CREATE TABLE IF NOT EXISTS portfolio_project_stats (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials Data
CREATE TABLE IF NOT EXISTS portfolio_testimonials (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonial Stats Data
CREATE TABLE IF NOT EXISTS portfolio_testimonial_stats (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Data
CREATE TABLE IF NOT EXISTS portfolio_blog (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profile Image Data
CREATE TABLE IF NOT EXISTS portfolio_profile (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CV Data
CREATE TABLE IF NOT EXISTS portfolio_cv (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings Data
CREATE TABLE IF NOT EXISTS portfolio_settings (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional, for production)
ALTER TABLE portfolio_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_education_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_project_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_testimonial_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_blog ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_cv ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access (using anon key)
-- In production, you should restrict this further
CREATE POLICY "Allow public read access" ON portfolio_education FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON portfolio_education FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON portfolio_education FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON portfolio_education_cards FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON portfolio_education_cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON portfolio_education_cards FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON portfolio_achievements FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON portfolio_achievements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON portfolio_achievements FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON portfolio_timeline FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON portfolio_timeline FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON portfolio_timeline FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON portfolio_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON portfolio_projects FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON portfolio_project_stats FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON portfolio_project_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON portfolio_project_stats FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON portfolio_testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON portfolio_testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON portfolio_testimonials FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON portfolio_testimonial_stats FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON portfolio_testimonial_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON portfolio_testimonial_stats FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON portfolio_blog FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON portfolio_blog FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON portfolio_blog FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON portfolio_profile FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON portfolio_profile FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON portfolio_profile FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON portfolio_cv FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON portfolio_cv FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON portfolio_cv FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON portfolio_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update" ON portfolio_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON portfolio_settings FOR UPDATE USING (true);