import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import StoreProductCard from "@/components/StoreProductCard";
import {
  getPublishedSeasonalProducts,
  type SeasonalProduct,
} from "@/lib/seasonal";

export const metadata: Metadata = {
  title: "Seasonal Gifts & Decor",
  description:
    "Shop seasonal ornaments, florals, decor, gifts, apparel, and holiday creations from Port Petals in Port Allegany, Pennsylvania.",
  alternates: {
    canonical: "/seasonal",
  },
  openGraph: {
    title: "Seasonal Gifts & Decor",
    description:
      "Seasonal ornaments, florals, decor, gifts, apparel, and holiday creations from Port Petals.",
    url: "/seasonal",
  },
};

type Season =
  | "spring"
  | "summer"
  | "autumn"
  | "winter";

function getCurrentSeason(): Season {
  const month = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      month: "numeric",
    }).format(new Date())
  );

  if (month >= 3 && month <= 5) {
    return "spring";
  }

  if (month >= 6 && month <= 8) {
    return "summer";
  }

  if (month >= 9 && month <= 11) {
    return "autumn";
  }

  return "winter";
}

const seasonalHero = {
  spring: {
    eyebrow: "Spring at Port Petals",
    title: "Fresh color for a new season.",
    description:
      "Celebrate spring with fresh florals, Easter gifts, personalized pieces, and bright seasonal creations.",
    background:
      "bg-[linear-gradient(135deg,#f7eee8_0%,#f4e7ef_34%,#edf3e7_72%,#faf7f1_100%)]",
    accent: "text-[#b45f75]",
    decoration: "spring",
  },

  summer: {
    eyebrow: "Summer at Port Petals",
    title: "Bright gifts for sunny days.",
    description:
      "Shop colorful florals, summer gifts, personalized creations, and seasonal favorites made for celebrations.",
    background:
      "bg-[linear-gradient(135deg,#fff3d6_0%,#f8e1dc_40%,#edf3e7_78%,#faf7f1_100%)]",
    accent: "text-[#c45d42]",
    decoration: "summer",
  },

  autumn: {
    eyebrow: "Autumn at Port Petals",
    title: "Warm color for the coziest season.",
    description:
      "Shop autumn florals, ornaments, seasonal decor, personalized gifts, and handmade creations inspired by fall.",
    background:
      "bg-[linear-gradient(135deg,#f3dfc2_0%,#edc6a5_35%,#d8d7b4_70%,#f7f1e8_100%)]",
    accent: "text-[#9b5031]",
    decoration: "autumn",
  },

  winter: {
    eyebrow: "Winter at Port Petals",
    title:
      "Meaningful gifts for the holiday season.",
    description:
      "Shop Christmas ornaments, winter florals, personalized gifts, decor, and seasonal keepsakes.",
    background:
      "bg-[linear-gradient(135deg,#eef3f1_0%,#e1ebed_38%,#edf3e7_72%,#faf7f1_100%)]",
    accent: "text-[#476b68]",
    decoration: "winter",
  },
} satisfies Record<
  Season,
  {
    eyebrow: string;
    title: string;
    description: string;
    background: string;
    accent: string;
    decoration: Season;
  }
>;

const collectionDetails: Record<
  string,
  {
    label: string;
    description: string;
  }
> = {
  christmas: {
    label: "Christmas",
    description:
      "Ornaments, gifts, decor, and seasonal creations for Christmas.",
  },

  fall: {
    label: "Fall",
    description:
      "Warm florals, decor, gifts, and seasonal favorites inspired by autumn.",
  },

  thanksgiving: {
    label: "Thanksgiving",
    description:
      "Seasonal florals, hostess gifts, and decor for Thanksgiving gatherings.",
  },

  halloween: {
    label: "Halloween",
    description:
      "Playful seasonal gifts, decor, and limited Halloween creations.",
  },

  valentines: {
    label: "Valentine's Day",
    description:
      "Flowers, gifts, decor, and personalized pieces for Valentine's Day.",
  },

  easter: {
    label: "Easter",
    description:
      "Spring-inspired gifts, florals, decor, and personalized seasonal items.",
  },

  spring: {
    label: "Spring",
    description:
      "Fresh seasonal colors, florals, decor, and gifts for spring.",
  },

  summer: {
    label: "Summer",
    description:
      "Bright seasonal products, gifts, apparel, and decor for summer.",
  },

  graduation: {
    label: "Graduation",
    description:
      "Flowers, keepsakes, gifts, and personalized pieces for graduates.",
  },

  homecoming: {
    label: "Homecoming",
    description:
      "Seasonal school-spirit gifts, flowers, keepsakes, and event items.",
  },

  seasonal: {
    label: "Seasonal Favorites",
    description:
      "Rotating seasonal gifts, decor, florals, and limited creations.",
  },
};

function formatCollection(
  collection: string
) {
  return (
    collectionDetails[collection]?.label ??
    collection
      .replaceAll("-", " ")
      .replace(
        /\b\w/g,
        (letter) => letter.toUpperCase()
      )
  );
}

function getCollectionDescription(
  collection: string
) {
  return (
    collectionDetails[collection]
      ?.description ??
    "Browse seasonal creations from Port Petals."
  );
}

function getStartingPrice(
  basePrice: number | null,
  variants: {
    price: number | null;
  }[]
) {
  const prices = [
    ...(basePrice !== null
      ? [basePrice]
      : []),

    ...variants
      .map(
        (variant) =>
          variant.price
      )
      .filter(
        (
          price
        ): price is number =>
          price !== null
      ),
  ];

  return prices.length > 0
    ? Math.min(...prices)
    : null;
}

function getProductHref(
  product: SeasonalProduct
) {
  switch (product.category) {
    case "flowers":
      return `/flowers/${product.slug}`;

    case "candles":
      return `/candles/${product.slug}`;

    case "shirts":
      return `/apparel/${product.slug}`;

    case "gators":
      return `/gators/${product.slug}`;

    case "custom":
    default:
      return `/custom/${product.slug}`;
  }
}

function SeasonalCard({
  product,
}: {
  product: SeasonalProduct;
}) {
  const startingPrice =
    getStartingPrice(
      product.base_price,
      product.variants
    );

  const primaryImage =
    product.images[0]?.publicUrl ??
    "/collections/custom.jpg";

  return (
    <StoreProductCard
      href={getProductHref(product)}
      productId={product.id}
      slug={product.slug}
      name={product.name}
      shortDescription={
        product.short_description
      }
      imageUrl={primaryImage}
      imageAlt={
        product.images[0]?.alt_text ??
        product.name
      }
      startingPrice={startingPrice}
      featured={product.featured}
      maker={product.maker}
      readyMade={product.ready_made}
      customizable={
        product.customizable
      }
      madeToOrder={
        product.made_to_order
      }
      leadTimeDays={
        product.lead_time_days
      }
      basePrice={product.base_price}
      trackInventory={
        product.track_inventory
      }
      quantity={product.quantity}
      variants={product.variants.map(
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

export default async function SeasonalPage() {
  const products =
    await getPublishedSeasonalProducts();
  const season =
    getCurrentSeason();


  const hero =
    seasonalHero[season];

  const rawCollections =
    Array.from(
      new Set(
        products.map(
          (product) =>
            product.collection
        )
      )
    );

  const preferredOrder = [
    "christmas",
    "fall",
    "thanksgiving",
    "halloween",
    "valentines",
    "easter",
    "spring",
    "summer",
    "graduation",
    "homecoming",
    "seasonal",
  ];

  const collections =
    [...rawCollections].sort(
      (a, b) => {
        const aIndex =
          preferredOrder.indexOf(a);

        const bIndex =
          preferredOrder.indexOf(b);

        if (
          aIndex === -1 &&
          bIndex === -1
        ) {
          return a.localeCompare(b);
        }

        if (aIndex === -1) {
          return 1;
        }

        if (bIndex === -1) {
          return -1;
        }

        return aIndex - bIndex;
      }
    );

  const ornamentProducts =
    products.filter(
      (product) =>
        product.product_type ===
        "ornament"
    );

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      {/* SEASON-AWARE HERO */}
      <section
        className={`relative isolate overflow-hidden border-b border-[#284239]/10 ${hero.background}`}
      >
        <div className="pointer-events-none absolute inset-0 z-0 bg-white/10" />

        {/* AUTUMN WASH */}
        {hero.decoration ===
          "autumn" && (
          <>
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <Image
                src="/seasonal/autumn-leaves.png"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-top opacity-[0.30] mix-blend-multiply"
              />
            </div>

            <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(247,241,232,0.58)_0%,rgba(247,241,232,0.34)_48%,rgba(247,241,232,0.54)_100%)]" />

            <div className="pointer-events-none absolute -bottom-24 -left-16 z-[2] h-72 w-72 rounded-full bg-[#a65331]/10 blur-3xl" />

            <div className="pointer-events-none absolute -right-24 top-8 z-[2] h-80 w-80 rounded-full bg-[#d69a3e]/10 blur-3xl" />
          </>
        )}

        {/* SPRING WASH */}
        {hero.decoration ===
          "spring" && (
          <>
            <div className="pointer-events-none absolute -left-12 top-6 z-[1] h-64 w-64 rounded-full bg-[#d99aae]/12 blur-3xl" />

            <div className="pointer-events-none absolute right-[8%] top-8 z-[1] h-64 w-64 rounded-full bg-[#9dbb91]/12 blur-3xl" />

            <div className="pointer-events-none absolute bottom-[-100px] left-[34%] z-[1] h-72 w-72 rounded-full bg-[#c9acd2]/12 blur-3xl" />

            <div className="pointer-events-none absolute left-[28%] top-16 z-[1] h-20 w-12 rotate-[25deg] rounded-[70%_30%_70%_30%] bg-[#e6b6c4]/14" />

            <div className="pointer-events-none absolute right-[25%] bottom-12 z-[1] h-24 w-14 rotate-[-20deg] rounded-[70%_30%_70%_30%] bg-[#a8c6a1]/14" />
          </>
        )}

        {/* SUMMER WASH */}
        {hero.decoration ===
          "summer" && (
          <>
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <Image
                src="/seasonal/beach-summer.png"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-center opacity-[0.42] mix-blend-multiply"
              />
            </div>

            <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(255,243,214,0.42)_0%,rgba(248,225,220,0.24)_48%,rgba(237,243,231,0.36)_100%)]" />

            <div className="pointer-events-none absolute -right-20 -top-20 z-[2] h-80 w-80 rounded-full bg-[#e5b84c]/12 blur-3xl" />

            <div className="pointer-events-none absolute left-[5%] top-8 z-[2] h-64 w-64 rounded-full bg-[#e76d61]/10 blur-3xl" />

            <div className="pointer-events-none absolute bottom-[-100px] right-[30%] z-[2] h-72 w-72 rounded-full bg-[#7e9c70]/12 blur-3xl" />
          </>
        )}

        {/* WINTER WASH */}
        {hero.decoration ===
          "winter" && (
          <>
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <Image
                src="/seasonal/snow-falling.jpg"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-center opacity-[0.22] mix-blend-soft-light"
              />
            </div>

            <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(238,243,241,0.64)_0%,rgba(225,235,237,0.42)_48%,rgba(237,243,231,0.60)_100%)]" />

            <div className="pointer-events-none absolute -right-16 top-0 z-[2] h-72 w-72 rounded-full bg-[#9ab9c0]/12 blur-3xl" />

            <div className="pointer-events-none absolute left-[5%] top-6 z-[2] h-64 w-64 rounded-full bg-white/45 blur-3xl" />

            <div className="pointer-events-none absolute bottom-[-90px] left-[34%] z-[2] h-72 w-72 rounded-full bg-[#78998a]/10 blur-3xl" />
          </>
        )}

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:py-20">
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-[0.28em] ${hero.accent}`}
            >
              {hero.eyebrow}
            </p>

            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#52655d] sm:text-lg sm:leading-8">
              {hero.description}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="#seasonal-shop"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
              >
                Shop Seasonal
              </Link>

              <Link
                href="/custom/request"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#284239]/15 bg-white/70 px-6 py-3 text-sm font-semibold text-[#284239] backdrop-blur-sm transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Request Something Custom
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/45 p-6 shadow-[0_18px_55px_rgba(42,66,57,0.12)] backdrop-blur-[4px] sm:p-8">
            <div className="absolute inset-0 bg-white/10" />

            <div className="relative">
              <p
                className={`text-xs font-semibold uppercase tracking-[0.2em] ${hero.accent}`}
              >
                Seasonal Shop
              </p>

              <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
                Ornaments,
                seasonal flowers
                & handmade gifts
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#52655d]">
                Seasonal selections
                rotate throughout the
                year. Some pieces are
                ready-made while others
                can be personalized or
                created to order.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/60 bg-white/55 p-4 backdrop-blur-sm">
                  <p className="font-semibold text-[#153f32]">
                    Ornaments
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#607068]">
                    Personalized,
                    school-spirit,
                    holiday, and
                    keepsake styles.
                  </p>
                </div>

                <div className="rounded-xl border border-white/60 bg-white/55 p-4 backdrop-blur-sm">
                  <p className="font-semibold text-[#153f32]">
                    Seasonal Florals
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#607068]">
                    Fresh designs
                    inspired by each
                    season and holiday.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION NAVIGATION */}
      {collections.length > 0 && (
        <section
          id="seasonal-shop"
          className="scroll-mt-28 border-b border-[#284239]/10 bg-white/55"
        >
          <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#8a978f]">
              Shop the Season
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {ornamentProducts.length >
                0 && (
                <a
                  href="#ornaments"
                  className="rounded-full border border-[#e76d61]/25 bg-[#fff7f4] px-5 py-2.5 text-sm font-semibold text-[#a7473f]"
                >
                  Ornaments
                  <span className="ml-2 text-xs font-normal">
                    {
                      ornamentProducts.length
                    }
                  </span>
                </a>
              )}

              {collections.map(
                (collection) => {
                  const count =
                    products.filter(
                      (product) =>
                        product.collection ===
                        collection
                    ).length;

                  return (
                    <a
                      key={collection}
                      href={`#collection-${collection}`}
                      className="rounded-full border border-[#284239]/15 bg-[#fffdf9] px-5 py-2.5 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                    >
                      {formatCollection(
                        collection
                      )}

                      <span className="ml-2 text-xs font-normal text-[#8a978f]">
                        {count}
                      </span>
                    </a>
                  );
                }
              )}
            </div>
          </div>
        </section>
      )}

      {/* ORNAMENT SPOTLIGHT */}
      {ornamentProducts.length >
        0 && (
        <section
          id="ornaments"
          className="scroll-mt-28 bg-[#153f32] text-white"
        >
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f3b0a9]">
                Seasonal Ornaments
              </p>

              <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Keepsakes made
                for the season.
              </h2>

              <p className="mt-4 text-base leading-7 text-white/70">
                Browse
                personalized,
                school-spirit,
                holiday, and
                keepsake
                ornaments from
                Port Petals.
              </p>
            </div>

            <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {ornamentProducts.map(
                (product) => (
                  <SeasonalCard
                    key={
                      product.id
                    }
                    product={
                      product
                    }
                  />
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* SEASONAL COLLECTIONS */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        {products.length === 0 ? (
          <div className="rounded-[1.8rem] border border-[#284239]/10 bg-white/70 p-8 text-center sm:p-10">
            <h2 className="font-serif text-3xl font-semibold text-[#153f32]">
              Seasonal selections are
              being updated
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#607068]">
              Check back soon or
              contact Port Petals for
              current ornaments,
              seasonal florals, gifts,
              and custom options.
            </p>

            <Link
              href="/custom/request"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 text-sm font-semibold text-white"
            >
              Contact Port Petals
            </Link>
          </div>
        ) : (
          collections.map(
            (
              collection,
              index
            ) => {
              const collectionProducts =
                products.filter(
                  (product) =>
                    product.collection ===
                      collection &&
                    product.product_type !==
                      "ornament"
                );

              if (
                collectionProducts.length ===
                0
              ) {
                return null;
              }

              return (
                <section
                  key={collection}
                  id={`collection-${collection}`}
                  className={
                    index === 0
                      ? "scroll-mt-32"
                      : "mt-16 scroll-mt-32 border-t border-[#284239]/10 pt-16"
                  }
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                        Seasonal
                        Collection
                      </p>

                      <h2 className="mt-2 font-serif text-3xl font-semibold text-[#153f32] sm:text-4xl">
                        {formatCollection(
                          collection
                        )}
                      </h2>

                      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068]">
                        {getCollectionDescription(
                          collection
                        )}
                      </p>
                    </div>

                    <p className="text-sm font-medium text-[#8a978f]">
                      {
                        collectionProducts.length
                      }{" "}
                      {collectionProducts.length ===
                      1
                        ? "item"
                        : "items"}
                    </p>
                  </div>

                  <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                    {collectionProducts.map(
                      (
                        product
                      ) => (
                        <SeasonalCard
                          key={
                            product.id
                          }
                          product={
                            product
                          }
                        />
                      )
                    )}
                  </div>
                </section>
              );
            }
          )
        )}
      </div>

      {/* SEASONAL INFORMATION */}
      <section className="border-t border-[#284239]/10 bg-[#edf3e7]">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-14 sm:px-8 md:grid-cols-3 lg:px-10">
          <div className="rounded-[1.5rem] bg-white/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
              Personalization
            </p>

            <h3 className="mt-2 font-serif text-2xl font-semibold text-[#153f32]">
              Make it personal
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#607068]">
              Many seasonal
              ornaments, gifts,
              signs, and keepsakes
              can be personalized.
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-white/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
              Limited Seasonal
              Availability
            </p>

            <h3 className="mt-2 font-serif text-2xl font-semibold text-[#153f32]">
              Selections rotate
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#607068]">
              Seasonal inventory
              and designs may
              change as holidays
              and seasons change.
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-white/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
              Need Something
              Different?
            </p>

            <h3 className="mt-2 font-serif text-2xl font-semibold text-[#153f32]">
              Ask Port Petals
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#607068]">
              Have a specific
              theme, color,
              ornament, or gift
              idea in mind?
              Custom requests are
              welcome.
            </p>

            <Link
              href="/custom/request"
              className="mt-4 inline-flex text-sm font-semibold text-[#e76d61]"
            >
              Request Something
              Custom →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
