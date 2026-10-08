"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createProduct } from "./actions";

type Department =
  | ""
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
  configurator: ConfiguratorType;
  purchaseMode: PurchaseMode;
  leadTimeDays: number | null;
};

const productTypesByDepartment: Record<
  Exclude<Department, "">,
  ProductTypeOption[]
> = {
  flowers: [
    {
      value: "floral-arrangement",
      label: "Floral Arrangement",
      configurator: "flower",
      purchaseMode: "direct",
      leadTimeDays: 3,
    },
    {
      value: "hand-tied-bouquet",
      label: "Hand-Tied Bouquet",
      configurator: "flower",
      purchaseMode: "customizable",
      leadTimeDays: 3,
    },
    {
      value: "corsage",
      label: "Corsage",
      configurator: "flower",
      purchaseMode: "customizable",
      leadTimeDays: 3,
    },
    {
      value: "boutonniere",
      label: "Boutonniere",
      configurator: "flower",
      purchaseMode: "customizable",
      leadTimeDays: 3,
    },
    {
      value: "formal-flower-set",
      label: "Formal Flower Set",
      configurator: "flower",
      purchaseMode: "customizable",
      leadTimeDays: 3,
    },
    {
      value: "sympathy-arrangement",
      label: "Sympathy Arrangement",
      configurator: "flower",
      purchaseMode: "customizable",
      leadTimeDays: 4,
    },
    {
      value: "casket-spray",
      label: "Casket Spray",
      configurator: "flower",
      purchaseMode: "customizable",
      leadTimeDays: 4,
    },
    {
      value: "standing-spray",
      label: "Standing Spray",
      configurator: "flower",
      purchaseMode: "customizable",
      leadTimeDays: 4,
    },
    {
      value: "memorial-tribute",
      label: "Memorial Tribute",
      configurator: "flower",
      purchaseMode: "customizable",
      leadTimeDays: 4,
    },
  ],

  "gifts-decor": [
    {
      value: "candle-bouquet",
      label: "Candle Bouquet",
      configurator: "candle",
      purchaseMode: "customizable",
      leadTimeDays: 2,
    },
    {
      value: "wax-melt",
      label: "Wax Melt / Tart",
      configurator: "candle",
      purchaseMode: "direct",
      leadTimeDays: null,
    },
    {
      value: "gift-bouquet",
      label: "Gift Bouquet",
      configurator: "custom",
      purchaseMode: "customizable",
      leadTimeDays: 2,
    },
    {
      value: "gift-set",
      label: "Gift Set",
      configurator: "custom",
      purchaseMode: "customizable",
      leadTimeDays: 2,
    },
    {
      value: "slate",
      label: "Slate",
      configurator: "custom",
      purchaseMode: "customizable",
      leadTimeDays: 2,
    },
    {
      value: "wood-sign",
      label: "Wood Sign",
      configurator: "custom",
      purchaseMode: "customizable",
      leadTimeDays: 2,
    },
    {
      value: "mug",
      label: "Mug",
      configurator: "simple",
      purchaseMode: "direct",
      leadTimeDays: null,
    },
    {
      value: "custom-gift",
      label: "Other Custom Gift",
      configurator: "custom",
      purchaseMode: "customizable",
      leadTimeDays: 2,
    },
  ],

  apparel: [
    {
      value: "shirt",
      label: "Shirt / Apparel Design",
      configurator: "shirt",
      purchaseMode: "direct",
      leadTimeDays: null,
    },
  ],

  "gator-gear": [
    {
      value: "mug",
      label: "Mug",
      configurator: "gator",
      purchaseMode: "direct",
      leadTimeDays: 2,
    },
    {
      value: "cooling-towel",
      label: "Cooling Towel",
      configurator: "gator",
      purchaseMode: "customizable",
      leadTimeDays: 2,
    },
    {
      value: "wood-sign",
      label: "Wood Sign",
      configurator: "gator",
      purchaseMode: "customizable",
      leadTimeDays: 2,
    },
    {
      value: "slate",
      label: "Slate",
      configurator: "gator",
      purchaseMode: "customizable",
      leadTimeDays: 2,
    },
    {
      value: "ornament",
      label: "Gator Ornament",
      configurator: "gator",
      purchaseMode: "customizable",
      leadTimeDays: 2,
    },
    {
      value: "gift-set",
      label: "Gift Set",
      configurator: "gator",
      purchaseMode: "customizable",
      leadTimeDays: 2,
    },
    {
      value: "gator-gift",
      label: "Other Gator Gift",
      configurator: "gator",
      purchaseMode: "customizable",
      leadTimeDays: 2,
    },
  ],

  seasonal: [
    {
      value: "ornament",
      label: "Ornament",
      configurator: "custom",
      purchaseMode: "customizable",
      leadTimeDays: 2,
    },
    {
      value: "seasonal-floral",
      label: "Seasonal Floral Arrangement",
      configurator: "flower",
      purchaseMode: "direct",
      leadTimeDays: 3,
    },
    {
      value: "seasonal-decor",
      label: "Seasonal Decor",
      configurator: "custom",
      purchaseMode: "direct",
      leadTimeDays: 2,
    },
    {
      value: "seasonal-gift",
      label: "Seasonal Gift",
      configurator: "custom",
      purchaseMode: "direct",
      leadTimeDays: 2,
    },
    {
      value: "seasonal-candle",
      label: "Seasonal Candle / Wax Product",
      configurator: "candle",
      purchaseMode: "direct",
      leadTimeDays: null,
    },
    {
      value: "seasonal-shirt",
      label: "Seasonal Shirt",
      configurator: "shirt",
      purchaseMode: "direct",
      leadTimeDays: null,
    },
  ],

  "weddings-events": [
    {
      value: "wedding-floral",
      label: "Wedding Floral",
      configurator: "wedding",
      purchaseMode: "consultation",
      leadTimeDays: null,
    },
    {
      value: "bridal-bouquet",
      label: "Bridal Bouquet",
      configurator: "wedding",
      purchaseMode: "consultation",
      leadTimeDays: null,
    },
    {
      value: "bridesmaid-bouquet",
      label: "Bridesmaid Bouquet",
      configurator: "wedding",
      purchaseMode: "consultation",
      leadTimeDays: null,
    },
    {
      value: "wedding-boutonniere",
      label: "Wedding Boutonniere",
      configurator: "wedding",
      purchaseMode: "consultation",
      leadTimeDays: null,
    },
    {
      value: "wedding-corsage",
      label: "Wedding Corsage",
      configurator: "wedding",
      purchaseMode: "consultation",
      leadTimeDays: null,
    },
    {
      value: "ceremony-arrangement",
      label: "Ceremony Arrangement",
      configurator: "wedding",
      purchaseMode: "consultation",
      leadTimeDays: null,
    },
    {
      value: "reception-arrangement",
      label: "Reception Arrangement",
      configurator: "wedding",
      purchaseMode: "consultation",
      leadTimeDays: null,
    },
    {
      value: "centerpiece",
      label: "Centerpiece",
      configurator: "wedding",
      purchaseMode: "consultation",
      leadTimeDays: null,
    },
    {
      value: "arch-floral",
      label: "Arch Floral",
      configurator: "wedding",
      purchaseMode: "consultation",
      leadTimeDays: null,
    },
    {
      value: "wedding-package",
      label: "Wedding Package",
      configurator: "wedding",
      purchaseMode: "consultation",
      leadTimeDays: null,
    },
    {
      value: "event-floral",
      label: "Other Event Floral",
      configurator: "wedding",
      purchaseMode: "consultation",
      leadTimeDays: null,
    },
  ],
};

const collectionsByDepartment: Record<
  Exclude<Department, "">,
  { value: string; label: string }[]
> = {
  flowers: [
    { value: "occasion", label: "Everyday & Occasion" },
    { value: "prom-homecoming", label: "Prom & Homecoming" },
    {
      value: "sympathy-arrangements",
      label: "Sympathy Arrangements",
    },
  ],

  "gifts-decor": [
    { value: "candle-bouquets", label: "Candle Bouquets" },
    { value: "tarts", label: "Wax Melts / Tarts" },
    { value: "gift-bouquets", label: "Gift Bouquets & Sets" },
    { value: "personalized", label: "Personalized Gifts" },
    { value: "home-decor", label: "Home Decor" },
  ],

  apparel: [
    {
      value: "sports-screen-prints",
      label: "Sports Screen Prints",
    },
    {
      value: "occasion-screen-print",
      label: "Occasion Screen Prints",
    },
    {
      value: "awareness-screen-prints",
      label: "Awareness Screen Prints",
    },
  ],

  "gator-gear": [
    { value: "gator-gifts", label: "Gator Gifts" },
    {
      value: "player-personalized",
      label: "Player Personalized",
    },
    { value: "school-spirit", label: "School Spirit" },
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

const purchaseModeLabels: Record<
  PurchaseMode,
  string
> = {
  direct: "Direct Purchase",
  customizable: "Customizable",
  request: "Request",
  consultation: "Consultation",
};

const configuratorLabels: Record<
  ConfiguratorType,
  string
> = {
  simple: "Simple Product",
  flower: "Flower Ordering",
  candle: "Candle Ordering",
  custom: "Custom Item Ordering",
  shirt: "Shirt Ordering",
  gator: "Gator Ordering",
  wedding: "Wedding / Event Inquiry",
};

export default function ProductCreateForm() {
  const [department, setDepartment] =
    useState<Department>("");

  const [productType, setProductType] =
    useState("");

  const [collection, setCollection] =
    useState("");

  const [purchaseMode, setPurchaseMode] =
    useState<PurchaseMode>("direct");

  const [configuratorType, setConfiguratorType] =
    useState<ConfiguratorType>("simple");

  const [customizable, setCustomizable] =
    useState(false);

  const [madeToOrder, setMadeToOrder] =
    useState(false);

  const [readyMade, setReadyMade] =
    useState(true);

  const availableProductTypes =
    department
      ? productTypesByDepartment[department]
      : [];

  const availableCollections =
    department
      ? collectionsByDepartment[department]
      : [];

  const selectedProductType = useMemo(
    () =>
      availableProductTypes.find(
        (item) => item.value === productType
      ),
    [availableProductTypes, productType]
  );

  const recommendedLeadTime =
    selectedProductType?.leadTimeDays ?? null;

  function handleDepartmentChange(
    nextDepartment: Department
  ) {
    setDepartment(nextDepartment);
    setProductType("");
    setCollection("");
    setPurchaseMode("direct");
    setConfiguratorType("simple");
    setCustomizable(false);
    setMadeToOrder(false);
    setReadyMade(true);
  }

  function handleProductTypeChange(
    nextProductType: string
  ) {
    setProductType(nextProductType);

    const option =
      availableProductTypes.find(
        (item) =>
          item.value === nextProductType
      );

    if (!option) {
      return;
    }

    setPurchaseMode(option.purchaseMode);
    setConfiguratorType(option.configurator);

    const isCustom =
      option.purchaseMode ===
        "customizable" ||
      option.purchaseMode === "request" ||
      option.purchaseMode ===
        "consultation";

    setCustomizable(
      option.purchaseMode === "customizable"
    );

    setMadeToOrder(isCustom);

    setReadyMade(
      option.purchaseMode === "direct"
    );
  }

  return (
    <form
      action={createProduct}
      className="mt-6 space-y-5"
    >
      <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-[0_1px_3px_rgba(21,63,50,0.05)] sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
          Step 1
        </p>

        <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
          Product Information
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#607068]">
          Choose where the product belongs and
          what type of item it is.
        </p>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Product Name *
            </span>

            <input
              type="text"
              name="name"
              required
              placeholder="Example: Personalized Christmas Slate"
              className="min-h-11 rounded-lg border border-[#284239]/15 px-4 py-3 text-base outline-none focus:border-[#e76d61]"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold">
                Department *
              </span>

              <select
                name="department"
                required
                value={department}
                onChange={(event) =>
                  handleDepartmentChange(
                    event.target.value as Department
                  )
                }
                className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none focus:border-[#e76d61]"
              >
                <option value="">
                  Choose department
                </option>
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
                disabled={!department}
                onChange={(event) =>
                  handleProductTypeChange(
                    event.target.value
                  )
                }
                className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none focus:border-[#e76d61] disabled:bg-[#f2f0ec]"
              >
                <option value="">
                  {department
                    ? "Choose product type"
                    : "Choose department first"}
                </option>

                {availableProductTypes.map(
                  (item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Collection *
            </span>

            <select
              name="collection"
              required
              value={collection}
              disabled={!department}
              onChange={(event) =>
                setCollection(
                  event.target.value
                )
              }
              className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none focus:border-[#e76d61] disabled:bg-[#f2f0ec]"
            >
              <option value="">
                {department
                  ? "Choose collection"
                  : "Choose department first"}
              </option>

              {availableCollections.map(
                (item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                )
              )}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Short Description
            </span>

            <input
              type="text"
              name="short_description"
              placeholder="Short description shown on product cards"
              className="min-h-11 rounded-lg border border-[#284239]/15 px-4 py-3 text-base outline-none focus:border-[#e76d61]"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Full Description
            </span>

            <textarea
              name="description"
              rows={5}
              placeholder="Describe the product, materials, style, customization, or anything the customer should know."
              className="resize-y rounded-lg border border-[#284239]/15 px-4 py-3 text-base outline-none focus:border-[#e76d61]"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-[0_1px_3px_rgba(21,63,50,0.05)] sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
          Step 2
        </p>

        <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
          Ordering Experience
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#607068]">
          These settings control how customers
          interact with this product.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
                  event.target.value as PurchaseMode
                )
              }
              className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none focus:border-[#e76d61]"
            >
              {Object.entries(
                purchaseModeLabels
              ).map(([value, label]) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
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
              className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none focus:border-[#e76d61]"
            >
              {Object.entries(
                configuratorLabels
              ).map(([value, label]) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 rounded-xl bg-[#edf3e7] p-4">
          <p className="text-sm font-semibold text-[#153f32]">
            Recommended setup
          </p>

          <p className="mt-1 text-sm leading-6 text-[#52655d]">
            Product Type:{" "}
            <strong>
              {selectedProductType?.label ??
                "Choose a product type"}
            </strong>
            <br />
            Ordering:{" "}
            <strong>
              {purchaseModeLabels[purchaseMode]}
            </strong>
            <br />
            Experience:{" "}
            <strong>
              {
                configuratorLabels[
                  configuratorType
                ]
              }
            </strong>
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-[0_1px_3px_rgba(21,63,50,0.05)] sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
          Step 3
        </p>

        <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
          Pricing & Production
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Base Price
            </span>

            <div className="flex min-h-12 overflow-hidden rounded-xl border border-[#284239]/15 bg-white focus-within:border-[#e76d61]">
              <span className="flex items-center border-r border-[#284239]/10 px-4 text-[#718078]">
                $
              </span>

              <input
                type="number"
                name="base_price"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="min-w-0 flex-1 px-4 py-3 text-base outline-none"
              />
            </div>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Maker
            </span>

            <input
              type="text"
              name="maker"
              placeholder="Optional"
              className="min-h-11 rounded-lg border border-[#284239]/15 px-4 py-3 text-base outline-none focus:border-[#e76d61]"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex items-start gap-3 rounded-xl border border-[#284239]/10 p-4">
            <input
              type="checkbox"
              name="ready_made"
              checked={readyMade}
              onChange={(event) =>
                setReadyMade(
                  event.target.checked
                )
              }
              className="mt-1 h-4 w-4"
            />

            <span>
              <span className="block text-sm font-semibold">
                Ready-Made
              </span>
              <span className="mt-1 block text-xs leading-5 text-[#718078]">
                Already made and available.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-xl border border-[#284239]/10 p-4">
            <input
              type="checkbox"
              name="made_to_order"
              checked={madeToOrder}
              onChange={(event) =>
                setMadeToOrder(
                  event.target.checked
                )
              }
              className="mt-1 h-4 w-4"
            />

            <span>
              <span className="block text-sm font-semibold">
                Made to Order
              </span>
              <span className="mt-1 block text-xs leading-5 text-[#718078]">
                Created after the order or
                request is received.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-xl border border-[#284239]/10 p-4">
            <input
              type="checkbox"
              name="customizable"
              checked={customizable}
              onChange={(event) =>
                setCustomizable(
                  event.target.checked
                )
              }
              className="mt-1 h-4 w-4"
            />

            <span>
              <span className="block text-sm font-semibold">
                Customizable
              </span>
              <span className="mt-1 block text-xs leading-5 text-[#718078]">
                Customer chooses personalized
                details.
              </span>
            </span>
          </label>
        </div>

        <div className="mt-5 rounded-xl bg-[#edf3e7] p-5">
          <p className="text-sm font-semibold text-[#153f32]">
            Preparation Time
          </p>

          {recommendedLeadTime !== null ? (
            <>
              <p className="mt-2 text-sm leading-6 text-[#52655d]">
                Recommended minimum:{" "}
                <strong>
                  {recommendedLeadTime} day
                  {recommendedLeadTime === 1
                    ? ""
                    : "s"}
                </strong>
                .
              </p>

              <input
                type="hidden"
                name="lead_time_days"
                value={recommendedLeadTime}
              />
            </>
          ) : (
            <>
              <p className="mt-2 text-sm leading-6 text-[#52655d]">
                No automatic preparation time
                is required for this product.
                You can adjust it later.
              </p>

              <input
                type="hidden"
                name="lead_time_days"
                value=""
              />
            </>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-[0_1px_3px_rgba(21,63,50,0.05)] sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
          Step 4
        </p>

        <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
          Fulfillment & Inventory
        </h2>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl border border-[#284239]/10 p-4">
            <input
              type="checkbox"
              name="pickup_available"
              defaultChecked
              className="h-4 w-4"
            />

            <span className="text-sm font-semibold">
              Pickup Available
            </span>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-[#284239]/10 p-4">
            <input
              type="checkbox"
              name="delivery_available"
              defaultChecked
              className="h-4 w-4"
            />

            <span className="text-sm font-semibold">
              Local Delivery Available
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-xl border border-[#284239]/10 p-4">
            <input
              type="checkbox"
              name="track_inventory"
              className="mt-1 h-4 w-4"
            />

            <span>
              <span className="block text-sm font-semibold">
                Track Inventory
              </span>

              <span className="mt-1 block text-xs leading-5 text-[#718078]">
                Use for limited physical stock.
              </span>
            </span>
          </label>

          <label className="grid gap-2 rounded-xl border border-[#284239]/10 p-4">
            <span className="text-sm font-semibold">
              Starting Quantity
            </span>

            <input
              type="number"
              name="quantity"
              min="0"
              step="1"
              placeholder="0"
              className="min-h-11 rounded-lg border border-[#284239]/15 px-3 py-2 text-base outline-none focus:border-[#e76d61]"
            />
          </label>

          <label className="flex items-start gap-3 rounded-xl border border-[#284239]/10 p-4 sm:col-span-2">
            <input
              type="checkbox"
              name="featured"
              className="mt-1 h-4 w-4"
            />

            <span>
              <span className="block text-sm font-semibold">
                Featured Product
              </span>

              <span className="mt-1 block text-xs leading-5 text-[#718078]">
                Highlight this product in
                featured storefront sections.
              </span>
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e76d61]/20 bg-[#fff7f4] p-5">
        <h2 className="font-serif text-xl font-semibold text-[#153f32]">
          Ready to create the product?
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#607068]">
          The product will be saved as a draft.
          You can add photos, variants,
          inventory, and other details before
          publishing it.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/admin/products"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#284239]/15 bg-white px-6 py-3 font-semibold text-[#284239]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
          >
            Create Product & Continue →
          </button>
        </div>
      </section>
    </form>
  );
}
