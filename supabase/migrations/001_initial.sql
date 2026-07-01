-- ThumbFi Initial Schema (Clerk-native)
-- Run in the Supabase SQL Editor or via `supabase db push`.
--
-- Auth model: Clerk is the identity provider. `users.id` stores the Clerk
-- user id (e.g. "user_2ab..."), NOT a Supabase-auth UUID. All application
-- access happens server-side through the Supabase SERVICE ROLE key (which
-- bypasses RLS), with ownership enforced in app code via the Clerk userId.
--
-- RLS is left ENABLED on every user table with NO permissive policy for the
-- anon/authenticated roles, so the public anon key cannot read or write user
-- data even if it leaks to the browser. Only the service role (server) can.
-- Templates are the one exception: publicly readable.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id            TEXT PRIMARY KEY,                 -- Clerk user id
  email         TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL DEFAULT '',
  avatar_url    TEXT,
  plan          TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'creator', 'pro', 'enterprise')),
  thumb_balance INTEGER NOT NULL DEFAULT 0,
  credits_used  INTEGER NOT NULL DEFAULT 0,
  credits_limit INTEGER NOT NULL DEFAULT 20,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ─── Projects ─────────────────────────────────────────────────────────────────
CREATE TABLE projects (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  description         TEXT,
  thumbnail_count     INTEGER NOT NULL DEFAULT 0,
  is_favorite         BOOLEAN NOT NULL DEFAULT false,
  status              TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  cover_thumbnail_id  UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_projects_user_id ON projects(user_id);

-- ─── Thumbnail Generations ────────────────────────────────────────────────────
CREATE TABLE thumbnail_generations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id    UUID REFERENCES projects(id) ON DELETE SET NULL,
  prompt        TEXT NOT NULL,
  style         TEXT NOT NULL,
  category      TEXT NOT NULL,
  tone          TEXT NOT NULL,
  color_palette TEXT NOT NULL DEFAULT 'auto',
  aspect_ratio  TEXT NOT NULL DEFAULT '16:9',
  count         INTEGER NOT NULL DEFAULT 4,
  credits_used  INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'done', 'error')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE thumbnail_generations ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_generations_user_id ON thumbnail_generations(user_id);

-- ─── Thumbnails ───────────────────────────────────────────────────────────────
CREATE TABLE thumbnails (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id        UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id           TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  generation_id     UUID REFERENCES thumbnail_generations(id) ON DELETE CASCADE,
  prompt            TEXT NOT NULL,
  title             TEXT NOT NULL DEFAULT '',
  preview_url       TEXT,
  preview_gradient  TEXT,
  aspect_ratio      TEXT NOT NULL DEFAULT '16:9',
  style             TEXT NOT NULL,
  category          TEXT NOT NULL,
  tone              TEXT NOT NULL DEFAULT 'shocking',
  ctr_score         INTEGER NOT NULL DEFAULT 0,
  status            TEXT NOT NULL DEFAULT 'done' CHECK (status IN ('pending', 'done', 'error')),
  is_favorite       BOOLEAN NOT NULL DEFAULT false,
  variation_index   INTEGER NOT NULL DEFAULT 0,
  canvas_json       JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE thumbnails ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_thumbnails_user_id    ON thumbnails(user_id);
CREATE INDEX idx_thumbnails_project    ON thumbnails(project_id);
CREATE INDEX idx_thumbnails_generation ON thumbnails(generation_id);

-- ─── Templates (publicly readable) ────────────────────────────────────────────
CREATE TABLE templates (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             TEXT NOT NULL,
  description       TEXT,
  category          TEXT NOT NULL,
  preview_gradient  TEXT,
  preview_url       TEXT,
  style             TEXT NOT NULL,
  tags              TEXT[] DEFAULT '{}',
  uses_count        INTEGER NOT NULL DEFAULT 0,
  is_premium        BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Templates are publicly readable"
  ON templates FOR SELECT USING (true);

-- ─── Subscriptions ────────────────────────────────────────────────────────────
CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  plan            TEXT NOT NULL DEFAULT 'free',
  payment_method  TEXT DEFAULT 'usd',
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end   TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ─── Wallets ──────────────────────────────────────────────────────────────────
CREATE TABLE wallets (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  address         TEXT,
  thumb_balance   INTEGER NOT NULL DEFAULT 0,
  staked_amount   INTEGER NOT NULL DEFAULT 0,
  tier            TEXT NOT NULL DEFAULT 'starter',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

-- ─── Wallet Transactions ──────────────────────────────────────────────────────
CREATE TABLE wallet_transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('earn', 'spend', 'reward', 'stake', 'unstake')),
  amount      INTEGER NOT NULL,
  description TEXT NOT NULL,
  tx_hash     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_transactions_user_id ON wallet_transactions(user_id);

-- ─── Referrals ────────────────────────────────────────────────────────────────
CREATE TABLE referrals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  reward_claimed  BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- ─── Credits Ledger ───────────────────────────────────────────────────────────
CREATE TABLE credits_ledger (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delta         INTEGER NOT NULL,
  reason        TEXT NOT NULL,
  generation_id UUID REFERENCES thumbnail_generations(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE credits_ledger ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_credits_user_id ON credits_ledger(user_id);

-- ─── Triggers: update updated_at ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at       BEFORE UPDATE ON users       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_projects_updated_at    BEFORE UPDATE ON projects    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_thumbnails_updated_at  BEFORE UPDATE ON thumbnails  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_wallets_updated_at     BEFORE UPDATE ON wallets     FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Trigger: keep project thumbnail_count in sync ────────────────────────────
CREATE OR REPLACE FUNCTION sync_project_thumbnail_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.project_id IS NOT NULL THEN
    UPDATE projects SET thumbnail_count = thumbnail_count + 1 WHERE id = NEW.project_id;
  ELSIF TG_OP = 'DELETE' AND OLD.project_id IS NOT NULL THEN
    UPDATE projects SET thumbnail_count = GREATEST(thumbnail_count - 1, 0) WHERE id = OLD.project_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_thumbnail_count
  AFTER INSERT OR DELETE ON thumbnails
  FOR EACH ROW EXECUTE FUNCTION sync_project_thumbnail_count();

-- ─── Storage bucket for generated thumbnails ──────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;
