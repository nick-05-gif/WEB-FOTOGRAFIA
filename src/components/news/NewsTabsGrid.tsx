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
      <section className="flex flex-wrap items-center justify-center gap-3">
        {FILTER_BUTTONS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              activeFilter === filter.id
                ? "border-blue-500 bg-blue-600 text-white"
                : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-blue-500/60"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.length === 0 ? (
          <article className="col-span-full rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/60 p-8 text-center text-neutral-400">
            {emptyStateText(activeFilter)}
          </article>
        ) : (
          filteredPosts.map((post) => (
            <Link key={post.slug} href={`/noticias/${post.slug}`} className="group block">
              <article className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition-colors group-hover:border-blue-700/60">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.cover_image_url || DEFAULT_NEWS_COVER_IMAGE}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-3 p-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-blue-300">
                    {formatNewsDate(post.publish_date)}
                  </p>
                  <p className="w-fit rounded-full border border-blue-700/70 bg-blue-600/10 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-blue-200">
                    {formatNewsCategoryLabel(post.category)}
                  </p>
                  <h2 className="text-xl font-semibold text-neutral-100">{post.title}</h2>
                  <p className="text-sm leading-relaxed text-neutral-300">{post.excerpt}</p>
                </div>
              </article>
            </Link>
          ))
        )}
      </section>
    </>
  );
}
