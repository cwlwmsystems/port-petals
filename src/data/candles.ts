export type CandleCategory =
  | "tarts"
  | "tart-bouquets";

export type CandleOption = {
  name: string;
  price: number;
};

export type CandleProduct = {
  id: string;
  slug: string;
  name: string;
  category: CandleCategory;
  shortDescription: string;
  description: string;
  image: string;
  active: boolean;
  featured: boolean;
  options: CandleOption[];
  pickupAvailable: boolean;
  deliveryAvailable: boolean;
  allowsGiftMessage: boolean;
  leadTime?: string;
};

export type CandleCollection = {
  slug: CandleCategory;
  name: string;
  description: string;
};

export const candleCollections: CandleCollection[] = [
  {
    slug: "tarts",
    name: "Candle Tarts",
    description:
      "Scented candle tarts made for wax warmers, available in giftable packs and seasonal fragrances.",
  },
  {
    slug: "tart-bouquets",
    name: "Candle Tart Bouquets",
    description:
      "Decorative candle tart bouquets arranged as a unique gift for birthdays, holidays, celebrations, and everyday surprises.",
  },
];

const placeholderImage = "/collections/candles.jpg";

export const candleProducts: CandleProduct[] = [
  {
    id: "candle-tart-pack",
    slug: "candle-tart-pack",
    name: "Candle Tart Pack",
    category: "tarts",
    shortDescription:
      "A scented candle tart pack made for use in your favorite wax warmer.",
    description:
      "A giftable selection of scented candle tarts for filling your home with cozy fragrance without an open flame.",
    image: placeholderImage,
    active: true,
    featured: true,
    options: [
      {
        name: "Standard Pack",
        price: 8,
      },
    ],
    pickupAvailable: true,
    deliveryAvailable: true,
    allowsGiftMessage: true,
  },

  {
    id: "deluxe-candle-tart-pack",
    slug: "deluxe-candle-tart-pack",
    name: "Deluxe Candle Tart Pack",
    category: "tarts",
    shortDescription:
      "A larger collection of scented candle tarts for gifting or stocking up on favorite fragrances.",
    description:
      "A larger assortment of candle tarts featuring a mix of available scents and seasonal favorites.",
    image: placeholderImage,
    active: true,
    featured: false,
    options: [
      {
        name: "Deluxe Pack",
        price: 14,
      },
    ],
    pickupAvailable: true,
    deliveryAvailable: true,
    allowsGiftMessage: true,
  },

  {
    id: "candle-tart-bouquet",
    slug: "candle-tart-bouquet",
    name: "Candle Tart Bouquet",
    category: "tart-bouquets",
    shortDescription:
      "A decorative bouquet made with scented candle tarts for a fun and unique gift.",
    description:
      "A handcrafted candle tart bouquet arranged as a decorative gift with scented wax tarts and coordinating accents.",
    image: placeholderImage,
    active: true,
    featured: true,
    options: [
      {
        name: "Small",
        price: 20,
      },
      {
        name: "Medium",
        price: 30,
      },
      {
        name: "Large",
        price: 40,
      },
    ],
    pickupAvailable: true,
    deliveryAvailable: true,
    allowsGiftMessage: true,
    leadTime: "Please allow at least 7 days for custom candle tart bouquets.",
  },
];
