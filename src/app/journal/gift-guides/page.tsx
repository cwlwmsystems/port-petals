import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import JournalFeatureLayout, {
  FeatureChecklist,
  FeatureIntro,
  FeaturePullQuote,
  FeatureSection,
} from "@/components/journal/JournalFeatureLayout";
import { buildBreadcrumbStructuredData } from "@/lib/seo/breadcrumbs";

const canonicalPath =
  "/journal/gift-guides";

const canonicalUrl =
  `https://www.portpetals.com${canonicalPath}`;

export const metadata: Metadata = {
  title:
    "Gift Guide | Flowers, Gifts & Thoughtful Ideas from Port Petals",
  description:
    "Find thoughtful gift ideas from Port Petals in Port Allegany, including flowers, candles, custom creations, apparel, and hometown gifts.",
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    type: "article",
    title:
      "Gift Guide | Flowers, Gifts & Thoughtful Ideas from Port Petals",
    description:
      "A practical guide to choosing thoughtful flowers, gifts, custom creations, apparel, and hometown favorites from Port Petals.",
    url: canonicalPath,
    images: [
      {
        url: "/collections/giftset.jpg",
        alt:
          "Gift ideas from Port Petals in Port Allegany",
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
      name: "Gift Guides",
      path: canonicalPath,
    },
  ]);

const articleStructuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Thoughtful Gift Ideas from Port Petals",
  description:
    "A guide to choosing flowers, gifts, custom creations, apparel, and hometown favorites from Port Petals in Port Allegany, Pennsylvania.",
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
    "https://www.portpetals.com/collections/gifts.jpg",
  url: canonicalUrl,
};

const guideItems = [
  {
    label: "Start with the person",
    href: "#start-with-the-person",
  },
  {
    label: "Flowers as a gift",
    href: "#flowers",
  },
  {
    label: "Candles & keepsakes",
    href: "#candles-keepsakes",
  },
  {
    label: "Custom gifts",
    href: "#custom",
  },
  {
    label: "Hometown gifts",
    href: "#hometown",
  },
  {
    label: "Build a gift combination",
    href: "#gift-combinations",
  },
];

export default function GiftGuidesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbStructuredData}
      />

      <JsonLd
        data={articleStructuredData}
      />

      <JournalFeatureLayout
        category="Gift Guide"
        title="Thoughtful gifts start with the person"
        introduction="Flowers, candles, custom creations, apparel, and hometown favorites all work differently. The best gift is the one that feels like it was chosen for someone — not simply picked from a shelf."
        imageSrc="/collections/giftset.jpg"
        imageAlt="Thoughtful gifts from Port Petals in Port Allegany"
        publishedDate="October 7, 2026"
        readingTime="7 min read"
        guideItems={guideItems}
        relatedArticles={[
          {
            eyebrow: "Flower Care",
            title:
              "How to care for fresh flowers",
            description:
              "Simple ways to help fresh flowers stay hydrated, clean, and beautiful longer.",
            href:
              "/journal/flower-care",
          },
          {
            eyebrow: "Seasonal Inspiration",
            title:
              "Seasonal ideas from Port Petals",
            description:
              "Flowers, gifts, school spirit, holidays, and inspiration throughout the year.",
            href:
              "/journal/seasonal-ideas",
          },
        ]}
      >
        <FeatureIntro>
          Gift giving becomes much easier when you
          stop asking, “What should I buy?” and start
          asking, “What would feel right for this
          person?” A useful clue might be their
          favorite color, something they collect, a
          local connection, or simply the reason you
          are thinking of them.
        </FeatureIntro>

        <FeatureSection
          id="start-with-the-person"
          eyebrow="Before You Shop"
          title="Start with who they are, not what is on the shelf"
        >
          <p>
            A thoughtful gift does not need to be
            expensive or elaborate. Often, the most
            memorable gifts are the ones that show
            you noticed something about the person.
          </p>

          <p>
            Think about their style, favorite colors,
            hobbies, home, personality, and the
            occasion. Even one of those details can
            point you toward something that feels
            intentional.
          </p>

          <FeatureChecklist
            eyebrow="A Simple Starting Point"
            title="Ask yourself these four questions"
            items={[
              "What does this person genuinely enjoy?",
              "Is the gift for a celebration, comfort, thanks, or simply because?",
              "Would they appreciate something beautiful, useful, personal, or local?",
              "Is there a color, hobby, team, memory, or theme that connects to them?",
            ]}
          />
        </FeatureSection>

        <FeaturePullQuote>
          A good gift feels chosen. A great gift
          feels understood.
        </FeaturePullQuote>

        <FeatureSection
          id="flowers"
          eyebrow="Fresh Flowers"
          title="When flowers are the right gift"
        >
          <p>
            Flowers work especially well when the
            gesture itself matters. Birthdays,
            anniversaries, congratulations,
            sympathy, thank-you moments, and
            just-because gifts can all be made more
            personal with fresh flowers.
          </p>

          <p>
            The arrangement does not always have to
            be formal. Bright mixed flowers can feel
            cheerful and spontaneous, while softer
            palettes can feel calm, elegant, or
            comforting.
          </p>

          <div className="mt-8 border-l-4 border-[#e76d61] bg-[#f7f1e8] px-6 py-5 sm:px-7">
            <p className="font-serif text-xl font-semibold text-[#153f32]">
              A useful rule
            </p>

            <p className="mt-2 text-sm leading-7 text-[#607068]">
              If you are unsure what to choose,
              start with the feeling you want the
              gift to create: cheerful, romantic,
              comforting, celebratory, or simple.
            </p>
          </div>
        </FeatureSection>

        <FeatureSection
          id="candles-keepsakes"
          eyebrow="Something That Lasts"
          title="Candles and keepsakes extend the gesture"
        >
          <p>
            A candle or keepsake can be a good choice
            when you want something the recipient can
            continue using after the occasion has
            passed.
          </p>

          <p>
            They also pair naturally with flowers.
            A fresh arrangement brings immediate
            color and life, while the accompanying
            gift remains after the blooms have faded.
          </p>

          <p>
            For sympathy, birthdays, thank-you
            gifts, housewarmings, or small
            celebrations, that combination can feel
            especially complete.
          </p>
        </FeatureSection>

        <FeatureSection
          id="custom"
          eyebrow="Make It Personal"
          title="Custom gifts create the strongest personal connection"
        >
          <p>
            Personalized gifts work best when the
            customization has meaning rather than
            simply adding a name to an object.
          </p>

          <p>
            A phrase, date, school connection,
            favorite color, family detail, or
            hometown theme can turn a simple item
            into something made specifically for the
            recipient.
          </p>

          <p>
            Custom work may require additional
            planning time, so it is worth starting
            earlier when the gift is tied to a
            specific event or date.
          </p>

          <Link
            href="/custom/request"
            className="mt-2 inline-flex font-semibold text-[#36594c] underline decoration-[#e76d61] decoration-2 underline-offset-4"
          >
            Ask Port Petals about a custom creation →
          </Link>
        </FeatureSection>

        <FeatureSection
          id="hometown"
          eyebrow="Port Allegany Pride"
          title="Sometimes the best gift feels like home"
        >
          <p>
            Hometown gifts can carry meaning that
            goes beyond the item itself. Port
            Allegany and Gator-themed pieces can
            work for students, alumni, families,
            teachers, coaches, visitors, or anyone
            who feels connected to the community.
          </p>

          <p>
            They can also make useful additions to
            graduation gifts, Homecoming gifts,
            school-event packages, or care packages
            for someone living away from home.
          </p>

          <Link
            href="/gators"
            className="mt-2 inline-flex font-semibold text-[#36594c] underline decoration-[#e76d61] decoration-2 underline-offset-4"
          >
            Browse Gator Gear →
          </Link>
        </FeatureSection>

        <FeatureSection
          id="gift-combinations"
          eyebrow="Build the Gift"
          title="The best combinations mix different kinds of meaning"
        >
          <p>
            Pairing two smaller items can sometimes
            feel more thoughtful than choosing one
            larger gift. The key is making sure the
            pieces make sense together.
          </p>

          <div className="my-9 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Flowers + Candle",
                text:
                  "A fresh, immediate gesture paired with something the recipient can continue enjoying.",
              },
              {
                title: "Flowers + Custom Gift",
                text:
                  "A celebratory arrangement alongside something made specifically for the recipient.",
              },
              {
                title: "Gator Gear + Flowers",
                text:
                  "A strong combination for school events, Homecoming, graduation, or hometown celebrations.",
              },
              {
                title: "Keepsake + Card",
                text:
                  "Simple and personal when the message matters more than the size of the gift.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-[#284239]/10 bg-[#f7f1e8] p-6"
              >
                <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#607068]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 overflow-hidden rounded-[2rem] bg-[#153f32] text-[#fffaf3]">
            <div className="p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a8e69a]">
                Find the right fit
              </p>

              <h3 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                Start with the person.
                We&apos;ll help with the rest.
              </h3>

              <p className="mt-4 max-w-2xl leading-7 text-white/70">
                Browse gifts, flowers, hometown
                favorites, and custom options from
                Port Petals.
              </p>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                <Link
                  href="/gifts"
                  className="font-semibold text-white underline decoration-[#e76d61] decoration-2 underline-offset-4"
                >
                  Browse Gifts →
                </Link>

                <Link
                  href="/flowers"
                  className="font-semibold text-white/75 transition hover:text-white"
                >
                  Shop Fresh Flowers →
                </Link>
              </div>
            </div>
          </div>
        </FeatureSection>
      </JournalFeatureLayout>
    </>
  );
}
