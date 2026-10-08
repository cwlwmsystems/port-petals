import type { Metadata } from "next";
import { buildBreadcrumbStructuredData } from "@/lib/seo/breadcrumbs";
import { buildProductStructuredData } from "@/lib/seo/product";
import JsonLd from "@/components/JsonLd";
import ProductViewTracker from "@/components/ProductViewTracker";
import Link from "next/link";
import { notFound } from "next/navigation";
import FlowerOrderConfigurator from "@/components/FlowerOrderConfigurator";
import FlowerProductInfoTabs from "@/components/FlowerProductInfoTabs";
import ProductImageGallery from "@/components/ProductImageGallery";
import StoreProductCard from "@/components/StoreProductCard";
import {
  getPublishedFlowerBySlug,
  getPublishedFlowers,
} from "@/lib/flowers";
import StickyProductCTA from "@/components/StickyProductCTA";

type FlowerPageProps = {
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


function buildSeoDescription(
  shortDescription: string | null,
  description: string | null,
  fallback: string
) {
  const short =
    shortDescription?.trim() ?? "";

  if (
    short.length >= 80 &&
    short.length <= 160
  ) {
    return short;
  }

  const source =
    description?.trim() ||
    short ||
    fallback;

  if (source.length <= 160) {
    return source;
  }

  const shortened =
    source.slice(0, 157);

  const lastSpace =
    shortened.lastIndexOf(" ");

  return `${
    lastSpace > 100
      ? shortened.slice(0, lastSpace)
      : shortened
  }...`;
}

export async function generateMetadata({
  params,
}: FlowerPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await getPublishedFlowerBySlug(slug);

  if (!product) {
    return {
      title: "Flower Product Not Found",
    };
  }

  const description =
    buildSeoDescription(
      product.short_description,
      product.description,
      "Fresh flowers from Port Petals in Port Allegany, Pennsylvania."
    );

  const seoTitle =
    slug === "adara"
      ? "Adara White Rose Arrangement"
      : slug ===
          "on-a-cloudy-day-be-someones-rainbow-hand-tied"
        ? "Someone's Rainbow Hand-Tied Bouquet"
        : product.name;

  const canonical = `/flowers/${slug}`;
  const primaryImage = product.images[0]?.publicUrl;

  return {
    title: seoTitle,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: seoTitle,
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
      title: seoTitle,
      description,
      images: primaryImage
        ? [primaryImage]
        : undefined,
    },
  };
}

export default async function FlowerPage({
  params,
}: FlowerPageProps) {
  const { slug } = await params;

  const [product, allFlowers] = await Promise.all([
    getPublishedFlowerBySlug(slug),
    getPublishedFlowers(),
  ]);

  if (!product) {
    notFound();
  }

  const productStructuredData =
    buildProductStructuredData(
      product,
      {
        pathname:
          `/flowers/${product.slug}`,
      }
    );

  const breadcrumbStructuredData =
    buildBreadcrumbStructuredData([
      {
        name: "Home",
        path: "/",
      },
      {
        name: "Fresh Flowers",
        path: "/flowers",
      },
      {
        name: product.name,
        path: `/flowers/${product.slug}`,
      },
    ]);

  const startingPrice = getStartingPrice(
    product.base_price,
    product.variants
  );

  const leadTime = getLeadTimeText(
    product.lead_time_days
  );

  const configuratorOptions = [
    ...(product.base_price !== null
      ? [
          {
            id: null,
            name: "Standard",
            price: product.base_price,
            quantity: product.quantity,
            trackInventory:
              product.track_inventory,
          },
        ]
      : []),

    ...product.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      price:
        variant.price ??
        product.base_price ??
        0,
      quantity: variant.quantity,
      trackInventory:
        variant.track_inventory,
    })),
  ];

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

  const relatedFlowers = [
    ...allFlowers.filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.collection ===
          product.collection
    ),
    ...allFlowers.filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.collection !==
          product.collection
    ),
  ].slice(0, 3);

  return (
    <main className="min-h-screen pb-24 lg:pb-0 bg-[#f7f1e8] text-[#284239]">
      <ProductViewTracker
        productId={product.id}
        productName={product.name}
        category="flowers"
        price={startingPrice}
      />
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
            href="/flowers"
            className="transition hover:text-[#e76d61]"
          >
            Fresh Flowers
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
              fallbackImage="/collections/fresh-flowers.jpg"
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
                      : stockLabel ===
                          "Low Stock"
                        ? "bg-[#f8e7cf] text-[#9a6a31]"
                        : "bg-[#e4efe1] text-[#36594c]"
                  }`}
                >
                  {stockLabel}
                </span>
              )}
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#8a978f]">
              Fresh Flowers
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

            <div className="mt-7 rounded-[1.7rem] border border-[#284239]/10 bg-[#fffdf9] p-5 shadow-[0_14px_35px_rgba(42,66,57,0.07)] sm:p-7">
              <div className="mb-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                  Build Your Order
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                  Choose your arrangement options
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#607068]">
                  Select the arrangement, pickup or
                  delivery, and any additional details
                  before adding it to your cart.
                </p>
              </div>

              <div id="product-order" className="scroll-mt-28">
              <FlowerOrderConfigurator
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
                options={configuratorOptions}
                pickupAvailable={
                  product.pickup_available
                }
                deliveryAvailable={
                  product.delivery_available
                }
                allowsCardMessage={true}
              />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white/60 px-4 py-3 text-center">
                <p className="text-sm font-semibold text-[#153f32]">
                  Fresh Flowers
                </p>
                <p className="mt-1 text-xs text-[#718078]">
                  Made with seasonal availability
                </p>
              </div>

              <div className="rounded-xl bg-white/60 px-4 py-3 text-center">
                <p className="text-sm font-semibold text-[#153f32]">
                  Card Message
                </p>
                <p className="mt-1 text-xs text-[#718078]">
                  Add one during ordering
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
      <FlowerProductInfoTabs
        description={
          product.description ??
          product.short_description ??
          product.name
        }
      />

      {/* RELATED FLOWERS */}
      {relatedFlowers.length > 0 && (
        <section className="border-t border-[#284239]/10 bg-[#fffaf3]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
                  You May Also Like
                </p>

                <h2 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
                  More fresh flowers
                </h2>
              </div>

              <Link
                href="/flowers"
                className="text-sm font-semibold text-[#e76d61]"
              >
                Shop All Flowers →
              </Link>
            </div>

            <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {relatedFlowers.map(
                (related) => {
                  const relatedPrice =
                    getStartingPrice(
                      related.base_price,
                      related.variants
                    );

                  const relatedImage =
                    related.images[0]
                      ?.publicUrl ??
                    "/collections/fresh-flowers.jpg";

                  return (
                    <StoreProductCard
                      key={related.id}
                      href={`/flowers/${related.slug}`}
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
                      maker={null}
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
          <StickyProductCTA
        productName={product.name}
        startingPrice={startingPrice}
      />

</main>
  );
}
