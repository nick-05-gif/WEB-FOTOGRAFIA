"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Photo } from "@/types/database.types";

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

export async function uploadPhoto(formData: FormData): Promise<ActionState> {
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

  const supabase = await createClient();

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
    await supabase.storage.from("portfolio-images").remove([filePath]);
    return { message: insertError.message };
  }

  revalidatePath("/");
  revalidatePath("/portfolio/[category]", "page");

  return { message: "Foto subida correctamente." };
}

export async function uploadPhotoAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  return uploadPhoto(formData);
}
