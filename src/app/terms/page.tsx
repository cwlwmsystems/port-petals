import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Store Policies",
  description:
    "Ordering, payment, pickup, delivery, cancellation, refund, and custom-product policies for Port Petals.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="border-b border-[#284239]/10 bg-[#f1e8dc]">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
            Port Petals
          </p>

          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32]">
            Terms & Store Policies
          </h1>

          <p className="mt-5 max-w-3xl leading-7 text-[#607068]">
            These terms describe the basic policies that apply when placing an
            order through the Port Petals website.
          </p>

          <p className="mt-4 text-sm text-[#718078]">
            Last updated: October 3, 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="space-y-10 rounded-[2rem] border border-[#284239]/10 bg-white/70 p-7 shadow-sm sm:p-10">
          <PolicySection title="Orders">
            <p>
              Orders are subject to product availability, requested fulfillment
              date, shop capacity, and any customization requirements. Port
              Petals may contact a customer if additional information or an
              adjustment is needed before an order can be completed.
            </p>
          </PolicySection>

          <PolicySection title="Payment">
            <p>
              Online card payments are securely processed through Square. An
              order is not considered paid until payment has been successfully
              completed and confirmed.
            </p>
          </PolicySection>

          <PolicySection title="Pricing">
            <p>
              Prices shown on the website are listed in U.S. dollars. Product
              pricing, availability, delivery fees, and promotional offers may
              change without prior notice. The price presented at checkout
              applies to the order being placed.
            </p>
          </PolicySection>

          <PolicySection title="Pickup">
            <p>
              Customers selecting local pickup should wait until Port Petals
              confirms that the order is ready before arriving. Pickup is
              available at 430 E Arnold Avenue, Port Allegany, PA 16743.
            </p>
          </PolicySection>

          <PolicySection title="Local delivery">
            <p>
              Port Petals offers approved local delivery in and around Port
              Allegany. Delivery eligibility and fees depend on the destination
              and current delivery area.
            </p>

            <p className="mt-3">
              Current delivery information is available on the{" "}
              <Link
                href="/fulfillment"
                className="font-semibold text-[#284239] underline decoration-[#e76d61]/40 underline-offset-4"
              >
                Pickup & Delivery page
              </Link>
              .
            </p>
          </PolicySection>

          <PolicySection title="Shipping">
            <p>
              Port Petals does not currently ship orders by mail or commercial
              carrier. Website orders are limited to approved local pickup and
              delivery options.
            </p>
          </PolicySection>

          <PolicySection title="Requested fulfillment dates">
            <p>
              Customers may select an available requested pickup or delivery
              date during checkout. Product preparation requirements and
              minimum lead times may restrict the earliest available date.
              Requested dates remain subject to product availability and shop
              capacity.
            </p>
          </PolicySection>

          <PolicySection title="Custom and personalized products">
            <p>
              Custom, personalized, and made-to-order items may require
              additional preparation time and customer approval of certain
              details. Customers are responsible for reviewing names, wording,
              sizes, colors, personalization details, and other information
              supplied for a custom order.
            </p>

            <p className="mt-3">
              Because customized products are made specifically for the
              customer, cancellation or refund availability may be limited once
              production has begun.
            </p>
          </PolicySection>

          <PolicySection title="Flowers and handcrafted items">
            <p>
              Flowers and handcrafted products may vary naturally from website
              photographs. Flower varieties, colors, containers, decorative
              elements, or other components may occasionally require reasonable
              substitution based on seasonal or local availability while
              preserving the overall style and value of the order.
            </p>
          </PolicySection>

          <PolicySection title="Cancellations">
            <p>
              Cancellation requests are handled by Port Petals based on the
              status and nature of the order. A cancellation request is not
              guaranteed once materials have been purchased, flowers have been
              prepared, or work has begun on a customized item.
            </p>
          </PolicySection>

          <PolicySection title="Refunds">
            <p>
              Refunds are handled at the discretion of Port Petals based on the
              circumstances of the order. Customers with a concern should
              contact the shop as soon as possible so the issue can be reviewed.
            </p>

            <p className="mt-3">
              Cancelling an order in the Port Petals ordering system does not
              itself automatically issue a payment refund. Any approved payment
              refund is processed separately through the payment system.
            </p>
          </PolicySection>

          <PolicySection title="Product availability">
            <p>
              Products may become unavailable because of inventory, seasonal
              supply, flower availability, vendor availability, or production
              capacity. Port Petals may contact the customer to discuss a
              substitution, adjustment, alternative, or cancellation if needed.
            </p>
          </PolicySection>

          <PolicySection title="Website information">
            <p>
              Port Petals works to keep product descriptions, prices, images,
              and availability accurate. Minor errors or omissions may
              occasionally occur and may be corrected when discovered.
            </p>
          </PolicySection>

          <PolicySection title="Contact">
            <p>
              Questions about an order or these policies may be directed to{" "}
              <a
                href="mailto:stacy@portpetals.com"
                className="font-semibold text-[#284239] underline decoration-[#e76d61]/40 underline-offset-4"
              >
                stacy@portpetals.com
              </a>{" "}
              or{" "}
              <a
                href="tel:+18146421253"
                className="font-semibold text-[#284239] underline decoration-[#e76d61]/40 underline-offset-4"
              >
                814-642-1253
              </a>
              .
            </p>
          </PolicySection>
        </div>
      </section>
    </main>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
        {title}
      </h2>

      <div className="mt-3 text-sm leading-7 text-[#607068]">{children}</div>
    </section>
  );
}
