-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Schema
CREATE SCHEMA IF NOT EXISTS coffeeshop;

-- Supabase에 coffeeshop 스키마를 exposed schemas에 추가 필요:
-- Supabase Dashboard → Settings → API → Extra search path 에 coffeeshop 추가

-- Enums
CREATE TYPE coffeeshop.user_role AS ENUM ('SUPER_ADMIN', 'SHOP_OWNER', 'SHOP_STAFF', 'CUSTOMER');
CREATE TYPE coffeeshop.order_status AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED');

-- Users (Supabase auth.users와 연동)
CREATE TABLE coffeeshop.users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  role        coffeeshop.user_role NOT NULL DEFAULT 'CUSTOMER',
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Shops
CREATE TABLE coffeeshop.shops (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,           -- subdomain: {slug}.domain.com
  description TEXT,
  logo_url    TEXT,
  banner_url  TEXT,
  address     TEXT,
  phone       TEXT,
  email       TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  owner_id    UUID REFERENCES coffeeshop.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories
CREATE TABLE coffeeshop.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  shop_id     UUID NOT NULL REFERENCES coffeeshop.shops(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (shop_id, slug)
);

-- Products
CREATE TABLE coffeeshop.products (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL,
  description  TEXT,
  price        INT NOT NULL,                  -- 원 단위
  image_url    TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured  BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order   INT NOT NULL DEFAULT 0,
  shop_id      UUID NOT NULL REFERENCES coffeeshop.shops(id) ON DELETE CASCADE,
  category_id  UUID REFERENCES coffeeshop.categories(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (shop_id, slug)
);

-- Product Options (사이즈, 온도 등)
CREATE TABLE coffeeshop.product_options (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  values      TEXT[] NOT NULL,
  extra_prices INT[] NOT NULL DEFAULT '{}',
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  product_id  UUID NOT NULL REFERENCES coffeeshop.products(id) ON DELETE CASCADE
);

-- Shop Staff
CREATE TABLE coffeeshop.shop_staff (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id    UUID NOT NULL REFERENCES coffeeshop.shops(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES coffeeshop.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'STAFF',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (shop_id, user_id)
);

-- Orders
CREATE TABLE coffeeshop.orders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  status       coffeeshop.order_status NOT NULL DEFAULT 'PENDING',
  total_amount INT NOT NULL,
  note         TEXT,
  shop_id      UUID NOT NULL REFERENCES coffeeshop.shops(id),
  user_id      UUID REFERENCES coffeeshop.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order Items
CREATE TABLE coffeeshop.order_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quantity         INT NOT NULL,
  unit_price       INT NOT NULL,
  selected_options JSONB,
  order_id         UUID NOT NULL REFERENCES coffeeshop.orders(id) ON DELETE CASCADE,
  product_id       UUID NOT NULL REFERENCES coffeeshop.products(id)
);

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION coffeeshop.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at      BEFORE UPDATE ON coffeeshop.users      FOR EACH ROW EXECUTE FUNCTION coffeeshop.update_updated_at();
CREATE TRIGGER shops_updated_at      BEFORE UPDATE ON coffeeshop.shops      FOR EACH ROW EXECUTE FUNCTION coffeeshop.update_updated_at();
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON coffeeshop.categories FOR EACH ROW EXECUTE FUNCTION coffeeshop.update_updated_at();
CREATE TRIGGER products_updated_at   BEFORE UPDATE ON coffeeshop.products   FOR EACH ROW EXECUTE FUNCTION coffeeshop.update_updated_at();
CREATE TRIGGER orders_updated_at     BEFORE UPDATE ON coffeeshop.orders     FOR EACH ROW EXECUTE FUNCTION coffeeshop.update_updated_at();

-- Row Level Security
ALTER TABLE coffeeshop.users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffeeshop.shops           ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffeeshop.categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffeeshop.products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffeeshop.product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffeeshop.shop_staff      ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffeeshop.orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffeeshop.order_items     ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active shops"
  ON coffeeshop.shops FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Anyone can view categories"
  ON coffeeshop.categories FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can view available products"
  ON coffeeshop.products FOR SELECT USING (is_available = TRUE);

CREATE POLICY "Anyone can view product options"
  ON coffeeshop.product_options FOR SELECT USING (TRUE);

CREATE POLICY "Shop owner can manage their shop"
  ON coffeeshop.shops FOR ALL USING (
    auth.uid() = owner_id
  );

CREATE POLICY "Shop owner/staff can manage products"
  ON coffeeshop.products FOR ALL USING (
    EXISTS (
      SELECT 1 FROM coffeeshop.shops s
      LEFT JOIN coffeeshop.shop_staff ss ON ss.shop_id = s.id AND ss.user_id = auth.uid()
      WHERE s.id = shop_id
        AND (s.owner_id = auth.uid() OR ss.user_id IS NOT NULL)
    )
  );

CREATE POLICY "Super admin full access to shops"
  ON coffeeshop.shops FOR ALL USING (
    EXISTS (SELECT 1 FROM coffeeshop.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
  );

-- coffeeshop 스키마에 대한 권한 부여
GRANT USAGE ON SCHEMA coffeeshop TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA coffeeshop TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA coffeeshop TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA coffeeshop TO anon, authenticated, service_role;
