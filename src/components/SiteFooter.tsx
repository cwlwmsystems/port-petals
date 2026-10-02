import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#284239]/10 bg-[#f1e8dc] text-[#284239]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          {/* Port Petals */}
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

            <p className="mt-4 max-w-md text-sm leading-6 text-[#637068]">
              Fresh flowers, candles, custom creations, shirts, and hometown
              Gator gear from Port Petals in Port Allegany, Pennsylvania.
            </p>

            <p className="mt-6 text-xs text-[#718078]">
              © {new Date().getFullYear()} Port Petals. All rights reserved.
            </p>
          </div>

          {/* Pickup & Delivery */}
          <div className="md:justify-self-end md:max-w-md">
            <h2 className="font-serif text-xl font-semibold text-[#153f32]">
              Pickup & Delivery
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#607068]">
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

        {/* Cwlwm Systems credit */}
        <div className="mt-10 border-t border-[#284239]/10 pt-6">
          <p className="text-center text-[11px] leading-5 text-[#7d8982]">
            This site was created and is maintained by Kasey Pelchy of{" "}
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
      </div>
    </footer>
  );
}
