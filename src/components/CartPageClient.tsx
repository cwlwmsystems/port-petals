"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
} from "react";
import { useCart } from "@/components/CartProvider";
import { trackViewCart } from "@/lib/analytics";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function formatGarmentType(
  garmentType: string | null | undefined
) {
  switch (garmentType) {
    case "t-shirt":
      return "T-Shirt";
    case "crewneck":
      return "Crewneck";
    case "hoodie":
      return "Hoodie";
    default:
      return garmentType ?? null;
  }
}

export default function CartPageClient() {
  const {
    items,
    itemCount,
    subtotal,
    removeItem,
    setQuantity,
    clearCart,
  } = useCart();

  const viewCartTracked =
    useRef(false);

  useEffect(() => {
    if (
      viewCartTracked.current ||
      items.length === 0
    ) {
      return;
    }

    const sent =
      trackViewCart(
        items.map((item) => ({
          productId:
            item.productId,
          variantId:
            item.variantId,
          productName:
            item.productName,
          unitPrice:
            item.unitPrice,
          quantity:
            item.quantity,
          garmentType:
            item.garmentType,
          size: item.size,
          color: item.color,
        })),
        subtotal
      );

    if (sent) {
      viewCartTracked.current =
        true;
    }
  }, [items, subtotal]);

  function handleClearCart() {
    const confirmed = window.confirm(
      "Remove all items from your cart?"
    );

    if (confirmed) {
      clearCart();
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[65vh] bg-[#f7f1e8] text-[#284239]">
        <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-8 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
            Your Cart
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold text-[#153f32] sm:text-5xl">
            Your cart is empty
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#607068] sm:text-base sm:leading-7">
            Browse Port Petals products and add
            something special to your order.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
          >
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12 lg:px-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61] sm:text-sm">
              Your Cart
            </p>

            <h1 className="mt-2 font-serif text-3xl font-semibold text-[#153f32] sm:text-5xl">
              Review your order
            </h1>

            <p className="mt-2 text-sm text-[#607068]">
              {itemCount} item
              {itemCount === 1 ? "" : "s"} in
              your cart
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearCart}
            className="min-h-10 shrink-0 px-2 text-sm font-semibold text-[#a7473f] transition hover:text-[#7d302a]"
          >
            Clear Cart
          </button>
        </div>

        <div className="mt-7 grid gap-6 sm:mt-10 lg:grid-cols-[1fr_360px] lg:gap-8">
          <div className="space-y-4">
            {items.map((item) => {
              const details = [
                formatGarmentType(
                  item.garmentType
                ),
                item.color,
                item.size,
              ].filter(Boolean);

              return (
                <article
                  key={item.lineId}
                  className="rounded-2xl border border-[#284239]/10 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="grid grid-cols-[88px_1fr] gap-4 sm:grid-cols-[112px_1fr]">
                    <Link
                      href={
                        item.productPath ??
                        `/apparel/${item.slug}`
                      }
                      aria-label={`View ${item.productName}`}
                      className="block"
                    >
                      <div className="aspect-square w-full overflow-hidden rounded-xl bg-[#f5efe6]">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="h-full w-full object-contain p-1"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-2 text-center text-xs text-[#718078]">
                            Port Petals
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="min-w-0">
                      <Link
                        href={
                          item.productPath ??
                          `/apparel/${item.slug}`
                        }
                        className="font-serif text-lg font-semibold leading-snug text-[#153f32] transition hover:text-[#e76d61] sm:text-xl"
                      >
                        {item.productName}
                      </Link>

                      {details.length > 0 && (
                        <p className="mt-1 text-sm leading-5 text-[#607068]">
                          {details.join(" / ")}
                        </p>
                      )}

                      <p className="mt-2 text-base font-semibold text-[#e76d61]">
                        {formatPrice(
                          item.unitPrice *
                            item.quantity
                        )}
                      </p>

                      {item.quantity > 1 && (
                        <p className="mt-0.5 text-xs text-[#718078]">
                          {formatPrice(
                            item.unitPrice
                          )}{" "}
                          each
                        </p>
                      )}
                    </div>
                  </div>

                  {(item.playerName ||
                    item.playerNumber ||
                    Object.keys(
                      item.customization ?? {}
                    ).length > 0) && (
                    <div className="mt-4 rounded-xl bg-[#faf7f1] p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718078]">
                        Item Details
                      </p>

                      <div className="mt-2 space-y-1 text-sm leading-5 text-[#607068]">
                        {item.playerName && (
                          <p>
                            Name:{" "}
                            <strong className="font-semibold text-[#284239]">
                              {item.playerName}
                            </strong>
                          </p>
                        )}

                        {item.playerNumber && (
                          <p>
                            Number:{" "}
                            <strong className="font-semibold text-[#284239]">
                              {item.playerNumber}
                            </strong>
                          </p>
                        )}

                        {Object.entries(
                          item.customization ?? {}
                        ).map(
                          ([key, value]) => (
                            <p
                              key={key}
                              className="break-words"
                            >
                              {key}:{" "}
                              <strong className="font-semibold text-[#284239]">
                                {value}
                              </strong>
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#284239]/10 pt-4">
                    <div>
                      <p className="mb-1 text-xs font-semibold text-[#718078]">
                        Quantity
                      </p>

                      <div className="inline-flex min-h-11 items-center overflow-hidden rounded-full border border-[#284239]/15 bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(
                              item.lineId,
                              item.quantity - 1
                            )
                          }
                          className="flex h-11 w-11 items-center justify-center text-lg font-semibold transition active:bg-[#f5efe6]"
                          aria-label={`Decrease ${item.productName} quantity`}
                        >
                          −
                        </button>

                        <span className="min-w-10 px-2 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(
                              item.lineId,
                              item.quantity + 1
                            )
                          }
                          className="flex h-11 w-11 items-center justify-center text-lg font-semibold transition active:bg-[#f5efe6]"
                          aria-label={`Increase ${item.productName} quantity`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.lineId)
                      }
                      className="min-h-11 self-end px-3 text-sm font-semibold text-[#a7473f]"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="h-fit rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
              Next Step
            </p>

            <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
              Order Summary
            </h2>

            <div className="mt-5 flex items-center justify-between border-b border-[#284239]/10 pb-5">
              <span className="text-[#607068]">
                Subtotal
              </span>

              <span className="text-xl font-semibold text-[#153f32]">
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-[#edf3e7] p-4">
              <p className="text-sm font-semibold text-[#36594c]">
                Pickup or local delivery
              </p>

              <p className="mt-1 text-xs leading-5 text-[#607068]">
                You&apos;ll choose pickup or
                delivery and your requested date
                during checkout. Any applicable
                delivery fee will be shown before
                payment.
              </p>
            </div>

            <Link
              href="/checkout"
              className="mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-[#e76d61] px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#d85b50] active:scale-[0.99]"
            >
              Continue to Checkout
            </Link>

            <p className="mt-3 text-center text-xs leading-5 text-[#718078]">
              Secure checkout powered by Square.
            </p>

            <Link
              href="/"
              className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full border border-[#284239]/15 px-5 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
