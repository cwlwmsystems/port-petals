import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbStructuredData } from "@/lib/seo/breadcrumbs";

export const metadata: Metadata = {
  title:
    "Journal | Flower Guides, Gift Ideas & Port Petals Stories",
  description:
    "Explore flower guides, seasonal inspiration, thoughtful gift ideas, Port Allegany stories, and shop updates from Port Petals.",
  alternates: {
    canonical: "/journal",
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
  ]);

const secondaryStories = [
  {
    eyebrow: "Sympathy Guide",
    title:
      "Sympathy flowers in Port Allegany",
    description:
      "What to send, how to choose an arrangement, what to write, and how to keep the gesture thoughtful.",
    href:
      "/journal/sympathy-flowers-port-allegany",
    image:
      "/collections/fresh-flowers.jpg",
    imageAlt:
      "Fresh floral arrangements from Port Petals",
    readTime: "6 min read",
  },
  {
    eyebrow: "Flower Care",
    title:
      "How to care for fresh flowers",
    description:
      "Simple ways to help fresh-cut flowers stay hydrated, clean, and beautiful for as long as possible.",
    href:
      "/journal/flower-care",
    image:
      "/collections/fresh-flowers.jpg",
    imageAlt:
      "Fresh flowers from Port Petals",
    readTime: "7 min read",
  },
];

const departments = [
  {
    number: "01",
    label: "Flower Care",
    title:
      "Make the flowers last",
    description:
      "Practical guidance for water, stems, placement, vase care, and getting more enjoyment from fresh flowers.",
    href:
      "/journal/flower-care",
  },
  {
    number: "02",
    label: "Gift Guides",
    title:
      "Choose something that feels personal",
    description:
      "Ideas for combining flowers, candles, custom creations, apparel, and hometown favorites.",
    href:
      "/journal/gift-guides",
  },
  {
    number: "03",
    label: "Seasonal Ideas",
    title:
      "Follow the rhythm of the year",
    description:
      "Spring celebrations, summer gifting, Homecoming, football, holidays, and the moments between them.",
    href:
      "/journal/seasonal-ideas",
  },
  {
    number: "04",
    label: "Shop News",
    title:
      "See what is happening at Port Petals",
    description:
      "New products, seasonal collections, local announcements, school-spirit releases, and meaningful shop updates.",
    href:
      "/journal/shop-news",
  },
];

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#284239]">
      <JsonLd data={breadcrumbStructuredData} />

      {/* MASTHEAD */}
      <section className="border-b border-[#284239]/10 bg-[#f7f1e8]">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e76d61]">
                Stories · Guides · Inspiration
              </p>

              <h1 className="mt-2 font-serif text-5xl font-semibold tracking-[-0.05em] text-[#153f32] sm:text-6xl">
                Port Petals Journal
              </h1>
            </div>

            <p className="max-w-xl text-sm leading-7 text-[#607068] sm:text-right">
              Flowers, thoughtful gifting, seasonal
              ideas, hometown moments, and useful
              advice from the shop in Port Allegany.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURE STORY */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <Link
          href="/journal/homecoming-flowers-port-allegany"
          className="group relative block min-h-[580px] overflow-hidden rounded-[2rem] bg-[#153f32] sm:min-h-[650px] lg:min-h-[690px]"
        >
          <Image
            src="/journal/seasonal/autumn.jpg"
            alt="Fall Homecoming inspiration from Port Petals in Port Allegany"
            fill
            priority
            sizes="(max-width: 1279px) calc(100vw - 40px), 1200px"
            className="object-cover transition duration-700 group-hover:scale-[1.02]"
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,35,28,.92)_0%,rgba(12,35,28,.72)_44%,rgba(12,35,28,.24)_75%,rgba(12,35,28,.08)_100%)]" />

          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#112f27]/85 to-transparent" />

          <div className="relative flex min-h-[580px] flex-col justify-between p-7 sm:min-h-[650px] sm:p-10 lg:min-h-[690px] lg:p-12">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur-sm">
                Featured Story
              </span>

              <span className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-white/55 sm:block">
                Homecoming · 6 min read
              </span>
            </div>

            <div className="max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ffd0c8]">
                Homecoming in Port Allegany
              </p>

              <h2 className="mt-4 max-w-4xl font-serif text-5xl font-semibold leading-[.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[5rem]">
                Flowers for the night.
                Hometown pride for everything around it.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
                Corsages, boutonnieres, color
                coordination, and what to know before
                you place your Homecoming order.
              </p>

              <span className="mt-7 inline-flex items-center font-semibold text-white">
                Read the feature
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* EDITOR'S PICKS */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-5 sm:px-8 lg:px-10">
        <div className="flex items-end justify-between gap-6 border-b border-[#284239]/10 pb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e76d61]">
              Editor&apos;s Picks
            </p>

            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.035em] text-[#153f32] sm:text-4xl">
              Worth reading next.
            </h2>
          </div>

          <span className="hidden text-sm text-[#718078] sm:block">
            From the Port Petals Journal
          </span>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {secondaryStories.map((story) => (
            <Link
              key={story.href}
              href={story.href}
              className="group"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.7rem] bg-[#f1ece5]">
                <Image
                  src={story.image}
                  alt={story.imageAlt}
                  fill
                  sizes="(max-width: 767px) calc(100vw - 40px), 580px"
                  className="object-cover transition duration-500 group-hover:scale-[1.025]"
                />
              </div>

              <div className="pt-5">
                <div className="flex items-center gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
                    {story.eyebrow}
                  </p>

                  <span className="h-1 w-1 rounded-full bg-[#9da8a2]" />

                  <span className="text-xs text-[#7b8881]">
                    {story.readTime}
                  </span>
                </div>

                <h3 className="mt-3 max-w-xl font-serif text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#153f32] transition group-hover:text-[#36594c]">
                  {story.title}
                </h3>

                <p className="mt-3 max-w-xl leading-7 text-[#607068]">
                  {story.description}
                </p>

                <span className="mt-5 inline-flex text-sm font-semibold text-[#36594c] transition group-hover:text-[#e76d61]">
                  Read the guide →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* EDITORIAL BREAK */}
      <section className="bg-[#153f32] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-10 lg:py-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a8e69a]">
              From Port Allegany
            </p>

            <h2 className="mt-3 max-w-xl font-serif text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              Useful enough to save.
              Local enough to feel familiar.
            </h2>
          </div>

          <div>
            <p className="max-w-2xl text-lg leading-8 text-white/70">
              The Journal is where Port Petals can go
              beyond the product page: how to care
              for flowers, what to bring when
              ordering a corsage, how to choose a
              thoughtful gift, and what the season
              means here at home.
            </p>
          </div>
        </div>
      </section>

      {/* JOURNAL DEPARTMENTS */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e76d61]">
            Explore the Journal
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-5xl">
            Find the kind of story you need.
          </h2>
        </div>

        <div className="mt-10 border-t border-[#284239]/12">
          {departments.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group grid gap-4 border-b border-[#284239]/12 py-7 transition sm:grid-cols-[65px_190px_1fr_auto] sm:items-center sm:gap-6"
            >
              <span className="font-serif text-xl text-[#a1aaa5]">
                {item.number}
              </span>

              <p className="text-xs font-semibold uppercase tracking-[0.21em] text-[#e76d61]">
                {item.label}
              </p>

              <div>
                <h3 className="font-serif text-2xl font-semibold tracking-[-0.025em] text-[#153f32] sm:text-3xl">
                  {item.title}
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#607068]">
                  {item.description}
                </p>
              </div>

              <span className="text-xl text-[#36594c] transition group-hover:translate-x-1 group-hover:text-[#e76d61]">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* SEASONAL FEATURE */}
      <section className="bg-[#f7f1e8]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:py-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            <Image
              src="/journal/seasonal/autumn.jpg"
              alt="Seasonal inspiration from Port Petals"
              fill
              sizes="(max-width: 1023px) calc(100vw - 40px), 600px"
              className="object-cover"
            />
          </div>

          <div className="lg:pl-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e76d61]">
              Seasonal Ideas
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#153f32] sm:text-5xl">
              Every season gives the shop a different story.
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-[#607068]">
              Spring celebrations, summer color,
              Homecoming and football, holiday
              gifting, and winter traditions all
              bring different flowers, products,
              and moments into focus.
            </p>

            <Link
              href="/journal/seasonal-ideas"
              className="mt-7 inline-flex font-semibold text-[#36594c] underline decoration-[#e76d61] decoration-2 underline-offset-4"
            >
              Explore the seasons →
            </Link>
          </div>
        </div>
      </section>

      {/* SHOP NEWS */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-8 border-b border-[#284239]/10 pb-14 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e76d61]">
              Shop News
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.035em] text-[#153f32]">
              What&apos;s happening at Port Petals.
            </h2>
          </div>

          <div>
            <p className="max-w-2xl text-lg leading-8 text-[#607068]">
              New products, seasonal changes,
              school-spirit releases, local events,
              and shop announcements have their own
              home in the Journal.
            </p>

            <Link
              href="/journal/shop-news"
              className="mt-6 inline-flex font-semibold text-[#36594c] underline decoration-[#e76d61] decoration-2 underline-offset-4"
            >
              Visit Shop News →
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-20">
        <div className="overflow-hidden rounded-[2rem] bg-[#153f32] text-white">
          <div className="grid gap-8 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-end lg:p-11">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a8e69a]">
                From Inspiration to the Shop
              </p>

              <h2 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                Find something that fits the moment.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-white/70">
                Browse fresh flowers, gifts,
                apparel, custom creations, and
                hometown Gator favorites from
                Port Petals.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <Link
                href="/flowers"
                className="font-semibold text-white underline decoration-[#e76d61] decoration-2 underline-offset-4"
              >
                Shop Flowers →
              </Link>

              <Link
                href="/gifts"
                className="font-semibold text-white/70 transition hover:text-white"
              >
                Browse Gifts →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
