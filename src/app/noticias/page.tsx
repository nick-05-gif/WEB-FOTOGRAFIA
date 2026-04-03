import Link from "next/link";
import { DEFAULT_NEWS_COVER_IMAGE } from "@/lib/news/constants";
import { getNewsPosts } from "@/lib/supabase/queries";

// Cache de 1 hora para esta pagina: si entran 1000 visitas, no machacamos
// la DB en cada request. Next sirve cache y refresca como maximo cada 3600s.
export const revalidate = 3600;

function formatNewsDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export default async function NoticiasPage() {
  const posts = await getNewsPosts();

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
        {posts.length === 0 ? (
          <article className="col-span-full rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/60 p-8 text-center text-neutral-400">
            Aun no hay noticias publicadas.
          </article>
        ) : (
          posts.map((post) => (
            <Link key={post.slug} href={`/noticias/${post.slug}`} className="group block">
              <article className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition-colors group-hover:border-blue-700/60">
                <div className="aspect-[16/10] overflow-hidden">
                  {/** Si el feed viene sin imagen, tiramos de portada fallback para que no quede un bloque roto. */}
                  <img
                    src={post.cover_image_url || DEFAULT_NEWS_COVER_IMAGE}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-3 p-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-blue-300">
                    {formatNewsDate(post.publish_date)}
                  </p>
                  <h2 className="text-xl font-semibold text-neutral-100">{post.title}</h2>
                  <p className="text-sm leading-relaxed text-neutral-300">{post.excerpt}</p>
                </div>
              </article>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}
