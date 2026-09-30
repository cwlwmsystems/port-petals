"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function optionalNumber(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

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

export async function createVariant(
  productId: string,
  formData: FormData
) {
  const supabase = await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const size = String(formData.get("size") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();

  const price = optionalNumber(formData.get("price"));
  const quantity = optionalNumber(formData.get("quantity"));

  const trackInventory =
    formData.get("track_inventory") === "on";

  if (!name) {
    throw new Error("Variant name is required.");
  }

  if (price !== null && price < 0) {
    throw new Error("Variant price cannot be negative.");
  }

  if (quantity !== null && quantity < 0) {
    throw new Error("Variant quantity cannot be negative.");
  }

  const { error } = await supabase
    .from("product_variants")
    .insert({
      product_id: productId,
      name,
      sku: sku || null,
      size: size || null,
      color: color || null,
      price,
      track_inventory: trackInventory,
      quantity: trackInventory ? quantity ?? 0 : null,
      active: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function updateVariant(
  productId: string,
  variantId: string,
  formData: FormData
) {
  const supabase = await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const size = String(formData.get("size") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();

  const price = optionalNumber(formData.get("price"));
  const quantity = optionalNumber(formData.get("quantity"));

  const trackInventory =
    formData.get("track_inventory") === "on";

  if (!name) {
    throw new Error("Variant name is required.");
  }

  const { error } = await supabase
    .from("product_variants")
    .update({
      name,
      sku: sku || null,
      size: size || null,
      color: color || null,
      price,
      track_inventory: trackInventory,
      quantity: trackInventory ? quantity ?? 0 : null,
    })
    .eq("id", variantId)
    .eq("product_id", productId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function setVariantActive(
  productId: string,
  variantId: string,
  active: boolean
) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("product_variants")
    .update({
      active,
    })
    .eq("id", variantId)
    .eq("product_id", productId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function deleteVariant(
  productId: string,
  variantId: string
) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("product_variants")
    .delete()
    .eq("id", variantId)
    .eq("product_id", productId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/products/${productId}/edit`);
}
