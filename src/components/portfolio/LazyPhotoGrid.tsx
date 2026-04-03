"use client";

import Image from "next/image";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

export interface LazyPhotoItem {
  id: string;
  imageUrl: string;
  title: string;
}

interface LazyPhotoGridProps {
  items: LazyPhotoItem[];
}

function ThreeColumnsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <rect x="3" y="5" width="4" height="14" rx="0.7" fill="currentColor" />
      <rect x="10" y="5" width="4" height="14" rx="0.7" fill="currentColor" />
      <rect x="17" y="5" width="4" height="14" rx="0.7" fill="currentColor" />
    </svg>
  );
}

function TwoColumnsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <rect x="4" y="5" width="6" height="14" rx="0.7" fill="currentColor" />
      <rect x="14" y="5" width="6" height="14" rx="0.7" fill="currentColor" />
    </svg>
  );
}

function LazyPhotoCard({
  item,
  index,
  onOpen,
  isLayoutSwitching,
}: {
  item: LazyPhotoItem;
  index: number;
  onOpen: () => void;
  isLayoutSwitching: boolean;
}) {
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
      } ${isLayoutSwitching ? "scale-[0.985]" : "scale-100"}`}
      style={{
        transitionDuration: isMobile ? "680ms" : "980ms",
        transitionTimingFunction: isMobile
          ? "cubic-bezier(0.25, 0.9, 0.35, 1)"
          : "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: isMobile ? `${(index % 2) * 70}ms` : `${(index % 3) * 110}ms`,
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="group relative block aspect-square w-full overflow-hidden border border-white/10 bg-neutral-900/20 text-left"
      >
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </button>
    </article>
  );
}

export function LazyPhotoGrid({ items }: LazyPhotoGridProps) {
  const [desktopColumns, setDesktopColumns] = useState<2 | 3>(3);
  const [isLayoutSwitching, setIsLayoutSwitching] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  const handleChangeDesktopColumns = (nextColumns: 2 | 3) => {
    if (nextColumns === desktopColumns) {
      return;
    }

    setIsLayoutSwitching(true);
    setDesktopColumns(nextColumns);

    window.setTimeout(() => {
      setIsLayoutSwitching(false);
    }, 220);
  };

  const closeLightbox = () => setActiveIndex(null);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex]);

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeLightbox();
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <div className="inline-flex items-center gap-1 border border-white/12 bg-neutral-900/50 p-1">
          <button
            type="button"
            aria-label="Vista de tres columnas"
            onClick={() => handleChangeDesktopColumns(3)}
            className={`grid h-8 w-8 place-items-center transition-colors ${
              desktopColumns === 3
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-300 hover:bg-white/10"
            }`}
          >
            <ThreeColumnsIcon />
          </button>

          <button
            type="button"
            aria-label="Vista de dos columnas"
            onClick={() => handleChangeDesktopColumns(2)}
            className={`grid h-8 w-8 place-items-center transition-colors ${
              desktopColumns === 2
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-300 hover:bg-white/10"
            }`}
          >
            <TwoColumnsIcon />
          </button>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 gap-10 transition-all duration-300 md:grid-cols-2 ${
          desktopColumns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
        }`}
      >
        {items.map((item, index) => (
          <LazyPhotoCard
            key={item.id}
            item={item}
            index={index}
            isLayoutSwitching={isLayoutSwitching}
            onOpen={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {activeItem ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 bg-black/85 px-4 py-6 backdrop-blur-[2px] sm:px-8 sm:py-8"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="btn-premium absolute right-4 top-4 sm:right-8 sm:top-8"
          >
            Cerrar
          </button>

          <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center">
            <div className="relative h-[78vh] w-full max-w-6xl border border-white/20 bg-black">
              <Image
                src={activeItem.imageUrl}
                alt={activeItem.title}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
