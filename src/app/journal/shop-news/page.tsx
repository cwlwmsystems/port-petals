import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbStructuredData } from "@/lib/seo/breadcrumbs";

const canonicalPath =
  "/journal/shop-news";

export const metadata: Metadata = {
  title:
    "Shop News & Local Updates",
  description:
    "Follow Port Petals shop updates, seasonal collections, new products, local events, and Port Allegany Gator gear news.",
  alternates: {
    canonical: canonicalPath,
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
      name: "Shop News",
      path: canonicalPath,
    },
  ]);

const updateCategories = [
  {
    label: "New at Port Petals",
    title: "New products and shop additions",
    description:
      "A place for newly added flowers, gifts, apparel, custom products, and other additions to the Port Petals catalog.",
    href: "/gifts",
    linkLabel: "Browse current gifts",
  },
  {
    label: "Seasonal",
    title: "What is happening in the shop right now",
    description:
      "Seasonal collections, holidays, school events, and other time-sensitive offerings will be highlighted here as they change throughout the year.",
    href: "/seasonal",
    linkLabel: "See seasonal offerings",
  },
  {
    label: "Gator Gear",
    title: "Port Allegany school-spirit updates",
    description:
      "New Gator apparel, school-spirit items, personalized pieces, and event-related products can be featured here when they become available.",
    href: "/gators",
    linkLabel: "Browse Gator Gear",
  },
  {
    label: "Events & Announcements",
    title: "Local updates from Port Petals",
    description:
      "This space will be used for meaningful shop announcements, local events, special ordering information, and other updates worth sharing.",
    href: "/journal",
    linkLabel: "Return to the Journal",
  },
];

export default function ShopNewsPage() {
  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#284239]">
      <JsonLd data={breadcrumbStructuredData} />

      {/* EDITORIAL HEADER */}
      <section className="border-b border-[#284239]/10 bg-[#153f32] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-white/55"
          >
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href="/journal"
              className="transition hover:text-white"
            >
              Journal
            </Link>

            <span>/</span>

            <span className="text-white/85">
              Shop News
            </span>
          </nav>

          <div className="mt-10 max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#a8e69a]">
              Port Petals Journal
            </p>

            <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Shop news, local updates, and what&apos;s new at Port Petals.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70 sm:text-xl">
              New products, seasonal collections, school-spirit releases, local events, and meaningful updates from the shop in Port Allegany.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED CURRENT UPDATE */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
          <article className="rounded-[2rem] bg-[#f7f1e8] p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Current Update
            </p>

            <h2 className="mt-3 max-w-3xl font-serif text-4xl font-semibold tracking-[-0.035em] text-[#153f32]">
              The Port Petals shop is now online.
            </h2>

            <p className="mt-5 max-w-3xl leading-8 text-[#607068]">
              Customers can now browse flowers, gifts, apparel, Gator gear, and other Port Petals products through the online storefront. The catalog will continue to change as seasonal products and new items are added.
            </p>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              <Link
                href="/flowers"
                className="font-semibold text-[#36594c] underline decoration-[#e76d61] decoration-2 underline-offset-4"
              >
                Shop Fresh Flowers →
              </Link>

              <Link
                href="/gifts"
                className="font-semibold text-[#607068] transition hover:text-[#e76d61]"
              >
                Browse Gifts →
              </Link>
            </div>
          </article>

          <aside className="rounded-[2rem] border border-[#284239]/10 bg-white p-7 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#36594c]">
              About Shop News
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
              Updates only when there is something worth sharing.
            </h2>

            <p className="mt-4 leading-7 text-[#607068]">
              This section will not be filled with generic posts just to create content. It is reserved for genuine Port Petals announcements, seasonal changes, new collections, event-related items, and local shop news.
            </p>
          </aside>
        </div>
      </section>

      {/* NEWS CATEGORIES */}
      <section className="border-y border-[#284239]/10 bg-[#f7f1e8]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              From the Shop
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.035em] text-[#153f32]">
              The kinds of updates you&apos;ll find here.
            </h2>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {updateCategories.map((item) => (
              <article
                key={item.title}
                className="flex min-h-[265px] flex-col rounded-[1.8rem] border border-[#284239]/10 bg-[#fffdf9] p-7"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
                  {item.label}
                </p>

                <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-[#153f32]">
                  {item.title}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-7 text-[#607068]">
                  {item.description}
                </p>

                <Link
                  href={item.href}
                  className="mt-6 inline-flex text-sm font-semibold text-[#36594c] transition hover:text-[#e76d61]"
                >
                  {item.linkLabel} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* STAY CURRENT */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
        <div className="overflow-hidden rounded-[2rem] bg-[#153f32] text-white">
          <div className="grid gap-8 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-end lg:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a8e69a]">
                See What&apos;s Available Now
              </p>

              <h2 className="mt-3 max-w-3xl font-serif text-4xl font-semibold tracking-[-0.035em]">
                The live shop is always the best place to see current products.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-white/70">
                Seasonal inventory, flowers, gifts, apparel, and Gator gear can change throughout the year.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-3">
              <Link
                href="/"
                className="font-semibold text-white underline decoration-[#e76d61] decoration-2 underline-offset-4"
              >
                Browse Port Petals →
              </Link>

              <Link
                href="/journal"
                className="font-semibold text-white/70 transition hover:text-white"
              >
                Back to Journal →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
