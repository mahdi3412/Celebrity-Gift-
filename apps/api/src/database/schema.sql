CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TYPE verification_status AS ENUM ('NOT_STARTED','SUBMITTED','AUTO_VERIFIED','MANUAL_REVIEW','FAILED','RESUBMIT');
CREATE TYPE gift_status AS ENUM ('REQUESTED','RECEIVED_AT_STATION','PROCESSING','SHIPPED','DELIVERED','ACCEPTED','DECLINED','RETURNED');
CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),email TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,role TEXT NOT NULL CHECK (role IN ('fan','creator','admin','station_staff')),created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS creator_profiles (user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,display_name TEXT NOT NULL,handle TEXT NOT NULL UNIQUE,category TEXT,public_bio TEXT,is_public BOOLEAN NOT NULL DEFAULT true);
CREATE TABLE IF NOT EXISTS verifications (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,status verification_status NOT NULL DEFAULT 'NOT_STARTED',provider TEXT,provider_reference TEXT,submitted_at TIMESTAMPTZ,reviewed_at TIMESTAMPTZ,expires_at TIMESTAMPTZ,created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS gifts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),gift_code TEXT NOT NULL UNIQUE,fan_id UUID NOT NULL REFERENCES users(id),creator_id UUID NOT NULL REFERENCES users(id),category TEXT NOT NULL,note_declared BOOLEAN NOT NULL DEFAULT false,food_declared BOOLEAN NOT NULL DEFAULT false,fragile_declared BOOLEAN NOT NULL DEFAULT false,status gift_status NOT NULL DEFAULT 'REQUESTED',created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_gifts_creator_status ON gifts(creator_id,status);
CREATE INDEX IF NOT EXISTS idx_verifications_user_status ON verifications(user_id,status);

CREATE TABLE IF NOT EXISTS refresh_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_refresh_sessions_user_active ON refresh_sessions(user_id,revoked_at);