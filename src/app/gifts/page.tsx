import type { Metadata } from "next";
import Link from "next/link";
import StoreProductCard from "@/components/StoreProductCard";
import {
  getPublishedGiftProducts,
  type GiftProduct,
} from "@/lib/gifts";

export const metadata: Metadata = {
  title:
    "Gifts & Personalized Gifts in Port Allegany, PA",
  description:
    "Shop candles, personalized gifts, mugs, gift sets, slates, wood signs, and handmade decor from Port Petals in Port Allegany, Pennsylvania.",
  alternates: {
    canonical: "/gifts",
  },
  openGraph: {
    title:
      "Gifts & Personalized Gifts | Port Petals",
    description:
      "Shop thoughtful gifts, candles, personalized pieces, mugs, signs, gift sets, and handmade decor from Port Petals in Port Allegany.",
    url: "/gifts",
  },
};

const typeDetails: Record<
  string,
  {
    label: string;
    description: string;
  }
> = {
  "candle-bouquet": {
    label: "Candle Bouquets",
    description:
      "Gift-ready candle arrangements and thoughtful combinations.",
  },
  "wax-melt": {
    label: "Wax Melts",
    description:
      "Fragrance favorites for home, gifting, and everyday enjoyment.",
  },
  "gift-bouquet": {
    label: "Gift Bouquets",
    description:
      "Creative gift arrangements built around something special.",
  },
  "gift-set": {
    label: "Gift Sets",
    description:
      "Coordinated gifts bundled together for an easy, thoughtful choice.",
  },
  slate: {
    label: "Slates",
    description:
      "Decorative and personalized slate pieces for gifts and home decor.",
  },
  "wood-sign": {
    label: "Wood Signs",
    description:
      "Handmade and personalized signs for homes, celebrations, and gifts.",
  },
  mug: {
    label: "Mugs",
    description:
      "Personalized and themed mugs for everyday use or gifting.",
  },
  "custom-gift": {
    label: "Custom Gifts",
    description:
      "Personalized pieces created for a person, event, or special idea.",
  },
};

const preferredOrder = [
  "candle-bouquet",
  "wax-melt",
  "gift-bouquet",
  "gift-set",
  "slate",
  "wood-sign",
  "mug",
  "custom-gift",
];

function formatType(
  productType: string
) {
  return (
    typeDetails[productType]?.label ??
    productType
      .replaceAll("-", " ")
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      )
  );
}

function getTypeDescription(
  productType: string
) {
  return (
    typeDetails[productType]
      ?.description ??
    "Browse thoughtful gifts and decor from Port Petals."
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
  product: GiftProduct
) {
  switch (product.category) {
    case "candles":
      return `/candles/${product.slug}`;

    case "custom":
      return `/custom/${product.slug}`;

    case "gators":
      return `/gators/${product.slug}`;

    case "shirts":
      return `/shirts/${product.slug}`;

    case "flowers":
      return `/flowers/${product.slug}`;

    default:
      return `/custom/${product.slug}`;
  }
}

function GiftCard({
  product,
}: {
  product: GiftProduct;
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
      readyMade={
        product.ready_made
      }
      customizable={
        product.customizable
      }
      madeToOrder={
        product.made_to_order
      }
      leadTimeDays={
        product.lead_time_days
      }
      basePrice={
        product.base_price
      }
      trackInventory={
        product.track_inventory
      }
      quantity={
        product.quantity
      }
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

export default async function GiftsPage() {
  const products =
    await getPublishedGiftProducts();

  const rawTypes = Array.from(
    new Set(
      products
        .map(
          (product) =>
            product.product_type
        )
        .filter(
          (
            type
          ): type is string =>
            Boolean(type)
        )
    )
  );

  const productTypes =
    [...rawTypes].sort(
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

  const featuredProducts =
    products.filter(
      (product) =>
        product.featured
    );

  return (
    <main className="min-h-screen bg-[#faf7f1] text-[#284239]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-[#284239]/10 bg-[linear-gradient(135deg,#f7eee8_0%,#f3e9df_36%,#edf3e7_76%,#faf7f1_100%)]">
        <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-[#e7b7aa]/14 blur-3xl" />

        <div className="pointer-events-none absolute right-[4%] top-0 h-80 w-80 rounded-full bg-[#b9ccb6]/18 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-120px] left-[42%] h-80 w-80 rounded-full bg-white/60 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e76d61]">
              Gifts & Decor
            </p>

            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-5xl lg:text-6xl">
              Thoughtful gifts with a personal touch.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#52655d] sm:text-lg sm:leading-8">
              Shop candles,
              personalized gifts,
              mugs, slates, signs,
              gift sets, and handmade
              decor from Port Petals.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="#gift-shop"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
              >
                Shop Gifts & Decor
              </Link>

              <Link
                href="/custom/request"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#284239]/15 bg-white/70 px-6 py-3 text-sm font-semibold text-[#284239] backdrop-blur-sm transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Request Something Custom
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/55 p-6 shadow-[0_18px_55px_rgba(42,66,57,0.10)] backdrop-blur-[5px] sm:p-8">
            <div className="absolute inset-0 bg-white/10" />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
                Made for Gifting
              </p>

              <h2 className="mt-3 font-serif text-2xl font-semibold tracking-[-0.03em] text-[#153f32] sm:text-3xl">
                Ready-made favorites and custom creations
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#607068]">
                Find something ready to
                give or choose a
                customizable piece when
                you want something more
                personal.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/70 p-4">
                  <p className="font-semibold text-[#153f32]">
                    Ready to Gift
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#607068]">
                    Candles, gift sets,
                    mugs, decor, and
                    other shop favorites.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/70 p-4">
                  <p className="font-semibold text-[#153f32]">
                    Personalized
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#607068]">
                    Slates, signs,
                    custom gifts, and
                    made-to-order pieces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOCAL GIFT SHOP CONTEXT */}
      <section className="border-b border-[#284239]/10 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
            Gifts in Port Allegany
          </p>

          <div className="mt-3 grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
            <p className="max-w-3xl leading-7 text-[#607068]">
              Looking for a thoughtful local gift? Port Petals offers candles,
              personalized gifts, mugs, signs, gift sets, decor, and handmade
              creations for birthdays, thank-yous, celebrations, holidays, and
              everyday surprises.
            </p>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/custom"
                className="rounded-full border border-[#284239]/15 px-5 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Personalized Gifts
              </Link>

              <Link
                href="/occasions"
                className="rounded-full border border-[#284239]/15 px-5 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Gifts by Occasion
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK TYPE NAV */}
      {productTypes.length > 0 && (
        <section className="border-b border-[#284239]/10 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
            <div className="flex flex-wrap gap-2">
              {productTypes.map(
                (productType) => (
                  <Link
                    key={productType}
                    href={`#${productType}`}
                    className="rounded-full border border-[#284239]/10 bg-[#faf7f1] px-4 py-2 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                  >
                    {formatType(
                      productType
                    )}
                  </Link>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      <section
        id="gift-shop"
        className="scroll-mt-28"
      >
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
              The Gift Shop
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.035em] text-[#153f32] sm:text-4xl">
              Gifts, decor, and personalized favorites.
            </h2>

            <p className="mt-4 text-sm leading-6 text-[#607068] sm:text-base sm:leading-7">
              Browse ready-made items,
              handmade decor, and custom
              gift options from Port
              Petals.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="mt-10 rounded-[1.75rem] border border-[#284239]/10 bg-white p-8 text-center shadow-[0_12px_35px_rgba(42,66,57,0.05)] sm:p-10">
              <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                New gifts are coming soon.
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#607068]">
                Port Petals is always
                creating new gifts and
                decor. Contact the shop
                if you are looking for
                something specific.
              </p>

              <Link
                href="/custom/request"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#153f32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#284239]"
              >
                Request Something Custom
              </Link>
            </div>
          ) : (
            <>
              {featuredProducts.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                        Featured
                      </p>

                      <h3 className="mt-2 font-serif text-2xl font-semibold text-[#153f32] sm:text-3xl">
                        Port Petals favorites
                      </h3>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredProducts.map(
                      (product) => (
                        <GiftCard
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
              )}

              <div className="mt-14 space-y-14">
                {productTypes.map(
                  (productType) => {
                    const typeProducts =
                      products.filter(
                        (product) =>
                          product.product_type ===
                          productType
                      );

                    if (
                      typeProducts.length ===
                      0
                    ) {
                      return null;
                    }

                    return (
                      <section
                        key={
                          productType
                        }
                        id={
                          productType
                        }
                        className="scroll-mt-28"
                      >
                        <div className="max-w-3xl">
                          <h3 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#153f32]">
                            {formatType(
                              productType
                            )}
                          </h3>

                          <p className="mt-3 text-sm leading-6 text-[#607068]">
                            {getTypeDescription(
                              productType
                            )}
                          </p>
                        </div>

                        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {typeProducts.map(
                            (
                              product
                            ) => (
                              <GiftCard
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
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CUSTOM CTA */}
      <section className="bg-[#153f32]">
        <div className="mx-auto max-w-5xl px-5 py-14 text-center sm:px-8 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f1b6ad]">
            Have Something Else in Mind?
          </p>

          <h2 className="mx-auto mt-3 max-w-3xl font-serif text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
            Port Petals can make something more personal.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
            Share the occasion,
            recipient, colors, theme,
            or idea and ask about a
            custom gift or decor piece.
          </p>

          <div className="mt-7">
            <Link
              href="/custom/request"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
            >
              Request Something Custom
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
