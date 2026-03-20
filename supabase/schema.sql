-- ══════════════════════════════════════════════
-- Yunus — Schema SQL para Supabase
-- Corre este archivo en: Supabase > SQL Editor
-- ══════════════════════════════════════════════

-- Usuarios
create table if not exists public.users (
  id          uuid primary key default gen_random_uuid(),
  phone       text unique not null,
  name        text,
  birthdate   date,
  city        text,
  created_at  timestamptz default now()
);

-- Boletos (Tickets)
create table if not exists public.tickets (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid references public.users(id) on delete cascade,
  match_id             text not null,
  status               text not null default 'pending_payment',
  total_price          integer not null,
  down_payment         integer not null,
  installment_amount   integer not null,
  installments_total   integer not null default 5,
  installments_paid    integer not null default 0,
  purchased_at         timestamptz default now()
);

-- RLS policies
alter table public.users  enable row level security;
alter table public.tickets enable row level security;

create policy "Users can read own data"   on public.users   for select using (auth.uid() = id);
create policy "Users can update own data" on public.users   for update using (auth.uid() = id);
create policy "Users can read own tickets" on public.tickets for select using (auth.uid() = user_id);
create policy "Users can insert tickets"   on public.tickets for insert with check (auth.uid() = user_id);
create policy "Users can update tickets"   on public.tickets for update using (auth.uid() = user_id);
