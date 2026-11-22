create extension if not exists pgcrypto;

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  name text not null,
  phone text not null,
  email text,
  booking_date date not null,
  booking_time time not null,
  people integer not null check (people between 1 and 20),
  notes text,
  status text not null default 'confirmed' check (status in ('confirmed','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.booking_settings (
  key text primary key,
  value integer not null
);
insert into public.booking_settings(key,value) values ('default_capacity',40)
on conflict (key) do nothing;

create table if not exists public.booking_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists booking_attempts_ip_created on public.booking_attempts(ip_hash,created_at);

alter table public.reservations enable row level security;
alter table public.booking_settings enable row level security;
alter table public.booking_attempts enable row level security;

-- Solo usuarios autenticados (administradores creados manualmente) pueden consultar y gestionar.
create policy "admin read reservations" on public.reservations
for select to authenticated using (true);
create policy "admin update reservations" on public.reservations
for update to authenticated using (true) with check (true);
create policy "admin delete reservations" on public.reservations
for delete to authenticated using (true);

-- Ningún visitante anónimo puede leer ni escribir directamente en estas tablas.
revoke all on public.reservations from anon, authenticated;
grant select, update, delete on public.reservations to authenticated;
revoke all on public.booking_settings from anon, authenticated;
revoke all on public.booking_attempts from anon, authenticated;

create or replace function public.create_booking(
  p_name text, p_phone text, p_email text, p_date date,
  p_time time, p_people integer, p_notes text
) returns text
language plpgsql security definer set search_path=public
as $$
declare
  cap integer;
  booked integer;
  ref text;
begin
  if p_date < current_date then raise exception 'La fecha ya ha pasado.'; end if;
  if p_date > current_date + 180 then raise exception 'La fecha está demasiado lejos.'; end if;
  if p_people < 1 or p_people > 20 then raise exception 'Número de personas no válido.'; end if;

  -- Serializa las solicitudes del mismo día y turno para impedir sobre-reservas simultáneas.
  perform pg_advisory_xact_lock(hashtext(p_date::text || '-' || p_time::text));
  select value into cap from booking_settings where key='default_capacity';
  cap := coalesce(cap,40);
  select coalesce(sum(people),0) into booked from reservations
    where booking_date=p_date and booking_time=p_time and status='confirmed';
  if booked + p_people > cap then raise exception 'No queda capacidad para ese turno. Elige otra hora o llama al restaurante.'; end if;

  ref := upper(substr(encode(gen_random_bytes(5),'hex'),1,10));
  insert into reservations(reference,name,phone,email,booking_date,booking_time,people,notes,status)
  values(ref,p_name,p_phone,nullif(p_email,''),p_date,p_time,p_people,left(coalesce(p_notes,''),1000),'confirmed');
  return ref;
end;
$$;

revoke all on function public.create_booking(text,text,text,date,time,integer,text) from public, anon, authenticated;
grant execute on function public.create_booking(text,text,text,date,time,integer,text) to service_role;
