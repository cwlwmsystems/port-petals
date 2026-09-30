"use client";

import { useMemo, useState } from "react";

type FlowerSize = {
  name: string;
  price: number;
};

type FlowerOrderConfiguratorProps = {
  productName: string;
  sizes: FlowerSize[];
  allowsCardMessage: boolean;
  pickupAvailable: boolean;
  deliveryAvailable: boolean;
};

type FulfillmentType = "pickup" | "delivery";

type DeliveryArea =
  | ""
  | "within-3"
  | "three-to-eight"
  | "smethport-eldred";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}

function getMinimumDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function FlowerOrderConfigurator({
  productName,
  sizes,
  allowsCardMessage,
  pickupAvailable,
  deliveryAvailable,
}: FlowerOrderConfiguratorProps) {
  const [selectedSize, setSelectedSize] = useState(sizes[0]?.name ?? "");
  const [fulfillment, setFulfillment] =
    useState<FulfillmentType>("pickup");
  const [deliveryArea, setDeliveryArea] =
    useState<DeliveryArea>("");

  const selectedSizeData = sizes.find(
    (size) => size.name === selectedSize
  );

  const flowerPrice = selectedSizeData?.price ?? 0;

  const deliveryFee = useMemo(() => {
    if (fulfillment !== "delivery") {
      return 0;
    }

    switch (deliveryArea) {
      case "within-3":
        return 0;
      case "three-to-eight":
        return 10;
      case "smethport-eldred":
        return 15;
      default:
        return 0;
    }
  }, [fulfillment, deliveryArea]);

  const estimatedTotal = flowerPrice + deliveryFee;

  return (
    <div className="mt-8 border-t border-[#284239]/10 pt-7">
      {/* SIZE */}
      <fieldset>
        <legend className="text-sm font-semibold text-[#153f32]">
          Choose Your Option
        </legend>

        <div
          className={`mt-3 grid gap-3 ${
            sizes.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
          }`}
        >
          {sizes.map((size) => {
            const selected = selectedSize === size.name;

            return (
              <label
                key={size.name}
                className={`cursor-pointer rounded-xl border px-4 py-3 transition ${
                  selected
                    ? "border-[#e76d61] bg-[#fff4f1] shadow-sm"
                    : "border-[#284239]/15 bg-white hover:border-[#e76d61]/50"
                }`}
              >
                <input
                  type="radio"
                  name="flowerSize"
                  value={size.name}
                  checked={selected}
                  onChange={() => setSelectedSize(size.name)}
                  className="sr-only"
                />

                <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#52655d]">
                  {size.name}
                </span>

                <span className="mt-1 block text-lg font-semibold text-[#153f32]">
                  {formatPrice(size.price)}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* DATE */}
      <div className="mt-6">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#153f32]">
            Requested Date *
          </span>

          <input
            type="date"
            name="requestedDate"
            min={getMinimumDate()}
            required
            className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
          />
        </label>

        <p className="mt-2 text-xs leading-5 text-[#718078]">
          Orders require at least 7 days&apos; advance notice. Requested dates
          are subject to confirmation.
        </p>
      </div>

      {/* FULFILLMENT */}
      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-[#153f32]">
          Pickup or Delivery
        </legend>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {pickupAvailable && (
            <label
              className={`cursor-pointer rounded-xl border px-4 py-3 transition ${
                fulfillment === "pickup"
                  ? "border-[#e76d61] bg-[#fff4f1]"
                  : "border-[#284239]/15 bg-white hover:border-[#e76d61]/50"
              }`}
            >
              <input
                type="radio"
                name="fulfillment"
                value="pickup"
                checked={fulfillment === "pickup"}
                onChange={() => {
                  setFulfillment("pickup");
                  setDeliveryArea("");
                }}
                className="sr-only"
              />

              <span className="font-semibold text-[#153f32]">
                Pickup
              </span>

              <span className="mt-1 block text-xs leading-5 text-[#607068]">
                430 E Arnold Avenue
              </span>
            </label>
          )}

          {deliveryAvailable && (
            <label
              className={`cursor-pointer rounded-xl border px-4 py-3 transition ${
                fulfillment === "delivery"
                  ? "border-[#e76d61] bg-[#fff4f1]"
                  : "border-[#284239]/15 bg-white hover:border-[#e76d61]/50"
              }`}
            >
              <input
                type="radio"
                name="fulfillment"
                value="delivery"
                checked={fulfillment === "delivery"}
                onChange={() => setFulfillment("delivery")}
                className="sr-only"
              />

              <span className="font-semibold text-[#153f32]">
                Local Delivery
              </span>

              <span className="mt-1 block text-xs leading-5 text-[#607068]">
                Delivery fee based on destination
              </span>
            </label>
          )}
        </div>
      </fieldset>

      {/* DELIVERY AREA */}
      {fulfillment === "delivery" && (
        <div className="mt-5 rounded-xl bg-[#f5efe6] p-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#153f32]">
              Delivery Area *
            </span>

            <select
              name="deliveryArea"
              required
              value={deliveryArea}
              onChange={(event) =>
                setDeliveryArea(event.target.value as DeliveryArea)
              }
              className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
            >
              <option value="">Choose delivery area</option>
              <option value="within-3">
                Within 3 miles — Free
              </option>
              <option value="three-to-eight">
                Over 3 miles and up to 8 miles — $10
              </option>
              <option value="smethport-eldred">
                Smethport or Eldred — $15
              </option>
            </select>
          </label>
        </div>
      )}

      {/* TOTAL */}
      <div className="mt-6 flex items-end justify-between gap-6 border-y border-[#284239]/10 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#718078]">
            Estimated Total
          </p>

          <p className="mt-1 text-xs text-[#718078]">
            Final total subject to confirmation
          </p>
        </div>

        <p className="text-3xl font-semibold text-[#e76d61]">
          {formatPrice(estimatedTotal)}
        </p>
      </div>

      {/* ADDITIONAL DETAILS */}
      <details className="mt-5 rounded-xl border border-[#284239]/10 bg-white">
        <summary className="cursor-pointer px-5 py-4 font-semibold text-[#153f32]">
          Additional Details
        </summary>

        <div className="grid gap-5 border-t border-[#284239]/10 p-5">
          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Preferred Colors
            </span>

            <input
              type="text"
              name="colorPreference"
              placeholder="Example: blush pink, white, and greenery"
              className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none focus:border-[#e76d61]"
            />
          </label>

          {allowsCardMessage && (
            <label className="grid gap-2">
              <span className="text-sm font-semibold">
                Card Message
              </span>

              <textarea
                name="cardMessage"
                rows={3}
                maxLength={250}
                placeholder="Add a short message..."
                className="resize-y rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none focus:border-[#e76d61]"
              />
            </label>
          )}

          {fulfillment === "delivery" && (
            <>
              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Recipient Name
                </span>

                <input
                  type="text"
                  name="recipientName"
                  className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Delivery Address
                </span>

                <input
                  type="text"
                  name="deliveryAddress"
                  placeholder="Street address, city, state, ZIP"
                  className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Recipient Phone
                </span>

                <input
                  type="tel"
                  name="recipientPhone"
                  className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>
            </>
          )}

          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Special Instructions
            </span>

            <textarea
              name="specialInstructions"
              rows={4}
              placeholder="Flower requests, occasion details, delivery notes, or anything else Port Petals should know..."
              className="resize-y rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none focus:border-[#e76d61]"
            />
          </label>
        </div>
      </details>

      {/* PRIMARY ACTION */}
      <div className="mt-6">
        <a
          href="tel:+18146421253"
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#e76d61] px-7 py-4 text-base font-semibold text-white shadow-md transition hover:bg-[#d85b50]"
        >
          Call to Order · 814-642-1253
        </a>

        <p className="mt-3 text-center text-xs leading-5 text-[#718078]">
          Online checkout will replace this button when Square ordering is
          connected.
        </p>
      </div>
    </div>
  );
}
