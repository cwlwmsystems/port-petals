import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#284239]/10 bg-[#f1e8dc] text-[#284239]">
      <div className="w-full px-6 pt-8 pb-5 sm:px-10 lg:px-14 xl:px-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.35fr_0.7fr_0.85fr_1fr_1fr] lg:items-start lg:gap-12">
          {/* Brand */}
          <div>
            <Link href="/" aria-label="Port Petals home">
              <Image
                src="/port-petals-logo-transparent.png"
                alt="Port Petals"
                width={210}
                height={140}
                className="h-auto w-[140px]"
              />
            </Link>

            <p className="mt-3 max-w-xs text-[13px] leading-5 text-[#637068]">
              Fresh flowers, candles, custom creations, shirts, and hometown
              Gator gear from Port Petals in Port Allegany, Pennsylvania.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h2 className="font-serif text-base font-semibold text-[#153f32]">
              Shop
            </h2>

            <nav className="mt-3 grid gap-1.5 text-[13px] text-[#607068]">
              <Link href="/flowers" className="transition hover:text-[#e76d61]">
                Flowers
              </Link>

              <Link href="/candles" className="transition hover:text-[#e76d61]">
                Candles
              </Link>

              <Link href="/custom" className="transition hover:text-[#e76d61]">
                Custom Creations
              </Link>

              <Link href="/shirts" className="transition hover:text-[#e76d61]">
                Shirts
              </Link>

              <Link href="/gators" className="transition hover:text-[#e76d61]">
                Gator Gear
              </Link>
            </nav>
          </div>

          {/* Inspiration / Blog */}
          <div>
            <h2 className="font-serif text-base font-semibold text-[#153f32]">
              Inspiration
            </h2>

            <div className="mt-3 grid gap-1.5 text-[13px] text-[#607068]">
              <Link
                href="/journal/seasonal-ideas"
                className="transition hover:text-[#e76d61]"
              >
                Seasonal Ideas
              </Link>

              <Link
                href="/journal/flower-care"
                className="transition hover:text-[#e76d61]"
              >
                Flower Care
              </Link>

              <Link
                href="/journal/gift-guides"
                className="transition hover:text-[#e76d61]"
              >
                Gift Guides
              </Link>

              <Link
                href="/journal/shop-news"
                className="transition hover:text-[#e76d61]"
              >
                Shop News
              </Link>

              <Link
                href="/journal"
                className="mt-1 text-[11px] font-semibold text-[#36594c] transition hover:text-[#e76d61]"
              >
                View Journal →
              </Link>
            </div>
          </div>

          {/* Company & Policies */}
          <div>
            <h2 className="font-serif text-base font-semibold text-[#153f32]">
              Company & Policies
            </h2>

            <nav className="mt-3 grid gap-1.5 text-[13px] text-[#607068]">
              <Link href="/about" className="transition hover:text-[#e76d61]">
                About Port Petals
              </Link>

              <Link
                href="/fulfillment"
                className="transition hover:text-[#e76d61]"
              >
                Pickup & Delivery
              </Link>

              <Link
                href="/custom/request"
                className="transition hover:text-[#e76d61]"
              >
                Custom Orders
              </Link>

              <Link
                href="/privacy"
                className="transition hover:text-[#e76d61]"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="transition hover:text-[#e76d61]"
              >
                Terms & Policies
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="lg:text-right">
            <h2 className="font-serif text-base font-semibold text-[#153f32]">
              Contact
            </h2>

            <div className="mt-3 space-y-1.5 text-[13px] leading-5 text-[#607068]">
              <p>
                430 E Arnold Avenue
                <br />
                Port Allegany, PA 16743
              </p>

              <p className="pt-1">
                <a
                  href="tel:+18146421253"
                  className="transition hover:text-[#e76d61]"
                >
                  814-642-1253
                </a>
              </p>

              <p>
                <a
                  href="mailto:stacy@portpetals.com"
                  className="transition hover:text-[#e76d61]"
                >
                  stacy@portpetals.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-7 border-t border-[#284239]/10 pt-4">
          <div className="flex flex-col gap-3 text-[11px] text-[#718078] md:flex-row md:items-center md:justify-between">
            <div className="leading-4">
              <p>
                © {new Date().getFullYear()} Port Petals. All rights reserved.
              </p>

              <p>
                Created and maintained by Kasey Pelchy of{" "}
                <a
                  href="https://www.cwlwmsystems.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#36594c] transition hover:text-[#e76d61]"
                >
                  Cwlwm Systems
                </a>
                .
              </p>
            </div>

            <div className="md:text-right">
              <div className="flex items-center gap-1.5 font-semibold text-[#284239] md:justify-end">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>

                <span>Secure checkout powered by Square</span>
              </div>

              <p className="mt-0.5 text-[10px] tracking-wide text-[#7d8982]">
                Visa · Mastercard · American Express · Discover
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
