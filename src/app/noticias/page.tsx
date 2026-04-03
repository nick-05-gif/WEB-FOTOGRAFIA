import Image from "next/image";
import Link from "next/link";
import { NEWS_POSTS } from "@/lib/news-data";

export default function NoticiasPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-10 px-6 py-16 sm:py-20">
      <section className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Blog visual</p>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-100 sm:text-5xl">
          Noticias
        </h1>
        <p className="mx-auto max-w-3xl text-neutral-300">
          Ideas, tecnicas y sesiones reales para entender mejor cada proyecto fotografico.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {NEWS_POSTS.map((post) => (
          <Link key={post.slug} href={`/noticias/${post.slug}`} className="group block">
            <article className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition-colors group-hover:border-blue-700/60">
              <div className="relative aspect-[16/10]">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="space-y-3 p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-blue-300">{post.date}</p>
                <h2 className="text-xl font-semibold text-neutral-100">{post.title}</h2>
                <p className="text-sm leading-relaxed text-neutral-300">{post.excerpt}</p>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </main>
  );
}
