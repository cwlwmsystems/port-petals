import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="relative z-50 border-b border-[#284239]/10 bg-[#f7f1e8]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-5 py-3 sm:px-8 lg:px-10">
        <Link href="/" aria-label="Port Petals home" className="shrink-0">
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
          className="hidden items-center gap-7 text-[15px] font-medium text-[#284239] lg:flex"
        >
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

          <Link href="/about" className="transition hover:text-[#e76d61]">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-[#284239] transition hover:text-[#e76d61] sm:block"
          >
            Cart
          </button>

          <Link
            href="/"
            className="rounded-full bg-[#e76d61] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d85b50]"
          >
            Home
          </Link>
        </div>
      </div>

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

        <Link href="/about" className="shrink-0">
          About
        </Link>
      </nav>
    </header>
  );
}
