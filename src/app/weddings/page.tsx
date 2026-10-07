import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbStructuredData } from "@/lib/seo/breadcrumbs";
import Image from "next/image";
import Link from "next/link";
import WeddingInquiryForm from "@/components/WeddingInquiryForm";
import WeddingExamplesCarousel from "@/components/WeddingExamplesCarousel";
import {
  getPublishedWeddingProducts,
  type WeddingProduct,
} from "@/lib/weddings";

export const metadata: Metadata = {
  title:
    "Wedding Florist & Wedding Flowers in Port Allegany, PA",
  description:
    "Plan wedding flowers with Port Petals, a local florist in Port Allegany, PA. Explore bridal bouquets, ceremony flowers, centerpieces, reception florals, wedding-party flowers, and custom floral consultations.",
  alternates: {
    canonical: "/weddings",
  },
  openGraph: {
    title:
      "Wedding Florist & Wedding Flowers | Port Petals",
    description:
      "Wedding bouquets, ceremony flowers, reception florals, centerpieces, wedding-party flowers, and custom floral planning from Port Petals in Port Allegany.",
    url: "/weddings",
  },
};

const weddingExamples: {
  title: string;
  eyebrow: string;
  description: string;
  details: string;
  image: string;
  imageAlt: string;
}[] = [
  {
    title: "Bridal Bouquets",
    eyebrow: "Personal Flowers",
    description:
      "The bridal bouquet often establishes the floral direction for the entire wedding, from color and texture to overall style.",
    details:
      "Consider bouquet shape, size, dress style, favorite flowers, greenery, ribbon, and whether you prefer something structured, loose, cascading, or garden-inspired.",
    image: "/wedding/bridal-bouquet.jpg",
    imageAlt:
      "Romantic bridal wedding bouquet with blush and ivory flowers",
  },
  {
    title: "Bridesmaid Bouquets",
    eyebrow: "Wedding Party",
    description:
      "Bridesmaid bouquets can coordinate closely with the bridal bouquet while using a smaller scale, simplified flower mix, or complementary colors.",
    details:
      "Think about the number of attendants, dress colors, whether bouquets should match exactly, and whether the maid of honor should have a distinctive bouquet.",
    image: "/wedding/bridesmaid-bouquet.jpg",
    imageAlt:
      "Coordinated bridesmaid wedding bouquet with blush and ivory flowers",
  },
  {
    title: "Boutonnieres",
    eyebrow: "Wedding Party",
    description:
      "Boutonnieres provide a coordinated floral detail for the groom, groomsmen, fathers, grandfathers, officiants, and other honored guests.",
    details:
      "Small differences in flowers, greenery, ribbon, or wrapping can distinguish the groom from the rest of the wedding party.",
    image: "/wedding/boutonniere.jpg",
    imageAlt:
      "Wedding boutonniere with ivory flower and greenery",
  },
  {
    title: "Corsages",
    eyebrow: "Family Flowers",
    description:
      "Corsages are commonly created for mothers, grandmothers, family members, readers, and other important people participating in the wedding.",
    details:
      "They may be designed as wrist corsages or pin-on pieces depending on preference, attire, and floral style.",
    image: "/wedding/corsage.jpg",
    imageAlt:
      "Wedding wrist corsage with blush and ivory flowers",
  },
  {
    title: "Wedding Arch Florals",
    eyebrow: "Ceremony",
    description:
      "Wedding arches and arbors can become the main floral focal point of the ceremony and frame the couple during the vows.",
    details:
      "Designs may include corner clusters, asymmetrical florals, greenery, draping, or fuller coverage depending on the venue and desired impact.",
    image: "/wedding/ceremony-arch.jpg",
    imageAlt:
      "Wedding ceremony arch decorated with blush ivory flowers and greenery",
  },
  {
    title: "Aisle Flowers",
    eyebrow: "Ceremony",
    description:
      "Aisle flowers create a visual path toward the ceremony and can add floral detail without overwhelming the venue.",
    details:
      "Options include chair or pew flowers, small arrangements, ground florals, petals, greenery, or florals concentrated near the front of the aisle.",
    image: "/wedding/ceremony-aisle-flowers.jpg",
    imageAlt:
      "Wedding ceremony aisle decorated with floral arrangements",
  },
  {
    title: "Ceremony Installations",
    eyebrow: "Ceremony",
    description:
      "Large ceremony floral pieces can help define an altar, backdrop, entrance, fireplace, cross, or other important architectural feature.",
    details:
      "Venue dimensions, mounting options, weather, structure ownership, and setup access are important details when planning larger installations.",
    image: "/wedding/ceremony-floral-installation.jpg",
    imageAlt:
      "Large wedding ceremony floral installation with flowers and greenery",
  },
  {
    title: "Reception Centerpieces",
    eyebrow: "Reception",
    description:
      "Guest-table centerpieces help carry the wedding colors and floral style throughout the reception space.",
    details:
      "Centerpieces can include low arrangements, taller designs, bud-vase groupings, greenery, candles, or a coordinated mix depending on the tables and room.",
    image: "/wedding/reception-centerpiece.jpg",
    imageAlt:
      "Wedding reception centerpiece with blush ivory flowers and greenery",
  },
  {
    title: "Sweetheart Table Flowers",
    eyebrow: "Reception",
    description:
      "The sweetheart table is often a reception focal point and can support a fuller floral treatment than standard guest tables.",
    details:
      "Flowers may be arranged across the front of the table, incorporated with candles or greenery, or created using pieces repurposed from the ceremony.",
    image: "/wedding/sweetheart-table.jpg",
    imageAlt:
      "Wedding sweetheart table decorated with romantic floral arrangements",
  },
  {
    title: "Head Table Flowers",
    eyebrow: "Reception",
    description:
      "Head-table flowers help create a cohesive focal area for the couple and wedding party during the reception.",
    details:
      "Long arrangements, greenery runners, clustered florals, candles, and reused ceremony pieces can all be considered depending on the table layout.",
    image: "/wedding/head-table-arrangement.jpg",
    imageAlt:
      "Wedding head table decorated with flowers and greenery",
  },
  {
    title: "Cocktail Table Flowers",
    eyebrow: "Reception Details",
    description:
      "Small floral arrangements can bring the wedding style into cocktail areas and other spaces outside the main reception tables.",
    details:
      "Bud vases and compact arrangements are especially useful for cocktail tables where space is limited.",
    image: "/wedding/cocktail-table-arrangement.jpg",
    imageAlt:
      "Small wedding cocktail table floral arrangement",
  },
  {
    title: "Cake Flowers",
    eyebrow: "Finishing Details",
    description:
      "Fresh floral accents can connect the wedding cake to the rest of the floral design without requiring an elaborate cake treatment.",
    details:
      "The florist and baker should coordinate placement, flower safety, timing, and the amount of floral coverage planned for the cake.",
    image: "/wedding/cake-flowers.jpg",
    imageAlt:
      "Wedding cake decorated with blush and ivory fresh flowers",
  },
  {
    title: "Welcome Sign Flowers",
    eyebrow: "Guest Experience",
    description:
      "Florals around a welcome sign can create a polished first impression and introduce the wedding's colors and style as guests arrive.",
    details:
      "The sign dimensions, stand or easel, placement, venue conditions, and whether flowers will be attached or arranged nearby should be considered.",
    image: "/wedding/welcome-sign-flowers.jpg",
    imageAlt:
      "Wedding welcome sign decorated with flowers and greenery",
  },
  {
    title: "Seating Chart Flowers",
    eyebrow: "Reception Details",
    description:
      "A floral seating-chart display can turn a functional reception element into part of the wedding decor.",
    details:
      "Flowers may frame the display, accent corners, sit at the base, or coordinate with nearby welcome-table and reception arrangements.",
    image: "/wedding/seating-chart-flowers.jpg",
    imageAlt:
      "Wedding seating chart display decorated with flowers",
  },
  {
    title: "Memorial Table Flowers",
    eyebrow: "Meaningful Details",
    description:
      "Memorial flowers can create a thoughtful space for remembering loved ones who cannot be present on the wedding day.",
    details:
      "Small arrangements, candles, photographs, greenery, and meaningful floral choices can be incorporated respectfully into the display.",
    image: "/wedding/memorial-table.jpg",
    imageAlt:
      "Wedding memorial table with flowers candles and framed remembrance",
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


const breadcrumbStructuredData =
  buildBreadcrumbStructuredData([
      {
        name: "Home",
        path: "/",
      },
      {
        name: "Weddings",
        path: "/weddings",
      },
  ]);

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
      <JsonLd data={breadcrumbStructuredData} />
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

      {/* LOCAL WEDDING FLORIST CONTEXT */}
      <section className="border-b border-[#284239]/10 bg-[#fffaf3]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Wedding Florist • Port Allegany
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32] sm:text-4xl">
              Local wedding flowers planned around your day.
            </h2>

            <p className="mt-4 leading-7 text-[#607068]">
              Port Petals works with couples planning wedding flowers in and
              around Port Allegany, from bridal and bridesmaid bouquets to
              boutonnieres, corsages, ceremony flowers, centerpieces, reception
              florals, and statement installations. Every wedding begins with
              the actual venue, color palette, priorities, quantities, and
              floral budget rather than a one-size-fits-all package.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/flowers"
                className="rounded-full border border-[#284239]/15 bg-white px-5 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Browse Fresh Flowers
              </Link>

              <Link
                href="/occasions"
                className="rounded-full border border-[#284239]/15 bg-white px-5 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Other Occasions
              </Link>
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

          <WeddingExamplesCarousel
            examples={weddingExamples}
          />

          <div className="mt-8 flex justify-center">
            <Link
              href="#wedding-inquiry"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(231,109,97,0.18)] transition hover:-translate-y-0.5 hover:bg-[#d85b50]"
            >
              Start Your Wedding Inquiry
            </Link>
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
