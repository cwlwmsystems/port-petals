import type { Metadata } from "next";
import Link from "next/link";
import {
  getPublishedWeddingProducts,
  type WeddingProduct,
} from "@/lib/weddings";

export const metadata: Metadata = {
  title: "Weddings & Events",
  description:
    "Wedding flowers, bridal bouquets, ceremony florals, reception arrangements, centerpieces, and event floral design from Port Petals in Port Allegany, Pennsylvania.",
  alternates: {
    canonical: "/weddings",
  },
  openGraph: {
    title: "Weddings & Events | Port Petals",
    description:
      "Custom wedding and event florals designed by Port Petals for celebrations throughout the Port Allegany area.",
    url: "/weddings",
  },
};

const serviceCategories = [
  {
    title: "Bridal Bouquets",
    description:
      "Personalized bridal bouquets designed around your colors, flowers, style, and overall wedding vision.",
  },
  {
    title: "Wedding Party Flowers",
    description:
      "Bridesmaid bouquets, boutonnieres, corsages, and coordinated floral pieces for your wedding party.",
  },
  {
    title: "Ceremony Florals",
    description:
      "Florals for aisles, entrances, memorial spaces, altars, arches, and other ceremony focal points.",
  },
  {
    title: "Reception Florals",
    description:
      "Centerpieces, head-table arrangements, accent florals, and coordinated reception designs.",
  },
  {
    title: "Wedding Packages",
    description:
      "Coordinated floral packages that bring the major pieces of your wedding together in one cohesive design.",
  },
  {
    title: "Events & Celebrations",
    description:
      "Custom floral design for showers, anniversaries, parties, banquets, community events, and other special occasions.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Tell us about your event",
    description:
      "Share your date, location, colors, inspiration, floral needs, and the pieces you are considering.",
  },
  {
    number: "02",
    title: "Plan the details",
    description:
      "We work through flower preferences, quantities, design direction, availability, and the overall scope of your event.",
  },
  {
    number: "03",
    title: "Create your florals",
    description:
      "Port Petals prepares the final floral pieces around the approved plan for your wedding or event.",
  },
];

const collectionLabels: Record<string, string> = {
  weddings: "Wedding Florals",
  ceremony: "Ceremony",
  reception: "Reception",
  "wedding-party": "Wedding Party",
  "event-florals": "Event Florals",
};

function formatCollection(collection: string) {
  return (
    collectionLabels[collection] ??
    collection
      .replaceAll("-", " ")
      .replace(
        /\b\w/g,
        (letter) => letter.toUpperCase()
      )
  );
}

function getStartingPrice(product: WeddingProduct) {
  const prices = [
    ...(product.base_price !== null
      ? [product.base_price]
      : []),
    ...product.variants
      .map((variant) => variant.price)
      .filter(
        (price): price is number =>
          price !== null
      ),
  ];

  return prices.length > 0
    ? Math.min(...prices)
    : null;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

function WeddingProductCard({
  product,
}: {
  product: WeddingProduct;
}) {
  const startingPrice =
    getStartingPrice(product);

  const image =
    product.images[0]?.publicUrl;

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-[#284239]/10 bg-white shadow-[0_14px_40px_rgba(42,66,57,0.07)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#efe8dd]">
        {image ? (
          // Native img is intentional here because the URLs are generated
          // dynamically from the existing Supabase storage bucket.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={
              product.images[0]?.alt_text ??
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
            {product.short_description}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#284239]/10 pt-5">
          <div>
            {startingPrice !== null ? (
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
                Consultation pricing
              </p>
            )}
          </div>

          <Link
            href="/custom/request"
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
      (product) => product.featured
    );

  const displayedProducts =
    featuredProducts.length > 0
      ? featuredProducts
      : products;

  return (
    <main className="min-h-screen bg-[#faf7f1] text-[#284239]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-[#284239]/10 bg-[linear-gradient(135deg,#f7eee9_0%,#f2e6e4_35%,#edf1e8_72%,#faf7f1_100%)]">
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#e7c4c1]/20 blur-3xl" />

        <div className="pointer-events-none absolute right-[6%] top-0 h-80 w-80 rounded-full bg-[#cad8c9]/22 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-120px] left-[42%] h-80 w-80 rounded-full bg-white/60 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b45f75]">
              Weddings & Events
            </p>

            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-5xl lg:text-6xl">
              Florals designed around your day.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#52655d] sm:text-lg sm:leading-8">
              From bridal bouquets and
              boutonnieres to ceremony
              florals, centerpieces, and
              special-event arrangements,
              Port Petals creates meaningful
              floral designs around your
              colors, style, and celebration.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/custom/request"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
              >
                Start Your Consultation
              </Link>

              <Link
                href="#wedding-services"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#284239]/15 bg-white/70 px-6 py-3 text-sm font-semibold text-[#284239] backdrop-blur-sm transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Explore Wedding Florals
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/55 p-6 shadow-[0_18px_55px_rgba(42,66,57,0.10)] backdrop-blur-[5px] sm:p-8">
            <div className="absolute inset-0 bg-white/10" />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b45f75]">
                Designed For You
              </p>

              <h2 className="mt-3 font-serif text-2xl font-semibold tracking-[-0.03em] text-[#153f32] sm:text-3xl">
                Personal flowers, ceremony
                details & reception designs
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#607068]">
                Wedding florals are planned
                individually so the flowers,
                scale, colors, and overall
                look fit the event rather
                than forcing your day into a
                standard package.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/70 p-4">
                  <p className="font-semibold text-[#153f32]">
                    Personal Flowers
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#607068]">
                    Bouquets,
                    boutonnieres, corsages,
                    and wedding-party pieces.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/70 p-4">
                  <p className="font-semibold text-[#153f32]">
                    Event Florals
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#607068]">
                    Ceremony accents,
                    centerpieces, statement
                    pieces, and reception
                    florals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="border-b border-[#284239]/10 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-12 text-center sm:px-8 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b45f75]">
            Your Flowers, Your Celebration
          </p>

          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.035em] text-[#153f32] sm:text-4xl">
            Wedding flowers should feel
            personal.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-[#607068]">
            Every wedding is different.
            Port Petals can build the floral
            plan around the pieces you
            actually need, whether that is a
            bridal bouquet and wedding-party
            flowers or a larger collection
            spanning the ceremony and
            reception.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="wedding-services"
        className="scroll-mt-28 bg-[#f7f1e8]"
      >
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
              Wedding & Event Services
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.035em] text-[#153f32] sm:text-4xl">
              Floral pieces for every part
              of the celebration.
            </h2>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map(
              (service) => (
                <article
                  key={service.title}
                  className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-6 shadow-[0_10px_30px_rgba(42,66,57,0.05)] sm:p-7"
                >
                  <div className="mb-5 h-1 w-12 rounded-full bg-[#e76d61]" />

                  <h3 className="font-serif text-2xl font-semibold tracking-[-0.025em] text-[#153f32]">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#607068]">
                    {service.description}
                  </p>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* PUBLISHED WEDDING PRODUCTS */}
      {displayedProducts.length > 0 && (
        <section className="border-y border-[#284239]/10 bg-[#faf7f1]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
                  Wedding Inspiration
                </p>

                <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.035em] text-[#153f32] sm:text-4xl">
                  Featured wedding florals
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068]">
                  Browse examples and
                  wedding floral offerings,
                  then contact Port Petals to
                  discuss colors,
                  availability, quantities,
                  and event details.
                </p>
              </div>

              <Link
                href="/custom/request"
                className="text-sm font-semibold text-[#153f32] underline decoration-[#e76d61]/50 underline-offset-4 transition hover:text-[#e76d61]"
              >
                Request a consultation
              </Link>
            </div>

            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedProducts.map(
                (product) => (
                  <WeddingProductCard
                    key={product.id}
                    product={product}
                  />
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* PROCESS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b45f75]">
              How It Works
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.035em] text-[#153f32] sm:text-4xl">
              Start with the vision. We will
              work through the flowers.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {processSteps.map(
              (step) => (
                <div
                  key={step.number}
                  className="relative border-t border-[#284239]/15 pt-6"
                >
                  <p className="font-serif text-4xl text-[#e76d61]/55">
                    {step.number}
                  </p>

                  <h3 className="mt-4 font-serif text-2xl font-semibold text-[#153f32]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#607068]">
                    {step.description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#153f32]">
        <div className="mx-auto max-w-5xl px-5 py-14 text-center sm:px-8 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f1b6ad]">
            Planning Something Special?
          </p>

          <h2 className="mx-auto mt-3 max-w-3xl font-serif text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
            Tell Port Petals what you are
            planning.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
            Share your date, event type,
            colors, floral ideas, and the
            pieces you are interested in.
            That gives us a starting point
            for planning your wedding or
            event florals.
          </p>

          <div className="mt-7">
            <Link
              href="/custom/request"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
            >
              Start Your Consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
