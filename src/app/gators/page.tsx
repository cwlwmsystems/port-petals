import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedGatorGear } from "@/lib/gators";
import ProductCardCarousel from "@/components/ProductCardCarousel";
import StoreProductCard from "@/components/StoreProductCard";

export const metadata: Metadata = {
  title:
    "Port Allegany Gator Gear, Apparel & Gifts",
  description:
    "Shop Port Allegany Gator gear, apparel, accessories, personalized player gifts, school-spirit items, and hometown favorites from Port Petals.",
  alternates: {
    canonical: "/gators",
  },
  openGraph: {
    title:
      "Port Allegany Gator Gear | Port Petals",
    description:
      "Shop Gator apparel, personalized player gear, accessories, school-spirit gifts, and hometown favorites from Port Petals.",
    url: "/gators",
  },
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
  "t-shirts": {
    label: "Gator T-Shirts",
    description:
      "Port Allegany shirts for game days, school spirit, gifts, and everyday Gator pride.",
  },
  hoodies: {
    label: "Hoodies & Sweatshirts",
    description:
      "Cozy Gator apparel for cool game nights, school events, and hometown spirit.",
  },
  accessories: {
    label: "Gator Accessories",
    description:
      "Small gifts, accessories, and everyday ways to show your Port Allegany pride.",
  },
  "player-personalized": {
    label: "Player & Personalized Gear",
    description:
      "Make it personal with Gator items created for players, families, fans, and special occasions.",
  },
  seasonal: {
    label: "Seasonal Gator Gear",
    description:
      "Seasonal school-spirit favorites for football season, Homecoming, graduation, and more.",
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
    "Browse Port Allegany Gator favorites from Port Petals."
  );
}

function GatorProductCard({
  product,
}: {
  product: Awaited<
    ReturnType<typeof getPublishedGatorGear>
  >[number];
}) {
  const startingPrice = getStartingPrice(
    product.base_price,
    product.variants
  );

  const primaryImage =
    product.images[0]?.publicUrl ??
    "/collections/gators.jpg";

  return (
    <StoreProductCard
      href={`/gators/${product.slug}`}
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
      maker={product.maker}
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

export default async function GatorsPage() {
  const products = await getPublishedGatorGear();

  const rawCollections = Array.from(
    new Set(products.map((product) => product.collection))
  );

  const preferredOrder = [
    "player-personalized",
    "t-shirts",
    "hoodies",
    "accessories",
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
      <section className="relative isolate overflow-hidden bg-[#151515] text-[#fffaf3]">
        <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_12%_30%,rgba(255,115,21,.24),transparent_30%),radial-gradient(circle_at_80%_55%,rgba(255,115,21,.10),transparent_34%)]" />

        <div className="pointer-events-none absolute inset-y-0 right-0 -z-20 hidden w-[48%] lg:block">
          <Image
            src="/port-gators.jpeg"
            alt=""
            fill
            aria-hidden="true"
            sizes="48vw"
            className="object-contain object-right opacity-[0.14] mix-blend-screen"
          />
        </div>

        <div className="absolute inset-x-0 top-0 h-1.5 bg-[#ff7315]" />

        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff8b3d]">
              Port Allegany • Gator Pride
            </p>

            <h1 className="mt-5 font-serif text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Gator Gear for game days, hometown pride & everything in between.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
              Shop Port Allegany apparel, accessories,
              personalized gear, gifts, and seasonal favorites
              from Port Petals.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#gator-collections"
                className="inline-flex rounded-full bg-[#ff7315] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e76500]"
              >
                Shop Gator Gear →
              </Link>

              <Link
                href="#player-personalized"
                className="inline-flex rounded-full border border-[#ff7315]/50 bg-[#ff7315]/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ff7315]/20"
              >
                Personalized Gear
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white/60">
              <span>✓ Port Allegany pride</span>
              <span>✓ Personalized options available</span>
              <span>✓ Pickup & local delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* LOCAL GATOR GEAR CONTEXT */}
      <section className="border-b border-[#284239]/10 bg-[#fffaf3] text-[#284239]">
        <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76500]">
                Port Allegany School Spirit
              </p>

              <p className="mt-3 max-w-3xl leading-7 text-[#607068]">
                Shop local Port Allegany Gator apparel, player-personalized
                items, accessories, school-spirit gifts, and seasonal gear for
                students, athletes, families, alumni, and fans.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/custom"
                className="rounded-full border border-[#284239]/15 bg-white px-5 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#ff7315]/50 hover:text-[#e76500]"
              >
                Personalized Items
              </Link>

              <Link
                href="/seasonal"
                className="rounded-full border border-[#284239]/15 bg-white px-5 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#ff7315]/50 hover:text-[#e76500]"
              >
                Seasonal Favorites
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION NAVIGATION */}
      {collections.length > 0 && (
        <section
          id="gator-collections"
          className="scroll-mt-28 border-y border-[#284239]/10 bg-white/50"
        >
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#8a978f]">
              Shop Gator Gear
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
                    className="rounded-full border border-[#284239]/15 bg-[#fffdf9] px-5 py-2.5 text-sm font-semibold text-[#284239] transition hover:border-[#ff7315]/50 hover:text-[#e76500]"
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

      {/* FEATURED GATOR GEAR */}
      {featuredProducts.length > 0 && (
        <section className="bg-[#1a1a1a] text-[#fffaf3]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ff7315]">
                  Featured Gator Gear
                </p>

                <h2 className="mt-2 font-serif text-4xl font-semibold">
                  Gator favorites worth a closer look.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                  Featured items selected from the current
                  Port Allegany Gator collection.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <ProductCardCarousel visibleCount={3}>
                {featuredProducts.map((product) => {
                  const startingPrice = getStartingPrice(
                    product.base_price,
                    product.variants
                  );

                  const primaryImage =
                    product.images[0]?.publicUrl ??
                    "/collections/gators.jpg";

                  return (
                    <Link
                      key={product.id}
                      href={`/gators/${product.slug}`}
                      className="group block h-full overflow-hidden rounded-[1.4rem] border border-[#ff7315]/20 bg-white/[0.07] transition hover:-translate-y-1 hover:border-[#ff7315]/45 hover:bg-white/[0.10]"
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
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ff9b55]">
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
                            <span className="text-sm font-semibold text-[#ff9b55]">
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

      {/* PERSONALIZATION GUIDANCE */}
      <section className="border-b border-[#284239]/10 bg-[#fffaf3]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76500]">
                Make It Personal
              </p>

              <h2 className="mt-2 font-serif text-3xl font-semibold text-[#153f32]">
                Gator gear can be more than school colors.
              </h2>
            </div>

            <div className="rounded-[1.4rem] border border-[#284239]/10 bg-white p-5">
              <h3 className="font-serif text-xl font-semibold text-[#153f32]">
                Player Gear
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#607068]">
                Personalized products may include a player
                name and number when that option is available
                on the item.
              </p>
            </div>

            <div className="rounded-[1.4rem] border border-[#284239]/10 bg-white p-5">
              <h3 className="font-serif text-xl font-semibold text-[#153f32]">
                Have Another Idea?
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#607068]">
                For something not listed online, contact
                Port Petals to discuss the sport, colors,
                style, and personalization you have in mind.
              </p>

              <Link
                href="/custom/request"
                className="mt-3 inline-flex text-sm font-semibold text-[#e76500]"
              >
                Ask About a Custom Order →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT COLLECTIONS */}
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        {products.length === 0 ? (
          <div className="rounded-[1.8rem] border border-[#284239]/10 bg-white/70 p-10 text-center">
            <h2 className="font-serif text-3xl font-semibold text-[#153f32]">
              Gator Gear is being updated
            </h2>

            <p className="mt-4 text-[#607068]">
              Check back soon for current Port Allegany
              Gator merchandise.
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
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76500]">
                      Port Allegany Gators
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

                <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                  {collectionProducts.map((product) => (
                    <GatorProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* ORDERING INFORMATION */}
      <section className="border-t border-[#284239]/10 bg-[#edf3e7]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76500]">
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
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76500]">
                Local Delivery
              </p>

              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#153f32]">
                Local delivery available
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Eligible orders can be delivered locally.
                Delivery availability and fees are confirmed
                during checkout.
              </p>

              <Link
                href="/fulfillment"
                className="mt-4 inline-flex text-sm font-semibold text-[#e76500]"
              >
                View Pickup & Delivery Details →
              </Link>
            </div>

            <div className="rounded-[1.5rem] bg-white/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76500]">
                Custom Gator Ideas
              </p>

              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#153f32]">
                Looking for something different?
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Call or email Port Petals to discuss a
                personalized Gator item or another custom idea.
              </p>

              <Link
                href="/custom/request"
                className="mt-4 inline-flex text-sm font-semibold text-[#e76500]"
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
