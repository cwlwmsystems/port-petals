import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedCandles } from "@/lib/candles";
import ProductCardCarousel from "@/components/ProductCardCarousel";
import StoreProductCard from "@/components/StoreProductCard";

export const metadata: Metadata = {
  title: "Candles",
  description:
    "Shop candle bouquets, wax melts, candle tarts, and giftable candle favorites from Port Petals in Port Allegany, Pennsylvania.",
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

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

const collectionDetails: Record<
  string,
  {
    label: string;
    description: string;
  }
> = {
  "candle-bouquets": {
    label: "Candle Bouquets",
    description:
      "Giftable candle bouquets arranged for birthdays, celebrations, thank-yous, and thoughtful surprises.",
  },
  bouquets: {
    label: "Candle Bouquets",
    description:
      "Giftable candle bouquets arranged for birthdays, celebrations, thank-yous, and thoughtful surprises.",
  },
  "wax-melts": {
    label: "Wax Melts",
    description:
      "Easy-to-use wax melts in a variety of scents for adding fragrance to your home.",
  },
  melts: {
    label: "Wax Melts",
    description:
      "Easy-to-use wax melts in a variety of scents for adding fragrance to your home.",
  },
  tarts: {
    label: "Candle Tarts",
    description:
      "Scented candle tarts made for wax warmers and easy everyday fragrance.",
  },
  "candle-tarts": {
    label: "Candle Tarts",
    description:
      "Scented candle tarts made for wax warmers and easy everyday fragrance.",
  },
  seasonal: {
    label: "Seasonal Scents",
    description:
      "Seasonal candle favorites and fragrances inspired by the time of year.",
  },
};

function formatCollection(collection: string) {
  return (
    collectionDetails[collection]?.label ??
    collection
      .replaceAll("-", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      )
  );
}

function getCollectionDescription(collection: string) {
  return (
    collectionDetails[collection]?.description ??
    "Browse candle and fragrance favorites currently available from Port Petals."
  );
}

function CandleProductCard({
  product,
}: {
  product: Awaited<
    ReturnType<typeof getPublishedCandles>
  >[number];
}) {
  const startingPrice = getStartingPrice(
    product.base_price,
    product.variants
  );

  const primaryImage =
    product.images[0]?.publicUrl ??
    "/collections/candles.jpg";

  return (
    <StoreProductCard
      href={`/candles/${product.slug}`}
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

export default async function CandlesPage() {
  const products = await getPublishedCandles();

  const rawCollections = Array.from(
    new Set(
      products.map(
        (product) => product.collection
      )
    )
  );

  const preferredOrder = [
    "candle-bouquets",
    "bouquets",
    "wax-melts",
    "melts",
    "tarts",
    "candle-tarts",
    "seasonal",
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

  const featuredProducts = products.filter(
    (product) => product.featured
  );

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#f7eadc]">
        <div className="absolute inset-0 -z-30 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_48%,#edf3e7_100%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
              Candles • Scents • Gifts
            </p>

            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              Cozy scents and easy gifts for any occasion.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52655d]">
              Browse candle bouquets, wax melts,
              candle tarts, seasonal scents, and
              giftable favorites from Port Petals.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#candle-collections"
                className="inline-flex rounded-full bg-[#e76d61] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
              >
                Shop Candles →
              </Link>

              <Link
                href="#candle-guide"
                className="inline-flex rounded-full border border-[#284239]/15 bg-white/70 px-6 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Find Your Favorite
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#607068]">
              <span>✓ Easy gift ideas</span>
              <span>✓ Multiple scent options</span>
              <span>✓ Pickup & local delivery</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_55px_rgba(42,66,57,0.15)]">
            <div className="relative aspect-[4/3]">
              <Image
                src="/heroes/candles.jpg"
                alt="Candles from Port Petals"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CANDLE GUIDE */}
      <section
        id="candle-guide"
        className="scroll-mt-28 border-y border-[#284239]/10 bg-[#fffaf3]"
      >
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Candle Guide
            </p>

            <h2 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
              Find the right kind of candle gift.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#607068]">
              Whether you are shopping for a full gift,
              a small add-on, or something cozy for home,
              there is an easy place to start.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Giftable Favorite
              </p>

              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#153f32]">
                Candle Bouquets
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                A more complete gift option for birthdays,
                celebrations, thank-yous, and thoughtful
                surprises.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Easy Add-On
              </p>

              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#153f32]">
                Wax Melts
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                An easy little gift or add-on for someone
                who enjoys changing scents throughout
                the season.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Everyday Favorite
              </p>

              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#153f32]">
                Candle Tarts
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Fragrance for wax warmers in an easy,
                giftable format for home or everyday use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION NAVIGATION */}
      {collections.length > 0 && (
        <section
          id="candle-collections"
          className="scroll-mt-28 border-b border-[#284239]/10 bg-white/50"
        >
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#8a978f]">
              Shop Candles
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

      {/* FEATURED CANDLES */}
      {featuredProducts.length > 0 && (
        <section className="bg-[#6f574b] text-[#fffaf3]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f1c8ad]">
                Featured Candles
              </p>

              <h2 className="mt-2 font-serif text-4xl font-semibold">
                Cozy favorites worth a closer look.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                Featured candle products and giftable
                favorites currently available from
                Port Petals.
              </p>
            </div>

            <div className="mt-8">
              <ProductCardCarousel visibleCount={3}>
                {featuredProducts.map((product) => {
                  const startingPrice =
                    getStartingPrice(
                      product.base_price,
                      product.variants
                    );

                  const primaryImage =
                    product.images[0]?.publicUrl ??
                    "/collections/candles.jpg";

                  return (
                    <Link
                      key={product.id}
                      href={`/candles/${product.slug}`}
                      className="group block h-full overflow-hidden rounded-[1.4rem] border border-white/15 bg-white/[0.08] transition hover:-translate-y-1 hover:border-[#f1c8ad]/60 hover:bg-white/[0.12]"
                    >
                      <div className="grid h-[190px] grid-cols-[120px_1fr] sm:grid-cols-[145px_1fr]">
                        <div className="overflow-hidden bg-[#fffaf3]">
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
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f1c8ad]">
                            Featured
                          </p>

                          <h3 className="mt-1 font-serif text-xl font-semibold leading-tight text-white">
                            {product.name}
                          </h3>

                          {product.short_description && (
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/65">
                              {product.short_description}
                            </p>
                          )}

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-[#f1c8ad]">
                              {startingPrice !== null
                                ? `From ${formatMoney(
                                    startingPrice
                                  )}`
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

      {/* PRODUCT COLLECTIONS */}
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        {products.length === 0 ? (
          <div className="rounded-[1.8rem] border border-[#284239]/10 bg-white/70 p-10 text-center">
            <h2 className="font-serif text-3xl font-semibold text-[#153f32]">
              New candle favorites are coming soon
            </h2>

            <p className="mt-4 text-[#607068]">
              Check back soon or call Port Petals for
              current candle availability.
            </p>
          </div>
        ) : (
          collections.map((collection, index) => {
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
                      Cozy Favorites
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
                        <CandleProductCard
                          key={product.id}
                          product={product}
                        />
                      )
                    )}
                  </ProductCardCarousel>
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* GIFTING GUIDANCE */}
      <section className="border-y border-[#284239]/10 bg-[#fffaf3]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
                Easy to Gift
              </p>

              <h2 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
                Add a little something extra.
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#607068]">
                Candle products make an easy addition
                to flowers, custom gifts, birthdays,
                thank-yous, or everyday surprises.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-[#f7eadc] p-6">
                <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                  Pair with Flowers
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#607068]">
                  Add a candle or wax melt alongside
                  fresh flowers for a more complete gift.
                </p>

                <Link
                  href="/flowers"
                  className="mt-4 inline-flex text-sm font-semibold text-[#e76d61]"
                >
                  Shop Flowers →
                </Link>
              </div>

              <div className="rounded-[1.5rem] bg-[#edf3e7] p-6">
                <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                  Pair with a Custom Gift
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#607068]">
                  Combine a cozy scent with something
                  personalized for an extra-thoughtful gift.
                </p>

                <Link
                  href="/custom"
                  className="mt-4 inline-flex text-sm font-semibold text-[#e76d61]"
                >
                  Browse Custom Gifts →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PICKUP / DELIVERY */}
      <section className="bg-[#edf3e7]">
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
                Local delivery available
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Eligible orders can be delivered
                locally. Delivery availability and
                fees are confirmed during checkout.
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
                Need Help Choosing?
              </p>

              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#153f32]">
                Ask Port Petals
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Looking for a particular scent or
                candle gift? Call or email Port Petals
                for current options.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="tel:+18146421253"
                  className="text-sm font-semibold text-[#e76d61]"
                >
                  Call Port Petals →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
