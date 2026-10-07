import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbStructuredData } from "@/lib/seo/breadcrumbs";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seasonal Ideas | Flowers, Gifts & Local Inspiration",
  description:
    "Seasonal flower, gift, school-spirit, holiday, and celebration ideas from Port Petals in Port Allegany, Pennsylvania.",
};

const seasonalCards = [
  {
    season: "Spring",
    title: "Fresh starts and brighter color",
    description:
      "Spring is a natural fit for fresh flowers, Easter, Mother's Day, graduations, showers, birthdays, and the first big celebrations of the year.",
    ideas: [
      "Pastel and garden-inspired flower arrangements",
      "Mother's Day flowers and thoughtful gifts",
      "Graduation flowers and personalized keepsakes",
      "Spring candles and fresh home accents",
    ],
    image: "/journal/seasonal/spring.png",
  },
  {
    season: "Summer",
    title: "Bright, relaxed, and celebratory",
    description:
      "Summer gifting can be colorful and easygoing, with flowers, custom gifts, local events, birthdays, and gatherings taking center stage.",
    ideas: [
      "Bright mixed bouquets",
      "Birthday and thank-you gifts",
      "Custom signs and personalized items",
      "Candles and easy hostess gifts",
    ],
    image: "/journal/seasonal/summer.png",
  },
  {
    season: "Fall",
    title: "Homecoming, football, and hometown pride",
    description:
      "Fall brings some of Port Allegany's biggest school-spirit moments, along with homecoming, football, senior nights, and warm seasonal color.",
    ideas: [
      "Homecoming flowers and corsages",
      "Port Allegany Gator gear",
      "Player and senior-night personalized items",
      "Fall flowers, candles, and warm seasonal gifts",
    ],
    image: "/journal/seasonal/autumn.jpg",
  },
  {
    season: "Winter",
    title: "Warm gifts for colder days",
    description:
      "Winter is a good time for holiday arrangements, candles, custom gifts, personalized pieces, and meaningful gifts for family and friends.",
    ideas: [
      "Holiday flower arrangements",
      "Candles and cozy gifts",
      "Personalized keepsakes",
      "Custom shirts and hometown gear",
    ],
    image: "/journal/seasonal/winter.jpg",
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
      {
        name: "Seasonal Ideas",
        path: "/journal/seasonal-ideas",
      },
  ]);

export default function SeasonalIdeasPage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <JsonLd data={breadcrumbStructuredData} />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_48%,#edf3e7_100%)]" />
        <div className="absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full bg-[#efa99f]/35 blur-[90px]" />
        <div className="absolute -right-16 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#c9e2ba]/45 blur-[100px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_.9fr] lg:px-10 lg:py-18">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
              Port Petals Journal
            </p>

            <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              Seasonal ideas for the moments people remember.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52655d]">
              Flowers, gifts, school spirit, holidays, and local celebrations
              change throughout the year. This guide can help you find ideas
              that fit the season and the occasion.
            </p>

            <p className="mt-4 max-w-2xl leading-7 text-[#607068]">
              Port Petals carries a mix of fresh flowers, candles, custom
              creations, shirts, and hometown Gator gear, so seasonal gifting
              can be as simple or as personalized as you want it to be.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-[210px] overflow-hidden rounded-[1.7rem] shadow-md">
              <Image
                src="/journal/seasonal/spring.png"
                alt="Fresh flowers from Port Petals"
                fill
                priority
                sizes="(max-width: 1023px) 50vw, 22vw"
                className="object-cover"
              />
            </div>

            <div className="relative h-[210px] overflow-hidden rounded-[1.7rem] shadow-md">
              <Image
                src="/journal/seasonal/autumn.jpg"
                alt="Port Allegany Gator gear"
                fill
                sizes="(max-width: 1023px) 50vw, 22vw"
                className="object-cover"
              />
            </div>

            <div className="relative h-[210px] overflow-hidden rounded-[1.7rem] shadow-md">
              <Image
                src="/journal/seasonal/winter.jpg"
                alt="Candles from Port Petals"
                fill
                sizes="(max-width: 1023px) 50vw, 22vw"
                className="object-cover"
              />
            </div>

            <div className="relative h-[210px] overflow-hidden rounded-[1.7rem] shadow-md">
              <Image
                src="/journal/seasonal/summer.png"
                alt="Custom gifts from Port Petals"
                fill
                sizes="(max-width: 1023px) 50vw, 22vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal mindset */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] bg-[#284239] p-8 text-[#fffaf3] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a8e69a]">
            A Simple Way to Plan
          </p>

          <h2 className="mt-3 font-serif text-3xl font-semibold">
            Think about season, occasion, and personality.
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[
              [
                "Season",
                "Let the colors, weather, school calendar, and holidays help set the direction.",
              ],
              [
                "Occasion",
                "Birthdays, graduations, homecoming, sympathy, holidays, and everyday moments all call for different styles.",
              ],
              [
                "Person",
                "Think about whether they love flowers, local school spirit, candles, personalized gifts, or something practical.",
              ],
            ].map(([title, description], index) => (
              <article
                key={title}
                className="rounded-[1.3rem] border border-white/10 bg-white/5 p-5"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e76d61] text-xs font-bold text-white">
                  {index + 1}
                </div>

                <h3 className="mt-4 font-serif text-xl font-semibold">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#e7dedc]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Seasons */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          Through the Year
        </p>

        <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
          Ideas for every season.
        </h2>

        <div className="mt-8 space-y-8">
          {seasonalCards.map((item, index) => (
            <article
              key={item.season}
              className="grid overflow-hidden rounded-[2rem] border border-[#284239]/10 bg-white/70 shadow-sm lg:grid-cols-2"
            >
              <div
                className={`relative min-h-[320px] ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <Image
                  src={item.image}
                  alt={`${item.season} gift inspiration from Port Petals`}
                  fill
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className="p-7 sm:p-9">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
                  {item.season}
                </p>

                <h3 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-[#607068]">
                  {item.description}
                </p>

                <ul className="mt-6 space-y-2 text-sm leading-6 text-[#607068]">
                  {item.ideas.map((idea) => (
                    <li key={idea} className="flex gap-2">
                      <span className="mt-[2px] text-[#e76d61]">•</span>
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Major occasions */}
      <section className="bg-[#edf3e7]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#36594c]">
            Holidays & Milestones
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
            Some moments are worth planning ahead for.
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              [
                "Valentine's Day",
                "Flowers, romantic arrangements, candles, and personalized gifts are popular choices.",
              ],
              [
                "Mother's Day",
                "Fresh flowers, candles, custom creations, and thoughtful keepsakes work well for moms, grandmothers, and caregivers.",
              ],
              [
                "Graduation",
                "Flowers, school-color gifts, personalized keepsakes, shirts, and hometown gear can help celebrate the milestone.",
              ],
              [
                "Prom & Homecoming",
                "Corsages, boutonnieres, flowers, school spirit, and personalized items often require advance planning.",
              ],
              [
                "Senior Night",
                "Player numbers, names, team colors, signs, shirts, and Gator gifts can make the night more personal.",
              ],
              [
                "Christmas & Holidays",
                "Holiday flowers, candles, personalized gifts, local items, and custom creations are popular seasonal choices.",
              ],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-[1.6rem] border border-[#284239]/10 bg-white/70 p-6"
              >
                <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#607068]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* School spirit */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Port Allegany
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
              School spirit is its own season.
            </h2>

            <p className="mt-5 leading-7 text-[#607068]">
              Football, homecoming, senior nights, cheerleading, soccer,
              graduation, and other school events create plenty of opportunities
              for gifts that feel specific to Port Allegany.
            </p>

            <p className="mt-4 leading-7 text-[#607068]">
              Names, player numbers, school colors, team references, and
              personalized details can turn a simple item into something much
              more memorable.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/gators"
                className="rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
              >
                Shop Gator Gear
              </Link>

              <Link
                href="/custom/request"
                className="rounded-full border border-[#284239]/15 bg-white px-6 py-3 font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Request Something Custom
              </Link>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] shadow-md">
            <Image
              src="/collections/gators.jpg"
              alt="Port Allegany Gator gear from Port Petals"
              fill
              sizes="(max-width: 1023px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Plan ahead */}
      <section className="bg-[#284239] text-[#fffaf3]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a8e69a]">
            Plan Ahead
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold">
            Custom and seasonal orders need a little more time.
          </h2>

          <p className="mt-5 max-w-3xl leading-7 text-[#e7dedc]">
            Busy holidays, school events, sympathy work, customized shirts, and
            personalized gifts can require additional preparation time.
            Ordering earlier gives the shop more room to work with your date,
            design, and product choices.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-6">
              <h3 className="font-serif text-xl font-semibold">
                Fresh Flowers
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#e7dedc]">
                General flower orders require preparation time, with sympathy
                arrangements requiring additional lead time.
              </p>
            </div>

            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-6">
              <h3 className="font-serif text-xl font-semibold">
                Custom Products
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#e7dedc]">
                Personalized and made-to-order products need time for design
                and preparation.
              </p>
            </div>

            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-6">
              <h3 className="font-serif text-xl font-semibold">
                High-Demand Dates
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#e7dedc]">
                Holidays, homecoming, graduation, and major school events can
                fill available order capacity quickly.
              </p>
            </div>
          </div>

          <Link
            href="/fulfillment"
            className="mt-7 inline-flex text-sm font-semibold text-[#fffaf3] underline decoration-[#a8e69a]/50 underline-offset-4 transition hover:text-[#a8e69a]"
          >
            View Pickup & Delivery Details →
          </Link>
        </div>
      </section>

      {/* Browse by category */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          Browse by Category
        </p>

        <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
          Find the right starting point.
        </h2>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Flowers", "/flowers"],
            ["Candles", "/candles"],
            ["Custom", "/custom"],
            ["Shirts", "/apparel"],
            ["Gator Gear", "/gators"],
          ].map(([title, href]) => (
            <Link
              key={title}
              href={href}
              className="rounded-[1.5rem] border border-[#284239]/10 bg-white/70 p-6 text-center font-serif text-xl font-semibold text-[#153f32] transition hover:-translate-y-1 hover:border-[#e76d61]/30 hover:text-[#e76d61]"
            >
              {title}
            </Link>
          ))}
        </div>
      </section>

      {/* Availability note */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-[#e76d61]/15 bg-[#faefe5] p-8 text-center sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
            Seasonal Availability
          </p>

          <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
            The shop changes with the season.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#607068]">
            Flower varieties, seasonal products, colors, materials, and
            ready-made inventory can change throughout the year. The current
            online catalog reflects what Port Petals is offering now.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
          >
            See What's Available
          </Link>
        </div>
      </section>
    </main>
  );
}
