"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type BulkStatus =
  | "published"
  | "hidden"
  | "sold_out"
  | "draft"
  | "archived";

async function requireAdmin() {
  const supabase = await createClient();

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

async function validateProductsForPublishing(
  supabase: Awaited<
    ReturnType<typeof createClient>
  >,
  productIds: string[]
) {
  const {
    data: products,
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
      delivery_available,
      product_images (
        id
      ),
      product_variants (
        id,
        price,
        active
      )
    `)
    .in("id", productIds);

  if (productError) {
    throw new Error(
      productError.message
    );
  }

  if (
    !products ||
    products.length !==
      productIds.length
  ) {
    throw new Error(
      "One or more selected products could not be found."
    );
  }

  const invalidProducts: string[] =
    [];

  for (const product of products) {
    const problems: string[] = [];

    const activeVariants =
      product.product_variants?.filter(
        (variant) => variant.active
      ) ?? [];

    const hasVariantPrice =
      activeVariants.some(
        (variant) =>
          variant.price !== null
      );

    if (!product.name?.trim()) {
      problems.push("name");
    }

    if (!product.collection?.trim()) {
      problems.push("collection");
    }

    if (
      product.base_price === null &&
      !hasVariantPrice
    ) {
      problems.push("price");
    }

    if (
      !product.product_images ||
      product.product_images.length ===
        0
    ) {
      problems.push("image");
    }

    if (
      !product.pickup_available &&
      !product.delivery_available
    ) {
      problems.push(
        "fulfillment option"
      );
    }

    if (
      (product.made_to_order ||
        product.customizable) &&
      product.lead_time_days === null
    ) {
      problems.push("lead time");
    }

    if (problems.length > 0) {
      invalidProducts.push(
        `${product.name}: ${problems.join(
          ", "
        )}`
      );
    }
  }

  return invalidProducts;
}

export async function bulkUpdateProducts(
  formData: FormData
) {
  const supabase =
    await requireAdmin();

  const productIds = [
    ...new Set(
      formData
        .getAll("product_ids")
        .map(String)
        .map((value) =>
          value.trim()
        )
        .filter(Boolean)
    ),
  ];

  const action = String(
    formData.get("bulk_action") ?? ""
  ) as BulkStatus;

  if (productIds.length === 0) {
    throw new Error(
      "Select at least one product."
    );
  }

  if (
    ![
      "published",
      "hidden",
      "sold_out",
      "draft",
      "archived",
    ].includes(action)
  ) {
    throw new Error(
      "Choose a valid bulk action."
    );
  }

  if (action === "published") {
    const invalidProducts =
      await validateProductsForPublishing(
        supabase,
        productIds
      );

    if (invalidProducts.length > 0) {
      const message =
        `The selected products cannot all be published. ${invalidProducts.join(
          " | "
        )}`;

      redirect(
        `/admin/products?bulk_error=${encodeURIComponent(
          message
        )}`
      );
    }
  }

  const updateValues: {
    status: BulkStatus;
    archived_at?: string | null;
  } = {
    status: action,
  };

  if (action === "archived") {
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
      .in("id", productIds);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}
