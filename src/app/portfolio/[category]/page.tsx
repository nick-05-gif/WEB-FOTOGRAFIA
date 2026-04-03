import type { Metadata } from "next";
import { LazyPhotoGrid } from "@/components/portfolio/LazyPhotoGrid";
import { getPhotosByCategory } from "@/lib/supabase/queries";
import { getCategoryData } from "@/lib/portfolio-data";
import { SITE_URL } from "@/lib/site";

interface PortfolioCategoryPageProps {
  params: Promise<{ category: string }>;
}

function formatCategory(rawCategory: string) {
  const normalized = rawCategory.toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export async function generateMetadata({
  params,
}: PortfolioCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categorySlug = category.toLowerCase();
  const categoryData = getCategoryData(categorySlug);
  const formattedCategory = categoryData?.name ?? formatCategory(categorySlug);

  const title = `Portfolio de ${formattedCategory} | Ruben Fotografia`;
  const description = `Galeria de ${formattedCategory.toLowerCase()} con seleccion premium de imagenes de Ruben Fotografia.`;
  const shareImage = categoryData?.carouselImages?.[0];
  const pageUrl = `${SITE_URL}/portfolio/${categorySlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title,
      description,
      images: shareImage
        ? [
            {
              url: shareImage,
              alt: `Portada de ${formattedCategory}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: shareImage ? [shareImage] : undefined,
    },
  };
}

export default async function PortfolioCategoryPage({
  params,
}: PortfolioCategoryPageProps) {
  const { category } = await params;
  const categorySlug = category.toLowerCase();
  const categoryData = getCategoryData(categorySlug);
  const formattedCategory = categoryData?.name ?? formatCategory(categorySlug);

  const photos = await getPhotosByCategory(formattedCategory);

  const dbItems = photos.map((photo) => ({
    id: `db-${photo.id}`,
    imageUrl: photo.image_url,
    title: photo.title,
  }));

  const mockItems = (categoryData?.galleryImages ?? []).map((imageUrl, index) => ({
    id: `mock-${categorySlug}-${index}`,
    imageUrl,
    title: `${formattedCategory} ${index + 1}`,
  }));

  const galleryItems = [...dbItems, ...mockItems];

  return (
    <main className="mx-auto w-full max-w-7xl px-8 py-20 sm:py-24">
      <section className="space-y-10">
        <h1 className="text-5xl font-semibold tracking-tight text-neutral-100 sm:text-6xl">
          {formattedCategory}
        </h1>

        <p className="max-w-3xl text-neutral-300/90">
          La galeria carga de forma progresiva para que el scroll se sienta fluido y puedas ver
          cada imagen con una transicion suave.
        </p>

        <LazyPhotoGrid items={galleryItems} />
      </section>
    </main>
  );
}
