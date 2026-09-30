"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

async function requireAdmin() {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect("/admin/login");
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("auth_user_id", userId)
    .eq("active", true)
    .maybeSingle();

  if (!adminUser) {
    redirect("/admin/login");
  }

  return supabase;
}

function getExtension(file: File) {
  switch (file.type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return null;
  }
}

export async function uploadProductImage(
  productId: string,
  formData: FormData
) {
  const supabase = await requireAdmin();

  const file = formData.get("image");

  if (!(file instanceof File)) {
    throw new Error("Please choose an image.");
  }

  if (file.size === 0) {
    throw new Error("The selected image is empty.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image must be 10 MB or smaller.");
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPEG, PNG, and WebP images are allowed.");
  }

  const extension = getExtension(file);

  if (!extension) {
    throw new Error("Unsupported image type.");
  }

  const fileName = `${crypto.randomUUID()}.${extension}`;
  const storagePath = `products/${productId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { count } = await supabase
    .from("product_images")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("product_id", productId);

  const isPrimary = (count ?? 0) === 0;

  const { error: databaseError } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      storage_path: storagePath,
      alt_text: file.name,
      sort_order: count ?? 0,
      is_primary: isPrimary,
    });

  if (databaseError) {
    await supabase.storage
      .from("product-images")
      .remove([storagePath]);

    throw new Error(databaseError.message);
  }

  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function deleteProductImage(
  productId: string,
  imageId: string
) {
  const supabase = await requireAdmin();

  const { data: image } = await supabase
    .from("product_images")
    .select("id, storage_path, is_primary")
    .eq("id", imageId)
    .eq("product_id", productId)
    .maybeSingle();

  if (!image) {
    throw new Error("Image not found.");
  }

  const { error: storageError } = await supabase.storage
    .from("product-images")
    .remove([image.storage_path]);

  if (storageError) {
    throw new Error(storageError.message);
  }

  const { error: databaseError } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (databaseError) {
    throw new Error(databaseError.message);
  }

  if (image.is_primary) {
    const { data: nextImage } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (nextImage) {
      await supabase
        .from("product_images")
        .update({ is_primary: true })
        .eq("id", nextImage.id);
    }
  }

  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function setPrimaryProductImage(
  productId: string,
  imageId: string
) {
  const supabase = await requireAdmin();

  const { data: image } = await supabase
    .from("product_images")
    .select("id")
    .eq("id", imageId)
    .eq("product_id", productId)
    .maybeSingle();

  if (!image) {
    throw new Error("Image not found.");
  }

  const { error: clearError } = await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId)
    .eq("is_primary", true);

  if (clearError) {
    throw new Error(clearError.message);
  }

  const { error: primaryError } = await supabase
    .from("product_images")
    .update({ is_primary: true })
    .eq("id", imageId);

  if (primaryError) {
    throw new Error(primaryError.message);
  }

  revalidatePath(`/admin/products/${productId}/edit`);
}
