import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";


export const metadata: Metadata = {
  title: "Custom Orders & Personalized Gifts",
  description:
    "Request personalized gifts, custom shirts, tumblers, Gator gear, and other custom creations from Port Petals in Port Allegany, PA.",
};

export default function CustomOrderPage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_48%,#edf3e7_100%)]" />
        <div className="absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full bg-[#efa99f]/35 blur-[90px]" />
        <div className="absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#c9e2ba]/45 blur-[100px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
              Custom Orders
            </p>

            <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              Have something special in mind?
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#52655d]">
              Tell Port Petals what you are imagining. Share your colors,
              personalization, occasion, timing, and other details so the shop
              can review your request and follow up with you.
            </p>

            <div className="mt-7 rounded-[1.5rem] border border-[#e76d61]/20 bg-white/55 p-5 text-sm leading-6 text-[#5d6d65] backdrop-blur">
              Submitting this form is a request for a custom order and does not
              confirm availability, pricing, or payment. Port Petals will review
              the request before the order is finalized.
            </div>
          </div>

          <div className="relative h-[340px] overflow-hidden rounded-[2rem] shadow-lg">
            <Image
              src="/collections/customized-items.jpg"
              alt="Customized items from Port Petals"
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-[#284239]/10 bg-white/70 p-6 shadow-[0_16px_45px_rgba(42,66,57,0.08)] sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
              Custom Order Request
            </p>

            <h2 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
              Tell us what you would like.
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-[#627169]">
              Provide as much detail as you can. Port Petals can follow up if
              anything needs clarified before the order is confirmed.
            </p>
          </div>

          <form className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">Name *</span>
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Phone *</span>
                <input
                  type="tel"
                  name="phone"
                  required
                  autoComplete="tel"
                  className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">Email *</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
              />
            </label>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">Item Type *</span>
                <select
                  name="itemType"
                  required
                  defaultValue=""
                  className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
                >
                  <option value="" disabled>
                    Select an item
                  </option>
                  <option value="shirt">Custom Shirt</option>
                  <option value="tumbler">Tumbler</option>
                  <option value="gift">Personalized Gift</option>
                  <option value="gator-gear">Gator Gear</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Needed By
                </span>
                <input
                  type="date"
                  name="neededBy"
                  className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">
                Personalization / Wording
              </span>
              <input
                type="text"
                name="personalization"
                placeholder="Names, wording, number, team name, etc."
                className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition placeholder:text-[#77827c] focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
              />
            </label>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Preferred Colors
                </span>
                <input
                  type="text"
                  name="colors"
                  placeholder="Example: pink, white, and sage"
                  className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition placeholder:text-[#77827c] focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Approximate Budget
                </span>
                <select
                  name="budget"
                  defaultValue=""
                  className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
                >
                  <option value="">No preference</option>
                  <option value="under-25">Under $25</option>
                  <option value="25-50">$25–$50</option>
                  <option value="50-100">$50–$100</option>
                  <option value="100-plus">$100+</option>
                </select>
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">
                Tell Us About Your Idea *
              </span>
              <textarea
                name="details"
                required
                rows={6}
                placeholder="Describe what you would like, the occasion, style, wording, colors, size, quantity, or anything else that would help."
                className="resize-y rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition placeholder:text-[#77827c] focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">
                Reference Image
              </span>
              <input
                type="file"
                name="referenceImage"
                accept="image/png,image/jpeg,image/webp"
                className="rounded-xl border border-dashed border-[#284239]/20 bg-[#fffdf9] px-4 py-5 text-sm"
              />
              <span className="text-xs leading-5 text-[#718078]">
                Optional. Upload an inspiration photo or reference image.
              </span>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">
                Additional Notes
              </span>
              <textarea
                name="notes"
                rows={4}
                placeholder="Anything else Port Petals should know?"
                className="resize-y rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition placeholder:text-[#77827c] focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
              />
            </label>

            <div className="border-t border-[#284239]/10 pt-6">
              <p className="max-w-2xl text-sm leading-6 text-[#607068]">
                Ready to discuss a custom order? Contact Port Petals directly
                with your idea, preferred colors, wording, date, and any other
                details.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <a
                  href="tel:+18146421253"
                  className="inline-flex items-center justify-center rounded-full bg-[#e76d61] px-7 py-3.5 font-semibold text-white shadow-md shadow-[#e76d61]/15 transition hover:bg-[#d95d52]"
                >
                  Call 814-642-1253
                </a>

                <a
                  href="mailto:PortPetals@yahoo.com"
                  className="inline-flex items-center justify-center rounded-full border border-[#284239]/15 bg-white px-7 py-3.5 font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                >
                  Email Port Petals
                </a>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
