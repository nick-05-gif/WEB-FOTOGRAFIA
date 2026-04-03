"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { createNewsPost, deleteNewsPost, deletePhoto, uploadPhoto } from "@/app/actions";
import { DEFAULT_NEWS_COVER_IMAGE } from "@/lib/news/constants";
import type { NewsPost, Photo } from "@/types/database.types";

interface AdminManagerClientProps {
  photos: Photo[];
  newsPosts: NewsPost[];
}

type AdminTab = "photos" | "news";

function formatNewsDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export function AdminManagerClient({ photos, newsPosts }: AdminManagerClientProps) {
  const router = useRouter();
  const photoFormRef = useRef<HTMLFormElement>(null);
  const newsFormRef = useRef<HTMLFormElement>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("photos");
  const [isSubmittingPhoto, setIsSubmittingPhoto] = useState(false);
  const [isSubmittingNews, setIsSubmittingNews] = useState(false);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
  const [deletingNewsId, setDeletingNewsId] = useState<string | null>(null);

  const inputClasses =
    "bg-neutral-800 text-white w-full p-2 rounded border border-neutral-700";
  const tabButtonClasses =
    "rounded-full px-4 py-2 text-sm font-semibold transition-colors";

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!photoFormRef.current || isSubmittingPhoto) {
      return;
    }

    setIsSubmittingPhoto(true);

    try {
      const formData = new FormData(photoFormRef.current);
      const result = await uploadPhoto(formData);

      if (result.message === "Foto subida correctamente.") {
        toast.success("Foto subida con éxito");
        photoFormRef.current.reset();
        router.refresh();
      } else {
        toast.error(result.message ?? "No se pudo subir la foto.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo subir la foto.");
    } finally {
      setIsSubmittingPhoto(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    setDeletingPhotoId(id);

    try {
      await deletePhoto(id, imageUrl);
      toast.success("Foto eliminada");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar la foto.");
    } finally {
      setDeletingPhotoId(null);
    }
  };

  const handlePublishNews = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newsFormRef.current || isSubmittingNews) {
      return;
    }

    setIsSubmittingNews(true);

    try {
      const formData = new FormData(newsFormRef.current);
      const result = await createNewsPost(formData);

      if (result.message === "Noticia publicada correctamente.") {
        toast.success("Noticia publicada correctamente");
        newsFormRef.current.reset();
        router.refresh();
      } else {
        toast.error("Error al publicar");
      }
    } catch {
      toast.error("Error al publicar");
    } finally {
      setIsSubmittingNews(false);
    }
  };

  const handleDeleteNews = async (id: string, slug: string) => {
    setDeletingNewsId(id);

    try {
      await deleteNewsPost(id, slug);
      toast.success("Noticia eliminada");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar la noticia.");
    } finally {
      setDeletingNewsId(null);
    }
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap gap-2 rounded-lg border border-neutral-800 bg-neutral-900 p-2">
        <button
          type="button"
          onClick={() => setActiveTab("photos")}
          className={`${tabButtonClasses} ${
            activeTab === "photos"
              ? "bg-blue-600 text-white"
              : "bg-transparent text-neutral-300 hover:bg-neutral-800"
          }`}
        >
          Fotos
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("news")}
          className={`${tabButtonClasses} ${
            activeTab === "news"
              ? "bg-blue-600 text-white"
              : "bg-transparent text-neutral-300 hover:bg-neutral-800"
          }`}
        >
          Noticias
        </button>
      </section>

      {activeTab === "photos" ? (
        <>
          <form
            ref={photoFormRef}
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
              disabled={isSubmittingPhoto}
              className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmittingPhoto ? "Subiendo..." : "Subir foto"}
            </button>
          </form>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-neutral-100">Fotos publicadas</h2>

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
                      disabled={deletingPhotoId === photo.id}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {deletingPhotoId === photo.id ? "Borrando..." : "Borrar"}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          <form
            ref={newsFormRef}
            onSubmit={handlePublishNews}
            className="space-y-6 rounded-lg bg-neutral-900 p-6 shadow-lg"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="news_title" className="text-sm text-neutral-300">
                  Titulo de la noticia
                </label>
                <input
                  id="news_title"
                  name="news_title"
                  type="text"
                  required
                  className={inputClasses}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="news_date" className="text-sm text-neutral-300">
                  Fecha
                </label>
                <input
                  id="news_date"
                  name="news_date"
                  type="date"
                  required
                  className={inputClasses}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="news_cover_image_url" className="text-sm text-neutral-300">
                  URL imagen de portada
                </label>
                <input
                  id="news_cover_image_url"
                  name="news_cover_image_url"
                  type="url"
                  required
                  className={inputClasses}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="news_excerpt" className="text-sm text-neutral-300">
                  Extracto corto
                </label>
                <textarea
                  id="news_excerpt"
                  name="news_excerpt"
                  rows={3}
                  required
                  className={inputClasses}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="news_content" className="text-sm text-neutral-300">
                  Texto completo del articulo
                </label>
                <textarea
                  id="news_content"
                  name="news_content"
                  rows={12}
                  required
                  className={inputClasses}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingNews}
              className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmittingNews ? "Publicando..." : "Publicar noticia"}
            </button>
          </form>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-neutral-100">Noticias publicadas</h2>

            {newsPosts.length === 0 ? (
              <p className="text-neutral-400">Aun no hay noticias publicadas.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {newsPosts.map((post) => (
                  <article
                    key={post.id}
                    className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-900 p-3"
                  >
                    <div className="aspect-[16/10] overflow-hidden rounded-md bg-neutral-800">
                      <img
                        src={post.cover_image_url || DEFAULT_NEWS_COVER_IMAGE}
                        alt={post.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <p className="text-xs uppercase tracking-[0.12em] text-blue-300">
                      {formatNewsDate(post.publish_date)}
                    </p>

                    <h3 className="text-lg font-semibold text-neutral-100">{post.title}</h3>
                    <p className="text-sm text-neutral-300">{post.excerpt}</p>

                    <button
                      type="button"
                      onClick={() => handleDeleteNews(post.id, post.slug)}
                      disabled={deletingNewsId === post.id}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {deletingNewsId === post.id ? "Borrando..." : "Borrar noticia"}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
