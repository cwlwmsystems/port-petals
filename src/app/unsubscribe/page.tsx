import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Email Preferences",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function UnsubscribePage({
  searchParams,
}: Props) {
  const {
    status,
  } =
    await searchParams;

  const success =
    status === "success";

  const invalid =
    status === "invalid";

  return (
    <main className="min-h-[70vh] bg-[#f7f1e8] px-5 py-16 text-[#284239] sm:px-8">
      <section className="mx-auto max-w-xl rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 text-center shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
          Port Petals
        </p>

        <h1 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
          {success
            ? "You're unsubscribed"
            : invalid
              ? "That link isn't valid"
              : "Email Preferences"}
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#607068]">
          {success
            ? "You will no longer receive promotional emails from Port Petals."
            : invalid
              ? "We could not find a valid marketing subscription for this link."
              : "Manage your Port Petals promotional email preferences."}
        </p>

        {success && (
          <p className="mx-auto mt-4 max-w-md text-xs leading-5 text-[#718078]">
            Order confirmations, payment notices,
            pickup or delivery updates, and other
            transactional messages are not affected.
          </p>
        )}

        {status === "error" && (
          <div className="mt-5 rounded-xl bg-[#fff0ed] p-4 text-sm text-[#a7473f]">
            We could not update your preferences.
            Please contact Port Petals for assistance.
          </div>
        )}

        <Link
          href="/"
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-[#284239] px-6 text-sm font-semibold text-white transition hover:bg-[#1d332b]"
        >
          Return to Port Petals
        </Link>
      </section>
    </main>
  );
}
