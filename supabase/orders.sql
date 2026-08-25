-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query).
-- Safe to re-run: policies are dropped and recreated each time.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  fulfillment_method text not null check (fulfillment_method in ('delivery', 'pickup')),
  full_name text not null,
  phone text not null,
  address text,
  items jsonb not null,
  subtotal numeric not null,
  total numeric not null,
  paystack_reference text unique,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own orders" on public.orders;
create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own orders" on public.orders;
create policy "Users can update own orders"
  on public.orders for update
  using (auth.uid() = user_id);

-- The cart page lets users change item quantity, which issues an UPDATE
-- against cart_items. Make sure that's allowed alongside your existing
-- select/insert/delete policies on that table.
drop policy if exists "Users can update own cart items" on public.cart_items;
create policy "Users can update own cart items"
  on public.cart_items for update
  using (auth.uid() = user_id);
