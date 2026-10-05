"use client";

import {
  useEffect,
  useState,
} from "react";

function formatPrice(
  value: number | null
) {
  if (value === null) {
    return "View options";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  ).format(value);
}

export default function StickyProductCTA({
  productName,
  startingPrice,
  targetId = "product-order",
}: {
  productName: string;
  startingPrice: number | null;
  targetId?: string;
}) {
  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    const target =
      document.getElementById(
        targetId
      );

    if (!target) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          setVisible(
            !entry.isIntersecting &&
              entry.boundingClientRect
                .top < 0
          );
        },
        {
          threshold: 0.08,
        }
      );

    observer.observe(
      target
    );

    return () =>
      observer.disconnect();
  }, [targetId]);

  function handleClick() {
    const target =
      document.getElementById(
        targetId
      );

    target?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-[#284239]/10 bg-[#fffaf3]/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-12px_35px_rgba(21,63,50,0.14)] backdrop-blur-xl transition duration-300 lg:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-[#607068]">
            {productName}
          </p>

          <p className="mt-0.5 text-base font-semibold text-[#153f32]">
            {startingPrice !==
            null
              ? `From ${formatPrice(
                  startingPrice
                )}`
              : "Choose your options"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleClick}
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#e76d61] px-5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]"
        >
          Choose Options
        </button>
      </div>
    </div>
  );
}
