import { XMLParser } from "fast-xml-parser";
import { decode } from "he";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_NEWS_COVER_IMAGE,
  NEWS_SYNC_LIMIT,
  PETAPIXEL_FEED_URL,
} from "@/lib/news/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import type { NewsCategory } from "@/types/database.types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ExistingNewsPostRow {
  id: string;
  slug: string;
  source_url: string | null;
}

interface ParsedRssItem {
  title: string;
  slug: string;
  category: NewsCategory;
  publishDate: string;
  coverImageUrl: string;
  excerpt: string;
  content: string;
  sourceUrl: string;
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function stripHtml(value: string) {
  const decodedValue = decode(value || "");

  return decodedValue
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/\r/g, "")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanInlineText(value: string) {
  return stripHtml(value).replace(/\s+/g, " ").trim();
}

function getImageFromHtml(html: string) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? "";
}

function normalizePublishDate(rawValue: string) {
  const parsed = new Date(rawValue);

  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return parsed.toISOString().slice(0, 10);
}

function ensureExcerpt(text: string) {
  const cleaned = text.replace(/\s+/g, " ").trim();

  if (!cleaned) {
    return "Articulo publicado recientemente en PetaPixel.";
  }

  if (cleaned.length <= 220) {
    return cleaned;
  }

  return `${cleaned.slice(0, 217)}...`;
}

function isAuthorizedCronCall(request: NextRequest) {
  const configuredSecret = process.env.CRON_SECRET;

  if (!configuredSecret) {
    return true;
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${configuredSecret}`;
}

function parseFeedItems(xmlContent: string): ParsedRssItem[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    trimValues: true,
  });

  const parsedFeed = parser.parse(xmlContent);
  const rawItems = toArray<Record<string, unknown>>(parsedFeed?.rss?.channel?.item).slice(
    0,
    NEWS_SYNC_LIMIT
  );

  return rawItems
    .map((item) => {
      const title = cleanInlineText(typeof item.title === "string" ? item.title : "");
      const sourceUrl = cleanInlineText(typeof item.link === "string" ? item.link : "");

      const contentEncoded =
        typeof item["content:encoded"] === "string" ? item["content:encoded"] : "";
      const description = typeof item.description === "string" ? item.description : "";

      const mediaContent = toArray<Record<string, unknown>>(
        item["media:content"] as Record<string, unknown> | Record<string, unknown>[] | undefined
      );
      const firstMediaImage = mediaContent.find((entry) => typeof entry.url === "string")?.url;

      const enclosure = item.enclosure as Record<string, unknown> | undefined;
      const enclosureImage = typeof enclosure?.url === "string" ? enclosure.url : "";

      const imageFromHtml = getImageFromHtml(contentEncoded || description);
      const coverImageUrl =
        cleanInlineText(String(firstMediaImage ?? "")) ||
        cleanInlineText(enclosureImage) ||
        imageFromHtml.trim() ||
        DEFAULT_NEWS_COVER_IMAGE;

      const content = stripHtml(contentEncoded || description);
      const excerpt = ensureExcerpt(cleanInlineText(description || contentEncoded));
      const slug = slugify(title);
      const publishDate = normalizePublishDate(
        typeof item.pubDate === "string" ? item.pubDate : ""
      );

      return {
        title,
        slug,
        // Aragon se carga a mano desde admin; el cron solo importa Mundo (PetaPixel).
        category: "mundo",
        publishDate,
        coverImageUrl,
        excerpt,
        content,
        sourceUrl,
      } satisfies ParsedRssItem;
    })
    .filter((item) => item.title && item.slug && item.sourceUrl);
}

export async function GET(request: NextRequest) {
  if (!isAuthorizedCronCall(request)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const feedResponse = await fetch(PETAPIXEL_FEED_URL, {
      cache: "no-store",
      headers: {
        "User-Agent": "web-tio-news-bot/1.0",
      },
    });

    if (!feedResponse.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `No se pudo leer RSS de PetaPixel (${feedResponse.status}).`,
        },
        { status: 502 }
      );
    }

    const xmlContent = await feedResponse.text();
    const parsedItems = parseFeedItems(xmlContent);

    if (parsedItems.length === 0) {
      return NextResponse.json({
        ok: true,
        processed: 0,
        inserted: 0,
        updated: 0,
      });
    }

    const supabase = createAdminClient();

    const { data: existingRows, error: existingRowsError } = await supabase
      .from("news_posts")
      .select("id, slug, source_url");

    if (existingRowsError) {
      return NextResponse.json(
        {
          ok: false,
          error: existingRowsError.message,
        },
        { status: 500 }
      );
    }

    const existingBySlug = new Map<string, ExistingNewsPostRow>();
    const existingBySourceUrl = new Map<string, ExistingNewsPostRow>();

    for (const row of (existingRows ?? []) as ExistingNewsPostRow[]) {
      existingBySlug.set(row.slug, row);

      if (row.source_url) {
        existingBySourceUrl.set(row.source_url, row);
      }
    }

    let inserted = 0;
    let updated = 0;

    const rowsToUpsert = parsedItems.map((item) => {
      // Bucle anti-duplicados explicado sin humo:
      // 1) Primero miro si ya existe por link original (source_url), que es lo mas fiable.
      // 2) Si no, miro por slug por si el link cambio pero el titulo es el mismo.
      // 3) Si encuentro algo, reutilizo su id y hago UPDATE.
      // 4) Si no encuentro nada, va como INSERT nuevo.
      const existingMatch =
        existingBySourceUrl.get(item.sourceUrl) ?? existingBySlug.get(item.slug);

      if (existingMatch) {
        updated += 1;
      } else {
        inserted += 1;
      }

      return {
        ...(existingMatch ? { id: existingMatch.id, slug: existingMatch.slug } : {}),
        title: item.title,
        slug: existingMatch?.slug ?? item.slug,
        category: item.category,
        publish_date: item.publishDate,
        cover_image_url: item.coverImageUrl || DEFAULT_NEWS_COVER_IMAGE,
        excerpt: item.excerpt,
        content: item.content || item.excerpt,
        source_url: item.sourceUrl,
      };
    });

    const { error: upsertError } = await supabase.from("news_posts").upsert(rowsToUpsert, {
      onConflict: "id",
      ignoreDuplicates: false,
    });

    if (upsertError) {
      return NextResponse.json(
        {
          ok: false,
          error: upsertError.message,
        },
        { status: 500 }
      );
    }

    revalidatePath("/noticias");

    return NextResponse.json({
      ok: true,
      processed: parsedItems.length,
      inserted,
      updated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Error inesperado sincronizando noticias.",
      },
      { status: 500 }
    );
  }
}
