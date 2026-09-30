import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";


export const metadata: Metadata = {
  title: "Pickup & Local Delivery",
  description:
    "Read the Port Petals fulfillment policy for local pickup and delivery within approximately 10 miles of Port Allegany, Pennsylvania.",
};

export default function FulfillmentPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_50%,#eef3e5_100%)]" />
        <div className="absolute -left-20 top-12 -z-10 h-72 w-72 rounded-full bg-[#efa99f]/35 blur-[90px]" />
        <div className="absolute -right-16 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#c9e2ba]/45 blur-[100px]" />

        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
            Pickup & Delivery
          </p>

          <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
            Port Petals Fulfillment Policy
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#52655d]">
            Port Petals currently offers customer pickup and local delivery in
            and around Port Allegany, Pennsylvania. Shipping is not available at
            this time.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-6">
          <article className="rounded-[1.8rem] border border-[#284239]/10 bg-white/70 p-7 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Pickup
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
              Local pickup
            </h2>

            <p className="mt-4 leading-7 text-[#607068]">
              Customers may choose to pick up eligible orders directly from Port
              Petals. Pickup details, including the shop address and available
              pickup times, will be provided once the order is confirmed.
            </p>

            <p className="mt-4 leading-7 text-[#607068]">
              Customers should wait for confirmation that an order is ready
              before arriving for pickup.
            </p>
          </article>

          <article className="rounded-[1.8rem] border border-[#284239]/10 bg-white/70 p-7 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Local Delivery
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
              Delivery within approximately 10 miles
            </h2>

            <p className="mt-4 leading-7 text-[#607068]">
              Port Petals offers local delivery to eligible addresses within
              approximately a 10-mile radius of Port Allegany, Pennsylvania.
            </p>

            <p className="mt-4 leading-7 text-[#607068]">
              Delivery availability may depend on the destination, order type,
              requested date, and current shop capacity. An order is not
              considered approved for delivery until Port Petals confirms the
              address and delivery request.
            </p>
          </article>

          <article className="rounded-[1.8rem] border border-[#284239]/10 bg-white/70 p-7 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Shipping
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
              Shipping is not currently offered
            </h2>

            <p className="mt-4 leading-7 text-[#607068]">
              Port Petals does not currently ship orders by mail or commercial
              carrier. Orders must be fulfilled through local pickup or an
              approved local delivery.
            </p>
          </article>

          <article className="rounded-[1.8rem] border border-[#284239]/10 bg-white/70 p-7 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Delivery Timing
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
              Requested dates are subject to confirmation
            </h2>

            <p className="mt-4 leading-7 text-[#607068]">
              Customers may request a preferred pickup or delivery date, but
              requested dates are not guaranteed until confirmed by Port
              Petals.
            </p>

            <p className="mt-4 leading-7 text-[#607068]">
              Fresh flowers, custom items, holidays, school events, and other
              high-demand periods may require additional lead time.
            </p>
          </article>

          <article className="rounded-[1.8rem] border border-[#284239]/10 bg-white/70 p-7 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Order Confirmation
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
              Requests are not final until confirmed
            </h2>

            <p className="mt-4 leading-7 text-[#607068]">
              Custom-order requests, requested delivery dates, and delivery
              addresses may require review before an order is accepted.
            </p>

            <p className="mt-4 leading-7 text-[#607068]">
              Port Petals may contact the customer if additional information is
              needed before confirming fulfillment.
            </p>
          </article>
        </div>

        <div className="mt-10 rounded-[2rem] bg-[#284239] p-7 text-[#fffaf3] sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a8e69a]">
            Questions?
          </p>

          <h2 className="mt-3 font-serif text-3xl font-semibold">
            Not sure whether your address qualifies?
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-[#e7dedc]">
            Contact Port Petals before placing the order and the shop can confirm
            whether local delivery is available for your address.
          </p>

          <Link
            href="/about"
            className="mt-6 inline-flex rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
          >
            Contact Port Petals
          </Link>
        </div>
      </section>
    </main>
  );
}
