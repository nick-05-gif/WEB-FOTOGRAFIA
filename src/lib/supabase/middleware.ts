import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Refresca el token de sesión en cada request de navegación.
// Debe usarse SOLO en src/middleware.ts — no en Server Components.
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Propagamos las cookies tanto al request como a la response
          // para que Server Components lean el token ya refrescado.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: no usar el resultado de getUser para lógica de redirección aquí.
  // La intención de esta llamada es solo refrescar el token silenciosamente.
  await supabase.auth.getUser();

  return supabaseResponse;
}
