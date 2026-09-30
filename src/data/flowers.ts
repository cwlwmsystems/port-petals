export type FlowerCategory =
  | "occasion"
  | "seasonal"
  | "bouquets"
  | "prom-homecoming";

export type FlowerSize = {
  name: string;
  price: number;
};

export type FlowerProduct = {
  id: string;
  slug: string;
  name: string;
  category: FlowerCategory;
  shortDescription: string;
  description: string;
  image: string;
  active: boolean;
  featured: boolean;
  sizes: FlowerSize[];
  allowsCardMessage: boolean;
  pickupAvailable: boolean;
  deliveryAvailable: boolean;
  leadTime: string;
  substitutionNote?: string;
};

export type FlowerCollection = {
  slug: FlowerCategory;
  name: string;
  description: string;
};

export const flowerCollections: FlowerCollection[] = [
  {
    slug: "occasion",
    name: "Occasion Arrangements",
    description:
      "Thoughtfully designed fresh arrangements for birthdays, anniversaries, celebrations, sympathy, and everyday moments.",
  },
  {
    slug: "seasonal",
    name: "Seasonal Arrangements",
    description:
      "Fresh floral designs inspired by the colors, flowers, and celebrations of each season.",
  },
  {
    slug: "bouquets",
    name: "Individual Bouquets",
    description:
      "Hand-tied fresh flower bouquets perfect for gifting, celebrating, or brightening someone's day.",
  },
  {
    slug: "prom-homecoming",
    name: "Prom & Homecoming",
    description:
      "Corsages, boutonnieres, handheld bouquets, and coordinating flowers for prom, homecoming, and school dances.",
  },
];

const placeholderImage = "/collections/fresh-flowers.jpg";
const standardLeadTime = "Please order at least 7 days in advance.";

const substitutionNote =
  "Flower varieties and colors may vary based on seasonal availability. Port Petals may substitute comparable flowers while preserving the overall style, color palette, and value of the arrangement.";

export const flowerProducts: FlowerProduct[] = [
  {
    id: "birthday-arrangement",
    slug: "birthday-arrangement",
    name: "Birthday Arrangement",
    category: "occasion",
    shortDescription:
      "A cheerful fresh-flower arrangement designed to make their birthday feel extra special.",
    description:
      "A colorful florist-designed arrangement using fresh seasonal flowers selected to create a bright, celebratory look.",
    image: placeholderImage,
    active: true,
    featured: true,
    sizes: [
      { name: "Standard", price: 55 },
      { name: "Deluxe", price: 70 },
      { name: "Premium", price: 85 },
    ],
    allowsCardMessage: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: standardLeadTime,
    substitutionNote,
  },

  {
    id: "anniversary-arrangement",
    slug: "anniversary-arrangement",
    name: "Anniversary Arrangement",
    category: "occasion",
    shortDescription:
      "A romantic fresh-flower arrangement for anniversaries and special milestones.",
    description:
      "A florist-designed arrangement with romantic seasonal blooms and complementary greenery.",
    image: placeholderImage,
    active: true,
    featured: true,
    sizes: [
      { name: "Standard", price: 60 },
      { name: "Deluxe", price: 75 },
      { name: "Premium", price: 95 },
    ],
    allowsCardMessage: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: standardLeadTime,
    substitutionNote,
  },

  {
    id: "thinking-of-you-arrangement",
    slug: "thinking-of-you-arrangement",
    name: "Thinking of You Arrangement",
    category: "occasion",
    shortDescription:
      "A thoughtful arrangement for sending encouragement, love, or a simple reminder that you care.",
    description:
      "A fresh seasonal arrangement designed in a soft, welcoming style suitable for a wide variety of occasions.",
    image: placeholderImage,
    active: true,
    featured: false,
    sizes: [
      { name: "Standard", price: 50 },
      { name: "Deluxe", price: 65 },
      { name: "Premium", price: 80 },
    ],
    allowsCardMessage: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: standardLeadTime,
    substitutionNote,
  },

  {
    id: "congratulations-arrangement",
    slug: "congratulations-arrangement",
    name: "Congratulations Arrangement",
    category: "occasion",
    shortDescription:
      "Fresh flowers for graduations, new jobs, new homes, achievements, and other happy milestones.",
    description:
      "A bright and celebratory florist-designed arrangement featuring fresh seasonal flowers.",
    image: placeholderImage,
    active: true,
    featured: false,
    sizes: [
      { name: "Standard", price: 55 },
      { name: "Deluxe", price: 70 },
      { name: "Premium", price: 85 },
    ],
    allowsCardMessage: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: standardLeadTime,
    substitutionNote,
  },

  {
    id: "sympathy-arrangement",
    slug: "sympathy-arrangement",
    name: "Sympathy Arrangement",
    category: "occasion",
    shortDescription:
      "A tasteful floral arrangement created to express comfort, remembrance, and support.",
    description:
      "A thoughtful fresh-flower arrangement designed with a peaceful and respectful presentation for sympathy and remembrance.",
    image: placeholderImage,
    active: true,
    featured: true,
    sizes: [
      { name: "Standard", price: 65 },
      { name: "Deluxe", price: 85 },
      { name: "Premium", price: 110 },
    ],
    allowsCardMessage: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: standardLeadTime,
    substitutionNote,
  },

  {
    id: "seasonal-designers-choice",
    slug: "seasonal-designers-choice",
    name: "Seasonal Designer's Choice",
    category: "seasonal",
    shortDescription:
      "A one-of-a-kind arrangement made with beautiful flowers currently in season.",
    description:
      "Let Port Petals create a fresh arrangement using the best seasonal blooms and complementary colors available.",
    image: placeholderImage,
    active: true,
    featured: true,
    sizes: [
      { name: "Standard", price: 55 },
      { name: "Deluxe", price: 70 },
      { name: "Premium", price: 90 },
    ],
    allowsCardMessage: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: standardLeadTime,
    substitutionNote,
  },

  {
    id: "holiday-arrangement",
    slug: "holiday-arrangement",
    name: "Holiday Arrangement",
    category: "seasonal",
    shortDescription:
      "A festive seasonal arrangement designed around the colors and feeling of the holiday.",
    description:
      "A florist-designed holiday centerpiece or arrangement featuring seasonal flowers, greenery, and coordinating accents.",
    image: placeholderImage,
    active: true,
    featured: false,
    sizes: [
      { name: "Standard", price: 60 },
      { name: "Deluxe", price: 80 },
      { name: "Premium", price: 100 },
    ],
    allowsCardMessage: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: standardLeadTime,
    substitutionNote,
  },

  {
    id: "classic-hand-tied-bouquet",
    slug: "classic-hand-tied-bouquet",
    name: "Classic Hand-Tied Bouquet",
    category: "bouquets",
    shortDescription:
      "A fresh hand-tied bouquet ready to give, arrange at home, or brighten someone's day.",
    description:
      "A florist-selected mix of fresh seasonal flowers wrapped and prepared as a hand-tied bouquet.",
    image: placeholderImage,
    active: true,
    featured: true,
    sizes: [{ name: "Classic", price: 40 }],
    allowsCardMessage: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: standardLeadTime,
    substitutionNote,
  },

  {
    id: "deluxe-hand-tied-bouquet",
    slug: "deluxe-hand-tied-bouquet",
    name: "Deluxe Hand-Tied Bouquet",
    category: "bouquets",
    shortDescription:
      "A fuller hand-tied bouquet featuring a larger mix of fresh seasonal flowers.",
    description:
      "A generous florist-selected bouquet with added blooms, texture, and greenery.",
    image: placeholderImage,
    active: true,
    featured: false,
    sizes: [{ name: "Deluxe", price: 55 }],
    allowsCardMessage: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: standardLeadTime,
    substitutionNote,
  },

  {
    id: "premium-hand-tied-bouquet",
    slug: "premium-hand-tied-bouquet",
    name: "Premium Hand-Tied Bouquet",
    category: "bouquets",
    shortDescription:
      "A lush hand-tied bouquet with premium seasonal blooms and a fuller presentation.",
    description:
      "A premium florist-selected bouquet designed with additional flowers, texture, and elevated seasonal blooms.",
    image: placeholderImage,
    active: true,
    featured: false,
    sizes: [{ name: "Premium", price: 70 }],
    allowsCardMessage: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: standardLeadTime,
    substitutionNote,
  },

  {
    id: "boutonniere",
    slug: "boutonniere",
    name: "Boutonniere",
    category: "prom-homecoming",
    shortDescription:
      "A fresh boutonniere coordinated to complement prom or homecoming attire.",
    description:
      "A handcrafted boutonniere using fresh flowers, greenery, and coordinating accents.",
    image: placeholderImage,
    active: true,
    featured: true,
    sizes: [{ name: "Standard", price: 20 }],
    allowsCardMessage: false,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: standardLeadTime,
    substitutionNote,
  },

  {
    id: "wrist-corsage",
    slug: "wrist-corsage",
    name: "Wrist Corsage",
    category: "prom-homecoming",
    shortDescription:
      "A handcrafted fresh-flower wrist corsage coordinated with dress or event colors.",
    description:
      "A custom wrist corsage featuring fresh flowers, ribbon, greenery, and accents selected to coordinate with the requested color palette.",
    image: placeholderImage,
    active: true,
    featured: true,
    sizes: [{ name: "Standard", price: 40 }],
    allowsCardMessage: false,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: standardLeadTime,
    substitutionNote,
  },

  {
    id: "formal-handheld-bouquet",
    slug: "formal-handheld-bouquet",
    name: "Prom & Homecoming Handheld Bouquet",
    category: "prom-homecoming",
    shortDescription:
      "A compact handheld bouquet designed to coordinate with formal attire.",
    description:
      "A fresh handheld bouquet customized around the requested colors and style for prom, homecoming, or another school formal.",
    image: placeholderImage,
    active: true,
    featured: false,
    sizes: [{ name: "Standard", price: 55 }],
    allowsCardMessage: false,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: standardLeadTime,
    substitutionNote,
  },

  {
    id: "corsage-boutonniere-set",
    slug: "corsage-boutonniere-set",
    name: "Corsage & Boutonniere Set",
    category: "prom-homecoming",
    shortDescription:
      "A coordinated corsage and boutonniere designed together for a matching look.",
    description:
      "A matching wrist corsage and boutonniere using coordinated flowers, ribbon, greenery, and accents.",
    image: placeholderImage,
    active: true,
    featured: false,
    sizes: [{ name: "Set", price: 55 }],
    allowsCardMessage: false,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: standardLeadTime,
    substitutionNote,
  },
];
