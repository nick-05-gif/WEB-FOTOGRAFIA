import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { HOME_CAROUSEL_CATEGORIES } from "@/lib/portfolio-data";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-12 px-6 py-12 sm:space-y-16 sm:py-16">
      <section className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-blue-300">PhotoPartner Studio</p>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-100 sm:text-5xl">
          Colecciones destacadas
        </h1>
        <p className="mx-auto max-w-3xl text-neutral-300">
          Cada categoria se presenta en formato carrusel para que puedas explorar rapidamente
          el estilo visual de cada linea fotografica.
        </p>
      </section>

      <section id="portfolio" className="space-y-10 sm:space-y-12">
        {HOME_CAROUSEL_CATEGORIES.map((category) => (
          <CategoryCarousel
            key={category.slug}
            title={category.name}
            description={category.description}
            href={`/portfolio/${category.slug}`}
            images={category.carouselImages}
          />
        ))}
      </section>
    </main>
  );
}
