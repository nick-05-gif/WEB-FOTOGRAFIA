import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions";
import { redirect } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-white/10 bg-neutral-950 p-4 text-white">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
          <h1 className="text-lg font-semibold">Panel de Control - PhotoPartner</h1>
          <form action={logout}>
            <button
              type="submit"
              className="btn-premium"
            >
              Cerrar Sesion
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto w-full max-w-4xl py-8">{children}</div>
    </div>
  );
}
