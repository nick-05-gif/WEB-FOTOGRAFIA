import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_NEWS_COVER_IMAGE } from "@/lib/news/constants";
import { getNewsPostBySlug } from "@/lib/supabase/queries";
import { SITE_URL } from "@/lib/site";

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);

  if (!post) {
    return {
      title: "Noticia | Ruben Fotografia",
      description: "Articulo del apartado de noticias de Ruben Fotografia.",
    };
  }

  const articleUrl = `${SITE_URL}/noticias/${post.slug}`;
  const shareImage = post.cover_image_url || DEFAULT_NEWS_COVER_IMAGE;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      type: "article",
      url: articleUrl,
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: shareImage,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [shareImage],
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const parsedDate = new Date(post.publish_date);
  const articleDate = Number.isNaN(parsedDate.getTime())
    ? post.publish_date
    : new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(parsedDate);

  const articleParagraphs = post.content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-6 py-16 sm:py-20">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.14em] text-blue-300">{articleDate}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-100 sm:text-5xl">
          {post.title}
        </h1>
        <p className="max-w-3xl text-neutral-300">{post.excerpt}</p>
      </header>

      <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-neutral-800">
        <img
          src={post.cover_image_url || DEFAULT_NEWS_COVER_IMAGE}
          alt={post.title}
          className="h-full w-full object-cover"
        />
      </div>

      <article className="space-y-8 leading-relaxed text-neutral-300">
        {articleParagraphs.length === 0 ? (
          <p>Esta noticia no tiene contenido cargado todavia.</p>
        ) : (
          articleParagraphs.map((paragraph, index) => (
            <p key={`${post.id}-${index}`}>{paragraph}</p>
          ))
        )}

        {post.source_url ? (
          <p>
            Fuente original:{" "}
            <a
              href={post.source_url}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-blue-300 hover:text-blue-200"
            >
              ver articulo completo
            </a>
          </p>
        ) : null}
      </article>
    </main>
  );
}
