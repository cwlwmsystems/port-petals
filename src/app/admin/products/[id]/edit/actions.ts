"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getRequiredLeadTime({
  category,
  collection,
  customizable,
  madeToOrder,
  requestedLeadTime,
}: {
  category: string;
  collection: string;
  customizable: boolean;
  madeToOrder: boolean;
  requestedLeadTime: number | null;
}) {
  let minimum = 0;

  if (category === "flowers") {
    minimum =
      collection.toLowerCase() ===
      "sympathy arrangements"
        ? 4
        : 3;
  }

  if (
    category === "custom" ||
    category === "gators"
  ) {
    minimum = 2;
  }

  if (
    category === "shirts" &&
    (customizable || madeToOrder)
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

async function requireAdmin() {
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

  return supabase;
}

export async function updateProduct(
  productId: string,
  formData: FormData
) {
  const supabase =
    await requireAdmin();

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const category = String(
    formData.get("category") ?? ""
  ).trim();

  const collection = String(
    formData.get("collection") ?? ""
  ).trim();

  const shortDescription = String(
    formData.get(
      "short_description"
    ) ?? ""
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
      "candles",
      "custom",
      "shirts",
      "gators",
    ].includes(category)
  ) {
    throw new Error(
      "A valid product category is required."
    );
  }

  if (!collection) {
    throw new Error(
      "Collection is required."
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

  const leadTimeDays =
    getRequiredLeadTime({
      category,
      collection,
      customizable,
      madeToOrder,
      requestedLeadTime,
    });

  const { error } =
    await supabase
      .from("products")
      .update({
        name,
        category,
        collection,
        short_description:
          shortDescription || null,
        description:
          description || null,
        base_price: basePrice,
        featured,
        track_inventory:
          trackInventory,
        quantity: trackInventory
          ? quantity ?? 0
          : null,
        made_to_order:
          madeToOrder,
        customizable,
        ready_made: readyMade,
        lead_time_days:
          leadTimeDays,
        maker: maker || null,
        pickup_available:
          pickupAvailable,
        delivery_available:
          deliveryAvailable,
      })
      .eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }

  redirect(
    `/admin/products/${productId}/edit`
  );
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
  const supabase =
    await requireAdmin();

  if (status === "published") {
    const {
      data: product,
      error: productError,
    } = await supabase
      .from("products")
      .select(`
        id,
        name,
        collection,
        base_price,
        made_to_order,
        customizable,
        lead_time_days,
        pickup_available,
        delivery_available
      `)
      .eq("id", productId)
      .maybeSingle();

    if (
      productError ||
      !product
    ) {
      throw new Error(
        "Product not found."
      );
    }

    const {
      count: imageCount,
      error: imageError,
    } = await supabase
      .from("product_images")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("product_id", productId);

    if (imageError) {
      throw new Error(
        imageError.message
      );
    }

    const {
      data: activeVariants,
      error: variantError,
    } = await supabase
      .from("product_variants")
      .select("id, price")
      .eq("product_id", productId)
      .eq("active", true);

    if (variantError) {
      throw new Error(
        variantError.message
      );
    }

    const hasVariantPrice =
      (activeVariants ?? []).some(
        (variant) =>
          variant.price !== null
      );

    const problems: string[] = [];

    if (!product.name.trim()) {
      problems.push(
        "product name is missing"
      );
    }

    if (!product.collection.trim()) {
      problems.push(
        "collection is missing"
      );
    }

    if (
      product.base_price === null &&
      !hasVariantPrice
    ) {
      problems.push(
        "no price has been set"
      );
    }

    if ((imageCount ?? 0) === 0) {
      problems.push(
        "at least one product image is required"
      );
    }

    if (
      !product.pickup_available &&
      !product.delivery_available
    ) {
      problems.push(
        "pickup or delivery must be enabled"
      );
    }

    if (
      (product.made_to_order ||
        product.customizable) &&
      product.lead_time_days === null
    ) {
      problems.push(
        "preparation time is missing"
      );
    }

    if (problems.length > 0) {
      throw new Error(
        `Product cannot be published: ${problems.join(
          "; "
        )}.`
      );
    }
  }

  const updateValues: {
    status: string;
    archived_at?: string | null;
  } = {
    status,
  };

  if (status === "archived") {
    updateValues.archived_at =
      new Date().toISOString();
  } else {
    updateValues.archived_at =
      null;
  }

  const { error } =
    await supabase
      .from("products")
      .update(updateValues)
      .eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }

  redirect(
    `/admin/products/${productId}/edit`
  );
}

export async function duplicateProduct(
  productId: string
) {
  const supabase =
    await requireAdmin();

  const {
    data: product,
    error: productError,
  } = await supabase
    .from("products")
    .select(`
      name,
      category,
      collection,
      short_description,
      description,
      base_price,
      featured,
      track_inventory,
      quantity,
      made_to_order,
      customizable,
      ready_made,
      lead_time_days,
      maker,
      pickup_available,
      delivery_available
    `)
    .eq("id", productId)
    .maybeSingle();

  if (
    productError ||
    !product
  ) {
    throw new Error(
      "Product not found."
    );
  }

  const {
    data: variants,
    error: variantError,
  } = await supabase
    .from("product_variants")
    .select(`
      name,
      sku,
      garment_type,
      size,
      color,
      price,
      track_inventory,
      quantity,
      active
    `)
    .eq("product_id", productId);

  if (variantError) {
    throw new Error(
      variantError.message
    );
  }

  const copyName =
    `${product.name} Copy`;

  const baseSlug =
    slugify(copyName);

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

    slug =
      `${baseSlug}-${counter}`;

    counter += 1;
  }

  const {
    data: duplicate,
    error: duplicateError,
  } = await supabase
    .from("products")
    .insert({
      ...product,
      name: copyName,
      slug,
      status: "draft",
      featured: false,
    })
    .select("id")
    .single();

  if (
    duplicateError ||
    !duplicate
  ) {
    throw new Error(
      duplicateError?.message ??
        "Unable to duplicate product."
    );
  }

  if (
    variants &&
    variants.length > 0
  ) {
    const { error } =
      await supabase
        .from("product_variants")
        .insert(
          variants.map(
            (variant) => ({
              ...variant,
              product_id:
                duplicate.id,
              sku: null,
            })
          )
        );

    if (error) {
      throw new Error(
        error.message
      );
    }
  }

  redirect(
    `/admin/products/${duplicate.id}/edit`
  );
}
