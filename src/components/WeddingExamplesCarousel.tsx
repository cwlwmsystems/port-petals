"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
} from "react";

export type WeddingExample = {
  title: string;
  eyebrow: string;
  description: string;
  details: string;
  image: string;
  imageAlt: string;
};

type Props = {
  examples: WeddingExample[];
};

export default function WeddingExamplesCarousel({
  examples,
}: Props) {
  const trackRef =
    useRef<HTMLDivElement>(null);

  const [canGoLeft, setCanGoLeft] =
    useState(false);

  const [
    canGoRight,
    setCanGoRight,
  ] = useState(true);

  function updateButtons() {
    const track =
      trackRef.current;

    if (!track) {
      return;
    }

    const maxScroll =
      track.scrollWidth -
      track.clientWidth;

    setCanGoLeft(
      track.scrollLeft > 4
    );

    setCanGoRight(
      track.scrollLeft <
        maxScroll - 4
    );
  }

  function scroll(
    direction:
      | "left"
      | "right"
  ) {
    const track =
      trackRef.current;

    if (!track) {
      return;
    }

    track.scrollBy({
      left:
        direction === "right"
          ? track.clientWidth
          : -track.clientWidth,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const track =
      trackRef.current;

    if (!track) {
      return;
    }

    updateButtons();

    const handleScroll =
      () => {
        updateButtons();
      };

    const resizeObserver =
      new ResizeObserver(
        updateButtons
      );

    track.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    resizeObserver.observe(
      track
    );

    return () => {
      track.removeEventListener(
        "scroll",
        handleScroll
      );

      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative mt-9">
      {/* ARROWS */}
      <div className="mb-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={() =>
            scroll("left")
          }
          disabled={!canGoLeft}
          aria-label="Previous wedding flower examples"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#284239]/15 bg-white text-[#153f32] shadow-sm transition hover:border-[#e76d61]/40 hover:text-[#e76d61] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() =>
            scroll("right")
          }
          disabled={!canGoRight}
          aria-label="Next wedding flower examples"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#284239]/15 bg-white text-[#153f32] shadow-sm transition hover:border-[#e76d61]/40 hover:text-[#e76d61] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* TRACK */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {examples.map(
          (example) => (
            <article
              key={
                example.title
              }
              className="group min-w-[calc(100%-0px)] snap-start overflow-hidden rounded-[1.5rem] border border-[#284239]/10 bg-[#faf7f1] shadow-[0_10px_30px_rgba(42,66,57,0.05)] sm:min-w-[calc(50%-10px)] lg:min-w-[calc(25%-15px)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#efe8dd]">
                <Image
                  src={
                    example.image
                  }
                  alt={
                    example.imageAlt
                  }
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.025]"
                />
              </div>

              <div className="p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b45f75]">
                  {
                    example.eyebrow
                  }
                </p>

                <h3 className="mt-3 font-serif text-2xl font-semibold text-[#153f32]">
                  {
                    example.title
                  }
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#607068]">
                  {
                    example.description
                  }
                </p>

                <p className="mt-4 border-t border-[#284239]/10 pt-4 text-xs leading-5 text-[#718078]">
                  {
                    example.details
                  }
                </p>
              </div>
            </article>
          )
        )}
      </div>

      <p className="mt-3 text-center text-xs text-[#718078] sm:hidden">
        Swipe to browse wedding
        flower examples
      </p>
    </div>
  );
}
