import { AdminManagerClient } from "@/components/admin/AdminManagerClient";
import { createClient } from "@/lib/supabase/server";
import type { NewsPost, Photo } from "@/types/database.types";

export default async function AdminPage() {
  const supabase = await createClient();
  const [photosResponse, newsResponse] = await Promise.all([
    supabase.from("photos").select("*").order("created_at", { ascending: false }),
    supabase.from("news_posts").select("*").order("publish_date", { ascending: false }),
  ]);

  const photos = (photosResponse.data ?? []) as Photo[];
  const newsPosts = (newsResponse.data ?? []) as NewsPost[];

  return (
    <main className="space-y-10 px-4">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Panel de administracion</h1>
        <p className="text-sm text-neutral-400">
          Gestiona fotos del portfolio y noticias publicas desde un solo sitio.
        </p>
      </section>

      <AdminManagerClient photos={photos} newsPosts={newsPosts} />
    </main>
  );
}
