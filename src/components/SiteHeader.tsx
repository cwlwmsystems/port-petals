"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
} from "react";
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

type MenuName = "occasions" | "gift" | null;

export default function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  const [openMenu, setOpenMenu] =
    useState<MenuName>(null);

  function closeMenus() {
    setOpenMenu(null);
  }

  function toggleMenu(menu: Exclude<MenuName, null>) {
    setOpenMenu((current) =>
      current === menu ? null : menu
    );
  }

  useEffect(() => {
    closeMenus();
  }, [pathname]);

  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(
          event.target as Node
        )
      ) {
        closeMenus();
      }
    }

    document.addEventListener(
      "pointerdown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="relative z-50 border-b border-[#284239]/10 bg-[#f7f1e8]/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 sm:px-8 lg:px-10">
        <Link
          href="/"
          onClick={closeMenus}
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

        {/* DESKTOP NAVIGATION */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-5 text-[14px] font-medium text-[#284239] lg:flex xl:gap-7 xl:text-[15px]"
        >
          <Link
            href="/flowers"
            onClick={closeMenus}
            className="transition hover:text-[#e76d61]"
          >
            Fresh Flowers
          </Link>

          <Link
            href="/candles"
            onClick={closeMenus}
            className="transition hover:text-[#e76d61]"
          >
            Candles
          </Link>

          <Link
            href="/custom"
            onClick={closeMenus}
            className="transition hover:text-[#e76d61]"
          >
            Custom Items
          </Link>

          <Link
            href="/shirts"
            onClick={closeMenus}
            className="transition hover:text-[#e76d61]"
          >
            Shirts
          </Link>

          <Link
            href="/gators"
            onClick={closeMenus}
            className="transition hover:text-[#e76d61]"
          >
            Gator Gear
          </Link>

          {/* OCCASIONS */}
          <div
            className="relative"
            onMouseEnter={() =>
              setOpenMenu("occasions")
            }
            onMouseLeave={() =>
              setOpenMenu(null)
            }
          >
            <button
              type="button"
              onClick={() =>
                toggleMenu("occasions")
              }
              onFocus={() =>
                setOpenMenu("occasions")
              }
              aria-expanded={
                openMenu === "occasions"
              }
              className={`flex items-center gap-1.5 py-4 transition ${
                openMenu === "occasions"
                  ? "text-[#e76d61]"
                  : "hover:text-[#e76d61]"
              }`}
            >
              Occasions

              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  openMenu === "occasions"
                    ? "rotate-180"
                    : ""
                }`}
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

            <div
              className={`absolute left-1/2 top-full w-[360px] -translate-x-1/2 transition-all duration-200 ${
                openMenu === "occasions"
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-2 opacity-0"
              }`}
            >
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
                      onClick={closeMenus}
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

          {/* GIFT GUIDE */}
          <div
            className="relative"
            onMouseEnter={() =>
              setOpenMenu("gift")
            }
            onMouseLeave={() =>
              setOpenMenu(null)
            }
          >
            <button
              type="button"
              onClick={() =>
                toggleMenu("gift")
              }
              onFocus={() =>
                setOpenMenu("gift")
              }
              aria-expanded={openMenu === "gift"}
              className={`flex items-center gap-1.5 py-4 transition ${
                openMenu === "gift"
                  ? "text-[#e76d61]"
                  : "hover:text-[#e76d61]"
              }`}
            >
              Gift Guide

              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  openMenu === "gift"
                    ? "rotate-180"
                    : ""
                }`}
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

            <div
              className={`absolute right-0 top-full w-[360px] transition-all duration-200 ${
                openMenu === "gift"
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-2 opacity-0"
              }`}
            >
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
                      onClick={closeMenus}
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
            onClick={closeMenus}
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
        <Link
          href="/flowers"
          onClick={closeMenus}
          className="shrink-0"
        >
          Flowers
        </Link>

        <Link
          href="/candles"
          onClick={closeMenus}
          className="shrink-0"
        >
          Candles
        </Link>

        <Link
          href="/custom"
          onClick={closeMenus}
          className="shrink-0"
        >
          Custom
        </Link>

        <Link
          href="/shirts"
          onClick={closeMenus}
          className="shrink-0"
        >
          Shirts
        </Link>

        <Link
          href="/gators"
          onClick={closeMenus}
          className="shrink-0"
        >
          Gator Gear
        </Link>

        <button
          type="button"
          onClick={() =>
            toggleMenu("occasions")
          }
          className="shrink-0 whitespace-nowrap"
        >
          Occasions ▾
        </button>

        <button
          type="button"
          onClick={() =>
            toggleMenu("gift")
          }
          className="shrink-0 whitespace-nowrap"
        >
          Gift Guide ▾
        </button>

        <Link
          href="/about"
          onClick={closeMenus}
          className="shrink-0"
        >
          About
        </Link>
      </nav>

      {/* MOBILE OCCASIONS PANEL */}
      {openMenu === "occasions" && (
        <div className="absolute left-4 right-4 top-full z-[80] max-h-[70vh] overflow-y-auto rounded-[1.5rem] border border-[#284239]/10 bg-[#fffaf3] p-3 shadow-[0_22px_60px_rgba(42,66,57,0.22)] lg:hidden">
          <div className="flex items-center justify-between px-3 pb-2 pt-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
              Shop by Occasion
            </p>

            <button
              type="button"
              onClick={closeMenus}
              className="text-xl text-[#284239]"
              aria-label="Close occasions menu"
            >
              ×
            </button>
          </div>

          {occasions.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeMenus}
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
      )}

      {/* MOBILE GIFT GUIDE PANEL */}
      {openMenu === "gift" && (
        <div className="absolute left-4 right-4 top-full z-[80] max-h-[70vh] overflow-y-auto rounded-[1.5rem] border border-[#284239]/10 bg-[#fffaf3] p-3 shadow-[0_22px_60px_rgba(42,66,57,0.22)] lg:hidden">
          <div className="flex items-center justify-between px-3 pb-2 pt-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
              Gift Guide
            </p>

            <button
              type="button"
              onClick={closeMenus}
              className="text-xl text-[#284239]"
              aria-label="Close gift guide"
            >
              ×
            </button>
          </div>

          {giftGuide.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeMenus}
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
      )}
    </header>
  );
}
