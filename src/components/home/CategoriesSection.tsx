import Link from "next/link";

const categories = [
  { name: "Paisajes", href: "/portfolio/paisajes" },
  { name: "Viajes", href: "/portfolio/viajes" },
  { name: "Retratos", href: "/portfolio/retratos" },
  { name: "Nocturnas", href: "/portfolio/nocturnas" },
];

export function CategoriesSection() {
  return (
    <section id="portfolio" className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.href} href={category.href} className="group">
            <article className="flex h-64 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-center text-lg font-medium text-neutral-200 transition-colors group-hover:bg-neutral-800 group-hover:text-blue-300">
              {category.name}
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
