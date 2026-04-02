import { AdminManagerClient } from "@/components/admin/AdminManagerClient";
import { createClient } from "@/lib/supabase/server";
import type { Photo } from "@/types/database.types";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false });

  const photos = (data ?? []) as Photo[];

  return (
    <main className="space-y-10 px-4">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Subir nueva foto</h1>
        <p className="text-sm text-neutral-400">
          Completa los datos y publica la foto en portfolio.
        </p>
      </section>

      <AdminManagerClient photos={photos} />
    </main>
  );
}
