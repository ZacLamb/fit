-- Zezze Athletics — database schema
-- Run this once against your Postgres database (Railway provisions one automatically).

CREATE TABLE IF NOT EXISTS services (
  id            SERIAL PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  short_desc    TEXT NOT NULL,
  long_desc     TEXT NOT NULL,
  duration_min  INTEGER NOT NULL DEFAULT 60,
  price_cents   INTEGER,              -- nullable: some services are quote/consult based
  price_label   TEXT,                 -- e.g. "$75 / session", "Free consult"
  sort_order    INTEGER NOT NULL DEFAULT 0,
  active        BOOLEAN NOT NULL DEFAULT TRUE
);

-- Weekly recurring availability windows staff can train clients in.
-- day_of_week: 0 = Sunday ... 6 = Saturday
CREATE TABLE IF NOT EXISTS availability_rules (
  id            SERIAL PRIMARY KEY,
  day_of_week   INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time    TIME NOT NULL,
  end_time      TIME NOT NULL,
  active        BOOLEAN NOT NULL DEFAULT TRUE
);

-- One-off blackout dates (holidays, travel, etc.)
CREATE TABLE IF NOT EXISTS blackout_dates (
  id            SERIAL PRIMARY KEY,
  date          DATE NOT NULL UNIQUE,
  reason        TEXT
);

CREATE TABLE IF NOT EXISTS bookings (
  id              SERIAL PRIMARY KEY,
  service_id      INTEGER NOT NULL REFERENCES services(id),
  client_name     TEXT NOT NULL,
  client_email    TEXT NOT NULL,
  client_phone    TEXT,
  notes           TEXT,
  booking_date    DATE NOT NULL,
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  status          TEXT NOT NULL DEFAULT 'confirmed', -- confirmed | cancelled
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);

CREATE TABLE IF NOT EXISTS products (
  id            SERIAL PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT NOT NULL,
  price_cents   INTEGER NOT NULL,
  image_path    TEXT,
  sizes         TEXT,                 -- comma separated, e.g. "S,M,L,XL,XXL" — null if not size-based
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  id                    SERIAL PRIMARY KEY,
  stripe_session_id     TEXT UNIQUE,
  customer_email        TEXT,
  amount_total_cents    INTEGER,
  status                TEXT NOT NULL DEFAULT 'pending', -- pending | paid | failed
  line_items_json       JSONB,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Session store table for express-session (connect-pg-simple creates this
-- automatically at runtime, listed here for reference only).
