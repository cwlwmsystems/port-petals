import type { Metadata } from "next";
import Link from "next/link";
import StoreProductCard from "@/components/StoreProductCard";
import {
  getPublishedApparelProducts,
  type ApparelProduct,
} from "@/lib/apparel";

export const metadata: Metadata = {
  title: "Custom Apparel & Shirts in Port Allegany, PA",
  description:
    "Shop custom shirts, hoodies, crewnecks, and personalized apparel from Port Petals in Port Allegany, Pennsylvania.",
  alternates: {
    canonical: "/apparel",
  },
  openGraph: {
    title: "Custom Apparel & Shirts | Port Petals",
    description:
      "Custom shirts, wearable gifts, personalized apparel, and Port Petals designs.",
    url: "/apparel",
  },
};

const collectionDetails: Record<
  string,
  {
    label: string;
    description: string;
  }
> = {
  apparel: {
    label: "Apparel",
    description:
      "Custom shirts and wearable designs from Port Petals.",
  },
  custom: {
    label: "Custom Apparel",
    description:
      "Personalized shirts and made-to-order wearable designs.",
  },
  seasonal: {
    label: "Seasonal Apparel",
    description:
      "Limited seasonal shirts and wearable designs.",
  },
  sports: {
    label: "Sports & Spirit",
    description:
      "School spirit, team-inspired, and hometown apparel.",
  },
  gifts: {
    label: "Giftable Apparel",
    description:
      "Wearable gifts designed for birthdays, holidays, and special occasions.",
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
    "Browse custom apparel and wearable designs from Port Petals."
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

function ApparelCard({
  product,
}: {
  product: ApparelProduct;
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
      href={`/apparel/${product.slug}`}
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

export default async function ApparelPage() {
  const products =
    await getPublishedApparelProducts();

  const collections =
    Array.from(
      new Set(
        products
          .map(
            (product) =>
              product.collection
          )
          .filter(Boolean)
      )
    ).sort();

  const featuredProducts =
    products.filter(
      (product) =>
        product.featured
    );

  return (
    <main className="min-h-screen bg-[#faf7f1] text-[#284239]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-[#284239]/10 bg-[linear-gradient(135deg,#f2ebe2_0%,#f3e5df_38%,#e9efe7_76%,#faf7f1_100%)]">
        <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-[#d9b5aa]/15 blur-3xl" />

        <div className="pointer-events-none absolute right-[4%] top-0 h-80 w-80 rounded-full bg-[#b8c9b5]/18 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-120px] left-[42%] h-80 w-80 rounded-full bg-white/60 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e76d61]">
              Apparel
            </p>

            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-5xl lg:text-6xl">
              Custom apparel made to wear and gift.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#52655d] sm:text-lg sm:leading-8">
              Shop custom shirts,
              crewnecks, hoodies,
              personalized designs,
              and wearable gifts from
              Port Petals.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="#apparel-shop"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
              >
                Shop Apparel
              </Link>

              <Link
                href="/custom/request"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#284239]/15 bg-white/70 px-6 py-3 text-sm font-semibold text-[#284239] backdrop-blur-sm transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Request a Custom Design
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/55 p-6 shadow-[0_18px_55px_rgba(42,66,57,0.10)] backdrop-blur-[5px] sm:p-8">
            <div className="absolute inset-0 bg-white/10" />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
                Made Your Way
              </p>

              <h2 className="mt-3 font-serif text-2xl font-semibold tracking-[-0.03em] text-[#153f32] sm:text-3xl">
                Shirts, crewnecks, hoodies, and custom designs
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#607068]">
                Choose a design you
                love and select the
                garment options
                available for that
                product.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/70 p-4">
                  <p className="font-semibold text-[#153f32]">
                    Customizable
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#607068]">
                    Select available
                    sizes, garment
                    types, and product
                    options.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/70 p-4">
                  <p className="font-semibold text-[#153f32]">
                    Made to Order
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#607068]">
                    Many apparel items
                    are prepared after
                    your order is
                    placed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK NAV */}
      {collections.length > 1 && (
        <section className="border-b border-[#284239]/10 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
            <div className="flex flex-wrap gap-2">
              {collections.map(
                (collection) => (
                  <Link
                    key={collection}
                    href={`#${collection}`}
                    className="rounded-full border border-[#284239]/10 bg-[#faf7f1] px-4 py-2 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                  >
                    {formatCollection(
                      collection
                    )}
                  </Link>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* SHOP */}
      <section
        id="apparel-shop"
        className="scroll-mt-28"
      >
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
              Apparel Shop
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.035em] text-[#153f32] sm:text-4xl">
              Wear something made a little more personal.
            </h2>

            <p className="mt-4 text-sm leading-6 text-[#607068] sm:text-base sm:leading-7">
              Browse available shirts
              and apparel designs,
              then choose the options
              offered for each item.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="mt-10 rounded-[1.75rem] border border-[#284239]/10 bg-white p-8 text-center shadow-[0_12px_35px_rgba(42,66,57,0.05)] sm:p-10">
              <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                New apparel is coming soon.
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#607068]">
                Contact Port Petals if
                you have a shirt or
                custom apparel idea in
                mind.
              </p>

              <Link
                href="/custom/request"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#153f32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#284239]"
              >
                Request a Custom Design
              </Link>
            </div>
          ) : (
            <>
              {featuredProducts.length > 0 && (
                <div className="mt-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                    Featured
                  </p>

                  <h3 className="mt-2 font-serif text-2xl font-semibold text-[#153f32] sm:text-3xl">
                    Port Petals favorites
                  </h3>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredProducts.map(
                      (product) => (
                        <ApparelCard
                          key={product.id}
                          product={product}
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="mt-14 space-y-14">
                {collections.length > 0 ? (
                  collections.map(
                    (collection) => {
                      const collectionProducts =
                        products.filter(
                          (product) =>
                            product.collection ===
                            collection
                        );

                      return (
                        <section
                          key={collection}
                          id={collection}
                          className="scroll-mt-28"
                        >
                          <div className="max-w-3xl">
                            <h3 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[#153f32]">
                              {formatCollection(
                                collection
                              )}
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-[#607068]">
                              {getCollectionDescription(
                                collection
                              )}
                            </p>
                          </div>

                          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {collectionProducts.map(
                              (product) => (
                                <ApparelCard
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
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map(
                      (product) => (
                        <ApparelCard
                          key={product.id}
                          product={product}
                        />
                      )
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#153f32]">
        <div className="mx-auto max-w-5xl px-5 py-14 text-center sm:px-8 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f1b6ad]">
            Need Something Different?
          </p>

          <h2 className="mx-auto mt-3 max-w-3xl font-serif text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
            Ask about a custom apparel design.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
            Share the idea, occasion,
            wording, colors, or design
            direction and Port Petals
            can help you plan a custom
            piece.
          </p>

          <div className="mt-7">
            <Link
              href="/custom/request"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
            >
              Request Custom Apparel
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
