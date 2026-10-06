"use client";

import {
  useState,
} from "react";

type ReferralShareCardProps = {
  referralCode: string;
};

export default function ReferralShareCard({
  referralCode,
}: ReferralShareCardProps) {
  const [
    copied,
    setCopied,
  ] = useState(false);

  function getReferralUrl() {
    return (
      `${window.location.origin}/r/` +
      encodeURIComponent(
        referralCode
      )
    );
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        getReferralUrl()
      );

      setCopied(true);

      window.setTimeout(
        () => {
          setCopied(false);
        },
        2000
      );
    } catch {
      setCopied(false);
    }
  }

  async function handleShare() {
    const url =
      getReferralUrl();

    if (
      typeof navigator.share ===
      "function"
    ) {
      try {
        await navigator.share({
          title:
            "Port Petals",
          text:
            "Shop Port Petals with my referral link.",
          url,
        });

        return;
      } catch {
        return;
      }
    }

    await handleCopy();
  }

  return (
    <div className="rounded-3xl border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
        Your Referral Code
      </p>

      <div className="mt-4 rounded-2xl bg-[#f7f1e8] p-5">
        <p className="font-mono text-xl font-semibold tracking-wide text-[#153f32]">
          {referralCode}
        </p>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#607068]">
        Share your personal Port Petals link with
        friends. Their referral is securely tracked
        after they visit your link and place an
        eligible order.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={
            handleCopy
          }
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#284239]/15 px-5 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40"
        >
          {copied
            ? "Link Copied"
            : "Copy Referral Link"}
        </button>

        <button
          type="button"
          onClick={
            handleShare
          }
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
        >
          Share With a Friend
        </button>
      </div>

      <p
        aria-live="polite"
        className="mt-3 min-h-5 text-xs text-[#31583b]"
      >
        {copied
          ? "Your referral link has been copied."
          : ""}
      </p>
    </div>
  );
}
