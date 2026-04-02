"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { deletePhoto, uploadPhoto } from "@/app/actions";
import type { Photo } from "@/types/database.types";

interface AdminManagerClientProps {
  photos: Photo[];
}

export function AdminManagerClient({ photos }: AdminManagerClientProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const inputClasses =
    "bg-neutral-800 text-white w-full p-2 rounded border border-neutral-700";

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formRef.current || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(formRef.current);
      const result = await uploadPhoto(formData);

      if (result.message === "Foto subida correctamente.") {
        toast.success("Foto subida con éxito");
        formRef.current.reset();
        router.refresh();
      } else {
        toast.error(result.message ?? "No se pudo subir la foto.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo subir la foto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    setDeletingId(id);

    try {
      await deletePhoto(id, imageUrl);
      toast.success("Foto eliminada");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar la foto.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleUpload}
        encType="multipart/form-data"
        className="space-y-6 rounded-lg bg-neutral-900 p-6 shadow-lg"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="title" className="text-sm text-neutral-300">
              Titulo
            </label>
            <input id="title" name="title" type="text" required className={inputClasses} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="description" className="text-sm text-neutral-300">
              Descripcion
            </label>
            <textarea id="description" name="description" rows={4} className={inputClasses} />
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
              className={inputClasses}
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
                className="h-4 w-4 rounded border border-neutral-700 bg-neutral-800 text-blue-600"
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
              className="bg-neutral-800 text-white w-full p-2 rounded border border-neutral-700 file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Subiendo..." : "Subir Foto"}
        </button>
      </form>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-100">Fotos Publicadas</h2>

        {photos.length === 0 ? (
          <p className="text-neutral-400">Aun no hay fotos publicadas.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <article
                key={photo.id}
                className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-900 p-3"
              >
                <div className="relative aspect-square overflow-hidden rounded-md bg-neutral-800">
                  <Image
                    src={photo.image_url}
                    alt={photo.description ?? photo.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <p className="truncate text-sm font-medium text-neutral-200">{photo.title}</p>

                <button
                  type="button"
                  onClick={() => handleDelete(photo.id, photo.image_url)}
                  disabled={deletingId === photo.id}
                  className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {deletingId === photo.id ? "Borrando..." : "Borrar"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
