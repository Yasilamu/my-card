create table if not exists public.site_todo_lists (
  list_key text primary key,
  todos jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_todo_lists enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.site_todo_lists to anon, authenticated;

drop policy if exists "Public can read the shared website todo list" on public.site_todo_lists;
create policy "Public can read the shared website todo list"
on public.site_todo_lists
for select
to anon, authenticated
using (list_key = 'main');

drop policy if exists "Public can create the shared website todo list" on public.site_todo_lists;
create policy "Public can create the shared website todo list"
on public.site_todo_lists
for insert
to anon, authenticated
with check (list_key = 'main');

drop policy if exists "Public can update the shared website todo list" on public.site_todo_lists;
create policy "Public can update the shared website todo list"
on public.site_todo_lists
for update
to anon, authenticated
using (list_key = 'main')
with check (list_key = 'main');

insert into public.site_todo_lists (list_key, todos)
values ('main', '[]'::jsonb)
on conflict (list_key) do nothing;
