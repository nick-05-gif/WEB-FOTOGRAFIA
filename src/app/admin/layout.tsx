import { createClient } from "@/lib/supabase/server";
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
      <header className="border-b border-white/10 bg-neutral-900/60 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-6 py-5 text-lg font-semibold tracking-wide text-blue-300">
          Panel de Control - PhotoPartner
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}
