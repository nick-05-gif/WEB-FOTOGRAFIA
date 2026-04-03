"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CategoryCarouselProps {
  title: string;
  description: string;
  href: string;
  images: string[];
}

export function CategoryCarousel({
  title,
  description,
  href,
  images,
}: CategoryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    // En movil va un poco mas lento para no sentirse nervioso; en desktop va mas fluido.
    const autoplayDelay = isMobile ? 5200 : 4300;
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, autoplayDelay);

    return () => window.clearInterval(intervalId);
  }, [images.length, isMobile]);

  return (
    <Link href={href} className="group block">
      <article className="relative h-[56vh] min-h-[340px] overflow-hidden border border-white/10 bg-neutral-900/20">
        {images.map((imageUrl, index) => (
          <Image
            key={`${title}-${index}`}
            src={imageUrl}
            alt={`${title} ${index + 1}`}
            fill
            sizes="100vw"
            priority={index === 0}
            className={`object-cover transition-[opacity,transform] ${
              isMobile
                ? "duration-[900ms] ease-out"
                : "duration-[1550ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            } ${
              index === activeIndex ? "scale-100 opacity-100" : "scale-105 opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-300">Coleccion</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-neutral-200 sm:text-base">{description}</p>
          <span className="btn-premium mt-5 border-white/20 bg-neutral-950/80 text-neutral-100 group-hover:bg-neutral-900">
            Explorar categoria
          </span>
        </div>

        <div className="absolute bottom-6 right-6 flex items-center gap-2">
          {images.map((_, index) => (
            <span
              key={`${title}-dot-${index}`}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === activeIndex ? "w-6 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </article>
    </Link>
  );
}
