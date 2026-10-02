import Image from "next/image";
import Link from "next/link";
import CartLink from "@/components/CartLink";

const occasions = [
  {
    label: "Birthdays",
    description: "Flowers, gifts & something special",
    href: "/flowers",
  },
  {
    label: "Homecoming & Prom",
    description: "Corsages, boutonnieres & bouquets",
    href: "/flowers#prom-homecoming",
  },
  {
    label: "Anniversaries",
    description: "Flowers & thoughtful gifts",
    href: "/flowers",
  },
  {
    label: "Graduation",
    description: "Flowers, gifts & Gator pride",
    href: "/gators",
  },
  {
    label: "Thank You",
    description: "Small gestures with a personal touch",
    href: "/custom",
  },
  {
    label: "Just Because",
    description: "No special occasion required",
    href: "/flowers",
  },
];

const giftGuide = [
  {
    label: "Flowers",
    description: "A classic choice for any occasion",
    href: "/flowers",
  },
  {
    label: "Candles & Small Gifts",
    description: "Easy gifts & thoughtful extras",
    href: "/candles",
  },
  {
    label: "Personalized Gifts",
    description: "Something made especially for them",
    href: "/custom",
  },
  {
    label: "Shirts",
    description: "Wearable gifts & custom designs",
    href: "/shirts",
  },
  {
    label: "Gator Gifts",
    description: "Port Allegany hometown pride",
    href: "/gators",
  },
  {
    label: "Need Something Custom?",
    description: "Call or email Port Petals",
    href: "/custom/request",
  },
];

export default function SiteHeader() {
  return (
    <header className="relative z-50 border-b border-[#284239]/10 bg-[#f7f1e8]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 sm:px-8 lg:px-10">
        <Link
          href="/"
          aria-label="Port Petals home"
          className="shrink-0"
        >
          <Image
            src="/port-petals-logo-transparent.png"
            alt="Port Petals"
            width={190}
            height={120}
            className="h-auto w-[145px] sm:w-[165px]"
            priority
          />
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-5 text-[14px] font-medium text-[#284239] lg:flex xl:gap-7 xl:text-[15px]"
        >
          <Link
            href="/flowers"
            className="transition hover:text-[#e76d61]"
          >
            Fresh Flowers
          </Link>

          <Link
            href="/candles"
            className="transition hover:text-[#e76d61]"
          >
            Candles
          </Link>

          <Link
            href="/custom"
            className="transition hover:text-[#e76d61]"
          >
            Custom Items
          </Link>

          <Link
            href="/shirts"
            className="transition hover:text-[#e76d61]"
          >
            Shirts
          </Link>

          <Link
            href="/gators"
            className="transition hover:text-[#e76d61]"
          >
            Gator Gear
          </Link>

          {/* OCCASIONS DROPDOWN */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1.5 py-4 transition hover:text-[#e76d61] group-focus-within:text-[#e76d61]"
            >
              Occasions

              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
              >
                <path
                  d="M5 7.5 10 12.5 15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="invisible absolute left-1/2 top-full w-[360px] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="overflow-hidden rounded-[1.4rem] border border-[#284239]/10 bg-[#fffaf3] p-2 shadow-[0_22px_60px_rgba(42,66,57,0.16)]">
                <div className="px-4 pb-2 pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                    Shop by Occasion
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#748078]">
                    Find something thoughtful for the moment.
                  </p>
                </div>

                <div className="grid gap-1">
                  {occasions.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="rounded-xl px-4 py-3 transition hover:bg-[#f4ebe0]"
                    >
                      <span className="block font-semibold text-[#153f32]">
                        {item.label}
                      </span>

                      <span className="mt-0.5 block text-xs font-normal text-[#748078]">
                        {item.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* GIFT GUIDE DROPDOWN */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1.5 py-4 transition hover:text-[#e76d61] group-focus-within:text-[#e76d61]"
            >
              Gift Guide

              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
              >
                <path
                  d="M5 7.5 10 12.5 15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="invisible absolute right-0 top-full w-[360px] translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="overflow-hidden rounded-[1.4rem] border border-[#284239]/10 bg-[#fffaf3] p-2 shadow-[0_22px_60px_rgba(42,66,57,0.16)]">
                <div className="px-4 pb-2 pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                    Gift Guide
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#748078]">
                    Not sure what to choose? Start here.
                  </p>
                </div>

                <div className="grid gap-1">
                  {giftGuide.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="rounded-xl px-4 py-3 transition hover:bg-[#f4ebe0]"
                    >
                      <span className="block font-semibold text-[#153f32]">
                        {item.label}
                      </span>

                      <span className="mt-0.5 block text-xs font-normal text-[#748078]">
                        {item.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/about"
            className="transition hover:text-[#e76d61]"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <CartLink />

          
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      <nav
        aria-label="Mobile navigation"
        className="flex gap-5 overflow-x-auto border-t border-[#284239]/10 px-5 py-3 text-sm font-medium text-[#284239] lg:hidden"
      >
        <Link href="/flowers" className="shrink-0">
          Flowers
        </Link>

        <Link href="/candles" className="shrink-0">
          Candles
        </Link>

        <Link href="/custom" className="shrink-0">
          Custom
        </Link>

        <Link href="/shirts" className="shrink-0">
          Shirts
        </Link>

        <Link href="/gators" className="shrink-0">
          Gator Gear
        </Link>

        <details className="group shrink-0">
          <summary className="cursor-pointer list-none whitespace-nowrap">
            Occasions ▾
          </summary>

          <div className="fixed left-4 right-4 top-[150px] z-[80] max-h-[70vh] overflow-y-auto rounded-[1.5rem] border border-[#284239]/10 bg-[#fffaf3] p-3 shadow-[0_22px_60px_rgba(42,66,57,0.22)]">
            <div className="px-3 pb-2 pt-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                Shop by Occasion
              </p>
            </div>

            {occasions.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-xl px-3 py-3 hover:bg-[#f4ebe0]"
              >
                <span className="block font-semibold text-[#153f32]">
                  {item.label}
                </span>

                <span className="mt-0.5 block text-xs font-normal text-[#748078]">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
        </details>

        <details className="group shrink-0">
          <summary className="cursor-pointer list-none whitespace-nowrap">
            Gift Guide ▾
          </summary>

          <div className="fixed left-4 right-4 top-[150px] z-[80] max-h-[70vh] overflow-y-auto rounded-[1.5rem] border border-[#284239]/10 bg-[#fffaf3] p-3 shadow-[0_22px_60px_rgba(42,66,57,0.22)]">
            <div className="px-3 pb-2 pt-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                Gift Guide
              </p>
            </div>

            {giftGuide.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-xl px-3 py-3 hover:bg-[#f4ebe0]"
              >
                <span className="block font-semibold text-[#153f32]">
                  {item.label}
                </span>

                <span className="mt-0.5 block text-xs font-normal text-[#748078]">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
        </details>

        <Link href="/about" className="shrink-0">
          About
        </Link>
      </nav>
    </header>
  );
}
