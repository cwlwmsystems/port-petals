"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createProduct } from "./actions";

type Category =
  | ""
  | "flowers"
  | "candles"
  | "custom"
  | "shirts"
  | "gators";

const collectionsByCategory: Record<
  Exclude<Category, "">,
  {
    value: string;
    label: string;
    leadTimeDays: number | null;
  }[]
> = {
  flowers: [
    {
      value: "occasion",
      label: "Occasion",
      leadTimeDays: 3,
    },
    {
      value: "seasonal",
      label: "Seasonal",
      leadTimeDays: 3,
    },
    {
      value: "prom-homecoming",
      label: "Prom & Homecoming",
      leadTimeDays: 3,
    },
    {
      value: "Sympathy Arrangements",
      label: "Sympathy Arrangements",
      leadTimeDays: 4,
    },
  ],

  candles: [
    {
      value: "tarts",
      label: "Wax Melts / Tarts",
      leadTimeDays: null,
    },
    {
      value: "candle-bouquets",
      label: "Candle Bouquets",
      leadTimeDays: null,
    },
  ],

  custom: [
    {
      value: "Gift-Bouquets",
      label: "Gift Bouquets",
      leadTimeDays: 2,
    },
  ],

  shirts: [
    {
      value: "Sports-Screen-Prints",
      label: "Sports Screen Prints",
      leadTimeDays: null,
    },
    {
      value: "occasion-screen-print",
      label: "Occasion Screen Prints",
      leadTimeDays: null,
    },
    {
      value: "Awareness-Screen-Prints",
      label: "Awareness Screen Prints",
      leadTimeDays: null,
    },
  ],

  gators: [
    {
      value: "Gator-Gifts",
      label: "Gator Gifts",
      leadTimeDays: 2,
    },
    {
      value: "player-personalized",
      label: "Player Personalized",
      leadTimeDays: 2,
    },
    {
      value: "School Spirit",
      label: "School Spirit",
      leadTimeDays: 2,
    },
  ],
};

export default function ProductCreateForm() {
  const [category, setCategory] =
    useState<Category>("");

  const [collection, setCollection] =
    useState("");

  const [customizable, setCustomizable] =
    useState(false);

  const [madeToOrder, setMadeToOrder] =
    useState(false);

  const [readyMade, setReadyMade] =
    useState(false);

  const categoryCollections =
    category
      ? collectionsByCategory[category]
      : [];

  const selectedCollection =
    useMemo(
      () =>
        categoryCollections.find(
          (item) =>
            item.value === collection
        ),
      [categoryCollections, collection]
    );

  let recommendedLeadTime:
    | number
    | null = null;

  if (category === "flowers") {
    recommendedLeadTime =
      selectedCollection?.leadTimeDays ??
      3;
  }

  if (category === "custom") {
    recommendedLeadTime = 2;
  }

  if (category === "gators") {
    recommendedLeadTime = 2;
  }

  if (
    category === "shirts" &&
    (customizable || madeToOrder)
  ) {
    recommendedLeadTime = 2;
  }

  function handleCategoryChange(
    nextCategory: Category
  ) {
    setCategory(nextCategory);
    setCollection("");

    if (nextCategory === "flowers") {
      setMadeToOrder(true);
      setReadyMade(false);
      return;
    }

    if (nextCategory === "custom") {
      setMadeToOrder(true);
      setReadyMade(false);
      return;
    }

    if (nextCategory === "gators") {
      setMadeToOrder(false);
      setReadyMade(true);
      return;
    }

    if (nextCategory === "shirts") {
      setMadeToOrder(false);
      setReadyMade(true);
      setCustomizable(false);
      return;
    }

    if (nextCategory === "candles") {
      setMadeToOrder(false);
      setReadyMade(true);
    }
  }

  return (
    <form
      action={createProduct}
      className="mt-8 space-y-6"
    >
      <section className="rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
            Step 1
          </p>

          <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
            Basic Information
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#607068]">
            Start with the product name and where
            it belongs in the storefront.
          </p>
        </div>

        <div className="mt-6 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Product Name *
            </span>

            <input
              type="text"
              name="name"
              required
              placeholder="Example: Autumn Rose Arrangement"
              className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold">
                Category *
              </span>

              <select
                name="category"
                required
                value={category}
                onChange={(event) =>
                  handleCategoryChange(
                    event.target
                      .value as Category
                  )
                }
                className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none focus:border-[#e76d61]"
              >
                <option value="">
                  Choose category
                </option>
                <option value="flowers">
                  Fresh Flowers
                </option>
                <option value="candles">
                  Candles
                </option>
                <option value="custom">
                  Custom Items
                </option>
                <option value="shirts">
                  Shirts
                </option>
                <option value="gators">
                  Gator Gear
                </option>
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
                disabled={!category}
                onChange={(event) =>
                  setCollection(
                    event.target.value
                  )
                }
                className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none focus:border-[#e76d61] disabled:bg-[#f2f0ec]"
              >
                <option value="">
                  {category
                    ? "Choose collection"
                    : "Choose category first"}
                </option>

                {categoryCollections.map(
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
              Short Description
            </span>

            <input
              type="text"
              name="short_description"
              placeholder="Short description shown on product cards"
              className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Full Description
            </span>

            <textarea
              name="description"
              rows={5}
              placeholder="Describe the product, materials, style, or anything the customer should know."
              className="resize-y rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
            />
          </label>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
          Step 2
        </p>

        <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
          Pricing & Product Type
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Base Price
            </span>

            <div className="flex overflow-hidden rounded-xl border border-[#284239]/15 bg-white focus-within:border-[#e76d61]">
              <span className="flex items-center border-r border-[#284239]/10 px-4 text-[#718078]">
                $
              </span>

              <input
                type="number"
                name="base_price"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="min-w-0 flex-1 px-4 py-3 outline-none"
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
              className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
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
                Already made and available
                for purchase.
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
                Created after the customer
                orders.
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
                Allows personalization or
                customer-selected details.
              </span>
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
          Step 3
        </p>

        <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
          Fulfillment & Preparation
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
        </div>

        <div className="mt-5 rounded-xl bg-[#edf3e7] p-5">
          <p className="text-sm font-semibold text-[#153f32]">
            Preparation Time
          </p>

          {recommendedLeadTime !== null ? (
            <>
              <p className="mt-2 text-sm leading-6 text-[#52655d]">
                Based on this product type,
                Port Petals recommends{" "}
                <strong>
                  {recommendedLeadTime} blocked
                  preparation day
                  {recommendedLeadTime === 1
                    ? ""
                    : "s"}
                </strong>
                .
              </p>

              <input
                type="hidden"
                name="lead_time_days"
                value={
                  recommendedLeadTime
                }
              />
            </>
          ) : (
            <>
              <p className="mt-2 text-sm leading-6 text-[#52655d]">
                This product does not require a
                default preparation time. You
                can set one later if needed.
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

      <section className="rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
          Step 4
        </p>

        <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
          Inventory & Storefront
        </h2>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
                Enable this for products with
                limited physical stock.
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
              className="rounded-lg border border-[#284239]/15 px-3 py-2 outline-none focus:border-[#e76d61]"
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

      <section className="rounded-[1.75rem] border border-[#e76d61]/20 bg-[#fff7f4] p-6">
        <h2 className="font-serif text-xl font-semibold text-[#153f32]">
          What happens next?
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#607068]">
          The product will be created as a
          draft. You will then add its images,
          variants, inventory details, and
          review everything before publishing
          it to the storefront.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/admin/products"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#284239]/15 bg-white px-6 py-3 font-semibold text-[#284239]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
          >
            Create Product & Continue →
          </button>
        </div>
      </section>
    </form>
  );
}
