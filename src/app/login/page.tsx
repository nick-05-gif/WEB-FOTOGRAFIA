"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions";
import type { ActionState } from "@/app/actions";

const initialState: ActionState = {
  message: null,
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-16 text-neutral-100">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/80 p-8 shadow-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">Acceso privado</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Inicia sesion para entrar al panel de administracion.
        </p>

        <form action={formAction} className="mt-8 space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-neutral-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-white/15 bg-neutral-950 px-4 py-2.5 text-neutral-100 outline-none transition focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-neutral-300">
              Contrasena
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-white/15 bg-neutral-950 px-4 py-2.5 text-neutral-100 outline-none transition focus:border-blue-500"
            />
          </div>

          {state.message ? (
            <p className="text-sm text-red-300">{state.message}</p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Entrando..." : "Entrar al panel"}
          </button>
        </form>
      </section>
    </main>
  );
}
