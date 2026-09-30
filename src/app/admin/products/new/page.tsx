import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createProduct } from "./actions";

export default async function NewProductPage() {
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

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-5 py-10 text-[#284239] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/products"
          className="text-sm font-semibold text-[#607068] transition hover:text-[#e76d61]"
        >
          ← Back to Products
        </Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
          Port Petals Admin
        </p>

        <h1 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
          Add Product
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-[#607068]">
          Add a new product to the Port Petals catalog. You can save it as
          a draft or publish it immediately.
        </p>

        <form
          action={createProduct}
          className="mt-8 space-y-6 rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-8"
        >
          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
              Product Information
            </h2>

            <div className="mt-5 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Product Name *
                </span>

                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Example: Christmas Highland Cow Tee"
                  className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">
                    Category *
                  </span>

                  <select
                    name="category"
                    required
                    defaultValue=""
                    className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none focus:border-[#e76d61]"
                  >
                    <option value="" disabled>
                      Choose category
                    </option>
                    <option value="flowers">Fresh Flowers</option>
                    <option value="candles">Candles</option>
                    <option value="custom">Custom Items</option>
                    <option value="shirts">Shirts</option>
                    <option value="gators">Gator Gear</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold">
                    Collection *
                  </span>

                  <input
                    type="text"
                    name="collection"
                    required
                    placeholder="Example: seasonal-screen-print"
                    className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                  />

                  <span className="text-xs text-[#718078]">
                    Use a short identifier such as seasonal-screen-print,
                    bouquets, or ready-made-tie-dye.
                  </span>
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Short Description
                </span>

                <input
                  type="text"
                  name="short_description"
                  placeholder="Short description shown on product cards"
                  className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Full Description
                </span>

                <textarea
                  name="description"
                  rows={5}
                  placeholder="Describe the product..."
                  className="resize-y rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>
            </div>
          </section>

          <section className="border-t border-[#284239]/10 pt-6">
            <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
              Pricing & Inventory
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Base Price
                </span>

                <div className="flex overflow-hidden rounded-xl border border-[#284239]/15 bg-white focus-within:border-[#e76d61]">
                  <span className="flex items-center border-r border-[#284239]/10 px-4 text-[#718078]">
                    $
                  </span>

                  <input
                    type="number"
                    name="base_price"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="min-w-0 flex-1 px-4 py-3 outline-none"
                  />
                </div>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Quantity
                </span>

                <input
                  type="number"
                  name="quantity"
                  min="0"
                  step="1"
                  placeholder="0"
                  className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Lead Time
                </span>

                <div className="flex overflow-hidden rounded-xl border border-[#284239]/15 bg-white focus-within:border-[#e76d61]">
                  <input
                    type="number"
                    name="lead_time_days"
                    min="0"
                    step="1"
                    placeholder="7"
                    className="min-w-0 flex-1 px-4 py-3 outline-none"
                  />

                  <span className="flex items-center border-l border-[#284239]/10 px-4 text-sm text-[#718078]">
                    days
                  </span>
                </div>
              </label>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[#284239]/10 p-4">
                <input
                  type="checkbox"
                  name="track_inventory"
                  className="h-4 w-4"
                />

                <span>
                  <span className="block text-sm font-semibold">
                    Track Inventory
                  </span>

                  <span className="block text-xs text-[#718078]">
                    Keep count of available stock.
                  </span>
                </span>
              </label>

              <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[#284239]/10 p-4">
                <input
                  type="checkbox"
                  name="ready_made"
                  className="h-4 w-4"
                />

                <span>
                  <span className="block text-sm font-semibold">
                    Ready-Made
                  </span>

                  <span className="block text-xs text-[#718078]">
                    Item already exists and is available to purchase.
                  </span>
                </span>
              </label>

              <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[#284239]/10 p-4">
                <input
                  type="checkbox"
                  name="made_to_order"
                  className="h-4 w-4"
                />

                <span>
                  <span className="block text-sm font-semibold">
                    Made to Order
                  </span>

                  <span className="block text-xs text-[#718078]">
                    Product is created after the order is requested.
                  </span>
                </span>
              </label>

              <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[#284239]/10 p-4">
                <input
                  type="checkbox"
                  name="customizable"
                  className="h-4 w-4"
                />

                <span>
                  <span className="block text-sm font-semibold">
                    Customizable
                  </span>

                  <span className="block text-xs text-[#718078]">
                    Customer can request personalization or options.
                  </span>
                </span>
              </label>

              <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[#284239]/10 p-4">
                <input
                  type="checkbox"
                  name="featured"
                  className="h-4 w-4"
                />

                <span>
                  <span className="block text-sm font-semibold">
                    Featured Product
                  </span>

                  <span className="block text-xs text-[#718078]">
                    Highlight this item in the storefront.
                  </span>
                </span>
              </label>
            </div>
          </section>

          <section className="border-t border-[#284239]/10 pt-6">
            <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
              Maker & Fulfillment
            </h2>

            <div className="mt-5 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Maker
                </span>

                <input
                  type="text"
                  name="maker"
                  placeholder="Example: Teal Vanocker"
                  className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[#284239]/10 p-4">
                  <input
                    type="checkbox"
                    name="pickup_available"
                    defaultChecked
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-semibold">
                    Pickup Available
                  </span>
                </label>

                <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[#284239]/10 p-4">
                  <input
                    type="checkbox"
                    name="delivery_available"
                    defaultChecked
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-semibold">
                    Local Delivery Available
                  </span>
                </label>
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-[#284239]/10 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/admin/products"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#284239]/15 bg-white px-6 py-3 font-semibold text-[#284239]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              name="intent"
              value="draft"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#284239]/15 bg-[#f7f1e8] px-6 py-3 font-semibold text-[#284239]"
            >
              Save Draft
            </button>

            <button
              type="submit"
              name="intent"
              value="publish"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
            >
              Publish Product
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
