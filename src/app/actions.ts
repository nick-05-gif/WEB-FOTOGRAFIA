"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { NewsCategory, Photo } from "@/types/database.types";

export interface ActionState {
  message: string | null;
}

function getFormString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCategory(value: string): Photo["category"] | null {
  if (value === "Paisajes") return "Paisajes";
  if (value === "Viajes") return "Viajes";
  if (value === "Retratos") return "Retratos";
  if (value === "Nocturnas") return "Nocturnas";
  return null;
}

function normalizeNewsCategory(value: string): NewsCategory | null {
  if (value === "aragon") return "aragon";
  if (value === "mundo") return "mundo";
  return null;
}

function isValidHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
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

export async function login(formData: FormData): Promise<ActionState> {
  const email = getFormString(formData.get("email"));
  const password = getFormString(formData.get("password"));

  if (!email || !password) {
    return { message: "Email y contrasena son obligatorios." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { message: error.message };
  }

  redirect("/admin");
}

export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  return login(formData);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function uploadPhoto(formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autorizado");
  }

  const title = getFormString(formData.get("title"));
  const description = getFormString(formData.get("description"));
  const categoryRaw = getFormString(formData.get("category"));
  const category = normalizeCategory(categoryRaw);
  const isFeatured = formData.get("is_featured") === "on";
  const imageEntry = formData.get("image");

  if (!title) {
    return { message: "El titulo es obligatorio." };
  }

  if (!category) {
    return { message: "Selecciona una categoria valida." };
  }

  if (!(imageEntry instanceof File) || imageEntry.size === 0) {
    return { message: "Debes subir una imagen valida." };
  }

  const extensionFromName = imageEntry.name.split(".").pop() ?? "jpg";
  const extension = extensionFromName.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const filePath = `uploads/${uniqueFileName}`;

  const { error: uploadError } = await supabase.storage
    .from("portfolio-images")
    .upload(filePath, imageEntry, {
      contentType: imageEntry.type || undefined,
      upsert: false,
    });

  if (uploadError) {
    return { message: uploadError.message };
  }

  const { data: publicUrlData } = supabase.storage
    .from("portfolio-images")
    .getPublicUrl(filePath);

  const imageUrl = publicUrlData.publicUrl;

  const { error: insertError } = await supabase.from("photos").insert({
    title,
    description: description || null,
    category,
    image_url: imageUrl,
    is_featured: isFeatured,
  });

  if (insertError) {
    return { message: insertError.message };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/portfolio/[category]", "page");

  return { message: "Foto subida correctamente." };
}

export async function deletePhoto(id: string, imageUrl: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autorizado");
  }

  const fileName = imageUrl.split("/").pop();

  if (!fileName) {
    throw new Error("No se pudo identificar el archivo de la imagen.");
  }

  const { error: storageError } = await supabase.storage
    .from("portfolio-images")
    .remove([fileName]);

  if (storageError) {
    throw new Error(storageError.message);
  }

  const { error: deleteError } = await supabase
    .from("photos")
    .delete()
    .eq("id", id);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createNewsPost(formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autorizado");
  }

  const title = getFormString(formData.get("news_title"));
  const publishDate = getFormString(formData.get("news_date"));
  const coverImageUrl = getFormString(formData.get("news_cover_image_url"));
  const category = normalizeNewsCategory(getFormString(formData.get("news_category")));
  const excerpt = getFormString(formData.get("news_excerpt"));
  const content = getFormString(formData.get("news_content"));

  if (!title || !publishDate || !coverImageUrl || !excerpt || !content || !category) {
    return { message: "Completa todos los campos de la noticia." };
  }

  if (!isValidHttpUrl(coverImageUrl)) {
    return { message: "La URL de portada no es valida." };
  }

  const baseSlug = slugify(title);

  if (!baseSlug) {
    return { message: "No se pudo generar un slug valido para la noticia." };
  }

  let slug = baseSlug;

  const { data: existingPost, error: existingPostError } = await supabase
    .from("news_posts")
    .select("id")
    .eq("slug", baseSlug)
    .maybeSingle();

  if (existingPostError) {
    return { message: existingPostError.message };
  }

  if (existingPost) {
    slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;
  }

  // En cristiano: cuando le das a "Publicar", esto mete la noticia en
  // Supabase, tabla news_posts. Aqui queda guardada de verdad.
  const { error: insertError } = await supabase.from("news_posts").insert({
    title,
    slug,
    category,
    publish_date: publishDate,
    cover_image_url: coverImageUrl,
    excerpt,
    content,
  });

  if (insertError) {
    return { message: insertError.message };
  }

  // Y aqui forzamos refresco de cache para que /admin y /noticias
  // vuelvan a leer DB al instante y salga la noticia sin esperar.
  revalidatePath("/admin");
  revalidatePath("/noticias");
  revalidatePath(`/noticias/${slug}`);

  return { message: "Noticia publicada correctamente." };
}

export async function deleteNewsPost(id: string, slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autorizado");
  }

  const { error: deleteError } = await supabase.from("news_posts").delete().eq("id", id);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  revalidatePath("/admin");
  revalidatePath("/noticias");

  if (slug) {
    revalidatePath(`/noticias/${slug}`);
  }
}

export async function uploadPhotoAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    return await uploadPhoto(formData);
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : "Error inesperado al subir la foto.",
    };
  }
}

export async function uploadPhotoFromForm(formData: FormData) {
  await uploadPhoto(formData);
}
