"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DEFAULT_NEWS_COVER_IMAGE } from "@/lib/news/constants";
import type { NewsCategory, NewsPost } from "@/types/database.types";

type NewsFilter = "all" | NewsCategory;

interface NewsTabsGridProps {
  posts: NewsPost[];
}

const FILTER_BUTTONS: Array<{ id: NewsFilter; label: string }> = [
  { id: "all", label: "Todas" },
  { id: "aragon", label: "Aragon" },
  { id: "mundo", label: "Mundo" },
];

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

function formatNewsCategoryLabel(category: NewsCategory) {
  return category === "aragon" ? "Aragon" : "Mundo";
}

function emptyStateText(filter: NewsFilter) {
  if (filter === "aragon") {
    return "Aun no hay noticias de Aragon publicadas.";
  }

  if (filter === "mundo") {
    return "Aun no hay noticias de Mundo publicadas.";
  }

  return "Aun no hay noticias publicadas.";
}

export function NewsTabsGrid({ posts }: NewsTabsGridProps) {
  const [activeFilter, setActiveFilter] = useState<NewsFilter>("all");

  const filteredPosts = useMemo(() => {
    if (activeFilter === "all") {
      return posts;
    }

    return posts.filter((post) => post.category === activeFilter);
  }, [posts, activeFilter]);

  return (
    <>
      <section className="flex flex-wrap items-center justify-center gap-4">
        {FILTER_BUTTONS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={`btn-premium min-w-[112px] ${
              activeFilter === filter.id
                ? "border-white/40 bg-neutral-100 text-neutral-900"
                : "border-white/15 bg-neutral-900 text-neutral-300"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.length === 0 ? (
          <article className="col-span-full border border-dashed border-white/20 bg-neutral-900/20 p-10 text-center text-neutral-400">
            {emptyStateText(activeFilter)}
          </article>
        ) : (
          filteredPosts.map((post) => (
            <Link key={post.slug} href={`/noticias/${post.slug}`} className="group block">
              <article className="overflow-hidden border border-white/10 bg-neutral-900/20 transition-colors group-hover:border-white/25">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.cover_image_url || DEFAULT_NEWS_COVER_IMAGE}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-4 p-7">
                  <p className="text-xs uppercase tracking-[0.16em] text-neutral-300">
                    {formatNewsDate(post.publish_date)}
                  </p>
                  <p className="w-fit border border-white/20 bg-neutral-900/60 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-neutral-200">
                    {formatNewsCategoryLabel(post.category)}
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-100">{post.title}</h2>
                  <p className="text-sm leading-relaxed text-neutral-300/90">{post.excerpt}</p>
                </div>
              </article>
            </Link>
          ))
        )}
      </section>
    </>
  );
}
