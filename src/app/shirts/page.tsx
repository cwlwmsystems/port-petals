import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbStructuredData } from "@/lib/seo/breadcrumbs";
import Image from "next/image";
import Link from "next/link";
import { getPublishedShirts } from "@/lib/shirts";
import ProductCardCarousel from "@/components/ProductCardCarousel";
import StoreProductCard from "@/components/StoreProductCard";

export const metadata: Metadata = {
  alternates: {
    canonical: "/shirts",
  },
  openGraph: {
    title: "Shirts",
    description:
      "Shop printed shirts, sports apparel, seasonal designs, and personalized shirts from Port Petals in Port Allegany, Pennsylvania.",
    url: "/shirts",
  },
  title: "Shirts",
  description:
    "Shop printed shirts, sports apparel, seasonal designs, and personalized shirts from Port Petals in Port Allegany, Pennsylvania.",
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
  "seasonal-screen-print": {
    label: "Seasonal Screen Prints",
    description:
      "Fresh designs for holidays, seasons, school events, and the moments happening right now.",
  },
  "occasion-screen-print": {
    label: "Occasion Screen Prints",
    description:
      "Printed shirts for celebrations, events, gifts, teams, and special occasions.",
  },
  "ready-made-tie-dye": {
    label: "Ready-Made Shirts",
    description:
      "Ready-to-shop shirt designs for gifts, everyday wear, and easy local pickup.",
  },
  "custom-tie-dye": {
    label: "Custom Shirts",
    description:
      "Personalized and made-to-order shirts created around your style, occasion, or idea.",
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
    "Browse shirts and printed apparel from Port Petals."
  );
}

function normalizeGarmentType(value: string | null) {
  if (!value) return null;

  const normalized = value
    .trim()
    .toLowerCase();

  if (normalized === "t-shirt") {
    return "T-Shirt";
  }

  if (normalized === "crewneck") {
    return "Crewneck";
  }

  if (normalized === "hoodie") {
    return "Hoodie";
  }

  return value;
}

function ShirtProductCard({
  product,
}: {
  product: Awaited<
    ReturnType<typeof getPublishedShirts>
  >[number];
}) {
  const startingPrice = getStartingPrice(
    product.base_price,
    product.variants
  );

  const primaryImage =
    product.images[0]?.publicUrl ??
    "/collections/shirts.jpg";

  return (
    <StoreProductCard
      href={`/shirts/${product.slug}`}
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


const breadcrumbStructuredData =
  buildBreadcrumbStructuredData([
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Shirts",
      path: "/shirts",
    },
  ]);

export default async function ShirtsPage() {
  const products = await getPublishedShirts();

  const rawCollections = Array.from(
    new Set(
      products.map(
        (product) => product.collection
      )
    )
  );

  const preferredOrder = [
    "seasonal-screen-print",
    "occasion-screen-print",
    "ready-made-tie-dye",
    "custom-tie-dye",
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

  const allVariants = products.flatMap(
    (product) => product.variants
  );

  const garmentOrder = [
    "T-Shirt",
    "Crewneck",
    "Hoodie",
  ];

  const garmentPricing = garmentOrder
    .map((garment) => {
      const prices = allVariants
        .filter(
          (variant) =>
            normalizeGarmentType(
              variant.garment_type
            ) === garment
        )
        .map((variant) => variant.price)
        .filter(
          (price): price is number =>
            price !== null
        );

      return {
        garment,
        price:
          prices.length > 0
            ? Math.min(...prices)
            : null,
      };
    })
    .filter(
      (item) => item.price !== null
    );

  const sizeOrder = [
    "S",
    "M",
    "L",
    "XL",
    "2XL",
    "3XL",
  ];

  const availableSizes = sizeOrder.filter(
    (size) =>
      allVariants.some(
        (variant) => variant.size === size
      )
  );

  const preferredColors = [
    "White",
    "Black",
    "Light Gray",
    "Dark Gray",
  ];

  const availableColors =
    preferredColors.filter((color) =>
      allVariants.some(
        (variant) =>
          variant.color === color
      )
    );

  const otherColors = Array.from(
    new Set(
      allVariants
        .map((variant) => variant.color)
        .filter(
          (color): color is string =>
            typeof color === "string" &&
            color.length > 0 &&
            !preferredColors.includes(color)
        )
    )
  );

  const displayColors = [
    ...availableColors,
    ...otherColors,
  ];

  const featuredProducts = products.filter(
    (product) => product.featured
  );

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <JsonLd data={breadcrumbStructuredData} />
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#f7eadc]">
        <div className="absolute inset-0 -z-30 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_48%,#edf3e7_100%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
              Shirts • Printed & Personalized
            </p>

            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              Shirts made for seasons, celebrations & personal style.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52655d]">
              Browse printed designs, sports shirts,
              seasonal favorites, and personalized
              apparel from Port Petals.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#shirt-collections"
                className="inline-flex rounded-full bg-[#e76d61] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
              >
                Shop Shirts →
              </Link>

              <Link
                href="#shirt-options"
                className="inline-flex rounded-full border border-[#284239]/15 bg-white/70 px-6 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                View Shirt Options
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#607068]">
              <span>✓ Multiple garment styles</span>
              <span>✓ Personalized options</span>
              <span>✓ Pickup & local delivery</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_55px_rgba(42,66,57,0.15)]">
            <div className="relative aspect-[4/3]">
              <Image
                src="/heroes/shirts.jpg"
                alt="Shirts from Port Petals"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SHIRT OPTIONS */}
      {(garmentPricing.length > 0 ||
        availableSizes.length > 0 ||
        displayColors.length > 0) && (
        <section
          id="shirt-options"
          className="scroll-mt-28 border-y border-[#284239]/10 bg-[#fffaf3]"
        >
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
                  Shirt Options
                </p>

                <h2 className="mt-2 font-serif text-3xl font-semibold text-[#153f32]">
                  Start with the style that works for you.
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#607068]">
                  Garment styles, sizes, colors, and
                  availability can vary by design.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {garmentPricing.map(
                  ({ garment, price }) => (
                    <div
                      key={garment}
                      className="rounded-[1.4rem] border border-[#284239]/10 bg-white p-5 text-center"
                    >
                      <p className="font-serif text-2xl font-semibold text-[#153f32]">
                        {garment}
                      </p>

                      <p className="mt-2 text-sm font-semibold text-[#e76d61]">
                        Starting at{" "}
                        {formatMoney(price!)}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {(availableSizes.length > 0 ||
              displayColors.length > 0) && (
              <div className="mt-8 grid gap-5 border-t border-[#284239]/10 pt-8 md:grid-cols-2">
                {availableSizes.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a978f]">
                      Available Sizes
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {availableSizes.map(
                        (size) => (
                          <span
                            key={size}
                            className="rounded-full border border-[#284239]/10 bg-white px-4 py-2 text-sm font-semibold text-[#284239]"
                          >
                            {size}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                {displayColors.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a978f]">
                      Available Colors
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {displayColors.map(
                        (color) => (
                          <span
                            key={color}
                            className="rounded-full border border-[#284239]/10 bg-white px-4 py-2 text-sm font-semibold text-[#284239]"
                          >
                            {color}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* SHIRT OCCASIONS */}
      <section className="border-b border-[#284239]/10 bg-[#f7f1e8]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
                Shirts for Events & Celebrations
              </p>

              <h2 className="mt-2 font-serif text-3xl font-semibold text-[#153f32]">
                Find apparel for the occasion.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068]">
                Browse printed and personalized shirts for school events,
                Homecoming, graduation, sports, gifts, and seasonal
                celebrations.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/occasions/homecoming-prom"
                className="rounded-full border border-[#284239]/15 bg-white px-5 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Homecoming & Prom
              </Link>

              <Link
                href="/occasions/graduation"
                className="rounded-full border border-[#284239]/15 bg-white px-5 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Graduation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION NAVIGATION */}
      {collections.length > 0 && (
        <section
          id="shirt-collections"
          className="scroll-mt-28 border-b border-[#284239]/10 bg-white/50"
        >
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#8a978f]">
              Shop Shirts
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

      {/* FEATURED SHIRTS */}
      {featuredProducts.length > 0 && (
        <section className="bg-[#36594c] text-[#fffaf3]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f1b8ae]">
                Featured Shirts
              </p>

              <h2 className="mt-2 font-serif text-4xl font-semibold">
                Designs worth a closer look.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                Featured shirts selected from the
                current Port Petals collection.
              </p>
            </div>

            <div className="mt-8">
              <ProductCardCarousel visibleCount={3}>
                {featuredProducts.map(
                  (product) => {
                    const startingPrice =
                      getStartingPrice(
                        product.base_price,
                        product.variants
                      );

                    const primaryImage =
                      product.images[0]
                        ?.publicUrl ??
                      "/collections/shirts.jpg";

                    return (
                      <Link
                        key={product.id}
                        href={`/shirts/${product.slug}`}
                        className="group block h-full overflow-hidden rounded-[1.4rem] border border-white/15 bg-white/[0.08] transition hover:-translate-y-1 hover:border-[#e76d61]/60 hover:bg-white/[0.12]"
                      >
                        <div className="grid h-[190px] grid-cols-[120px_1fr] sm:grid-cols-[145px_1fr]">
                          <div className="overflow-hidden bg-[#fffaf3]">
                            <img
                              src={primaryImage}
                              alt={
                                product.images[0]
                                  ?.alt_text ??
                                product.name
                              }
                              className="h-full w-full object-cover object-[center_38%]"
                            />
                          </div>

                          <div className="flex min-h-0 flex-col justify-center overflow-hidden p-4 sm:p-5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f1b8ae]">
                              Featured
                            </p>

                            <h3 className="mt-1 font-serif text-xl font-semibold leading-tight text-white">
                              {product.name}
                            </h3>

                            {product.short_description && (
                              <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/65">
                                {
                                  product.short_description
                                }
                              </p>
                            )}

                            <div className="mt-3 flex items-center justify-between gap-3">
                              <span className="text-sm font-semibold text-[#f1b8ae]">
                                {startingPrice !==
                                null
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
                  }
                )}
              </ProductCardCarousel>
            </div>
          </div>
        </section>
      )}

      {/* PERSONALIZATION */}
      <section className="border-b border-[#284239]/10 bg-[#edf3e7]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
          <div className="grid gap-5 lg:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                Make It Yours
              </p>

              <h2 className="mt-2 font-serif text-3xl font-semibold text-[#153f32]">
                Some shirts can be personalized.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Available customization depends on
                the individual design.
              </p>
            </div>

            <div className="rounded-[1.4rem] bg-white/75 p-5">
              <h3 className="font-serif text-xl font-semibold text-[#153f32]">
                Sports Personalization
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#607068]">
                When offered on a product, sports
                personalization can include a player
                name and player number.
              </p>
            </div>

            <div className="rounded-[1.4rem] bg-white/75 p-5">
              <h3 className="font-serif text-xl font-semibold text-[#153f32]">
                Have Another Idea?
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#607068]">
                If you have a shirt idea that is not
                listed online, contact Port Petals to
                discuss the design, colors, and timing.
              </p>

              <Link
                href="/custom/request"
                className="mt-3 inline-flex text-sm font-semibold text-[#e76d61]"
              >
                Ask About a Custom Shirt →
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
              New shirt designs are coming soon
            </h2>

            <p className="mt-4 text-[#607068]">
              Check back soon or contact Port Petals
              for current shirt availability.
            </p>
          </div>
        ) : (
          collections.map(
            (collection, index) => {
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
                  className={
                    index === 0
                      ? "scroll-mt-32"
                      : "mt-16 scroll-mt-32 border-t border-[#284239]/10 pt-16"
                  }
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                        Port Petals Apparel
                      </p>

                      <h2 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
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
                      (product) => (
                        <ShirtProductCard
                          key={product.id}
                          product={product}
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

      {/* ORDERING INFORMATION */}
      <section className="border-t border-[#284239]/10 bg-[#fffaf3]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-6">
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

            <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-6">
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

            <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                Custom Shirts
              </p>

              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#153f32]">
                Looking for something specific?
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Call or email Port Petals to discuss
                a custom shirt idea that is not
                currently listed online.
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
