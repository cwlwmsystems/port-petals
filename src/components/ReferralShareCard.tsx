"use client";

import { useState } from "react";

type ReferralShareCardProps = {
  referralCode: string;
};

export default function ReferralShareCard({
  referralCode,
}: ReferralShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState("");

  function getReferralUrl() {
    return (
      `${window.location.origin}/r/` +
      encodeURIComponent(referralCode)
    );
  }

  function getShareMessage() {
    return "Shop Port Petals with my referral link!";
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(getReferralUrl());

      setCopied(true);
      setShareStatus("Your referral link has been copied.");

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      setCopied(false);
      setShareStatus(
        "Unable to copy automatically. Please copy your referral link manually."
      );
    }
  }

  async function handleNativeShare() {
    const url = getReferralUrl();

    if (typeof navigator.share !== "function") {
      await handleCopy();
      return;
    }

    try {
      await navigator.share({
        title: "Port Petals",
        text: getShareMessage(),
        url,
      });

      setShareStatus("Your sharing options have been opened.");
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "AbortError"
      ) {
        setShareStatus("Sharing cancelled.");
        return;
      }

      setShareStatus(
        "Unable to open the share menu. You can copy your referral link instead."
      );
    }
  }

  function handleFacebookShare() {
    const url = getReferralUrl();

    const shareUrl =
      "https://www.facebook.com/sharer/sharer.php?u=" +
      encodeURIComponent(url);

    window.open(
      shareUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function handleXShare() {
    const url = getReferralUrl();

    const shareUrl =
      "https://twitter.com/intent/tweet?" +
      new URLSearchParams({
        text: getShareMessage(),
        url,
      }).toString();

    window.open(
      shareUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function handleEmailShare() {
    const url = getReferralUrl();

    const subject = "Shop Port Petals";
    const body =
      `${getShareMessage()}\n\n${url}`;

    window.location.href =
      `mailto:?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  }

  function handleTextShare() {
    const url = getReferralUrl();

    const body =
      `${getShareMessage()} ${url}`;

    window.location.href =
      `sms:?body=${encodeURIComponent(body)}`;
  }

  const shareButtonClass =
    "inline-flex min-h-12 items-center justify-center rounded-full border border-[#284239]/15 bg-white px-4 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/50 hover:bg-[#fffaf6]";

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

      <div className="mt-5">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#284239]/15 px-5 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40"
        >
          {copied ? "Link Copied" : "Copy Referral Link"}
        </button>
      </div>

      <div className="mt-6 border-t border-[#284239]/10 pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#607068]">
          Share Your Referral
        </p>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleFacebookShare}
            className={shareButtonClass}
          >
            Facebook
          </button>

          <button
            type="button"
            onClick={handleXShare}
            className={shareButtonClass}
          >
            X
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className={shareButtonClass}
          >
            Instagram / More
          </button>

          <button
            type="button"
            onClick={handleEmailShare}
            className={shareButtonClass}
          >
            Email
          </button>

          <button
            type="button"
            onClick={handleTextShare}
            className={`${shareButtonClass} col-span-2`}
          >
            Text Message
          </button>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#e76d61] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
        >
          More Sharing Options
        </button>
      </div>

      <p
        aria-live="polite"
        className="mt-3 min-h-5 text-xs text-[#31583b]"
      >
        {shareStatus}
      </p>
    </div>
  );
}
