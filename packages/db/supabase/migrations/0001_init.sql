-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'SHOP_OWNER', 'SHOP_STAFF', 'CUSTOMER');
CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED');

-- Users (Supabase auth.users와 연동)
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  role        user_role NOT NULL DEFAULT 'CUSTOMER',
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Shops
CREATE TABLE shops (
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
  owner_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  shop_id     UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (shop_id, slug)
);

-- Products
CREATE TABLE products (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL,
  description  TEXT,
  price        INT NOT NULL,                  -- 원 단위
  image_url    TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured  BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order   INT NOT NULL DEFAULT 0,
  shop_id      UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  category_id  UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (shop_id, slug)
);

-- Product Options (사이즈, 온도 등)
CREATE TABLE product_options (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  values      TEXT[] NOT NULL,
  extra_prices INT[] NOT NULL DEFAULT '{}',
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE
);

-- Shop Staff
CREATE TABLE shop_staff (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id    UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'STAFF',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (shop_id, user_id)
);

-- Orders
CREATE TABLE orders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  status       order_status NOT NULL DEFAULT 'PENDING',
  total_amount INT NOT NULL,
  note         TEXT,
  shop_id      UUID NOT NULL REFERENCES shops(id),
  user_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quantity         INT NOT NULL,
  unit_price       INT NOT NULL,
  selected_options JSONB,
  order_id         UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id       UUID NOT NULL REFERENCES products(id)
);

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at      BEFORE UPDATE ON users      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER shops_updated_at      BEFORE UPDATE ON shops      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER products_updated_at   BEFORE UPDATE ON products   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at     BEFORE UPDATE ON orders     FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops         ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_staff    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items   ENABLE ROW LEVEL SECURITY;

-- RLS Policies: products & categories는 누구나 조회 가능
CREATE POLICY "Anyone can view active shops"
  ON shops FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT USING (is_available = TRUE);

CREATE POLICY "Anyone can view product options"
  ON product_options FOR SELECT USING (TRUE);

-- shop 소유자/스태프만 수정 가능
CREATE POLICY "Shop owner can manage their shop"
  ON shops FOR ALL USING (
    auth.uid() = owner_id
  );

CREATE POLICY "Shop owner/staff can manage products"
  ON products FOR ALL USING (
    EXISTS (
      SELECT 1 FROM shops s
      LEFT JOIN shop_staff ss ON ss.shop_id = s.id AND ss.user_id = auth.uid()
      WHERE s.id = shop_id
        AND (s.owner_id = auth.uid() OR ss.user_id IS NOT NULL)
    )
  );

-- SUPER_ADMIN은 모든 접근 허용
CREATE POLICY "Super admin full access to shops"
  ON shops FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
  );
