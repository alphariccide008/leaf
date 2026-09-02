-- OAKLEAF PARTNERS — application schema
-- Runs against the Supabase Postgres via the connection pooler.
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Admin users (panel login)
-- ---------------------------------------------------------------------------
create table if not exists admin_users (
  id            uuid primary key default gen_random_uuid(),
  username      text unique not null,
  password_hash text not null,
  display_name  text not null default 'Admin',
  email         text,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Consultation requests (contact form)
-- ---------------------------------------------------------------------------
create table if not exists leads (
  id             bigint generated always as identity primary key,
  name           text not null,
  email          text not null,
  phone          text not null default '',
  service        text not null default 'General Enquiry',
  message        text not null default '',
  status         text not null default 'new',      -- new | contacted | scheduled | closed
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Payments — money sent alongside a consultation request
-- ---------------------------------------------------------------------------
create table if not exists payments (
  id           bigint generated always as identity primary key,
  lead_id      bigint references leads(id) on delete set null,
  name         text not null,
  email        text not null,
  amount       numeric(12,2) not null,
  method       text not null default 'bank_transfer',  -- bank_transfer | card | cash | other
  reference    text not null default '',
  status       text not null default 'pending',        -- pending | received | refunded
  note         text not null default '',
  created_at   timestamptz not null default now()
);
create index if not exists payments_created_idx on payments (created_at desc);

-- ---------------------------------------------------------------------------
-- Products / packages
-- ---------------------------------------------------------------------------
create table if not exists products (
  id           bigint generated always as identity primary key,
  name         text not null,
  category     text not null default 'Style Package',
  price        numeric(12,2) not null default 0,
  description  text not null default '',
  image        text not null default '',
  featured     boolean not null default false,
  in_stock     boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Live chat
-- ---------------------------------------------------------------------------
create table if not exists chat_sessions (
  id          text primary key,
  name        text not null,
  email       text not null,
  topic       text not null default '',
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists chat_messages (
  id          bigint generated always as identity primary key,
  session_id  text not null references chat_sessions(id) on delete cascade,
  role        text not null,   -- client | admin
  body        text not null,
  created_at  timestamptz not null default now()
);
create index if not exists chat_messages_session_idx on chat_messages (session_id, created_at);
