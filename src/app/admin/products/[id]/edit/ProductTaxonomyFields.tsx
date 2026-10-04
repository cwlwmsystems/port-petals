"use client";

import { useMemo, useState } from "react";

type Department =
  | "flowers"
  | "gifts-decor"
  | "apparel"
  | "gator-gear"
  | "seasonal"
  | "weddings-events";

type PurchaseMode =
  | "direct"
  | "customizable"
  | "request"
  | "consultation";

type ConfiguratorType =
  | "simple"
  | "flower"
  | "candle"
  | "custom"
  | "shirt"
  | "gator"
  | "wedding";

type ProductTypeOption = {
  value: string;
  label: string;
};

const productTypesByDepartment: Record<
  Department,
  ProductTypeOption[]
> = {
  flowers: [
    { value: "floral-arrangement", label: "Floral Arrangement" },
    { value: "hand-tied-bouquet", label: "Hand-Tied Bouquet" },
    { value: "corsage", label: "Corsage" },
    { value: "boutonniere", label: "Boutonniere" },
    { value: "formal-flower-set", label: "Formal Flower Set" },
    { value: "sympathy-arrangement", label: "Sympathy Arrangement" },
    { value: "casket-spray", label: "Casket Spray" },
    { value: "standing-spray", label: "Standing Spray" },
    { value: "memorial-tribute", label: "Memorial Tribute" },
  ],

  "gifts-decor": [
    { value: "candle-bouquet", label: "Candle Bouquet" },
    { value: "wax-melt", label: "Wax Melt / Tart" },
    { value: "gift-bouquet", label: "Gift Bouquet" },
    { value: "gift-set", label: "Gift Set" },
    { value: "slate", label: "Slate" },
    { value: "wood-sign", label: "Wood Sign" },
    { value: "mug", label: "Mug" },
    { value: "custom-gift", label: "Other Custom Gift" },
  ],

  apparel: [
    { value: "shirt", label: "Shirt / Apparel Design" },
  ],

  "gator-gear": [
    { value: "mug", label: "Mug" },
    { value: "cooling-towel", label: "Cooling Towel" },
    { value: "wood-sign", label: "Wood Sign" },
    { value: "slate", label: "Slate" },
    { value: "ornament", label: "Gator Ornament" },
    { value: "gift-set", label: "Gift Set" },
    { value: "gator-gift", label: "Other Gator Gift" },
  ],

  seasonal: [
    { value: "ornament", label: "Ornament" },
    { value: "seasonal-floral", label: "Seasonal Floral Arrangement" },
    { value: "seasonal-decor", label: "Seasonal Decor" },
    { value: "seasonal-gift", label: "Seasonal Gift" },
    { value: "seasonal-candle", label: "Seasonal Candle / Wax Product" },
    { value: "seasonal-shirt", label: "Seasonal Shirt" },
  ],

  "weddings-events": [
    { value: "wedding-floral", label: "Wedding Floral" },
    { value: "bridal-bouquet", label: "Bridal Bouquet" },
    { value: "bridesmaid-bouquet", label: "Bridesmaid Bouquet" },
    { value: "wedding-boutonniere", label: "Wedding Boutonniere" },
    { value: "wedding-corsage", label: "Wedding Corsage" },
    { value: "ceremony-arrangement", label: "Ceremony Arrangement" },
    { value: "reception-arrangement", label: "Reception Arrangement" },
    { value: "centerpiece", label: "Centerpiece" },
    { value: "arch-floral", label: "Arch Floral" },
    { value: "wedding-package", label: "Wedding Package" },
    { value: "event-floral", label: "Other Event Floral" },
  ],
};

const collectionsByDepartment: Record<
  Department,
  ProductTypeOption[]
> = {
  flowers: [
    { value: "occasion", label: "Everyday & Occasion" },
    { value: "prom-homecoming", label: "Prom & Homecoming" },
    {
      value: "Sympathy Arrangements",
      label: "Sympathy Arrangements",
    },
  ],

  "gifts-decor": [
    { value: "candle-bouquets", label: "Candle Bouquets" },
    { value: "tarts", label: "Wax Melts / Tarts" },
    { value: "Gift-Bouquets", label: "Gift Bouquets & Sets" },
    { value: "personalized", label: "Personalized Gifts" },
    { value: "home-decor", label: "Home Decor" },
  ],

  apparel: [
    {
      value: "Sports-Screen-Prints",
      label: "Sports Screen Prints",
    },
    {
      value: "occasion-screen-print",
      label: "Occasion Screen Prints",
    },
    {
      value: "Awareness-Screen-Prints",
      label: "Awareness Screen Prints",
    },
  ],

  "gator-gear": [
    { value: "Gator-Gifts", label: "Gator Gifts" },
    {
      value: "player-personalized",
      label: "Player Personalized",
    },
    { value: "School Spirit", label: "School Spirit" },
    { value: "senior-night", label: "Senior Night" },
  ],

  seasonal: [
    { value: "christmas", label: "Christmas" },
    { value: "fall", label: "Fall" },
    { value: "thanksgiving", label: "Thanksgiving" },
    { value: "halloween", label: "Halloween" },
    { value: "valentines", label: "Valentine's Day" },
    { value: "easter", label: "Easter" },
    { value: "spring", label: "Spring" },
    { value: "summer", label: "Summer" },
    { value: "graduation", label: "Graduation" },
    { value: "homecoming", label: "Homecoming" },
    { value: "seasonal", label: "General Seasonal" },
  ],

  "weddings-events": [
    { value: "weddings", label: "Weddings" },
    { value: "ceremony", label: "Ceremony Flowers" },
    { value: "reception", label: "Reception Flowers" },
    { value: "wedding-party", label: "Wedding Party" },
    { value: "event-florals", label: "Other Events" },
  ],
};

const purchaseModes: {
  value: PurchaseMode;
  label: string;
}[] = [
  { value: "direct", label: "Direct Purchase" },
  { value: "customizable", label: "Customizable" },
  { value: "request", label: "Request" },
  { value: "consultation", label: "Consultation" },
];

const configurators: {
  value: ConfiguratorType;
  label: string;
}[] = [
  { value: "simple", label: "Simple Product" },
  { value: "flower", label: "Flower Ordering" },
  { value: "candle", label: "Candle Ordering" },
  { value: "custom", label: "Custom Item Ordering" },
  { value: "shirt", label: "Shirt Ordering" },
  { value: "gator", label: "Gator Ordering" },
  { value: "wedding", label: "Wedding / Event Inquiry" },
];

type Props = {
  initialDepartment: string | null;
  initialProductType: string | null;
  initialCollection: string;
  initialPurchaseMode: string | null;
  initialConfiguratorType: string | null;
};

export default function ProductTaxonomyFields({
  initialDepartment,
  initialProductType,
  initialCollection,
  initialPurchaseMode,
  initialConfiguratorType,
}: Props) {
  const safeDepartment: Department =
    (
      [
        "flowers",
        "gifts-decor",
        "apparel",
        "gator-gear",
        "seasonal",
        "weddings-events",
      ] as string[]
    ).includes(initialDepartment ?? "")
      ? (initialDepartment as Department)
      : "gifts-decor";

  const [department, setDepartment] =
    useState<Department>(safeDepartment);

  const [productType, setProductType] =
    useState(initialProductType ?? "");

  const [collection, setCollection] =
    useState(initialCollection);

  const [purchaseMode, setPurchaseMode] =
    useState<PurchaseMode>(
      (
        [
          "direct",
          "customizable",
          "request",
          "consultation",
        ] as string[]
      ).includes(initialPurchaseMode ?? "")
        ? (initialPurchaseMode as PurchaseMode)
        : "direct"
    );

  const [configuratorType, setConfiguratorType] =
    useState<ConfiguratorType>(
      (
        [
          "simple",
          "flower",
          "candle",
          "custom",
          "shirt",
          "gator",
          "wedding",
        ] as string[]
      ).includes(initialConfiguratorType ?? "")
        ? (initialConfiguratorType as ConfiguratorType)
        : "simple"
    );

  const productTypeOptions = useMemo(() => {
    const options =
      productTypesByDepartment[department];

    if (
      productType &&
      !options.some(
        (option) =>
          option.value === productType
      )
    ) {
      return [
        {
          value: productType,
          label: `${productType} (current)`,
        },
        ...options,
      ];
    }

    return options;
  }, [department, productType]);

  const collectionOptions = useMemo(() => {
    const options =
      collectionsByDepartment[department];

    if (
      collection &&
      !options.some(
        (option) =>
          option.value === collection
      )
    ) {
      return [
        {
          value: collection,
          label: `${collection} (current)`,
        },
        ...options,
      ];
    }

    return options;
  }, [department, collection]);

  function changeDepartment(
    nextDepartment: Department
  ) {
    setDepartment(nextDepartment);
    setProductType("");
    setCollection("");

    if (nextDepartment === "flowers") {
      setConfiguratorType("flower");
      setPurchaseMode("direct");
    }

    if (nextDepartment === "gifts-decor") {
      setConfiguratorType("custom");
      setPurchaseMode("direct");
    }

    if (nextDepartment === "apparel") {
      setConfiguratorType("shirt");
      setPurchaseMode("direct");
    }

    if (nextDepartment === "gator-gear") {
      setConfiguratorType("gator");
      setPurchaseMode("direct");
    }

    if (nextDepartment === "seasonal") {
      setConfiguratorType("custom");
      setPurchaseMode("direct");
    }

    if (
      nextDepartment ===
      "weddings-events"
    ) {
      setConfiguratorType("wedding");
      setPurchaseMode("consultation");
    }
  }

  return (
    <section className="rounded-xl border border-[#284239]/10 bg-[#faf7f1] p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e76d61]">
          Catalog Structure
        </p>

        <p className="mt-2 text-sm leading-6 text-[#607068]">
          Controls where this product appears
          and how customers order it.
        </p>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">
            Department *
          </span>

          <select
            name="department"
            required
            value={department}
            onChange={(event) =>
              changeDepartment(
                event.target.value as Department
              )
            }
            className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none focus:border-[#e76d61]"
          >
            <option value="flowers">
              Flowers
            </option>

            <option value="gifts-decor">
              Gifts & Decor
            </option>

            <option value="apparel">
              Apparel
            </option>

            <option value="gator-gear">
              Gator Gear
            </option>

            <option value="seasonal">
              Seasonal
            </option>

            <option value="weddings-events">
              Weddings & Events
            </option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">
            Product Type *
          </span>

          <select
            name="product_type"
            required
            value={productType}
            onChange={(event) =>
              setProductType(
                event.target.value
              )
            }
            className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none focus:border-[#e76d61]"
          >
            <option value="">
              Choose product type
            </option>

            {productTypeOptions.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">
            Collection *
          </span>

          <select
            name="collection"
            required
            value={collection}
            onChange={(event) =>
              setCollection(
                event.target.value
              )
            }
            className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none focus:border-[#e76d61]"
          >
            <option value="">
              Choose collection
            </option>

            {collectionOptions.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">
            Ordering Method *
          </span>

          <select
            name="purchase_mode"
            required
            value={purchaseMode}
            onChange={(event) =>
              setPurchaseMode(
                event.target
                  .value as PurchaseMode
              )
            }
            className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none focus:border-[#e76d61]"
          >
            {purchaseModes.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
          </select>
        </label>

        <label className="grid gap-2 sm:col-span-2">
          <span className="text-sm font-semibold">
            Product Configurator *
          </span>

          <select
            name="configurator_type"
            required
            value={configuratorType}
            onChange={(event) =>
              setConfiguratorType(
                event.target
                  .value as ConfiguratorType
              )
            }
            className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none focus:border-[#e76d61]"
          >
            {configurators.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
          </select>
        </label>
      </div>
    </section>
  );
}
