import type { Metadata } from "next";
import { buildBreadcrumbStructuredData } from "@/lib/seo/breadcrumbs";
import { buildProductStructuredData } from "@/lib/seo/product";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import { notFound } from "next/navigation";
import CustomItemConfigurator from "@/components/CustomItemConfigurator";
import CustomItemInfoTabs from "@/components/CustomItemInfoTabs";
import ProductImageGallery from "@/components/ProductImageGallery";
import StoreProductCard from "@/components/StoreProductCard";
import {
  getPublishedCustomItemBySlug,
  getPublishedCustomItems,
} from "@/lib/custom-items";
import StickyProductCTA from "@/components/StickyProductCTA";

type CustomItemPageProps = {
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

  return prices.length > 0 ? Math.min(...prices) : null;
}

function getLeadTimeText(days: number | null) {
  if (days === null) {
    return undefined;
  }

  return `Please allow at least ${days} day${
    days === 1 ? "" : "s"
  } for this item.`;
}

export async function generateMetadata({
  params,
}: CustomItemPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product =
    await getPublishedCustomItemBySlug(slug);

  if (!product) {
    return {
      title: "Custom Item Not Found",
    };
  }

  const description =
    product.short_description ??
    product.description ??
    "Custom item from Port Petals.";

  const canonical = `/custom/${slug}`;
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

export default async function CustomItemPage({
  params,
}: CustomItemPageProps) {
  const { slug } = await params;

  const [product, allCustomItems] =
    await Promise.all([
      getPublishedCustomItemBySlug(slug),
      getPublishedCustomItems(),
    ]);

  if (!product) {
    notFound();
  }

  const productStructuredData =
    buildProductStructuredData(
      product,
      {
        pathname:
          `/custom/${product.slug}`,
      }
    );

  const breadcrumbStructuredData =
    buildBreadcrumbStructuredData([
      {
        name: "Home",
        path: "/",
      },
      {
        name: "Custom Items",
        path: "/custom",
      },
      {
        name: product.name,
        path: `/custom/${product.slug}`,
      },
    ]);

  const startingPrice = getStartingPrice(
    product.base_price,
    product.variants
  );

  const leadTime = getLeadTimeText(
    product.lead_time_days
  );

  const customVariants =
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

  const relatedItems = [
    ...allCustomItems.filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.collection ===
          product.collection
    ),
    ...allCustomItems.filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.collection !==
          product.collection
    ),
  ].slice(0, 3);

  return (
    <main className="min-h-screen pb-24 lg:pb-0 bg-[#f7f1e8] text-[#284239]">
      <JsonLd data={productStructuredData} />
      <JsonLd data={breadcrumbStructuredData} />
      {/* BREADCRUMB */}
      <section className="mx-auto max-w-7xl px-5 pt-7 sm:px-8 lg:px-10">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-[#718078]"
        >
          <Link
            href="/"
            className="transition hover:text-[#e76d61]"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            href="/custom"
            className="transition hover:text-[#e76d61]"
          >
            Custom Items
          </Link>

          <span>/</span>

          <span className="font-medium text-[#36594c]">
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
              fallbackImage="/collections/customized-items.jpg"
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {product.pickup_available && (
                <div className="rounded-2xl border border-[#284239]/10 bg-white/65 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#e76d61]">
                    Pickup
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#52655d]">
                    Available at 430 E Arnold Avenue,
                    Port Allegany.
                  </p>
                </div>
              )}

              {product.delivery_available && (
                <div className="rounded-2xl border border-[#284239]/10 bg-white/65 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#e76d61]">
                    Local Delivery
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#52655d]">
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
                <span className="inline-flex rounded-full bg-[#f3d8d2] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#b94f45]">
                  Port Petals Favorite
                </span>
              )}

              {product.ready_made && (
                <span className="inline-flex rounded-full bg-[#edf1f6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#536578]">
                  Ready-Made
                </span>
              )}

              {product.made_to_order && (
                <span className="inline-flex rounded-full bg-[#edf3e7] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#36594c]">
                  Made to Order
                </span>
              )}

              {product.customizable && (
                <span className="inline-flex rounded-full bg-[#f8e1dc] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#b9564c]">
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
              <p className="mt-5 text-sm font-semibold text-[#36594c]">
                Made by {product.maker}
              </p>
            )}

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#8a978f]">
              Personalized & Handmade
            </p>

            <h1 className="mt-2 max-w-2xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              {product.name}
            </h1>

            {product.short_description && (
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#52655d]">
                {product.short_description}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-end justify-between gap-5 border-y border-[#284239]/10 py-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#718078]">
                  {product.variants.length > 0
                    ? "Starting At"
                    : "Price"}
                </p>

                <p className="mt-1 text-4xl font-semibold tracking-[-0.03em] text-[#e76d61]">
                  {formatPrice(startingPrice)}
                </p>
              </div>

              {leadTime && (
                <div className="max-w-xs rounded-xl bg-[#edf3e7] px-4 py-3 text-sm leading-6 text-[#36594c]">
                  <span className="font-semibold">
                    Preparation:
                  </span>{" "}
                  {leadTime}
                </div>
              )}
            </div>

            {/* ORDER PANEL */}
            <div className="mt-7 rounded-[1.7rem] border border-[#284239]/10 bg-[#fffdf9] p-5 shadow-[0_14px_35px_rgba(42,66,57,0.07)] sm:p-7">
              <div className="mb-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                  Make It Yours
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                  Choose your options and personalization
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#607068]">
                  Select any available size, color,
                  personalization, theme, and
                  fulfillment options before adding
                  this item to your cart.
                </p>
              </div>

              <div id="product-order" className="scroll-mt-28">
              <CustomItemConfigurator
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
                variants={customVariants}
                personalizationAvailable={
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

            {/* TRUST / CUSTOMIZATION CUES */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white/60 px-4 py-3 text-center">
                <p className="text-sm font-semibold text-[#153f32]">
                  Personalized
                </p>

                <p className="mt-1 text-xs text-[#718078]">
                  Add wording, colors, or details when available
                </p>
              </div>

              <div className="rounded-xl bg-white/60 px-4 py-3 text-center">
                <p className="text-sm font-semibold text-[#153f32]">
                  Made with Care
                </p>

                <p className="mt-1 text-xs text-[#718078]">
                  Custom pieces may require preparation time
                </p>
              </div>

              <div className="rounded-xl bg-white/60 px-4 py-3 text-center">
                <p className="text-sm font-semibold text-[#153f32]">
                  Need Help?
                </p>

                <a
                  href="tel:+18146421253"
                  className="mt-1 block text-xs font-semibold text-[#e76d61]"
                >
                  814-642-1253
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT INFORMATION */}
      <CustomItemInfoTabs
        description={
          product.description ??
          product.short_description ??
          product.name
        }
        leadTime={
          leadTime ??
          "Timing depends on the requested design and material availability."
        }
      />

      {/* FULLY CUSTOM IDEA */}
      <section className="border-y border-[#284239]/10 bg-[#edf3e7]">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Have Another Idea?
            </p>

            <h2 className="mt-2 font-serif text-3xl font-semibold text-[#153f32]">
              Looking for something that is not listed here?
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068]">
              Contact Port Petals directly to discuss
              a different design, theme, color palette,
              personalization, or custom project.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+18146421253"
              className="rounded-full bg-[#e76d61] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
            >
              Call Port Petals
            </a>

            <a
              href="mailto:stacy@portpetals.com?subject=Custom%20Order%20Inquiry"
              className="rounded-full border border-[#284239]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
            >
              Email Port Petals
            </a>
          </div>
        </div>
      </section>

      {/* RELATED ITEMS */}
      {relatedItems.length > 0 && (
        <section className="bg-[#fffaf3]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
                  You May Also Like
                </p>

                <h2 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
                  More personalized favorites
                </h2>
              </div>

              <Link
                href="/custom"
                className="text-sm font-semibold text-[#e76d61]"
              >
                Shop All Custom Items →
              </Link>
            </div>

            <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {relatedItems.map((related) => {
                const relatedPrice =
                  getStartingPrice(
                    related.base_price,
                    related.variants
                  );

                const relatedImage =
                  related.images[0]?.publicUrl ??
                  "/collections/customized-items.jpg";

                return (
                  <StoreProductCard
                    key={related.id}
                    href={`/custom/${related.slug}`}
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
              })}
            </div>
          </div>
        </section>
      )}
          <StickyProductCTA
        productName={product.name}
        startingPrice={startingPrice}
      />

</main>
  );
}
