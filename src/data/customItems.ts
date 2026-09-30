export type CustomItemCategory =
  | "sports"
  | "personalized-signs"
  | "seasonal"
  | "door-decor"
  | "tumblers"
  | "woodcrafts";

export type CustomItemOption = {
  name: string;
  price: number;
};

export type CustomItemProduct = {
  id: string;
  slug: string;
  name: string;
  category: CustomItemCategory;
  shortDescription: string;
  description: string;
  image: string;
  active: boolean;
  featured: boolean;
  options: CustomItemOption[];
  personalizationAvailable: boolean;
  pickupAvailable: boolean;
  deliveryAvailable: boolean;
  leadTime: string;
};

export type CustomItemCollection = {
  slug: CustomItemCategory;
  name: string;
  description: string;
};

export const customItemCollections: CustomItemCollection[] = [
  {
    slug: "sports",
    name: "Sports & Team Designs",
    description:
      "Personalized sports keepsakes, player plaques, team gifts, and custom designs featuring names, numbers, years, and team colors.",
  },
  {
    slug: "personalized-signs",
    name: "Personalized Signs",
    description:
      "Custom name, number, and decorative signs created for athletes, families, gifts, rooms, and special occasions.",
  },
  {
    slug: "seasonal",
    name: "Seasonal & Holiday",
    description:
      "Personalized ornaments and seasonal decorations designed for holidays, celebrations, and family traditions.",
  },
  {
    slug: "door-decor",
    name: "Door & Wall Decor",
    description:
      "Layered wood signs, seasonal door hangers, and decorative pieces for the home.",
  },
  {
    slug: "tumblers",
    name: "Custom Tumblers",
    description:
      "Personalized tumblers created with names, colors, themes, sayings, and custom designs.",
  },
  {
    slug: "woodcrafts",
    name: "Custom Woodcrafts",
    description:
      "Made-to-order wood projects, signs, keepsakes, and other creative custom pieces.",
  },
];

const placeholderImage = "/collections/customized-items.jpg";

export const customItemProducts: CustomItemProduct[] = [
  {
    id: "sports-player-plaque",
    slug: "sports-player-plaque",
    name: "Personalized Sports Player Plaque",
    category: "sports",
    shortDescription:
      "A layered personalized player plaque featuring a name, number, year, and team-inspired design.",
    description:
      "A custom layered sports keepsake designed around the athlete's name, jersey number, year, sport, and preferred team colors.",
    image: placeholderImage,
    active: true,
    featured: true,
    options: [
      {
        name: "Standard",
        price: 35,
      },
    ],
    personalizationAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: "Please allow at least 7 days for personalization.",
  },

  {
    id: "jersey-name-number-sign",
    slug: "jersey-name-number-sign",
    name: "Jersey Name & Number Sign",
    category: "personalized-signs",
    shortDescription:
      "A jersey-shaped personalized sign featuring a player's last name, number, and team colors.",
    description:
      "A layered jersey-style keepsake customized with a name, player number, and coordinating school or team colors.",
    image: placeholderImage,
    active: true,
    featured: true,
    options: [
      {
        name: "Standard",
        price: 30,
      },
    ],
    personalizationAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: "Please allow at least 7 days for personalization.",
  },

  {
    id: "personalized-holiday-ornament",
    slug: "personalized-holiday-ornament",
    name: "Personalized Holiday Ornament",
    category: "seasonal",
    shortDescription:
      "A personalized layered ornament for families, gifts, and holiday keepsakes.",
    description:
      "A custom holiday ornament personalized with names and decorative seasonal details.",
    image: placeholderImage,
    active: true,
    featured: false,
    options: [
      {
        name: "Standard",
        price: 15,
      },
    ],
    personalizationAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: "Please allow at least 7 days for personalization.",
  },

  {
    id: "seasonal-door-hanger",
    slug: "seasonal-door-hanger",
    name: "Seasonal Door Hanger",
    category: "door-decor",
    shortDescription:
      "A layered decorative wood door hanger with seasonal colors, accents, and artwork.",
    description:
      "A handcrafted layered door or wall decoration created around a seasonal theme with coordinating wood elements, greenery, and decorative accents.",
    image: placeholderImage,
    active: true,
    featured: true,
    options: [
      {
        name: "Standard",
        price: 35,
      },
    ],
    personalizationAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: "Please allow 7–10 days for custom door decor.",
  },

  {
    id: "custom-tumbler",
    slug: "custom-tumbler",
    name: "Custom Tumbler",
    category: "tumblers",
    shortDescription:
      "A personalized tumbler created with your name, colors, theme, or design idea.",
    description:
      "A custom tumbler designed around your requested name, colors, theme, saying, or other personalization.",
    image: placeholderImage,
    active: true,
    featured: true,
    options: [
      {
        name: "Starting Price",
        price: 25,
      },
    ],
    personalizationAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: "Please allow at least 7 days for custom tumbler orders.",
  },

  {
    id: "custom-woodcraft",
    slug: "custom-woodcraft",
    name: "Custom Woodcraft",
    category: "woodcrafts",
    shortDescription:
      "Have an idea for a personalized wood sign, keepsake, or decorative project? Port Petals can help bring it to life.",
    description:
      "Made-to-order woodcraft projects can be created around names, themes, sports, holidays, family gifts, home decor, and other creative ideas.",
    image: placeholderImage,
    active: true,
    featured: false,
    options: [
      {
        name: "Starting Price",
        price: 30,
      },
    ],
    personalizationAvailable: true,
    pickupAvailable: true,
    deliveryAvailable: true,
    leadTime: "Please allow 10–14 days for custom woodwork. Larger or more detailed projects may require additional time.",
  },
];
