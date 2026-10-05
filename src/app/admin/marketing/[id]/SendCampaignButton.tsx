"use client";

import {
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { sendCampaign } from "../actions";

type Props = {
  campaignId: string;
  campaignName: string;
  recipientCount: number;
};

export default function SendCampaignButton({
  campaignId,
  campaignName,
  recipientCount,
}: Props) {
  const router =
    useRouter();

  const [
    isPending,
    startTransition,
  ] =
    useTransition();

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  function handleSend() {
    if (
      recipientCount <= 0
    ) {
      setError(
        "This campaign has no eligible recipients."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Send "${campaignName}" to ${recipientCount} eligible ${
          recipientCount === 1
            ? "recipient"
            : "recipients"
        }?\n\nThis will send real promotional email and cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setError(null);

    startTransition(
      async () => {
        try {
          await sendCampaign(
            campaignId
          );

          router.refresh();
        } catch (
          sendError
        ) {
          setError(
            sendError instanceof
              Error
              ? sendError.message
              : "Unable to send campaign."
          );
        }
      }
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={
          isPending ||
          recipientCount <=
            0
        }
        onClick={
          handleSend
        }
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#e76d61] px-5 text-sm font-semibold text-white transition hover:bg-[#c95349] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending
          ? "Sending Campaign..."
          : `Send Campaign to ${recipientCount}`}
      </button>

      <p className="mt-2 text-xs leading-5 text-[#718078]">
        You will be asked to confirm before any email is sent.
      </p>

      {error && (
        <div className="mt-3 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#a7473f]">
          {error}
        </div>
      )}
    </div>
  );
}
