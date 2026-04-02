export interface Photo {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  category: 'Paisajes' | 'Viajes' | 'Retratos' | 'Nocturnas';
  image_url: string;
  is_featured: boolean;
}
