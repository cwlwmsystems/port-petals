import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { setProductStatus, updateProduct } from "./actions";
import {
  deleteProductImage,
  setPrimaryProductImage,
  uploadProductImage,
} from "./image-actions";
import {
  createVariant,
  deleteVariant,
  setVariantActive,
  updateVariant,
} from "./variant-actions";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

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

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !product) {
    notFound();
  }

  const { data: productImages } = await supabase
    .from("product_images")
    .select("id, storage_path, alt_text, sort_order, is_primary")
    .eq("product_id", id)
    .order("sort_order", { ascending: true });

  const images =
    productImages?.map((image) => {
      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(image.storage_path);

      return {
        ...image,
        publicUrl: data.publicUrl,
      };
    }) ?? [];

  const { data: productVariants } = await supabase
    .from("product_variants")
    .select(`
      id,
      name,
      sku,
      size,
      color,
      price,
      track_inventory,
      quantity,
      active
    `)
    .eq("product_id", id)
    .order("created_at", { ascending: true });

  const variants = productVariants ?? [];

  const hasVariants = variants.length > 0;

  const trackedVariants = variants.filter(
    (variant) =>
      variant.active &&
      variant.track_inventory
  );

  const trackedVariantQuantity = trackedVariants.reduce(
    (total, variant) => total + (variant.quantity ?? 0),
    0
  );

  const updateAction = updateProduct.bind(null, id);

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
          Edit Product
        </h1>

        <p className="mt-3 text-[#607068]">
          Update product details, availability, inventory, and storefront status.
        </p>

        <form
          action={updateAction}
          className="mt-8 space-y-6 rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-8"
        >
          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
              Product Information
            </h2>

            <div className="mt-5 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">Product Name *</span>

                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={product.name}
                  className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">Category *</span>

                  <select
                    name="category"
                    required
                    defaultValue={product.category}
                    className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none focus:border-[#e76d61]"
                  >
                    <option value="flowers">Fresh Flowers</option>
                    <option value="candles">Candles</option>
                    <option value="custom">Custom Items</option>
                    <option value="shirts">Shirts</option>
                    <option value="gators">Gator Gear</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold">Collection *</span>

                  <input
                    type="text"
                    name="collection"
                    required
                    defaultValue={product.collection}
                    className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Short Description
                </span>

                <input
                  type="text"
                  name="short_description"
                  defaultValue={product.short_description ?? ""}
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
                  defaultValue={product.description ?? ""}
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
                <span className="text-sm font-semibold">Base Price</span>

                <input
                  type="number"
                  name="base_price"
                  min="0"
                  step="0.01"
                  defaultValue={product.base_price ?? ""}
                  className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>

              {hasVariants ? (
                <div className="grid gap-2">
                  <span className="text-sm font-semibold">
                    Variant Inventory
                  </span>

                  <div className="rounded-xl border border-[#284239]/10 bg-[#edf3e7] px-4 py-3">
                    <p className="font-semibold text-[#153f32]">
                      {trackedVariantQuantity} total available
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#607068]">
                      {trackedVariants.length} active inventory-tracked{" "}
                      {trackedVariants.length === 1
                        ? "variant"
                        : "variants"}
                    </p>
                  </div>

                  <input
                    type="hidden"
                    name="quantity"
                    value={product.quantity ?? ""}
                  />
                </div>
              ) : (
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">Quantity</span>

                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    step="1"
                    defaultValue={product.quantity ?? ""}
                    className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                  />
                </label>
              )}

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Lead Time</span>

                <input
                  type="number"
                  name="lead_time_days"
                  min="0"
                  step="1"
                  defaultValue={product.lead_time_days ?? ""}
                  className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {hasVariants ? (
                <div className="rounded-xl border border-[#284239]/10 bg-[#faf7f1] p-4">
                  <p className="text-sm font-semibold text-[#153f32]">
                    Inventory Mode: Variant Inventory
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#607068]">
                    Inventory is managed individually under Product Variants
                    below. The storefront uses the summed quantity of active
                    inventory-tracked variants.
                  </p>

                  {product.track_inventory && (
                    <input
                      type="hidden"
                      name="track_inventory"
                      value="on"
                    />
                  )}
                </div>
              ) : (
                <label className="flex items-center gap-3 rounded-xl border border-[#284239]/10 p-4">
                  <input
                    type="checkbox"
                    name="track_inventory"
                    defaultChecked={product.track_inventory}
                  />
                  <span className="text-sm font-semibold">
                    Track Inventory
                  </span>
                </label>
              )}

              <label className="flex items-center gap-3 rounded-xl border border-[#284239]/10 p-4">
                <input
                  type="checkbox"
                  name="ready_made"
                  defaultChecked={product.ready_made}
                />
                <span className="text-sm font-semibold">Ready-Made</span>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-[#284239]/10 p-4">
                <input
                  type="checkbox"
                  name="made_to_order"
                  defaultChecked={product.made_to_order}
                />
                <span className="text-sm font-semibold">Made to Order</span>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-[#284239]/10 p-4">
                <input
                  type="checkbox"
                  name="customizable"
                  defaultChecked={product.customizable}
                />
                <span className="text-sm font-semibold">Customizable</span>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-[#284239]/10 p-4">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={product.featured}
                />
                <span className="text-sm font-semibold">Featured Product</span>
              </label>
            </div>
          </section>

          <section className="border-t border-[#284239]/10 pt-6">
            <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
              Maker & Fulfillment
            </h2>

            <div className="mt-5 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">Maker</span>

                <input
                  type="text"
                  name="maker"
                  defaultValue={product.maker ?? ""}
                  className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-xl border border-[#284239]/10 p-4">
                  <input
                    type="checkbox"
                    name="pickup_available"
                    defaultChecked={product.pickup_available}
                  />
                  <span className="text-sm font-semibold">
                    Pickup Available
                  </span>
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-[#284239]/10 p-4">
                  <input
                    type="checkbox"
                    name="delivery_available"
                    defaultChecked={product.delivery_available}
                  />
                  <span className="text-sm font-semibold">
                    Local Delivery Available
                  </span>
                </label>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap justify-end gap-3 border-t border-[#284239]/10 pt-6">
            <Link
              href="/admin/products"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#284239]/15 bg-white px-6 py-3 font-semibold text-[#284239]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#e76d61] px-6 py-3 font-semibold text-white"
            >
              Save Changes
            </button>
          </div>
        </form>

        <section className="mt-6 rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Product Images
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#607068]">
                Upload JPEG, PNG, or WebP images up to 10 MB. The primary image
                will be used for the main storefront card.
              </p>
            </div>
          </div>

          <form
            action={uploadProductImage.bind(null, id)}
            className="mt-6 rounded-xl border border-dashed border-[#284239]/20 bg-[#faf7f1] p-5"
          >
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Upload Image
              </span>

              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                required
                className="block w-full rounded-xl border border-[#284239]/15 bg-white px-4 py-3 text-sm"
              />
            </label>

            <button
              type="submit"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#e76d61] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
            >
              Upload Image
            </button>
          </form>

          {images.length === 0 ? (
            <div className="mt-6 rounded-xl border border-[#284239]/10 bg-[#faf7f1] p-6 text-center">
              <p className="font-semibold text-[#153f32]">
                No product images yet
              </p>

              <p className="mt-2 text-sm text-[#718078]">
                Upload the first image to create the product&apos;s storefront
                photo.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <article
                  key={image.id}
                  className="overflow-hidden rounded-xl border border-[#284239]/10 bg-white"
                >
                  <div className="aspect-square overflow-hidden bg-[#f5efe6]">
                    <img
                      src={image.publicUrl}
                      alt={image.alt_text ?? product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    {image.is_primary ? (
                      <span className="inline-flex rounded-full bg-[#e6f2e3] px-3 py-1 text-xs font-semibold text-[#31583b]">
                        Primary Image
                      </span>
                    ) : (
                      <form
                        action={setPrimaryProductImage.bind(
                          null,
                          id,
                          image.id
                        )}
                      >
                        <button
                          type="submit"
                          className="text-sm font-semibold text-[#36594c] transition hover:text-[#e76d61]"
                        >
                          Make Primary
                        </button>
                      </form>
                    )}

                    <form
                      action={deleteProductImage.bind(null, id, image.id)}
                      className="mt-3"
                    >
                      <button
                        type="submit"
                        className="text-sm font-semibold text-[#a7473f]"
                      >
                        Delete Image
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
            Product Variants
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#607068]">
            Use variants for shirt sizes, flower arrangement sizes, candle
            options, colors, or any product choice that needs its own price or
            inventory.
          </p>

          <form
            action={createVariant.bind(null, id)}
            className="mt-6 rounded-xl border border-[#284239]/10 bg-[#faf7f1] p-5"
          >
            <p className="text-sm font-semibold text-[#153f32]">
              Add Variant
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">Name *</span>

                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Example: Large"
                  className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Size</span>

                <input
                  type="text"
                  name="size"
                  placeholder="Example: L"
                  className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Color</span>

                <input
                  type="text"
                  name="color"
                  placeholder="Example: Black"
                  className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">SKU</span>

                <input
                  type="text"
                  name="sku"
                  placeholder="Optional"
                  className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Price</span>

                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Quantity</span>

                <input
                  type="number"
                  name="quantity"
                  min="0"
                  step="1"
                  placeholder="0"
                  className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>
            </div>

            <label className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                name="track_inventory"
              />

              <span className="text-sm font-semibold">
                Track inventory for this variant
              </span>
            </label>

            <button
              type="submit"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#e76d61] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
            >
              Add Variant
            </button>
          </form>

          {variants.length === 0 ? (
            <div className="mt-6 rounded-xl border border-[#284239]/10 bg-[#faf7f1] p-6 text-center">
              <p className="font-semibold text-[#153f32]">
                No variants yet
              </p>

              <p className="mt-2 text-sm text-[#718078]">
                Add variants when a product has sizes, colors, pricing options,
                or separate inventory.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {variants.map((variant) => (
                <article
                  key={variant.id}
                  className="rounded-xl border border-[#284239]/10 bg-white p-5"
                >
                  <form
                    action={updateVariant.bind(null, id, variant.id)}
                  >
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <label className="grid gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#718078]">
                          Name
                        </span>

                        <input
                          type="text"
                          name="name"
                          required
                          defaultValue={variant.name}
                          className="rounded-lg border border-[#284239]/15 px-3 py-2.5 outline-none focus:border-[#e76d61]"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#718078]">
                          Size
                        </span>

                        <input
                          type="text"
                          name="size"
                          defaultValue={variant.size ?? ""}
                          className="rounded-lg border border-[#284239]/15 px-3 py-2.5 outline-none focus:border-[#e76d61]"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#718078]">
                          Color
                        </span>

                        <input
                          type="text"
                          name="color"
                          defaultValue={variant.color ?? ""}
                          className="rounded-lg border border-[#284239]/15 px-3 py-2.5 outline-none focus:border-[#e76d61]"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#718078]">
                          SKU
                        </span>

                        <input
                          type="text"
                          name="sku"
                          defaultValue={variant.sku ?? ""}
                          className="rounded-lg border border-[#284239]/15 px-3 py-2.5 outline-none focus:border-[#e76d61]"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#718078]">
                          Price
                        </span>

                        <input
                          type="number"
                          name="price"
                          min="0"
                          step="0.01"
                          defaultValue={variant.price ?? ""}
                          className="rounded-lg border border-[#284239]/15 px-3 py-2.5 outline-none focus:border-[#e76d61]"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#718078]">
                          Quantity
                        </span>

                        <input
                          type="number"
                          name="quantity"
                          min="0"
                          step="1"
                          defaultValue={variant.quantity ?? ""}
                          className="rounded-lg border border-[#284239]/15 px-3 py-2.5 outline-none focus:border-[#e76d61]"
                        />
                      </label>
                    </div>

                    <label className="mt-4 flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="track_inventory"
                        defaultChecked={variant.track_inventory}
                      />

                      <span className="text-sm font-semibold">
                        Track inventory
                      </span>
                    </label>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        className="rounded-lg bg-[#284239] px-4 py-2.5 text-sm font-semibold text-white"
                      >
                        Save Variant
                      </button>

                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          variant.active
                            ? "bg-[#e6f2e3] text-[#31583b]"
                            : "bg-[#ecebea] text-[#595c5a]"
                        }`}
                      >
                        {variant.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </form>

                  <div className="mt-4 flex flex-wrap gap-3 border-t border-[#284239]/10 pt-4">
                    <form
                      action={setVariantActive.bind(
                        null,
                        id,
                        variant.id,
                        !variant.active
                      )}
                    >
                      <button
                        type="submit"
                        className="text-sm font-semibold text-[#36594c]"
                      >
                        {variant.active ? "Deactivate" : "Reactivate"}
                      </button>
                    </form>

                    <form
                      action={deleteVariant.bind(null, id, variant.id)}
                    >
                      <button
                        type="submit"
                        className="text-sm font-semibold text-[#a7473f]"
                      >
                        Delete Variant
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
            Storefront Status
          </h2>

          <p className="mt-2 text-sm text-[#607068]">
            Current status:{" "}
            <strong className="text-[#153f32]">{product.status}</strong>
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <form action={setProductStatus.bind(null, id, "published")}>
              <button
                type="submit"
                className="rounded-xl bg-[#31583b] px-5 py-3 text-sm font-semibold text-white"
              >
                Publish
              </button>
            </form>

            <form action={setProductStatus.bind(null, id, "hidden")}>
              <button
                type="submit"
                className="rounded-xl border border-[#284239]/15 bg-white px-5 py-3 text-sm font-semibold"
              >
                Hide
              </button>
            </form>

            <form action={setProductStatus.bind(null, id, "sold_out")}>
              <button
                type="submit"
                className="rounded-xl border border-[#e76d61]/30 bg-[#fff0ed] px-5 py-3 text-sm font-semibold text-[#a7473f]"
              >
                Mark Sold Out
              </button>
            </form>

            <form action={setProductStatus.bind(null, id, "draft")}>
              <button
                type="submit"
                className="rounded-xl border border-[#284239]/15 bg-[#f7f1e8] px-5 py-3 text-sm font-semibold"
              >
                Move to Draft
              </button>
            </form>

            <form action={setProductStatus.bind(null, id, "archived")}>
              <button
                type="submit"
                className="rounded-xl border border-[#8b4a44]/25 bg-[#f7e8e6] px-5 py-3 text-sm font-semibold text-[#8b4a44]"
              >
                Archive Product
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
