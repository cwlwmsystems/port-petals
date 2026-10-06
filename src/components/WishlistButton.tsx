"use client";

import { useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type WishlistButtonProps = {
  productId: string;
  compact?: boolean;
};

export default function WishlistButton({
  productId,
  compact = false,
}: WishlistButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [saved, setSaved] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function loadState() {
      const supabase =
        createClient();

      const {
        data: claimsData,
      } =
        await supabase.auth.getClaims();

      const userId =
        claimsData?.claims?.sub;

      if (!userId) {
        if (active) {
          setLoading(false);
        }

        return;
      }

      const { data } =
        await supabase
          .from(
            "customer_wishlist_items"
          )
          .select("product_id")
          .eq("user_id", userId)
          .eq(
            "product_id",
            productId
          )
          .maybeSingle();

      if (active) {
        setSaved(Boolean(data));
        setLoading(false);
      }
    }

    void loadState();

    return () => {
      active = false;
    };
  }, [productId]);

  async function toggleWishlist() {
    if (saving) {
      return;
    }

    setSaving(true);

    const supabase =
      createClient();

    const {
      data: claimsData,
    } =
      await supabase.auth.getClaims();

    const userId =
      claimsData?.claims?.sub;

    if (!userId) {
      const next =
        encodeURIComponent(
          pathname || "/"
        );

      router.push(
        `/account/login?next=${next}`
      );

      setSaving(false);
      return;
    }

    if (saved) {
      const { error } =
        await supabase
          .from(
            "customer_wishlist_items"
          )
          .delete()
          .eq("user_id", userId)
          .eq(
            "product_id",
            productId
          );

      if (!error) {
        setSaved(false);
        router.refresh();
      }

      setSaving(false);
      return;
    }

    const { error } =
      await supabase
        .from(
          "customer_wishlist_items"
        )
        .insert({
          user_id: userId,
          product_id: productId,
        });

    if (!error) {
      setSaved(true);
      router.refresh();
    }

    setSaving(false);
  }

  return (
    <button
      type="button"
      onClick={toggleWishlist}
      disabled={loading || saving}
      aria-label={
        saved
          ? "Remove from wishlist"
          : "Save to wishlist"
      }
      aria-pressed={saved}
      className={`inline-flex items-center justify-center rounded-full border shadow-sm transition ${
        compact
          ? "h-10 w-10"
          : "min-h-11 gap-2 px-4 py-2.5"
      } ${
        saved
          ? "border-[#e76d61]/30 bg-[#fff0ed] text-[#e76d61]"
          : "border-[#284239]/15 bg-white/95 text-[#284239] hover:border-[#e76d61]/40 hover:text-[#e76d61]"
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <span
        aria-hidden="true"
        className="text-lg leading-none"
      >
        {saved ? "♥" : "♡"}
      </span>

      {!compact && (
        <span className="text-sm font-semibold">
          {saved
            ? "Saved"
            : "Save"}
        </span>
      )}
    </button>
  );
}
