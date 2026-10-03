import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Flower Care Guide | Keep Fresh Flowers Beautiful Longer",
  description:
    "Learn how to care for fresh-cut flowers and floral arrangements with practical tips from Port Petals in Port Allegany, Pennsylvania.",
};

const quickCare = [
  "Keep the vase or arrangement filled with fresh water.",
  "Keep leaves and plant debris out of the water.",
  "Keep flowers away from direct sunlight and heat.",
  "Change vase water every few days.",
  "Recut loose flower stems when refreshing the water.",
  "Remove fading flowers and foliage as needed.",
];

export default function FlowerCarePage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_48%,#edf3e7_100%)]" />
        <div className="absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full bg-[#efa99f]/35 blur-[90px]" />
        <div className="absolute -right-16 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#c9e2ba]/45 blur-[100px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_.9fr] lg:px-10 lg:py-18">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
              Port Petals Journal
            </p>

            <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              How to care for your fresh flowers
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52655d]">
              Fresh flowers are naturally temporary, but the right care can
              help them stay hydrated, clean, and beautiful for considerably
              longer.
            </p>

            <p className="mt-4 max-w-2xl leading-7 text-[#607068]">
              Use this guide after bringing home a bouquet or receiving a fresh
              Port Petals arrangement.
            </p>
          </div>

          <div className="relative h-[360px] overflow-hidden rounded-[2rem] border border-[#284239]/10 shadow-[0_20px_55px_rgba(42,66,57,0.12)] sm:h-[430px]">
            <Image
              src="/collections/fresh-flowers.jpg"
              alt="Fresh flowers from Port Petals"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Quick guide */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] bg-[#284239] p-7 text-[#fffaf3] sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a8e69a]">
            Quick Care Guide
          </p>

          <h2 className="mt-3 font-serif text-3xl font-semibold">
            The six things that matter most
          </h2>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickCare.map((item, index) => (
              <div
                key={item}
                className="flex gap-3 rounded-[1.2rem] border border-white/10 bg-white/5 p-4"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e76d61] text-xs font-bold text-white">
                  {index + 1}
                </div>

                <p className="text-sm leading-6 text-[#eee7e2]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* First steps */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div className="rounded-[2rem] bg-[#faefe5] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Start Here
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
              The first 10 minutes matter
            </h2>

            <p className="mt-4 leading-7 text-[#607068]">
              Flowers begin losing moisture after they are cut. Getting stems
              into clean water quickly helps them recover and begin taking up
              water again.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              [
                "1. Start with a clean container",
                "Wash the vase with hot, soapy water and rinse it thoroughly. Residue and bacteria inside a vase can shorten flower life.",
              ],
              [
                "2. Add fresh water",
                "Use clean water and, when provided, mix commercial flower food according to the packet directions.",
              ],
              [
                "3. Remove submerged foliage",
                "Strip away leaves or other plant material that would sit below the water line.",
              ],
              [
                "4. Recut loose stems",
                "Using clean, sharp snips or pruners, remove a small amount from the bottom of each loose stem before placing it into the vase.",
              ],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-[1.5rem] border border-[#284239]/10 bg-white/75 p-6"
              >
                <h3 className="font-serif text-xl font-semibold text-[#153f32]">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#607068]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Water care */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="border-t border-[#284239]/10 pt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
            Water & Vase Care
          </p>

          <h2 className="mt-3 max-w-3xl font-serif text-4xl font-semibold text-[#153f32]">
            Clean water is one of the biggest factors in vase life.
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <article className="rounded-[1.7rem] border border-[#284239]/10 bg-white/70 p-7">
              <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                Check daily
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#607068]">
                Flowers can drink surprisingly quickly. Check the water level
                every day, especially during the first few days, and make sure
                every stem remains able to reach the water.
              </p>
            </article>

            <article className="rounded-[1.7rem] border border-[#284239]/10 bg-white/70 p-7">
              <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                Refresh every few days
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#607068]">
                If the flowers are in a vase, completely replace the water every
                few days rather than continually topping off cloudy or dirty
                water.
              </p>
            </article>

            <article className="rounded-[1.7rem] border border-[#284239]/10 bg-white/70 p-7">
              <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                Clean as you go
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#607068]">
                When changing the water, rinse the vase and remove fallen
                leaves, petals, or other organic material that has collected in
                the water.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Flower food */}
      <section className="bg-[#edf3e7]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#36594c]">
              Flower Food
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
              Use the packet if one is provided.
            </h2>

            <p className="mt-5 leading-7 text-[#607068]">
              Commercial floral preservative is formulated specifically for cut
              flowers. It helps support flower opening while also helping manage
              the vase-water environment.
            </p>
          </div>

          <div className="rounded-[1.7rem] border border-[#284239]/10 bg-white/70 p-7">
            <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
              Follow the packet directions
            </h3>

            <p className="mt-3 text-sm leading-7 text-[#607068]">
              More flower food is not necessarily better. Mix the packet with
              the amount of water specified on the package rather than guessing
              at the concentration.
            </p>

            <p className="mt-4 text-sm leading-7 text-[#607068]">
              When replacing the vase water, use a fresh packet if one is
              available.
            </p>
          </div>
        </div>
      </section>

      {/* Stem care */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Stem Care
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
              Give stems a fresh drinking surface.
            </h2>

            <p className="mt-5 leading-7 text-[#607068]">
              For loose-cut flowers, recutting the stem exposes fresh tissue
              that can take up water. Use a clean, sharp cutting tool so the
              stem is cut cleanly rather than crushed.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white/70 p-6">
              <h3 className="font-semibold text-[#153f32]">
                Use clean, sharp tools
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#607068]">
                Floral snips or sharp pruners work well. Dull tools can crush
                stem tissue.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white/70 p-6">
              <h3 className="font-semibold text-[#153f32]">
                Remove only a small amount
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#607068]">
                A fresh cut at the base is usually enough. You do not need to
                dramatically shorten the flowers each time.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white/70 p-6">
              <h3 className="font-semibold text-[#153f32]">
                Return stems to water promptly
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#607068]">
                After trimming, place the stems back into fresh water rather
                than leaving them sitting dry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Placement */}
      <section className="mx-auto max-w-6xl px-5 pb-14 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-[#284239]/10 bg-white/70 p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
            Where to Display Flowers
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
            Cooler is generally better.
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#31583b]">
                Better locations
              </h3>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-[#607068]">
                <li>• A cool room with indirect light</li>
                <li>• A table away from heating or cooling vents</li>
                <li>• A location away from fireplaces and appliances</li>
                <li>• An area protected from prolonged direct sunlight</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#a7473f]">
                Avoid
              </h3>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-[#607068]">
                <li>• Sunny windowsills</li>
                <li>• Radiators and heat vents</li>
                <li>• Hot kitchens or appliances</li>
                <li>• Bowls of ripening fruit</li>
              </ul>
            </div>
          </div>

          <p className="mt-7 text-sm leading-7 text-[#607068]">
            Ripening fruit can release ethylene, a naturally occurring plant
            hormone that can speed flower aging in sensitive varieties.
          </p>
        </div>
      </section>

      {/* Arrangement care */}
      <section className="mx-auto max-w-6xl px-5 pb-14 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[1.8rem] bg-[#faefe5] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Vase Bouquets
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
              Loose stems in a vase
            </h2>

            <p className="mt-4 leading-7 text-[#607068]">
              Loose bouquets are easiest to fully refresh. Every few days,
              remove the flowers, wash the vase, refill it with fresh water,
              recut the stems, and return the flowers to the vase.
            </p>
          </article>

          <article className="rounded-[1.8rem] bg-[#edf3e7] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#36594c]">
              Designed Arrangements
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
              Flowers arranged in a container
            </h2>

            <p className="mt-4 leading-7 text-[#607068]">
              For an arrangement that is already designed in its container,
              avoid pulling the entire design apart unless necessary. Check the
              water frequently and carefully add fresh water so the stems remain
              hydrated.
            </p>
          </article>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="bg-[#284239] text-[#fffaf3]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a8e69a]">
            Troubleshooting
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold">
            Flowers looking tired?
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <h3 className="font-serif text-xl font-semibold">
                Drooping stems
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#e7dedc]">
                Check the water immediately. For loose flowers, refresh the
                water and give the stems a clean recut before returning them to
                the vase.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <h3 className="font-serif text-xl font-semibold">
                Cloudy water
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#e7dedc]">
                Replace the water, clean the vase, remove debris below the water
                line, and recut loose stems.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
              <h3 className="font-serif text-xl font-semibold">
                One flower fading early
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#e7dedc]">
                Different flower varieties naturally age at different rates.
                Remove spent blooms while continuing to care for the remaining
                flowers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expectations */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              How Long Will They Last?
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
              Vase life varies from flower to flower.
            </h2>

            <p className="mt-5 leading-7 text-[#607068]">
              There is no single lifespan for a mixed arrangement. Variety,
              maturity, temperature, hydration, handling, and care all affect
              how long each bloom remains attractive.
            </p>

            <p className="mt-4 leading-7 text-[#607068]">
              Some flowers naturally outlast others, so it is completely normal
              for individual stems in a mixed bouquet to finish at different
              times.
            </p>
          </div>

          <div className="rounded-[1.8rem] border border-[#284239]/10 bg-white/70 p-7">
            <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
              A practical expectation
            </h3>

            <p className="mt-3 text-sm leading-7 text-[#607068]">
              With good care, many fresh-cut bouquets can remain enjoyable for
              roughly a week or longer, while some long-lasting varieties may
              continue well beyond that.
            </p>

            <p className="mt-4 text-xs leading-6 text-[#7d8982]">
              Fresh flowers are natural products, so individual results will
              vary.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-[#e76d61]/15 bg-[#faefe5] p-8 text-center sm:p-10">
          <h2 className="font-serif text-3xl font-semibold text-[#153f32]">
            Have a question about your arrangement?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#607068]">
            If you purchased flowers from Port Petals and are unsure how to
            care for a specific arrangement or flower variety, contact the shop
            and we can help.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="tel:+18146421253"
              className="inline-flex items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
            >
              Call 814-642-1253
            </a>

            <Link
              href="/flowers"
              className="inline-flex items-center justify-center rounded-full border border-[#284239]/15 bg-white px-6 py-3 font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
            >
              Shop Fresh Flowers
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
