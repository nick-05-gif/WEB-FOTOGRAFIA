import { createClient } from '@/lib/supabase/server';
import type { Photo } from '@/types/database.types';

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
