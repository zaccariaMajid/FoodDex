-- FoodDex initial schema. Apply with Supabase migrations/SQL editor.
create table public.countries(code text primary key check(code ~ '^[A-Z]{2}$'), name_it text not null,name_en text not null,flag text not null,sort_order int not null unique);
create table public.dishes(id text primary key,country_code text not null references public.countries(code),slot_number int not null check(slot_number between 1 and 5),category text not null check(category in ('iconic','local')),active boolean not null default true,unique(country_code,slot_number));
create table public.dish_translations(dish_id text not null references public.dishes(id) on delete cascade,locale text not null check(locale in ('it','en')),name text not null,description text not null,hint1 text not null,hint2 text not null,hint3 text not null,primary key(dish_id,locale));
create table public.dish_recognition(dish_id text primary key references public.dishes(id) on delete cascade,visual_features text not null,ambiguities text not null);
create table public.profiles(user_id uuid primary key references auth.users(id) on delete cascade,nickname text,locale text not null default 'it' check(locale in ('it','en')),created_at timestamptz not null default now());
create table public.user_discoveries(user_id uuid not null references auth.users(id) on delete cascade,dish_id text not null references public.dishes(id),discovered_at timestamptz not null default now(),primary key(user_id,dish_id));
create table public.user_hints(user_id uuid not null references auth.users(id) on delete cascade,dish_id text not null references public.dishes(id),revealed_count smallint not null default 0 check(revealed_count between 0 and 3),primary key(user_id,dish_id));
create table public.user_medals(user_id uuid not null references auth.users(id) on delete cascade,country_code text not null references public.countries(code),awarded_at timestamptz not null default now(),primary key(user_id,country_code));
create table public.scan_attempts(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,outcome text not null check(outcome in ('accepted','already_unlocked','uncertain','not_in_catalog','error')),created_at timestamptz not null default now());
create index on public.dishes(country_code);
create index on public.scan_attempts(user_id,created_at);
create or replace function public.create_profile() returns trigger language plpgsql security definer set search_path='' as $$ begin insert into public.profiles(user_id) values(new.id);return new;end; $$;
create trigger after_user_signup after insert on auth.users for each row execute function public.create_profile();
alter table public.countries enable row level security;
alter table public.dishes enable row level security;
alter table public.dish_translations enable row level security;
alter table public.dish_recognition enable row level security;
alter table public.profiles enable row level security;
alter table public.user_discoveries enable row level security;
alter table public.user_hints enable row level security;
alter table public.user_medals enable row level security;
alter table public.scan_attempts enable row level security;
create policy "countries visible authenticated" on public.countries for select to authenticated using(true);
create policy "own profile select" on public.profiles for select to authenticated using(user_id=(select auth.uid()));
create policy "own profile update" on public.profiles for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy "own discoveries read" on public.user_discoveries for select to authenticated using(user_id=(select auth.uid()));
create policy "own hints read" on public.user_hints for select to authenticated using(user_id=(select auth.uid()));
create policy "own medals read" on public.user_medals for select to authenticated using(user_id=(select auth.uid()));
-- No client policies for secret dish data, and no direct client INSERT for discoveries or medals.
create or replace function public.get_country_slots(p_country text)
returns table(slot_number integer,is_unlocked boolean,display_name text) language sql stable security definer set search_path='' as $$
select d.slot_number,(ud.user_id is not null),case when ud.user_id is not null then dt.name else null end
from public.dishes d left join public.user_discoveries ud on ud.dish_id=d.id and ud.user_id=(select auth.uid())
left join public.dish_translations dt on dt.dish_id=d.id and dt.locale='it'
where (select auth.uid()) is not null and d.country_code=p_country and d.active order by d.slot_number;$$;
create or replace function public.get_dish_slot(p_country text,p_slot integer)
returns table(slot_number integer,is_unlocked boolean,display_name text,description text,hints text[],revealed_hints integer)
language sql stable security definer set search_path='' as $$
select d.slot_number,(ud.user_id is not null),case when ud.user_id is not null then dt.name else null end,
case when ud.user_id is not null then dt.description else null end,
array[case when ud.user_id is not null or coalesce(uh.revealed_count,0)>=1 then dt.hint1 else null end,
case when ud.user_id is not null or coalesce(uh.revealed_count,0)>=2 then dt.hint2 else null end,
case when ud.user_id is not null or coalesce(uh.revealed_count,0)>=3 then dt.hint3 else null end]::text[],
coalesce(uh.revealed_count,0)::integer from public.dishes d join public.dish_translations dt on dt.dish_id=d.id and dt.locale='it'
left join public.user_discoveries ud on ud.dish_id=d.id and ud.user_id=(select auth.uid())
left join public.user_hints uh on uh.dish_id=d.id and uh.user_id=(select auth.uid())
where (select auth.uid()) is not null and d.country_code=p_country and d.slot_number=p_slot and d.active;$$;
create or replace function public.reveal_hint(p_country text,p_slot integer) returns integer language plpgsql security definer set search_path='' as $$
declare v_dish text;v_new integer;
begin
if (select auth.uid()) is null then raise exception 'Not authenticated';end if;
select id into v_dish from public.dishes where country_code=p_country and slot_number=p_slot and active;
if v_dish is null then raise exception 'Not found';end if;
insert into public.user_hints(user_id,dish_id,revealed_count) values((select auth.uid()),v_dish,1)
on conflict(user_id,dish_id) do update set revealed_count=least(3,public.user_hints.revealed_count+1)
returning revealed_count into v_new;
return v_new;end;$$;
revoke all on function public.get_country_slots(text) from public;
revoke all on function public.get_dish_slot(text,integer) from public;
revoke all on function public.reveal_hint(text,integer) from public;
grant execute on function public.get_country_slots(text) to authenticated;
grant execute on function public.get_dish_slot(text,integer) to authenticated;
grant execute on function public.reveal_hint(text,integer) to authenticated;
