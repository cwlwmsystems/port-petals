"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import WishlistButton from "@/components/WishlistButton";

type StockVariant = {
  quantity: number | null;
  trackInventory: boolean;
};

type StoreProductCardProps = {
  href: string;
  productId: string;
  slug: string;
  name: string;
  shortDescription?: string | null;
  imageUrl: string;
  imageAlt: string;
  startingPrice: number | null;

  featured?: boolean;
  maker?: string | null;

  readyMade?: boolean;
  customizable?: boolean;
  madeToOrder?: boolean;

  leadTimeDays?: number | null;

  basePrice: number | null;
  trackInventory: boolean;
  quantity: number | null;
  variants: StockVariant[];

  showHoverPanel?: boolean;
};

function formatPrice(price: number | null) {
  if (price === null) {
    return "Contact for price";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function StoreProductCard({
  href,
  productId,
  slug,
  name,
  shortDescription,
  imageUrl,
  imageAlt,
  startingPrice,
  featured = false,
  maker,
  readyMade = false,
  customizable = false,
  madeToOrder = false,
  leadTimeDays,
  basePrice,
  trackInventory,
  quantity,
  variants,
  showHoverPanel = true,
}: StoreProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const trackedVariants = variants.filter(
    (variant) =>
      variant.trackInventory &&
      variant.quantity !== null
  );

  const usesVariantInventory =
    trackedVariants.length > 0;

  const stockQuantity = usesVariantInventory
    ? trackedVariants.reduce(
        (total, variant) =>
          total + (variant.quantity ?? 0),
        0
      )
    : quantity;

  const tracksStock =
    usesVariantInventory || trackInventory;

  const soldOut =
    tracksStock &&
    stockQuantity !== null &&
    stockQuantity <= 0;

  const stockLabel = !tracksStock
    ? null
    : soldOut
      ? "Sold Out"
      : stockQuantity !== null &&
          stockQuantity <= 3
        ? "Low Stock"
        : "In Stock";

  const hasOptions = variants.length > 0;

  const canQuickAdd =
    !hasOptions &&
    !customizable &&
    basePrice !== null &&
    !soldOut;

  function handleQuickAdd() {
    if (!canQuickAdd || basePrice === null) {
      return;
    }

    addItem({
      productId,
      variantId: null,
      productName: name,
      slug,
      productPath: href,
      imageUrl,
      unitPrice: basePrice,
      customization: {},
    });

    setAdded(true);
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-[#284239]/10 bg-white/70 shadow-[0_12px_35px_rgba(42,66,57,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#e76d61]/20 hover:shadow-[0_22px_55px_rgba(42,66,57,0.15)] focus-within:-translate-y-1 focus-within:border-[#e76d61]/20">
      <Link
        href={href}
        aria-label={`View ${name}`}
        className="absolute inset-0 z-10 rounded-[1.8rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e76d61] focus-visible:ring-offset-2"
      />

      <div className="relative h-56 overflow-hidden sm:h-64">
        <div className="absolute right-4 top-4 z-30">
          <WishlistButton
            productId={productId}
            compact
          />
        </div>

        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          unoptimized
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-[1.035]"
        />

        {featured && (
          <span className="absolute left-4 top-4 z-20 rounded-full bg-[#fffaf3]/95 px-3 py-1.5 text-xs font-semibold text-[#e76d61]">
            Port Petals Favorite
          </span>
        )}

        {maker && (
          <span className="absolute bottom-4 left-4 z-20 rounded-full bg-[#284239]/90 px-3 py-1.5 text-xs font-semibold text-white">
            By {maker}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-serif text-xl font-semibold leading-snug text-[#153f32] sm:text-2xl">
          {name}
        </h3>

        {shortDescription && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#607068] sm:line-clamp-3 sm:text-base">
            {shortDescription}
          </p>
        )}

        {(readyMade ||
          customizable ||
          madeToOrder) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {readyMade && (
              <span className="rounded-full bg-[#edf1f6] px-3 py-1 text-xs font-semibold text-[#536578]">
                Ready-Made
              </span>
            )}

            {customizable && (
              <span className="rounded-full bg-[#f8e1dc] px-3 py-1 text-xs font-semibold text-[#b9564c]">
                Customizable
              </span>
            )}

            {madeToOrder && (
              <span className="rounded-full bg-[#edf3e7] px-3 py-1 text-xs font-semibold text-[#36594c]">
                Made to Order
              </span>
            )}
          </div>
        )}

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-[#718078]">
              {hasOptions
                ? "Starting at"
                : "Price"}
            </p>

            <p className="mt-1 text-lg font-semibold text-[#e76d61]">
              {formatPrice(startingPrice)}
            </p>
          </div>

          {stockLabel && (
            <span
              className={`text-sm font-semibold ${
                soldOut
                  ? "text-[#a7473f]"
                  : stockQuantity !== null &&
                      stockQuantity <= 3
                    ? "text-[#b36a32]"
                    : "text-[#36594c]"
              }`}
            >
              {stockLabel}
            </span>
          )}
        </div>

        {leadTimeDays !== null &&
          leadTimeDays !== undefined && (
            <p className="mt-3 text-xs leading-5 text-[#718078]">
              Please allow at least{" "}
              {leadTimeDays} day
              {leadTimeDays === 1 ? "" : "s"}.
            </p>
          )}

        {/* Mobile actions */}
        <div className="relative z-20 mt-auto pt-5 lg:hidden">
          {canQuickAdd ? (
            <button
              type="button"
              onClick={handleQuickAdd}
              className="flex min-h-12 w-full items-center justify-center rounded-full bg-[#e76d61] px-5 py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
            >
              {added
                ? "Added to Cart ✓"
                : "Add to Cart"}
            </button>
          ) : (
            <Link
              href={href}
              className={`flex min-h-12 w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold ${
                soldOut
                  ? "border border-[#284239]/15 bg-white text-[#284239]"
                  : "bg-[#e76d61] text-white"
              }`}
            >
              {soldOut
                ? "View Product"
                : "Choose Options"}
            </Link>
          )}

          {added && (
            <Link
              href="/cart"
              className="mt-3 flex min-h-10 items-center justify-center text-sm font-semibold text-[#e76d61] underline underline-offset-4"
            >
              Go to Cart →
            </Link>
          )}
        </div>

        <div className="mt-auto hidden pt-5 text-sm font-semibold text-[#36594c] lg:block">
          View product →
        </div>
      </div>

      {/* Desktop quick-action hover panel */}
      {showHoverPanel && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden h-[48%] overflow-hidden lg:block">
          <div className="absolute inset-0 translate-y-4 bg-[#fffaf3]/86 opacity-0 backdrop-blur-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100" />

          <div className="pointer-events-auto absolute inset-x-4 bottom-4 translate-y-4 rounded-[1.35rem] border border-white/80 bg-white/88 p-4 opacity-0 shadow-[0_18px_45px_rgba(42,66,57,0.16)] backdrop-blur-xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-[#718078]">
                  {hasOptions
                    ? "Starting at"
                    : "Price"}
                </p>

                <p className="mt-1 text-lg font-semibold text-[#e76d61]">
                  {formatPrice(
                    startingPrice
                  )}
                </p>
              </div>

              {stockLabel && (
                <span
                  className={`text-xs font-semibold ${
                    soldOut
                      ? "text-[#a7473f]"
                      : stockQuantity !==
                            null &&
                          stockQuantity <=
                            3
                        ? "text-[#b36a32]"
                        : "text-[#36594c]"
                  }`}
                >
                  {stockLabel}
                </span>
              )}
            </div>

            <div className="mt-4 grid gap-2">
              {canQuickAdd ? (
                <button
                  type="button"
                  onClick={
                    handleQuickAdd
                  }
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#e76d61] px-5 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
                >
                  {added
                    ? "Added to Cart ✓"
                    : "Add to Cart"}
                </button>
              ) : (
                <Link
                  href={href}
                  className={`inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 text-sm font-semibold transition ${
                    soldOut
                      ? "border border-[#284239]/15 bg-white text-[#284239] hover:border-[#e76d61]/30"
                      : "bg-[#e76d61] text-white hover:bg-[#d85b50]"
                  }`}
                >
                  {soldOut
                    ? "View Product"
                    : "Choose Options"}
                </Link>
              )}

              <Link
                href={href}
                className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-[#284239]/15 bg-white px-5 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                View Details
              </Link>

              {added && (
                <Link
                  href="/cart"
                  className="text-center text-sm font-semibold text-[#e76d61] underline underline-offset-4"
                >
                  Go to Cart →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
