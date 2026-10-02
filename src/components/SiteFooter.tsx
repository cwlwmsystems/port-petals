import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#284239]/10 bg-[#f1e8dc] text-[#284239]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" aria-label="Port Petals home">
              <Image
                src="/port-petals-logo-transparent.png"
                alt="Port Petals"
                width={210}
                height={140}
                className="h-auto w-[165px]"
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#637068]">
              Fresh flowers, candles, custom creations, shirts, and hometown
              Gator gear from Port Petals in Port Allegany, Pennsylvania.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-lg font-semibold text-[#153f32]">
              Shop
            </h2>

            <nav className="mt-4 grid gap-3 text-sm text-[#607068]">
              <Link href="/flowers" className="transition hover:text-[#e76d61]">
                Fresh Flowers
              </Link>
              <Link href="/candles" className="transition hover:text-[#e76d61]">
                Candles
              </Link>
              <Link href="/custom" className="transition hover:text-[#e76d61]">
                Custom Items
              </Link>
              <Link href="/shirts" className="transition hover:text-[#e76d61]">
                Shirts
              </Link>
              <Link href="/gators" className="transition hover:text-[#e76d61]">
                Gator Gear
              </Link>
            </nav>
          </div>

          <div>
            <h2 className="font-serif text-lg font-semibold text-[#153f32]">
              Information
            </h2>

            <nav className="mt-4 grid gap-3 text-sm text-[#607068]">
              <Link href="/about" className="transition hover:text-[#e76d61]">
                About & Contact
              </Link>
              <Link
                href="/fulfillment"
                className="transition hover:text-[#e76d61]"
              >
                Pickup & Delivery
              </Link>
            </nav>
          </div>

          <div>
            <h2 className="font-serif text-lg font-semibold text-[#153f32]">
              Pickup & Delivery
            </h2>

            <p className="mt-4 text-sm leading-6 text-[#607068]">
              Orders are available for pickup or approved local delivery within
              approximately 10 miles of Port Allegany, Pennsylvania.
            </p>

            <p className="mt-3 text-sm font-semibold text-[#e76d61]">
              Shipping is not currently offered.
            </p>

            <Link
              href="/fulfillment"
              className="mt-5 inline-flex text-sm font-semibold text-[#284239] transition hover:text-[#e76d61]"
            >
              View Pickup & Delivery Details →
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[#284239]/10 pt-6 text-xs text-[#718078] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Port Petals. All rights reserved.
          </p>

          <div className="flex flex-col gap-1 sm:text-right">
            <p>430 E Arnold Avenue, Port Allegany, PA 16743</p>
            <p>
              <a
                href="tel:+18146421253"
                className="transition hover:text-[#e76d61]"
              >
                814-642-1253
              </a>
              {" · "}
              <a
                href="mailto:PortPetals@yahoo.com"
                className="transition hover:text-[#e76d61]"
              >
                PortPetals@yahoo.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
