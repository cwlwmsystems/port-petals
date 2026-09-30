import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";


export const metadata: Metadata = {
  title: "About & Contact",
  description:
    "Learn about Port Petals in Port Allegany, Pennsylvania and contact the shop about flowers, gifts, custom items, pickup, and local delivery.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_48%,#edf3e7_100%)]" />
        <div className="absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full bg-[#efa99f]/35 blur-[90px]" />
        <div className="absolute -right-16 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#c9e2ba]/45 blur-[100px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
              About Port Petals
            </p>

            <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              Flowers, gifts, and hometown creativity.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#52655d]">
              Port Petals is a local flower and craft shop in Port Allegany,
              Pennsylvania, offering fresh flowers, candles, custom creations,
              shirts, and hometown Gator gear.
            </p>

            <p className="mt-5 max-w-xl leading-7 text-[#627169]">
              The goal is simple: thoughtful products, personalized service,
              and something special for everyday moments, celebrations, gifts,
              and local school spirit.
            </p>
          </div>

          <div className="relative flex min-h-[360px] items-center justify-center">
            <div className="absolute h-[300px] w-[300px] rounded-full bg-[#efaaa0]/25 blur-2xl" />
            <Image
              src="/port-petals-logo-transparent.png"
              alt="Port Petals"
              width={560}
              height={400}
              className="relative z-10 h-auto w-full max-w-[430px]"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-[1.8rem] border border-[#284239]/10 bg-white/70 p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Visit
            </p>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-[#153f32]">
              Port Allegany, PA
            </h2>
            <p className="mt-4 leading-7 text-[#607068]">
              430 E Arnold Avenue, Port Allegany, PA 16743
            </p>
          </article>

          <article className="rounded-[1.8rem] border border-[#284239]/10 bg-white/70 p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Hours
            </p>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-[#153f32]">
              Shop Hours
            </h2>
            <p className="mt-4 leading-7 text-[#607068]">
              Business hours will be added once confirmed with the owner.
            </p>
          </article>

          <article className="rounded-[1.8rem] border border-[#284239]/10 bg-white/70 p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Contact
            </p>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-[#153f32]">
              Get in Touch
            </h2>
            <p className="mt-4 leading-7 text-[#607068]">
              Phone and email details will be added once confirmed with the
              owner.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-[#284239] text-[#fffaf3]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a8e69a]">
              Pickup & Local Delivery
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold">
              Keeping orders local.
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-[#e7dedc]">
              Port Petals currently offers customer pickup and local delivery.
              Shipping is not offered at this time.
            </p>
          </div>

          <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-7">
            <h3 className="font-serif text-2xl font-semibold">
              Delivery Area
            </h3>

            <p className="mt-4 leading-7 text-[#e7dedc]">
              Local delivery is available within approximately a 10-mile radius
              of Port Allegany, Pennsylvania.
            </p>

            <p className="mt-4 text-sm leading-6 text-[#cfc6c5]">
              Delivery availability may depend on the order, destination,
              requested date, and shop capacity. Final delivery eligibility
              should be confirmed before the order is accepted.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-[#284239]/10 bg-white/70 p-6 shadow-[0_16px_45px_rgba(42,66,57,0.08)] sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
              Contact Port Petals
            </p>

            <h2 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
              Send a message.
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-[#627169]">
              Questions about flowers, products, pickup, delivery, or a future
              order can be sent here.
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
                <span className="text-sm font-semibold">Email *</span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">Phone</span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">Subject *</span>
              <select
                name="subject"
                required
                defaultValue=""
                className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
              >
                <option value="" disabled>
                  Select a topic
                </option>
                <option value="flowers">Fresh Flowers</option>
                <option value="custom">Custom Order</option>
                <option value="pickup">Pickup</option>
                <option value="delivery">Local Delivery</option>
                <option value="products">Products</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">Message *</span>
              <textarea
                name="message"
                required
                rows={6}
                placeholder="How can Port Petals help?"
                className="resize-y rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition placeholder:text-[#77827c] focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
              />
            </label>

            <div className="border-t border-[#284239]/10 pt-6">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#e76d61] px-7 py-3.5 font-semibold text-white shadow-md shadow-[#e76d61]/15 transition hover:bg-[#d95d52] sm:w-auto"
              >
                Send Message
              </button>

              <p className="mt-4 text-xs leading-5 text-[#718078]">
                Message delivery will be connected after the owner confirms
                which email or system should receive website inquiries.
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
