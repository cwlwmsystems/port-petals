"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useCart } from "@/components/CartProvider";

type FlowerOption = {
  id: string | null;
  name: string;
  price: number;
  quantity?: number | null;
  trackInventory?: boolean;
};

type FlowerOrderConfiguratorProps = {
  productId: string;
  productSlug: string;
  productName: string;
  imageUrl: string | null;
  options: FlowerOption[];
  pickupAvailable: boolean;
  deliveryAvailable: boolean;
  allowsCardMessage: boolean;
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

export default function FlowerOrderConfigurator({
  productId,
  productSlug,
  productName,
  imageUrl,
  options,
  pickupAvailable,
  deliveryAvailable,
  allowsCardMessage,
}: FlowerOrderConfiguratorProps) {
  const { addItem } = useCart();

  const [added, setAdded] = useState(false);

  const [selectedOption, setSelectedOption] =
    useState(options[0]?.name ?? "");

  const [fulfillment, setFulfillment] =
    useState<FulfillmentType>("pickup");

  const [deliveryArea, setDeliveryArea] =
    useState<DeliveryArea>("");

  const selectedOptionData = options.find(
    (option) => option.name === selectedOption
  );

  const selectedPrice =
    selectedOptionData?.price ?? 0;

  const selectedTracksInventory =
    selectedOptionData?.trackInventory ?? false;

  const selectedQuantity =
    selectedOptionData?.quantity ?? null;

  const soldOut =
    selectedTracksInventory &&
    selectedQuantity !== null &&
    selectedQuantity <= 0;

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

  const estimatedTotal =
    selectedPrice + deliveryFee;

  const deliveryAreaRequired =
    fulfillment === "delivery";

  const readyToAdd =
    Boolean(selectedOptionData) &&
    !soldOut &&
    (!deliveryAreaRequired ||
      deliveryArea !== "");

  function handleAddToCart(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!readyToAdd || !selectedOptionData) {
      return;
    }

    const formData = new FormData(
      event.currentTarget
    );

    const customization: Record<
      string,
      string
    > = {};

    customization.Option =
      selectedOptionData.name;

    for (const key of [
      "preferredColors",
      "cardMessage",
      "recipientName",
      "deliveryAddress",
      "specialInstructions",
    ]) {
      const value = String(
        formData.get(key) ?? ""
      ).trim();

      if (value) {
        customization[key] = value;
      }
    }

    addItem({
      productId,
      variantId: selectedOptionData.id,
      productName,
      slug: productSlug,
      productPath: `/flowers/${productSlug}`,
      imageUrl,
      unitPrice: selectedPrice,
      customization,
    });

    setAdded(true);
  }

  return (
    <form
      onSubmit={handleAddToCart}
      className="mt-7 border-t border-[#284239]/10 pt-6 sm:mt-8 sm:pt-7"
    >
      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
              Step 1
            </p>

            <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32] sm:text-2xl">
              Choose your arrangement
            </h2>
          </div>
        </div>

        <fieldset className="mt-4">
          <legend className="sr-only">
            Choose Your Option
          </legend>

          <div
            className={`grid gap-3 ${
              options.length >= 3
                ? "sm:grid-cols-3"
                : "sm:grid-cols-2"
            }`}
          >
            {options.map((option) => {
              const selected =
                selectedOption === option.name;

              const optionSoldOut =
                option.trackInventory &&
                option.quantity !== null &&
                option.quantity !==
                  undefined &&
                option.quantity <= 0;

              return (
                <label
                  key={option.name}
                  className={`flex min-h-[82px] cursor-pointer items-center justify-between gap-4 rounded-2xl border px-4 py-4 transition active:scale-[0.99] ${
                    optionSoldOut
                      ? "cursor-not-allowed border-[#284239]/10 bg-[#f2f0ec] opacity-60"
                      : selected
                        ? "border-[#e76d61] bg-[#fff4f1] shadow-sm ring-1 ring-[#e76d61]/20"
                        : "border-[#284239]/15 bg-white hover:border-[#e76d61]/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="flowerOption"
                    value={option.name}
                    checked={selected}
                    disabled={optionSoldOut}
                    onChange={() => {
                      setSelectedOption(
                        option.name
                      );
                      setAdded(false);
                    }}
                    className="sr-only"
                  />

                  <span className="min-w-0">
                    <span className="block font-semibold leading-5 text-[#153f32]">
                      {option.name}
                    </span>

                    {option.trackInventory &&
                      option.quantity !==
                        null &&
                      option.quantity !==
                        undefined && (
                        <span
                          className={`mt-1 block text-xs font-semibold ${
                            option.quantity > 0
                              ? "text-[#607068]"
                              : "text-[#a7473f]"
                          }`}
                        >
                          {option.quantity > 0
                            ? option.quantity <= 3
                              ? "Low Stock"
                              : "In Stock"
                            : "Sold Out"}
                        </span>
                      )}
                  </span>

                  <span className="shrink-0 text-lg font-semibold text-[#e76d61]">
                    {formatPrice(option.price)}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </section>

      {selectedTracksInventory &&
        selectedQuantity !== null && (
          <div
            className={`mt-4 rounded-xl px-4 py-3 text-sm ${
              soldOut
                ? "bg-[#fff0ed] text-[#a7473f]"
                : "bg-[#edf3e7] text-[#36594c]"
            }`}
          >
            <span className="font-semibold">
              {selectedOption}:
            </span>{" "}
            {soldOut
              ? "Sold Out"
              : selectedQuantity <= 3
                ? "Low Stock"
                : "In Stock"}
          </div>
        )}

      <section className="mt-7 border-t border-[#284239]/10 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
          Step 2
        </p>

        <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32] sm:text-2xl">
          Pickup or delivery
        </h2>

        <fieldset className="mt-4">
          <legend className="sr-only">
            Pickup or Delivery
          </legend>

          <div className="grid gap-3 sm:grid-cols-2">
            {pickupAvailable && (
              <label
                className={`flex min-h-[86px] cursor-pointer items-center rounded-2xl border px-4 py-4 transition active:scale-[0.99] ${
                  fulfillment === "pickup"
                    ? "border-[#e76d61] bg-[#fff4f1] shadow-sm ring-1 ring-[#e76d61]/20"
                    : "border-[#284239]/15 bg-white hover:border-[#e76d61]/50"
                }`}
              >
                <input
                  type="radio"
                  name="fulfillment"
                  value="pickup"
                  checked={
                    fulfillment === "pickup"
                  }
                  onChange={() => {
                    setFulfillment("pickup");
                    setDeliveryArea("");
                    setAdded(false);
                  }}
                  className="sr-only"
                />

                <span>
                  <span className="block font-semibold text-[#153f32]">
                    Pickup
                  </span>

                  <span className="mt-1 block text-sm leading-5 text-[#607068]">
                    430 E Arnold Avenue
                    <br />
                    Port Allegany
                  </span>
                </span>
              </label>
            )}

            {deliveryAvailable && (
              <label
                className={`flex min-h-[86px] cursor-pointer items-center rounded-2xl border px-4 py-4 transition active:scale-[0.99] ${
                  fulfillment === "delivery"
                    ? "border-[#e76d61] bg-[#fff4f1] shadow-sm ring-1 ring-[#e76d61]/20"
                    : "border-[#284239]/15 bg-white hover:border-[#e76d61]/50"
                }`}
              >
                <input
                  type="radio"
                  name="fulfillment"
                  value="delivery"
                  checked={
                    fulfillment ===
                    "delivery"
                  }
                  onChange={() => {
                    setFulfillment(
                      "delivery"
                    );
                    setAdded(false);
                  }}
                  className="sr-only"
                />

                <span>
                  <span className="block font-semibold text-[#153f32]">
                    Local Delivery
                  </span>

                  <span className="mt-1 block text-sm leading-5 text-[#607068]">
                    Delivery fee based on
                    destination
                  </span>
                </span>
              </label>
            )}
          </div>
        </fieldset>

        {fulfillment === "delivery" && (
          <div className="mt-4 rounded-2xl bg-[#f5efe6] p-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Delivery Area *
              </span>

              <select
                name="deliveryArea"
                required
                value={deliveryArea}
                onChange={(event) => {
                  setDeliveryArea(
                    event.target
                      .value as DeliveryArea
                  );
                  setAdded(false);
                }}
                className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none focus:border-[#e76d61]"
              >
                <option value="">
                  Choose delivery area
                </option>

                <option value="within-3">
                  Within 3 miles — Free
                </option>

                <option value="three-to-eight">
                  Over 3 miles and up to 8 miles
                  — $10
                </option>

                <option value="smethport-eldred">
                  Smethport or Eldred — $15
                </option>
              </select>
            </label>
          </div>
        )}
      </section>

      <section className="mt-7 border-t border-[#284239]/10 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
          Step 3
        </p>

        <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32] sm:text-2xl">
          Add any special details
        </h2>

        <details className="mt-4 rounded-2xl border border-[#284239]/10 bg-white">
          <summary className="flex min-h-14 cursor-pointer items-center px-5 py-4 font-semibold text-[#153f32]">
            Optional arrangement details
          </summary>

          <div className="grid gap-5 border-t border-[#284239]/10 p-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold">
                Preferred Colors
              </span>

              <input
                type="text"
                name="preferredColors"
                placeholder="Example: pink and white"
                className="min-h-12 rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 text-base outline-none focus:border-[#e76d61]"
              />
            </label>

            {allowsCardMessage && (
              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Card Message
                </span>

                <textarea
                  name="cardMessage"
                  rows={4}
                  placeholder="What would you like the card to say?"
                  className="resize-y rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 text-base outline-none focus:border-[#e76d61]"
                />
              </label>
            )}

            {fulfillment ===
              "delivery" && (
              <>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">
                    Recipient Name
                  </span>

                  <input
                    type="text"
                    name="recipientName"
                    className="min-h-12 rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 text-base outline-none focus:border-[#e76d61]"
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
                    className="min-h-12 rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 text-base outline-none focus:border-[#e76d61]"
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
                className="resize-y rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 text-base outline-none focus:border-[#e76d61]"
              />
            </label>
          </div>
        </details>
      </section>

      <section className="mt-7 rounded-2xl border border-[#284239]/10 bg-[#fffaf3] p-4 sm:p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#718078]">
              Estimated Total
            </p>

            <p className="mt-1 text-xs leading-5 text-[#718078]">
              {selectedOption || "Choose an option"}
              {fulfillment === "delivery" &&
                deliveryArea !== "" && (
                  <>
                    {" "}
                    · Includes delivery
                  </>
                )}
            </p>
          </div>

          <p className="shrink-0 text-2xl font-semibold text-[#e76d61] sm:text-3xl">
            {formatPrice(estimatedTotal)}
          </p>
        </div>

        {fulfillment === "delivery" &&
          deliveryArea === "" && (
            <p className="mt-3 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm leading-5 text-[#a7473f]">
              Choose a delivery area before adding
              this item to your cart.
            </p>
          )}

        <button
          type="submit"
          disabled={!readyToAdd}
          className="mt-4 flex min-h-14 w-full items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#d85b50] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#d9d5ce] disabled:text-[#7a7a76] disabled:shadow-none"
        >
          {soldOut
            ? "Sold Out"
            : "Add to Cart"}
        </button>

        {added && (
          <div className="mt-4 rounded-xl bg-[#edf3e7] p-4 text-center">
            <p className="text-sm font-semibold text-[#31583b]">
              Added to your cart.
            </p>

            <Link
              href="/cart"
              className="mt-2 inline-flex min-h-10 items-center justify-center text-sm font-semibold text-[#e76d61] underline underline-offset-4"
            >
              Go to Cart →
            </Link>
          </div>
        )}
      </section>
    </form>
  );
}
