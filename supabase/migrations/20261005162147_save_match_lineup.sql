-- Lưu toàn bộ đội hình một trận trong một giao dịch: xoá đội hình cũ rồi ghi đội hình mới.
-- p_entries: [{ "player_id": uuid, "side": "A" | "B", "is_starter": boolean }, ...]
-- SECURITY INVOKER: RLS vẫn áp dụng; kiểm tra is_admin() để báo lỗi rõ ràng sớm.
create function public.save_match_lineup(p_match_id uuid, p_entries jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Chỉ admin được sửa đội hình' using errcode = '42501';
  end if;

  delete from public.match_lineups where match_id = p_match_id;

  insert into public.match_lineups (match_id, player_id, side, is_starter)
  select p_match_id, (entry ->> 'player_id')::uuid, entry ->> 'side', (entry ->> 'is_starter')::boolean
  from jsonb_array_elements(p_entries) as entry;
end;
$$;

revoke execute on function public.save_match_lineup(uuid, jsonb) from public, anon;
grant execute on function public.save_match_lineup(uuid, jsonb) to authenticated;
