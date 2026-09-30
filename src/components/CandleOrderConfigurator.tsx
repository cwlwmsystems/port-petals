"use client";

import { useMemo, useState } from "react";

type CandleOption = {
  name: string;
  price: number;
  quantity?: number | null;
  trackInventory?: boolean;
};

type CandleOrderConfiguratorProps = {
  productName: string;
  options: CandleOption[];
  pickupAvailable: boolean;
  deliveryAvailable: boolean;
  allowsGiftMessage: boolean;
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
  }).format(price);
}

export default function CandleOrderConfigurator({
  productName,
  options,
  pickupAvailable,
  deliveryAvailable,
  allowsGiftMessage,
}: CandleOrderConfiguratorProps) {
  const [selectedOption, setSelectedOption] = useState(
    options[0]?.name ?? ""
  );

  const [fulfillment, setFulfillment] =
    useState<FulfillmentType>("pickup");

  const [deliveryArea, setDeliveryArea] =
    useState<DeliveryArea>("");

  const selectedOptionData = options.find(
    (option) => option.name === selectedOption
  );

  const basePrice = selectedOptionData?.price ?? 0;

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

  const estimatedTotal = basePrice + deliveryFee;

  const selectedTracksInventory =
    selectedOptionData?.trackInventory ?? false;

  const selectedQuantity =
    selectedOptionData?.quantity ?? null;

  const soldOut =
    selectedTracksInventory &&
    selectedQuantity !== null &&
    selectedQuantity <= 0;

  return (
    <div className="mt-8 border-t border-[#284239]/10 pt-7">
      <fieldset>
        <legend className="text-sm font-semibold text-[#153f32]">
          Choose Your Option
        </legend>

        <div
          className={`mt-3 grid gap-3 ${
            options.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
          }`}
        >
          {options.map((option) => {
            const selected = selectedOption === option.name;

            const optionSoldOut =
              option.trackInventory &&
              option.quantity !== null &&
              option.quantity !== undefined &&
              option.quantity <= 0;

            return (
              <label
                key={option.name}
                className={`rounded-xl border px-4 py-3 transition ${
                  optionSoldOut
                    ? "cursor-not-allowed border-[#284239]/10 bg-[#f2f0ec] opacity-60"
                    : selected
                      ? "cursor-pointer border-[#e76d61] bg-[#fff4f1] shadow-sm"
                      : "cursor-pointer border-[#284239]/15 bg-white hover:border-[#e76d61]/50"
                }`}
              >
                <input
                  type="radio"
                  name="candleOption"
                  value={option.name}
                  checked={selected}
                  disabled={optionSoldOut}
                  onChange={() => setSelectedOption(option.name)}
                  className="sr-only"
                />

                <span className="block text-sm font-semibold text-[#153f32]">
                  {option.name}
                </span>

                <span className="mt-1 block text-lg font-semibold text-[#e76d61]">
                  {formatPrice(option.price)}
                </span>

                {option.trackInventory &&
                  option.quantity !== null &&
                  option.quantity !== undefined && (
                    <span
                      className={`mt-2 block text-xs font-semibold ${
                        option.quantity > 0
                          ? "text-[#607068]"
                          : "text-[#a7473f]"
                      }`}
                    >
                      {option.quantity > 0
                        ? `${option.quantity} available`
                        : "Sold out"}
                    </span>
                  )}
              </label>
            );
          })}
        </div>
      </fieldset>

      {selectedTracksInventory && selectedQuantity !== null && (
        <div
          className={`mt-5 rounded-xl px-4 py-3 text-sm ${
            soldOut
              ? "bg-[#fff0ed] text-[#a7473f]"
              : "bg-[#edf3e7] text-[#36594c]"
          }`}
        >
          <span className="font-semibold">
            {selectedOption}:
          </span>{" "}
          {soldOut
            ? "Currently sold out"
            : `${selectedQuantity} currently available`}
        </div>
      )}

      <div className="mt-6">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#153f32]">
            Preferred Scent
          </span>

          <input
            type="text"
            name="preferredScent"
            placeholder="Tell us your preferred scent, if applicable"
            className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none transition placeholder:text-[#8a948e] focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
          />
        </label>
      </div>

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
              className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none focus:border-[#e76d61]"
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

      <div className="mt-6 flex items-end justify-between gap-6 border-y border-[#284239]/10 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#718078]">
            Estimated Total
          </p>

          <p className="mt-1 text-xs text-[#718078]">
            Selected: {selectedOption}
          </p>
        </div>

        <p className="text-3xl font-semibold text-[#e76d61]">
          {formatPrice(estimatedTotal)}
        </p>
      </div>

      <details className="mt-5 rounded-xl border border-[#284239]/10 bg-white">
        <summary className="cursor-pointer px-5 py-4 font-semibold text-[#153f32]">
          Additional Details
        </summary>

        <div className="grid gap-5 border-t border-[#284239]/10 p-5">
          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Color / Theme Preference
            </span>

            <input
              type="text"
              name="theme"
              className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none focus:border-[#e76d61]"
            />
          </label>

          {allowsGiftMessage && (
            <label className="grid gap-2">
              <span className="text-sm font-semibold">
                Gift Message
              </span>

              <textarea
                name="giftMessage"
                rows={3}
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
            </>
          )}

          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Special Instructions
            </span>

            <textarea
              name="specialInstructions"
              rows={4}
              placeholder={`Anything Port Petals should know about your ${productName}?`}
              className="resize-y rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none focus:border-[#e76d61]"
            />
          </label>
        </div>
      </details>

      <div className="mt-6">
        <a
          href="tel:+18146421253"
          aria-disabled={soldOut}
          className={`inline-flex w-full items-center justify-center rounded-xl px-7 py-4 text-base font-semibold text-white shadow-md transition ${
            soldOut
              ? "pointer-events-none bg-[#9b9b96]"
              : "bg-[#e76d61] hover:bg-[#d85b50]"
          }`}
        >
          {soldOut
            ? "Selected Option Sold Out"
            : "Call to Order · 814-642-1253"}
        </a>

        <p className="mt-3 text-center text-xs leading-5 text-[#718078]">
          Online checkout will replace this button when Square ordering is
          connected.
        </p>
      </div>
    </div>
  );
}
