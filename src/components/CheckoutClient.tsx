"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useCart } from "@/components/CartProvider";
import CheckoutProgress from "@/components/CheckoutProgress";
import { createClient } from "@/lib/supabase/client";
import {
  trackAddPaymentInfo,
  trackBeginCheckout,
} from "@/lib/analytics";

type FulfillmentType = "pickup" | "delivery";

type DeliveryArea =
  | ""
  | "within-3"
  | "three-to-eight"
  | "smethport-eldred";

type IssuedReward = {
  id: string;
  name: string;
  redemptionCode: string;
  petalsCost: number;
  rewardType: string;
  expiresAt: string | null;
};

type ReferralDiscountReward = {
  id: string;
  rewardPercent: number;
  rewardCode: string;
  expiresAt: string | null;
};

type CreatedOrder = {
  orderId: string;
  orderNumber: string;
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  total: number;
  paymentStatus: string;
  rewardName?: string | null;
  rewardCode?: string | null;
  rewardType?: string | null;

  originalDeliveryFee?: number;
  deliveryRewardAmount?: number;
  deliveryRewardName?: string | null;
  deliveryRewardCode?: string | null;

  petalsDiscountAmount?: number;
  petalsDiscountPercent?: number | null;

  referralDiscountAmount?: number;
  referralDiscountPercent?: number | null;
  referralRewardCode?: string | null;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function CheckoutClient() {
  const { items, subtotal } = useCart();

  const [fulfillmentType, setFulfillmentType] =
    useState<FulfillmentType>("pickup");

  const [deliveryArea, setDeliveryArea] =
    useState<DeliveryArea>("");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [createdOrder, setCreatedOrder] =
    useState<CreatedOrder | null>(null);

  const [startingPayment, setStartingPayment] =
    useState(false);

  const [paymentError, setPaymentError] =
    useState("");

  const [
    requiredLeadTimeDays,
    setRequiredLeadTimeDays,
  ] = useState(0);

  const [
    earliestFulfillmentDate,
    setEarliestFulfillmentDate,
  ] = useState("");

  const [
    loadingLeadTime,
    setLoadingLeadTime,
  ] = useState(true);

  const [
    leadTimeError,
    setLeadTimeError,
  ] = useState("");

  const [
    issuedRewards,
    setIssuedRewards,
  ] = useState<IssuedReward[]>([]);

  const [
    loadingRewards,
    setLoadingRewards,
  ] = useState(true);

  const [
    signedInCustomer,
    setSignedInCustomer,
  ] = useState(false);

  const [
    selectedRewardId,
    setSelectedRewardId,
  ] = useState("");

  const [
    selectedDeliveryRewardId,
    setSelectedDeliveryRewardId,
  ] = useState("");

  const [
    referralRewards,
    setReferralRewards,
  ] = useState<ReferralDiscountReward[]>([]);

  const [
    selectedReferralRewardId,
    setSelectedReferralRewardId,
  ] = useState("");

  const beginCheckoutTracked =
    useRef(false);

  useEffect(() => {
    if (
      beginCheckoutTracked.current ||
      items.length === 0
    ) {
      return;
    }

    const sent =
      trackBeginCheckout(
        items.map((item) => ({
          productId:
            item.productId,
          variantId:
            item.variantId,
          productName:
            item.productName,
          unitPrice:
            item.unitPrice,
          quantity:
            item.quantity,
          garmentType:
            item.garmentType,
          size: item.size,
          color: item.color,
        })),
        subtotal
      );

    if (sent) {
      beginCheckoutTracked.current =
        true;
    }
  }, [items, subtotal]);

  useEffect(() => {
    let active = true;

    async function loadRewards() {
      setLoadingRewards(true);

      try {
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
            setSignedInCustomer(false);
            setIssuedRewards([]);
          }

          return;
        }

        if (active) {
          setSignedInCustomer(true);
        }

        const {
          data,
          error: rewardsError,
        } =
          await supabase
            .from(
              "customer_reward_redemptions"
            )
            .select(`
              id,
              petals_cost,
              redemption_code,
              expires_at,
              customer_rewards (
                name,
                reward_type
              )
            `)
            .eq(
              "user_id",
              userId
            )
            .eq(
              "status",
              "issued"
            )
            .order(
              "created_at",
              {
                ascending: false,
              }
            );

        if (rewardsError) {
          throw rewardsError;
        }

        const now = Date.now();

        const rewards: IssuedReward[] =
          (data ?? [])
            .filter((row) => {
              if (!row.expires_at) {
                return true;
              }

              return (
                new Date(
                  row.expires_at
                ).getTime() > now
              );
            })
            .map((row) => {
              const relatedReward =
                Array.isArray(
                  row.customer_rewards
                )
                  ? row.customer_rewards[0]
                  : row.customer_rewards;

              return {
                id: row.id,
                name:
                  relatedReward?.name ??
                  "Port Petals Reward",
                redemptionCode:
                  row.redemption_code ??
                  "",
                petalsCost:
                  Number(
                    row.petals_cost
                  ),

                rewardType:
                  relatedReward?.reward_type ??
                  "free_gift",

                expiresAt:
                  row.expires_at,
              };
            });

        if (active) {
          setIssuedRewards(
            rewards
          );
        }

        const {
          data: referralRewardData,
          error: referralRewardError,
        } =
          await supabase
            .from(
              "customer_referral_rewards"
            )
            .select(`
              id,
              reward_percent,
              reward_code,
              expires_at
            `)
            .eq(
              "user_id",
              userId
            )
            .eq(
              "status",
              "issued"
            )
            .order(
              "created_at",
              {
                ascending: false,
              }
            );

        if (referralRewardError) {
          throw referralRewardError;
        }

        const referralDiscounts:
          ReferralDiscountReward[] =
          (
            referralRewardData ??
            []
          )
            .filter((row) => {
              if (!row.expires_at) {
                return true;
              }

              return (
                new Date(
                  row.expires_at
                ).getTime() >
                now
              );
            })
            .map((row) => ({
              id: row.id,

              rewardPercent:
                Number(
                  row.reward_percent
                ),

              rewardCode:
                row.reward_code,

              expiresAt:
                row.expires_at,
            }));

        if (active) {
          setReferralRewards(
            referralDiscounts
          );
        }
      } catch (caughtError) {
        console.error(
          "Unable to load issued Petals rewards:",
          caughtError
        );

        if (active) {
          setIssuedRewards([]);
        }
      } finally {
        if (active) {
          setLoadingRewards(false);
        }
      }
    }

    void loadRewards();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      setRequiredLeadTimeDays(0);
      setEarliestFulfillmentDate("");
      setLoadingLeadTime(false);
      return;
    }

    const controller = new AbortController();

    async function loadLeadTime() {
      setLoadingLeadTime(true);
      setLeadTimeError("");

      try {
        const response = await fetch(
          "/api/orders/lead-time",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              productIds: items.map(
                (item) => item.productId
              ),
            }),
            signal: controller.signal,
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            "Unable to determine available dates."
          );
        }

        setRequiredLeadTimeDays(
          Number(
            result.requiredLeadTimeDays ??
              0
          )
        );

        setEarliestFulfillmentDate(
          String(
            result.earliestFulfillmentDate ??
              ""
          )
        );
      } catch (caughtError) {
        if (
          caughtError instanceof DOMException &&
          caughtError.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Unable to load fulfillment lead time:",
          caughtError
        );

        setLeadTimeError(
          "Available dates could not be loaded. Please refresh and try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoadingLeadTime(false);
        }
      }
    }

    void loadLeadTime();

    return () => {
      controller.abort();
    };
  }, [items]);

  const estimatedDeliveryFee =
    fulfillmentType !== "delivery"
      ? 0
      : deliveryArea === "three-to-eight"
        ? 10
        : deliveryArea ===
            "smethport-eldred"
          ? 15
          : 0;

  const estimatedTotal =
    subtotal + estimatedDeliveryFee;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      items.length === 0 ||
      submitting
    ) {
      return;
    }

    setError("");
    setSubmitting(true);

    const formData = new FormData(
      event.currentTarget
    );

    try {
      const response = await fetch(
        "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            customerName:
              formData.get("customerName"),
            customerEmail:
              formData.get("customerEmail"),
            customerPhone:
              formData.get("customerPhone"),

            emailMarketingConsent:
              formData.get(
                "emailMarketingConsent"
              ) === "yes",

            smsMarketingConsent:
              formData.get(
                "smsMarketingConsent"
              ) === "yes",

            fulfillmentType,

            requestedFulfillmentDate:
              formData.get(
                "requestedFulfillmentDate"
              ),

            deliveryArea,

            deliveryAddress:
              formData.get(
                "deliveryAddress"
              ),

            deliveryCity:
              formData.get("deliveryCity"),

            deliveryState:
              formData.get(
                "deliveryState"
              ),

            deliveryZip:
              formData.get("deliveryZip"),

            notes:
              formData.get("notes"),

            rewardRedemptionId:
              selectedRewardId ||
              null,

            deliveryRewardRedemptionId:
              selectedDeliveryRewardId ||
              null,

            referralRewardId:
              selectedReferralRewardId ||
              null,

            items: items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,

              playerName:
                item.playerName,

              playerNumber:
                item.playerNumber,

              customization:
                item.customization ?? {},
            })),
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        console.error(
          "Order creation failed:",
          result.error ?? result
        );

        throw new Error(
          result.error ??
            "We couldn't prepare your order. Please review your information and try again."
        );
      }

      setCreatedOrder(result);
    } catch (caughtError) {
      console.error(
        "Order preparation error:",
        caughtError
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "We couldn't prepare your order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSquarePayment() {
    if (
      !createdOrder ||
      startingPayment
    ) {
      return;
    }

    setPaymentError("");
    setStartingPayment(true);

    try {
      const response = await fetch(
        "/api/square/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            orderId:
              createdOrder.orderId,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        console.error(
          "Payment setup failed:",
          result.error ?? result
        );

        throw new Error(
          "We couldn't open payment. Please try again."
        );
      }

      if (!result.checkoutUrl) {
        console.error(
          "Payment setup returned no checkout URL."
        );

        throw new Error(
          "We couldn't open payment. Please try again."
        );
      }

      trackAddPaymentInfo(
        items.map((item) => ({
          productId:
            item.productId,
          variantId:
            item.variantId,
          productName:
            item.productName,
          unitPrice:
            item.unitPrice,
          quantity:
            item.quantity,
          garmentType:
            item.garmentType,
          size: item.size,
          color: item.color,
        })),
        createdOrder.total,
        "Square"
      );

      window.location.href =
        result.checkoutUrl;
    } catch (caughtError) {
      console.error(
        "Payment setup error:",
        caughtError
      );

      setPaymentError(
        "We couldn't open payment. Please try again."
      );

      setStartingPayment(false);
    }
  }

  if (
    items.length === 0 &&
    !createdOrder
  ) {
    return (
      <main className="min-h-[65vh] bg-[#f7f1e8] text-[#284239]">
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-8 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
            Checkout
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold text-[#153f32] sm:text-4xl">
            Your cart is empty
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#607068]">
            Add something to your cart before
            continuing to checkout.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white"
          >
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  if (createdOrder) {
    return (
      <main className="min-h-[70vh] bg-[#f7f1e8] text-[#284239]">
        {startingPayment && (
          <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f7f1e8]/95 px-5 backdrop-blur-sm"
          >
            <div className="pp-scale-in w-full max-w-md rounded-3xl border border-[#284239]/10 bg-white p-7 text-center shadow-[0_24px_80px_rgba(20,38,31,0.18)] sm:p-9">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff4f1]">
                <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#284239]/15 border-t-[#e76d61]" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Secure Checkout
              </p>

              <h2 className="mt-2 font-serif text-3xl font-semibold text-[#153f32]">
                Preparing your payment
              </h2>

              <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#607068]">
                Your order has been saved. You&apos;ll continue to Square to securely complete payment.
              </p>

              <div className="mt-6 rounded-2xl bg-[#edf3e7] p-4 text-sm leading-6 text-[#36594c]">
                Please keep this window open while we connect you to Square.
              </div>

              <p className="mt-4 text-xs leading-5 text-[#718078]">
                Secure payment powered by Square.
              </p>
            </div>
          </div>
        )}

        <section className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-16">
          <div className="mb-8 sm:mb-10">
            <CheckoutProgress currentStep="payment" />
          </div>

          <div className="rounded-3xl border border-[#284239]/10 bg-white p-5 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#edf3e7] text-xl text-[#31583b]">
              ✓
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
              Order Ready for Payment
            </p>

            <h1 className="mt-2 break-words font-serif text-3xl font-semibold text-[#153f32] sm:text-4xl">
              {createdOrder.orderNumber}
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#607068] sm:text-base sm:leading-7">
              Your order details have been
              saved. Payment has not been
              collected yet.
            </p>

            <div className="mx-auto mt-6 max-w-md rounded-2xl bg-[#f7f1e8] p-4 text-left sm:p-5">
              <div className="flex justify-between gap-4 text-sm">
                <span>Merchandise</span>

                <strong>
                  {formatPrice(
                    createdOrder.subtotal
                  )}
                </strong>
              </div>

              <div className="mt-3 flex justify-between gap-4 text-sm">
                <span>Delivery</span>

                <strong>
                  {formatPrice(
                    createdOrder.deliveryFee
                  )}
                </strong>
              </div>

              {Number(
                createdOrder.deliveryRewardAmount ??
                0
              ) > 0 && (
                <>
                  <div className="mt-3 flex justify-between gap-4 text-sm">
                    <span>
                      Local Delivery
                    </span>

                    <strong className="text-[#718078] line-through">
                      {formatPrice(
                        Number(
                          createdOrder.originalDeliveryFee ??
                          createdOrder.deliveryRewardAmount
                        )
                      )}
                    </strong>
                  </div>

                  <div className="mt-3 flex justify-between gap-4 text-sm text-[#31583b]">
                    <span>
                      Free Local Delivery Reward
                    </span>

                    <strong>
                      -
                      {formatPrice(
                        Number(
                          createdOrder.deliveryRewardAmount
                        )
                      )}
                    </strong>
                  </div>
                </>
              )}

              {Number(
                createdOrder.petalsDiscountAmount ??
                0
              ) > 0 && (
                <div className="mt-3 flex justify-between gap-4 text-sm text-[#31583b]">
                  <span>
                    {createdOrder.petalsDiscountPercent
                      ? `Petals Reward — ${createdOrder.petalsDiscountPercent}% Off`
                      : "Petals Reward Discount"}
                  </span>

                  <strong>
                    -
                    {formatPrice(
                      Number(
                        createdOrder.petalsDiscountAmount
                      )
                    )}
                  </strong>
                </div>
              )}

              {Number(
                createdOrder.referralDiscountAmount ??
                0
              ) > 0 && (
                <div className="mt-3 flex justify-between gap-4 text-sm text-[#31583b]">
                  <span>
                    Referral Reward
                    {createdOrder.referralDiscountPercent
                      ? ` (${createdOrder.referralDiscountPercent}% off)`
                      : ""}
                  </span>

                  <strong>
                    -
                    {formatPrice(
                      Number(
                        createdOrder.referralDiscountAmount
                      )
                    )}
                  </strong>
                </div>
              )}

              {createdOrder.taxAmount > 0 && (
                <div className="mt-3 flex justify-between gap-4 text-sm">
                  <span>Tax</span>

                  <strong>
                    {formatPrice(
                      createdOrder.taxAmount
                    )}
                  </strong>
                </div>
              )}

              {createdOrder.referralRewardCode && (
                <div className="mt-4 rounded-xl bg-[#edf3e7] p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#31583b]">
                    Referral Reward Applied
                  </p>

                  <p className="mt-1 font-mono text-xs text-[#607068]">
                    {createdOrder.referralRewardCode}
                  </p>
                </div>
              )}

              {createdOrder.rewardName && (
                <div className="mt-4 rounded-xl bg-[#edf3e7] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#31583b]">
                    Petals Reward
                  </p>

                  <p className="mt-1 font-semibold text-[#153f32]">
                    {createdOrder.rewardName}
                  </p>

                  {createdOrder.rewardCode && (
                    <p className="mt-1 font-mono text-xs text-[#607068]">
                      {createdOrder.rewardCode}
                    </p>
                  )}

                  <p className="mt-2 text-xs leading-5 text-[#607068]">
                    {Number(
                      createdOrder.petalsDiscountAmount ??
                      0
                    ) > 0
                      ? "This Petals reward has been applied to your eligible merchandise."
                      : "This free gift will be fulfilled with your order."}
                  </p>
                </div>
              )}

              {createdOrder.deliveryRewardName && (
                <div className="mt-4 rounded-xl bg-[#edf3e7] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#31583b]">
                    Delivery Reward
                  </p>

                  <p className="mt-1 font-semibold text-[#153f32]">
                    {createdOrder.deliveryRewardName}
                  </p>

                  {createdOrder.deliveryRewardCode && (
                    <p className="mt-1 font-mono text-xs text-[#607068]">
                      {createdOrder.deliveryRewardCode}
                    </p>
                  )}

                  <p className="mt-2 text-xs leading-5 text-[#607068]">
                    Your eligible local
                    delivery fee has been
                    removed from this order.
                  </p>
                </div>
              )}

              <div className="mt-4 flex justify-between gap-4 border-t border-[#284239]/10 pt-4 text-lg">
                <span>Total</span>

                <strong className="text-[#e76d61]">
                  {formatPrice(
                    createdOrder.total
                  )}
                </strong>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-[#edf3e7] p-4 text-sm leading-6 text-[#36594c]">
              Continue to Square to securely
              complete your payment.
            </div>

            {paymentError && (
              <div
                aria-live="polite"
                className="mt-4 rounded-xl bg-[#fff0ed] p-4 text-sm leading-6 text-[#a7473f]"
              >
                {paymentError}
              </div>
            )}

            <button
              type="button"
              onClick={handleSquarePayment}
              disabled={startingPayment}
              className="mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#d85b50] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {startingPayment
                ? "Opening Secure Payment..."
                : "Continue to Secure Payment"}
            </button>

            <p className="mt-3 text-xs leading-5 text-[#718078]">
              Secure payment powered by Square.
            </p>

            <Link
              href="/cart"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-[#284239]/15 px-6 py-2 text-sm font-semibold text-[#284239]"
            >
              Return to Cart
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12 lg:px-10">
        <div className="mb-8 max-w-3xl sm:mb-10">
          <CheckoutProgress currentStep="details" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61] sm:text-sm">
            Checkout
          </p>

          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#153f32] sm:text-5xl">
            Complete your order
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068]">
            Enter your contact information,
            choose pickup or delivery, and
            select your requested date.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7 grid gap-6 sm:mt-10 lg:grid-cols-[1fr_360px] lg:gap-8"
        >
          <div className="space-y-5 sm:space-y-6">
            {/* CONTACT */}
            <section className="rounded-2xl border border-[#284239]/10 bg-white p-4 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Step 1
              </p>

              <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32] sm:text-2xl">
                Contact Information
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#607068]">
                Port Petals will use this
                information for your order
                confirmation and order updates.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold">
                    Name *
                  </span>

                  <input
                    required
                    name="customerName"
                    autoComplete="name"
                    className="min-h-12 rounded-xl border border-[#284239]/15 px-4 py-3 text-base outline-none focus:border-[#e76d61]"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold">
                    Email *
                  </span>

                  <input
                    required
                    type="email"
                    name="customerEmail"
                    autoComplete="email"
                    inputMode="email"
                    className="min-h-12 rounded-xl border border-[#284239]/15 px-4 py-3 text-base outline-none focus:border-[#e76d61]"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold">
                    Phone *
                  </span>

                  <input
                    required
                    type="tel"
                    name="customerPhone"
                    autoComplete="tel"
                    inputMode="tel"
                    className="min-h-12 rounded-xl border border-[#284239]/15 px-4 py-3 text-base outline-none focus:border-[#e76d61]"
                  />
                </label>
              </div>

              <div className="mt-6 border-t border-[#284239]/10 pt-5">
                <p className="text-sm font-semibold text-[#153f32]">
                  Stay in touch
                </p>

                <p className="mt-1 text-sm leading-6 text-[#607068]">
                  These are optional. Your choices do not affect your order.
                </p>

                <div className="mt-4 space-y-4">
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#284239]/10 bg-[#faf7f1] p-4">
                    <input
                      type="checkbox"
                      name="emailMarketingConsent"
                      value="yes"
                      className="mt-1 h-4 w-4 shrink-0 accent-[#e76d61]"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-[#153f32]">
                        Email me Port Petals news and offers
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-[#607068]">
                        Receive occasional emails about new products,
                        seasonal releases, promotions, and Port Petals news.
                        You can unsubscribe from marketing emails at any time.
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#284239]/10 bg-[#faf7f1] p-4">
                    <input
                      type="checkbox"
                      name="smsMarketingConsent"
                      value="yes"
                      className="mt-1 h-4 w-4 shrink-0 accent-[#e76d61]"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-[#153f32]">
                        Text me Port Petals news and offers
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-[#607068]">
                        By checking this box, you agree to receive recurring
                        promotional text messages from Port Petals at the
                        mobile number provided. Consent is not a condition of
                        purchase. Message frequency varies. Message and data
                        rates may apply. Reply STOP to opt out when SMS
                        messaging is available.
                      </span>
                    </span>
                  </label>
                </div>

                <p className="mt-4 text-xs leading-5 text-[#718078]">
                  Order confirmations, payment notices, fulfillment updates,
                  and other transactional messages are separate from these
                  marketing preferences.
                </p>
              </div>
            </section>

            {/* REFERRAL DISCOUNT */}
            {signedInCustomer &&
              referralRewards.length > 0 && (
                <section className="rounded-2xl border border-[#284239]/10 bg-white p-4 shadow-sm sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                    Referral Reward
                  </p>

                  <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32] sm:text-2xl">
                    Use Your Referral Discount
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#607068]">
                    Referral discounts apply to
                    merchandise. Delivery is not
                    discounted.
                  </p>

                  <label className="mt-4 grid gap-2">
                    <span className="text-sm font-semibold text-[#153f32]">
                      Available discount
                    </span>

                    <select
                      name="referralRewardId"
                      value={
                        selectedReferralRewardId
                      }
                      onChange={(event) =>
                        setSelectedReferralRewardId(
                          event.target.value
                        )
                      }
                      className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none focus:border-[#e76d61]"
                    >
                      <option value="">
                        Do not use a referral reward
                      </option>

                      {referralRewards.map(
                        (reward) => (
                          <option
                            key={reward.id}
                            value={reward.id}
                          >
                            {reward.rewardPercent}%
                            {" Off — "}
                            {reward.rewardCode}
                          </option>
                        )
                      )}
                    </select>
                  </label>

                  {selectedReferralRewardId && (
                    <div className="mt-4 rounded-xl bg-[#edf3e7] p-4 text-sm leading-6 text-[#36594c]">
                      Your referral reward will be
                      validated and calculated
                      securely when the order is
                      created.
                    </div>
                  )}
                </section>
              )}

            {/* PETALS REWARD */}
            <section className="rounded-2xl border border-[#284239]/10 bg-white p-4 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Petals Rewards
              </p>

              <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32] sm:text-2xl">
                Use a Petals Reward
              </h2>

              {loadingRewards ? (
                <p className="mt-3 text-sm leading-6 text-[#607068]">
                  Checking your available
                  rewards...
                </p>
              ) : !signedInCustomer ? (
                <div className="mt-4 rounded-xl bg-[#faf7f1] p-4">
                  <p className="text-sm leading-6 text-[#607068]">
                    Have a Petals reward?
                    Sign in before placing your
                    order to use it.
                  </p>

                  <Link
                    href="/account/login?next=/checkout"
                    className="mt-3 inline-flex min-h-10 items-center justify-center rounded-full border border-[#284239]/15 px-4 py-2 text-sm font-semibold text-[#153f32]"
                  >
                    Sign In
                  </Link>
                </div>
              ) : issuedRewards.length === 0 ? (
                <div className="mt-4 rounded-xl bg-[#faf7f1] p-4">
                  <p className="text-sm leading-6 text-[#607068]">
                    You do not currently have
                    an issued Petals reward.
                    Keep growing your Petals
                    in My Account.
                  </p>
                </div>
              ) : (
                <div className="mt-4">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#153f32]">
                      Available reward
                    </span>

                    <select
                      name="rewardRedemptionId"
                      value={
                        selectedRewardId
                      }
                      onChange={(event) =>
                        setSelectedRewardId(
                          event.target.value
                        )
                      }
                      className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none focus:border-[#e76d61]"
                    >
                      <option value="">
                        Do not use a reward
                      </option>

                      {issuedRewards
                        .filter(
                          (reward) =>
                            !(
                              reward.rewardType ===
                                "special_perk" &&
                              reward.name ===
                                "Free Local Delivery"
                            )
                        )
                        .map(
                        (reward) => (
                          <option
                            key={
                              reward.id
                            }
                            value={
                              reward.id
                            }
                          >
                            {reward.name}
                            {" — "}
                            {reward.redemptionCode}
                          </option>
                        )
                      )}
                    </select>
                  </label>

                  {selectedRewardId && (
                    <div className="mt-4 rounded-xl bg-[#edf3e7] p-4 text-sm leading-6 text-[#36594c]">
                      {["fixed_discount", "percent_discount"].includes(
                        issuedRewards.find(
                          (reward) =>
                            reward.id ===
                            selectedRewardId
                        )?.rewardType ?? ""
                      )
                        ? "This Petals discount will be calculated securely from your merchandise total. Merchandise discounts cannot be combined with a referral discount."
                        : "This reward will be reserved for this order and fulfilled with your purchase."}
                    </div>
                  )}

                  {issuedRewards.some(
                    (reward) =>
                      reward.rewardType ===
                        "special_perk" &&
                      reward.name ===
                        "Free Local Delivery"
                  ) && (
                    <div className="mt-6 border-t border-[#284239]/10 pt-5">
                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-[#153f32]">
                          Delivery perk
                        </span>

                        <select
                          name="deliveryRewardRedemptionId"
                          value={
                            selectedDeliveryRewardId
                          }
                          onChange={(event) =>
                            setSelectedDeliveryRewardId(
                              event.target.value
                            )
                          }
                          className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none focus:border-[#e76d61]"
                        >
                          <option value="">
                            Do not use a delivery perk
                          </option>

                          {issuedRewards
                            .filter(
                              (reward) =>
                                reward.rewardType ===
                                  "special_perk" &&
                                reward.name ===
                                  "Free Local Delivery"
                            )
                            .map(
                              (reward) => (
                                <option
                                  key={
                                    reward.id
                                  }
                                  value={
                                    reward.id
                                  }
                                >
                                  {reward.name}
                                  {" — "}
                                  {reward.redemptionCode}
                                </option>
                              )
                            )}
                        </select>
                      </label>

                      {selectedDeliveryRewardId && (
                        <div className="mt-4 rounded-xl bg-[#edf3e7] p-4 text-sm leading-6 text-[#36594c]">
                          Free Local Delivery
                          will remove the eligible
                          paid local delivery fee.
                          It may be combined with
                          a gift or eligible
                          merchandise reward.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* FULFILLMENT */}
            <section className="rounded-2xl border border-[#284239]/10 bg-white p-4 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Step 2
              </p>

              <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32] sm:text-2xl">
                Pickup or Delivery
              </h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex min-h-[88px] cursor-pointer items-center rounded-2xl border p-4 transition active:scale-[0.99] ${
                    fulfillmentType ===
                    "pickup"
                      ? "border-[#e76d61] bg-[#fff4f1] shadow-sm ring-1 ring-[#e76d61]/20"
                      : "border-[#284239]/15"
                  }`}
                >
                  <input
                    type="radio"
                    name="fulfillment"
                    value="pickup"
                    checked={
                      fulfillmentType ===
                      "pickup"
                    }
                    onChange={() => {
                      setFulfillmentType(
                        "pickup"
                      );
                      setDeliveryArea("");
                    }}
                    className="sr-only"
                  />

                  <span>
                    <strong className="block text-[#153f32]">
                      Pickup
                    </strong>

                    <span className="mt-1 block text-sm leading-5 text-[#607068]">
                      430 E Arnold Avenue
                      <br />
                      Port Allegany, PA
                    </span>
                  </span>
                </label>

                <label
                  className={`flex min-h-[88px] cursor-pointer items-center rounded-2xl border p-4 transition active:scale-[0.99] ${
                    fulfillmentType ===
                    "delivery"
                      ? "border-[#e76d61] bg-[#fff4f1] shadow-sm ring-1 ring-[#e76d61]/20"
                      : "border-[#284239]/15"
                  }`}
                >
                  <input
                    type="radio"
                    name="fulfillment"
                    value="delivery"
                    checked={
                      fulfillmentType ===
                      "delivery"
                    }
                    onChange={() =>
                      setFulfillmentType(
                        "delivery"
                      )
                    }
                    className="sr-only"
                  />

                  <span>
                    <strong className="block text-[#153f32]">
                      Local Delivery
                    </strong>

                    <span className="mt-1 block text-sm leading-5 text-[#607068]">
                      Available within the Port
                      Petals delivery area
                    </span>
                  </span>
                </label>
              </div>
            </section>

            {/* DATE + DELIVERY ADDRESS */}
            <section className="rounded-2xl border border-[#284239]/10 bg-white p-4 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Step 3
              </p>

              <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32] sm:text-2xl">
                {fulfillmentType === "pickup"
                  ? "Pickup Details"
                  : "Delivery Details"}
              </h2>

              <div className="mt-5">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">
                    {fulfillmentType ===
                    "pickup"
                      ? "Requested Pickup Date *"
                      : "Requested Delivery Date *"}
                  </span>

                  <input
                    required
                    type="date"
                    name="requestedFulfillmentDate"
                    min={
                      earliestFulfillmentDate ||
                      undefined
                    }
                    disabled={
                      loadingLeadTime ||
                      Boolean(
                        leadTimeError
                      )
                    }
                    className="min-h-12 rounded-xl border border-[#284239]/15 px-4 py-3 text-base outline-none focus:border-[#e76d61] disabled:cursor-not-allowed disabled:bg-[#f2f0ec]"
                  />

                  {loadingLeadTime ? (
                    <span className="text-xs leading-5 text-[#718078]">
                      Checking the earliest
                      available date...
                    </span>
                  ) : leadTimeError ? (
                    <span className="rounded-lg bg-[#fff0ed] px-3 py-2 text-xs leading-5 text-[#a7473f]">
                      {leadTimeError}
                    </span>
                  ) : requiredLeadTimeDays >
                    0 ? (
                    <span className="text-xs leading-5 text-[#718078]">
                      This order requires at
                      least{" "}
                      {
                        requiredLeadTimeDays
                      }{" "}
                      full preparation day
                      {requiredLeadTimeDays ===
                      1
                        ? ""
                        : "s"}
                      . Earlier dates are
                      unavailable.
                    </span>
                  ) : (
                    <span className="text-xs leading-5 text-[#718078]">
                      Choose the date you would
                      like your order{" "}
                      {fulfillmentType ===
                      "pickup"
                        ? "ready for pickup"
                        : "delivered"}
                      .
                    </span>
                  )}
                </label>
              </div>

              {fulfillmentType ===
                "delivery" && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 sm:col-span-2">
                    <span className="text-sm font-semibold">
                      Delivery Area *
                    </span>

                    <select
                      required
                      value={deliveryArea}
                      onChange={(event) =>
                        setDeliveryArea(
                          event.target
                            .value as DeliveryArea
                        )
                      }
                      className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none focus:border-[#e76d61]"
                    >
                      <option value="">
                        Choose delivery area
                      </option>

                      <option value="within-3">
                        Within 3 miles — Free
                      </option>

                      <option value="three-to-eight">
                        Over 3 miles up to 8
                        miles — $10
                      </option>

                      <option value="smethport-eldred">
                        Smethport or Eldred —
                        $15
                      </option>
                    </select>
                  </label>

                  <label className="grid gap-2 sm:col-span-2">
                    <span className="text-sm font-semibold">
                      Street Address *
                    </span>

                    <input
                      required
                      name="deliveryAddress"
                      autoComplete="street-address"
                      className="min-h-12 rounded-xl border border-[#284239]/15 px-4 py-3 text-base outline-none focus:border-[#e76d61]"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold">
                      City *
                    </span>

                    <input
                      required
                      name="deliveryCity"
                      autoComplete="address-level2"
                      className="min-h-12 rounded-xl border border-[#284239]/15 px-4 py-3 text-base outline-none focus:border-[#e76d61]"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold">
                      State *
                    </span>

                    <input
                      required
                      name="deliveryState"
                      defaultValue="PA"
                      autoComplete="address-level1"
                      className="min-h-12 rounded-xl border border-[#284239]/15 px-4 py-3 text-base outline-none focus:border-[#e76d61]"
                    />
                  </label>

                  <label className="grid gap-2 sm:col-span-2">
                    <span className="text-sm font-semibold">
                      ZIP Code *
                    </span>

                    <input
                      required
                      name="deliveryZip"
                      autoComplete="postal-code"
                      inputMode="numeric"
                      className="min-h-12 rounded-xl border border-[#284239]/15 px-4 py-3 text-base outline-none focus:border-[#e76d61]"
                    />
                  </label>
                </div>
              )}
            </section>

            {/* NOTES */}
            <section className="rounded-2xl border border-[#284239]/10 bg-white p-4 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Step 4
              </p>

              <label className="mt-1 grid gap-2">
                <span className="font-serif text-xl font-semibold text-[#153f32] sm:text-2xl">
                  Order Notes
                </span>

                <span className="text-sm leading-6 text-[#607068]">
                  Optional. Add anything Port
                  Petals should know about this
                  order.
                </span>

                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Special instructions or other order information..."
                  className="mt-2 resize-y rounded-xl border border-[#284239]/15 px-4 py-3 text-base outline-none focus:border-[#e76d61]"
                />
              </label>
            </section>
          </div>

          {/* SUMMARY */}
          <aside className="h-fit rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
              Step 5
            </p>

            <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
              Review Your Order
            </h2>

            <div className="mt-5 space-y-3">
              {items.map((item) => (
                <div
                  key={item.lineId}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span className="min-w-0 leading-5 text-[#607068]">
                    {item.productName} ×{" "}
                    {item.quantity}
                  </span>

                  <strong className="shrink-0 text-[#284239]">
                    {formatPrice(
                      item.unitPrice *
                        item.quantity
                    )}
                  </strong>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-[#284239]/10 pt-5">
              <div className="flex justify-between gap-4 text-sm">
                <span>Subtotal</span>

                <strong>
                  {formatPrice(subtotal)}
                </strong>
              </div>

              <div className="mt-3 flex justify-between gap-4 text-sm">
                <span>Delivery</span>

                <strong>
                  {fulfillmentType ===
                    "delivery" &&
                  deliveryArea === ""
                    ? "Select area"
                    : formatPrice(
                        estimatedDeliveryFee
                      )}
                </strong>
              </div>

              <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#284239]/10 pt-5">
                <span className="font-semibold">
                  Estimated Total
                </span>

                <strong className="text-2xl text-[#e76d61]">
                  {formatPrice(
                    estimatedTotal
                  )}
                </strong>
              </div>
            </div>

            {error && (
              <div
                aria-live="polite"
                className="mt-5 rounded-xl bg-[#fff0ed] p-4 text-sm leading-6 text-[#a7473f]"
              >
                {error}
              </div>
            )}

            {fulfillmentType ===
              "delivery" &&
              deliveryArea === "" && (
                <div className="mt-4 rounded-xl bg-[#fff0ed] p-4 text-sm leading-5 text-[#a7473f]">
                  Choose a delivery area before
                  continuing.
                </div>
              )}

            <button
              type="submit"
              disabled={
                submitting ||
                loadingLeadTime ||
                Boolean(
                  leadTimeError
                ) ||
                (fulfillmentType ===
                  "delivery" &&
                  deliveryArea === "")
              }
              className="mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-[#e76d61] px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#d85b50] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#d9d5ce] disabled:text-[#7a7a76] disabled:shadow-none"
            >
              {submitting
                ? "Preparing Your Order..."
                : "Review & Continue to Payment"}
            </button>

            <div className="mt-4 rounded-xl bg-[#edf3e7] p-4">
              <p className="text-center text-xs font-semibold text-[#36594c]">
                Secure checkout powered by
                Square
              </p>

              <p className="mt-1 text-center text-xs leading-5 text-[#718078]">
                Payment is not collected until
                the next step.
              </p>
            </div>

            <Link
              href="/cart"
              className="mt-4 flex min-h-11 items-center justify-center text-sm font-semibold text-[#36594c]"
            >
              ← Back to Cart
            </Link>
          </aside>
        </form>
      </section>
    </main>
  );
}
