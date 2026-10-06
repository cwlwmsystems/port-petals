"use client";

import { useMemo, useState } from "react";

type ProductCardCarouselProps = {
  children: React.ReactNode[];
  visibleCount?: number;
};

export default function ProductCardCarousel({
  children,
  visibleCount = 3,
}: ProductCardCarouselProps) {
  const [pageIndex, setPageIndex] = useState(0);

  const total = children.length;
  const pageCount = Math.ceil(total / visibleCount);

  const visibleItems = useMemo(() => {
    const start = pageIndex * visibleCount;
    const end = start + visibleCount;

    return children.slice(start, end);
  }, [children, pageIndex, visibleCount]);

  if (total <= visibleCount) {
    return (
      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {children}
      </div>
    );
  }

  const canGoBack = pageIndex > 0;
  const canGoNext = pageIndex < pageCount - 1;

  function goNext() {
    if (canGoNext) {
      setPageIndex((current) => current + 1);
    }
  }

  function goBack() {
    if (canGoBack) {
      setPageIndex((current) => current - 1);
    }
  }

  return (
    <div>
      <div
        key={pageIndex}
        className="pp-fade-up grid gap-7 md:grid-cols-2 xl:grid-cols-3"
      >
        {visibleItems}
      </div>

      <div className="mt-7 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={goBack}
          disabled={!canGoBack}
          aria-label="Previous products"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-xl font-semibold shadow-sm transition ${
            canGoBack
              ? "border-[#284239]/15 bg-white text-[#284239] hover:-translate-y-0.5 hover:border-[#e76d61]/40 hover:text-[#e76d61] hover:shadow-md active:scale-[0.96]"
              : "cursor-not-allowed border-[#284239]/10 bg-[#f2f0ec] text-[#a8aaa6]"
          }`}
        >
          ←
        </button>

        <p className="min-w-16 text-center text-sm text-[#718078]">
          {pageIndex + 1} of {pageCount}
        </p>

        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext}
          aria-label="Next products"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-xl font-semibold shadow-sm transition ${
            canGoNext
              ? "border-[#284239]/15 bg-white text-[#284239] hover:-translate-y-0.5 hover:border-[#e76d61]/40 hover:text-[#e76d61] hover:shadow-md active:scale-[0.96]"
              : "cursor-not-allowed border-[#284239]/10 bg-[#f2f0ec] text-[#a8aaa6]"
          }`}
        >
          →
        </button>
      </div>
    </div>
  );
}
