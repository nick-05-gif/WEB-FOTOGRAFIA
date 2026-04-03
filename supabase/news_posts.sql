create extension if not exists pgcrypto;

-- Tabla para gestionar Noticias desde el panel admin.
create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  publish_date date not null,
  cover_image_url text not null,
  excerpt text not null,
  content text not null
);

-- Link original del articulo para detectar duplicados del feed.
alter table public.news_posts add column if not exists source_url text;

create index if not exists news_posts_publish_date_idx on public.news_posts (publish_date desc);
create unique index if not exists news_posts_source_url_unique_idx
  on public.news_posts (source_url)
  where source_url is not null;

alter table public.news_posts enable row level security;

drop policy if exists "Public can read news" on public.news_posts;
drop policy if exists "Authenticated can create news" on public.news_posts;
drop policy if exists "Authenticated can delete news" on public.news_posts;

-- Cualquiera puede leer Noticias en la web publica.
create policy "Public can read news"
  on public.news_posts
  for select
  to anon, authenticated
  using (true);

-- Solo usuarios logueados (panel admin) pueden publicar.
create policy "Authenticated can create news"
  on public.news_posts
  for insert
  to authenticated
  with check (true);

-- Solo usuarios logueados (panel admin) pueden borrar.
create policy "Authenticated can delete news"
  on public.news_posts
  for delete
  to authenticated
  using (true);
