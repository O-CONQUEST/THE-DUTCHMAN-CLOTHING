-- Run this in the Supabase SQL Editor AFTER supabase/orders.sql.
-- Adds: sizes on cart items, per-size inventory, promo codes, admin
-- profiles, and tightens order RLS now that privileged writes move to
-- a service-role server client instead of the customer's own session.
-- Safe to re-run: policies are dropped and recreated each time.

-- 1. Sizes on cart items -----------------------------------------------
alter table public.cart_items add column if not exists size text;

-- 2. Per-size inventory --------------------------------------------------
create table if not exists public.product_inventory (
  product_id text not null,
  size text not null,
  quantity int not null default 0 check (quantity >= 0),
  primary key (product_id, size)
);

alter table public.product_inventory enable row level security;

drop policy if exists "Anyone can view inventory" on public.product_inventory;
create policy "Anyone can view inventory"
  on public.product_inventory for select
  using (true);

-- No insert/update/delete policies: only the service-role server client
-- (used in the checkout routes) can change stock levels. Seed and adjust
-- stock from the Supabase table editor, or with SQL like:
--   insert into public.product_inventory (product_id, size, quantity)
--   values ('1', 'One Size', 25) on conflict (product_id, size) do update set quantity = excluded.quantity;

-- Atomic stock decrement, called only from the checkout verification route
-- (via the service-role client) after a payment is confirmed. Restricted to
-- service_role so a customer's own session can never call it directly.
create or replace function public.decrement_inventory(p_product_id text, p_size text, p_qty int)
returns void
language sql
security definer
set search_path = public
as $$
  update public.product_inventory
  set quantity = greatest(quantity - p_qty, 0)
  where product_id = p_product_id and size = p_size;
$$;

revoke execute on function public.decrement_inventory(text, text, int) from public, anon, authenticated;
grant execute on function public.decrement_inventory(text, text, int) to service_role;

-- 3. Promo codes -----------------------------------------------------------
create table if not exists public.promo_codes (
  code text primary key,
  discount_percent int not null check (discount_percent between 1 and 100),
  active boolean not null default true,
  expires_at timestamptz
);

alter table public.promo_codes enable row level security;
-- No client policies at all: codes are only ever looked up server-side
-- with the service-role client, so a promo's existence/discount can't be
-- enumerated by querying the table directly from the browser.

-- 4. Admin profiles ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- After running this file, make yourself an admin:
--   insert into public.profiles (id, is_admin)
--   values ('<your-user-id-from-auth-users>', true)
--   on conflict (id) do update set is_admin = true;

-- 5. Orders: new columns + tightened RLS ------------------------------------
alter table public.orders add column if not exists discount_amount numeric not null default 0;
alter table public.orders add column if not exists promo_code text;
alter table public.orders add column if not exists fulfilled_at timestamptz;

-- Customers can still see their own orders, but can no longer insert or
-- update them directly — order creation and status changes now go through
-- the service-role client inside the checkout API routes only. Without
-- this, a signed-in user could previously PATCH their own pending order
-- straight to status = 'paid' via the Supabase client, skipping payment.
drop policy if exists "Users can insert own orders" on public.orders;
drop policy if exists "Users can update own orders" on public.orders;

drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );
