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

const shopLinks = [
  {
    label: "Candles & Gifts",
    description:
      "Candles, small gifts & thoughtful extras",
    href: "/candles",
  },
  {
    label: "Custom Creations",
    description:
      "Personalized gifts, decor & custom pieces",
    href: "/custom",
  },
  {
    label: "Shirts & Apparel",
    description:
      "Custom shirts, wearable gifts & designs",
    href: "/shirts",
  },
  {
    label: "Gator Gear",
    description:
      "Port Allegany school spirit & hometown pride",
    href: "/gators",
  },
  {
    label: "Custom Orders",
    description:
      "Request something made especially for you",
    href: "/custom/request",
  },
];

const occasions = [
  {
    label: "Birthdays",
    description:
      "Flowers, gifts & something special",
    href: "/flowers",
  },
  {
    label: "Homecoming & Prom",
    description:
      "Corsages, boutonnieres & bouquets",
    href: "/flowers#prom-homecoming",
  },
  {
    label: "Anniversaries",
    description:
      "Flowers & thoughtful gifts",
    href: "/flowers",
  },
  {
    label: "Graduation",
    description:
      "Flowers, gifts & Gator pride",
    href: "/gators",
  },
  {
    label: "Thank You",
    description:
      "Small gestures with a personal touch",
    href: "/custom",
  },
  {
    label: "Just Because",
    description:
      "No special occasion required",
    href: "/flowers",
  },
];

type DesktopMenu =
  | "shop"
  | "occasions"
  | null;

type MobileSection =
  | "shop"
  | "occasions"
  | null;

export default function SiteHeader() {
  const pathname = usePathname();
  const headerRef =
    useRef<HTMLElement>(null);

  const [
    desktopMenu,
    setDesktopMenu,
  ] =
    useState<DesktopMenu>(null);

  const [
    mobileOpen,
    setMobileOpen,
  ] =
    useState(false);

  const [
    mobileSection,
    setMobileSection,
  ] =
    useState<MobileSection>(null);

  function closeAllMenus() {
    setDesktopMenu(null);
    setMobileOpen(false);
    setMobileSection(null);
  }

  function toggleDesktopMenu(
    menu: Exclude<
      DesktopMenu,
      null
    >
  ) {
    setDesktopMenu((current) =>
      current === menu
        ? null
        : menu
    );
  }

  function toggleMobileMenu() {
    setMobileOpen((current) => {
      if (current) {
        setMobileSection(null);
      }

      return !current;
    });
  }

  function toggleMobileSection(
    section: Exclude<
      MobileSection,
      null
    >
  ) {
    setMobileSection((current) =>
      current === section
        ? null
        : section
    );
  }

  useEffect(() => {
    closeAllMenus();
  }, [pathname]);

  useEffect(() => {
    function handleOutsideClick(
      event: PointerEvent
    ) {
      if (
        headerRef.current &&
        !headerRef.current.contains(
          event.target as Node
        )
      ) {
        closeAllMenus();
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

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow =
        "";
      return;
    }

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [mobileOpen]);

  return (
    <header
      ref={headerRef}
      className="relative z-50 border-b border-[#284239]/10 bg-[#f7f1e8]/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-8 sm:py-3 lg:px-10">
        <Link
          href="/"
          onClick={closeAllMenus}
          aria-label="Port Petals home"
          className="shrink-0"
        >
          <Image
            src="/port-petals-logo-transparent.png"
            alt="Port Petals"
            width={190}
            height={120}
            className="h-auto w-[118px] sm:w-[155px] lg:w-[165px]"
            priority
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 text-[14px] font-medium text-[#284239] lg:flex xl:gap-8 xl:text-[15px]"
        >
          <Link
            href="/flowers"
            onClick={
              closeAllMenus
            }
            className="whitespace-nowrap transition hover:text-[#e76d61]"
          >
            Fresh Flowers
          </Link>

          {/* SHOP */}
          <div
            className="relative"
            onMouseEnter={() =>
              setDesktopMenu(
                "shop"
              )
            }
            onMouseLeave={() =>
              setDesktopMenu(null)
            }
          >
            <button
              type="button"
              onClick={() =>
                toggleDesktopMenu(
                  "shop"
                )
              }
              onFocus={() =>
                setDesktopMenu(
                  "shop"
                )
              }
              aria-expanded={
                desktopMenu ===
                "shop"
              }
              className={`flex items-center gap-1.5 whitespace-nowrap py-4 transition ${
                desktopMenu ===
                "shop"
                  ? "text-[#e76d61]"
                  : "hover:text-[#e76d61]"
              }`}
            >
              Shop

              <ChevronIcon
                open={
                  desktopMenu ===
                  "shop"
                }
              />
            </button>

            <div
              className={`absolute left-1/2 top-full w-[390px] -translate-x-1/2 transition-all duration-200 ${
                desktopMenu ===
                "shop"
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-2 opacity-0"
              }`}
            >
              <div className="overflow-hidden rounded-[1.4rem] border border-[#284239]/10 bg-[#fffaf3] p-2 shadow-[0_22px_60px_rgba(42,66,57,0.16)]">
                <div className="px-4 pb-2 pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                    Shop Port Petals
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#748078]">
                    Gifts,
                    apparel,
                    custom
                    creations &
                    hometown
                    favorites.
                  </p>
                </div>

                <div className="grid gap-1">
                  {shopLinks.map(
                    (item) => (
                      <Link
                        key={
                          item.label
                        }
                        href={
                          item.href
                        }
                        onClick={
                          closeAllMenus
                        }
                        className="rounded-xl px-4 py-3 transition hover:bg-[#f4ebe0]"
                      >
                        <span className="block font-semibold text-[#153f32]">
                          {
                            item.label
                          }
                        </span>

                        <span className="mt-0.5 block text-xs font-normal text-[#748078]">
                          {
                            item.description
                          }
                        </span>
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/seasonal"
            onClick={
              closeAllMenus
            }
            className="whitespace-nowrap transition hover:text-[#e76d61]"
          >
            Seasonal
          </Link>

          <Link
            href="/weddings"
            onClick={
              closeAllMenus
            }
            className="whitespace-nowrap transition hover:text-[#e76d61]"
          >
            Weddings & Events
          </Link>

          {/* OCCASIONS */}
          <div
            className="relative"
            onMouseEnter={() =>
              setDesktopMenu(
                "occasions"
              )
            }
            onMouseLeave={() =>
              setDesktopMenu(null)
            }
          >
            <button
              type="button"
              onClick={() =>
                toggleDesktopMenu(
                  "occasions"
                )
              }
              onFocus={() =>
                setDesktopMenu(
                  "occasions"
                )
              }
              aria-expanded={
                desktopMenu ===
                "occasions"
              }
              className={`flex items-center gap-1.5 whitespace-nowrap py-4 transition ${
                desktopMenu ===
                "occasions"
                  ? "text-[#e76d61]"
                  : "hover:text-[#e76d61]"
              }`}
            >
              Occasions

              <ChevronIcon
                open={
                  desktopMenu ===
                  "occasions"
                }
              />
            </button>

            <div
              className={`absolute left-1/2 top-full w-[360px] -translate-x-1/2 transition-all duration-200 ${
                desktopMenu ===
                "occasions"
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-2 opacity-0"
              }`}
            >
              <div className="overflow-hidden rounded-[1.4rem] border border-[#284239]/10 bg-[#fffaf3] p-2 shadow-[0_22px_60px_rgba(42,66,57,0.16)]">
                <div className="px-4 pb-2 pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                    Shop by
                    Occasion
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#748078]">
                    Find
                    something
                    thoughtful
                    for the
                    moment.
                  </p>
                </div>

                <div className="grid gap-1">
                  {occasions.map(
                    (item) => (
                      <Link
                        key={
                          item.label
                        }
                        href={
                          item.href
                        }
                        onClick={
                          closeAllMenus
                        }
                        className="rounded-xl px-4 py-3 transition hover:bg-[#f4ebe0]"
                      >
                        <span className="block font-semibold text-[#153f32]">
                          {
                            item.label
                          }
                        </span>

                        <span className="mt-0.5 block text-xs font-normal text-[#748078]">
                          {
                            item.description
                          }
                        </span>
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/about"
            onClick={
              closeAllMenus
            }
            className="whitespace-nowrap transition hover:text-[#e76d61]"
          >
            About
          </Link>
        </nav>

        {/* CART + MOBILE MENU */}
        <div className="flex shrink-0 items-center gap-2">
          <CartLink />

          <button
            type="button"
            onClick={
              toggleMobileMenu
            }
            aria-expanded={
              mobileOpen
            }
            aria-controls="mobile-site-menu"
            aria-label={
              mobileOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#284239]/15 bg-white/60 text-[#284239] transition active:scale-95 lg:hidden"
          >
            {mobileOpen ? (
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={
              closeAllMenus
            }
            className="fixed inset-0 top-[82px] z-40 bg-[#153f32]/20 backdrop-blur-[1px] lg:hidden"
          />

          <div
            id="mobile-site-menu"
            className="absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-82px)] overflow-y-auto border-t border-[#284239]/10 bg-[#fffaf3] shadow-[0_24px_50px_rgba(42,66,57,0.16)] lg:hidden"
          >
            <div className="px-4 pb-8 pt-4 sm:px-8">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
                Port Petals
              </p>

              <nav
                aria-label="Mobile primary navigation"
                className="mt-3 grid"
              >
                <MobileLink
                  href="/flowers"
                  onClick={
                    closeAllMenus
                  }
                >
                  Fresh Flowers
                </MobileLink>

                {/* SHOP */}
                <div className="border-b border-[#284239]/8">
                  <button
                    type="button"
                    onClick={() =>
                      toggleMobileSection(
                        "shop"
                      )
                    }
                    aria-expanded={
                      mobileSection ===
                      "shop"
                    }
                    className="flex min-h-12 w-full items-center justify-between rounded-xl px-3 text-left text-[15px] font-semibold text-[#153f32] transition active:bg-[#f4ebe0]"
                  >
                    <span>
                      Shop
                    </span>

                    <ChevronIcon
                      open={
                        mobileSection ===
                        "shop"
                      }
                    />
                  </button>

                  {mobileSection ===
                    "shop" && (
                    <div className="mb-2 grid rounded-xl bg-[#f7f1e8] p-2">
                      {shopLinks.map(
                        (
                          item
                        ) => (
                          <Link
                            key={
                              item.label
                            }
                            href={
                              item.href
                            }
                            onClick={
                              closeAllMenus
                            }
                            className="rounded-lg px-3 py-3 transition active:bg-white"
                          >
                            <span className="block text-sm font-semibold text-[#153f32]">
                              {
                                item.label
                              }
                            </span>

                            <span className="mt-0.5 block text-xs leading-5 text-[#748078]">
                              {
                                item.description
                              }
                            </span>
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>

                <MobileLink
                  href="/seasonal"
                  onClick={
                    closeAllMenus
                  }
                >
                  Seasonal
                </MobileLink>

                <MobileLink
                  href="/weddings"
                  onClick={
                    closeAllMenus
                  }
                >
                  Weddings & Events
                </MobileLink>

                {/* OCCASIONS */}
                <div className="border-b border-[#284239]/8">
                  <button
                    type="button"
                    onClick={() =>
                      toggleMobileSection(
                        "occasions"
                      )
                    }
                    aria-expanded={
                      mobileSection ===
                      "occasions"
                    }
                    className="flex min-h-12 w-full items-center justify-between rounded-xl px-3 text-left text-[15px] font-semibold text-[#153f32] transition active:bg-[#f4ebe0]"
                  >
                    <span>
                      Occasions
                    </span>

                    <ChevronIcon
                      open={
                        mobileSection ===
                        "occasions"
                      }
                    />
                  </button>

                  {mobileSection ===
                    "occasions" && (
                    <div className="mb-2 grid rounded-xl bg-[#f7f1e8] p-2">
                      {occasions.map(
                        (
                          item
                        ) => (
                          <Link
                            key={
                              item.label
                            }
                            href={
                              item.href
                            }
                            onClick={
                              closeAllMenus
                            }
                            className="rounded-lg px-3 py-3 transition active:bg-white"
                          >
                            <span className="block text-sm font-semibold text-[#153f32]">
                              {
                                item.label
                              }
                            </span>

                            <span className="mt-0.5 block text-xs leading-5 text-[#748078]">
                              {
                                item.description
                              }
                            </span>
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>

                <MobileLink
                  href="/about"
                  onClick={
                    closeAllMenus
                  }
                >
                  About Port Petals
                </MobileLink>
              </nav>

              {/* MORE */}
              <div className="mt-4 border-t border-[#284239]/10 pt-4">
                <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#718078]">
                  More from Port
                  Petals
                </p>

                <nav className="mt-2 grid">
                  <MobileLink
                    href="/journal"
                    onClick={
                      closeAllMenus
                    }
                  >
                    Journal &
                    Inspiration
                  </MobileLink>

                  <MobileLink
                    href="/fulfillment"
                    onClick={
                      closeAllMenus
                    }
                  >
                    Pickup &
                    Delivery
                  </MobileLink>

                  <MobileLink
                    href="/custom/request"
                    onClick={
                      closeAllMenus
                    }
                  >
                    Custom Orders
                  </MobileLink>
                </nav>
              </div>

              {/* CONTACT */}
              <div className="mt-4 rounded-[1.25rem] bg-[#edf3e7] p-4">
                <p className="text-sm font-semibold text-[#153f32]">
                  Need help
                  choosing?
                </p>

                <p className="mt-1 text-xs leading-5 text-[#607068]">
                  Contact Port
                  Petals directly
                  for product,
                  custom-order,
                  pickup, or
                  delivery
                  questions.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href="tel:+18146421253"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#284239] px-4 text-sm font-semibold text-white"
                  >
                    Call the Shop
                  </a>

                  <a
                    href="mailto:stacy@portpetals.com"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#284239]/15 bg-white px-4 text-sm font-semibold text-[#284239]"
                  >
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex min-h-12 items-center border-b border-[#284239]/8 px-3 text-[15px] font-semibold text-[#153f32] transition last:border-b-0 active:bg-[#f4ebe0]"
    >
      {children}
    </Link>
  );
}

function ChevronIcon({
  open,
}: {
  open: boolean;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
        open
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
  );
}
