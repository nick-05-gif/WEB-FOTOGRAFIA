import Image from "next/image";
import Link from "next/link";
import { HOME_CAROUSEL_CATEGORIES } from "@/lib/portfolio-data";

export default function PortfolioIndexPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-16 px-8 py-20 sm:py-24">
      <section className="space-y-6 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-neutral-400">Portfolio</p>
        <h1 className="text-5xl font-semibold tracking-tight text-neutral-100 sm:text-6xl">
          Explora por categoria
        </h1>
        <p className="mx-auto max-w-3xl text-neutral-300/90">
          Este indice centraliza todas las categorias para entrar rapido en cada galeria.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {HOME_CAROUSEL_CATEGORIES.map((category) => (
          <Link key={category.slug} href={`/portfolio/${category.slug}`} className="group block">
            <article className="overflow-hidden border border-white/10 bg-neutral-900/20 transition-colors group-hover:border-white/25">
              <div className="relative aspect-[4/5]">
                <Image
                  src={category.carouselImages[0]}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              </div>

              <div className="space-y-3 p-7">
                <h2 className="text-2xl font-semibold text-neutral-100">{category.name}</h2>
                <p className="text-sm text-neutral-300/90">{category.description}</p>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </main>
  );
}
