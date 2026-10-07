import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import JournalFeatureLayout, {
  FeatureIntro,
  FeaturePullQuote,
  FeatureSection,
} from "@/components/journal/JournalFeatureLayout";
import { buildBreadcrumbStructuredData } from "@/lib/seo/breadcrumbs";

const canonicalPath =
  "/journal/seasonal-ideas";

const canonicalUrl =
  `https://www.portpetals.com${canonicalPath}`;

export const metadata: Metadata = {
  title:
    "Seasonal Ideas | Flowers, Gifts & Local Inspiration",
  description:
    "Seasonal flower, gift, school-spirit, holiday, and celebration ideas from Port Petals in Port Allegany, Pennsylvania.",
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    type: "article",
    title:
      "Seasonal Ideas | Flowers, Gifts & Local Inspiration",
    description:
      "Explore spring, summer, fall, winter, holiday, school-spirit, and celebration ideas from Port Petals.",
    url: canonicalPath,
    images: [
      {
        url: "/journal/seasonal/autumn.jpg",
        alt:
          "Seasonal inspiration from Port Petals in Port Allegany",
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
      name: "Seasonal Ideas",
      path: canonicalPath,
    },
  ]);

const articleStructuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Seasonal Ideas for Flowers, Gifts and Local Celebrations",
  description:
    "A seasonal guide to flowers, gifts, holidays, school spirit, and local celebrations from Port Petals in Port Allegany, Pennsylvania.",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": canonicalUrl,
  },
  datePublished: "2026-10-07",
  dateModified: "2026-10-07",
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

const guideItems = [
  {
    label: "Spring",
    href: "#spring",
  },
  {
    label: "Summer",
    href: "#summer",
  },
  {
    label: "Fall",
    href: "#fall",
  },
  {
    label: "Winter",
    href: "#winter",
  },
  {
    label: "Holidays & milestones",
    href: "#milestones",
  },
  {
    label: "Port Allegany traditions",
    href: "#port-allegany",
  },
];

const seasons = [
  {
    id: "spring",
    season: "Spring",
    title: "Fresh starts and brighter color",
    description:
      "Spring is a natural fit for fresh flowers, Easter, Mother's Day, graduations, showers, birthdays, and the first big celebrations of the year.",
    image: "/journal/seasonal/spring.png",
    ideas: [
      "Pastel and garden-inspired flower arrangements",
      "Mother's Day flowers and thoughtful gifts",
      "Graduation flowers and personalized keepsakes",
      "Spring candles and fresh home accents",
    ],
  },
  {
    id: "summer",
    season: "Summer",
    title: "Bright, relaxed, and celebratory",
    description:
      "Summer gifting can be colorful and easygoing, with flowers, custom gifts, local events, birthdays, and gatherings taking center stage.",
    image: "/journal/seasonal/summer.png",
    ideas: [
      "Bright mixed bouquets",
      "Birthday and thank-you gifts",
      "Custom signs and personalized items",
      "Candles and easy hostess gifts",
    ],
  },
  {
    id: "fall",
    season: "Fall",
    title: "Homecoming, football, and hometown pride",
    description:
      "Fall brings some of Port Allegany's biggest school-spirit moments, along with Homecoming, football, senior nights, and warm seasonal color.",
    image: "/journal/seasonal/autumn.jpg",
    ideas: [
      "Homecoming flowers and corsages",
      "Port Allegany Gator gear",
      "Player and senior-night personalized items",
      "Fall flowers, candles, and warm seasonal gifts",
    ],
  },
  {
    id: "winter",
    season: "Winter",
    title: "Warm gifts for colder days",
    description:
      "Winter is a natural time for holiday arrangements, candles, custom gifts, personalized pieces, and meaningful gifts for family and friends.",
    image: "/journal/seasonal/winter.jpg",
    ideas: [
      "Holiday flower arrangements",
      "Candles and cozy gifts",
      "Personalized keepsakes",
      "Custom apparel and hometown gear",
    ],
  },
];

const milestones = [
  {
    title: "Valentine's Day",
    text:
      "Flowers, romantic arrangements, candles, and personalized gifts are classic choices.",
  },
  {
    title: "Mother's Day",
    text:
      "Fresh flowers, candles, custom creations, and thoughtful keepsakes work well for moms, grandmothers, and caregivers.",
  },
  {
    title: "Graduation",
    text:
      "Flowers, school-color gifts, personalized keepsakes, apparel, and hometown gear can help celebrate the milestone.",
  },
  {
    title: "Prom & Homecoming",
    text:
      "Corsages, boutonnieres, school spirit, and personalized items often benefit from advance planning.",
  },
  {
    title: "Senior Night",
    text:
      "Player numbers, names, team colors, signs, apparel, and Gator gifts can make the night more personal.",
  },
  {
    title: "Christmas & Holidays",
    text:
      "Holiday flowers, candles, personalized gifts, local items, and custom creations make practical seasonal gifts.",
  },
];

export default function SeasonalIdeasPage() {
  return (
    <>
      <JsonLd data={breadcrumbStructuredData} />
      <JsonLd data={articleStructuredData} />

      <JournalFeatureLayout
        category="Seasonal Ideas"
        title="A year of flowers, gifts, and local moments"
        introduction="The shop changes with the calendar. From spring celebrations to Homecoming, football, holidays, and winter gifting, each season brings its own reasons to make something feel special."
        imageSrc="/journal/seasonal/autumn.jpg"
        imageAlt="Fall seasonal inspiration from Port Petals in Port Allegany"
        publishedDate="October 7, 2026"
        readingTime="8 min read"
        guideItems={guideItems}
        relatedArticles={[
          {
            eyebrow: "Homecoming Guide",
            title:
              "Homecoming flowers in Port Allegany",
            description:
              "Corsages, boutonnieres, color coordination, and what to know before ordering.",
            href:
              "/journal/homecoming-flowers-port-allegany",
          },
          {
            eyebrow: "Gift Guide",
            title:
              "Thoughtful gifts start with the person",
            description:
              "Flowers, candles, custom creations, apparel, and hometown favorites.",
            href:
              "/journal/gift-guides",
          },
        ]}
      >
        <FeatureIntro>
          Seasonal gifting works best when the time
          of year gives you direction rather than
          rules. Color, weather, holidays, school
          events, and local traditions can all help
          shape a gift that feels right for the
          moment.
        </FeatureIntro>

        <FeaturePullQuote>
          The season sets the mood. The person and
          occasion make the gift meaningful.
        </FeaturePullQuote>

        {seasons.map((item, index) => (
          <FeatureSection
            key={item.id}
            id={item.id}
            eyebrow={item.season}
            title={item.title}
          >
            <div
              className={`grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center ${
                index % 2 === 1
                  ? "lg:[&>div:first-child]:order-2"
                  : ""
              }`}
            >
              <div>
                <p>
                  {item.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {item.ideas.map((idea) => (
                    <li
                      key={idea}
                      className="flex gap-3 text-sm leading-7 text-[#607068]"
                    >
                      <span className="mt-[2px] text-[#e76d61]">
                        ✦
                      </span>

                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.8rem] bg-[#f1ece5]">
                <Image
                  src={item.image}
                  alt={`${item.season} seasonal inspiration from Port Petals`}
                  fill
                  sizes="(max-width: 1023px) 100vw, 390px"
                  className="object-cover"
                />
              </div>
            </div>
          </FeatureSection>
        ))}

        <FeatureSection
          id="milestones"
          eyebrow="Holidays & Milestones"
          title="Some moments are worth planning ahead for"
        >
          <p>
            Certain dates create heavier demand or
            require more preparation, especially when
            flowers, customization, or personalized
            products are involved.
          </p>

          <div className="my-10 grid gap-4 sm:grid-cols-2">
            {milestones.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.5rem] border border-[#284239]/10 bg-[#f7f1e8] p-6"
              >
                <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#607068]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>

          <div className="border-l-4 border-[#e76d61] bg-[#fff7f3] px-6 py-5 sm:px-7">
            <p className="font-serif text-xl font-semibold text-[#153f32]">
              A little extra lead time helps.
            </p>

            <p className="mt-2 text-sm leading-7 text-[#607068]">
              Holidays, Homecoming, graduation,
              sympathy work, custom apparel, and
              personalized products can all require
              additional preparation time.
            </p>
          </div>
        </FeatureSection>

        <FeatureSection
          id="port-allegany"
          eyebrow="Port Allegany"
          title="School spirit is its own season"
        >
          <div className="grid gap-8 lg:grid-cols-[.92fr_1.08fr] lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.8rem] bg-[#f1ece5]">
              <Image
                src="/collections/gators.jpg"
                alt="Port Allegany Gator gear from Port Petals"
                fill
                sizes="(max-width: 1023px) 100vw, 420px"
                className="object-cover"
              />
            </div>

            <div>
              <p>
                Football, Homecoming, senior nights,
                graduation, and other school events
                create their own rhythm throughout
                the year in Port Allegany.
              </p>

              <p className="mt-5">
                Names, player numbers, school colors,
                team references, and personalized
                details can turn a simple item into
                something much more memorable.
              </p>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                <Link
                  href="/gators"
                  className="font-semibold text-[#36594c] underline decoration-[#e76d61] decoration-2 underline-offset-4"
                >
                  Browse Gator Gear →
                </Link>

                <Link
                  href="/custom/request"
                  className="font-semibold text-[#607068] transition hover:text-[#e76d61]"
                >
                  Request Something Custom →
                </Link>
              </div>
            </div>
          </div>
        </FeatureSection>

        <div className="mt-10 overflow-hidden rounded-[2rem] bg-[#153f32] text-[#fffaf3]">
          <div className="p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a8e69a]">
              Seasonal Availability
            </p>

            <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight sm:text-4xl">
              The shop changes with the season.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-white/70">
              Flower varieties, seasonal products,
              colors, materials, and ready-made
              inventory can change throughout the
              year. The online shop reflects what
              Port Petals is offering now.
            </p>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              <Link
                href="/flowers"
                className="font-semibold text-white underline decoration-[#e76d61] decoration-2 underline-offset-4"
              >
                Shop Fresh Flowers →
              </Link>

              <Link
                href="/gifts"
                className="font-semibold text-white/75 transition hover:text-white"
              >
                Browse Gifts →
              </Link>
            </div>
          </div>
        </div>
      </JournalFeatureLayout>
    </>
  );
}
