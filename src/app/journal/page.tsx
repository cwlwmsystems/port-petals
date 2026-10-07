import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbStructuredData } from "@/lib/seo/breadcrumbs";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Journal | Flower Care, Gift Ideas & Port Petals News",
  description:
    "Explore flower care tips, seasonal inspiration, gift guides, and shop news from Port Petals in Port Allegany, Pennsylvania.",
};

const featuredArticles = [
  {
    title:
      "Homecoming Flowers in Port Allegany: Corsages, Boutonnieres & Ordering Tips",
    description:
      "Plan Homecoming flowers with guidance on corsages, boutonnieres, colors, coordinating designs, and when to place your order.",
    href:
      "/journal/homecoming-flowers-port-allegany",
    label: "Homecoming Guide",
  },
  {
    title:
      "Sympathy Flowers in Port Allegany: What to Send & How to Choose",
    description:
      "Learn how to choose sympathy flowers, arrangement styles, colors, messages, and timing with guidance from Port Petals.",
    href:
      "/journal/sympathy-flowers-port-allegany",
    label: "Sympathy Guide",
  },
];

const sections = [
  {
    title: "Seasonal Ideas",
    description:
      "Fresh inspiration for holidays, school events, celebrations, changing seasons, and thoughtful local gifts.",
    href: "/journal/seasonal-ideas",
    label: "Seasonal Inspiration",
  },
  {
    title: "Flower Care",
    description:
      "Simple guidance to help fresh flowers and arrangements stay beautiful for as long as possible.",
    href: "/journal/flower-care",
    label: "Flower Care",
  },
  {
    title: "Gift Guides",
    description:
      "Ideas for pairing flowers, candles, custom creations, shirts, and local gifts for different occasions.",
    href: "/journal/gift-guides",
    label: "Gift Ideas",
  },
  {
    title: "Shop News",
    description:
      "New products, seasonal collections, local events, Port Allegany Gator gear, and updates from Port Petals.",
    href: "/journal/shop-news",
    label: "From the Shop",
  },
];


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
  ]);

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <JsonLd data={breadcrumbStructuredData} />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_48%,#edf3e7_100%)]" />
        <div className="absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full bg-[#efa99f]/35 blur-[90px]" />
        <div className="absolute -right-16 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#c9e2ba]/45 blur-[100px]" />

        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
            Port Petals Journal
          </p>

          <h1 className="mt-4 max-w-4xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
            Ideas, care tips, and a little inspiration from the shop.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#52655d]">
            Explore useful flower-care guidance, seasonal ideas, gift
            inspiration, and updates from Port Petals in Port Allegany,
            Pennsylvania.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8 lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
            Featured Guides
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
            Helpful ideas for what is happening now.
          </h2>
        </div>

        <div className="mt-7 grid gap-6">
          {featuredArticles.map(
            (article) => (
              <Link
                key={article.href}
                href={article.href}
                className="group rounded-[1.8rem] border border-[#284239]/10 bg-[#fffaf3] p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#e76d61]/25 hover:shadow-[0_18px_45px_rgba(42,66,57,0.10)] sm:p-8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
                  {article.label}
                </p>

                <h3 className="mt-3 max-w-4xl font-serif text-3xl font-semibold text-[#153f32]">
                  {article.title}
                </h3>

                <p className="mt-4 max-w-3xl leading-7 text-[#607068]">
                  {article.description}
                </p>

                <span className="mt-6 inline-flex text-sm font-semibold text-[#284239] transition group-hover:text-[#e76d61]">
                  Read the guide →
                </span>
              </Link>
            )
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-[1.8rem] border border-[#284239]/10 bg-white/70 p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#e76d61]/25 hover:shadow-[0_18px_45px_rgba(42,66,57,0.10)] sm:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
                {section.label}
              </p>

              <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
                {section.title}
              </h2>

              <p className="mt-4 leading-7 text-[#607068]">
                {section.description}
              </p>

              <span className="mt-6 inline-flex text-sm font-semibold text-[#284239] transition group-hover:text-[#e76d61]">
                Explore {section.title} →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] bg-[#284239] p-8 text-[#fffaf3] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a8e69a]">
            Looking for something special?
          </p>

          <h2 className="mt-3 font-serif text-3xl font-semibold">
            Browse the Port Petals shop.
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-[#e7dedc]">
            Shop fresh flowers, candles, custom creations, shirts, and hometown
            Gator gear online for local pickup or approved local delivery.
          </p>

          <Link
            href="/flowers"
            className="mt-6 inline-flex rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
          >
            Shop Port Petals
          </Link>
        </div>
      </section>
    </main>
  );
}
