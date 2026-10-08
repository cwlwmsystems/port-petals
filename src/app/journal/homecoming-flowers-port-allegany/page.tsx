import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import JournalFeatureLayout, {
  FeatureChecklist,
  FeatureComparison,
  FeatureIntro,
  FeaturePullQuote,
  FeatureSection,
  FeatureTimeline,
} from "@/components/journal/JournalFeatureLayout";
import { buildBreadcrumbStructuredData } from "@/lib/seo/breadcrumbs";

const canonicalPath =
  "/journal/homecoming-flowers-port-allegany";

const canonicalUrl =
  `https://www.portpetals.com${canonicalPath}`;

export const metadata: Metadata = {
  title:
    "Homecoming Flowers in Port Allegany",
  description:
    "Plan Homecoming flowers in Port Allegany with tips on corsages, boutonnieres, matching colors, and when to order from Port Petals.",
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
        url:
          "/journal/seasonal/autumn.jpg",
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
    label: "What to order",
    href: "#what-to-order",
  },
  {
    label: "Corsage vs. boutonniere",
    href: "#corsage-or-boutonniere",
  },
  {
    label: "Choosing colors",
    href: "#choosing-colors",
  },
  {
    label: "When to order",
    href: "#when-to-order",
  },
  {
    label: "Local Homecoming flowers",
    href: "#local-homecoming",
  },
];

const timeline = [
  {
    title: "Choose the flower type",
    text:
      "Decide whether you need a wrist corsage, boutonniere, bouquet, matching set, or another floral piece.",
  },
  {
    title: "Gather the colors",
    text:
      "A dress photo, suit or shirt color, ribbon preference, and school colors can all help shape the design.",
  },
  {
    title: "Share the important details",
    text:
      "Mention colors you especially want, colors you want to avoid, and whether you want the pieces to coordinate.",
  },
  {
    title: "Place the order early",
    text:
      "Homecoming demand is concentrated around one weekend, so earlier orders provide more planning flexibility.",
  },
];

export default function HomecomingFlowersArticlePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbStructuredData}
      />

      <JsonLd
        data={articleStructuredData}
      />

      <JournalFeatureLayout
        category="Homecoming"
        title="Homecoming flowers in Port Allegany"
        introduction="Corsages, boutonnieres, color coordination, and what to know before you order for the big night."
        imageSrc="/journal/seasonal/autumn.jpg"
        imageAlt="Homecoming and fall flower inspiration from Port Petals in Port Allegany"
        publishedDate="October 7, 2026"
        readingTime="6 min read"
        guideItems={guideItems}
        relatedArticles={[
          {
            eyebrow: "Sympathy Guide",
            title:
              "Sympathy flowers in Port Allegany",
            description:
              "What to send, how to choose an arrangement, and how to keep the gesture thoughtful.",
            href:
              "/journal/sympathy-flowers-port-allegany",
          },
          {
            eyebrow: "Seasonal Inspiration",
            title:
              "Seasonal ideas from Port Petals",
            description:
              "Flowers, gifts, school spirit, celebrations and inspiration throughout the year.",
            href:
              "/journal/seasonal-ideas",
          },
        ]}
      >
        <FeatureIntro>
          Homecoming has a way of making the small
          details feel important. Flowers are one
          of those details: visible enough to
          complete the look, personal enough to
          carry a little meaning, and simple enough
          to plan well when you know what to bring.
        </FeatureIntro>

        <FeatureSection
          id="what-to-order"
          eyebrow="Planning Your Flowers"
          title="What should you order for Homecoming?"
        >
          <p>
            The most familiar Homecoming flower
            choices are wrist corsages and
            boutonnieres. Corsages are commonly worn
            on the wrist, while boutonnieres are
            usually pinned to a jacket, shirt, or
            other garment.
          </p>

          <p>
            Some couples coordinate the two pieces
            closely. Others simply use a shared
            color, ribbon, flower, or accent so the
            designs feel connected without being
            identical.
          </p>

          <p>
            The best choice depends on the outfit,
            personal preference, available flowers,
            and the overall look you want for the
            evening.
          </p>
        </FeatureSection>

        <FeatureSection
          id="corsage-or-boutonniere"
          eyebrow="The Classics"
          title="Corsage or boutonniere?"
        >
          <FeatureComparison
            leftTitle="Wrist Corsage"
            leftText="A floral piece worn on the wrist. Corsages can incorporate flowers, greenery, ribbon, texture, and accent colors that complement the dress or overall palette."
            rightTitle="Boutonniere"
            rightText="A smaller floral piece worn on the upper garment. Boutonnieres can coordinate with a corsage while still keeping their own simpler, more tailored design."
          />

          <p>
            Neither piece has to match the other
            perfectly. In fact, coordinating rather
            than copying often creates a more
            polished result.
          </p>
        </FeatureSection>

        <FeaturePullQuote>
          Matching does not have to mean identical.
          A shared color or detail can be enough to
          tie the whole look together.
        </FeaturePullQuote>

        <FeatureSection
          id="choosing-colors"
          eyebrow="Color & Coordination"
          title="Bring the colors you are working with"
        >
          <p>
            Knowing the outfit colors is one of the
            most useful parts of planning Homecoming
            flowers. A phone photo is often more
            helpful than trying to describe a very
            specific shade from memory.
          </p>

          <p>
            Flowers do not always need to match the
            clothing exactly. Neutral blooms,
            complementary tones, ribbon, greenery,
            and accent colors can create a more
            balanced finished piece.
          </p>

          <FeatureChecklist
            eyebrow="Before You Order"
            title="Bring these details with you"
            items={[
              "A photo or clear description of the dress or outfit colors.",
              "Suit, shirt, tie, or jacket colors if you are coordinating a boutonniere.",
              "Any flower or ribbon colors you especially want — or want to avoid.",
              "School-spirit details, personal preferences, or other accents you would like considered.",
            ]}
          />
        </FeatureSection>

        <FeatureSection
          id="when-to-order"
          eyebrow="Plan Ahead"
          title="When should you order Homecoming flowers?"
        >
          <p>
            Homecoming demand is concentrated around
            a specific weekend. Ordering ahead gives
            Port Petals more time to plan the design
            and work with the flowers and colors
            available for the event.
          </p>

          <FeatureTimeline
            items={timeline}
          />

          <p>
            Last-minute orders may still be possible,
            but earlier planning gives you the most
            flexibility.
          </p>
        </FeatureSection>

        <FeatureSection
          id="local-homecoming"
          eyebrow="Here in Port Allegany"
          title="Homecoming flowers with a little hometown pride"
        >
          <p>
            Port Petals serves Port Allegany with
            fresh flowers, custom creations, apparel,
            gifts, and hometown Gator gear. During
            Homecoming season, those pieces naturally
            overlap.
          </p>

          <p>
            Flowers can coordinate with school
            colors, while Gator apparel or a
            personalized item can carry the
            celebration beyond the dance itself.
          </p>

          <div className="mt-9 overflow-hidden rounded-[2rem] bg-[#153f32] text-[#fffaf3]">
            <div className="p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a8e69a]">
                Ready for Homecoming?
              </p>

              <h3 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                Flowers for the night.
                Gator pride for everything around it.
              </h3>

              <p className="mt-4 max-w-2xl leading-7 text-white/70">
                Browse current Homecoming flower
                options or add a little Port Allegany
                spirit with hometown gear.
              </p>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                <Link
                  href="/occasions/homecoming-prom"
                  className="font-semibold text-white underline decoration-[#e76d61] decoration-2 underline-offset-4"
                >
                  Shop Homecoming Flowers →
                </Link>

                <Link
                  href="/gators"
                  className="font-semibold text-white/75 transition hover:text-white"
                >
                  Browse Gator Gear →
                </Link>
              </div>
            </div>
          </div>
        </FeatureSection>
      </JournalFeatureLayout>
    </>
  );
}
