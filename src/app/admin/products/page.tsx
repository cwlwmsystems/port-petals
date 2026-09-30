import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type AdminProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
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

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const status = params.status?.trim() ?? "";

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

  let query = supabase
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
      track_inventory,
      quantity,
      updated_at,
      product_variants (
        id,
        quantity,
        track_inventory,
        active
      )
    `)
    .order("updated_at", { ascending: false });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data: products, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const hasFilters = Boolean(search || category || status);

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-5 py-10 text-[#284239] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-semibold text-[#607068] transition hover:text-[#e76d61]"
            >
              ← Back to Dashboard
            </Link>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
              Port Petals Admin
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
              Products
            </h1>

            <p className="mt-3 max-w-2xl text-[#607068]">
              Manage storefront products, pricing, inventory, variants, and
              publication status.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#e76d61] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#d85b50]"
          >
            Add Product
          </Link>
        </div>

        <section className="mt-8 rounded-[1.75rem] border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-6">
          <form
            method="GET"
            className="grid gap-4 md:grid-cols-[1fr_220px_220px_auto]"
          >
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Search Products
              </span>

              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Search by product name..."
                className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 outline-none transition focus:border-[#e76d61]"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Category
              </span>

              <select
                name="category"
                defaultValue={category}
                className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 outline-none transition focus:border-[#e76d61]"
              >
                <option value="">All Categories</option>
                <option value="flowers">Fresh Flowers</option>
                <option value="candles">Candles</option>
                <option value="custom">Custom Items</option>
                <option value="shirts">Shirts</option>
                <option value="gators">Gator Gear</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Status
              </span>

              <select
                name="status"
                defaultValue={status}
                className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 outline-none transition focus:border-[#e76d61]"
              >
                <option value="">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="hidden">Hidden</option>
                <option value="sold_out">Sold Out</option>
                <option value="archived">Archived</option>
              </select>
            </label>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-[#284239] px-5 py-3 font-semibold text-white transition hover:bg-[#1d332b]"
              >
                Apply
              </button>

              {hasFilters && (
                <Link
                  href="/admin/products"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#284239]/15 bg-white px-4 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                >
                  Clear
                </Link>
              )}
            </div>
          </form>
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#607068]">
            <span className="font-semibold text-[#153f32]">
              {products?.length ?? 0}
            </span>{" "}
            {(products?.length ?? 0) === 1 ? "product" : "products"}
            {hasFilters ? " matching your filters" : ""}
          </p>

          {hasFilters && (
            <p className="text-xs text-[#718078]">
              Filters are saved in the page URL.
            </p>
          )}
        </div>

        {!products || products.length === 0 ? (
          <section className="mt-6 rounded-[1.75rem] border border-[#284239]/10 bg-white p-10 text-center shadow-sm">
            <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
              {hasFilters
                ? "No matching products"
                : "No products yet"}
            </h2>

            <p className="mt-3 text-[#607068]">
              {hasFilters
                ? "Try changing or clearing the current filters."
                : "Add the first product to begin building the storefront catalog."}
            </p>

            {hasFilters ? (
              <Link
                href="/admin/products"
                className="mt-6 inline-flex rounded-xl border border-[#284239]/15 bg-white px-6 py-3 font-semibold text-[#284239]"
              >
                Clear Filters
              </Link>
            ) : (
              <Link
                href="/admin/products/new"
                className="mt-6 inline-flex rounded-xl bg-[#e76d61] px-6 py-3 font-semibold text-white"
              >
                Add Product
              </Link>
            )}
          </section>
        ) : (
          <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-[#284239]/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-[#284239]/10 bg-[#faf7f1]">
                  <tr className="text-xs uppercase tracking-[0.12em] text-[#718078]">
                    <th className="px-6 py-4 font-semibold">
                      Product
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Category
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Price
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Inventory
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#284239]/10">
                  {products.map((product) => {
                    const activeTrackedVariants =
                      product.product_variants?.filter(
                        (variant) =>
                          variant.active &&
                          variant.track_inventory
                      ) ?? [];

                    const hasVariantInventory =
                      activeTrackedVariants.length > 0;

                    const variantQuantity =
                      activeTrackedVariants.reduce(
                        (total, variant) =>
                          total + (variant.quantity ?? 0),
                        0
                      );

                    let inventoryText = "Not tracked";

                    if (hasVariantInventory) {
                      inventoryText = `${variantQuantity} across ${
                        activeTrackedVariants.length
                      } ${
                        activeTrackedVariants.length === 1
                          ? "variant"
                          : "variants"
                      }`;
                    } else if (
                      product.track_inventory &&
                      product.quantity !== null
                    ) {
                      inventoryText = `${product.quantity} available`;
                    }

                    return (
                      <tr
                        key={product.id}
                        className="align-top transition hover:bg-[#fffdf9]"
                      >
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-semibold text-[#153f32]">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-[#718078]">
                              {product.collection}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-1.5">
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
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-[#52655d]">
                          {categoryLabels[product.category] ??
                            product.category}
                        </td>

                        <td className="px-6 py-5">
                          <span className="font-semibold text-[#153f32]">
                            {formatPrice(product.base_price)}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold text-[#153f32]">
                            {inventoryText}
                          </p>

                          {hasVariantInventory && (
                            <p className="mt-1 text-xs text-[#718078]">
                              Variant inventory
                            </p>
                          )}

                          {!hasVariantInventory &&
                            product.track_inventory && (
                              <p className="mt-1 text-xs text-[#718078]">
                                Product inventory
                              </p>
                            )}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses(
                              product.status
                            )}`}
                          >
                            {statusLabels[product.status] ??
                              product.status}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#284239]/15 bg-white px-4 py-2 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
