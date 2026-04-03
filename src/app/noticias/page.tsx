import { NewsTabsGrid } from "@/components/news/NewsTabsGrid";
import { getNewsPosts } from "@/lib/supabase/queries";

// Cache de 1 hora para esta pagina: si entran 1000 visitas, no machacamos
// la DB en cada request. Next sirve cache y refresca como maximo cada 3600s.
export const revalidate = 3600;

export default async function NoticiasPage() {
  const posts = await getNewsPosts();

  return (
    <main className="mx-auto w-full max-w-7xl space-y-16 px-8 py-20 sm:py-24">
      <section className="space-y-6 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-neutral-400">Revista visual</p>
        <h1 className="text-5xl font-semibold tracking-tight text-neutral-100 sm:text-6xl">
          Noticias
        </h1>
        <p className="mx-auto max-w-3xl text-neutral-300/90">
          Ideas, tecnicas y sesiones reales para entender mejor cada proyecto fotografico.
        </p>
      </section>

      <NewsTabsGrid posts={posts} />
    </main>
  );
}
