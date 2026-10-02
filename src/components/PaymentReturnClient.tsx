"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/CartProvider";

type ConfirmationOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentType: string;
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  total: number;
  paidAt: string | null;
};

type PaymentReturnClientProps = {
  orderId: string;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function PaymentReturnClient({
  orderId,
}: PaymentReturnClientProps) {
  const { clearCart } = useCart();

  const [order, setOrder] =
    useState<ConfirmationOrder | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cartCleared = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let attempts = 0;

    async function checkOrder() {
      try {
        const response = await fetch(
          `/api/orders/status?orderId=${encodeURIComponent(
            orderId
          )}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ??
              "Unable to confirm payment."
          );
        }

        if (cancelled) {
          return;
        }

        const nextOrder =
          result.order as ConfirmationOrder;

        setOrder(nextOrder);
        setLoading(false);
        setError("");

        if (
          nextOrder.paymentStatus === "paid"
        ) {
          if (!cartCleared.current) {
            clearCart();
            cartCleared.current = true;
          }

          return;
        }

        attempts += 1;

        // Poll for roughly 30 seconds while the Square
        // webhook finishes processing.
        if (attempts < 15) {
          timer = setTimeout(
            checkOrder,
            2000
          );
        }
      } catch (caughtError) {
        if (cancelled) {
          return;
        }

        setLoading(false);

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to confirm payment."
        );
      }
    }

    checkOrder();

    return () => {
      cancelled = true;

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [orderId, clearCart]);

  const paid =
    order?.paymentStatus === "paid";

  return (
    <main className="min-h-[70vh] bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div className="rounded-3xl border border-[#284239]/10 bg-white p-8 text-center shadow-sm sm:p-10">
          {loading && !order ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Confirming Payment
              </p>

              <h1 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
                Just a moment
              </h1>

              <p className="mx-auto mt-5 max-w-xl leading-7 text-[#607068]">
                Square returned you to Port Petals. We are
                confirming your payment.
              </p>

              <div className="mx-auto mt-8 h-8 w-8 animate-spin rounded-full border-4 border-[#284239]/15 border-t-[#e76d61]" />
            </>
          ) : error ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Payment Status
              </p>

              <h1 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
                We&apos;re checking your order
              </h1>

              <p className="mx-auto mt-5 max-w-xl leading-7 text-[#607068]">
                {error}
              </p>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#607068]">
                Please do not submit another payment.
              </p>
            </>
          ) : order && paid ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Payment Confirmed
              </p>

              <h1 className="mt-3 font-serif text-4xl font-semibold text-[#153f32] sm:text-5xl">
                Thank you!
              </h1>

              <p className="mx-auto mt-5 max-w-xl leading-7 text-[#607068]">
                Your payment has been received and your
                Port Petals order is confirmed.
              </p>

              <div className="mx-auto mt-8 max-w-md rounded-2xl bg-[#f7f1e8] p-5 text-left">
                <div className="flex justify-between gap-4">
                  <span>Order</span>
                  <strong>
                    {order.orderNumber}
                  </strong>
                </div>

                <div className="mt-3 flex justify-between gap-4">
                  <span>Fulfillment</span>
                  <strong className="capitalize">
                    {order.fulfillmentType}
                  </strong>
                </div>

                <div className="mt-3 flex justify-between gap-4">
                  <span>Merchandise</span>
                  <strong>
                    {formatPrice(order.subtotal)}
                  </strong>
                </div>

                {order.deliveryFee > 0 && (
                  <div className="mt-3 flex justify-between gap-4">
                    <span>Delivery</span>
                    <strong>
                      {formatPrice(
                        order.deliveryFee
                      )}
                    </strong>
                  </div>
                )}

                {order.taxAmount > 0 && (
                  <div className="mt-3 flex justify-between gap-4">
                    <span>Tax</span>
                    <strong>
                      {formatPrice(
                        order.taxAmount
                      )}
                    </strong>
                  </div>
                )}

                <div className="mt-4 flex justify-between gap-4 border-t border-[#284239]/10 pt-4 text-lg">
                  <span>Total Paid</span>
                  <strong className="text-[#e76d61]">
                    {formatPrice(order.total)}
                  </strong>
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-[#edf3e7] p-4 text-sm leading-6 text-[#36594c]">
                Your order is now in the Port Petals
                system and payment has been confirmed.
              </div>
            </>
          ) : order ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Confirming Payment
              </p>

              <h1 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
                {order.orderNumber}
              </h1>

              <p className="mx-auto mt-5 max-w-xl leading-7 text-[#607068]">
                Square has returned you to Port Petals,
                but we are still waiting for the secure
                payment confirmation.
              </p>

              <div className="mt-7 rounded-xl bg-[#fff4f1] p-4 text-sm leading-6 text-[#8c433b]">
                Please do not submit another payment.
                This page will continue checking the
                existing order.
              </div>
            </>
          ) : null}

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
            >
              Return Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
