"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function optionalNumber(
  value: FormDataEntryValue | null
) {
  if (
    !value ||
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function getLegacyCategory({
  department,
  configuratorType,
}: {
  department: string;
  configuratorType: string;
}) {
  if (department === "flowers") {
    return "flowers";
  }

  if (department === "apparel") {
    return "shirts";
  }

  if (department === "gator-gear") {
    return "gators";
  }

  if (department === "weddings-events") {
    return "flowers";
  }

  if (
    department === "seasonal" &&
    configuratorType === "flower"
  ) {
    return "flowers";
  }

  if (
    configuratorType === "candle"
  ) {
    return "candles";
  }

  return "custom";
}

function getRequiredLeadTime({
  department,
  productType,
  requestedLeadTime,
}: {
  department: string;
  productType: string;
  requestedLeadTime: number | null;
}) {
  let minimum = 0;

  if (
    [
      "sympathy-arrangement",
      "casket-spray",
      "standing-spray",
      "memorial-tribute",
    ].includes(productType)
  ) {
    minimum = 4;
  } else if (
    [
      "floral-arrangement",
      "hand-tied-bouquet",
      "corsage",
      "boutonniere",
      "formal-flower-set",
      "seasonal-floral",
    ].includes(productType)
  ) {
    minimum = 3;
  } else if (
    [
      "gifts-decor",
      "gator-gear",
    ].includes(department)
  ) {
    minimum = 2;
  } else if (
    department === "seasonal" &&
    productType !== "seasonal-shirt" &&
    productType !== "seasonal-candle"
  ) {
    minimum = 2;
  }

  if (minimum === 0) {
    return requestedLeadTime;
  }

  return Math.max(
    minimum,
    requestedLeadTime ?? 0
  );
}

export async function createProduct(
  formData: FormData
) {
  const supabase =
    await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

  const userId =
    claimsData?.claims?.sub;

  if (!userId) {
    redirect("/admin/login");
  }

  const { data: adminUser } =
    await supabase
      .from("admin_users")
      .select("id")
      .eq("auth_user_id", userId)
      .eq("active", true)
      .maybeSingle();

  if (!adminUser) {
    redirect("/admin/login");
  }

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const department = String(
    formData.get("department") ?? ""
  ).trim();

  const productType = String(
    formData.get("product_type") ?? ""
  ).trim();

  const collection = String(
    formData.get("collection") ?? ""
  ).trim();

  const configuratorType = String(
    formData.get("configurator_type") ?? ""
  ).trim();

  const purchaseMode = String(
    formData.get("purchase_mode") ?? ""
  ).trim();

  const shortDescription = String(
    formData.get("short_description") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const maker = String(
    formData.get("maker") ?? ""
  ).trim();

  const basePrice = optionalNumber(
    formData.get("base_price")
  );

  const quantity = optionalNumber(
    formData.get("quantity")
  );

  const requestedLeadTime =
    optionalNumber(
      formData.get("lead_time_days")
    );

  const featured =
    formData.get("featured") === "on";

  const trackInventory =
    formData.get("track_inventory") ===
    "on";

  const madeToOrder =
    formData.get("made_to_order") ===
    "on";

  const customizable =
    formData.get("customizable") ===
    "on";

  const readyMade =
    formData.get("ready_made") ===
    "on";

  const pickupAvailable =
    formData.get(
      "pickup_available"
    ) === "on";

  const deliveryAvailable =
    formData.get(
      "delivery_available"
    ) === "on";

  if (!name) {
    throw new Error(
      "Product name is required."
    );
  }

  if (
    ![
      "flowers",
      "gifts-decor",
      "apparel",
      "gator-gear",
      "seasonal",
      "weddings-events",
    ].includes(department)
  ) {
    throw new Error(
      "A valid department is required."
    );
  }

  if (!productType) {
    throw new Error(
      "Product type is required."
    );
  }

  if (!collection) {
    throw new Error(
      "Collection is required."
    );
  }

  if (
    ![
      "simple",
      "flower",
      "candle",
      "custom",
      "shirt",
      "gator",
      "wedding",
    ].includes(configuratorType)
  ) {
    throw new Error(
      "A valid configurator is required."
    );
  }

  if (
    ![
      "direct",
      "customizable",
      "request",
      "consultation",
    ].includes(purchaseMode)
  ) {
    throw new Error(
      "A valid ordering method is required."
    );
  }

  if (
    basePrice !== null &&
    basePrice < 0
  ) {
    throw new Error(
      "Price cannot be negative."
    );
  }

  if (
    quantity !== null &&
    quantity < 0
  ) {
    throw new Error(
      "Quantity cannot be negative."
    );
  }

  if (
    requestedLeadTime !== null &&
    requestedLeadTime < 0
  ) {
    throw new Error(
      "Lead time cannot be negative."
    );
  }

  const category =
    getLegacyCategory({
      department,
      configuratorType,
    });

  const leadTimeDays =
    getRequiredLeadTime({
      department,
      productType,
      requestedLeadTime,
    });

  const baseSlug = slugify(name);

  if (!baseSlug) {
    throw new Error(
      "Could not create a valid product slug."
    );
  }

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const { data: existing } =
      await supabase
        .from("products")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

    if (!existing) {
      break;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const {
    data: createdProduct,
    error,
  } = await supabase
    .from("products")
    .insert({
      name,
      slug,

      // Legacy routing field.
      category,

      // New catalog structure.
      department,
      product_type: productType,
      collection,
      configurator_type:
        configuratorType,
      purchase_mode:
        purchaseMode,

      short_description:
        shortDescription || null,
      description:
        description || null,
      base_price:
        basePrice,
      status:
        "draft",
      featured,
      track_inventory:
        trackInventory,
      quantity:
        trackInventory
          ? quantity ?? 0
          : null,
      made_to_order:
        madeToOrder,
      customizable,
      ready_made:
        readyMade,
      lead_time_days:
        leadTimeDays,
      maker:
        maker || null,
      pickup_available:
        pickupAvailable,
      delivery_available:
        deliveryAvailable,
    })
    .select("id")
    .single();

  if (
    error ||
    !createdProduct
  ) {
    throw new Error(
      error?.message ??
        "Unable to create product."
    );
  }

  redirect(
    `/admin/products/${createdProduct.id}/edit`
  );
}
