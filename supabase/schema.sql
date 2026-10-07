-- FoodBridge AI Database Schema
-- Supabase PostgreSQL Setup

-- 1. Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enums
CREATE TYPE user_role AS ENUM ('donor', 'ngo', 'admin');
CREATE TYPE food_type_enum AS ENUM ('vegetarian', 'non-vegetarian', 'vegan');
CREATE TYPE urgency_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'EXPIRED');
CREATE TYPE donation_status AS ENUM (
  'CREATED',
  'MATCHING',
  'CLAIMED',
  'PICKUP_ASSIGNED',
  'PICKUP_IN_PROGRESS',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
  'EXPIRED'
);

-- 3. PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'donor',
  organization_name TEXT,
  address TEXT,
  city TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. NGOS Table
CREATE TABLE IF NOT EXISTS public.ngos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  description TEXT,
  service_area TEXT DEFAULT 'Citywide',
  capacity INTEGER DEFAULT 500,
  food_preferences JSONB DEFAULT '["vegetarian", "non-vegetarian", "vegan"]'::jsonb,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DONATIONS Table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  category TEXT DEFAULT 'Cooked Meals',
  food_type food_type_enum NOT NULL DEFAULT 'vegetarian',
  quantity INTEGER NOT NULL,
  unit TEXT DEFAULT 'meals',
  servings INTEGER NOT NULL,
  description TEXT,
  prepared_at TIMESTAMPTZ DEFAULT NOW(),
  available_from TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  pickup_deadline TIMESTAMPTZ NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  urgency urgency_level DEFAULT 'MEDIUM',
  status donation_status DEFAULT 'CREATED',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CLAIMS Table
CREATE TABLE IF NOT EXISTS public.claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE,
  ngo_id UUID REFERENCES public.ngos(id) ON DELETE CASCADE,
  match_score DOUBLE PRECISION NOT NULL,
  match_reason TEXT,
  status donation_status DEFAULT 'CLAIMED',
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  pickup_time TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PICKUP_EVENTS Table
CREATE TABLE IF NOT EXISTS public.pickup_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE,
  claim_id UUID REFERENCES public.claims(id) ON DELETE CASCADE,
  status donation_status NOT NULL,
  notes TEXT,
  event_time TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. NOTIFICATIONS Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'donation',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ACTIVITY_LOGS Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. IMPACT_METRICS Table
CREATE TABLE IF NOT EXISTS public.impact_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE,
  meals INTEGER NOT NULL,
  food_weight DOUBLE PRECISION NOT NULL, -- in kg
  people_reached INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_metrics ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = auth_user_id OR auth_user_id IS NULL);

-- NGOs Policies
CREATE POLICY "NGOs viewable by everyone" ON public.ngos FOR SELECT USING (true);
CREATE POLICY "NGOs insertable by profile owners" ON public.ngos FOR INSERT WITH CHECK (true);
CREATE POLICY "NGOs editable by profile owner" ON public.ngos FOR UPDATE USING (true);

-- Donations Policies
CREATE POLICY "Donations viewable by all users" ON public.donations FOR SELECT USING (true);
CREATE POLICY "Donors can create donations" ON public.donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Donations updatable by donor or claimed NGO" ON public.donations FOR UPDATE USING (true);

-- Claims Policies
CREATE POLICY "Claims viewable by all" ON public.claims FOR SELECT USING (true);
CREATE POLICY "Claims insertable by NGO users" ON public.claims FOR INSERT WITH CHECK (true);
CREATE POLICY "Claims updatable by involved parties" ON public.claims FOR UPDATE USING (true);

-- Notifications & Impact Policies
CREATE POLICY "Notifications viewable by owner" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Notifications updatable by owner" ON public.notifications FOR UPDATE USING (true);
CREATE POLICY "Impact metrics viewable by all" ON public.impact_metrics FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_urgency ON public.donations(urgency);
CREATE INDEX IF NOT EXISTS idx_donations_expires_at ON public.donations(expires_at);
CREATE INDEX IF NOT EXISTS idx_ngos_city ON public.ngos(city);
