"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";
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

type PaymentPreviewState =
  | "paid"
  | "checking"
  | "delayed";

type PaymentReturnClientProps = {
  orderId: string;
  previewState?: PaymentPreviewState;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

const MAX_ATTEMPTS = 20;
const POLL_INTERVAL_MS = 2000;

export default function PaymentReturnClient({
  orderId,
  previewState,
}: PaymentReturnClientProps) {
  const { clearCart } = useCart();

  const [order, setOrder] =
    useState<ConfirmationOrder | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [
    finishedChecking,
    setFinishedChecking,
  ] = useState(false);

  const cartCleared = useRef(false);

  useEffect(() => {
    if (previewState) {
      const previewOrder: ConfirmationOrder = {
        id: "development-preview",
        orderNumber: "PP-PREVIEW-123456",
        status:
          previewState === "paid"
            ? "paid"
            : "awaiting_payment",
        paymentStatus:
          previewState === "paid"
            ? "paid"
            : "pending",
        fulfillmentType: "pickup",
        subtotal: 65,
        deliveryFee: 0,
        taxAmount: 0,
        total: 65,
        paidAt:
          previewState === "paid"
            ? new Date().toISOString()
            : null,
      };

      setOrder(previewOrder);
      setLoading(false);

      setFinishedChecking(
        previewState !== "checking"
      );

      return;
    }

    let cancelled = false;

    let timer:
      | ReturnType<typeof setTimeout>
      | null = null;

    let attempts = 0;

    function scheduleNextCheck() {
      if (cancelled) {
        return;
      }

      attempts += 1;

      if (attempts >= MAX_ATTEMPTS) {
        setLoading(false);
        setFinishedChecking(true);
        return;
      }

      timer = setTimeout(
        checkOrder,
        POLL_INTERVAL_MS
      );
    }

    async function checkOrder() {
      try {
        const response = await fetch(
          `/api/orders/status?orderId=${encodeURIComponent(
            orderId
          )}&t=${Date.now()}`,
          {
            cache: "no-store",
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          console.error(
            "Payment confirmation check failed:",
            result.error ?? result
          );

          scheduleNextCheck();
          return;
        }

        if (cancelled) {
          return;
        }

        const nextOrder =
          result.order as ConfirmationOrder;

        setOrder(nextOrder);
        setLoading(false);

        const paymentConfirmed =
          nextOrder.paymentStatus?.toLowerCase() ===
            "paid" ||
          nextOrder.status?.toLowerCase() ===
            "paid" ||
          Boolean(nextOrder.paidAt);

        if (paymentConfirmed) {
          setFinishedChecking(true);

          if (!cartCleared.current) {
            clearCart();
            cartCleared.current = true;
          }

          return;
        }

        scheduleNextCheck();
      } catch (caughtError) {
        if (cancelled) {
          return;
        }

        console.error(
          "Payment confirmation error:",
          caughtError
        );

        scheduleNextCheck();
      }
    }

    checkOrder();

    return () => {
      cancelled = true;

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [orderId, clearCart, previewState]);

  const paid =
    order?.paymentStatus?.toLowerCase() ===
      "paid" ||
    order?.status?.toLowerCase() ===
      "paid" ||
    Boolean(order?.paidAt);

  const stillChecking =
    !paid && !finishedChecking;

  return (
    <main className="min-h-[70vh] bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-16">
        <div className="rounded-3xl border border-[#284239]/10 bg-white p-5 text-center shadow-sm sm:p-10">
          {paid && order ? (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf3e7] text-2xl font-semibold text-[#31583b]">
                ✓
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61] sm:text-sm">
                Payment Confirmed
              </p>

              <h1 className="mt-2 font-serif text-3xl font-semibold text-[#153f32] sm:text-5xl">
                Thank you!
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#607068] sm:text-base sm:leading-7">
                Your payment has been received
                and your Port Petals order is
                confirmed.
              </p>

              <div className="mx-auto mt-6 max-w-md rounded-2xl bg-[#f7f1e8] p-4 text-left sm:p-5">
                <div className="flex justify-between gap-4 text-sm">
                  <span>Order</span>

                  <strong className="break-all text-right">
                    {order.orderNumber}
                  </strong>
                </div>

                <div className="mt-3 flex justify-between gap-4 text-sm">
                  <span>Fulfillment</span>

                  <strong className="capitalize">
                    {order.fulfillmentType}
                  </strong>
                </div>

                <div className="mt-3 flex justify-between gap-4 text-sm">
                  <span>Merchandise</span>

                  <strong>
                    {formatPrice(
                      order.subtotal
                    )}
                  </strong>
                </div>

                {order.deliveryFee > 0 && (
                  <div className="mt-3 flex justify-between gap-4 text-sm">
                    <span>Delivery</span>

                    <strong>
                      {formatPrice(
                        order.deliveryFee
                      )}
                    </strong>
                  </div>
                )}

                {order.taxAmount > 0 && (
                  <div className="mt-3 flex justify-between gap-4 text-sm">
                    <span>Tax</span>

                    <strong>
                      {formatPrice(
                        order.taxAmount
                      )}
                    </strong>
                  </div>
                )}

                <div className="mt-4 flex items-end justify-between gap-4 border-t border-[#284239]/10 pt-4">
                  <span className="font-semibold">
                    Total Paid
                  </span>

                  <strong className="text-2xl text-[#e76d61]">
                    {formatPrice(order.total)}
                  </strong>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-[#edf3e7] p-4 text-left">
                <p className="text-sm font-semibold text-[#31583b]">
                  Your order is complete.
                </p>

                <p className="mt-1 text-sm leading-6 text-[#607068]">
                  Port Petals has received your
                  order and can now begin
                  processing it.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/"
                  className="flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
                >
                  Return Home
                </Link>

                <Link
                  href="/journal"
                  className="flex min-h-12 items-center justify-center rounded-full border border-[#284239]/15 bg-white px-6 py-3 text-sm font-semibold text-[#284239]"
                >
                  Browse Inspiration
                </Link>
              </div>
            </>
          ) : stillChecking ? (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff4f1]">
                <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#284239]/15 border-t-[#e76d61]" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61] sm:text-sm">
                Confirming Payment
              </p>

              <h1 className="mt-2 break-words font-serif text-3xl font-semibold text-[#153f32] sm:text-4xl">
                {order?.orderNumber ??
                  "Just a moment"}
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#607068] sm:text-base sm:leading-7">
                Your payment was submitted.
                We&apos;re waiting for Square
                to finish confirming the order.
              </p>

              <div className="mt-6 rounded-xl bg-[#fff4f1] p-4 text-left">
                <p className="text-sm font-semibold text-[#8c433b]">
                  Do not submit another payment.
                </p>

                <p className="mt-1 text-sm leading-6 text-[#8c433b]">
                  This page will update
                  automatically as soon as the
                  confirmation arrives.
                </p>
              </div>

              <p className="mt-5 text-xs leading-5 text-[#718078]">
                Secure payment processing
                powered by Square.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff4f1] text-xl font-semibold text-[#a7473f]">
                !
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61] sm:text-sm">
                Confirmation Delayed
              </p>

              <h1 className="mt-2 font-serif text-3xl font-semibold text-[#153f32] sm:text-4xl">
                We&apos;re still confirming
                your payment
              </h1>

              {order?.orderNumber && (
                <p className="mt-4 break-words text-sm font-semibold text-[#153f32]">
                  Order {order.orderNumber}
                </p>
              )}

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#607068] sm:text-base sm:leading-7">
                Square has not finished
                reporting the final payment
                status yet. Your order may
                still be processing.
              </p>

              <div className="mt-6 rounded-xl bg-[#fff4f1] p-4 text-left">
                <p className="text-sm font-semibold text-[#8c433b]">
                  Please do not pay again.
                </p>

                <p className="mt-1 text-sm leading-6 text-[#8c433b]">
                  If Square showed a successful
                  payment, the transaction may
                  already be complete even
                  though this page has not
                  received the final update yet.
                </p>
              </div>

              <div className="mt-5 rounded-xl border border-[#284239]/10 bg-[#faf7f1] p-4 text-left">
                <p className="text-sm font-semibold text-[#153f32]">
                  Need help?
                </p>

                <p className="mt-1 text-sm leading-6 text-[#607068]">
                  Contact Port Petals and have
                  your order number ready.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href="tel:+18146421253"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#284239] px-4 text-sm font-semibold text-white"
                  >
                    Call 814-642-1253
                  </a>

                  <a
                    href="mailto:stacy@portpetals.com"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#284239]/15 bg-white px-4 text-sm font-semibold text-[#284239]"
                  >
                    Email Port Petals
                  </a>
                </div>
              </div>

              <Link
                href="/"
                className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full border border-[#284239]/15 bg-white px-6 py-3 font-semibold text-[#284239]"
              >
                Return Home
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
