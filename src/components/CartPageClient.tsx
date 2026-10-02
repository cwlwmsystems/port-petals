"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

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

  if (items.length === 0) {
    return (
      <main className="min-h-[65vh] bg-[#f7f1e8] text-[#284239]">
        <section className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
            Your Cart
          </p>

          <h1 className="mt-3 font-serif text-4xl font-semibold text-[#153f32] sm:text-5xl">
            Your cart is empty
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#607068]">
            Browse Port Petals products and add your favorites here.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
          >
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
              Your Cart
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold text-[#153f32] sm:text-5xl">
              Review your order
            </h1>

            <p className="mt-3 text-sm text-[#607068]">
              {itemCount} item{itemCount === 1 ? "" : "s"} in your cart
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-semibold text-[#a7473f] transition hover:text-[#7d302a]"
          >
            Clear Cart
          </button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => {
              const details = [
                formatGarmentType(item.garmentType),
                item.color,
                item.size,
              ].filter(Boolean);

              return (
                <article
                  key={item.lineId}
                  className="rounded-2xl border border-[#284239]/10 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="flex gap-4">
                    <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f5efe6]">
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

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <Link
                            href={item.productPath ?? `/shirts/${item.slug}`}
                            className="font-serif text-xl font-semibold text-[#153f32] transition hover:text-[#e76d61]"
                          >
                            {item.productName}
                          </Link>

                          {details.length > 0 && (
                            <p className="mt-1 text-sm text-[#607068]">
                              {details.join(" / ")}
                            </p>
                          )}

                          {(item.playerName ||
                            item.playerNumber) && (
                            <div className="mt-2 text-sm text-[#607068]">
                              {item.playerName && (
                                <p>
                                  Name:{" "}
                                  <strong className="text-[#284239]">
                                    {item.playerName}
                                  </strong>
                                </p>
                              )}

                              {item.playerNumber && (
                                <p>
                                  Number:{" "}
                                  <strong className="text-[#284239]">
                                    {item.playerNumber}
                                  </strong>
                                </p>
                              )}
                            </div>
                          )}

                          {Object.entries(
                            item.customization ?? {}
                          ).map(([key, value]) => (
                            <p
                              key={key}
                              className="mt-1 text-sm text-[#607068]"
                            >
                              {key}:{" "}
                              <strong className="text-[#284239]">
                                {value}
                              </strong>
                            </p>
                          ))}
                        </div>

                        <p className="font-semibold text-[#e76d61]">
                          {formatPrice(
                            item.unitPrice * item.quantity
                          )}
                        </p>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center overflow-hidden rounded-full border border-[#284239]/15 bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(
                                item.lineId,
                                item.quantity - 1
                              )
                            }
                            className="h-9 w-10 font-semibold transition hover:bg-[#f5efe6]"
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
                            className="h-9 w-10 font-semibold transition hover:bg-[#f5efe6]"
                            aria-label={`Increase ${item.productName} quantity`}
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm text-[#718078]">
                          {formatPrice(item.unitPrice)} each
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.lineId)
                          }
                          className="ml-auto text-sm font-semibold text-[#a7473f]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="h-fit rounded-2xl border border-[#284239]/10 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
              Order Summary
            </h2>

            <div className="mt-6 flex items-center justify-between border-b border-[#284239]/10 pb-5">
              <span className="text-[#607068]">
                Subtotal
              </span>

              <span className="text-lg font-semibold text-[#153f32]">
                {formatPrice(subtotal)}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#718078]">
              Pickup or local delivery will be selected at checkout.
              Applicable delivery fees will be added then.
            </p>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center rounded-full bg-[#e76d61] px-5 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
            >
              Continue to Checkout
            </Link>

            <Link
              href="/"
              className="mt-3 flex w-full items-center justify-center rounded-full border border-[#284239]/15 px-5 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
