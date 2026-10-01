-- Fields used by the admin Products page (/admin/products).
-- Safe to run more than once.
alter table public.products add column if not exists description text;
alter table public.products add column if not exists is_active boolean not null default true;
