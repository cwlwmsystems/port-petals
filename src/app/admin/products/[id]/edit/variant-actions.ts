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

const shirtGarments = {
  "t-shirt": {
    label: "T-Shirt",
    price: 22,
  },
  crewneck: {
    label: "Crewneck",
    price: 29,
  },
  hoodie: {
    label: "Hoodie",
    price: 34,
  },
} as const;

const allowedShirtSizes = [
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
] as const;

const allowedShirtColors = [
  "White",
  "Black",
  "Light Gray",
  "Dark Gray",
] as const;

export async function generateShirtVariants(
  productId: string,
  formData: FormData
) {
  const supabase = await requireAdmin();

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, category")
    .eq("id", productId)
    .maybeSingle();

  if (productError || !product) {
    throw new Error("Product not found.");
  }

  if (product.category !== "shirts") {
    throw new Error(
      "Shirt variants can only be generated for shirt products."
    );
  }

  const garmentTypes = formData
    .getAll("garment_types")
    .map(String)
    .filter(
      (
        value
      ): value is keyof typeof shirtGarments =>
        value in shirtGarments
    );

  const sizes = formData
    .getAll("sizes")
    .map(String)
    .filter((value) =>
      allowedShirtSizes.includes(
        value as (typeof allowedShirtSizes)[number]
      )
    );

  const colors = formData
    .getAll("colors")
    .map(String)
    .filter((value) =>
      allowedShirtColors.includes(
        value as (typeof allowedShirtColors)[number]
      )
    );

  if (
    garmentTypes.length === 0 ||
    sizes.length === 0 ||
    colors.length === 0
  ) {
    throw new Error(
      "Choose at least one garment type, size, and color."
    );
  }

  const { data: existingVariants, error: existingError } =
    await supabase
      .from("product_variants")
      .select("garment_type, size, color")
      .eq("product_id", productId);

  if (existingError) {
    throw new Error(existingError.message);
  }

  const existingKeys = new Set(
    (existingVariants ?? []).map((variant) =>
      [
        variant.garment_type ?? "",
        variant.size ?? "",
        variant.color ?? "",
      ].join("|")
    )
  );

  const rows = [];

  for (const garmentType of garmentTypes) {
    const garment = shirtGarments[garmentType];

    for (const size of sizes) {
      for (const color of colors) {
        const key = [garmentType, size, color].join("|");

        if (existingKeys.has(key)) {
          continue;
        }

        rows.push({
          product_id: productId,
          name: `${garment.label} / ${size} / ${color}`,
          garment_type: garmentType,
          size,
          color,
          price: garment.price,
          sku: null,
          track_inventory: false,
          quantity: null,
          active: true,
        });
      }
    }
  }

  if (rows.length > 0) {
    const { error } = await supabase
      .from("product_variants")
      .insert(rows);

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function createVariant(
  productId: string,
  formData: FormData
) {
  const supabase = await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const garmentType = String(
    formData.get("garment_type") ?? ""
  ).trim();
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
      garment_type: garmentType || null,
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
  const garmentType = String(
    formData.get("garment_type") ?? ""
  ).trim();
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
    .update({
      name,
      garment_type: garmentType || null,
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
