import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import WeddingInquiryForm from "@/components/WeddingInquiryForm";
import {
  getPublishedWeddingProducts,
  type WeddingProduct,
} from "@/lib/weddings";

export const metadata: Metadata = {
  title: "Wedding Flowers & Event Florals",
  description:
    "Plan wedding flowers with Port Petals in Port Allegany, Pennsylvania. Explore bridal bouquets, ceremony florals, centerpieces, reception flowers, wedding-party flowers, and custom floral consultations.",
  alternates: {
    canonical: "/weddings",
  },
  openGraph: {
    title:
      "Wedding Flowers & Events | Port Petals",
    description:
      "Wedding floral planning, bridal bouquets, ceremony flowers, reception florals, centerpieces, and custom consultations from Port Petals.",
    url: "/weddings",
  },
};

const weddingExamples: {
  title: string;
  eyebrow: string;
  description: string;
  details: string;
  image?: string;
  imageAlt?: string;
}[] = [
  {
    title:
      "Bridal Bouquets",
    eyebrow:
      "Personal Flowers",
    image:
      "/wedding/bouquet.jpeg",
    imageAlt:
      "Wedding bridal bouquet by Port Petals",
    description:
      "From compact and classic to loose garden-style or cascading bouquets, the bridal bouquet helps establish the floral direction for the entire wedding.",
    details:
      "Consider size, shape, dress style, wedding colors, favorite flowers, greenery, ribbon, and how much movement or structure you prefer.",
  },
  {
    title:
      "Bridesmaid Bouquets",
    eyebrow:
      "Wedding Party",
    image:
      "/wedding/bouquet2.jpeg",
    imageAlt:
      "Wedding bouquet by Port Petals",
    description:
      "Coordinated bouquets can echo the bridal bouquet while using a smaller scale, simplified flower mix, or complementary colors.",
    details:
      "Useful details include the number of attendants, dress colors, whether bouquets should match exactly, and whether a maid of honor bouquet should differ.",
  },
  {
    title:
      "Boutonnieres & Corsages",
    eyebrow:
      "Family & Wedding Party",
    image:
      "/wedding/bouquet3.jpeg",
    imageAlt:
      "Wedding floral design by Port Petals",
    description:
      "Boutonnieres and corsages help coordinate the groom, wedding party, parents, grandparents, officiants, and other important people.",
    details:
      "Think through everyone who should receive a wearable floral piece so no one is accidentally left off the list.",
  },
  {
    title:
      "Ceremony Florals",
    eyebrow:
      "Ceremony",
    description:
      "Ceremony flowers can frame the space and direct attention toward the couple through arches, aisle flowers, entrance pieces, altar arrangements, and floral accents.",
    details:
      "Consider the venue structure, weather, aisle length, ceremony focal point, memorial areas, reserved seating, and pieces that could later be reused at the reception.",
  },
  {
    title:
      "Wedding Arch Florals",
    eyebrow:
      "Statement Flowers",
    description:
      "Arches and arbors can range from small corner clusters to asymmetrical installations or fuller floral coverage.",
    details:
      "Port Petals will need to know whether the venue provides the structure, its dimensions, placement, indoor/outdoor conditions, and the amount of floral coverage you envision.",
  },
  {
    title:
      "Reception Centerpieces",
    eyebrow:
      "Reception",
    image:
      "/wedding/table-decorations.jpg",
    imageAlt:
      "Wedding reception table flowers and decorations by Port Petals",
    description:
      "Centerpieces can be floral arrangements, bud-vase groupings, greenery, candles with florals, or a mix of styles throughout the room.",
    details:
      "Table count, table shape, room layout, guest sightlines, candle policies, and centerpiece height all affect the design.",
  },
  {
    title:
      "Sweetheart & Head Table",
    eyebrow:
      "Reception",
    description:
      "The couple's table or head table is often a visual focal point and can use fuller florals, repurposed ceremony pieces, greenery, candles, or statement arrangements.",
    details:
      "Share the table dimensions, seating arrangement, backdrop details, and whether ceremony flowers can be moved into this area.",
  },
  {
    title:
      "Cake & Detail Flowers",
    eyebrow:
      "Finishing Details",
    description:
      "Fresh flowers can coordinate the cake, welcome sign, seating chart, bar, gift table, memorial table, cocktail tables, or other small areas.",
    details:
      "These details are easy to forget during early planning, so they are worth discussing before the final floral plan is approved.",
  },
];

const weddingGuide = [
  {
    title:
      "Personal Flowers",
    intro:
      "Flowers carried or worn by members of the wedding party and family.",
    items: [
      "Bridal bouquet",
      "Bridesmaid bouquets",
      "Maid or matron of honor bouquet",
      "Junior bridesmaid bouquet",
      "Flower girl flowers or petals",
      "Toss bouquet",
      "Groom boutonniere",
      "Groomsmen boutonnieres",
      "Ring bearer boutonniere",
      "Father and grandfather boutonnieres",
      "Mother and grandmother corsages",
      "Officiant or honored-guest flowers",
    ],
  },
  {
    title:
      "Ceremony Flowers",
    intro:
      "Florals that define, decorate, and personalize the ceremony space.",
    items: [
      "Wedding arch or arbor florals",
      "Altar or ceremony focal arrangements",
      "Aisle markers or aisle-end flowers",
      "Ground arrangements",
      "Ceremony entrance arrangements",
      "Welcome sign flowers",
      "Reserved-seat flowers",
      "Memorial flowers",
      "Unity ceremony flowers",
      "Petals or floral accents",
    ],
  },
  {
    title:
      "Reception Flowers",
    intro:
      "Flowers used throughout the reception to connect the tables and venue to the overall wedding design.",
    items: [
      "Guest table centerpieces",
      "Sweetheart table flowers",
      "Head table flowers",
      "Cocktail table arrangements",
      "Cake flowers",
      "Bar flowers",
      "Welcome table flowers",
      "Seating chart or escort-card flowers",
      "Gift and card table flowers",
      "Buffet or dessert table flowers",
      "Fireplace or mantel flowers",
      "Restroom or small-detail florals",
    ],
  },
  {
    title:
      "Planning Details",
    intro:
      "Information that helps Stacy recommend designs that make sense for the actual wedding.",
    items: [
      "Wedding date",
      "Ceremony and reception locations",
      "Indoor or outdoor setting",
      "Wedding colors",
      "Dress and wedding-party colors",
      "Preferred floral style",
      "Favorite flowers",
      "Flowers or colors to avoid",
      "Estimated guest count",
      "Table count and table shape",
      "Estimated floral budget",
      "Delivery and setup needs",
      "Venue access time",
      "Planner or coordinator contact",
    ],
  },
];

const processSteps = [
  {
    number: "01",
    title:
      "Send the planning form",
    description:
      "Share the wedding date, venues, colors, floral needs, quantities, budget, and the overall vision.",
  },
  {
    number: "02",
    title:
      "Review the floral plan",
    description:
      "Stacy can work through priorities, flower availability, quantities, design direction, logistics, and the pieces that make sense for the wedding.",
  },
  {
    number: "03",
    title:
      "Finalize the details",
    description:
      "Once the floral plan is agreed upon, the final wedding details, timing, quantities, and event logistics can be confirmed.",
  },
];

const collectionLabels: Record<
  string,
  string
> = {
  weddings:
    "Wedding Florals",
  ceremony: "Ceremony",
  reception: "Reception",
  "wedding-party":
    "Wedding Party",
  "event-florals":
    "Event Florals",
};

function formatCollection(
  collection: string
) {
  return (
    collectionLabels[
      collection
    ] ??
    collection
      .replaceAll("-", " ")
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      )
  );
}

function getStartingPrice(
  product: WeddingProduct
) {
  const prices = [
    ...(product.base_price !==
    null
      ? [product.base_price]
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
    ? Math.min(...prices)
    : null;
}

function formatPrice(
  price: number
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits:
        0,
      maximumFractionDigits:
        2,
    }
  ).format(price);
}

function WeddingProductCard({
  product,
}: {
  product: WeddingProduct;
}) {
  const startingPrice =
    getStartingPrice(
      product
    );

  const image =
    product.images[0]
      ?.publicUrl;

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-[#284239]/10 bg-white shadow-[0_14px_40px_rgba(42,66,57,0.07)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#efe8dd]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={
              product.images[0]
                ?.alt_text ??
              product.name
            }
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#f4e9e5_0%,#efe7dc_50%,#e5ece5_100%)] px-8 text-center">
            <p className="font-serif text-2xl text-[#153f32]/55">
              Port Petals
            </p>
          </div>
        )}

        {product.featured && (
          <div className="absolute left-4 top-4 rounded-full bg-[#153f32] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white">
            Featured
          </div>
        )}
      </div>

      <div className="p-6 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c55f55]">
          {formatCollection(
            product.collection
          )}
        </p>

        <h3 className="mt-3 font-serif text-2xl font-semibold tracking-[-0.025em] text-[#153f32]">
          {product.name}
        </h3>

        {product.short_description && (
          <p className="mt-3 text-sm leading-6 text-[#607068]">
            {
              product.short_description
            }
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#284239]/10 pt-5">
          <div>
            {startingPrice !==
            null ? (
              <>
                <p className="text-xs uppercase tracking-[0.14em] text-[#607068]">
                  Starting at
                </p>

                <p className="mt-1 text-lg font-semibold text-[#153f32]">
                  {formatPrice(
                    startingPrice
                  )}
                </p>
              </>
            ) : (
              <p className="text-sm font-medium text-[#607068]">
                Consultation
                pricing
              </p>
            )}
          </div>

          <Link
            href="#wedding-inquiry"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#153f32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#284239]"
          >
            Ask About This
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function WeddingsPage() {
  const products =
    await getPublishedWeddingProducts();

  const featuredProducts =
    products.filter(
      (product) =>
        product.featured
    );

  const displayedProducts =
    featuredProducts.length >
    0
      ? featuredProducts
      : products;

  return (
    <main className="min-h-screen bg-[#faf7f1] text-[#284239]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-[#284239]/10 bg-[linear-gradient(135deg,#f7eee9_0%,#f2e6e4_35%,#edf1e8_72%,#faf7f1_100%)]">
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#e7c4c1]/20 blur-3xl" />

        <div className="pointer-events-none absolute right-[6%] top-0 h-80 w-80 rounded-full bg-[#cad8c9]/22 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b45f75]">
              Weddings & Events
            </p>

            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-5xl lg:text-6xl">
              Florals designed
              around your day.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#52655d] sm:text-lg sm:leading-8">
              Plan bridal
              bouquets, wedding
              party flowers,
              ceremony florals,
              centerpieces,
              reception flowers,
              and the details that
              bring the entire
              celebration together.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="#wedding-inquiry"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
              >
                Start Your
                Wedding Inquiry
              </Link>

              <Link
                href="#wedding-guide"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#284239]/15 bg-white/70 px-6 py-3 text-sm font-semibold text-[#284239]"
              >
                Wedding Flower
                Guide
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/55 p-6 shadow-[0_18px_55px_rgba(42,66,57,0.10)] backdrop-blur-[5px] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b45f75]">
              Plan With
              Confidence
            </p>

            <h2 className="mt-3 font-serif text-2xl font-semibold tracking-[-0.03em] text-[#153f32] sm:text-3xl">
              You do not need to
              know all the floral
              terminology.
            </h2>

            <p className="mt-4 text-sm leading-6 text-[#607068]">
              The guide and
              inquiry form below
              walk through the
              pieces couples,
              planners, and
              families commonly
              need so important
              details are not
              forgotten.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Personal flowers",
                "Ceremony flowers",
                "Reception florals",
                "Budget & logistics",
              ].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-white/70 p-4 text-sm font-semibold text-[#153f32]"
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* EXAMPLES */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
              Wedding Flower
              Examples
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.035em] text-[#153f32] sm:text-4xl">
              Flowers for every
              part of the wedding.
            </h2>

            <p className="mt-4 text-base leading-7 text-[#607068]">
              These examples help
              explain the pieces
              commonly included in
              a wedding floral
              plan. Your wedding
              can include as many
              or as few as make
              sense for your day.
            </p>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {weddingExamples.map(
              (example) => (
                <article
                  key={
                    example.title
                  }
                  className="group overflow-hidden rounded-[1.5rem] border border-[#284239]/10 bg-[#faf7f1] shadow-[0_10px_30px_rgba(42,66,57,0.05)]"
                >
                  {example.image ? (
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#efe8dd]">
                      <Image
                        src={
                          example.image
                        }
                        alt={
                          example.imageAlt ??
                          example.title
                        }
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.025]"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-[linear-gradient(135deg,#f4e9e5_0%,#efe7dc_48%,#e5ece5_100%)] px-8 text-center">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b45f75]">
                          Wedding Florals
                        </p>

                        <p className="mt-2 font-serif text-2xl font-semibold text-[#153f32]/70">
                          {
                            example.title
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b45f75]">
                      {
                        example.eyebrow
                      }
                    </p>

                    <h3 className="mt-3 font-serif text-2xl font-semibold text-[#153f32]">
                      {
                        example.title
                      }
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#607068]">
                      {
                        example.description
                      }
                    </p>

                    <p className="mt-4 border-t border-[#284239]/10 pt-4 text-xs leading-5 text-[#718078]">
                      {
                        example.details
                      }
                    </p>
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* REAL WEDDING PRODUCTS */}
      {displayedProducts.length >
        0 && (
        <section className="border-y border-[#284239]/10 bg-[#f7f1e8]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
              Port Petals
              Inspiration
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32] sm:text-4xl">
              Wedding floral
              examples from the
              shop
            </h2>

            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedProducts.map(
                (product) => (
                  <WeddingProductCard
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

      {/* GUIDE */}
      <section
        id="wedding-guide"
        className="scroll-mt-28 bg-[#faf7f1]"
      >
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b45f75]">
              Complete Wedding
              Flower Guide
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.035em] text-[#153f32] sm:text-4xl">
              A checklist for
              planning the flowers.
            </h2>

            <p className="mt-4 text-base leading-7 text-[#607068]">
              You do not need every
              item on this list.
              The purpose is to
              make sure you know
              what is possible
              before deciding what
              matters most for your
              wedding.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {weddingGuide.map(
              (group) => (
                <article
                  key={
                    group.title
                  }
                  className="rounded-[1.6rem] border border-[#284239]/10 bg-white p-6 sm:p-7"
                >
                  <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                    {
                      group.title
                    }
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#607068]">
                    {
                      group.intro
                    }
                  </p>

                  <ul className="mt-5 grid gap-2">
                    {group.items.map(
                      (item) => (
                        <li
                          key={
                            item
                          }
                          className="flex gap-3 text-sm leading-6 text-[#52655d]"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e76d61]" />

                          <span>
                            {item}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </article>
              )
            )}
          </div>

          <div className="mt-8 rounded-[1.6rem] bg-[#edf3e7] p-6 sm:p-8">
            <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
              Details couples
              often forget
            </h3>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Parents and grandparents who need corsages or boutonnieres",
                "Memorial or remembrance flowers",
                "Welcome sign and seating-chart florals",
                "Cake flowers",
                "Cocktail tables and small reception areas",
                "Venue access and floral setup time",
                "Whether ceremony florals can be reused at the reception",
                "Who will move floral pieces between locations",
                "Weather plans for outdoor ceremonies",
              ].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-white/70 p-4 text-sm leading-6 text-[#52655d]"
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b45f75]">
            How It Works
          </p>

          <h2 className="mt-3 max-w-3xl font-serif text-3xl font-semibold text-[#153f32] sm:text-4xl">
            Start with the
            details. Build the
            floral plan from
            there.
          </h2>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {processSteps.map(
              (step) => (
                <div
                  key={
                    step.number
                  }
                  className="border-t border-[#284239]/15 pt-6"
                >
                  <p className="font-serif text-4xl text-[#e76d61]/55">
                    {
                      step.number
                    }
                  </p>

                  <h3 className="mt-4 font-serif text-2xl font-semibold text-[#153f32]">
                    {
                      step.title
                    }
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#607068]">
                    {
                      step.description
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* INQUIRY FORM */}
      <section
        id="wedding-inquiry"
        className="scroll-mt-28 border-t border-[#284239]/10 bg-[#f7f1e8]"
      >
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
              Wedding
              Consultation
            </p>

            <h2 className="mx-auto mt-3 max-w-3xl font-serif text-3xl font-semibold tracking-[-0.035em] text-[#153f32] sm:text-4xl">
              Tell Stacy about
              the wedding.
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-[#607068]">
              Fill out as much as
              you know right now.
              It is completely
              fine to choose “not
              sure” or leave
              optional details
              blank.
            </p>
          </div>

          <WeddingInquiryForm />
        </div>
      </section>
    </main>
  );
}
