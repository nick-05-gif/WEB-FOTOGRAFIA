import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Llamar siempre dentro de un Server Component / Action / Route Handler.
// En Next.js 15 cookies() es async — awaiteamos antes de pasarlo.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll desde un Server Component lanza; el middleware
            // se encarga del refresco real de la sesión.
          }
        },
      },
    }
  );
}
