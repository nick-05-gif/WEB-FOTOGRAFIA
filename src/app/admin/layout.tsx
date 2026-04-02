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
      <header className="bg-blue-900 p-4 text-white">
        <h1 className="text-lg font-semibold">Panel de Control - PhotoPartner</h1>
      </header>

      <div className="mx-auto w-full max-w-4xl py-8">{children}</div>
    </div>
  );
}
