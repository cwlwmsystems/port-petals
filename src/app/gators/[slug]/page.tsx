import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GatorOrderConfigurator from "@/components/GatorOrderConfigurator";
import ProductImageGallery from "@/components/ProductImageGallery";
import StoreProductCard from "@/components/StoreProductCard";
import {
  getPublishedGatorBySlug,
  getPublishedGatorGear,
} from "@/lib/gators";

type GatorPageProps = {
  params: Promise<{
    slug: string;
  }>;
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

function getStartingPrice(
  basePrice: number | null,
  variants: { price: number | null }[]
) {
  const prices = [
    ...(basePrice !== null ? [basePrice] : []),
    ...variants
      .map((variant) => variant.price)
      .filter((price): price is number => price !== null),
  ];

  return prices.length > 0
    ? Math.min(...prices)
    : null;
}

function getLeadTimeText(days: number | null) {
  if (days === null) {
    return null;
  }

  return `Please allow at least ${days} day${
    days === 1 ? "" : "s"
  } for this item.`;
}

export async function generateMetadata({
  params,
}: GatorPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product =
    await getPublishedGatorBySlug(slug);

  if (!product) {
    return {
      title: "Gator Gear Not Found",
    };
  }

  const description =
    product.short_description ??
    product.description ??
    "Port Allegany Gator gear from Port Petals.";

  const canonical = `/gators/${slug}`;
  const primaryImage =
    product.images[0]?.publicUrl;

  return {
    title: product.name,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: canonical,
      images: primaryImage
        ? [
            {
              url: primaryImage,
              alt:
                product.images[0]?.alt_text ??
                product.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: primaryImage
        ? "summary_large_image"
        : "summary",
      title: product.name,
      description,
      images: primaryImage
        ? [primaryImage]
        : undefined,
    },
  };
}

export default async function GatorProductPage({
  params,
}: GatorPageProps) {
  const { slug } = await params;

  const [product, allGatorGear] =
    await Promise.all([
      getPublishedGatorBySlug(slug),
      getPublishedGatorGear(),
    ]);

  if (!product) {
    notFound();
  }

  const startingPrice = getStartingPrice(
    product.base_price,
    product.variants
  );

  const leadTime = getLeadTimeText(
    product.lead_time_days
  );

  const gatorVariants =
    product.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      size: variant.size,
      color: variant.color,
      price:
        variant.price ??
        product.base_price ??
        0,
      quantity: variant.quantity,
      trackInventory:
        variant.track_inventory,
    }));

  const trackedVariantQuantity =
    product.variants
      .filter(
        (variant) =>
          variant.active &&
          variant.track_inventory &&
          variant.quantity !== null
      )
      .reduce(
        (total, variant) =>
          total + (variant.quantity ?? 0),
        0
      );

  const hasTrackedVariants =
    product.variants.some(
      (variant) =>
        variant.active &&
        variant.track_inventory
    );

  const totalAvailable =
    hasTrackedVariants
      ? trackedVariantQuantity
      : product.quantity;

  const stockLabel =
    totalAvailable === null
      ? null
      : totalAvailable <= 0
        ? "Sold Out"
        : totalAvailable <= 3
          ? "Low Stock"
          : "In Stock";

  const relatedGatorGear = [
    ...allGatorGear.filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.collection ===
          product.collection
    ),
    ...allGatorGear.filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.collection !==
          product.collection
    ),
  ].slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      {/* BREADCRUMB */}
      <section className="mx-auto max-w-7xl px-5 pt-7 sm:px-8 lg:px-10">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-[#718078]"
        >
          <Link
            href="/"
            className="transition hover:text-[#e06b2e]"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            href="/gators"
            className="transition hover:text-[#e06b2e]"
          >
            Gator Gear
          </Link>

          <span>/</span>

          <span className="font-medium text-[#252525]">
            {product.name}
          </span>
        </nav>
      </section>

      {/* PRODUCT */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-7 sm:px-8 lg:px-10 lg:pb-20">
        <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] xl:gap-16">
          {/* GALLERY */}
          <div className="lg:sticky lg:top-28">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
              fallbackImage="/collections/gators.jpg"
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {product.pickup_available && (
                <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#e06b2e]">
                    Pickup
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#5d625f]">
                    Available at 430 E Arnold Avenue,
                    Port Allegany.
                  </p>
                </div>
              )}

              {product.delivery_available && (
                <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#e06b2e]">
                    Local Delivery
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#5d625f]">
                    Local delivery is available based
                    on destination.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* PURCHASE AREA */}
          <div>
            <div className="flex flex-wrap gap-2">
              {product.featured && (
                <span className="inline-flex rounded-full bg-[#fff0e6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#c95418]">
                  Gator Favorite
                </span>
              )}

              {product.ready_made && (
                <span className="inline-flex rounded-full bg-[#ececec] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#444]">
                  Ready-Made
                </span>
              )}

              {product.made_to_order && (
                <span className="inline-flex rounded-full bg-[#222] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white">
                  Made to Order
                </span>
              )}

              {product.customizable && (
                <span className="inline-flex rounded-full bg-[#f6d7c6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#a94717]">
                  Customizable
                </span>
              )}

              {stockLabel && (
                <span
                  className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] ${
                    stockLabel === "Sold Out"
                      ? "bg-[#f4ddd8] text-[#a7473f]"
                      : stockLabel === "Low Stock"
                        ? "bg-[#f8e7cf] text-[#9a6a31]"
                        : "bg-[#e4efe1] text-[#36594c]"
                  }`}
                >
                  {stockLabel}
                </span>
              )}
            </div>

            {product.maker && (
              <p className="mt-5 text-sm font-semibold text-[#3f4743]">
                Made by {product.maker}
              </p>
            )}

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#e06b2e]">
              Port Allegany Gator Gear
            </p>

            <h1 className="mt-2 max-w-2xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#171717] sm:text-6xl">
              {product.name}
            </h1>

            {product.short_description && (
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#565d59]">
                {product.short_description}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-end justify-between gap-5 border-y border-black/10 py-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#727772]">
                  {product.variants.length > 0
                    ? "Starting At"
                    : "Price"}
                </p>

                <p className="mt-1 text-4xl font-semibold tracking-[-0.03em] text-[#e06b2e]">
                  {formatPrice(startingPrice)}
                </p>
              </div>

              {leadTime && (
                <div className="max-w-xs rounded-xl bg-[#222] px-4 py-3 text-sm leading-6 text-white">
                  <span className="font-semibold text-[#f2a16f]">
                    Preparation:
                  </span>{" "}
                  {leadTime}
                </div>
              )}
            </div>

            {/* ORDER PANEL */}
            <div className="mt-7 overflow-hidden rounded-[1.7rem] border border-black/10 bg-[#fffdf9] shadow-[0_14px_35px_rgba(0,0,0,0.08)]">
              <div className="relative overflow-hidden bg-[#1f1f1f] px-5 py-6 text-white sm:px-7">
                <div
                  className="pointer-events-none absolute inset-0 bg-[url('/port-gators.jpeg')] bg-[length:180px] bg-right bg-no-repeat opacity-[0.08]"
                  aria-hidden="true"
                />

                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f28a4b]">
                    Choose Your Gator Gear
                  </p>

                  <h2 className="mt-1 font-serif text-2xl font-semibold">
                    Select your options
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                    Choose the available size or
                    product option. If this item can be
                    customized, you can add the
                    personalization and design details
                    below.
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <GatorOrderConfigurator
                  productId={product.id}
                  productSlug={product.slug}
                  productName={product.name}
                  imageUrl={
                    product.images.find(
                      (image) =>
                        image.is_primary
                    )?.publicUrl ??
                    product.images[0]?.publicUrl ??
                    null
                  }
                  basePrice={
                    product.base_price ?? 0
                  }
                  baseQuantity={
                    product.quantity
                  }
                  baseTrackInventory={
                    product.track_inventory
                  }
                  variants={gatorVariants}
                  customizable={
                    product.customizable
                  }
                  pickupAvailable={
                    product.pickup_available
                  }
                  deliveryAvailable={
                    product.delivery_available
                  }
                />
              </div>
            </div>

            {/* QUICK GUIDANCE */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-[#222] px-4 py-3 text-center text-white">
                <p className="text-sm font-semibold">
                  Hometown Pride
                </p>

                <p className="mt-1 text-xs text-white/60">
                  Port Allegany Gator gear
                </p>
              </div>

              <div className="rounded-xl bg-[#fff0e6] px-4 py-3 text-center">
                <p className="text-sm font-semibold text-[#252525]">
                  Personalization
                </p>

                <p className="mt-1 text-xs text-[#75665d]">
                  Available on eligible products
                </p>
              </div>

              <div className="rounded-xl bg-white/70 px-4 py-3 text-center">
                <p className="text-sm font-semibold text-[#252525]">
                  Need Help?
                </p>

                <a
                  href="tel:+18146421253"
                  className="mt-1 block text-xs font-semibold text-[#e06b2e]"
                >
                  814-642-1253
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT INFORMATION */}
      <section className="border-y border-black/10 bg-white/55">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-3 lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e06b2e]">
              Product Details
            </p>

            <p className="mt-3 text-sm leading-7 text-[#5d625f]">
              {product.description ??
                product.short_description ??
                product.name}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e06b2e]">
              Pickup & Delivery
            </p>

            <div className="mt-3 space-y-2 text-sm leading-7 text-[#5d625f]">
              {product.pickup_available && (
                <p>
                  Pickup is available at 430 E Arnold
                  Avenue, Port Allegany.
                </p>
              )}

              {product.delivery_available && (
                <p>
                  Local delivery is available. Delivery
                  fees depend on the destination.
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e06b2e]">
              Availability
            </p>

            <p className="mt-3 text-sm leading-7 text-[#5d625f]">
              {leadTime ??
                "Availability may vary by style and selected options."}
            </p>

            {product.customizable && (
              <p className="mt-3 text-sm leading-7 text-[#5d625f]">
                Personalization options vary by
                product. Enter only the details that
                apply to the item you are ordering.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* GATOR CALLOUT */}
      <section className="relative overflow-hidden bg-[#1d1d1d] text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/port-gators.jpeg')] bg-[length:300px] bg-right-bottom bg-no-repeat opacity-[0.08]"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl gap-7 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f28a4b]">
              Port Allegany Pride
            </p>

            <h2 className="mt-2 font-serif text-3xl font-semibold">
              Looking for a different Gator item?
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
              Browse the full Gator collection or
              contact Port Petals about an idea that is
              not currently listed online.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/gators"
              className="rounded-full bg-[#e06b2e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c95a22]"
            >
              Shop Gator Gear
            </Link>

            <a
              href="tel:+18146421253"
              className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Call Port Petals
            </a>
          </div>
        </div>
      </section>

      {/* RELATED GATOR GEAR */}
      {relatedGatorGear.length > 0 && (
        <section className="bg-[#fffaf3]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e06b2e]">
                  You May Also Like
                </p>

                <h2 className="mt-2 font-serif text-4xl font-semibold text-[#171717]">
                  More Gator favorites
                </h2>
              </div>

              <Link
                href="/gators"
                className="text-sm font-semibold text-[#e06b2e]"
              >
                Shop All Gator Gear →
              </Link>
            </div>

            <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {relatedGatorGear.map(
                (related) => {
                  const relatedPrice =
                    getStartingPrice(
                      related.base_price,
                      related.variants
                    );

                  const relatedImage =
                    related.images[0]?.publicUrl ??
                    "/collections/gators.jpg";

                  return (
                    <StoreProductCard
                      key={related.id}
                      href={`/gators/${related.slug}`}
                      productId={related.id}
                      slug={related.slug}
                      name={related.name}
                      shortDescription={
                        related.short_description
                      }
                      imageUrl={relatedImage}
                      imageAlt={
                        related.images[0]
                          ?.alt_text ??
                        related.name
                      }
                      startingPrice={
                        relatedPrice
                      }
                      featured={
                        related.featured
                      }
                      maker={
                        related.maker
                      }
                      readyMade={
                        related.ready_made
                      }
                      customizable={
                        related.customizable
                      }
                      madeToOrder={
                        related.made_to_order
                      }
                      leadTimeDays={
                        related.lead_time_days
                      }
                      basePrice={
                        related.base_price
                      }
                      trackInventory={
                        related.track_inventory
                      }
                      quantity={
                        related.quantity
                      }
                      variants={related.variants.map(
                        (variant) => ({
                          quantity:
                            variant.quantity,
                          trackInventory:
                            variant.track_inventory,
                        })
                      )}
                    />
                  );
                }
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
