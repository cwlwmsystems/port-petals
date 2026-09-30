import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ProductRow = {
  id: string;
  name: string;
  category: string;
  collection: string;
  base_price: number | null;
  status: string;
  featured: boolean;
  track_inventory: boolean;
  quantity: number | null;
  made_to_order: boolean;
  ready_made: boolean;
  updated_at: string;
};

function formatPrice(price: number | null) {
  if (price === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function formatCategory(category: string) {
  const labels: Record<string, string> = {
    flowers: "Fresh Flowers",
    candles: "Candles",
    custom: "Custom Items",
    shirts: "Shirts",
    gators: "Gator Gear",
  };

  return labels[category] ?? category;
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClasses(status: string) {
  switch (status) {
    case "published":
      return "bg-[#e6f2e3] text-[#31583b]";
    case "draft":
      return "bg-[#f2eadb] text-[#735f43]";
    case "hidden":
      return "bg-[#ecebea] text-[#595c5a]";
    case "sold_out":
      return "bg-[#f7dfdb] text-[#9a4941]";
    case "archived":
      return "bg-[#e5e5e5] text-[#666]";
    default:
      return "bg-[#eeeeee] text-[#555]";
  }
}

export default async function AdminProductsPage() {
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

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      category,
      collection,
      base_price,
      status,
      featured,
      track_inventory,
      quantity,
      made_to_order,
      ready_made,
      updated_at
    `)
    .order("updated_at", { ascending: false });

  const products = (data ?? []) as ProductRow[];

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-5 py-10 text-[#284239] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
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

            <p className="mt-3 max-w-2xl leading-7 text-[#607068]">
              Manage storefront products, availability, pricing, inventory,
              and publishing status.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
          >
            + Add Product
          </Link>
        </div>

        <section className="mt-8 rounded-[1.5rem] border border-[#284239]/10 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Search
              </span>

              <input
                type="search"
                placeholder="Search products..."
                disabled
                className="rounded-xl border border-[#284239]/15 bg-[#f8f6f2] px-4 py-3 text-[#718078]"
              />

              <span className="text-xs text-[#8a948e]">
                Search and filters will be activated after the core product
                actions are connected.
              </span>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Category
              </span>

              <select
                disabled
                className="min-w-44 rounded-xl border border-[#284239]/15 bg-[#f8f6f2] px-4 py-3 text-[#718078]"
              >
                <option>All Categories</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Status
              </span>

              <select
                disabled
                className="min-w-40 rounded-xl border border-[#284239]/15 bg-[#f8f6f2] px-4 py-3 text-[#718078]"
              >
                <option>All Statuses</option>
              </select>
            </label>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-[1.5rem] border border-[#284239]/10 bg-white shadow-sm">
          {error ? (
            <div className="p-6">
              <p className="font-semibold text-[#a7473f]">
                Could not load products.
              </p>

              <p className="mt-2 text-sm text-[#607068]">
                {error.message}
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-serif text-3xl font-semibold text-[#153f32]">
                No products yet
              </p>

              <p className="mx-auto mt-3 max-w-lg leading-7 text-[#607068]">
                Your Supabase catalog is empty. Add the first product to
                begin managing inventory through the owner dashboard.
              </p>

              <Link
                href="/admin/products/new"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
              >
                Add First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-[#284239]/10 bg-[#faf7f1]">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                      Product
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                      Category
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                      Price
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                      Inventory
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#284239]/10">
                  {products.map((product) => (
                    <tr key={product.id} className="align-top">
                      <td className="px-5 py-5">
                        <div>
                          <p className="font-semibold text-[#153f32]">
                            {product.name}
                          </p>

                          <p className="mt-1 text-sm text-[#718078]">
                            {product.collection}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {product.featured && (
                              <span className="rounded-full bg-[#fff0ed] px-2.5 py-1 text-xs font-semibold text-[#b9564c]">
                                Featured
                              </span>
                            )}

                            {product.ready_made && (
                              <span className="rounded-full bg-[#edf1f6] px-2.5 py-1 text-xs font-semibold text-[#536578]">
                                Ready-Made
                              </span>
                            )}

                            {product.made_to_order && (
                              <span className="rounded-full bg-[#edf3e7] px-2.5 py-1 text-xs font-semibold text-[#36594c]">
                                Made to Order
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5 text-sm text-[#52655d]">
                        {formatCategory(product.category)}
                      </td>

                      <td className="px-5 py-5 font-semibold text-[#153f32]">
                        {formatPrice(product.base_price)}
                      </td>

                      <td className="px-5 py-5 text-sm text-[#52655d]">
                        {product.track_inventory
                          ? `${product.quantity ?? 0} in stock`
                          : "Not tracked"}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                            product.status
                          )}`}
                        >
                          {formatStatus(product.status)}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="inline-flex items-center justify-center rounded-lg border border-[#284239]/15 bg-white px-4 py-2 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
