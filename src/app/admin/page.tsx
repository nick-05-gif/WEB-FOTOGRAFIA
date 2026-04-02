"use client";

import { useActionState } from "react";
import { uploadPhotoAction } from "@/app/actions";
import type { ActionState } from "@/app/actions";

const initialState: ActionState = {
  message: null,
};

export default function AdminPage() {
  const [state, formAction, isPending] = useActionState(
    uploadPhotoAction,
    initialState
  );

  return (
    <main className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Subir nueva foto</h1>
        <p className="text-sm text-neutral-400">
          Completa los datos y publica la foto en portfolio.
        </p>
      </section>

      <form
        action={formAction}
        encType="multipart/form-data"
        className="space-y-6 rounded-2xl border border-white/10 bg-neutral-900/70 p-6"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="title" className="text-sm text-neutral-300">
              Titulo
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full rounded-lg border border-white/15 bg-neutral-950 px-4 py-2.5 outline-none transition focus:border-blue-500"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="description" className="text-sm text-neutral-300">
              Descripcion
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full rounded-lg border border-white/15 bg-neutral-950 px-4 py-2.5 outline-none transition focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm text-neutral-300">
              Categoria
            </label>
            <select
              id="category"
              name="category"
              required
              defaultValue=""
              className="w-full rounded-lg border border-white/15 bg-neutral-950 px-4 py-2.5 outline-none transition focus:border-blue-500"
            >
              <option value="" disabled>
                Selecciona una categoria
              </option>
              <option value="Paisajes">Paisajes</option>
              <option value="Viajes">Viajes</option>
              <option value="Retratos">Retratos</option>
              <option value="Nocturnas">Nocturnas</option>
            </select>
          </div>

          <div className="flex items-end pb-1">
            <label className="inline-flex items-center gap-3 text-sm text-neutral-300">
              <input
                id="is_featured"
                name="is_featured"
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-neutral-950 text-blue-600"
              />
              Destacada
            </label>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="image" className="text-sm text-neutral-300">
              Archivo
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required
              className="w-full rounded-lg border border-white/15 bg-neutral-950 px-4 py-2.5 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
            />
          </div>
        </div>

        {state.message ? (
          <p className="text-sm text-blue-200">{state.message}</p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Subiendo..." : "Subir Foto"}
        </button>
      </form>
    </main>
  );
}
