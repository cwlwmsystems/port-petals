"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";

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
  productId: string;
  productSlug: string;
  productName: string;
  imageUrl: string | null;
  basePrice: number;
  baseQuantity: number | null;
  baseTrackInventory: boolean;
  variants: ShirtVariantOption[];
  initialVariantId?: string;
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

function formatGarmentType(
  value: string | null | undefined
) {
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
  productId,
  productSlug,
  productName,
  imageUrl,
  basePrice,
  baseQuantity,
  baseTrackInventory,
  variants,
  initialVariantId,
  presetDesign,
  personalizable,
  pickupAvailable,
  deliveryAvailable,
}: ShirtOrderConfiguratorProps) {
  const { addItem } = useCart();

  const hasVariants = variants.length > 0;

  const structuredShirtVariants = variants.some(
    (variant) => variant.garmentType
  );

  const firstVariant =
    variants.find(
      (variant) =>
        variant.id ===
        initialVariantId
    ) ??
    variants[0];

  const [selectedVariantId, setSelectedVariantId] =
    useState(firstVariant?.id ?? "");

  const [selectedGarmentType, setSelectedGarmentType] =
    useState(
      firstVariant?.garmentType ?? ""
    );

  const [selectedColor, setSelectedColor] =
    useState(firstVariant?.color ?? "");

  const [selectedSize, setSelectedSize] =
    useState(firstVariant?.size ?? "");

  const [playerName, setPlayerName] = useState("");
  const [playerNumber, setPlayerNumber] =
    useState("");

  const [addedToCart, setAddedToCart] =
    useState(false);

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

      const existing = map.get(
        variant.garmentType
      );

      if (
        !existing ||
        variant.price < existing.price
      ) {
        map.set(variant.garmentType, {
          value: variant.garmentType,
          label: formatGarmentType(
            variant.garmentType
          ),
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
              variant.garmentType ===
                selectedGarmentType
          )
          .map((variant) => variant.color)
          .filter(
            (color): color is string =>
              Boolean(color)
          )
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
                variant.garmentType ===
                  selectedGarmentType) &&
              (!selectedColor ||
                variant.color ===
                  selectedColor)
          )
          .map((variant) => variant.size)
          .filter(
            (size): size is string =>
              Boolean(size)
          )
      )
    );
  }, [
    variants,
    structuredShirtVariants,
    selectedGarmentType,
    selectedColor,
  ]);

  const selectedVariant =
    structuredShirtVariants
      ? variants.find(
          (variant) =>
            variant.garmentType ===
              selectedGarmentType &&
            variant.color === selectedColor &&
            variant.size === selectedSize
        )
      : variants.find(
          (variant) =>
            variant.id === selectedVariantId
        );

  const selectedPrice =
    selectedVariant?.price ?? basePrice;

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

  const estimatedTotal =
    selectedPrice + deliveryFee;

  const personalizationComplete =
    !personalizable ||
    (playerName.trim() !== "" &&
      playerNumber.trim() !== "");

  const readyToAdd =
    !soldOut &&
    personalizationComplete &&
    (!hasVariants ||
      Boolean(selectedVariant)) &&
    (fulfillment !== "delivery" ||
      deliveryArea !== "");

  function handleAddToCart() {
    if (!readyToAdd) {
      return;
    }

    addItem({
      productId,
      variantId:
        selectedVariant?.id ?? null,
      productName,
      slug: productSlug,
      productPath: `/shirts/${productSlug}`,
      imageUrl,
      unitPrice: selectedPrice,
      garmentType:
        selectedVariant?.garmentType ??
        null,
      size:
        selectedVariant?.size ?? null,
      color:
        selectedVariant?.color ?? null,
      playerName: personalizable
        ? playerName.trim()
        : null,
      playerNumber: personalizable
        ? playerNumber.trim()
        : null,
    });

    setAddedToCart(true);
  }

  return (
    <div className="mt-7 border-t border-[#284239]/10 pt-6 sm:mt-8 sm:pt-7">
      {hasVariants &&
        structuredShirtVariants && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
              Step 1
            </p>

            <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32] sm:text-2xl">
              Choose your shirt
            </h2>

            <div className="mt-4 space-y-6">
              <fieldset>
                <legend className="text-sm font-semibold text-[#153f32]">
                  Shirt Type
                </legend>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {garmentOptions.map(
                    (garment) => {
                      const selected =
                        selectedGarmentType ===
                        garment.value;

                      return (
                        <button
                          key={garment.value}
                          type="button"
                          onClick={() => {
                            const firstMatch =
                              variants.find(
                                (variant) =>
                                  variant.garmentType ===
                                  garment.value
                              );

                            setSelectedGarmentType(
                              garment.value
                            );

                            if (firstMatch) {
                              setSelectedColor(
                                firstMatch.color ??
                                  ""
                              );
                              setSelectedSize(
                                firstMatch.size ??
                                  ""
                              );
                            }

                            setAddedToCart(
                              false
                            );
                          }}
                          className={`min-h-[72px] rounded-2xl border px-4 py-3 text-left transition active:scale-[0.99] ${
                            selected
                              ? "border-[#e76d61] bg-[#fff4f1] shadow-sm ring-1 ring-[#e76d61]/20"
                              : "border-[#284239]/15 bg-white hover:border-[#e76d61]/50"
                          }`}
                        >
                          <span className="block font-semibold text-[#153f32]">
                            {garment.label}
                          </span>

                          <span className="mt-1 block text-sm text-[#e76d61]">
                            From{" "}
                            {formatPrice(
                              garment.price
                            )}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-semibold text-[#153f32]">
                  Color
                </legend>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {colorOptions.map(
                    (color) => {
                      const selected =
                        selectedColor === color;

                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            const firstMatch =
                              variants.find(
                                (variant) =>
                                  variant.garmentType ===
                                    selectedGarmentType &&
                                  variant.color ===
                                    color
                              );

                            setSelectedColor(
                              color
                            );

                            if (firstMatch) {
                              setSelectedSize(
                                firstMatch.size ??
                                  ""
                              );
                            }

                            setAddedToCart(
                              false
                            );
                          }}
                          className={`min-h-12 rounded-xl border px-4 py-3 text-sm font-semibold transition active:scale-[0.99] ${
                            selected
                              ? "border-[#e76d61] bg-[#fff4f1] text-[#b94f45]"
                              : "border-[#284239]/15 bg-white text-[#284239]"
                          }`}
                        >
                          {color}
                        </button>
                      );
                    }
                  )}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-semibold text-[#153f32]">
                  Size
                </legend>

                <div className="mt-3 grid grid-cols-3 gap-3 sm:flex sm:flex-wrap">
                  {sizeOptions.map(
                    (size) => {
                      const variant =
                        variants.find(
                          (item) =>
                            item.garmentType ===
                              selectedGarmentType &&
                            item.color ===
                              selectedColor &&
                            item.size === size
                        );

                      const optionSoldOut =
                        variant?.trackInventory ===
                          true &&
                        variant.quantity !==
                          null &&
                        variant.quantity <= 0;

                      const selected =
                        selectedSize === size;

                      return (
                        <button
                          key={size}
                          type="button"
                          disabled={
                            optionSoldOut
                          }
                          onClick={() => {
                            setSelectedSize(
                              size
                            );
                            setAddedToCart(
                              false
                            );
                          }}
                          className={`min-h-12 min-w-12 rounded-xl border px-4 py-3 text-sm font-semibold transition active:scale-[0.99] ${
                            optionSoldOut
                              ? "cursor-not-allowed border-[#284239]/10 bg-[#f2f0ec] text-[#8a948e] opacity-60"
                              : selected
                                ? "border-[#e76d61] bg-[#fff4f1] text-[#b94f45]"
                                : "border-[#284239]/15 bg-white text-[#284239]"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    }
                  )}
                </div>
              </fieldset>
            </div>
          </section>
        )}

      {hasVariants &&
        !structuredShirtVariants && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
              Step 1
            </p>

            <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32] sm:text-2xl">
              Choose your option
            </h2>

            <fieldset className="mt-4">
              <legend className="sr-only">
                Choose Size or Option
              </legend>

              <div className="grid gap-3 sm:grid-cols-2">
                {variants.map(
                  (variant) => {
                    const selected =
                      selectedVariantId ===
                      variant.id;

                    const variantSoldOut =
                      variant.trackInventory &&
                      variant.quantity !==
                        null &&
                      variant.quantity <= 0;

                    return (
                      <label
                        key={variant.id}
                        className={`flex min-h-[76px] cursor-pointer items-center justify-between rounded-2xl border px-4 py-4 transition active:scale-[0.99] ${
                          variantSoldOut
                            ? "cursor-not-allowed border-[#284239]/10 bg-[#f2f0ec] opacity-60"
                            : selected
                              ? "border-[#e76d61] bg-[#fff4f1] shadow-sm ring-1 ring-[#e76d61]/20"
                              : "border-[#284239]/15 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shirtVariant"
                          value={variant.id}
                          checked={selected}
                          disabled={
                            variantSoldOut
                          }
                          onChange={() => {
                            setSelectedVariantId(
                              variant.id
                            );
                            setAddedToCart(
                              false
                            );
                          }}
                          className="sr-only"
                        />

                        <span>
                          <span className="block font-semibold text-[#153f32]">
                            {variant.size ||
                              variant.name}
                          </span>

                          {variant.color && (
                            <span className="mt-1 block text-xs text-[#718078]">
                              {
                                variant.color
                              }
                            </span>
                          )}
                        </span>

                        <span className="text-lg font-semibold text-[#e76d61]">
                          {formatPrice(
                            variant.price
                          )}
                        </span>
                      </label>
                    );
                  }
                )}
              </div>
            </fieldset>
          </section>
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
            <span className="font-semibold">
              Availability:
            </span>{" "}
            {soldOut
              ? "Sold Out"
              : baseQuantity <= 3
                ? "Low Stock"
                : "In Stock"}
          </div>
        )}

      {hasVariants &&
        selectedTracksInventory &&
        selectedQuantity !== null && (
          <div
            className={`mt-4 rounded-xl px-4 py-3 text-sm ${
              soldOut
                ? "bg-[#fff0ed] text-[#a7473f]"
                : "bg-[#edf3e7] text-[#36594c]"
            }`}
          >
            <span className="font-semibold">
              {structuredShirtVariants
                ? [
                    formatGarmentType(
                      selectedVariant
                        ?.garmentType
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
              ? "Sold Out"
              : selectedQuantity <= 3
                ? "Low Stock"
                : "In Stock"}
          </div>
        )}

      {presetDesign && (
        <div className="mt-6 rounded-2xl bg-[#f5efe6] p-4">
          <p className="text-sm font-semibold text-[#153f32]">
            Preset Screen-Printed Design
          </p>

          <p className="mt-2 text-sm leading-6 text-[#607068]">
            This shirt uses one of Port
            Petals&apos; available preset
            screen-print designs. Custom artwork
            is not currently offered through the
            online catalog.
          </p>
        </div>
      )}

      {personalizable && (
        <section className="mt-7 border-t border-[#284239]/10 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
            Step 2
          </p>

          <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32] sm:text-2xl">
            Add player details
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#607068]">
            Both fields are required for this
            personalized shirt.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Player Name *
              </span>

              <input
                type="text"
                name="playerName"
                required
                maxLength={30}
                value={playerName}
                onChange={(event) => {
                  setPlayerName(
                    event.target.value
                  );
                  setAddedToCart(false);
                }}
                placeholder="Example: Easton"
                className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none placeholder:text-[#8a948e] focus:border-[#e76d61]"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Player Number *
              </span>

              <input
                type="text"
                name="playerNumber"
                required
                maxLength={3}
                inputMode="numeric"
                value={playerNumber}
                onChange={(event) => {
                  setPlayerNumber(
                    event.target.value
                  );
                  setAddedToCart(false);
                }}
                placeholder="Example: 33"
                className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none placeholder:text-[#8a948e] focus:border-[#e76d61]"
              />
            </label>
          </div>
        </section>
      )}

      <section className="mt-7 border-t border-[#284239]/10 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
          {personalizable
            ? "Step 3"
            : hasVariants
              ? "Step 2"
              : "Step 1"}
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
                    : "border-[#284239]/15 bg-white"
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
                    setAddedToCart(false);
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
                    : "border-[#284239]/15 bg-white"
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
                    setAddedToCart(false);
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
                  setAddedToCart(false);
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

      <section className="mt-7 rounded-2xl border border-[#284239]/10 bg-[#fffaf3] p-4 sm:p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#718078]">
              Estimated Total
            </p>

            {selectedVariant && (
              <p className="mt-1 text-xs leading-5 text-[#718078]">
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

          <p className="shrink-0 text-2xl font-semibold text-[#e76d61] sm:text-3xl">
            {formatPrice(estimatedTotal)}
          </p>
        </div>

        {personalizable &&
          !personalizationComplete && (
            <p className="mt-3 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm leading-5 text-[#a7473f]">
              Enter the player name and number
              before adding this shirt to your
              cart.
            </p>
          )}

        {fulfillment === "delivery" &&
          deliveryArea === "" && (
            <p className="mt-3 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm leading-5 text-[#a7473f]">
              Choose a delivery area before
              adding this shirt to your cart.
            </p>
          )}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!readyToAdd}
          className="mt-4 flex min-h-14 w-full items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#d85b50] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#d9d5ce] disabled:text-[#7a7a76] disabled:shadow-none"
        >
          {soldOut
            ? "Sold Out"
            : "Add to Cart"}
        </button>

        {addedToCart && (
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
    </div>
  );
}
