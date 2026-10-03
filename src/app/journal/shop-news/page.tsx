import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop News",
  description:
    "Port Petals shop updates, seasonal collections, new products, local events, and Port Allegany Gator gear news.",
};

export default function ShopNewsPage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="border-b border-[#284239]/10 bg-[#f1e8dc]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
            Port Petals Journal
          </p>

          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
            Shop news
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#52655d]">
            A home for new products, seasonal collections, local events, school
            spirit, and other updates from Port Petals.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-[#284239]/10 bg-white/70 p-8 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
            New Journal
          </p>

          <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
            More shop updates are coming.
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-[#607068]">
            This section will be used for Port Petals announcements, new
            products, seasonal collections, event-related items, Gator gear,
            and other shop updates.
          </p>

          <p className="mt-4 max-w-3xl leading-7 text-[#607068]">
            In the meantime, the current online catalog is the best place to
            see products available through the Port Petals website.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/flowers"
              className="rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
            >
              Shop Flowers
            </Link>

            <Link
              href="/gators"
              className="rounded-full border border-[#284239]/15 bg-white px-6 py-3 font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
            >
              Shop Gator Gear
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
