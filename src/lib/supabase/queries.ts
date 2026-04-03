import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import type { NewsPost, Photo } from '@/types/database.types';

export async function getFeaturedPhotos(): Promise<Photo[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching featured photos:', error);
    return [];
  }

  return (data ?? []) as Photo[];
}

export async function getPhotosByCategory(category: string): Promise<Photo[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching photos by category:', error);
    return [];
  }

  return (data ?? []) as Photo[];
}

export async function getNewsPosts(): Promise<NewsPost[]> {
  const supabase = createPublicClient();

  // Flujo corto y claro: admin guarda en news_posts y esta funcion
  // lo saca para pintar la portada de /noticias.
  const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Error fetching news posts:', error);
    return [];
  }

  return (data ?? []) as NewsPost[];
}

export async function getNewsPostBySlug(slug: string): Promise<NewsPost | null> {
  const supabase = createPublicClient();

  // La pagina de detalle /noticias/[slug] viene a buscar el post aqui.
  // O sea: ya no hay mock, ahora manda lo que haya en Supabase.
  const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching news post by slug:', error);
    return null;
  }

  return (data ?? null) as NewsPost | null;
}
