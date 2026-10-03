import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for the Port Petals website and online ordering experience.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="border-b border-[#284239]/10 bg-[#f1e8dc]">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
            Port Petals
          </p>

          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32]">
            Privacy Policy
          </h1>

          <p className="mt-5 max-w-3xl leading-7 text-[#607068]">
            This policy explains how information is collected and used when
            customers visit the Port Petals website, place an order, or contact
            the shop.
          </p>

          <p className="mt-4 text-sm text-[#718078]">
            Last updated: October 3, 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="space-y-10 rounded-[2rem] border border-[#284239]/10 bg-white/70 p-7 shadow-sm sm:p-10">
          <PolicySection title="Information we collect">
            <p>
              When you place an order or contact Port Petals, we may collect
              information such as your name, email address, phone number,
              billing information, pickup or delivery details, requested
              fulfillment date, order selections, custom-order information, and
              messages you send to the shop.
            </p>
          </PolicySection>

          <PolicySection title="Payment information">
            <p>
              Card payments are processed through Square. Port Petals does not
              store complete payment-card numbers on its own website or
              database. Payment information is handled by Square according to
              Square&apos;s own security and privacy practices.
            </p>
          </PolicySection>

          <PolicySection title="How information is used">
            <p>
              Customer information may be used to process and fulfill orders,
              arrange pickup or delivery, send order confirmations and status
              updates, respond to questions, complete custom requests, prevent
              fraud or misuse, maintain business records, and operate or improve
              the website.
            </p>
          </PolicySection>

          <PolicySection title="Service providers">
            <p>
              Port Petals uses third-party technology providers to operate the
              website and ordering system. These providers may process limited
              information as necessary to provide their services.
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Square for payment processing.</li>
              <li>Supabase for website database and application services.</li>
              <li>Resend for transactional order email.</li>
              <li>Vercel for website hosting and delivery.</li>
            </ul>
          </PolicySection>

          <PolicySection title="Order communications">
            <p>
              Port Petals may send transactional messages related to an order,
              including payment confirmation, preparation updates, pickup or
              delivery status, completion, or cancellation notices. These
              communications are operational messages related to a customer
              transaction.
            </p>
          </PolicySection>

          <PolicySection title="Data retention">
            <p>
              Order and customer information may be retained for business,
              accounting, customer-service, fraud-prevention, and legal record
              purposes for as long as reasonably necessary.
            </p>
          </PolicySection>

          <PolicySection title="Information sharing">
            <p>
              Port Petals does not sell customer information. Information may
              be shared with service providers when necessary to operate the
              website, process payments, send order communications, fulfill an
              order, comply with applicable law, or protect the business and its
              customers.
            </p>
          </PolicySection>

          <PolicySection title="Website security">
            <p>
              Reasonable technical and administrative safeguards are used to
              protect customer information. No internet-based service can
              guarantee absolute security, but Port Petals limits access to
              customer and administrative information to the systems needed to
              operate the business.
            </p>
          </PolicySection>

          <PolicySection title="Children's privacy">
            <p>
              The Port Petals website is intended for general retail customers
              and is not directed toward children under 13. Port Petals does
              not knowingly collect personal information from children under
              13 through the online ordering system.
            </p>
          </PolicySection>

          <PolicySection title="Changes to this policy">
            <p>
              This Privacy Policy may be updated as the website, ordering
              system, or business practices change. The revision date shown at
              the top of this page indicates when the policy was most recently
              updated.
            </p>
          </PolicySection>

          <PolicySection title="Contact">
            <p>
              Questions about this Privacy Policy may be directed to Port
              Petals at{" "}
              <a
                href="mailto:stacy@portpetals.com"
                className="font-semibold text-[#284239] underline decoration-[#e76d61]/40 underline-offset-4"
              >
                stacy@portpetals.com
              </a>{" "}
              or by calling{" "}
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
