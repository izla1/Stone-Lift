
-- =========================================
-- Stone Lift CMS schema
-- =========================================

-- 1) Global key/value site settings (text, colors, images, contact, social, etc.)
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_settings_read_all" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings_write_all" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- 2) Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subtitle_en TEXT,
  subtitle_ar TEXT,
  tagline_en TEXT,
  tagline_ar TEXT,
  desc_en TEXT,
  desc_ar TEXT,
  image TEXT,
  video_url TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  tag TEXT,
  accent TEXT DEFAULT 'gold',
  features_en JSONB NOT NULL DEFAULT '[]'::jsonb,
  features_ar JSONB NOT NULL DEFAULT '[]'::jsonb,
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_read_all" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_write_all" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- 3) Custom pages (admin can create new pages with their own slug)
CREATE TABLE public.custom_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_ar TEXT,
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  show_in_nav BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "custom_pages_read_all" ON public.custom_pages FOR SELECT USING (true);
CREATE POLICY "custom_pages_write_all" ON public.custom_pages FOR ALL USING (true) WITH CHECK (true);

-- 4) Team members (dashboard logins)
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "team_members_read_all" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "team_members_write_all" ON public.team_members FOR ALL USING (true) WITH CHECK (true);

-- 5) Leads
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_read_all" ON public.leads FOR SELECT USING (true);
CREATE POLICY "leads_write_all" ON public.leads FOR ALL USING (true) WITH CHECK (true);

-- Seed initial admin user
INSERT INTO public.team_members (username, password, display_name, role)
VALUES ('ISLAM', 'STMRM', 'Islam', 'owner');
