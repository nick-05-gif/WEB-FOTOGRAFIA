import Image from "next/image";
import Link from "next/link";
import { HOME_CAROUSEL_CATEGORIES } from "@/lib/portfolio-data";

export default function PortfolioIndexPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-10 px-6 py-16 sm:py-20">
      <section className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Portfolio</p>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-100 sm:text-5xl">
          Explora por categoria
        </h1>
        <p className="mx-auto max-w-3xl text-neutral-300">
          Este indice centraliza todas las categorias para entrar rapido en cada galeria.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {HOME_CAROUSEL_CATEGORIES.map((category) => (
          <Link key={category.slug} href={`/portfolio/${category.slug}`} className="group block">
            <article className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
              <div className="relative aspect-[4/5]">
                <Image
                  src={category.carouselImages[0]}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>

              <div className="p-5">
                <h2 className="text-2xl font-semibold text-neutral-100">{category.name}</h2>
                <p className="mt-2 text-sm text-neutral-300">{category.description}</p>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </main>
  );
}
