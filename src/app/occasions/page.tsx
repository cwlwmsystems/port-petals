import type {
  Metadata,
} from "next";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbStructuredData } from "@/lib/seo/breadcrumbs";
import Link from "next/link";
import {
  occasionDefinitions,
} from "@/lib/occasions";

export const metadata: Metadata = {
  title: "Shop by Occasion",
  description:
    "Shop flowers, gifts, apparel, seasonal favorites, and Port Allegany Gator gear by occasion at Port Petals.",
  alternates: {
    canonical:
      "/occasions",
  },
  openGraph: {
    title:
      "Shop by Occasion | Port Petals",
    description:
      "Find flowers, gifts, personalized items, apparel, and local favorites for life's special moments.",
    url: "/occasions",
  },
};


const breadcrumbStructuredData =
  buildBreadcrumbStructuredData([
      {
        name: "Home",
        path: "/",
      },
      {
        name: "Occasions",
        path: "/occasions",
      },
  ]);

export default function OccasionsPage() {
  return (
    <main className="min-h-screen bg-[#faf7f1] text-[#284239]">
      <JsonLd data={breadcrumbStructuredData} />
      <section className="relative isolate overflow-hidden border-b border-[#284239]/10 bg-[linear-gradient(135deg,#f7e8e2_0%,#f8efe7_42%,#e8efe7_100%)]">
        <div className="pointer-events-none absolute -left-20 top-6 h-72 w-72 rounded-full bg-[#e76d61]/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#8dad91]/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 sm:py-20 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e76d61]">
            Shop by Occasion
          </p>

          <h1 className="mx-auto mt-4 max-w-4xl font-serif text-4xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-5xl lg:text-6xl">
            Find something thoughtful for the moment.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#52655d] sm:text-lg sm:leading-8">
            Browse flowers, gifts,
            apparel, seasonal favorites,
            and hometown finds together
            by occasion.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {occasionDefinitions.map(
            (
              occasion,
              index
            ) => (
              <Link
                key={
                  occasion.slug
                }
                href={`/occasions/${occasion.slug}`}
                className="group flex min-h-64 flex-col rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-[0_12px_35px_rgba(42,66,57,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#e76d61]/25 hover:shadow-[0_20px_45px_rgba(42,66,57,0.12)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                    Occasion
                  </span>

                  <span className="font-serif text-2xl text-[#d9b9ae]">
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>
                </div>

                <h2 className="mt-8 font-serif text-2xl font-semibold text-[#153f32]">
                  {
                    occasion.label
                  }
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#607068]">
                  {
                    occasion.description
                  }
                </p>

                <p className="mt-auto pt-6 text-sm font-semibold text-[#36594c] transition group-hover:text-[#e76d61]">
                  Shop{" "}
                  {
                    occasion.label
                  }{" "}
                  →
                </p>
              </Link>
            )
          )}
        </div>

        <div className="mt-12 rounded-[1.75rem] border border-[#284239]/10 bg-[#153f32] px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f3b0aa]">
                Something More Personal?
              </p>

              <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
                Request something made especially for them.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                Port Petals can help with
                custom gifts, personalized
                pieces, flowers, and special
                requests.
              </p>
            </div>

            <Link
              href="/custom/request"
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#e76d61] px-6 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
            >
              Start a Custom Request
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
