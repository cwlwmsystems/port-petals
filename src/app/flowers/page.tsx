import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedFlowers } from "@/lib/flowers";
import ProductCardCarousel from "@/components/ProductCardCarousel";
import StoreProductCard from "@/components/StoreProductCard";

export const metadata: Metadata = {
  title: "Fresh Flowers",
  description:
    "Shop fresh flower arrangements, bouquets, seasonal flowers, and prom or homecoming flowers from Port Petals in Port Allegany, Pennsylvania.",
};

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

const collectionDetails: Record<
  string,
  {
    label: string;
    description: string;
  }
> = {
  occasion: {
    label: "Occasion Arrangements",
    description:
      "Flowers for birthdays, anniversaries, thank-yous, celebrations, and everyday moments.",
  },
  seasonal: {
    label: "Seasonal Arrangements",
    description:
      "Fresh designs inspired by the colors, flowers, and celebrations of the season.",
  },
  bouquets: {
    label: "Individual Bouquets",
    description:
      "Hand-tied bouquets and fresh flowers that make an easy, thoughtful gift.",
  },
  "prom-homecoming": {
    label: "Prom & Homecoming",
    description:
      "Corsages, boutonnieres, matching sets, bouquets, and flowers for a memorable night.",
  },
};

function formatCollection(collection: string) {
  return (
    collectionDetails[collection]?.label ??
    collection.replaceAll("-", " ")
  );
}

function getCollectionDescription(collection: string) {
  return (
    collectionDetails[collection]?.description ??
    "Browse fresh flower selections from Port Petals."
  );
}

function FlowerCard({
  product,
}: {
  product: Awaited<
    ReturnType<typeof getPublishedFlowers>
  >[number];
}) {
  const startingPrice = getStartingPrice(
    product.base_price,
    product.variants
  );

  const primaryImage =
    product.images[0]?.publicUrl ??
    "/collections/fresh-flowers.jpg";

  return (
    <StoreProductCard
      href={`/flowers/${product.slug}`}
      productId={product.id}
      slug={product.slug}
      name={product.name}
      shortDescription={product.short_description}
      imageUrl={primaryImage}
      imageAlt={
        product.images[0]?.alt_text ??
        product.name
      }
      startingPrice={startingPrice}
      featured={product.featured}
      maker={null}
      readyMade={product.ready_made}
      customizable={product.customizable}
      madeToOrder={product.made_to_order}
      leadTimeDays={product.lead_time_days}
      basePrice={product.base_price}
      trackInventory={product.track_inventory}
      quantity={product.quantity}
      variants={product.variants.map((variant) => ({
        quantity: variant.quantity,
        trackInventory: variant.track_inventory,
      }))}
    />
  );
}

export default async function FlowersPage() {
  const products = await getPublishedFlowers();

  const rawCollections = Array.from(
    new Set(products.map((product) => product.collection))
  );

  const preferredOrder = [
    "prom-homecoming",
    "occasion",
    "seasonal",
    "bouquets",
  ];

  const collections = [...rawCollections].sort(
    (a, b) => {
      const aIndex = preferredOrder.indexOf(a);
      const bIndex = preferredOrder.indexOf(b);

      if (aIndex === -1 && bIndex === -1) {
        return a.localeCompare(b);
      }

      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    }
  );

  const easternMonth = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      month: "numeric",
    }).format(new Date())
  );

  const isHomecomingSeason =
    easternMonth >= 8 && easternMonth <= 10;

  const homecomingProducts = products.filter(
    (product) =>
      product.collection === "prom-homecoming"
  );

  const showHomecomingSpotlight =
    isHomecomingSeason &&
    homecomingProducts.length > 0;

  const regularCollections =
    showHomecomingSpotlight
      ? collections.filter(
          (collection) =>
            collection !== "prom-homecoming"
        )
      : collections;

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#f7eadc]">
        <div className="absolute inset-0 -z-30 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_48%,#edf3e7_100%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
              Fresh Flowers • Port Allegany
            </p>

            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              Fresh flowers for the moments that matter.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52655d]">
              Shop fresh arrangements, hand-tied bouquets,
              seasonal flowers, and flowers for Homecoming,
              celebrations, gifts, and everyday moments.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#flower-collections"
                className="inline-flex rounded-full bg-[#e76d61] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
              >
                Shop Fresh Flowers →
              </Link>

              {homecomingProducts.length > 0 && (
                <Link
                  href="#prom-homecoming"
                  className="inline-flex rounded-full border border-[#284239]/15 bg-white/70 px-6 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                >
                  Homecoming & Prom
                </Link>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#607068]">
              <span>✓ Pickup in Port Allegany</span>
              <span>✓ Local delivery available</span>
              <span>✓ Custom flower requests welcome</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_55px_rgba(42,66,57,0.15)]">
            <div className="relative aspect-[4/3]">
              <Image
                src="/heroes/flowers.jpg"
                alt="Fresh flowers from Port Petals"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION NAVIGATION */}
      {collections.length > 0 && (
        <section
          id="flower-collections"
          className="scroll-mt-28 border-y border-[#284239]/10 bg-white/50"
        >
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#8a978f]">
              Shop Flowers
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {collections.map((collection) => {
                const count = products.filter(
                  (product) =>
                    product.collection === collection
                ).length;

                return (
                  <a
                    key={collection}
                    href={`#${collection}`}
                    className="rounded-full border border-[#284239]/15 bg-[#fffdf9] px-5 py-2.5 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                  >
                    {formatCollection(collection)}
                    <span className="ml-2 text-xs font-normal text-[#8a978f]">
                      {count}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* HOMECOMING SPOTLIGHT */}
      {showHomecomingSpotlight && (
        <section
          id="prom-homecoming"
          className="scroll-mt-28 bg-[#171717] text-[#fffaf3]"
        >
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#ff7315]">
                  Homecoming Season
                </p>

                <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                  Flowers for a memorable Homecoming.
                </h2>

                <p className="mt-4 max-w-xl text-base leading-7 text-white/75">
                  Shop corsages, boutonnieres,
                  matching sets, bouquets, and fresh
                  flowers for the big night.
                </p>

                <p className="mt-4 text-sm leading-6 text-white/60">
                  Ordering early is encouraged as
                  Homecoming approaches.
                </p>
              </div>

              <div className="rounded-[1.6rem] border border-[#ff7315]/25 bg-white/[0.06] p-5">
                <p className="text-sm font-semibold text-[#ff9b55]">
                  Need help choosing?
                </p>

                <p className="mt-2 text-sm leading-6 text-white/70">
                  Port Petals can help coordinate colors,
                  flowers, and matching pieces for your
                  Homecoming look.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="tel:+18146421253"
                    className="rounded-full bg-[#ff7315] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e76500]"
                  >
                    Call 814-642-1253
                  </a>

                  <a
                    href="mailto:PortPetals@yahoo.com?subject=Homecoming%20Flowers"
                    className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Email Port Petals
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <ProductCardCarousel visibleCount={3}>
                {homecomingProducts.map((product) => {
                  const startingPrice = getStartingPrice(
                    product.base_price,
                    product.variants
                  );

                  const primaryImage =
                    product.images[0]?.publicUrl ??
                    "/collections/fresh-flowers.jpg";

                  return (
                    <Link
                      key={product.id}
                      href={`/flowers/${product.slug}`}
                      className="group block h-full overflow-hidden rounded-[1.4rem] border border-[#ff7315]/20 bg-white/[0.07] transition hover:-translate-y-1 hover:border-[#ff7315]/45 hover:bg-white/[0.10]"
                    >
                      <div className="grid h-[190px] grid-cols-[120px_1fr] sm:grid-cols-[145px_1fr]">
                        <div className="bg-[#fffaf3]">
                          <img
                            src={primaryImage}
                            alt={
                              product.images[0]?.alt_text ??
                              product.name
                            }
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex min-h-0 flex-col justify-center overflow-hidden p-4 sm:p-5">
                          {product.featured && (
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ff9b55]">
                              Featured
                            </p>
                          )}

                          <h3 className="mt-1 font-serif text-xl font-semibold leading-tight text-white">
                            {product.name}
                          </h3>

                          {product.short_description && (
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/65">
                              {product.short_description}
                            </p>
                          )}

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-[#ff9b55]">
                              {startingPrice !== null
                                ? `From ${new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  }).format(startingPrice)}`
                                : "View details"}
                            </span>

                            <span className="text-xs font-semibold text-white/70 transition group-hover:text-white">
                              View →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </ProductCardCarousel>
            </div>
          </div>
        </section>
      )}

      {/* FLOWER COLLECTIONS */}
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        {products.length === 0 ? (
          <div className="rounded-[1.8rem] border border-[#284239]/10 bg-white/70 p-10 text-center">
            <h2 className="font-serif text-3xl font-semibold text-[#153f32]">
              Flower offerings are being updated
            </h2>

            <p className="mt-4 text-[#607068]">
              Check back soon or contact Port Petals for
              current flower availability.
            </p>
          </div>
        ) : (
          regularCollections.map(
            (collection, index) => {
              const collectionProducts =
                products.filter(
                  (product) =>
                    product.collection === collection
                );

              return (
                <section
                  key={collection}
                  id={collection}
                  className={
                    index === 0
                      ? "scroll-mt-32"
                      : "mt-16 scroll-mt-32 border-t border-[#284239]/10 pt-16"
                  }
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                        Fresh from Port Petals
                      </p>

                      <h2 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
                        {formatCollection(collection)}
                      </h2>

                      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068]">
                        {getCollectionDescription(
                          collection
                        )}
                      </p>
                    </div>

                    <p className="text-sm font-medium text-[#8a978f]">
                      {collectionProducts.length}{" "}
                      {collectionProducts.length === 1
                        ? "item"
                        : "items"}
                    </p>
                  </div>

                  <div className="mt-8">
                    <ProductCardCarousel visibleCount={3}>
                      {collectionProducts.map(
                        (product) => (
                          <FlowerCard
                            key={product.id}
                            product={product}
                          />
                        )
                      )}
                    </ProductCardCarousel>
                  </div>
                </section>
              );
            }
          )
        )}
      </div>

      {/* FLOWER ORDERING INFORMATION */}
      <section className="border-t border-[#284239]/10 bg-[#edf3e7]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                Pickup
              </p>

              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#153f32]">
                Pick up in Port Allegany
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Orders can be picked up at
                430 E Arnold Avenue,
                Port Allegany, PA 16743.
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-white/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                Local Delivery
              </p>

              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#153f32]">
                Flowers delivered locally
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Eligible flower orders can be delivered
                locally. Delivery availability and fees
                are confirmed during checkout.
              </p>

              <Link
                href="/fulfillment"
                className="mt-4 inline-flex text-sm font-semibold text-[#e76d61]"
              >
                View Pickup & Delivery Details →
              </Link>
            </div>

            <div className="rounded-[1.5rem] bg-white/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                Something Specific?
              </p>

              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#153f32]">
                Ask Port Petals
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Looking for a particular color,
                occasion, or flower style? Call or email
                Port Petals to discuss what you have in mind.
              </p>

              <Link
                href="/custom/request"
                className="mt-4 inline-flex text-sm font-semibold text-[#e76d61]"
              >
                Contact Port Petals →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
