import { PhotoGrid } from "@/components/portfolio/PhotoGrid";
import { getPhotosByCategory } from "@/lib/supabase/queries";

interface PortfolioCategoryPageProps {
  params: Promise<{ category: string }>;
}

function formatCategory(rawCategory: string) {
  const normalized = rawCategory.toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export default async function PortfolioCategoryPage({
  params,
}: PortfolioCategoryPageProps) {
  const { category } = await params;
  const formattedCategory = formatCategory(category);
  const photos = await getPhotosByCategory(formattedCategory);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
      <section className="space-y-8">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-100 sm:text-5xl">
          {formattedCategory}
        </h1>

        <PhotoGrid photos={photos} />
      </section>
    </main>
  );
}
