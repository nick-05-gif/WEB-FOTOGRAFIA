import { NewsTabsGrid } from "@/components/news/NewsTabsGrid";
import { getNewsPosts } from "@/lib/supabase/queries";

// Cache de 1 hora para esta pagina: si entran 1000 visitas, no machacamos
// la DB en cada request. Next sirve cache y refresca como maximo cada 3600s.
export const revalidate = 3600;

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

      <NewsTabsGrid posts={posts} />
    </main>
  );
}
