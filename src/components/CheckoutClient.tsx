"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/CartProvider";

type FulfillmentType = "pickup" | "delivery";

type DeliveryArea =
  | ""
  | "within-3"
  | "three-to-eight"
  | "smethport-eldred";

type CreatedOrder = {
  orderId: string;
  orderNumber: string;
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  total: number;
  paymentStatus: string;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function CheckoutClient() {
  const { items, subtotal } = useCart();

  const [fulfillmentType, setFulfillmentType] =
    useState<FulfillmentType>("pickup");

  const [deliveryArea, setDeliveryArea] =
    useState<DeliveryArea>("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] =
    useState<CreatedOrder | null>(null);

  const [startingPayment, setStartingPayment] =
    useState(false);

  const [paymentError, setPaymentError] =
    useState("");

  const estimatedDeliveryFee =
    fulfillmentType !== "delivery"
      ? 0
      : deliveryArea === "three-to-eight"
        ? 10
        : deliveryArea === "smethport-eldred"
          ? 15
          : 0;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (items.length === 0 || submitting) {
      return;
    }

    setError("");
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: formData.get("customerName"),
          customerEmail: formData.get("customerEmail"),
          customerPhone: formData.get("customerPhone"),

          fulfillmentType,
          deliveryArea,

          deliveryAddress:
            formData.get("deliveryAddress"),
          deliveryCity:
            formData.get("deliveryCity"),
          deliveryState:
            formData.get("deliveryState"),
          deliveryZip:
            formData.get("deliveryZip"),

          notes: formData.get("notes"),

          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,

            playerName: item.playerName,
            playerNumber: item.playerNumber,

            customization:
              item.customization ?? {},
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Unable to create order."
        );
      }

      setCreatedOrder(result);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to create order."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSquarePayment() {
    if (!createdOrder || startingPayment) {
      return;
    }

    setPaymentError("");
    setStartingPayment(true);

    try {
      const response = await fetch(
        "/api/square/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: createdOrder.orderId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to start Square checkout."
        );
      }

      if (!result.checkoutUrl) {
        throw new Error(
          "Square did not return a checkout URL."
        );
      }

      window.location.href = result.checkoutUrl;
    } catch (caughtError) {
      setPaymentError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to start Square checkout."
      );

      setStartingPayment(false);
    }
  }

  if (items.length === 0 && !createdOrder) {
    return (
      <main className="min-h-[65vh] bg-[#f7f1e8] text-[#284239]">
        <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
          <h1 className="font-serif text-4xl font-semibold text-[#153f32]">
            Your cart is empty
          </h1>

          <Link
            href="/"
            className="mt-7 inline-flex rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white"
          >
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  if (createdOrder) {
    return (
      <main className="min-h-[70vh] bg-[#f7f1e8] text-[#284239]">
        <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <div className="rounded-3xl border border-[#284239]/10 bg-white p-8 text-center shadow-sm sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
              Order Created
            </p>

            <h1 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
              {createdOrder.orderNumber}
            </h1>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-[#607068]">
              Your order has been validated and saved in Port Petals.
              Payment has not been collected yet.
            </p>

            <div className="mx-auto mt-8 max-w-md rounded-2xl bg-[#f7f1e8] p-5 text-left">
              <div className="flex justify-between">
                <span>Merchandise</span>
                <strong>
                  {formatPrice(
                    createdOrder.subtotal
                  )}
                </strong>
              </div>

              <div className="mt-3 flex justify-between">
                <span>Delivery</span>
                <strong>
                  {formatPrice(
                    createdOrder.deliveryFee
                  )}
                </strong>
              </div>

              <div className="mt-4 flex justify-between border-t border-[#284239]/10 pt-4 text-lg">
                <span>Total</span>
                <strong className="text-[#e76d61]">
                  {formatPrice(createdOrder.total)}
                </strong>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-[#edf3e7] p-4 text-sm leading-6 text-[#36594c]">
              Your order has been saved. Continue to Square&apos;s
              secure checkout to complete payment.
            </div>

            {paymentError && (
              <div className="mt-4 rounded-xl bg-[#fff0ed] p-4 text-sm leading-6 text-[#a7473f]">
                {paymentError}
              </div>
            )}

            <button
              type="button"
              onClick={handleSquarePayment}
              disabled={startingPayment}
              className="mt-6 flex w-full items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {startingPayment
                ? "Opening Secure Payment..."
                : "Continue to Secure Payment"}
            </button>

            <Link
              href="/cart"
              className="mt-4 inline-flex rounded-full border border-[#284239]/15 px-6 py-3 font-semibold"
            >
              Return to Cart
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
            Checkout
          </p>

          <h1 className="mt-2 font-serif text-4xl font-semibold text-[#153f32] sm:text-5xl">
            Order details
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]"
        >
          <div className="space-y-6">
            <section className="rounded-2xl border border-[#284239]/10 bg-white p-6">
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Contact Information
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold">
                    Name *
                  </span>

                  <input
                    required
                    name="customerName"
                    className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold">
                    Email *
                  </span>

                  <input
                    required
                    type="email"
                    name="customerEmail"
                    className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold">
                    Phone *
                  </span>

                  <input
                    required
                    type="tel"
                    name="customerPhone"
                    className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#284239]/10 bg-white p-6">
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Pickup or Delivery
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label
                  className={`cursor-pointer rounded-xl border p-4 ${
                    fulfillmentType === "pickup"
                      ? "border-[#e76d61] bg-[#fff4f1]"
                      : "border-[#284239]/15"
                  }`}
                >
                  <input
                    type="radio"
                    name="fulfillment"
                    value="pickup"
                    checked={
                      fulfillmentType === "pickup"
                    }
                    onChange={() => {
                      setFulfillmentType("pickup");
                      setDeliveryArea("");
                    }}
                    className="sr-only"
                  />

                  <strong>Pickup</strong>

                  <span className="mt-1 block text-sm text-[#607068]">
                    430 E Arnold Avenue, Port Allegany
                  </span>
                </label>

                <label
                  className={`cursor-pointer rounded-xl border p-4 ${
                    fulfillmentType === "delivery"
                      ? "border-[#e76d61] bg-[#fff4f1]"
                      : "border-[#284239]/15"
                  }`}
                >
                  <input
                    type="radio"
                    name="fulfillment"
                    value="delivery"
                    checked={
                      fulfillmentType === "delivery"
                    }
                    onChange={() =>
                      setFulfillmentType("delivery")
                    }
                    className="sr-only"
                  />

                  <strong>Local Delivery</strong>

                  <span className="mt-1 block text-sm text-[#607068]">
                    Delivery fee depends on destination
                  </span>
                </label>
              </div>

              {fulfillmentType === "delivery" && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 sm:col-span-2">
                    <span className="text-sm font-semibold">
                      Delivery Area *
                    </span>

                    <select
                      required
                      value={deliveryArea}
                      onChange={(event) =>
                        setDeliveryArea(
                          event.target
                            .value as DeliveryArea
                        )
                      }
                      className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                    >
                      <option value="">
                        Choose delivery area
                      </option>

                      <option value="within-3">
                        Within 3 miles — Free
                      </option>

                      <option value="three-to-eight">
                        Over 3 miles up to 8 miles — $10
                      </option>

                      <option value="smethport-eldred">
                        Smethport or Eldred — $15
                      </option>
                    </select>
                  </label>

                  <label className="grid gap-2 sm:col-span-2">
                    <span className="text-sm font-semibold">
                      Street Address *
                    </span>

                    <input
                      required
                      name="deliveryAddress"
                      className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold">
                      City *
                    </span>

                    <input
                      required
                      name="deliveryCity"
                      className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold">
                      State *
                    </span>

                    <input
                      required
                      name="deliveryState"
                      defaultValue="PA"
                      className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold">
                      ZIP Code *
                    </span>

                    <input
                      required
                      name="deliveryZip"
                      className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                    />
                  </label>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-[#284239]/10 bg-white p-6">
              <label className="grid gap-2">
                <span className="font-serif text-2xl font-semibold text-[#153f32]">
                  Order Notes
                </span>

                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Anything Port Petals should know about this order?"
                  className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none focus:border-[#e76d61]"
                />
              </label>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-[#284239]/10 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
              Order Summary
            </h2>

            <div className="mt-5 space-y-3">
              {items.map((item) => (
                <div
                  key={item.lineId}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span>
                    {item.productName} × {item.quantity}
                  </span>

                  <strong>
                    {formatPrice(
                      item.unitPrice * item.quantity
                    )}
                  </strong>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-[#284239]/10 pt-5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <div className="mt-3 flex justify-between">
                <span>Estimated delivery</span>
                <strong>
                  {formatPrice(
                    estimatedDeliveryFee
                  )}
                </strong>
              </div>

              <div className="mt-5 flex justify-between border-t border-[#284239]/10 pt-5 text-lg">
                <span>Estimated total</span>
                <strong className="text-[#e76d61]">
                  {formatPrice(
                    subtotal +
                      estimatedDeliveryFee
                  )}
                </strong>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-xl bg-[#fff0ed] p-4 text-sm leading-6 text-[#a7473f]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center rounded-full bg-[#e76d61] px-5 py-3 font-semibold text-white transition hover:bg-[#d85b50] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Validating Order..."
                : "Create Order"}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-[#718078]">
              Payment is not collected yet. Square checkout will be
              connected next.
            </p>

            <Link
              href="/cart"
              className="mt-4 flex justify-center text-sm font-semibold text-[#36594c]"
            >
              ← Back to Cart
            </Link>
          </aside>
        </form>
      </section>
    </main>
  );
}
