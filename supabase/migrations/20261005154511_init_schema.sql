-- Ngọa Long: cầu thủ, trận đá nội bộ 7v7 (2 bên A/B), đội hình, bàn thắng, thống kê, ảnh thẻ.
-- Quyền: ai cũng đọc được; chỉ user có trong bảng admins được ghi.

-- ---------- Admin ----------
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

-- ---------- Cầu thủ ----------
create table public.players (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 1 and 80),
  shirt_number smallint unique check (shirt_number between 0 and 99),
  position text not null check (position in ('GK', 'DF', 'MF', 'FW')),
  date_of_birth date,
  photo_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- Trận (buổi đá nội bộ) ----------
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  played_at timestamptz not null,
  venue text check (char_length(venue) <= 120),
  status text not null default 'scheduled' check (status in ('scheduled', 'finished')),
  side_a_name text not null default 'Đội Xanh' check (char_length(side_a_name) between 1 and 40),
  side_b_name text not null default 'Đội Đỏ' check (char_length(side_b_name) between 1 and 40),
  score_a smallint check (score_a >= 0),
  score_b smallint check (score_b >= 0),
  notes text check (char_length(notes) <= 1000),
  created_at timestamptz not null default now(),
  constraint finished_match_has_score
    check (status <> 'finished' or (score_a is not null and score_b is not null))
);

create index matches_played_at_idx on public.matches (played_at desc);

-- ---------- Đội hình: ai đá bên nào, chính hay dự bị ----------
create table public.match_lineups (
  match_id uuid not null references public.matches (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete restrict,
  side text not null check (side in ('A', 'B')),
  is_starter boolean not null default true,
  primary key (match_id, player_id)
);

create index match_lineups_player_id_idx on public.match_lineups (player_id);

-- Mỗi bên tối đa 7 cầu thủ đá chính.
create function public.enforce_starter_limit()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.is_starter and (
    select count(*)
    from public.match_lineups
    where match_id = new.match_id
      and side = new.side
      and is_starter
      and player_id <> new.player_id
  ) >= 7 then
    raise exception 'Mỗi bên tối đa 7 cầu thủ đá chính';
  end if;
  return new;
end;
$$;

create trigger match_lineups_starter_limit
  before insert or update on public.match_lineups
  for each row execute function public.enforce_starter_limit();

-- ---------- Chi tiết bàn thắng (không bắt buộc) ----------
-- Bàn thường tính cho bên của scorer; phản lưới (is_own_goal) tính cho bên còn lại.
create table public.match_goals (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches (id) on delete cascade,
  scorer_id uuid not null references public.players (id) on delete restrict,
  assist_id uuid references public.players (id) on delete restrict,
  is_own_goal boolean not null default false,
  minute smallint check (minute between 0 and 200),
  created_at timestamptz not null default now(),
  constraint assist_differs_from_scorer check (assist_id is null or assist_id <> scorer_id),
  constraint own_goal_has_no_assist check (not is_own_goal or assist_id is null)
);

create index match_goals_match_id_idx on public.match_goals (match_id);
create index match_goals_scorer_id_idx on public.match_goals (scorer_id);
create index match_goals_assist_id_idx on public.match_goals (assist_id);

-- ---------- Thống kê cầu thủ (chỉ tính trận đã đá) ----------
create view public.player_stats
with (security_invoker = true)
as
with finished_lineups as (
  select
    l.player_id,
    l.is_starter,
    case when l.side = 'A' then m.score_a else m.score_b end as goals_for,
    case when l.side = 'A' then m.score_b else m.score_a end as goals_against
  from public.match_lineups l
  join public.matches m on m.id = l.match_id
  where m.status = 'finished'
),
results as (
  select
    player_id,
    count(*) as appearances,
    count(*) filter (where is_starter) as starts,
    count(*) filter (where goals_for > goals_against) as wins,
    count(*) filter (where goals_for = goals_against) as draws,
    count(*) filter (where goals_for < goals_against) as losses
  from finished_lineups
  group by player_id
),
finished_goals as (
  select g.*
  from public.match_goals g
  join public.matches m on m.id = g.match_id
  where m.status = 'finished'
),
scoring as (
  select
    scorer_id as player_id,
    count(*) filter (where not is_own_goal) as goals,
    count(*) filter (where is_own_goal) as own_goals
  from finished_goals
  group by scorer_id
),
assisting as (
  select assist_id as player_id, count(*) as assists
  from finished_goals
  where assist_id is not null
  group by assist_id
)
select
  p.id as player_id,
  coalesce(r.appearances, 0)::int as appearances,
  coalesce(r.starts, 0)::int as starts,
  coalesce(r.wins, 0)::int as wins,
  coalesce(r.draws, 0)::int as draws,
  coalesce(r.losses, 0)::int as losses,
  coalesce(s.goals, 0)::int as goals,
  coalesce(a.assists, 0)::int as assists,
  coalesce(s.own_goals, 0)::int as own_goals
from public.players p
left join results r on r.player_id = p.id
left join scoring s on s.player_id = p.id
left join assisting a on a.player_id = p.id;

-- ---------- Row Level Security ----------
alter table public.admins enable row level security;
alter table public.players enable row level security;
alter table public.matches enable row level security;
alter table public.match_lineups enable row level security;
alter table public.match_goals enable row level security;

-- Admin chỉ thấy dòng của chính mình (đủ để is_admin() hoạt động).
create policy "Admin đọc dòng của mình" on public.admins
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Mọi người đọc cầu thủ" on public.players
  for select to anon, authenticated using (true);
create policy "Admin thêm cầu thủ" on public.players
  for insert to authenticated with check ((select public.is_admin()));
create policy "Admin sửa cầu thủ" on public.players
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admin xoá cầu thủ" on public.players
  for delete to authenticated using ((select public.is_admin()));

create policy "Mọi người đọc trận" on public.matches
  for select to anon, authenticated using (true);
create policy "Admin thêm trận" on public.matches
  for insert to authenticated with check ((select public.is_admin()));
create policy "Admin sửa trận" on public.matches
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admin xoá trận" on public.matches
  for delete to authenticated using ((select public.is_admin()));

create policy "Mọi người đọc đội hình" on public.match_lineups
  for select to anon, authenticated using (true);
create policy "Admin thêm đội hình" on public.match_lineups
  for insert to authenticated with check ((select public.is_admin()));
create policy "Admin sửa đội hình" on public.match_lineups
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admin xoá đội hình" on public.match_lineups
  for delete to authenticated using ((select public.is_admin()));

create policy "Mọi người đọc bàn thắng" on public.match_goals
  for select to anon, authenticated using (true);
create policy "Admin thêm bàn thắng" on public.match_goals
  for insert to authenticated with check ((select public.is_admin()));
create policy "Admin sửa bàn thắng" on public.match_goals
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admin xoá bàn thắng" on public.match_goals
  for delete to authenticated using ((select public.is_admin()));

-- ---------- Mở bảng cho Data API (bảng mới không còn tự mở từ 2026) ----------
revoke all on public.admins from anon, authenticated;
grant select on public.admins to authenticated;

grant select on public.players, public.matches, public.match_lineups, public.match_goals, public.player_stats
  to anon, authenticated;
grant insert, update, delete on public.players, public.matches, public.match_lineups, public.match_goals
  to authenticated;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
revoke execute on function public.enforce_starter_limit() from public, anon, authenticated;

-- ---------- Kho ảnh thẻ cầu thủ ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('player-photos', 'player-photos', true, 1048576, array['image/webp', 'image/jpeg', 'image/png']);

-- Bucket public: ai cũng xem ảnh qua URL công khai. Ghi / thay / xoá chỉ admin
-- (upsert cần đủ insert + select + update).
create policy "Admin xem danh sách ảnh" on storage.objects
  for select to authenticated
  using (bucket_id = 'player-photos' and (select public.is_admin()));
create policy "Admin tải ảnh lên" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'player-photos' and (select public.is_admin()));
create policy "Admin thay ảnh" on storage.objects
  for update to authenticated
  using (bucket_id = 'player-photos' and (select public.is_admin()))
  with check (bucket_id = 'player-photos' and (select public.is_admin()));
create policy "Admin xoá ảnh" on storage.objects
  for delete to authenticated
  using (bucket_id = 'player-photos' and (select public.is_admin()));
