"use client";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useCart } from "@/components/CartProvider";

type CustomItemVariant = {
  id: string;
  name: string;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number | null;
  trackInventory: boolean;
};

type CustomItemConfiguratorProps = {
  productId: string;
  productSlug: string;
  productName: string;
  imageUrl: string | null;
  basePrice: number;
  baseQuantity: number | null;
  baseTrackInventory: boolean;
  variants: CustomItemVariant[];
  pickupAvailable: boolean;
  deliveryAvailable: boolean;
  personalizationAvailable: boolean;
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

export default function CustomItemConfigurator({
  productId,
  productSlug,
  productName,
  imageUrl,
  basePrice,
  baseQuantity,
  baseTrackInventory,
  variants,
  pickupAvailable,
  deliveryAvailable,
  personalizationAvailable,
}: CustomItemConfiguratorProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const hasVariants = variants.length > 0;

  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?.id ?? ""
  );

  const [fulfillment, setFulfillment] =
    useState<FulfillmentType>("pickup");

  const [deliveryArea, setDeliveryArea] =
    useState<DeliveryArea>("");

  const selectedVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  );

  const selectedPrice = selectedVariant?.price ?? basePrice;

  const selectedTracksInventory = hasVariants
    ? selectedVariant?.trackInventory ?? false
    : baseTrackInventory;

  const selectedQuantity = hasVariants
    ? selectedVariant?.quantity ?? null
    : baseQuantity;

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

    if (soldOut) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const customization: Record<string, string> = {};

    if (selectedVariant) {
      customization.Option = selectedVariant.name;
    }

    for (const [field, label] of [
      ["personalization", "Personalization"],
      ["number", "Number"],
      ["year", "Year"],
      ["theme", "Colors / Theme"],
      ["idea", "Design Idea"],
      ["recipientName", "Recipient Name"],
      ["deliveryAddress", "Delivery Address"],
      ["specialInstructions", "Special Instructions"],
    ]) {
      const value = String(
        formData.get(field) ?? ""
      ).trim();

      if (value) {
        customization[label] = value;
      }
    }

    addItem({
      productId,
      variantId: selectedVariant?.id ?? null,
      productName,
      slug: productSlug,
      productPath: `/custom/${productSlug}`,
      imageUrl,
      unitPrice: selectedPrice,
      size: selectedVariant?.size ?? null,
      color: selectedVariant?.color ?? null,
      customization,
    });

    setAdded(true);
  }

  return (
    <form
      onSubmit={handleAddToCart}
      className="mt-8 border-t border-[#284239]/10 pt-7"
    >
      {hasVariants && (
        <fieldset>
          <legend className="text-sm font-semibold text-[#153f32]">
            Choose Your Option
          </legend>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {variants.map((variant) => {
              const selected = selectedVariantId === variant.id;

              const variantSoldOut =
                variant.trackInventory &&
                variant.quantity !== null &&
                variant.quantity <= 0;

              return (
                <label
                  key={variant.id}
                  className={`rounded-xl border px-4 py-3 transition ${
                    variantSoldOut
                      ? "cursor-not-allowed border-[#284239]/10 bg-[#f2f0ec] opacity-60"
                      : selected
                        ? "cursor-pointer border-[#e76d61] bg-[#fff4f1] shadow-sm"
                        : "cursor-pointer border-[#284239]/15 bg-white hover:border-[#e76d61]/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="customItemVariant"
                    value={variant.id}
                    checked={selected}
                    disabled={variantSoldOut}
                    onChange={() =>
                      setSelectedVariantId(variant.id)
                    }
                    className="sr-only"
                  />

                  <span className="block font-semibold text-[#153f32]">
                    {variant.name}
                  </span>

                  {(variant.size || variant.color) && (
                    <span className="mt-1 block text-xs text-[#718078]">
                      {[variant.size, variant.color]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  )}

                  <span className="mt-2 block text-lg font-semibold text-[#e76d61]">
                    {formatPrice(variant.price)}
                  </span>

                  {variant.trackInventory &&
                    variant.quantity !== null && (
                      <span
                        className={`mt-2 block text-xs font-semibold ${
                          variant.quantity > 0
                            ? "text-[#607068]"
                            : "text-[#a7473f]"
                        }`}
                      >
                        {variant.quantity > 0
                          ? variant.quantity <= 3
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
      )}

      {!hasVariants &&
        baseTrackInventory &&
        baseQuantity !== null && (
          <div
            className={`rounded-xl px-4 py-3 text-sm ${
              soldOut
                ? "bg-[#fff0ed] text-[#a7473f]"
                : "bg-[#edf3e7] text-[#36594c]"
            }`}
          >
            <span className="font-semibold">Availability:</span>{" "}
            {soldOut
              ? "Sold Out"
              : baseQuantity !== null && baseQuantity <= 3
                ? "Low Stock"
                : "In Stock"}
          </div>
        )}

      {hasVariants &&
        selectedTracksInventory &&
        selectedQuantity !== null && (
          <div
            className={`mt-5 rounded-xl px-4 py-3 text-sm ${
              soldOut
                ? "bg-[#fff0ed] text-[#a7473f]"
                : "bg-[#edf3e7] text-[#36594c]"
            }`}
          >
            <span className="font-semibold">
              {selectedVariant?.name}:
            </span>{" "}
            {soldOut
              ? "Sold Out"
              : selectedQuantity !== null && selectedQuantity <= 3
                ? "Low Stock"
                : "In Stock"}
          </div>
        )}

      {personalizationAvailable && (
        <div className="mt-6 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#153f32]">
              Name or Wording
            </span>

            <input
              type="text"
              name="personalization"
              placeholder="Name, wording, phrase, or other personalization"
              className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none transition placeholder:text-[#8a948e] focus:border-[#e76d61]"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Number
              </span>

              <input
                type="text"
                name="number"
                placeholder="Example: 33"
                className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none focus:border-[#e76d61]"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Year
              </span>

              <input
                type="text"
                name="year"
                placeholder="Example: 2026"
                className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none focus:border-[#e76d61]"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#153f32]">
              Colors / Theme
            </span>

            <input
              type="text"
              name="theme"
              placeholder="Example: orange and black, Christmas, fall, floral"
              className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none focus:border-[#e76d61]"
            />
          </label>
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
            Estimated Starting Total
          </p>

          {selectedVariant && (
            <p className="mt-1 text-xs text-[#718078]">
              Selected: {selectedVariant.name}
            </p>
          )}

          <p className="mt-1 text-xs text-[#718078]">
            Final price may change based on approved design and materials.
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
              Tell Us About Your Idea
            </span>

            <textarea
              name="idea"
              rows={4}
              placeholder={`Describe how you would like your ${productName} made or personalized...`}
              className="resize-y rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none focus:border-[#e76d61]"
            />
          </label>

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
              placeholder="Anything else Port Petals should know?"
              className="resize-y rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none focus:border-[#e76d61]"
            />
          </label>
        </div>
      </details>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="submit"
          disabled={soldOut}
          className="inline-flex items-center justify-center rounded-xl bg-[#e76d61] px-7 py-4 text-base font-semibold text-white shadow-md transition hover:bg-[#d85b50] disabled:cursor-not-allowed disabled:bg-[#9b9b96]"
        >
          {soldOut
            ? "Sold Out"
            : "Add to Cart"}
        </button>

        <a
          href="/custom/request"
          className="inline-flex items-center justify-center rounded-xl border border-[#284239]/15 bg-white px-7 py-4 text-base font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
        >
          Start Custom Request
        </a>
      </div>

      {added && (
        <p className="mt-3 text-center text-sm font-semibold text-[#36594c]">
          Added to cart.
        </p>
      )}

      <p className="mt-3 text-center text-xs leading-5 text-[#718078]">
        Custom details entered above will be included with your order.
      </p>
    </form>
  );
}
