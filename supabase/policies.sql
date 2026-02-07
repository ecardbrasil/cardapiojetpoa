alter table public.products enable row level security;

drop policy if exists "Public can read active stock" on public.products;
create policy "Public can read active stock"
on public.products
for select
to anon, authenticated
using (ativo = true and em_estoque = true);

drop policy if exists "Admin full read" on public.products;
create policy "Admin full read"
on public.products
for select
to authenticated
using (true);

drop policy if exists "Admin insert" on public.products;
create policy "Admin insert"
on public.products
for insert
to authenticated
with check (true);

drop policy if exists "Admin update" on public.products;
create policy "Admin update"
on public.products
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Admin delete" on public.products;
create policy "Admin delete"
on public.products
for delete
to authenticated
using (true);
