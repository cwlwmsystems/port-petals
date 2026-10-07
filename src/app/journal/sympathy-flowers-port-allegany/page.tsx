import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbStructuredData } from "@/lib/seo/breadcrumbs";

const canonicalPath =
  "/journal/sympathy-flowers-port-allegany";

const canonicalUrl =
  `https://www.portpetals.com${canonicalPath}`;

export const metadata: Metadata = {
  title:
    "Sympathy Flowers in Port Allegany | What to Send & How to Choose",
  description:
    "Learn how to choose sympathy flowers in Port Allegany, including arrangement ideas, colors, messages, timing, and thoughtful gift options from Port Petals.",
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    type: "article",
    title:
      "Sympathy Flowers in Port Allegany | What to Send & How to Choose",
    description:
      "A practical guide to choosing sympathy flowers, arrangements, colors, messages, and thoughtful gifts from Port Petals in Port Allegany.",
    url: canonicalPath,
    images: [
      {
        url: "/collections/fresh-flowers.jpg",
        alt:
          "Fresh sympathy flowers from Port Petals in Port Allegany",
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
        "Sympathy Flowers in Port Allegany",
      path: canonicalPath,
    },
  ]);

const articleStructuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Sympathy Flowers in Port Allegany: What to Send and How to Choose",
  description:
    "A practical guide to choosing sympathy flowers, arrangements, colors, messages, and thoughtful gifts from Port Petals in Port Allegany, Pennsylvania.",
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
    "https://www.portpetals.com/collections/fresh-flowers.jpg",
  url: canonicalUrl,
};

const arrangementTypes = [
  {
    title: "Fresh Floral Arrangements",
    text:
      "A vase or container arrangement is a versatile choice that can be sent to a home, service, workplace, or another appropriate location.",
  },
  {
    title: "Standing or Memorial Pieces",
    text:
      "Larger floral tributes may be appropriate for memorial services, visitations, or funeral settings when a more formal presentation is desired.",
  },
  {
    title: "Thoughtful Gifts & Keepsakes",
    text:
      "Flowers can also be paired with a candle, keepsake, or personalized gift when you want to offer something that lasts beyond the flowers themselves.",
  },
];

const colorIdeas = [
  {
    title: "White & Green",
    text:
      "A classic and understated combination that often feels peaceful and elegant.",
  },
  {
    title: "Soft Pastels",
    text:
      "Blush, lavender, pale yellow, and other gentle tones can create a warm and comforting look.",
  },
  {
    title: "Favorite Colors",
    text:
      "Using colors connected to the person being remembered can make the arrangement feel more personal.",
  },
  {
    title: "Natural & Seasonal Tones",
    text:
      "Seasonal flowers and greenery can create a softer, more organic tribute.",
  },
];

export default function SympathyFlowersArticlePage() {
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
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(110deg,#f7eadc_0%,#faefe5_46%,#edf3e7_100%)]" />

        <div className="absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full bg-[#efa99f]/25 blur-[90px]" />

        <div className="absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#c9e2ba]/40 blur-[100px]" />

        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#e76d61]">
              Port Petals Journal · Sympathy
            </p>

            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              Sympathy flowers in Port Allegany:
              what to send and how to choose
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#52655d]">
              Choosing sympathy flowers can feel
              difficult when you are already trying
              to support someone through a loss.
              A thoughtful arrangement does not need
              to be complicated to be meaningful.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/occasions/sympathy"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
              >
                Shop Sympathy Flowers
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
              src="/collections/fresh-flowers.jpg"
              alt="Fresh sympathy flowers from Port Petals in Port Allegany"
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
          Choosing with Care
        </p>

        <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.03em] text-[#153f32]">
          What kind of sympathy flowers should you send?
        </h2>

        <div className="mt-6 space-y-5 text-base leading-8 text-[#607068]">
          <p>
            There is no single correct type of
            sympathy arrangement. The best choice
            depends on where the flowers are going,
            your relationship to the family, and
            whether you want something traditional,
            personal, or simple.
          </p>

          <p>
            A fresh arrangement in a vase or
            container is often a flexible choice
            because it can be sent to a home,
            service, or another appropriate
            destination. More formal pieces may be
            suitable for services or memorials.
          </p>

          <p>
            Port Petals can help customers in and
            around Port Allegany choose flowers that
            feel respectful, thoughtful, and
            appropriate for the situation.
          </p>
        </div>
      </section>

      {/* ARRANGEMENT TYPES */}
      <section className="bg-[#fffaf3]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#36594c]">
            Types of Sympathy Flowers
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
            Choose an arrangement that fits the setting.
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {arrangementTypes.map(
              (item) => (
                <article
                  key={item.title}
                  className="rounded-[1.8rem] border border-[#284239]/10 bg-white p-7 shadow-sm"
                >
                  <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-[#607068]">
                    {item.text}
                  </p>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* COLOR */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-9 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Choosing Colors
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
              Sympathy flowers do not have to be only white.
            </h2>

            <p className="mt-5 leading-7 text-[#607068]">
              White flowers are traditional, but
              sympathy arrangements can also include
              soft colors, seasonal flowers, or
              colors that were meaningful to the
              person being remembered.
            </p>

            <p className="mt-4 leading-7 text-[#607068]">
              If you know a favorite color, flower,
              hobby, team, or personal detail, it may
              help create a tribute that feels more
              connected to the individual.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {colorIdeas.map(
              (item) => (
                <article
                  key={item.title}
                  className="rounded-[1.5rem] border border-[#284239]/10 bg-white/75 p-6"
                >
                  <h3 className="font-semibold text-[#153f32]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#607068]">
                    {item.text}
                  </p>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* CARD MESSAGE */}
      <section className="bg-[#edf3e7]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#36594c]">
            What to Write
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
            A short, sincere message is enough.
          </h2>

          <p className="mt-5 max-w-3xl leading-7 text-[#607068]">
            Sympathy messages do not need to be long.
            A few genuine words of support can be
            more meaningful than trying to find a
            perfect phrase.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Thinking of you and your family during this difficult time.",
              "With deepest sympathy and caring thoughts.",
              "Wishing you comfort and peace in the days ahead.",
            ].map(
              (message) => (
                <blockquote
                  key={message}
                  className="rounded-[1.5rem] border border-[#284239]/10 bg-white/75 p-6 font-serif text-xl leading-8 text-[#36594c]"
                >
                  “{message}”
                </blockquote>
              )
            )}
          </div>
        </div>
      </section>

      {/* TIMING */}
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          Timing
        </p>

        <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
          When should sympathy flowers be sent?
        </h2>

        <div className="mt-6 space-y-5 leading-8 text-[#607068]">
          <p>
            Flowers can be sent before a service,
            delivered to a memorial or funeral
            location when appropriate, or sent to the
            family afterward.
          </p>

          <p>
            There is no strict rule that says flowers
            must arrive immediately. Sending an
            arrangement after the first few days can
            still be a meaningful way to show support
            when the initial rush of activity has
            passed.
          </p>

          <p>
            If timing or delivery details are
            uncertain, contacting the florist before
            ordering can help avoid confusion.
          </p>
        </div>
      </section>

      {/* LOCAL */}
      <section className="bg-[#284239] text-[#fffaf3]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a8e69a]">
            Local Sympathy Flowers
          </p>

          <h2 className="mt-3 max-w-4xl font-serif text-4xl font-semibold">
            Sympathy flowers from Port Petals in Port Allegany.
          </h2>

          <p className="mt-5 max-w-3xl leading-7 text-white/75">
            Port Petals creates fresh floral
            arrangements and thoughtful gifts for
            families in and around Port Allegany.
            Customers can browse available sympathy
            options online and choose pickup or
            eligible local delivery when available.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Link
              href="/occasions/sympathy"
              className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a8e69a]">
                Sympathy
              </p>

              <h3 className="mt-3 font-serif text-2xl font-semibold">
                Shop Sympathy Flowers
              </h3>

              <span className="mt-5 inline-flex text-sm font-semibold text-white">
                Browse options →
              </span>
            </Link>

            <Link
              href="/flowers"
              className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a8e69a]">
                Fresh Flowers
              </p>

              <h3 className="mt-3 font-serif text-2xl font-semibold">
                Browse Floral Arrangements
              </h3>

              <span className="mt-5 inline-flex text-sm font-semibold text-white">
                Shop flowers →
              </span>
            </Link>

            <Link
              href="/gifts"
              className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a8e69a]">
                Thoughtful Gifts
              </p>

              <h3 className="mt-3 font-serif text-2xl font-semibold">
                Gifts & Keepsakes
              </h3>

              <span className="mt-5 inline-flex text-sm font-semibold text-white">
                Browse gifts →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-[#284239]/10 bg-[#fffaf3]">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
            Need Help Choosing?
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
            Choose something simple, thoughtful, and sincere.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#607068]">
            Browse Port Petals sympathy flowers or
            contact the shop if you need help
            deciding what type of arrangement is most
            appropriate.
          </p>

          <Link
            href="/occasions/sympathy"
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-7 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
          >
            Shop Sympathy Flowers
          </Link>
        </div>
      </section>
    </main>
  );
}
