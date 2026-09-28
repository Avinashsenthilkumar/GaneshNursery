-- ============================================================================
-- GANESH NURSERY — Supabase schema
--
-- Run this ONCE in the Supabase SQL editor (Dashboard → SQL Editor → New
-- query → paste → Run). It is safe to re-run: everything is guarded with
-- "if not exists" or "drop ... if exists" first.
--
-- What it creates:
--   plants          one row per species, with its sizes and photo URLs
--   site_settings   a single row holding the business details
--
-- Photos themselves are NOT stored here. They go to Cloudinary, which serves
-- them from a CDN and resizes them per device; the rows below keep only the
-- URLs. That keeps this database small enough to stay on the free tier for
-- years and keeps image delivery off the database's critical path.
--
-- SECURITY MODEL
--   Anyone (including logged-out visitors) can READ. The site is public, so
--   the catalogue has to be readable without a login.
--   Only a signed-in user can WRITE. This is enforced by Postgres itself, not
--   by the browser — which is the whole reason for moving off the passphrase.
-- ============================================================================

-- ─── plants ─────────────────────────────────────────────────────────────────
create table if not exists public.plants (
  id           bigint generated always as identity primary key,
  slug         text not null unique,
  name         text not null,
  tamil        text,
  botanical    text,
  category     text not null default 'Timber',

  seed_source  text,
  mother_tree  text,
  light        text,
  water        text,
  soil         text,

  popular      boolean not null default false,
  description  text,
  highlights   jsonb   not null default '[]'::jsonb,
  planting     text,
  care         text,
  uses         text,
  notice       text,

  -- Up to 5 image URLs. JSON rather than a join table because they are always
  -- read and written together, and order matters (the first is the main shot).
  images       jsonb   not null default '[]'::jsonb,

  -- One object per height: { size, age, bag, cost, offer, note, images[] }.
  -- Same reasoning — a variant is never queried independently of its plant.
  variants     jsonb   not null default '[]'::jsonb,

  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.plants is 'Plant catalogue. Sizes and photos are held as JSON because they are always read and written with the parent row.';

create index if not exists plants_category_idx   on public.plants (category);
create index if not exists plants_sort_order_idx on public.plants (sort_order, id);

-- ─── site settings ─────────────────────────────────────────────────────────
-- A single row. The check constraint makes a second row impossible, so the
-- app can always "select ... limit 1" without worrying about which it got.
create table if not exists public.site_settings (
  id         integer primary key default 1,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);

insert into public.site_settings (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- ─── keep updated_at honest ────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists plants_touch_updated_at on public.plants;
create trigger plants_touch_updated_at
  before update on public.plants
  for each row execute function public.touch_updated_at();

drop trigger if exists site_settings_touch_updated_at on public.site_settings;
create trigger site_settings_touch_updated_at
  before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- Without this, the anon key in the browser bundle could write to your tables.
-- With it, the anon key can only read.
-- ============================================================================
alter table public.plants        enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "plants are readable by everyone"   on public.plants;
drop policy if exists "plants are writable by signed-in"  on public.plants;
drop policy if exists "settings are readable by everyone"  on public.site_settings;
drop policy if exists "settings are writable by signed-in" on public.site_settings;

create policy "plants are readable by everyone"
  on public.plants for select
  using (true);

create policy "plants are writable by signed-in"
  on public.plants for all
  to authenticated
  using (true)
  with check (true);

create policy "settings are readable by everyone"
  on public.site_settings for select
  using (true);

create policy "settings are writable by signed-in"
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================================
-- Done. Next steps are in supabase/SETUP.md:
--   1. Create your admin user (Authentication → Users → Add user)
--   2. Turn OFF public sign-ups, or anyone could register and get write access
--   3. Run the seed script to load the existing 23 plants
--   4. Set up the Cloudinary upload preset for photos
-- ============================================================================
