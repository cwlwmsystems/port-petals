"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "port-petals-new-site-notice-dismissed";

export default function NewWebsiteNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed =
      window.localStorage.getItem(STORAGE_KEY);

    if (dismissed !== "true") {
      setVisible(true);
    }
  }, []);

  function dismissNotice() {
    window.localStorage.setItem(
      STORAGE_KEY,
      "true"
    );

    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <aside
      aria-label="New Port Petals website announcement"
      className="fixed bottom-5 right-5 z-[60] w-[calc(100%-2.5rem)] max-w-md overflow-hidden rounded-[1.6rem] border border-[#284239]/10 bg-[#fffaf3]/95 shadow-[0_22px_65px_rgba(42,66,57,0.22)] backdrop-blur sm:bottom-7 sm:right-7"
    >
      <div className="relative p-6 pr-12">
        <button
          type="button"
          onClick={dismissNotice}
          aria-label="Close announcement"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#284239]/10 bg-white text-lg font-semibold text-[#607068] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
        >
          ×
        </button>

        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          Something New
        </p>

        <h2 className="mt-2 font-serif text-2xl font-semibold text-[#153f32]">
          Port Petals is now online!
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#607068]">
          You can now browse flowers, gifts, candles, shirts,
          custom creations, and Gator Gear — and place your
          order online for pickup or eligible local delivery.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="#shop"
            className="inline-flex items-center justify-center rounded-full bg-[#e76d61] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d95d52]"
          >
            Start Shopping →
          </Link>

          <Link
            href="/fulfillment"
            className="inline-flex items-center justify-center rounded-full border border-[#284239]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
          >
            Pickup & Delivery
          </Link>
        </div>
      </div>
    </aside>
  );
}
