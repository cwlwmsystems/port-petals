import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedCustomItems } from "@/lib/custom-items";
import ProductCardCarousel from "@/components/ProductCardCarousel";
import StoreProductCard from "@/components/StoreProductCard";

export const metadata: Metadata = {
  alternates: {
    canonical: "/custom",
  },
  openGraph: {
    title: "Custom Items",
    description:
      "Browse personalized gifts, sports designs, seasonal decor, tumblers, woodcrafts, and custom items from Port Petals in Port Allegany, Pennsylvania.",
    url: "/custom",
  },
  title: "Custom Items",
  description:
    "Browse personalized gifts, sports designs, seasonal decor, tumblers, woodcrafts, and custom items from Port Petals in Port Allegany, Pennsylvania.",
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
  sports: {
    label: "Sports & Team Designs",
    description:
      "Personalized sports gifts and team-inspired creations for players, families, fans, and special occasions.",
  },
  "personalized-signs": {
    label: "Personalized Signs",
    description:
      "Custom signs created for homes, gifts, celebrations, teams, and meaningful moments.",
  },
  seasonal: {
    label: "Seasonal & Holiday",
    description:
      "Handmade and personalized pieces for holidays, seasons, and special celebrations throughout the year.",
  },
  "door-decor": {
    label: "Door & Wall Decor",
    description:
      "Decorative pieces for doors, walls, homes, gifts, and seasonal displays.",
  },
  tumblers: {
    label: "Custom Tumblers",
    description:
      "Personalized tumblers and drinkware made with names, themes, colors, and designs.",
  },
  woodcrafts: {
    label: "Custom Woodcrafts",
    description:
      "Handmade wood pieces and personalized creations designed for gifting and decorating.",
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
    "Browse personalized and handmade creations from Port Petals."
  );
}

function CustomProductCard({
  product,
}: {
  product: Awaited<
    ReturnType<typeof getPublishedCustomItems>
  >[number];
}) {
  const startingPrice = getStartingPrice(
    product.base_price,
    product.variants
  );

  const primaryImage =
    product.images[0]?.publicUrl ??
    "/collections/customized-items.jpg";

  return (
    <StoreProductCard
      href={`/custom/${product.slug}`}
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

export default async function CustomItemsPage() {
  const products = await getPublishedCustomItems();

  const rawCollections = Array.from(
    new Set(
      products.map(
        (product) => product.collection
      )
    )
  );

  const preferredOrder = [
    "sports",
    "personalized-signs",
    "seasonal",
    "door-decor",
    "tumblers",
    "woodcrafts",
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

  const readyToOrderCount = products.filter(
    (product) =>
      product.ready_made ||
      (!product.customizable &&
        !product.made_to_order)
  ).length;

  const customizableCount = products.filter(
    (product) =>
      product.customizable ||
      product.made_to_order
  ).length;

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#f7eadc]">
        <div className="absolute inset-0 -z-30 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_48%,#edf3e7_100%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
              Custom Items • Personalized Gifts
            </p>

            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              Thoughtful pieces made with a personal touch.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52655d]">
              Shop personalized gifts, sports designs,
              seasonal decor, tumblers, woodcrafts,
              and other creative Port Petals favorites.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#custom-collections"
                className="inline-flex rounded-full bg-[#e76d61] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
              >
                Shop Custom Items →
              </Link>

              <Link
                href="/custom/request"
                className="inline-flex rounded-full border border-[#284239]/15 bg-white/70 px-6 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Have Something Else in Mind?
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#607068]">
              <span>✓ Personalized options</span>
              <span>✓ Handmade & made-to-order items</span>
              <span>✓ Pickup & local delivery</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_55px_rgba(42,66,57,0.15)]">
            <div className="relative aspect-[4/3]">
              <Image
                src="/heroes/custom.jpg"
                alt="Custom items from Port Petals"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SHOP ONLINE VS CUSTOM CONTACT */}
      <section className="border-y border-[#284239]/10 bg-[#fffaf3]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[1.6rem] border border-[#284239]/10 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                Shop Online
              </p>

              <h2 className="mt-2 font-serif text-3xl font-semibold text-[#153f32]">
                See something you like?
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Browse current products and choose any
                available options or personalization
                directly from the product page.
              </p>

              {(readyToOrderCount > 0 ||
                customizableCount > 0) && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {readyToOrderCount > 0 && (
                    <span className="rounded-full bg-[#edf3e7] px-4 py-2 text-xs font-semibold text-[#284239]">
                      {readyToOrderCount} ready to browse
                    </span>
                  )}

                  {customizableCount > 0 && (
                    <span className="rounded-full bg-[#f7eadc] px-4 py-2 text-xs font-semibold text-[#284239]">
                      {customizableCount} customizable
                    </span>
                  )}
                </div>
              )}

              <Link
                href="#custom-collections"
                className="mt-5 inline-flex text-sm font-semibold text-[#e76d61]"
              >
                Browse Custom Items →
              </Link>
            </div>

            <div className="rounded-[1.6rem] bg-[#284239] p-6 text-[#fffaf3]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a8e69a]">
                One-of-a-Kind Ideas
              </p>

              <h2 className="mt-2 font-serif text-3xl font-semibold">
                Have something completely different in mind?
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/75">
                Contact Port Petals directly with your
                idea, colors, occasion, budget, and
                timing. We can talk through what you
                have in mind.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="tel:+18146421253"
                  className="rounded-full bg-[#e76d61] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
                >
                  Call 814-642-1253
                </a>

                <a
                  href="mailto:stacy@portpetals.com?subject=Custom%20Order%20Inquiry"
                  className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Email Port Petals
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION NAVIGATION */}
      {collections.length > 0 && (
        <section
          id="custom-collections"
          className="scroll-mt-28 border-b border-[#284239]/10 bg-white/50"
        >
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#8a978f]">
              Shop Custom Items
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

      {/* FEATURED CUSTOM ITEMS */}
      {featuredProducts.length > 0 && (
        <section className="bg-[#74566b] text-[#fffaf3]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f7cbd8]">
                Featured Creations
              </p>

              <h2 className="mt-2 font-serif text-4xl font-semibold">
                Personalized favorites worth a closer look.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                Browse featured custom items and
                personalized creations currently
                available from Port Petals.
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
                    "/collections/customized-items.jpg";

                  return (
                    <Link
                      key={product.id}
                      href={`/custom/${product.slug}`}
                      className="group block h-full overflow-hidden rounded-[1.4rem] border border-white/15 bg-white/[0.08] transition hover:-translate-y-1 hover:border-[#f7cbd8]/60 hover:bg-white/[0.12]"
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
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f7cbd8]">
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
                            <span className="text-sm font-semibold text-[#f7cbd8]">
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
              New custom creations are coming soon
            </h2>

            <p className="mt-4 text-[#607068]">
              Have something specific in mind?
              Contact Port Petals directly to discuss
              your idea.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="tel:+18146421253"
                className="rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white"
              >
                Call Port Petals
              </a>

              <a
                href="mailto:stacy@portpetals.com?subject=Custom%20Order%20Inquiry"
                className="rounded-full border border-[#284239]/15 bg-white px-6 py-3 font-semibold text-[#284239]"
              >
                Email Port Petals
              </a>
            </div>
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
                      Made with a Personal Touch
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
                  {collectionProducts.map(
                    (product) => (
                      <CustomProductCard
                        key={product.id}
                        product={product}
                      />
                    )
                  )}
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* CUSTOM CONTACT */}
      <section className="bg-[#284239] text-[#fffaf3]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a8e69a]">
              Have Another Idea?
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold">
              Port Petals can create more than what you see online.
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-[#e7dedc]">
              If you have a different design,
              personalization, theme, color palette,
              or project in mind, call or email Port
              Petals directly.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+18146421253"
              className="inline-flex items-center justify-center rounded-full bg-[#e76d61] px-7 py-3.5 font-semibold text-white transition hover:bg-[#d85b50]"
            >
              Call Port Petals
            </a>

            <a
              href="mailto:stacy@portpetals.com?subject=Custom%20Order%20Inquiry"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              Email Port Petals
            </a>
          </div>
        </div>
      </section>

      {/* PICKUP / DELIVERY */}
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
                Local delivery available
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Eligible orders can be delivered locally.
                Delivery availability and fees are confirmed
                during checkout.
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
                Custom Timing
              </p>

              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#153f32]">
                Planning something special?
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Custom and made-to-order pieces may
                require additional preparation time.
                Contact Port Petals early when you have
                a specific date in mind.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
