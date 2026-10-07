import type {
  Metadata,
} from "next";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbStructuredData } from "@/lib/seo/breadcrumbs";
import Link from "next/link";
import {
  notFound,
} from "next/navigation";
import StoreProductCard from "@/components/StoreProductCard";
import ProductCardCarousel from "@/components/ProductCardCarousel";
import {
  occasionDefinitions,
  getOccasionDefinition,
} from "@/lib/occasions";
import {
  getPublishedProductsForOccasion,
  type OccasionProduct,
} from "@/lib/occasion-products";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const departmentDetails: Record<
  string,
  {
    label: string;
    description: string;
    fallbackImage: string;
    href: string;
  }
> = {
  flowers: {
    label: "Fresh Flowers",
    description:
      "Fresh arrangements, bouquets, and floral pieces chosen for the occasion.",
    fallbackImage:
      "/collections/fresh-flowers.jpg",
    href: "/flowers",
  },
  "gifts-decor": {
    label: "Gifts & Decor",
    description:
      "Thoughtful gifts, candles, personalized pieces, and handmade favorites.",
    fallbackImage:
      "/collections/custom.jpg",
    href: "/gifts",
  },
  apparel: {
    label: "Apparel",
    description:
      "Wearable gifts, custom apparel, and personalized designs.",
    fallbackImage:
      "/collections/custom.jpg",
    href: "/apparel",
  },
  "gator-gear": {
    label: "Gator Gear",
    description:
      "Port Allegany school spirit, personalized gear, and hometown favorites.",
    fallbackImage:
      "/collections/gators.jpg",
    href: "/gators",
  },
  seasonal: {
    label: "Seasonal Favorites",
    description:
      "Limited seasonal creations, gifts, apparel, florals, and decor.",
    fallbackImage:
      "/collections/custom.jpg",
    href: "/seasonal",
  },
};

function getStartingPrice(
  product: OccasionProduct
) {
  const prices = [
    ...(product.base_price !==
    null
      ? [
          product.base_price,
        ]
      : []),
    ...product.variants
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
    ? Math.min(
        ...prices
      )
    : null;
}

function getProductHref(
  product: OccasionProduct
) {
  switch (
    product.category
  ) {
    case "flowers":
      return `/flowers/${product.slug}`;

    case "candles":
      return `/candles/${product.slug}`;

    case "shirts":
      return `/apparel/${product.slug}`;

    case "gators":
      return `/gators/${product.slug}`;

    case "custom":
      return `/custom/${product.slug}`;
  }

  switch (
    product.department
  ) {
    case "flowers":
      return `/flowers/${product.slug}`;

    case "apparel":
      return `/apparel/${product.slug}`;

    case "gator-gear":
      return `/gators/${product.slug}`;

    default:
      return `/custom/${product.slug}`;
  }
}

function OccasionCard({
  product,
}: {
  product: OccasionProduct;
}) {
  const department =
    product.department ??
    "gifts-decor";

  const details =
    departmentDetails[
      department
    ] ??
    departmentDetails[
      "gifts-decor"
    ];

  const image =
    product.images[0]
      ?.publicUrl ??
    details.fallbackImage;

  return (
    <StoreProductCard
      href={getProductHref(
        product
      )}
      productId={
        product.id
      }
      slug={product.slug}
      name={product.name}
      shortDescription={
        product.short_description
      }
      imageUrl={image}
      imageAlt={
        product.images[0]
          ?.alt_text ??
        product.name
      }
      startingPrice={getStartingPrice(
        product
      )}
      featured={
        product.featured
      }
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

export function generateStaticParams() {
  return occasionDefinitions.map(
    (occasion) => ({
      slug:
        occasion.slug,
    })
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } =
    await params;

  const occasion =
    getOccasionDefinition(
      slug
    );

  if (!occasion) {
    return {};
  }

  const seoTitles: Record<string, string> = {
    sympathy:
      "Sympathy Flowers & Gifts in Port Allegany, PA",
    birthdays:
      "Birthday Flowers & Gifts in Port Allegany, PA",
    "homecoming-prom":
      "Homecoming & Prom Flowers in Port Allegany, PA",
    graduation:
      "Graduation Flowers & Gifts in Port Allegany, PA",
  };

  const seoTitle =
    seoTitles[occasion.slug] ??
    `${occasion.label} Flowers & Gifts in Port Allegany, PA`;

  return {
    title: seoTitle,
    description:
      occasion.seoDescription,
    alternates: {
      canonical:
        `/occasions/${occasion.slug}`,
    },
    openGraph: {
      title:
        `${seoTitle} | Port Petals`,
      description:
        occasion.seoDescription,
      url:
        `/occasions/${occasion.slug}`,
    },
  };
}

export default async function OccasionPage({
  params,
}: Props) {
  const { slug } =
    await params;

  const occasion =
    getOccasionDefinition(
      slug
    );

  if (!occasion) {
    notFound();
  }

  const breadcrumbStructuredData =
    buildBreadcrumbStructuredData([
      {
        name: "Home",
        path: "/",
      },
      {
        name: "Occasions",
        path: "/occasions",
      },
      {
        name: occasion.label,
        path: `/occasions/${occasion.slug}`,
      },
    ]);

  const darkHero =
    occasion.slug ===
      "homecoming-prom" ||
    occasion.slug ===
      "graduation";

  const products =
    await getPublishedProductsForOccasion(
      occasion
    );

  const groups =
    occasion.departmentOrder
      .map(
        (department) => ({
          department,
          products:
            products.filter(
              (product) =>
                product.department ===
                department
            ),
        })
      )
      .filter(
        (group) =>
          group.products.length >
          0
      );

  return (
    <main className="min-h-screen bg-[#faf7f1] text-[#284239]">
      <JsonLd data={breadcrumbStructuredData} />
      <section
        className={`relative isolate overflow-hidden border-b border-[#284239]/10 ${occasion.heroClass}`}
      >
        <div className="pointer-events-none absolute -left-24 top-5 h-80 w-80 rounded-full bg-[#e76d61]/10 blur-3xl" />
        <div className="pointer-events-none absolute right-[-60px] top-0 h-96 w-96 rounded-full bg-[#8faa91]/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-18 lg:px-10 lg:py-20">
          <Link
            href="/occasions"
            className={`text-sm font-semibold transition ${
              darkHero
                ? "text-white/65 hover:text-white"
                : "text-[#607068] hover:text-[#e76d61]"
            }`}
          >
            ← All Occasions
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${occasion.eyebrowClass}`}>
                {
                  occasion.eyebrow
                }
              </p>

              <h1 className={`mt-4 max-w-4xl font-serif text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl ${
                  darkHero
                    ? "text-white"
                    : occasion.titleClass
                }`}>
                {
                  occasion.title
                }
              </h1>

              <p className={`mt-5 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8 ${
                  darkHero
                    ? "text-white/75"
                    : occasion.bodyClass
                }`}>
                {
                  occasion.description
                }
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="#occasion-products"
                  className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition ${occasion.primaryButtonClass}`}
                >
                  Shop{" "}
                  {
                    occasion.label
                  }
                </a>

                <Link
                  href="/custom/request"
                  className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition ${
                    darkHero
                      ? "border border-white/20 bg-white/90 text-[#153f32] hover:bg-white"
                      : "border border-[#284239]/15 bg-white/70 text-[#284239] hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                  }`}
                >
                  Request Something Custom
                </Link>
              </div>
            </div>

            <div className={`rounded-[1.75rem] border p-6 shadow-[0_18px_50px_rgba(42,66,57,0.08)] backdrop-blur sm:p-7 ${occasion.accentPanelClass}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${occasion.accentTextClass}`}>
                Port Petals
              </p>

              <p
                className={`mt-3 font-serif text-2xl font-semibold ${
                  darkHero
                    ? "text-white"
                    : "text-[#153f32]"
                }`}
              >
                Make it personal.
              </p>

              <p
                className={`mt-3 text-sm leading-6 ${
                  darkHero
                    ? "text-white/70"
                    : "text-[#607068]"
                }`}
              >
                {
                  occasion.supportingText
                }
              </p>

              <div
                className={`mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium ${
                  darkHero
                    ? "text-white/65"
                    : "text-[#607068]"
                }`}
              >
                <span>
                  ✓ Pickup in Port Allegany
                </span>
                <span>
                  ✓ Local delivery available
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {groups.length >
        1 && (
        <section className="border-b border-[#284239]/10 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
            <div className="flex flex-wrap gap-2">
              {groups.map(
                (group) => (
                  <a
                    key={
                      group.department
                    }
                    href={`#${group.department}`}
                    className="rounded-full border border-[#284239]/10 bg-[#faf7f1] px-4 py-2 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                  >
                    {
                      departmentDetails[
                        group.department
                      ]?.label ??
                      group.department
                    }

                    <span className="ml-2 text-xs font-normal text-[#8a978f]">
                      {
                        group.products.length
                      }
                    </span>
                  </a>
                )
              )}
            </div>
          </div>
        </section>
      )}

      <div
        id="occasion-products"
        className="scroll-mt-28"
      >
        {groups.length ===
        0 ? (
          <section className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8">
            <div className="rounded-[1.75rem] border border-[#284239]/10 bg-white p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                Need Something Special?
              </p>

              <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
                We can help create something for the occasion.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#607068]">
                There are no published
                products in this occasion
                collection right now, but
                Port Petals welcomes custom
                requests.
              </p>

              <Link
                href="/custom/request"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-6 text-sm font-semibold text-white"
              >
                Start a Custom Request
              </Link>
            </div>
          </section>
        ) : (
          groups.map(
            (
              group,
              index
            ) => {
              const details =
                departmentDetails[
                  group.department
                ];

              return (
                <section
                  key={
                    group.department
                  }
                  id={
                    group.department
                  }
                  className={`scroll-mt-28 ${
                    index % 2 ===
                    0
                      ? "bg-[#faf7f1]"
                      : "border-y border-[#284239]/8 bg-white"
                  }`}
                >
                  <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-10">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                          {
                            occasion.label
                          }
                        </p>

                        <h2 className="mt-2 font-serif text-3xl font-semibold text-[#153f32] sm:text-4xl">
                          {
                            details?.label ??
                            group.department
                          }
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068]">
                          {
                            details?.description
                          }
                        </p>
                      </div>

                      {details && (
                        <Link
                          href={
                            details.href
                          }
                          className="text-sm font-semibold text-[#36594c] transition hover:text-[#e76d61]"
                        >
                          Browse all{" "}
                          {
                            details.label
                          }{" "}
                          →
                        </Link>
                      )}
                    </div>

                    <div className="mt-7">
                      <ProductCardCarousel
                        visibleCount={3}
                      >
                        {group.products.map(
                          (
                            product
                          ) => (
                            <OccasionCard
                              key={
                                product.id
                              }
                              product={
                                product
                              }
                            />
                          )
                        )}
                      </ProductCardCarousel>
                    </div>
                  </div>
                </section>
              );
            }
          )
        )}
      </div>

      <section className="border-t border-[#284239]/10 bg-[#153f32] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f3b0aa]">
              Need Help Choosing?
            </p>

            <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
              Port Petals can help you put the right gift together.
            </h2>
          </div>

          <Link
            href="/custom/request"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#e76d61] px-6 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
          >
            Custom Request
          </Link>
        </div>
      </section>
    </main>
  );
}
