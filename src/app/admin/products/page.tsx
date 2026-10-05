import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BulkCatalogControls from "./BulkCatalogControls";
import { bulkUpdateProducts } from "./actions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

type AdminProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    collection?: string;
    status?: string;
    inventory?: string;
    sort?: string;
    view?: string;
    bulk_error?: string;
  }>;
};

const categoryLabels: Record<string, string> = {
  flowers: "Fresh Flowers",
  candles: "Candles",
  custom: "Custom Items",
  shirts: "Shirts",
  gators: "Gator Gear",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  hidden: "Hidden",
  sold_out: "Sold Out",
  archived: "Archived",
};

function formatPrice(price: number | null) {
  if (price === null) {
    return "Contact for price";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function formatDate(value: string | null) {
  if (!value) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function statusClasses(status: string) {
  switch (status) {
    case "published":
      return "bg-[#e6f2e3] text-[#31583b]";
    case "draft":
      return "bg-[#f4ead8] text-[#775d2f]";
    case "hidden":
      return "bg-[#edf1f6] text-[#536578]";
    case "sold_out":
      return "bg-[#f8e1dc] text-[#a7473f]";
    case "archived":
      return "bg-[#ece9e5] text-[#6d6862]";
    default:
      return "bg-[#edf1f6] text-[#536578]";
  }
}

function getProductPath(
  category: string,
  slug: string
) {
  switch (category) {
    case "flowers":
      return `/flowers/${slug}`;
    case "candles":
      return `/candles/${slug}`;
    case "custom":
      return `/custom/${slug}`;
    case "shirts":
      return `/shirts/${slug}`;
    case "gators":
      return `/gators/${slug}`;
    default:
      return null;
  }
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const params = await searchParams;

  const search =
    params.search?.trim() ?? "";

  const category =
    params.category?.trim() ?? "";

  const collection =
    params.collection?.trim() ?? "";

  const status =
    params.status?.trim() ?? "";

  const inventory =
    params.inventory?.trim() ?? "";

  const sort =
    params.sort?.trim() || "updated-desc";

  const view =
    params.view === "cards"
      ? "cards"
      : "table";

  const bulkError =
    params.bulk_error?.trim() ?? "";

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

  const { data, error } =
    await supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        category,
        collection,
        base_price,
        status,
        featured,
        ready_made,
        made_to_order,
        customizable,
        lead_time_days,
        track_inventory,
        quantity,
        updated_at,
        product_variants (
          id,
          price,
          quantity,
          track_inventory,
          active
        ),
        product_images (
          id,
          storage_path,
          alt_text,
          is_primary
        )
      `);

  if (error) {
    throw new Error(error.message);
  }

  const allProducts =
    (data ?? []).map((product) => {
      const activeVariants =
        product.product_variants?.filter(
          (variant) => variant.active
        ) ?? [];

      const trackedVariants =
        activeVariants.filter(
          (variant) =>
            variant.track_inventory &&
            variant.quantity !== null
        );

      const hasVariantInventory =
        trackedVariants.length > 0;

      const variantQuantity =
        trackedVariants.reduce(
          (total, variant) =>
            total +
            Number(variant.quantity ?? 0),
          0
        );

      const tracksInventory =
        hasVariantInventory ||
        product.track_inventory;

      const inventoryQuantity =
        hasVariantInventory
          ? variantQuantity
          : product.track_inventory
            ? product.quantity
            : null;

      const soldOut =
        tracksInventory &&
        inventoryQuantity !== null &&
        inventoryQuantity <= 0;

      const lowStock =
        tracksInventory &&
        inventoryQuantity !== null &&
        inventoryQuantity > 0 &&
        inventoryQuantity <= 3;

      const primaryImage =
        [
          ...(product.product_images ??
            []),
        ].sort(
          (a, b) =>
            Number(b.is_primary) -
            Number(a.is_primary)
        )[0] ?? null;

      let imageUrl: string | null =
        null;

      if (primaryImage?.storage_path) {
        const { data: imageData } =
          supabase.storage
            .from("product-images")
            .getPublicUrl(
              primaryImage.storage_path
            );

        imageUrl =
          imageData.publicUrl;
      }

      const variantPrices =
        activeVariants
          .map((variant) =>
            variant.price === null
              ? null
              : Number(variant.price)
          )
          .filter(
            (
              value
            ): value is number =>
              value !== null
          );

      const hasPrice =
        product.base_price !== null ||
        variantPrices.length > 0;

      const warnings: string[] = [];

      if (!primaryImage) {
        warnings.push("No image");
      }

      if (!hasPrice) {
        warnings.push("No price");
      }

      if (
        (product.made_to_order ||
          product.customizable) &&
        product.lead_time_days === null
      ) {
        warnings.push(
          "No lead time"
        );
      }

      if (soldOut) {
        warnings.push(
          "Inventory is zero"
        );
      }

      return {
        ...product,
        activeVariants,
        hasVariantInventory,
        tracksInventory,
        inventoryQuantity,
        soldOut,
        lowStock,
        imageUrl,
        warnings,
      };
    });

  const collections = Array.from(
    new Set(
      allProducts
        .map(
          (product) =>
            product.collection
        )
        .filter(
          (
            value
          ): value is string =>
            Boolean(value)
        )
    )
  ).sort((a, b) =>
    a.localeCompare(b)
  );

  const totalCount =
    allProducts.length;

  const publishedCount =
    allProducts.filter(
      (product) =>
        product.status ===
        "published"
    ).length;

  const draftCount =
    allProducts.filter(
      (product) =>
        product.status === "draft"
    ).length;

  const lowStockCount =
    allProducts.filter(
      (product) =>
        product.lowStock
    ).length;

  const soldOutCount =
    allProducts.filter(
      (product) =>
        product.soldOut ||
        product.status ===
          "sold_out"
    ).length;

  let products =
    allProducts.filter(
      (product) => {
        if (search) {
          const haystack = [
            product.name,
            product.slug,
            product.collection,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          if (
            !haystack.includes(
              search.toLowerCase()
            )
          ) {
            return false;
          }
        }

        if (
          category &&
          product.category !==
            category
        ) {
          return false;
        }

        if (
          collection &&
          product.collection !==
            collection
        ) {
          return false;
        }

        if (
          status &&
          product.status !== status
        ) {
          return false;
        }

        if (inventory) {
          switch (inventory) {
            case "low":
              if (!product.lowStock) {
                return false;
              }
              break;

            case "out":
              if (
                !product.soldOut &&
                product.status !==
                  "sold_out"
              ) {
                return false;
              }
              break;

            case "tracked":
              if (
                !product.tracksInventory
              ) {
                return false;
              }
              break;

            case "not-tracked":
              if (
                product.tracksInventory
              ) {
                return false;
              }
              break;

            case "issues":
              if (
                product.warnings
                  .length === 0
              ) {
                return false;
              }
              break;
          }
        }

        return true;
      }
    );

  products = [...products].sort(
    (a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(
            b.name
          );

        case "name-desc":
          return b.name.localeCompare(
            a.name
          );

        case "price-asc":
          return (
            Number(
              a.base_price ??
                Number.MAX_SAFE_INTEGER
            ) -
            Number(
              b.base_price ??
                Number.MAX_SAFE_INTEGER
            )
          );

        case "price-desc":
          return (
            Number(
              b.base_price ?? -1
            ) -
            Number(
              a.base_price ?? -1
            )
          );

        case "inventory-asc":
          return (
            Number(
              a.inventoryQuantity ??
                Number.MAX_SAFE_INTEGER
            ) -
            Number(
              b.inventoryQuantity ??
                Number.MAX_SAFE_INTEGER
            )
          );

        case "inventory-desc":
          return (
            Number(
              b.inventoryQuantity ?? -1
            ) -
            Number(
              a.inventoryQuantity ?? -1
            )
          );

        case "updated-asc":
          return (
            new Date(
              a.updated_at
            ).getTime() -
            new Date(
              b.updated_at
            ).getTime()
          );

        case "updated-desc":
        default:
          return (
            new Date(
              b.updated_at
            ).getTime() -
            new Date(
              a.updated_at
            ).getTime()
          );
      }
    }
  );

  const hasFilters = Boolean(
    search ||
      category ||
      collection ||
      status ||
      inventory
  );

  function buildViewHref(
    nextView: "table" | "cards"
  ) {
    const next =
      new URLSearchParams();

    if (search) {
      next.set("search", search);
    }

    if (category) {
      next.set(
        "category",
        category
      );
    }

    if (collection) {
      next.set(
        "collection",
        collection
      );
    }

    if (status) {
      next.set("status", status);
    }

    if (inventory) {
      next.set(
        "inventory",
        inventory
      );
    }

    if (sort) {
      next.set("sort", sort);
    }

    next.set("view", nextView);

    return `/admin/products?${next.toString()}`;
  }

  return (
    <main className="min-h-screen bg-transparent px-5 py-6 text-[#284239] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          eyebrow="Catalog Management"
          title="Product Catalog"
          description="Manage storefront visibility, pricing, inventory, preparation time, and overall catalog health."
          actions={
            <Link
              href="/admin/products/new"
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#e76d61] px-5 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
            >
              + Add Product
            </Link>
          }
        />

        {bulkError && (
          <section className="mt-5 rounded-xl border border-[#d79b58]/25 bg-[#fff5e8] p-4">
            <p className="font-semibold text-[#8a5b28]">
              Bulk action could not be completed
            </p>

            <p className="mt-2 text-sm leading-6 text-[#775d2f]">
              {bulkError}
            </p>

            <Link
              href="/admin/products"
              className="mt-3 inline-flex text-sm font-semibold text-[#a36b2c] transition hover:text-[#e76d61]"
            >
              Dismiss
            </Link>
          </section>
        )}

        <section className="mt-5 overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
          <div className="grid grid-cols-2 divide-x divide-y divide-[#284239]/10 lg:grid-cols-5 lg:divide-y-0">
            <div className="px-4 py-4 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Total Products
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {totalCount}
              </p>
            </div>

            <div className="px-4 py-4 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Published
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#31583b]">
                {publishedCount}
              </p>
            </div>

            <div className="px-4 py-4 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Drafts
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#775d2f]">
                {draftCount}
              </p>
            </div>

            <Link
              href="/admin/products?inventory=low"
              className="px-4 py-4 transition hover:bg-[#faf7f1] sm:px-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Low Stock
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#b36a32]">
                {lowStockCount}
              </p>
            </Link>

            <Link
              href="/admin/products?inventory=out"
              className="px-4 py-4 transition hover:bg-[#faf7f1] sm:px-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Sold Out
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#a7473f]">
                {soldOutCount}
              </p>
            </Link>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-[#284239]/10 bg-white p-4 shadow-[0_1px_3px_rgba(21,63,50,0.05)] sm:p-5">
          <form
            method="GET"
            className="grid gap-3"
          >
            <input
              type="hidden"
              name="view"
              value={view}
            />

            <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr]">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#607068]">
                  Search Catalog
                </span>

                <input
                  type="search"
                  name="search"
                  defaultValue={search}
                  placeholder="Product name, slug, or collection..."
                  className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-4 outline-none transition focus:border-[#e76d61]"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#607068]">
                  Category
                </span>

                <select
                  name="category"
                  defaultValue={category}
                  className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-4 outline-none transition focus:border-[#e76d61]"
                >
                  <option value="">
                    All Categories
                  </option>
                  <option value="flowers">
                    Fresh Flowers
                  </option>
                  <option value="candles">
                    Candles
                  </option>
                  <option value="custom">
                    Custom Items
                  </option>
                  <option value="shirts">
                    Shirts
                  </option>
                  <option value="gators">
                    Gator Gear
                  </option>
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#607068]">
                  Collection
                </span>

                <select
                  name="collection"
                  defaultValue={
                    collection
                  }
                  className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-4 outline-none transition focus:border-[#e76d61]"
                >
                  <option value="">
                    All Collections
                  </option>

                  {collections.map(
                    (value) => (
                      <option
                        key={value}
                        value={value}
                      >
                        {value}
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#607068]">
                  Status
                </span>

                <select
                  name="status"
                  defaultValue={status}
                  className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-4 outline-none transition focus:border-[#e76d61]"
                >
                  <option value="">
                    All Statuses
                  </option>
                  <option value="published">
                    Published
                  </option>
                  <option value="draft">
                    Draft
                  </option>
                  <option value="hidden">
                    Hidden
                  </option>
                  <option value="sold_out">
                    Sold Out
                  </option>
                  <option value="archived">
                    Archived
                  </option>
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#607068]">
                  Inventory
                </span>

                <select
                  name="inventory"
                  defaultValue={
                    inventory
                  }
                  className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-4 outline-none transition focus:border-[#e76d61]"
                >
                  <option value="">
                    All Inventory
                  </option>
                  <option value="low">
                    Low Stock
                  </option>
                  <option value="out">
                    Sold Out
                  </option>
                  <option value="tracked">
                    Inventory Tracked
                  </option>
                  <option value="not-tracked">
                    Not Tracked
                  </option>
                  <option value="issues">
                    Catalog Warnings
                  </option>
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#607068]">
                  Sort By
                </span>

                <select
                  name="sort"
                  defaultValue={sort}
                  className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-4 outline-none transition focus:border-[#e76d61]"
                >
                  <option value="updated-desc">
                    Recently Updated
                  </option>
                  <option value="updated-asc">
                    Oldest Updated
                  </option>
                  <option value="name-asc">
                    Name A–Z
                  </option>
                  <option value="name-desc">
                    Name Z–A
                  </option>
                  <option value="price-asc">
                    Price Low–High
                  </option>
                  <option value="price-desc">
                    Price High–Low
                  </option>
                  <option value="inventory-asc">
                    Inventory Low–High
                  </option>
                  <option value="inventory-desc">
                    Inventory High–Low
                  </option>
                </select>
              </label>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#284239] px-5 text-sm font-semibold text-white transition hover:bg-[#1d332b]"
                >
                  Apply
                </button>

                {hasFilters && (
                  <Link
                    href={`/admin/products?view=${view}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#284239]/15 bg-white px-4 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                  >
                    Clear
                  </Link>
                )}
              </div>
            </div>
          </form>
        </section>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#607068]">
            Showing{" "}
            <span className="font-semibold text-[#153f32]">
              {products.length}
            </span>{" "}
            {products.length === 1
              ? "product"
              : "products"}
            {hasFilters
              ? " matching your filters"
              : ""}
          </p>

          <div className="flex rounded-lg border border-[#284239]/10 bg-white p-1 shadow-sm">
            <Link
              href={buildViewHref(
                "table"
              )}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                view === "table"
                  ? "bg-[#284239] text-white"
                  : "text-[#607068] hover:text-[#153f32]"
              }`}
            >
              Table
            </Link>

            <Link
              href={buildViewHref(
                "cards"
              )}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                view === "cards"
                  ? "bg-[#284239] text-white"
                  : "text-[#607068] hover:text-[#153f32]"
              }`}
            >
              Cards
            </Link>
          </div>
        </div>

        <form
          id="bulk-product-form"
          action={bulkUpdateProducts}
        />

        <BulkCatalogControls
          productIds={products.map(
            (product) => product.id
          )}
        />

        {products.length === 0 ? (
          <section className="mt-5 rounded-2xl border border-[#284239]/10 bg-white p-10 text-center shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
            <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
              No matching products
            </h2>

            <p className="mt-3 text-[#607068]">
              Try changing or clearing
              the current catalog
              filters.
            </p>

            <Link
              href="/admin/products"
              className="mt-6 inline-flex rounded-xl border border-[#284239]/15 bg-white px-6 py-3 font-semibold text-[#284239]"
            >
              Clear Filters
            </Link>
          </section>
        ) : view === "cards" ? (
          <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map(
              (product) => {
                const storefrontPath =
                  getProductPath(
                    product.category,
                    product.slug
                  );

                return (
                  <article
                    key={product.id}
                    className="relative overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-[0_1px_3px_rgba(21,63,50,0.05)]"
                  >
                    <label className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-[#284239]/15 bg-white shadow-sm">
                      <input
                        type="checkbox"
                        form="bulk-product-form"
                        name="product_ids"
                        value={product.id}
                        data-product-selector="true"
                        className="h-4 w-4"
                        aria-label={`Select ${product.name}`}
                      />
                    </label>

                    <div
                      className="h-48 bg-[#f3eee6] bg-contain bg-center bg-no-repeat"
                      style={
                        product.imageUrl
                          ? {
                              backgroundImage: `url("${product.imageUrl}")`,
                            }
                          : undefined
                      }
                    >
                      {!product.imageUrl && (
                        <div className="flex h-full items-center justify-center px-5 text-center text-sm font-semibold text-[#8a978f]">
                          No product image
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#e76d61]">
                            {categoryLabels[
                              product.category
                            ] ??
                              product.category}
                          </p>

                          <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
                            {product.name}
                          </h2>

                          <p className="mt-1 text-xs text-[#718078]">
                            {product.collection}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses(
                            product.status
                          )}`}
                        >
                          {statusLabels[
                            product.status
                          ] ??
                            product.status}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-[#faf7f1] p-4 text-sm">
                        <div>
                          <p className="text-xs text-[#718078]">
                            Price
                          </p>
                          <p className="mt-1 font-semibold text-[#153f32]">
                            {formatPrice(
                              product.base_price
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-[#718078]">
                            Lead Time
                          </p>
                          <p className="mt-1 font-semibold text-[#153f32]">
                            {product.lead_time_days !==
                            null
                              ? `${product.lead_time_days} day${
                                  product.lead_time_days ===
                                  1
                                    ? ""
                                    : "s"
                                }`
                              : "None"}
                          </p>
                        </div>

                        <div className="col-span-2">
                          <p className="text-xs text-[#718078]">
                            Inventory
                          </p>

                          <p
                            className={`mt-1 font-semibold ${
                              product.soldOut
                                ? "text-[#a7473f]"
                                : product.lowStock
                                  ? "text-[#b36a32]"
                                  : "text-[#153f32]"
                            }`}
                          >
                            {!product.tracksInventory
                              ? "Not tracked"
                              : product.inventoryQuantity ===
                                  null
                                ? "Tracked"
                                : `${product.inventoryQuantity} available`}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {product.featured && (
                          <span className="rounded-full bg-[#f3d8d2] px-2.5 py-1 text-[11px] font-semibold text-[#b94f45]">
                            Featured
                          </span>
                        )}

                        {product.ready_made && (
                          <span className="rounded-full bg-[#edf1f6] px-2.5 py-1 text-[11px] font-semibold text-[#536578]">
                            Ready-Made
                          </span>
                        )}

                        {product.made_to_order && (
                          <span className="rounded-full bg-[#edf3e7] px-2.5 py-1 text-[11px] font-semibold text-[#36594c]">
                            Made to Order
                          </span>
                        )}

                        {product.customizable && (
                          <span className="rounded-full bg-[#f8e1dc] px-2.5 py-1 text-[11px] font-semibold text-[#b9564c]">
                            Customizable
                          </span>
                        )}
                      </div>

                      {product.warnings.length >
                        0 && (
                        <div className="mt-4 rounded-xl border border-[#d79b58]/20 bg-[#fff5e8] p-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9a642b]">
                            Catalog Warning
                          </p>

                          <p className="mt-1 text-sm text-[#775d2f]">
                            {product.warnings.join(
                              " • "
                            )}
                          </p>
                        </div>
                      )}

                      <p className="mt-4 text-xs text-[#8a978f]">
                        Updated{" "}
                        {formatDate(
                          product.updated_at
                        )}
                      </p>

                      <div className="mt-5 flex gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[#284239] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d332b]"
                        >
                          Edit
                        </Link>

                        {storefrontPath &&
                          product.status ===
                            "published" && (
                            <Link
                              href={
                                storefrontPath
                              }
                              target="_blank"
                              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-[#284239]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                            >
                              View
                            </Link>
                          )}
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </section>
        ) : (
          <section className="mt-5 overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
            <div className="overflow-x-auto overscroll-x-contain">
              <table className="w-full min-w-[1100px] text-left">
                <thead className="border-b border-[#284239]/10 bg-[#f5f7f4]">
                  <tr className="text-xs uppercase tracking-[0.12em] text-[#718078]">
                    <th className="w-12 px-5 py-4 font-semibold">
                      Select
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Product
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Category
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Price
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Lead Time
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Inventory
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Status
                    </th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#284239]/10">
                  {products.map(
                    (product) => {
                      const storefrontPath =
                        getProductPath(
                          product.category,
                          product.slug
                        );

                      return (
                        <tr
                          key={product.id}
                          className="align-middle transition hover:bg-[#fffdf9]"
                        >
                          <td className="px-5 py-4">
                            <input
                              type="checkbox"
                              form="bulk-product-form"
                              name="product_ids"
                              value={product.id}
                              data-product-selector="true"
                              className="h-4 w-4"
                              aria-label={`Select ${product.name}`}
                            />
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex min-w-[280px] items-center gap-4">
                              <div
                                className="h-16 w-16 shrink-0 rounded-xl border border-[#284239]/10 bg-[#f3eee6] bg-contain bg-center bg-no-repeat"
                                style={
                                  product.imageUrl
                                    ? {
                                        backgroundImage: `url("${product.imageUrl}")`,
                                      }
                                    : undefined
                                }
                              />

                              <div>
                                <p className="font-semibold text-[#153f32]">
                                  {
                                    product.name
                                  }
                                </p>

                                <p className="mt-1 text-xs text-[#718078]">
                                  {
                                    product.collection
                                  }
                                </p>

                                {product.warnings
                                  .length >
                                  0 && (
                                  <p className="mt-1 text-xs font-semibold text-[#a36b2c]">
                                    ⚠{" "}
                                    {product.warnings.join(
                                      " • "
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-[#52655d]">
                            {categoryLabels[
                              product.category
                            ] ??
                              product.category}
                          </td>

                          <td className="px-5 py-4 font-semibold text-[#153f32]">
                            {formatPrice(
                              product.base_price
                            )}
                          </td>

                          <td className="px-5 py-4 text-sm">
                            {product.lead_time_days !==
                            null
                              ? `${product.lead_time_days} day${
                                  product.lead_time_days ===
                                  1
                                    ? ""
                                    : "s"
                                }`
                              : "—"}
                          </td>

                          <td className="px-5 py-4">
                            <p
                              className={`text-sm font-semibold ${
                                product.soldOut
                                  ? "text-[#a7473f]"
                                  : product.lowStock
                                    ? "text-[#b36a32]"
                                    : "text-[#153f32]"
                              }`}
                            >
                              {!product.tracksInventory
                                ? "Not tracked"
                                : product.inventoryQuantity ===
                                    null
                                  ? "Tracked"
                                  : `${product.inventoryQuantity} available`}
                            </p>

                            {product.hasVariantInventory && (
                              <p className="mt-1 text-xs text-[#718078]">
                                Variant inventory
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses(
                                product.status
                              )}`}
                            >
                              {statusLabels[
                                product.status
                              ] ??
                                product.status}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              {storefrontPath &&
                                product.status ===
                                  "published" && (
                                  <Link
                                    href={
                                      storefrontPath
                                    }
                                    target="_blank"
                                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#284239]/15 bg-white px-4 py-2 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                                  >
                                    View
                                  </Link>
                                )}

                              <Link
                                href={`/admin/products/${product.id}/edit`}
                                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#284239] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1d332b]"
                              >
                                Edit
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
