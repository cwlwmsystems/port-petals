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
    label: "What to send",
    href: "#what-to-send",
  },
  {
    label: "Arrangement types",
    href: "#arrangement-types",
  },
  {
    label: "Choosing colors",
    href: "#choosing-colors",
  },
  {
    label: "What to write",
    href: "#what-to-write",
  },
  {
    label: "When to send flowers",
    href: "#when-to-send",
  },
  {
    label: "Local sympathy flowers",
    href: "#local-sympathy",
  },
];

const timingSteps = [
  {
    title: "Choose the destination",
    text:
      "Decide whether the flowers are going to a home, service, memorial location, or another appropriate destination.",
  },
  {
    title: "Choose the arrangement",
    text:
      "A vase arrangement, memorial piece, or thoughtful gift can all be appropriate depending on the situation.",
  },
  {
    title: "Add the message",
    text:
      "A short, sincere card message is enough. The gesture matters more than finding perfect words.",
  },
  {
    title: "Confirm timing",
    text:
      "If delivery details are uncertain, checking with the florist before ordering can help avoid confusion.",
  },
];

export default function SympathyFlowersArticlePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbStructuredData}
      />

      <JsonLd
        data={articleStructuredData}
      />

      <JournalFeatureLayout
        category="Sympathy"
        title="Sympathy flowers in Port Allegany"
        introduction="What to send, how to choose an arrangement, and how to make the gesture feel thoughtful without overcomplicating it."
        imageSrc="/collections/fresh-flowers.jpg"
        imageAlt="Fresh sympathy flowers from Port Petals in Port Allegany"
        publishedDate="October 7, 2026"
        readingTime="6 min read"
        guideItems={guideItems}
        relatedArticles={[
          {
            eyebrow: "Homecoming Guide",
            title:
              "Homecoming flowers in Port Allegany",
            description:
              "Corsages, boutonnieres, color coordination, and what to know before you order.",
            href:
              "/journal/homecoming-flowers-port-allegany",
          },
          {
            eyebrow: "Flower Care",
            title:
              "How to care for fresh flowers",
            description:
              "Simple guidance for helping fresh flowers and arrangements stay beautiful longer.",
            href:
              "/journal/flower-care",
          },
        ]}
      >
        <FeatureIntro>
          When someone is grieving, flowers are often
          chosen because they can express care when
          words feel limited. The most meaningful
          arrangement is usually not the most
          elaborate one — it is the one that feels
          thoughtful, appropriate, and sincere.
        </FeatureIntro>

        <FeatureSection
          id="what-to-send"
          eyebrow="Choosing with Care"
          title="What kind of sympathy flowers should you send?"
        >
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
            container is often the most flexible
            choice because it can be sent to a home,
            service, workplace, or another appropriate
            destination.
          </p>

          <p>
            More formal floral pieces may make sense
            for a memorial service or visitation,
            while a smaller arrangement or thoughtful
            gift can feel especially appropriate
            when sending something directly to the
            family.
          </p>
        </FeatureSection>

        <FeatureSection
          id="arrangement-types"
          eyebrow="Types of Sympathy Flowers"
          title="Choose an arrangement that fits the setting"
        >
          <FeatureComparison
            leftTitle="Fresh Arrangement"
            leftText="A vase or container arrangement is versatile and appropriate for many situations, including delivery to a home, workplace, or service."
            rightTitle="Memorial Piece"
            rightText="A larger or more formal floral tribute may be appropriate for a visitation, funeral, memorial service, or other ceremonial setting."
          />

          <p>
            Flowers can also be paired with a candle,
            keepsake, or personalized gift when you
            want to offer something that lasts beyond
            the flowers themselves.
          </p>
        </FeatureSection>

        <FeaturePullQuote>
          The right sympathy arrangement does not
          need to be elaborate. It needs to feel
          considerate.
        </FeaturePullQuote>

        <FeatureSection
          id="choosing-colors"
          eyebrow="Color & Meaning"
          title="Sympathy flowers do not have to be only white"
        >
          <p>
            White flowers are traditional, but they
            are not the only appropriate choice.
            Soft pastels, seasonal tones, greenery,
            or colors connected to the person being
            remembered can all create a thoughtful
            tribute.
          </p>

          <p>
            If you know a favorite color, flower,
            hobby, team, or personal detail, that
            information can help make the arrangement
            feel more connected to the individual.
          </p>

          <FeatureChecklist
            eyebrow="Color Ideas"
            title="Four directions that work well"
            items={[
              "White and green for a classic, peaceful, understated look.",
              "Soft blush, lavender, pale yellow, or other gentle tones for warmth and comfort.",
              "Favorite colors that reflect the person being remembered.",
              "Seasonal flowers and greenery for a softer, more natural arrangement.",
            ]}
          />
        </FeatureSection>

        <FeatureSection
          id="what-to-write"
          eyebrow="The Card Message"
          title="A short, sincere message is enough"
        >
          <p>
            Sympathy messages do not need to be long.
            A few genuine words of support can be
            more meaningful than trying to find a
            perfect phrase.
          </p>

          <div className="my-9 grid gap-4">
            {[
              "Thinking of you and your family during this difficult time.",
              "With deepest sympathy and caring thoughts.",
              "Wishing you comfort and peace in the days ahead.",
            ].map(
              (message) => (
                <blockquote
                  key={message}
                  className="border-l-4 border-[#e76d61] bg-[#f7f1e8] px-6 py-5 font-serif text-xl leading-8 text-[#36594c]"
                >
                  “{message}”
                </blockquote>
              )
            )}
          </div>

          <p>
            If you knew the person well, a short
            personal memory or simple mention of what
            they meant to you can make the message
            even more meaningful.
          </p>
        </FeatureSection>

        <FeatureSection
          id="when-to-send"
          eyebrow="Timing"
          title="When should sympathy flowers be sent?"
        >
          <p>
            Flowers can be sent before a service,
            delivered to a memorial or funeral
            location when appropriate, or sent to the
            family afterward.
          </p>

          <p>
            There is no rule that says flowers must
            arrive immediately. Sending an
            arrangement several days later can still
            be a meaningful way to show support after
            the initial rush of activity has passed.
          </p>

          <FeatureTimeline
            items={timingSteps}
          />
        </FeatureSection>

        <FeatureSection
          id="local-sympathy"
          eyebrow="Here in Port Allegany"
          title="Sympathy flowers from Port Petals"
        >
          <p>
            Port Petals creates fresh floral
            arrangements and thoughtful gifts for
            families in and around Port Allegany.
            Customers can browse available sympathy
            options online and choose pickup or
            eligible local delivery when available.
          </p>

          <p>
            If you are unsure what kind of
            arrangement is most appropriate, it is
            completely reasonable to ask for
            guidance before placing the order.
          </p>

          <div className="mt-9 overflow-hidden rounded-[2rem] bg-[#153f32] text-[#fffaf3]">
            <div className="p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a8e69a]">
                Need help choosing?
              </p>

              <h3 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                Choose something simple,
                thoughtful, and sincere.
              </h3>

              <p className="mt-4 max-w-2xl leading-7 text-white/70">
                Browse current sympathy flowers or
                explore thoughtful gifts when you
                want to send something meaningful.
              </p>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                <Link
                  href="/occasions/sympathy"
                  className="font-semibold text-white underline decoration-[#e76d61] decoration-2 underline-offset-4"
                >
                  Shop Sympathy Flowers →
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
        </FeatureSection>
      </JournalFeatureLayout>
    </>
  );
}
