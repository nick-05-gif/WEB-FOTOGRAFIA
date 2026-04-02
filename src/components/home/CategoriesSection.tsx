const categories = ["Paisajes", "Viajes", "Retratos", "Nocturnas"];

export function CategoriesSection() {
  return (
    <section id="portfolio" className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <article
            key={category}
            className="flex h-64 items-center justify-center rounded-xl border border-white/10 bg-neutral-900 text-lg font-medium text-neutral-200 transition-colors hover:border-blue-600/60 hover:text-blue-300"
          >
            {category}
          </article>
        ))}
      </div>
    </section>
  );
}
