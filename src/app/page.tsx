import { AboutSection } from "@/components/home/AboutSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { HeroSection } from "@/components/home/HeroSection";
import { getFeaturedPhotos } from "@/lib/supabase/queries";

export default async function HomePage() {
  const featuredPhotos = await getFeaturedPhotos();
  const heroImageUrl = featuredPhotos[0]?.image_url;

  return (
    <main>
      {heroImageUrl ? <HeroSection imageUrl={heroImageUrl} /> : <HeroSection />}
      <CategoriesSection />
      <AboutSection />
    </main>
  );
}
