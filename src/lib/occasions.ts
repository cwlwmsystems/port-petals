export type OccasionProductRule = {
  departments?: string[];
  collections?: string[];
  productTypes?: string[];
  categories?: string[];
  slugs?: string[];
};

export type OccasionDefinition = {
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  seoDescription: string;
  supportingText: string;

  heroClass: string;
  eyebrowClass: string;
  accentPanelClass: string;
  accentTextClass: string;
  primaryButtonClass: string;
  titleClass: string;
  bodyClass: string;

  departmentOrder: string[];
  rules: OccasionProductRule[];
};

export const occasionDefinitions: OccasionDefinition[] = [
  {
    slug: "birthdays",
    label: "Birthdays",
    eyebrow: "Celebrate Their Day",
    title: "Birthday flowers & gifts made to celebrate.",
    description:
      "Find fresh flowers, thoughtful gifts, personalized pieces, and wearable favorites for birthdays of all kinds.",
    seoDescription:
      "Shop birthday flowers, gifts, personalized items, apparel, and local favorites from Port Petals in Port Allegany, Pennsylvania.",
    supportingText:
      "From a fresh bouquet to something made especially for them, bring the whole birthday gift together in one place.",

    heroClass:
      "bg-[linear-gradient(135deg,#f8ddd5_0%,#f9ebe4_44%,#f7f1e8_100%)]",
    eyebrowClass:
      "text-[#d85b50]",
    accentPanelClass:
      "border-[#e76d61]/15 bg-white/70",
    accentTextClass:
      "text-[#b9564c]",
    primaryButtonClass:
      "bg-[#e76d61] hover:bg-[#d85b50]",
    titleClass:
      "text-[#153f32]",
    bodyClass:
      "text-[#52655d]",
    departmentOrder: [
      "flowers",
      "gifts-decor",
      "apparel",
      "seasonal",
      "gator-gear",
    ],
    rules: [
      {
        departments: ["flowers"],
        collections: [
          "occasion",
          "bouquets",
        ],
      },
      {
        departments: ["gifts-decor"],
        productTypes: [
          "candle-bouquet",
          "wax-melt",
          "gift-bouquet",
          "gift-set",
          "mug",
          "custom-gift",
        ],
      },
      {
        departments: ["apparel"],
        collections: [
          "gifts",
          "custom",
        ],
      },
    ],
  },
  {
    slug: "anniversaries",
    label: "Anniversaries",
    eyebrow: "Celebrate Together",
    title: "Thoughtful anniversary flowers & gifts.",
    description:
      "Mark the moment with fresh flowers, candle gifts, keepsakes, and personalized pieces chosen for someone special.",
    seoDescription:
      "Shop anniversary flowers, gifts, candles, and personalized keepsakes from Port Petals in Port Allegany, Pennsylvania.",
    supportingText:
      "Pair flowers with a thoughtful extra, or choose a personalized piece that can be enjoyed long after the celebration.",

    heroClass:
      "bg-[linear-gradient(135deg,#f4dfe0_0%,#f8e9e6_46%,#f7f1e8_100%)]",
    eyebrowClass:
      "text-[#b65d68]",
    accentPanelClass:
      "border-[#b65d68]/15 bg-white/70",
    accentTextClass:
      "text-[#9d4f59]",
    primaryButtonClass:
      "bg-[#b65d68] hover:bg-[#9f4f59]",
    titleClass:
      "text-[#153f32]",
    bodyClass:
      "text-[#52655d]",
    departmentOrder: [
      "flowers",
      "gifts-decor",
      "seasonal",
      "apparel",
    ],
    rules: [
      {
        departments: ["flowers"],
        collections: [
          "occasion",
          "bouquets",
        ],
      },
      {
        departments: ["gifts-decor"],
        productTypes: [
          "candle-bouquet",
          "gift-bouquet",
          "gift-set",
          "custom-gift",
        ],
      },
    ],
  },
  {
    slug: "sympathy",
    label: "Sympathy",
    eyebrow: "A Thoughtful Gesture",
    title: "Flowers & meaningful gifts for difficult moments.",
    description:
      "Send a caring gesture with fresh flowers, comforting gifts, candles, and personalized keepsakes.",
    seoDescription:
      "Shop sympathy flowers, comforting gifts, candles, and keepsakes from Port Petals in Port Allegany, Pennsylvania.",
    supportingText:
      "If you are unsure what would be appropriate, Port Petals can help you choose something thoughtful and personal.",

    heroClass:
      "bg-[linear-gradient(135deg,#e8eee7_0%,#f1f2e9_48%,#faf7f1_100%)]",
    eyebrowClass:
      "text-[#607068]",
    accentPanelClass:
      "border-[#607068]/15 bg-white/70",
    accentTextClass:
      "text-[#4f6158]",
    primaryButtonClass:
      "bg-[#607068] hover:bg-[#4f6158]",
    titleClass:
      "text-[#153f32]",
    bodyClass:
      "text-[#52655d]",
    departmentOrder: [
      "flowers",
      "gifts-decor",
    ],
    rules: [
      {
        departments: ["flowers"],
        collections: [
          "occasion",
          "bouquets",
        ],
      },
      {
        departments: ["gifts-decor"],
        productTypes: [
          "candle-bouquet",
          "gift-set",
          "slate",
          "custom-gift",
        ],
      },
    ],
  },
  {
    slug: "get-well",
    label: "Get Well",
    eyebrow: "Brighten Their Day",
    title: "A little something to help them feel better.",
    description:
      "Shop cheerful flowers, small gifts, candles, and thoughtful favorites for someone who could use a lift.",
    seoDescription:
      "Shop get well flowers, cheerful gifts, candles, and thoughtful local favorites from Port Petals in Port Allegany, Pennsylvania.",
    supportingText:
      "Choose an easy-to-enjoy arrangement or pair fresh flowers with a small gift for an extra thoughtful surprise.",

    heroClass:
      "bg-[linear-gradient(135deg,#e9f2e3_0%,#f7f0c8_48%,#faf7f1_100%)]",
    eyebrowClass:
      "text-[#557653]",
    accentPanelClass:
      "border-[#557653]/15 bg-white/70",
    accentTextClass:
      "text-[#496846]",
    primaryButtonClass:
      "bg-[#557653] hover:bg-[#496846]",
    titleClass:
      "text-[#153f32]",
    bodyClass:
      "text-[#52655d]",
    departmentOrder: [
      "flowers",
      "gifts-decor",
    ],
    rules: [
      {
        departments: ["flowers"],
        collections: [
          "occasion",
          "bouquets",
        ],
      },
      {
        departments: ["gifts-decor"],
        productTypes: [
          "candle-bouquet",
          "wax-melt",
          "gift-bouquet",
          "gift-set",
          "mug",
        ],
      },
    ],
  },
  {
    slug: "thank-you",
    label: "Thank You",
    eyebrow: "Show Your Appreciation",
    title: "Thoughtful ways to say thank you.",
    description:
      "Fresh flowers, small gifts, candles, and handmade favorites make it easy to show someone how much you appreciate them.",
    seoDescription:
      "Shop thank-you flowers, gifts, candles, and personalized items from Port Petals in Port Allegany, Pennsylvania.",
    supportingText:
      "Whether it is a simple gesture or something more personal, choose a gift that feels like them.",

    heroClass:
      "bg-[linear-gradient(135deg,#f6ead5_0%,#f3dfcf_46%,#f7f1e8_100%)]",
    eyebrowClass:
      "text-[#a96346]",
    accentPanelClass:
      "border-[#a96346]/15 bg-white/70",
    accentTextClass:
      "text-[#8f543c]",
    primaryButtonClass:
      "bg-[#a96346] hover:bg-[#8f543c]",
    titleClass:
      "text-[#153f32]",
    bodyClass:
      "text-[#52655d]",
    departmentOrder: [
      "flowers",
      "gifts-decor",
      "apparel",
    ],
    rules: [
      {
        departments: ["flowers"],
        collections: [
          "occasion",
          "bouquets",
        ],
      },
      {
        departments: ["gifts-decor"],
        productTypes: [
          "candle-bouquet",
          "wax-melt",
          "gift-bouquet",
          "gift-set",
          "mug",
          "custom-gift",
        ],
      },
      {
        departments: ["apparel"],
        collections: ["gifts"],
      },
    ],
  },
  {
    slug: "just-because",
    label: "Just Because",
    eyebrow: "No Occasion Required",
    title: "A thoughtful surprise, just because.",
    description:
      "Fresh flowers, candles, small gifts, and handmade favorites for those moments when you simply want to make someone smile.",
    seoDescription:
      "Shop just-because flowers, gifts, candles, and thoughtful surprises from Port Petals in Port Allegany, Pennsylvania.",
    supportingText:
      "Sometimes the best gifts are the unexpected ones.",

    heroClass:
      "bg-[linear-gradient(135deg,#eee3ef_0%,#f6e5e6_48%,#faf7f1_100%)]",
    eyebrowClass:
      "text-[#8b668e]",
    accentPanelClass:
      "border-[#8b668e]/15 bg-white/70",
    accentTextClass:
      "text-[#755779]",
    primaryButtonClass:
      "bg-[#8b668e] hover:bg-[#755779]",
    titleClass:
      "text-[#153f32]",
    bodyClass:
      "text-[#52655d]",
    departmentOrder: [
      "flowers",
      "gifts-decor",
    ],
    rules: [
      {
        departments: ["flowers"],
        collections: [
          "occasion",
          "bouquets",
        ],
      },
      {
        departments: ["gifts-decor"],
        productTypes: [
          "candle-bouquet",
          "wax-melt",
          "gift-bouquet",
          "gift-set",
          "mug",
        ],
      },
    ],
  },
  {
    slug: "homecoming-prom",
    label: "Homecoming & Prom",
    eyebrow: "The Big Night",
    title: "Flowers, spirit & finishing touches for the big night.",
    description:
      "Shop corsages, boutonnieres, bouquets, school-spirit favorites, personalized pieces, and more for Homecoming and Prom.",
    seoDescription:
      "Shop Homecoming and Prom flowers, corsages, boutonnieres, Gator gear, and personalized items from Port Petals in Port Allegany, Pennsylvania.",
    supportingText:
      "Ordering flowers early is encouraged. Port Petals can help coordinate colors and matching pieces.",

    heroClass:
      "bg-[radial-gradient(circle_at_12%_30%,rgba(255,115,21,.18),transparent_32%),linear-gradient(135deg,#191919_0%,#27211d_46%,#151515_100%)] text-[#fffaf3]",
    eyebrowClass:
      "text-[#ff8b3d]",
    accentPanelClass:
      "border-[#ff7315]/25 bg-white/[0.07]",
    accentTextClass:
      "text-[#ff9b55]",
    primaryButtonClass:
      "bg-[#ff7315] hover:bg-[#e76500]",
    titleClass:
      "text-white",
    bodyClass:
      "text-white/75",
    departmentOrder: [
      "flowers",
      "gator-gear",
      "apparel",
      "seasonal",
      "gifts-decor",
    ],
    rules: [
      {
        departments: ["flowers"],
        collections: [
          "prom-homecoming",
        ],
      },
      {
        departments: ["seasonal"],
        collections: ["homecoming"],
      },
      {
        departments: ["gator-gear"],
        collections: [
          "seasonal",
          "player-personalized",
          "accessories",
        ],
      },
      {
        departments: ["apparel"],
        collections: ["sports"],
      },
    ],
  },
  {
    slug: "graduation",
    label: "Graduation",
    eyebrow: "Celebrate the Graduate",
    title: "Flowers, gifts & hometown pride for graduation.",
    description:
      "Celebrate the graduate with flowers, personalized gifts, apparel, keepsakes, and Port Allegany Gator favorites.",
    seoDescription:
      "Shop graduation flowers, gifts, apparel, keepsakes, and Port Allegany Gator gear from Port Petals.",
    supportingText:
      "Build a gift around the graduate with flowers, school spirit, or something personalized just for them.",

    heroClass:
      "bg-[linear-gradient(135deg,#153f32_0%,#284239_52%,#775d2f_100%)] text-white",
    eyebrowClass:
      "text-[#f4ead8]",
    accentPanelClass:
      "border-white/15 bg-white/[0.08]",
    accentTextClass:
      "text-[#f4ead8]",
    primaryButtonClass:
      "bg-[#e76d61] hover:bg-[#d85b50]",
    titleClass:
      "text-[#153f32]",
    bodyClass:
      "text-[#52655d]",
    departmentOrder: [
      "flowers",
      "gator-gear",
      "seasonal",
      "gifts-decor",
      "apparel",
    ],
    rules: [
      {
        departments: ["flowers"],
        collections: [
          "occasion",
          "bouquets",
        ],
      },
      {
        departments: ["seasonal"],
        collections: ["graduation"],
      },
      {
        departments: ["gator-gear"],
        collections: [
          "seasonal",
          "player-personalized",
          "accessories",
        ],
      },
      {
        departments: ["apparel"],
        collections: [
          "sports",
          "gifts",
          "custom",
        ],
      },
      {
        departments: ["gifts-decor"],
        productTypes: [
          "gift-bouquet",
          "gift-set",
          "slate",
          "mug",
          "custom-gift",
        ],
      },
    ],
  },
];

export function getOccasionDefinition(
  slug: string
) {
  return occasionDefinitions.find(
    (occasion) =>
      occasion.slug === slug
  );
}

type MatchableProduct = {
  slug: string;
  category: string | null;
  department: string | null;
  product_type: string | null;
  collection: string | null;
};

export function productMatchesOccasion(
  product: MatchableProduct,
  occasion: OccasionDefinition
) {
  return occasion.rules.some(
    (rule) => {
      if (
        rule.departments &&
        !rule.departments.includes(
          product.department ?? ""
        )
      ) {
        return false;
      }

      if (
        rule.collections &&
        !rule.collections.includes(
          product.collection ?? ""
        )
      ) {
        return false;
      }

      if (
        rule.productTypes &&
        !rule.productTypes.includes(
          product.product_type ?? ""
        )
      ) {
        return false;
      }

      if (
        rule.categories &&
        !rule.categories.includes(
          product.category ?? ""
        )
      ) {
        return false;
      }

      if (
        rule.slugs &&
        !rule.slugs.includes(
          product.slug
        )
      ) {
        return false;
      }

      return true;
    }
  );
}
