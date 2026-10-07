import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbStructuredData } from "@/lib/seo/breadcrumbs";

const canonicalPath =
  "/journal/homecoming-flowers-port-allegany";

const canonicalUrl =
  `https://www.portpetals.com${canonicalPath}`;

export const metadata: Metadata = {
  title:
    "Homecoming Flowers in Port Allegany | Corsages & Boutonnieres",
  description:
    "Planning for Homecoming in Port Allegany? Learn about corsages, boutonnieres, matching flowers, ordering tips, and when to place your Homecoming flower order with Port Petals.",
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    type: "article",
    title:
      "Homecoming Flowers in Port Allegany | Corsages & Boutonnieres",
    description:
      "A practical guide to Homecoming corsages, boutonnieres, colors, ordering, and planning from Port Petals in Port Allegany, Pennsylvania.",
    url: canonicalPath,
    images: [
      {
        url: "/journal/seasonal/autumn.jpg",
        alt:
          "Fall and Homecoming inspiration from Port Petals in Port Allegany",
      },
    ],
  },
};

const breadcrumbStructuredData =
  buildBreadcrumbStructuredData([
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Journal",
      path: "/journal",
    },
    {
      name:
        "Homecoming Flowers in Port Allegany",
      path: canonicalPath,
    },
  ]);

const articleStructuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Homecoming Flowers in Port Allegany: Corsages, Boutonnieres & Ordering Tips",
  description:
    "A practical guide to Homecoming corsages, boutonnieres, matching flowers, colors, and ordering from Port Petals in Port Allegany, Pennsylvania.",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": canonicalUrl,
  },
  author: {
    "@type": "Organization",
    name: "Port Petals",
    url: "https://www.portpetals.com",
  },
  publisher: {
    "@type": "Organization",
    name: "Port Petals",
    url: "https://www.portpetals.com",
  },
  image:
    "https://www.portpetals.com/journal/seasonal/autumn.jpg",
  url: canonicalUrl,
};

const planningSteps = [
  {
    title: "Choose the flower type",
    text:
      "Decide whether you need a wrist corsage, boutonniere, bouquet, or another floral piece for the event.",
  },
  {
    title: "Know the colors",
    text:
      "Dress colors, suit or shirt colors, school colors, and personal preferences can all help guide the flower and ribbon choices.",
  },
  {
    title: "Coordinate when you want to",
    text:
      "Matching does not have to mean identical. Coordinating colors, flowers, ribbon, or accent details can create a polished look without making every piece the same.",
  },
  {
    title: "Order before the last minute",
    text:
      "Homecoming is a busy floral period. Ordering ahead gives Port Petals more time to plan the design and work with the available flowers and requested colors.",
  },
];

export default function HomecomingFlowersArticlePage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <JsonLd
        data={breadcrumbStructuredData}
      />

      <JsonLd
        data={articleStructuredData}
      />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#284239]/10">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(110deg,#f7eadc_0%,#faefe5_45%,#edf3e7_100%)]" />

        <div className="absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full bg-[#efa99f]/30 blur-[90px]" />

        <div className="absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#c9e2ba]/40 blur-[100px]" />

        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#e76d61]">
              Port Petals Journal · Homecoming
            </p>

            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              Homecoming flowers in Port Allegany:
              corsages, boutonnieres & ordering tips
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#52655d]">
              Homecoming flowers are a small detail
              that can pull the entire look together.
              Whether you need a corsage,
              boutonniere, matching set, or another
              floral piece, a little planning makes
              ordering much easier.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/occasions/homecoming-prom"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
              >
                Shop Homecoming Flowers
              </Link>

              <Link
                href="/flowers"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#284239]/15 bg-white px-6 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Browse Fresh Flowers
              </Link>
            </div>
          </div>

          <div className="relative min-h-[340px] overflow-hidden rounded-[2rem] border border-white/70 shadow-[0_20px_55px_rgba(42,66,57,0.12)] sm:min-h-[440px]">
            <Image
              src="/journal/seasonal/autumn.jpg"
              alt="Homecoming and fall flower inspiration from Port Petals in Port Allegany"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          Planning Your Flowers
        </p>

        <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.03em] text-[#153f32]">
          What should you order for Homecoming?
        </h2>

        <div className="mt-6 space-y-5 text-base leading-8 text-[#607068]">
          <p>
            The most familiar Homecoming flower
            choices are wrist corsages and
            boutonnieres. Corsages are commonly worn
            on the wrist, while boutonnieres are
            usually pinned to a jacket, shirt, or
            other garment.
          </p>

          <p>
            The right choice depends on the outfit,
            personal preference, and the look you
            want. Some people coordinate a corsage
            and boutonniere as a pair, while others
            choose flowers independently based on
            each person&apos;s colors and style.
          </p>

          <p>
            Port Petals can help customers in Port
            Allegany plan Homecoming flowers around
            available flower selections, outfit
            colors, ribbon, and the overall feel of
            the event.
          </p>
        </div>
      </section>

      {/* CORSAGE VS BOUTONNIERE */}
      <section className="bg-[#fffaf3]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#36594c]">
            Corsage or Boutonniere?
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
            Two traditional Homecoming choices.
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="rounded-[1.8rem] border border-[#284239]/10 bg-white p-7 shadow-sm">
              <h3 className="font-serif text-3xl font-semibold text-[#153f32]">
                Wrist Corsages
              </h3>

              <p className="mt-4 leading-7 text-[#607068]">
                Wrist corsages are designed to be
                worn comfortably while still adding
                flowers and color to the outfit.
                Flower selection, ribbon, and accents
                can be coordinated with the dress or
                overall color palette.
              </p>
            </article>

            <article className="rounded-[1.8rem] border border-[#284239]/10 bg-white p-7 shadow-sm">
              <h3 className="font-serif text-3xl font-semibold text-[#153f32]">
                Boutonnieres
              </h3>

              <p className="mt-4 leading-7 text-[#607068]">
                Boutonnieres are compact floral
                pieces typically worn on the upper
                garment. They can coordinate with a
                corsage or use complementary flowers,
                greenery, and colors.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* COLOR PLANNING */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-9 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Colors & Coordination
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
              Bring the colors you are working with.
            </h2>

            <p className="mt-5 leading-7 text-[#607068]">
              Knowing the outfit colors is one of
              the most useful parts of planning
              Homecoming flowers. A photo, color
              reference, or simple description can
              help guide the design.
            </p>

            <p className="mt-4 leading-7 text-[#607068]">
              Flowers do not always need to match the
              clothing exactly. Neutral flowers,
              complementary tones, ribbon, greenery,
              and accent colors can often create a
              more balanced finished piece.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              [
                "Dress or outfit color",
                "Bring a photo or describe the main colors as accurately as possible.",
              ],
              [
                "Suit, shirt, or tie color",
                "These details can help coordinate a boutonniere with the rest of the look.",
              ],
              [
                "Preferred flower colors",
                "If there is a color you especially want—or want to avoid—mention it when ordering.",
              ],
              [
                "School-spirit accents",
                "Orange, black, and other Port Allegany-inspired details may be useful for customers who want a stronger school-spirit look.",
              ],
            ].map(([title, text]) => (
              <article
                key={title}
                className="rounded-[1.5rem] border border-[#284239]/10 bg-white/75 p-6"
              >
                <h3 className="font-semibold text-[#153f32]">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#607068]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ORDERING TIMELINE */}
      <section className="bg-[#284239] text-[#fffaf3]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a8e69a]">
            Order Early
          </p>

          <h2 className="mt-3 max-w-4xl font-serif text-4xl font-semibold">
            How early should you order Homecoming
            flowers?
          </h2>

          <p className="mt-5 max-w-3xl leading-7 text-white/75">
            Homecoming creates concentrated demand
            around a specific date. Ordering ahead is
            the best way to give the florist time to
            plan and to improve the chances of getting
            the colors and overall style you want.
          </p>

          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {planningSteps.map(
              (step, index) => (
                <article
                  key={step.title}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e76d61] text-sm font-bold text-white">
                    {index + 1}
                  </div>

                  <h3 className="mt-4 font-serif text-xl font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/70">
                    {step.text}
                  </p>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* LOCAL */}
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          Local Homecoming Flowers
        </p>

        <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
          Homecoming flowers from Port Petals in Port
          Allegany.
        </h2>

        <p className="mt-5 leading-8 text-[#607068]">
          Port Petals serves Port Allegany with fresh
          flowers, custom creations, apparel, gifts,
          and hometown Gator gear. During Homecoming
          season, customers can browse available
          floral options online and contact the shop
          when they need help coordinating colors or
          planning a specific design.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Link
            href="/occasions/homecoming-prom"
            className="group rounded-[1.6rem] border border-[#284239]/10 bg-white/75 p-6 transition hover:-translate-y-1 hover:border-[#e76d61]/30"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
              Flowers
            </p>

            <h3 className="mt-3 font-serif text-2xl font-semibold text-[#153f32]">
              Homecoming & Prom
            </h3>

            <span className="mt-5 inline-flex text-sm font-semibold text-[#36594c]">
              Shop flowers →
            </span>
          </Link>

          <Link
            href="/gators"
            className="group rounded-[1.6rem] border border-[#284239]/10 bg-white/75 p-6 transition hover:-translate-y-1 hover:border-[#e76d61]/30"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
              School Spirit
            </p>

            <h3 className="mt-3 font-serif text-2xl font-semibold text-[#153f32]">
              Port Allegany Gator Gear
            </h3>

            <span className="mt-5 inline-flex text-sm font-semibold text-[#36594c]">
              Shop Gator Gear →
            </span>
          </Link>

          <Link
            href="/custom/request"
            className="group rounded-[1.6rem] border border-[#284239]/10 bg-white/75 p-6 transition hover:-translate-y-1 hover:border-[#e76d61]/30"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
              Personalized
            </p>

            <h3 className="mt-3 font-serif text-2xl font-semibold text-[#153f32]">
              Request Something Custom
            </h3>

            <span className="mt-5 inline-flex text-sm font-semibold text-[#36594c]">
              Start a request →
            </span>
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-[#284239]/10 bg-[#edf3e7]">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#36594c]">
            Planning for Homecoming?
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
            Start your Homecoming flower order early.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#607068]">
            Browse current Homecoming flower options
            and contact Port Petals if you need help
            choosing colors or coordinating your
            floral pieces.
          </p>

          <Link
            href="/occasions/homecoming-prom"
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-7 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
          >
            Shop Homecoming Flowers
          </Link>
        </div>
      </section>
    </main>
  );
}
