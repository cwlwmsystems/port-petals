import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import JournalFeatureLayout, {
  FeatureChecklist,
  FeatureIntro,
  FeaturePullQuote,
  FeatureSection,
  FeatureTimeline,
} from "@/components/journal/JournalFeatureLayout";
import { buildBreadcrumbStructuredData } from "@/lib/seo/breadcrumbs";

const canonicalPath =
  "/journal/flower-care";

const canonicalUrl =
  `https://www.portpetals.com${canonicalPath}`;

export const metadata: Metadata = {
  title:
    "Fresh Flower Care Guide",
  description:
    "Learn how to care for fresh-cut flowers and floral arrangements with practical tips from Port Petals in Port Allegany, Pennsylvania.",
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    type: "article",
    title:
      "Flower Care Guide | Keep Fresh Flowers Beautiful Longer",
    description:
      "Practical flower-care guidance from Port Petals in Port Allegany, including water, vase, stem, temperature, and arrangement care.",
    url: canonicalPath,
    images: [
      {
        url: "/collections/fresh-flowers.jpg",
        alt:
          "Fresh flowers from Port Petals in Port Allegany",
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
      name: "Flower Care",
      path: canonicalPath,
    },
  ]);

const articleStructuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "How to Care for Fresh Flowers and Help Them Last Longer",
  description:
    "Practical guidance for caring for fresh-cut flowers and floral arrangements from Port Petals in Port Allegany, Pennsylvania.",
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
    "https://www.portpetals.com/collections/fresh-flowers.jpg",
  url: canonicalUrl,
};

const guideItems = [
  {
    label: "First 10 minutes",
    href: "#first-steps",
  },
  {
    label: "Water & vase care",
    href: "#water-care",
  },
  {
    label: "Flower food",
    href: "#flower-food",
  },
  {
    label: "Stem care",
    href: "#stem-care",
  },
  {
    label: "Where to place flowers",
    href: "#placement",
  },
  {
    label: "When flowers begin fading",
    href: "#fading",
  },
];

const quickCare = [
  "Keep the vase or arrangement filled with fresh water.",
  "Keep leaves and plant debris out of the water.",
  "Keep flowers away from direct sunlight and heat.",
  "Change vase water every few days.",
  "Recut loose flower stems when refreshing the water.",
  "Remove fading flowers and foliage as needed.",
];

const firstSteps = [
  {
    title: "Start with a clean container",
    text:
      "Wash the vase with hot, soapy water and rinse it thoroughly. Residue and bacteria inside a vase can shorten flower life.",
  },
  {
    title: "Add fresh water",
    text:
      "Use clean water and, when provided, mix commercial flower food according to the packet directions.",
  },
  {
    title: "Remove submerged foliage",
    text:
      "Strip away leaves or other plant material that would sit below the water line.",
  },
  {
    title: "Recut loose stems",
    text:
      "Using clean, sharp snips or pruners, remove a small amount from the bottom of each loose stem before placing it into the vase.",
  },
];

export default function FlowerCarePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbStructuredData}
      />

      <JsonLd
        data={articleStructuredData}
      />

      <JournalFeatureLayout
        category="Flower Care"
        title="How to care for fresh flowers"
        introduction="Simple, practical ways to help fresh-cut flowers and floral arrangements stay hydrated, clean, and beautiful for as long as possible."
        imageSrc="/collections/fresh-flowers.jpg"
        imageAlt="Fresh flowers from Port Petals in Port Allegany"
        publishedDate="October 7, 2026"
        readingTime="7 min read"
        guideItems={guideItems}
        relatedArticles={[
          {
            eyebrow: "Gift Guide",
            title:
              "Gift ideas from Port Petals",
            description:
              "Thoughtful combinations of flowers, candles, custom gifts, apparel, and hometown favorites.",
            href:
              "/journal/gift-guides",
          },
          {
            eyebrow: "Sympathy Guide",
            title:
              "Sympathy flowers in Port Allegany",
            description:
              "What to send, how to choose, and how to keep the gesture thoughtful.",
            href:
              "/journal/sympathy-flowers-port-allegany",
          },
        ]}
      >
        <FeatureIntro>
          Fresh flowers are naturally temporary,
          but good care can make a noticeable
          difference. Clean water, a clean vase,
          cool placement, and a little attention
          every few days are the habits that matter
          most.
        </FeatureIntro>

        <FeatureChecklist
          eyebrow="Quick Care Guide"
          title="The six things that matter most"
          items={quickCare}
        />

        <FeatureSection
          id="first-steps"
          eyebrow="Start Here"
          title="The first 10 minutes matter"
        >
          <p>
            Flowers begin losing moisture after they
            are cut. Getting stems into clean water
            quickly helps them recover and begin
            taking up water again.
          </p>

          <FeatureTimeline
            items={firstSteps}
          />
        </FeatureSection>

        <FeaturePullQuote>
          Clean water is one of the biggest factors
          in how long cut flowers stay fresh.
        </FeaturePullQuote>

        <FeatureSection
          id="water-care"
          eyebrow="Water & Vase Care"
          title="Keep the water clean and the stems drinking"
        >
          <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
            Check the water level every day
          </h3>

          <p>
            Flowers can drink surprisingly quickly,
            especially during the first few days.
            Make sure every stem remains able to
            reach the water.
          </p>

          <h3 className="pt-3 font-serif text-2xl font-semibold text-[#153f32]">
            Refresh the water every few days
          </h3>

          <p>
            If the flowers are in a vase, completely
            replace the water rather than repeatedly
            topping off water that has become cloudy
            or dirty.
          </p>

          <h3 className="pt-3 font-serif text-2xl font-semibold text-[#153f32]">
            Keep the vase clean
          </h3>

          <p>
            When changing the water, rinse the vase
            and remove fallen leaves, petals, or
            other organic material that has collected
            below the water line.
          </p>
        </FeatureSection>

        <FeatureSection
          id="flower-food"
          eyebrow="Flower Food"
          title="Use the packet if one is provided"
        >
          <p>
            Commercial floral preservative is
            formulated specifically for cut flowers.
            It helps support flower opening while
            also helping manage the vase-water
            environment.
          </p>

          <p>
            Follow the packet directions rather than
            guessing at the concentration. More
            flower food is not necessarily better.
          </p>

          <p>
            When replacing the vase water, use a
            fresh packet if one is available.
          </p>
        </FeatureSection>

        <FeatureSection
          id="stem-care"
          eyebrow="Stem Care"
          title="Give loose stems a fresh drinking surface"
        >
          <p>
            For loose-cut flowers, recutting the
            stem exposes fresh tissue that can take
            up water. Use a clean, sharp cutting
            tool so the stem is cut cleanly rather
            than crushed.
          </p>

          <FeatureChecklist
            eyebrow="Stem Care"
            title="Keep it simple"
            items={[
              "Use clean, sharp floral snips or pruners.",
              "Remove only a small amount from the base of the stem.",
              "Return stems to water promptly after cutting.",
              "Remove any leaves that would sit below the water line.",
            ]}
          />
        </FeatureSection>

        <FeatureSection
          id="placement"
          eyebrow="Placement"
          title="Keep flowers cool and out of harsh conditions"
        >
          <p>
            Fresh flowers generally do best away
            from direct sunlight, heating vents,
            radiators, fireplaces, and other sources
            of heat.
          </p>

          <p>
            A cooler room with indirect light is
            usually a better location than a sunny
            windowsill or a warm kitchen counter.
          </p>

          <p>
            Avoid placing flowers where they will be
            repeatedly exposed to strong drafts or
            dramatic temperature changes.
          </p>
        </FeatureSection>

        <FeatureSection
          id="fading"
          eyebrow="As Flowers Age"
          title="Remove fading blooms as the arrangement changes"
        >
          <p>
            Different flowers naturally age at
            different rates. It is normal for one
            variety to begin fading before another.
          </p>

          <p>
            Remove fading flowers and damaged
            foliage as needed. This keeps the
            arrangement looking cleaner and makes
            it easier to enjoy the flowers that are
            still performing well.
          </p>

          <p>
            A bouquet can often be rearranged into a
            smaller vase as the number of fresh stems
            decreases.
          </p>

          <div className="mt-9 overflow-hidden rounded-[2rem] bg-[#153f32] text-[#fffaf3]">
            <div className="p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a8e69a]">
                Need fresh flowers?
              </p>

              <h3 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                Bring a little color home from Port Petals.
              </h3>

              <p className="mt-4 max-w-2xl leading-7 text-white/70">
                Browse current fresh-flower options
                for pickup or eligible local
                delivery in the Port Allegany area.
              </p>

              <Link
                href="/flowers"
                className="mt-7 inline-flex font-semibold text-white underline decoration-[#e76d61] decoration-2 underline-offset-4"
              >
                Shop Fresh Flowers →
              </Link>
            </div>
          </div>
        </FeatureSection>
      </JournalFeatureLayout>
    </>
  );
}
