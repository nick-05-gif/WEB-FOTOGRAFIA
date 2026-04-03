"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export interface LazyPhotoItem {
  id: string;
  imageUrl: string;
  title: string;
}

interface LazyPhotoGridProps {
  items: LazyPhotoItem[];
}

function LazyPhotoCard({ item, index }: { item: LazyPhotoItem; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  useEffect(() => {
    if (!cardRef.current) {
      return;
    }

    // En movil usamos un umbral mas permisivo para que la aparicion no se sienta abrupta.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: isMobile ? "120px 0px" : "220px 0px",
        threshold: isMobile ? 0.08 : 0.16,
      }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <article
      ref={cardRef}
      className={`transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{
        transitionDuration: isMobile ? "680ms" : "980ms",
        transitionTimingFunction: isMobile
          ? "cubic-bezier(0.25, 0.9, 0.35, 1)"
          : "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: isMobile ? `${(index % 2) * 70}ms` : `${(index % 3) * 110}ms`,
      }}
    >
      <div className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </article>
  );
}

export function LazyPhotoGrid({ items }: LazyPhotoGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <LazyPhotoCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
