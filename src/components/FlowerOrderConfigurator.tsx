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

  const selectedPrice = selectedOptionData?.price ?? 0;

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

  const estimatedTotal = selectedPrice + deliveryFee;

  function handleAddToCart(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selectedOptionData || soldOut) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    const customization: Record<string, string> = {};

    for (const key of [
      "preferredColors",
      "cardMessage",
      "recipientName",
      "deliveryAddress",
      "specialInstructions",
    ]) {
      const value = String(formData.get(key) ?? "").trim();

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
      className="mt-8 border-t border-[#284239]/10 pt-7"
    >
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
                  name="flowerOption"
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
                        ? option.quantity <= 3
                          ? "Low Stock"
                          : "In Stock"
                        : "Sold Out"}
                    </span>
                  )}
              </label>
            );
          })}
        </div>
      </fieldset>

      {selectedTracksInventory &&
        selectedQuantity !== null && (
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
              ? "Sold Out"
              : selectedQuantity !== null && selectedQuantity <= 3
                ? "Low Stock"
                : "In Stock"}
          </div>
        )}

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
                setDeliveryArea(
                  event.target.value as DeliveryArea
                )
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
              Preferred Colors
            </span>

            <input
              type="text"
              name="preferredColors"
              placeholder="Example: pink and white"
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
        <button
          type="submit"
          disabled={soldOut || !selectedOptionData}
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#e76d61] px-7 py-4 text-base font-semibold text-white shadow-md transition hover:bg-[#d85b50] disabled:cursor-not-allowed disabled:bg-[#9b9b96]"
        >
          {soldOut
            ? "Sold Out"
            : "Add to Cart"}
        </button>

        {added && (
          <div className="mt-3 flex items-center justify-center gap-3 text-sm font-semibold">
            <span className="text-[#36594c]">
              Added to cart.
            </span>

            <Link
              href="/cart"
              className="text-[#e76d61] underline underline-offset-4 transition hover:text-[#d85b50]"
            >
              Go to Cart →
            </Link>
          </div>
        )}
      </div>
    </form>
  );
}
