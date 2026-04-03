export interface Photo {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  category: 'Paisajes' | 'Viajes' | 'Retratos' | 'Nocturnas';
  image_url: string;
  is_featured: boolean;
}

export type NewsCategory = "aragon" | "mundo";

export interface NewsPost {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  category: NewsCategory;
  publish_date: string;
  cover_image_url: string;
  excerpt: string;
  content: string;
  source_url: string | null;
}
