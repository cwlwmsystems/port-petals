"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/CartProvider";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function CartLink() {
  const {
    items,
    itemCount,
    subtotal,
    removeItem,
    setQuantity,
  } = useCart();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const autoCloseTimer = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  function cancelAutoClose() {
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
      autoCloseTimer.current = null;
    }
  }

  useEffect(() => {
    function handleCartAdded() {
      cancelAutoClose();
      setOpen(true);

      autoCloseTimer.current = setTimeout(() => {
        setOpen(false);
        autoCloseTimer.current = null;
      }, 4500);
    }

    window.addEventListener(
      "port-petals-cart-added",
      handleCartAdded
    );

    return () => {
      window.removeEventListener(
        "port-petals-cart-added",
        handleCartAdded
      );

      cancelAutoClose();
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const drawer =
    mounted && open
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999]"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* PAGE OVERLAY */}
            <button
              type="button"
              aria-label="Close cart"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-[#14261f]/45 backdrop-blur-[2px]"
            />

            {/* DRAWER */}
            <aside
              onPointerDown={cancelAutoClose}
              className="absolute right-0 top-0 flex h-dvh w-full max-w-[440px] flex-col bg-[#fffaf3] shadow-[-24px_0_70px_rgba(20,38,31,0.25)]"
            >
              {/* HEADER */}
              <div className="flex shrink-0 items-center justify-between border-b border-[#284239]/10 px-6 py-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
                    Your Cart
                  </p>

                  <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                    {itemCount === 0
                      ? "Your cart is empty"
                      : `${itemCount} item${
                          itemCount === 1 ? "" : "s"
                        }`}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close cart"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#284239]/10 bg-white text-xl text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                >
                  ×
                </button>
              </div>

              {/* EMPTY CART */}
              {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f4ebe0] text-[#e76d61]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="h-8 w-8"
                    >
                      <path
                        d="M3.5 4.5h2l1.65 9.05a2 2 0 0 0 1.97 1.65h7.96a2 2 0 0 0 1.94-1.53L20.5 8H6.2"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="9" cy="19" r="1.2" fill="currentColor" />
                      <circle cx="17" cy="19" r="1.2" fill="currentColor" />
                    </svg>
                  </div>

                  <h3 className="mt-5 font-serif text-2xl font-semibold text-[#153f32]">
                    Nothing here yet.
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#607068]">
                    Browse flowers, gifts, candles, shirts, and
                    Gator favorites to find something special.
                  </p>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-6 rounded-full bg-[#e76d61] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* ITEMS */}
                  <div className="flex-1 overflow-y-auto px-6">
                    {items.map((item) => {
                      const details = [
                        item.garmentType,
                        item.size,
                        item.color,
                        item.playerName
                          ? `Name: ${item.playerName}`
                          : null,
                        item.playerNumber
                          ? `#${item.playerNumber}`
                          : null,
                        ...Object.entries(
                          item.customization ?? {}
                        ).map(
                          ([key, value]) =>
                            `${key}: ${value}`
                        ),
                      ].filter(Boolean);

                      return (
                        <div
                          key={item.lineId}
                          className="border-b border-[#284239]/10 py-5"
                        >
                          <div className="flex gap-4">
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f5efe5]">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  className="h-full w-full object-contain p-1.5"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center px-2 text-center text-[10px] text-[#8a978f]">
                                  Port Petals
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              {item.productPath ? (
                                <Link
                                  href={item.productPath}
                                  onClick={() =>
                                    setOpen(false)
                                  }
                                  className="font-serif text-lg font-semibold leading-5 text-[#153f32] transition hover:text-[#e76d61]"
                                >
                                  {item.productName}
                                </Link>
                              ) : (
                                <h3 className="font-serif text-lg font-semibold leading-5 text-[#153f32]">
                                  {item.productName}
                                </h3>
                              )}

                              {details.length > 0 && (
                                <p className="mt-1.5 text-xs leading-5 text-[#748078]">
                                  {details.join(" • ")}
                                </p>
                              )}

                              <p className="mt-2 text-sm font-semibold text-[#284239]">
                                {formatMoney(item.unitPrice)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-3">
                            <div className="inline-flex items-center rounded-full border border-[#284239]/10 bg-white">
                              <button
                                type="button"
                                onClick={() =>
                                  setQuantity(
                                    item.lineId,
                                    item.quantity - 1
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-l-full text-lg text-[#284239] hover:bg-[#f4ebe0]"
                                aria-label={`Decrease ${item.productName}`}
                              >
                                −
                              </button>

                              <span className="min-w-8 text-center text-sm font-semibold text-[#284239]">
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
                                className="flex h-9 w-9 items-center justify-center rounded-r-full text-lg text-[#284239] hover:bg-[#f4ebe0]"
                                aria-label={`Increase ${item.productName}`}
                              >
                                +
                              </button>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="text-sm font-semibold text-[#153f32]">
                                {formatMoney(
                                  item.unitPrice *
                                    item.quantity
                                )}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  removeItem(item.lineId)
                                }
                                className="text-xs font-semibold text-[#8a6a62] underline underline-offset-4 transition hover:text-[#e76d61]"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* FOOTER */}
                  <div className="shrink-0 border-t border-[#284239]/10 bg-[#fffaf3] px-6 py-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#607068]">
                        Subtotal
                      </span>

                      <span className="font-serif text-2xl font-semibold text-[#153f32]">
                        {formatMoney(subtotal)}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-[#7a8780]">
                      Pickup or local delivery is selected
                      during checkout.
                    </p>

                    <Link
                      href="/cart"
                      onClick={() => setOpen(false)}
                      className="mt-5 flex w-full items-center justify-center rounded-full bg-[#e76d61] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
                    >
                      View Cart & Checkout →
                    </Link>

                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="mt-2 flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-[#284239] transition hover:bg-[#284239]/5"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </>
              )}
            </aside>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-[#284239] transition hover:bg-[#284239]/5 hover:text-[#e76d61]"
        aria-label={`Open cart with ${itemCount} item${
          itemCount === 1 ? "" : "s"
        }`}
        aria-expanded={open}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="h-6 w-6"
        >
          <path
            d="M3.5 4.5h2l1.65 9.05a2 2 0 0 0 1.97 1.65h7.96a2 2 0 0 0 1.94-1.53L20.5 8H6.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="19" r="1.35" fill="currentColor" />
          <circle cx="17" cy="19" r="1.35" fill="currentColor" />
        </svg>

        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e76d61] px-1 text-[10px] font-bold text-white">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>

      {drawer}
    </>
  );
}
