import Image from "next/image";
import type { Photo } from "@/types/database.types";

interface PhotoGridProps {
  photos: Photo[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <p className="rounded-xl border border-white/10 bg-neutral-900/60 p-8 text-center text-neutral-400">
        Todavia no hay fotos disponibles en esta categoria.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo) => (
        <article key={photo.id} className="group">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
            <Image
              src={photo.image_url}
              alt={photo.description ?? photo.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </article>
      ))}
    </div>
  );
}
