"use client";

import { useMemo, useState } from "react";

type ShirtVariantOption = {
  id: string;
  name: string;
  garmentType: string | null;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number | null;
  trackInventory: boolean;
};

type ShirtOrderConfiguratorProps = {
  productName: string;
  basePrice: number;
  baseQuantity: number | null;
  baseTrackInventory: boolean;
  variants: ShirtVariantOption[];
  presetDesign: boolean;
  personalizable: boolean;
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
  }).format(price);
}

function formatGarmentType(value: string | null | undefined) {
  switch (value) {
    case "t-shirt":
      return "T-Shirt";
    case "crewneck":
      return "Crewneck";
    case "hoodie":
      return "Hoodie";
    default:
      return value ?? "";
  }
}

export default function ShirtOrderConfigurator({
  productName,
  basePrice,
  baseQuantity,
  baseTrackInventory,
  variants,
  presetDesign,
  personalizable,
  pickupAvailable,
  deliveryAvailable,
}: ShirtOrderConfiguratorProps) {
  const hasVariants = variants.length > 0;

  const structuredShirtVariants = variants.some(
    (variant) => variant.garmentType
  );

  const firstVariant = variants[0];

  const [selectedVariantId, setSelectedVariantId] = useState(
    firstVariant?.id ?? ""
  );

  const [selectedGarmentType, setSelectedGarmentType] = useState(
    firstVariant?.garmentType ?? ""
  );

  const [selectedColor, setSelectedColor] = useState(
    firstVariant?.color ?? ""
  );

  const [selectedSize, setSelectedSize] = useState(
    firstVariant?.size ?? ""
  );

  const [fulfillment, setFulfillment] =
    useState<FulfillmentType>("pickup");

  const [deliveryArea, setDeliveryArea] =
    useState<DeliveryArea>("");

  const garmentOptions = useMemo(() => {
    const map = new Map<
      string,
      {
        value: string;
        label: string;
        price: number;
      }
    >();

    for (const variant of variants) {
      if (!variant.garmentType) {
        continue;
      }

      const existing = map.get(variant.garmentType);

      if (!existing || variant.price < existing.price) {
        map.set(variant.garmentType, {
          value: variant.garmentType,
          label: formatGarmentType(variant.garmentType),
          price: variant.price,
        });
      }
    }

    return Array.from(map.values());
  }, [variants]);

  const colorOptions = useMemo(() => {
    return Array.from(
      new Set(
        variants
          .filter(
            (variant) =>
              !structuredShirtVariants ||
              variant.garmentType === selectedGarmentType
          )
          .map((variant) => variant.color)
          .filter((color): color is string => Boolean(color))
      )
    );
  }, [
    variants,
    structuredShirtVariants,
    selectedGarmentType,
  ]);

  const sizeOptions = useMemo(() => {
    return Array.from(
      new Set(
        variants
          .filter(
            (variant) =>
              (!structuredShirtVariants ||
                variant.garmentType === selectedGarmentType) &&
              (!selectedColor ||
                variant.color === selectedColor)
          )
          .map((variant) => variant.size)
          .filter((size): size is string => Boolean(size))
      )
    );
  }, [
    variants,
    structuredShirtVariants,
    selectedGarmentType,
    selectedColor,
  ]);

  const selectedVariant = structuredShirtVariants
    ? variants.find(
        (variant) =>
          variant.garmentType === selectedGarmentType &&
          variant.color === selectedColor &&
          variant.size === selectedSize
      )
    : variants.find(
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

  return (
    <div className="mt-8 border-t border-[#284239]/10 pt-7">
      {hasVariants && structuredShirtVariants && (
        <div className="space-y-5">
          <fieldset>
            <legend className="text-sm font-semibold text-[#153f32]">
              What kind of shirt would you like?
            </legend>

            <div className="mt-2 flex flex-wrap gap-2">
              {garmentOptions.map((garment) => {
                const selected =
                  selectedGarmentType === garment.value;

                return (
                  <button
                    key={garment.value}
                    type="button"
                    onClick={() => {
                      const firstMatch = variants.find(
                        (variant) =>
                          variant.garmentType ===
                          garment.value
                      );

                      setSelectedGarmentType(
                        garment.value
                      );

                      if (firstMatch) {
                        setSelectedColor(
                          firstMatch.color ?? ""
                        );
                        setSelectedSize(
                          firstMatch.size ?? ""
                        );
                      }
                    }}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      selected
                        ? "border-[#e76d61] bg-[#fff4f1] text-[#b94f45]"
                        : "border-[#284239]/15 bg-white text-[#284239] hover:border-[#e76d61]/50"
                    }`}
                  >
                    {garment.label}{" "}
                    <span className="font-normal">
                      {formatPrice(garment.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-[#153f32]">
              Choose a color
            </legend>

            <div className="mt-2 flex flex-wrap gap-2">
              {colorOptions.map((color) => {
                const selected =
                  selectedColor === color;

                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      const firstMatch = variants.find(
                        (variant) =>
                          variant.garmentType ===
                            selectedGarmentType &&
                          variant.color === color
                      );

                      setSelectedColor(color);

                      if (firstMatch) {
                        setSelectedSize(
                          firstMatch.size ?? ""
                        );
                      }
                    }}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      selected
                        ? "border-[#e76d61] bg-[#fff4f1] text-[#b94f45]"
                        : "border-[#284239]/15 bg-white text-[#284239] hover:border-[#e76d61]/50"
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-[#153f32]">
              Choose a size
            </legend>

            <div className="mt-2 flex flex-wrap gap-2">
              {sizeOptions.map((size) => {
                const variant = variants.find(
                  (item) =>
                    item.garmentType ===
                      selectedGarmentType &&
                    item.color === selectedColor &&
                    item.size === size
                );

                const optionSoldOut =
                  variant?.trackInventory === true &&
                  variant.quantity !== null &&
                  variant.quantity <= 0;

                const selected =
                  selectedSize === size;

                return (
                  <button
                    key={size}
                    type="button"
                    disabled={optionSoldOut}
                    onClick={() =>
                      setSelectedSize(size)
                    }
                    className={`min-w-12 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      optionSoldOut
                        ? "cursor-not-allowed border-[#284239]/10 bg-[#f2f0ec] text-[#8a948e] opacity-60"
                        : selected
                          ? "border-[#e76d61] bg-[#fff4f1] text-[#b94f45]"
                          : "border-[#284239]/15 bg-white text-[#284239] hover:border-[#e76d61]/50"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      )}

      {hasVariants && !structuredShirtVariants && (
        <fieldset>
          <legend className="text-sm font-semibold text-[#153f32]">
            Choose Size / Option
          </legend>

          <div className="mt-3 flex flex-wrap gap-2">
            {variants.map((variant) => {
              const selected =
                selectedVariantId === variant.id;

              const variantSoldOut =
                variant.trackInventory &&
                variant.quantity !== null &&
                variant.quantity <= 0;

              return (
                <label
                  key={variant.id}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    variantSoldOut
                      ? "cursor-not-allowed border-[#284239]/10 bg-[#f2f0ec] opacity-60"
                      : selected
                        ? "cursor-pointer border-[#e76d61] bg-[#fff4f1]"
                        : "cursor-pointer border-[#284239]/15 bg-white hover:border-[#e76d61]/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="shirtVariant"
                    value={variant.id}
                    checked={selected}
                    disabled={variantSoldOut}
                    onChange={() =>
                      setSelectedVariantId(variant.id)
                    }
                    className="sr-only"
                  />

                  <span className="font-semibold">
                    {variant.size || variant.name}
                  </span>

                  {variant.color && (
                    <span className="ml-2 text-xs text-[#718078]">
                      {variant.color}
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
              ? "Currently sold out"
              : `${baseQuantity} currently available`}
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
              {structuredShirtVariants
                ? [
                    formatGarmentType(
                      selectedVariant?.garmentType
                    ),
                    selectedVariant?.color,
                    selectedVariant?.size,
                  ]
                    .filter(Boolean)
                    .join(" / ")
                : selectedVariant?.size ||
                  selectedVariant?.name}
              :
            </span>{" "}
            {soldOut
              ? "Currently sold out"
              : `${selectedQuantity} currently available`}
          </div>
        )}

      {presetDesign && (
        <div className="mt-6 rounded-xl bg-[#f5efe6] p-4">
          <p className="text-sm font-semibold text-[#153f32]">
            Preset Screen-Printed Design
          </p>

          <p className="mt-2 text-sm leading-6 text-[#607068]">
            This shirt uses one of Port Petals&apos; available preset
            screen-print designs. Custom artwork is not currently offered
            through the online catalog.
          </p>
        </div>
      )}

      {personalizable && (
        <section className="mt-6 rounded-xl border border-[#284239]/10 bg-[#faf7f1] p-4">
          <div>
            <p className="text-sm font-semibold text-[#153f32]">
              Personalization
            </p>

            <p className="mt-1 text-xs leading-5 text-[#718078]">
              Enter the player name and number you would like added to
              this sports shirt.
            </p>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Player Name
              </span>

              <input
                type="text"
                name="playerName"
                required
                maxLength={30}
                placeholder="Example: Easton"
                className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none transition placeholder:text-[#8a948e] focus:border-[#e76d61]"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Player Number
              </span>

              <input
                type="text"
                name="playerNumber"
                required
                maxLength={3}
                inputMode="numeric"
                placeholder="Example: 33"
                className="rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none transition placeholder:text-[#8a948e] focus:border-[#e76d61]"
              />
            </label>
          </div>
        </section>
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

          {selectedVariant && (
            <p className="mt-1 text-xs text-[#718078]">
              Selected:{" "}
              {structuredShirtVariants
                ? [
                    formatGarmentType(
                      selectedVariant.garmentType
                    ),
                    selectedVariant.color,
                    selectedVariant.size,
                  ]
                    .filter(Boolean)
                    .join(" / ")
                : selectedVariant.size ||
                  selectedVariant.name}
            </p>
          )}
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
          {presetDesign && !structuredShirtVariants && (
            <label className="grid gap-2">
              <span className="text-sm font-semibold">
                Preferred Shirt Color
              </span>

              <input
                type="text"
                name="shirtColor"
                placeholder="Example: black, white, gray"
                className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none focus:border-[#e76d61]"
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
            ? "Selected Size Sold Out"
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
