"use client";

import {
  useState,
} from "react";
import {
  useRouter,
} from "next/navigation";
import {
  createClient,
} from "@/lib/supabase/client";

type RedeemRewardButtonProps = {
  rewardId: string;
  rewardName: string;
  petalsCost: number;
  affordable: boolean;
};

export default function RedeemRewardButton({
  rewardId,
  rewardName,
  petalsCost,
  affordable,
}: RedeemRewardButtonProps) {
  const router =
    useRouter();

  const [
    isRedeeming,
    setIsRedeeming,
  ] = useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const [
    success,
    setSuccess,
  ] =
    useState<string | null>(
      null
    );

  async function handleRedeem() {
    if (
      !affordable ||
      isRedeeming
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Redeem ${petalsCost} Petals for "${rewardName}"?`
      );

    if (!confirmed) {
      return;
    }

    setIsRedeeming(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase =
        createClient();

      const {
        data,
        error:
          redemptionError,
      } =
        await supabase.rpc(
          "redeem_customer_reward",
          {
            p_reward_id:
              rewardId,
          }
        );

      if (
        redemptionError
      ) {
        throw redemptionError;
      }

      const result =
        Array.isArray(data)
          ? data[0]
          : data;

      if (!result) {
        throw new Error(
          "The reward could not be redeemed."
        );
      }

      setSuccess(
        `Reward redeemed. You now have ${Number(
          result.balance_after
        ).toLocaleString()} Petals.`
      );

      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to redeem this reward.";

      setError(message);
    } finally {
      setIsRedeeming(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={
          handleRedeem
        }
        disabled={
          !affordable ||
          isRedeeming
        }
        className={[
          "w-full rounded-full px-4 py-3 text-sm font-semibold transition",
          affordable &&
          !isRedeeming
            ? "bg-[#153f32] text-white hover:bg-[#224f41]"
            : "cursor-not-allowed bg-[#ece9e2] text-[#8a918d]",
        ].join(" ")}
      >
        {isRedeeming
          ? "Redeeming..."
          : affordable
            ? `Redeem for ${petalsCost} Petals`
            : "Not enough Petals"}
      </button>

      {success && (
        <p className="mt-3 text-sm font-semibold text-[#31583b]">
          {success}
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm font-semibold text-[#a7473f]">
          {error}
        </p>
      )}
    </div>
  );
}
