"use server";

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

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const collection = String(formData.get("collection") ?? "").trim();
  const shortDescription = String(
    formData.get("short_description") ?? ""
  ).trim();
  const description = String(formData.get("description") ?? "").trim();
  const maker = String(formData.get("maker") ?? "").trim();

  const basePrice = optionalNumber(formData.get("base_price"));
  const quantity = optionalNumber(formData.get("quantity"));
  const leadTimeDays = optionalNumber(formData.get("lead_time_days"));

  const featured = formData.get("featured") === "on";
  const trackInventory = formData.get("track_inventory") === "on";
  const madeToOrder = formData.get("made_to_order") === "on";
  const customizable = formData.get("customizable") === "on";
  const readyMade = formData.get("ready_made") === "on";
  const pickupAvailable = formData.get("pickup_available") === "on";
  const deliveryAvailable = formData.get("delivery_available") === "on";

  if (!name) {
    throw new Error("Product name is required.");
  }

  if (
    !["flowers", "candles", "custom", "shirts", "gators"].includes(category)
  ) {
    throw new Error("A valid product category is required.");
  }

  if (!collection) {
    throw new Error("Collection is required.");
  }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      category,
      collection,
      short_description: shortDescription || null,
      description: description || null,
      base_price: basePrice,
      featured,
      track_inventory: trackInventory,
      quantity: trackInventory ? quantity ?? 0 : null,
      made_to_order: madeToOrder,
      customizable,
      ready_made: readyMade,
      lead_time_days: leadTimeDays,
      maker: maker || null,
      pickup_available: pickupAvailable,
      delivery_available: deliveryAvailable,
    })
    .eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/products");
}

export async function setProductStatus(
  productId: string,
  status:
    | "draft"
    | "published"
    | "hidden"
    | "sold_out"
    | "archived"
) {
  const supabase = await requireAdmin();

  const updateValues: {
    status: string;
    archived_at?: string | null;
  } = {
    status,
  };

  if (status === "archived") {
    updateValues.archived_at = new Date().toISOString();
  } else {
    updateValues.archived_at = null;
  }

  const { error } = await supabase
    .from("products")
    .update(updateValues)
    .eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/products");
}
