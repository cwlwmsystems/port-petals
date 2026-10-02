"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "./actions";

type OrderStatusActionsProps = {
  orderId: string;
  currentStatus: string;
  paymentStatus: string;
};

const nextStatuses: Record<string, string | null> = {
  paid: "preparing",
  preparing: "ready",
  ready: "completed",
  completed: null,
  cancelled: null,
  refunded: null,
  awaiting_payment: null,
  pending: null,
};

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function OrderStatusActions({
  orderId,
  currentStatus,
  paymentStatus,
}: OrderStatusActionsProps) {
  const [isPending, startTransition] =
    useTransition();

  const [error, setError] = useState("");

  const nextStatus =
    nextStatuses[currentStatus] ?? null;

  function changeStatus(status: string) {
    setError("");

    startTransition(async () => {
      try {
        await updateOrderStatus(
          orderId,
          status as
            | "paid"
            | "preparing"
            | "ready"
            | "completed"
            | "cancelled"
        );
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to update order."
        );
      }
    });
  }

  const locked =
    currentStatus === "completed" ||
    currentStatus === "cancelled" ||
    currentStatus === "refunded";

  return (
    <section className="rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm">
      <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
        Order Status
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#607068]">
        Current status:{" "}
        <strong className="text-[#153f32]">
          {formatLabel(currentStatus)}
        </strong>
      </p>

      {error && (
        <div className="mt-4 rounded-xl bg-[#fff0ed] p-3 text-sm text-[#a7473f]">
          {error}
        </div>
      )}

      {!locked &&
        nextStatus &&
        paymentStatus === "paid" && (
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              changeStatus(nextStatus)
            }
            className="mt-5 w-full rounded-xl bg-[#284239] px-5 py-3 font-semibold text-white transition hover:bg-[#1d332b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending
              ? "Updating..."
              : `Mark ${formatLabel(nextStatus)}`}
          </button>
        )}

      {!locked && currentStatus !== "cancelled" && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            const confirmed = window.confirm(
              "Cancel this order? This does not automatically refund a Square payment."
            );

            if (confirmed) {
              changeStatus("cancelled");
            }
          }}
          className="mt-3 w-full rounded-xl border border-[#a7473f]/30 px-5 py-3 font-semibold text-[#a7473f] transition hover:bg-[#fff0ed] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel Order
        </button>
      )}

      {locked && (
        <div className="mt-5 rounded-xl bg-[#f7f1e8] p-4 text-sm leading-6 text-[#607068]">
          This order is closed and cannot be moved to
          another fulfillment status.
        </div>
      )}

      {paymentStatus !== "paid" &&
        !locked && (
          <div className="mt-5 rounded-xl bg-[#fff4f1] p-4 text-sm leading-6 text-[#8c433b]">
            Fulfillment cannot begin until payment is
            confirmed.
          </div>
        )}
    </section>
  );
}
