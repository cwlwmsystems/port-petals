import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { getEarliestFulfillmentDate } from "@/lib/orders/fulfillment-date";

type CheckoutItem = {
  productId: string;
  variantId: string | null;
  quantity: number;
  playerName?: string | null;
  playerNumber?: string | null;
  customization?: Record<string, string>;
};

type CheckoutRequest = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  emailMarketingConsent?: boolean;
  smsMarketingConsent?: boolean;

  fulfillmentType: "pickup" | "delivery";
  requestedFulfillmentDate: string;

  deliveryArea?:
    | ""
    | "within-3"
    | "three-to-eight"
    | "smethport-eldred";

  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryZip?: string;

  notes?: string;

  rewardRedemptionId?: string | null;
  deliveryRewardRedemptionId?: string | null;
  referralRewardId?: string | null;

  items: CheckoutItem[];
};

function cleanText(
  value: unknown,
  maxLength = 250
) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function normalizeMarketingEmail(
  value: string
) {
  return value
    .trim()
    .toLowerCase();
}

function normalizeMarketingPhone(
  value: string
) {
  const digits =
    value.replace(
      /\D/g,
      ""
    );

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (
    digits.length === 11 &&
    digits.startsWith("1")
  ) {
    return `+${digits}`;
  }

  return value.trim();
}

function splitCustomerName(
  value: string
) {
  const parts =
    value
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  return {
    firstName:
      parts[0] ?? null,

    lastName:
      parts.length > 1
        ? parts
            .slice(1)
            .join(" ")
        : null,
  };
}

function getDeliveryFee(
  fulfillmentType: "pickup" | "delivery",
  deliveryArea: CheckoutRequest["deliveryArea"]
) {
  if (fulfillmentType !== "delivery") {
    return 0;
  }

  switch (deliveryArea) {
    case "within-3":
      return 0;

    case "three-to-eight":
      return 10;

    case "smethport-eldred":
      return 15;

    default:
      throw new Error("Please choose a valid delivery area.");
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutRequest;

    const authSupabase =
      await createServerClient();

    const { data: claimsData } =
      await authSupabase.auth.getClaims();

    const customerUserId =
      claimsData?.claims?.sub ?? null;

    const cookieStore =
      await cookies();

    const referralCookieCode =
      cleanText(
        cookieStore.get(
          "port_petals_referral"
        )?.value,
        50
      )
        .toUpperCase() ||
      null;

    const customerName = cleanText(body.customerName, 100);
    const customerEmail = cleanText(body.customerEmail, 200);
    const customerPhone = cleanText(body.customerPhone, 50);
    const notes = cleanText(body.notes, 1000);

    const rewardRedemptionId =
      cleanText(
        body.rewardRedemptionId,
        100
      ) || null;

    const deliveryRewardRedemptionId =
      cleanText(
        body.deliveryRewardRedemptionId,
        100
      ) || null;

    const referralRewardId =
      cleanText(
        body.referralRewardId,
        100
      ) || null;

    const requestedFulfillmentDate =
      cleanText(
        body.requestedFulfillmentDate,
        10
      );

    if (!customerName) {
      return NextResponse.json(
        { error: "Customer name is required." },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    if (!customerPhone) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 }
      );
    }

    if (
      body.fulfillmentType !== "pickup" &&
      body.fulfillmentType !== "delivery"
    ) {
      return NextResponse.json(
        { error: "Choose pickup or delivery." },
        { status: 400 }
      );
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        requestedFulfillmentDate
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Please choose a valid pickup or delivery date.",
        },
        { status: 400 }
      );
    }

    const easternToday = new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    )
      .formatToParts(new Date())
      .reduce<Record<string, string>>(
        (parts, part) => {
          if (
            part.type === "year" ||
            part.type === "month" ||
            part.type === "day"
          ) {
            parts[part.type] = part.value;
          }

          return parts;
        },
        {}
      );

    const today =
      `${easternToday.year}-` +
      `${easternToday.month}-` +
      `${easternToday.day}`;

    if (requestedFulfillmentDate < today) {
      return NextResponse.json(
        {
          error:
            "Pickup or delivery date cannot be in the past.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    if (body.items.length > 50) {
      return NextResponse.json(
        { error: "Too many items in this order." },
        { status: 400 }
      );
    }

    const deliveryFee = getDeliveryFee(
      body.fulfillmentType,
      body.deliveryArea
    );

    let effectiveDeliveryFee =
      deliveryFee;

    let deliveryRewardAmount =
      0;

    let petalsDiscountAmount =
      0;

    let petalsDiscountPercent:
      number | null =
      null;

    const deliveryAddress = cleanText(
      body.deliveryAddress,
      250
    );

    const deliveryCity = cleanText(
      body.deliveryCity,
      100
    );

    const deliveryState = cleanText(
      body.deliveryState,
      50
    );

    const deliveryZip = cleanText(
      body.deliveryZip,
      20
    );

    if (body.fulfillmentType === "delivery") {
      if (
        !deliveryAddress ||
        !deliveryCity ||
        !deliveryState ||
        !deliveryZip
      ) {
        return NextResponse.json(
          {
            error:
              "A complete delivery address is required.",
          },
          { status: 400 }
        );
      }
    }

    const supabase = createAdminClient();

    const orderItems: Array<{
      product_id: string;
      variant_id: string | null;
      product_name: string;
      product_slug: string;
      quantity: number;
      unit_price: number;
      line_total: number;
      variant_name: string | null;
      garment_type: string | null;
      size: string | null;
      color: string | null;
      player_name: string | null;
      player_number: string | null;
      customization: Record<string, string>;
      image_url: string | null;
    }> = [];

    let subtotal = 0;
    let requiredLeadTimeDays = 0;

    for (const requestedItem of body.items) {
      const quantity = Number(requestedItem.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 20
      ) {
        return NextResponse.json(
          { error: "Invalid item quantity." },
          { status: 400 }
        );
      }

      const { data: product, error: productError } =
        await supabase
          .from("products")
          .select(`
            id,
            name,
            slug,
            base_price,
            status,
            lead_time_days,
            track_inventory,
            quantity,
            product_images (
              storage_path,
              is_primary,
              sort_order
            )
          `)
          .eq("id", requestedItem.productId)
          .eq("status", "published")
          .maybeSingle();

      if (productError || !product) {
        return NextResponse.json(
          {
            error:
              "A product in your cart is no longer available.",
          },
          { status: 400 }
        );
      }

      requiredLeadTimeDays = Math.max(
        requiredLeadTimeDays,
        Number(product.lead_time_days ?? 0)
      );

      let variantId: string | null = null;
      let variantName: string | null = null;
      let garmentType: string | null = null;
      let size: string | null = null;
      let color: string | null = null;

      let unitPrice: number | null =
        product.base_price === null
          ? null
          : Number(product.base_price);

      if (requestedItem.variantId) {
        const { data: variant, error: variantError } =
          await supabase
            .from("product_variants")
            .select(`
              id,
              name,
              garment_type,
              size,
              color,
              price,
              track_inventory,
              quantity,
              active
            `)
            .eq("id", requestedItem.variantId)
            .eq("product_id", product.id)
            .eq("active", true)
            .maybeSingle();

        if (variantError || !variant) {
          return NextResponse.json(
            {
              error: `${product.name}: the selected option is no longer available.`,
            },
            { status: 400 }
          );
        }

        variantId = variant.id;
        variantName = variant.name;
        garmentType = variant.garment_type;
        size = variant.size;
        color = variant.color;

        if (variant.price !== null) {
          unitPrice = Number(variant.price);
        }

        if (
          variant.track_inventory &&
          variant.quantity !== null &&
          variant.quantity < quantity
        ) {
          return NextResponse.json(
            {
              error: `${product.name}: only ${variant.quantity} of the selected option are currently available.`,
            },
            { status: 400 }
          );
        }
      } else if (
        product.track_inventory &&
        product.quantity !== null &&
        product.quantity < quantity
      ) {
        return NextResponse.json(
          {
            error: `${product.name}: only ${product.quantity} currently available.`,
          },
          { status: 400 }
        );
      }

      if (unitPrice === null || unitPrice < 0) {
        return NextResponse.json(
          {
            error: `${product.name}: a valid price could not be determined.`,
          },
          { status: 400 }
        );
      }

      const lineTotal =
        Math.round(unitPrice * quantity * 100) / 100;

      subtotal =
        Math.round((subtotal + lineTotal) * 100) / 100;

      const images = Array.isArray(product.product_images)
        ? product.product_images
        : [];

      const sortedImages = [...images].sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;

        return (
          Number(a.sort_order ?? 0) -
          Number(b.sort_order ?? 0)
        );
      });

      let imageUrl: string | null = null;

      if (sortedImages[0]?.storage_path) {
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(sortedImages[0].storage_path);

        imageUrl = data.publicUrl;
      }

      orderItems.push({
        product_id: product.id,
        variant_id: variantId,
        product_name: product.name,
        product_slug: product.slug,
        quantity,
        unit_price: unitPrice,
        line_total: lineTotal,
        variant_name: variantName,
        garment_type: garmentType,
        size,
        color,
        player_name:
          cleanText(requestedItem.playerName, 30) || null,
        player_number:
          cleanText(requestedItem.playerNumber, 10) || null,
        customization:
          requestedItem.customization &&
          typeof requestedItem.customization === "object"
            ? requestedItem.customization
            : {},
        image_url: imageUrl,
      });
    }

    const earliestFulfillmentDate =
      getEarliestFulfillmentDate(
        requiredLeadTimeDays
      );

    if (
      requestedFulfillmentDate <
      earliestFulfillmentDate
    ) {
      return NextResponse.json(
        {
          error:
            `The earliest available ${
              body.fulfillmentType === "pickup"
                ? "pickup"
                : "delivery"
            } date for this order is ${earliestFulfillmentDate}.`,
          code:
            "FULFILLMENT_DATE_TOO_SOON",
          earliestFulfillmentDate,
          requiredLeadTimeDays,
        },
        { status: 400 }
      );
    }

    const taxAmount = 0;

    let total =
      Math.round(
        (subtotal + deliveryFee + taxAmount) * 100
      ) / 100;

    const {
      data: orderNumber,
      error: orderNumberError,
    } = await supabase.rpc("generate_order_number");

    if (orderNumberError || !orderNumber) {
      throw new Error(
        orderNumberError?.message ??
          "Unable to generate order number."
      );
    }

    const { data: order, error: orderError } =
      await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          status: "awaiting_payment",
          payment_status: "unpaid",

          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_user_id: customerUserId,

          fulfillment_type: body.fulfillmentType,

          requested_fulfillment_date:
            requestedFulfillmentDate,

          required_lead_time_days:
            requiredLeadTimeDays,

          delivery_area:
            body.fulfillmentType === "delivery"
              ? body.deliveryArea
              : null,

          delivery_address:
            body.fulfillmentType === "delivery"
              ? deliveryAddress
              : null,

          delivery_city:
            body.fulfillmentType === "delivery"
              ? deliveryCity
              : null,

          delivery_state:
            body.fulfillmentType === "delivery"
              ? deliveryState
              : null,

          delivery_zip:
            body.fulfillmentType === "delivery"
              ? deliveryZip
              : null,

          subtotal,
          delivery_fee: deliveryFee,
          tax_amount: taxAmount,
          total,

          notes: notes || null,
        })
        .select("id, order_number")
        .single();

    if (orderError || !order) {
      throw new Error(
        orderError?.message ?? "Unable to create order."
      );
    }

    const rows = orderItems.map((item) => ({
      order_id: order.id,
      ...item,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(rows);

    if (itemsError) {
      await supabase
        .from("orders")
        .delete()
        .eq("id", order.id);

      throw new Error(itemsError.message);
    }

    let reservedReferralReward:
      | {
          id: string;
          code: string;
          percent: number;
          amount: number;
        }
      | null =
      null;

    /*
     * REFERRAL DISCOUNT REWARD
     *
     * The browser supplies only the reward UUID.
     * The discount percentage, ownership and status
     * all come from the database.
     */
    if (referralRewardId) {
      if (!customerUserId) {
        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            error:
              "Sign in to use a referral reward.",
          },
          { status: 401 }
        );
      }

      const {
        data: claimedReferralReward,
        error: claimedReferralRewardError,
      } =
        await supabase
          .from(
            "customer_referral_rewards"
          )
          .update({
            status: "reserved",
            order_id: order.id,
          })
          .eq(
            "id",
            referralRewardId
          )
          .eq(
            "user_id",
            customerUserId
          )
          .eq(
            "status",
            "issued"
          )
          .is(
            "order_id",
            null
          )
          .select(`
            id,
            reward_percent,
            reward_code,
            expires_at
          `)
          .maybeSingle();

      if (
        claimedReferralRewardError ||
        !claimedReferralReward
      ) {
        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            error:
              "That referral reward is no longer available.",
          },
          { status: 409 }
        );
      }

      if (
        claimedReferralReward.expires_at &&
        new Date(
          claimedReferralReward.expires_at
        ).getTime() <= Date.now()
      ) {
        await supabase
          .from(
            "customer_referral_rewards"
          )
          .update({
            status: "expired",
            order_id: null,
          })
          .eq(
            "id",
            claimedReferralReward.id
          )
          .eq(
            "status",
            "reserved"
          )
          .eq(
            "order_id",
            order.id
          );

        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            error:
              "That referral reward has expired.",
          },
          { status: 409 }
        );
      }

      const rewardPercent =
        Number(
          claimedReferralReward.reward_percent
        );

      if (
        !Number.isFinite(
          rewardPercent
        ) ||
        rewardPercent <= 0 ||
        rewardPercent > 100
      ) {
        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        throw new Error(
          "Referral reward has an invalid discount percentage."
        );
      }

      const discountAmount =
        Math.round(
          subtotal *
          (
            rewardPercent /
            100
          ) *
          100
        ) / 100;

      total =
        Math.max(
          0,
          Math.round(
            (
              subtotal -
              discountAmount +
              deliveryFee +
              taxAmount
            ) *
            100
          ) / 100
        );

      const {
        error:
          updateDiscountedOrderError,
      } =
        await supabase
          .from("orders")
          .update({
            referral_reward_id:
              claimedReferralReward.id,

            referral_reward_code:
              claimedReferralReward.reward_code,

            referral_discount_percent:
              rewardPercent,

            referral_discount_amount:
              discountAmount,

            total,
          })
          .eq(
            "id",
            order.id
          )
          .eq(
            "customer_user_id",
            customerUserId
          );

      if (
        updateDiscountedOrderError
      ) {
        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        throw new Error(
          "Unable to apply the referral discount."
        );
      }

      reservedReferralReward = {
        id:
          claimedReferralReward.id,

        code:
          claimedReferralReward.reward_code,

        percent:
          rewardPercent,

        amount:
          discountAmount,
      };

      const {
        error:
          referralRewardEventError,
      } =
        await supabase
          .from("order_events")
          .insert({
            order_id:
              order.id,

            event_type:
              "referral_reward_reserved",

            message:
              `${rewardPercent}% referral reward applied.`,

            metadata: {
              referral_reward_id:
                claimedReferralReward.id,

              referral_reward_code:
                claimedReferralReward.reward_code,

              discount_percent:
                rewardPercent,

              discount_amount:
                discountAmount,
            },
          });

      if (
        referralRewardEventError
      ) {
        console.error(
          "Unable to record referral reward event:",
          referralRewardEventError
        );
      }
    }

    let attachedReferral:
      | {
          id: string;
          code: string;
        }
      | null =
      null;

    /*
     * CUSTOMER REFERRAL ATTRIBUTION
     *
     * The browser never submits a referrer user ID.
     * The referral code comes from the HttpOnly cookie
     * created by /r/[code].
     *
     * Security rules:
     * - customer must be authenticated
     * - referral code must exist
     * - self-referrals are rejected
     * - referred customer can only be attributed once
     * - first valid referrer wins
     * - qualifying order is claimed conditionally
     *
     * Referral tracking is secondary to the sale.
     * A referral-system error must not prevent the
     * customer from placing an otherwise valid order.
     */
    if (
      customerUserId &&
      referralCookieCode
    ) {
      try {
        const {
          data: referralProfile,
          error: referralProfileError,
        } =
          await supabase
            .from(
              "customer_referral_profiles"
            )
            .select(`
              user_id,
              referral_code
            `)
            .eq(
              "referral_code",
              referralCookieCode
            )
            .maybeSingle();

        if (referralProfileError) {
          throw referralProfileError;
        }

        if (
          referralProfile &&
          referralProfile.user_id !==
            customerUserId
        ) {
          let {
            data: customerReferral,
            error:
              customerReferralError,
          } =
            await supabase
              .from(
                "customer_referrals"
              )
              .select(`
                id,
                referrer_user_id,
                referred_user_id,
                referral_code,
                status,
                qualifying_order_id
              `)
              .eq(
                "referred_user_id",
                customerUserId
              )
              .maybeSingle();

          if (customerReferralError) {
            throw customerReferralError;
          }

          /*
           * Create attribution only when this
           * customer has never been referred.
           */
          if (!customerReferral) {
            const {
              data: createdReferral,
              error:
                createReferralError,
            } =
              await supabase
                .from(
                  "customer_referrals"
                )
                .insert({
                  referrer_user_id:
                    referralProfile.user_id,

                  referred_user_id:
                    customerUserId,

                  referral_code:
                    referralProfile.referral_code,

                  status:
                    "pending",

                  reward_percent:
                    20,
                })
                .select(`
                  id,
                  referrer_user_id,
                  referred_user_id,
                  referral_code,
                  status,
                  qualifying_order_id
                `)
                .maybeSingle();

            if (createReferralError) {
              /*
               * A simultaneous request may have won
               * the unique referred_user_id race.
               * Re-read instead of overwriting.
               */
              const {
                data:
                  racedReferral,
                error:
                  racedReferralError,
              } =
                await supabase
                  .from(
                    "customer_referrals"
                  )
                  .select(`
                    id,
                    referrer_user_id,
                    referred_user_id,
                    referral_code,
                    status,
                    qualifying_order_id
                  `)
                  .eq(
                    "referred_user_id",
                    customerUserId
                  )
                  .maybeSingle();

              if (
                racedReferralError
              ) {
                throw (
                  racedReferralError
                );
              }

              customerReferral =
                racedReferral;
            } else {
              customerReferral =
                createdReferral;
            }
          }

          /*
           * First attribution wins.
           *
           * A later referral cookie from another
           * person cannot replace the original
           * referrer.
           */
          if (
            customerReferral &&
            customerReferral.referrer_user_id ===
              referralProfile.user_id &&
            customerReferral.status ===
              "pending" &&
            !customerReferral.qualifying_order_id
          ) {
            const {
              data: claimedReferral,
              error:
                claimReferralError,
            } =
              await supabase
                .from(
                  "customer_referrals"
                )
                .update({
                  qualifying_order_id:
                    order.id,
                })
                .eq(
                  "id",
                  customerReferral.id
                )
                .eq(
                  "referred_user_id",
                  customerUserId
                )
                .eq(
                  "referrer_user_id",
                  referralProfile.user_id
                )
                .eq(
                  "status",
                  "pending"
                )
                .is(
                  "qualifying_order_id",
                  null
                )
                .select(`
                  id,
                  referral_code
                `)
                .maybeSingle();

            if (claimReferralError) {
              throw claimReferralError;
            }

            if (claimedReferral) {
              const {
                error:
                  attachReferralError,
              } =
                await supabase
                  .from("orders")
                  .update({
                    referral_id:
                      claimedReferral.id,

                    referral_code:
                      claimedReferral.referral_code,
                  })
                  .eq(
                    "id",
                    order.id
                  )
                  .eq(
                    "customer_user_id",
                    customerUserId
                  );

              if (
                attachReferralError
              ) {
                /*
                 * Compensation:
                 * release the referral claim if the
                 * order snapshot could not be saved.
                 */
                await supabase
                  .from(
                    "customer_referrals"
                  )
                  .update({
                    qualifying_order_id:
                      null,
                  })
                  .eq(
                    "id",
                    claimedReferral.id
                  )
                  .eq(
                    "qualifying_order_id",
                    order.id
                  )
                  .eq(
                    "status",
                    "pending"
                  );

                throw attachReferralError;
              }

              attachedReferral = {
                id:
                  claimedReferral.id,

                code:
                  claimedReferral.referral_code,
              };

              const {
                error:
                  referralEventError,
              } =
                await supabase
                  .from(
                    "order_events"
                  )
                  .insert({
                    order_id:
                      order.id,

                    event_type:
                      "customer_referral_attached",

                    message:
                      "Customer referral attached to qualifying order.",

                    metadata: {
                      referral_id:
                        claimedReferral.id,

                      referral_code:
                        claimedReferral.referral_code,

                      referrer_user_id:
                        referralProfile.user_id,
                    },
                  });

              if (
                referralEventError
              ) {
                console.error(
                  "Unable to record referral attribution event:",
                  referralEventError
                );
              }
            }
          }
        }
      } catch (
        referralAttributionError
      ) {
        console.error(
          "Unable to attribute customer referral:",
          referralAttributionError
        );
      }
    }

    let reservedReward:
      | {
          id: string;
          name: string;
          code: string | null;
          rewardType: string;
          discountAmount: number;
        }
      | null =
      null;

    /*
     * PETALS REWARD RESERVATION
     *
     * The browser supplies only a redemption UUID.
     * Ownership, status and availability are
     * verified here using the authenticated user
     * derived from the Supabase session.
     *
     * The conditional UPDATE is the claim:
     * only an issued, unreserved reward belonging
     * to this customer can transition to reserved.
     */
    if (rewardRedemptionId) {
      if (!customerUserId) {
        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            error:
              "Sign in to use a Petals reward.",
          },
          { status: 401 }
        );
      }

      const {
        data: claimedReward,
        error: claimRewardError,
      } =
        await supabase
          .from(
            "customer_reward_redemptions"
          )
          .update({
            status: "reserved",
            order_id: order.id,
          })
          .eq(
            "id",
            rewardRedemptionId
          )
          .eq(
            "user_id",
            customerUserId
          )
          .eq(
            "status",
            "issued"
          )
          .is(
            "order_id",
            null
          )
          .select(`
            id,
            reward_id,
            redemption_code,
            expires_at
          `)
          .maybeSingle();

      if (
        claimRewardError ||
        !claimedReward
      ) {
        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            error:
              "That Petals reward is no longer available. Please choose another reward or continue without one.",
          },
          { status: 409 }
        );
      }

      const releaseClaimedReward =
        async () => {
          await supabase
            .from(
              "customer_reward_redemptions"
            )
            .update({
              status: "issued",
              order_id: null,
            })
            .eq(
              "id",
              claimedReward.id
            )
            .eq(
              "user_id",
              customerUserId
            )
            .eq(
              "status",
              "reserved"
            )
            .eq(
              "order_id",
              order.id
            );
        };

      if (
        claimedReward.expires_at &&
        new Date(
          claimedReward.expires_at
        ).getTime() <= Date.now()
      ) {
        await releaseClaimedReward();

        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            error:
              "That Petals reward has expired.",
          },
          { status: 409 }
        );
      }

      const {
        data: reward,
        error: rewardError,
      } =
        await supabase
          .from(
            "customer_rewards"
          )
          .select(`
            id,
            name,
            active,
            redeemable,
            reward_type,
            discount_value
          `)
          .eq(
            "id",
            claimedReward.reward_id
          )
          .eq(
            "active",
            true
          )
          .maybeSingle();

      if (
        rewardError ||
        !reward
      ) {
        await releaseClaimedReward();

        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            error:
              "That Petals reward is no longer available.",
          },
          { status: 409 }
        );
      }

      if (
        reward.redeemable !== true
      ) {
        await releaseClaimedReward();

        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            error:
              "That Petals reward is not currently redeemable.",
          },
          { status: 409 }
        );
      }

      const isFixedPetalsDiscount =
        reward.reward_type ===
          "fixed_discount" &&
        reward.name ===
          "$15 Off Your Order";

      const isPercentPetalsDiscount =
        reward.reward_type ===
          "percent_discount" &&
        reward.name ===
          "20% Off Merchandise";

      const isMerchandisePetalsDiscount =
        isFixedPetalsDiscount ||
        isPercentPetalsDiscount;

      if (
        isMerchandisePetalsDiscount
      ) {
        /*
         * Only one merchandise discount may
         * apply to an order.
         *
         * Referral discount:
         *   merchandise discount
         *
         * Petals discount:
         *   merchandise discount
         *
         * They cannot stack.
         */
        if (
          (
            reservedReferralReward
              ?.amount ?? 0
          ) > 0
        ) {
          await releaseClaimedReward();

          await supabase
            .from("orders")
            .delete()
            .eq("id", order.id);

          return NextResponse.json(
            {
              error:
                "A Petals merchandise discount cannot be combined with a referral discount. Please choose one merchandise discount.",
            },
            { status: 409 }
          );
        }


        /*
         * FIXED-DOLLAR REWARD
         */
        if (isFixedPetalsDiscount) {
          const fixedDiscountValue =
            Number(
              reward.discount_value ??
              0
            );

          if (
            !Number.isFinite(
              fixedDiscountValue
            ) ||
            fixedDiscountValue <= 0
          ) {
            await releaseClaimedReward();

            await supabase
              .from("orders")
              .delete()
              .eq("id", order.id);

            throw new Error(
              "Petals reward has an invalid discount value."
            );
          }

          petalsDiscountAmount =
            Math.min(
              subtotal,
              Math.round(
                fixedDiscountValue *
                100
              ) / 100
            );

          petalsDiscountPercent =
            null;
        }


        /*
         * PERCENTAGE REWARD
         */
        if (isPercentPetalsDiscount) {
          const percentDiscountValue =
            Number(
              reward.discount_value ??
              0
            );

          if (
            !Number.isFinite(
              percentDiscountValue
            ) ||
            percentDiscountValue <= 0 ||
            percentDiscountValue > 100
          ) {
            await releaseClaimedReward();

            await supabase
              .from("orders")
              .delete()
              .eq("id", order.id);

            throw new Error(
              "Petals reward has an invalid discount percentage."
            );
          }

          petalsDiscountPercent =
            percentDiscountValue;

          petalsDiscountAmount =
            Math.min(
              subtotal,
              Math.round(
                (
                  subtotal *
                  (
                    percentDiscountValue /
                    100
                  )
                ) *
                100
              ) / 100
            );
        }


        /*
         * AUTHORITATIVE ORDER TOTAL
         */
        total =
          Math.max(
            0,
            Math.round(
              (
                subtotal -
                petalsDiscountAmount +
                effectiveDeliveryFee +
                taxAmount
              ) *
              100
            ) / 100
          );

      } else if (
        reward.reward_type !==
        "free_gift"
      ) {
        await releaseClaimedReward();

        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            error:
              "That Petals reward belongs in a different reward category or is not supported yet.",
          },
          { status: 409 }
        );
      }

      const {
        error:
          attachRewardError,
      } =
        await supabase
          .from("orders")
          .update({
            reward_redemption_id:
              claimedReward.id,

            reward_name:
              reward.name,

            reward_code:
              claimedReward.redemption_code,

            petals_discount_amount:
              petalsDiscountAmount,

            petals_discount_percent:
              petalsDiscountPercent,

            total,
          })
          .eq(
            "id",
            order.id
          )
          .eq(
            "customer_user_id",
            customerUserId
          );

      if (attachRewardError) {
        await releaseClaimedReward();

        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        throw new Error(
          "Unable to attach the Petals reward to this order."
        );
      }

      reservedReward = {
        id: claimedReward.id,
        name: reward.name,
        code:
          claimedReward.redemption_code,
        rewardType:
          reward.reward_type,
        discountAmount:
          petalsDiscountAmount,
      };

      const {
        error:
          rewardEventError,
      } =
        await supabase
          .from("order_events")
          .insert({
            order_id:
              order.id,
            event_type:
              "petals_reward_reserved",
            message:
              `Petals reward reserved: ${reward.name}.`,
            metadata: {
              reward_redemption_id:
                claimedReward.id,
              reward_name:
                reward.name,
              reward_code:
                claimedReward.redemption_code,

              reward_type:
                reward.reward_type,

              petals_discount_amount:
                petalsDiscountAmount,

              petals_discount_percent:
                petalsDiscountPercent,
            },
          });

      if (rewardEventError) {
        console.error(
          "Unable to record Petals reward reservation event:",
          rewardEventError
        );
      }
    }

    let reservedDeliveryReward:
      | {
          id: string;
          name: string;
          code: string | null;
        }
      | null =
      null;

    /*
     * DELIVERY PETALS REWARD
     *
     * Delivery perks use their own order slot so they may
     * coexist with one merchandise/gift Petals reward.
     */
    if (deliveryRewardRedemptionId) {
      if (!customerUserId) {
        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            error:
              "Sign in to use a delivery reward.",
          },
          { status: 401 }
        );
      }

      const {
        data: claimedDeliveryReward,
        error: claimDeliveryRewardError,
      } =
        await supabase
          .from(
            "customer_reward_redemptions"
          )
          .update({
            status: "reserved",
            order_id: order.id,
          })
          .eq(
            "id",
            deliveryRewardRedemptionId
          )
          .eq(
            "user_id",
            customerUserId
          )
          .eq(
            "status",
            "issued"
          )
          .is(
            "order_id",
            null
          )
          .select(`
            id,
            reward_id,
            redemption_code,
            expires_at
          `)
          .maybeSingle();

      if (
        claimDeliveryRewardError ||
        !claimedDeliveryReward
      ) {
        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            error:
              "That delivery reward is no longer available.",
          },
          { status: 409 }
        );
      }

      const releaseClaimedDeliveryReward =
        async () => {
          await supabase
            .from(
              "customer_reward_redemptions"
            )
            .update({
              status: "issued",
              order_id: null,
            })
            .eq(
              "id",
              claimedDeliveryReward.id
            )
            .eq(
              "user_id",
              customerUserId
            )
            .eq(
              "status",
              "reserved"
            )
            .eq(
              "order_id",
              order.id
            );
        };

      if (
        claimedDeliveryReward.expires_at &&
        new Date(
          claimedDeliveryReward.expires_at
        ).getTime() <= Date.now()
      ) {
        await releaseClaimedDeliveryReward();

        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            error:
              "That delivery reward has expired.",
          },
          { status: 409 }
        );
      }

      const {
        data: deliveryReward,
        error: deliveryRewardError,
      } =
        await supabase
          .from(
            "customer_rewards"
          )
          .select(`
            id,
            name,
            active,
            redeemable,
            reward_type
          `)
          .eq(
            "id",
            claimedDeliveryReward.reward_id
          )
          .eq(
            "active",
            true
          )
          .maybeSingle();

      if (
        deliveryRewardError ||
        !deliveryReward ||
        deliveryReward.redeemable !==
          true ||
        deliveryReward.reward_type !==
          "special_perk" ||
        deliveryReward.name !==
          "Free Local Delivery"
      ) {
        await releaseClaimedDeliveryReward();

        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            error:
              "That delivery reward cannot be used on this order.",
          },
          { status: 409 }
        );
      }

      if (
        body.fulfillmentType !==
          "delivery" ||
        deliveryFee <= 0
      ) {
        await releaseClaimedDeliveryReward();

        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            error:
              "Free Local Delivery can only be used on an order with a paid local delivery fee.",
          },
          { status: 409 }
        );
      }

      effectiveDeliveryFee = 0;
      deliveryRewardAmount =
        deliveryFee;

      total =
        Math.max(
          0,
          Math.round(
            (
              subtotal -
              (
                reservedReferralReward
                  ?.amount ?? 0
              ) -
              petalsDiscountAmount +
              effectiveDeliveryFee +
              taxAmount
            ) *
            100
          ) / 100
        );

      const {
        error:
          attachDeliveryRewardError,
      } =
        await supabase
          .from("orders")
          .update({
            delivery_reward_redemption_id:
              claimedDeliveryReward.id,

            delivery_reward_name:
              deliveryReward.name,

            delivery_reward_code:
              claimedDeliveryReward.redemption_code,

            delivery_fee:
              effectiveDeliveryFee,

            original_delivery_fee:
              deliveryFee,

            delivery_reward_amount:
              deliveryRewardAmount,

            total,
          })
          .eq(
            "id",
            order.id
          )
          .eq(
            "customer_user_id",
            customerUserId
          );

      if (attachDeliveryRewardError) {
        await releaseClaimedDeliveryReward();

        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        throw new Error(
          "Unable to attach the delivery reward to this order."
        );
      }

      reservedDeliveryReward = {
        id:
          claimedDeliveryReward.id,

        name:
          deliveryReward.name,

        code:
          claimedDeliveryReward.redemption_code,
      };

      const {
        error:
          deliveryRewardEventError,
      } =
        await supabase
          .from("order_events")
          .insert({
            order_id:
              order.id,

            event_type:
              "delivery_reward_reserved",

            message:
              `Delivery reward reserved: ${deliveryReward.name}.`,

            metadata: {
              delivery_reward_redemption_id:
                claimedDeliveryReward.id,

              reward_name:
                deliveryReward.name,

              reward_code:
                claimedDeliveryReward.redemption_code,

              original_delivery_fee:
                deliveryFee,

              delivery_reward_amount:
                deliveryRewardAmount,
            },
          });

      if (
        deliveryRewardEventError
      ) {
        console.error(
          "Unable to record delivery reward event:",
          deliveryRewardEventError
        );
      }
    }

    /*
     * CUSTOMER CRM
     *
     * Every successfully created checkout can create/update
     * a contact record, but checkout contact information alone
     * never implies marketing consent.
     *
     * CRM synchronization is deliberately secondary to order
     * creation. If this fails, the customer's order must still
     * continue normally.
     */
    try {
      const normalizedEmail =
        normalizeMarketingEmail(
          customerEmail
        );

      const normalizedPhone =
        normalizeMarketingPhone(
          customerPhone
        );

      const {
        firstName,
        lastName,
      } =
        splitCustomerName(
          customerName
        );

      const emailOptIn =
        body.emailMarketingConsent ===
        true;

      const smsOptIn =
        body.smsMarketingConsent ===
        true;

      const consentTimestamp =
        new Date().toISOString();

      /*
       * Prefer email as the primary identity because checkout
       * requires it. Fall back to phone so a customer changing
       * their email does not necessarily create a duplicate.
       */
      const {
        data: emailContact,
        error: emailLookupError,
      } =
        await supabase
          .from(
            "marketing_contacts"
          )
          .select(`
            id,
            email,
            phone,
            contact_type,
            email_marketing_consent,
            sms_marketing_consent,
            email_unsubscribed_at,
            sms_unsubscribed_at
          `)
          .ilike(
            "email",
            normalizedEmail
          )
          .maybeSingle();

      if (emailLookupError) {
        throw emailLookupError;
      }

      let existingContact =
        emailContact;

      if (
        !existingContact &&
        normalizedPhone
      ) {
        const {
          data: phoneContact,
          error:
            phoneLookupError,
        } =
          await supabase
            .from(
              "marketing_contacts"
            )
            .select(`
              id,
              email,
              phone,
              contact_type,
              email_marketing_consent,
              sms_marketing_consent,
              email_unsubscribed_at,
              sms_unsubscribed_at
            `)
            .eq(
              "phone",
              normalizedPhone
            )
            .maybeSingle();

        if (phoneLookupError) {
          throw phoneLookupError;
        }

        existingContact =
          phoneContact;
      }

      let contactId:
        | string
        | null = null;

      let shouldRecordEmailOptIn =
        false;

      let shouldRecordSmsOptIn =
        false;

      if (existingContact) {
        /*
         * An unchecked box means "no new consent decision".
         * It must NOT revoke consent granted previously.
         */
        const updates: {
          email: string;
          phone: string;
          first_name:
            | string
            | null;
          last_name:
            | string
            | null;

          email_marketing_consent?:
            boolean;
          email_consent_at?:
            string;
          email_consent_source?:
            string;
          email_unsubscribed_at?:
            null;

          sms_marketing_consent?:
            boolean;
          sms_consent_at?:
            string;
          sms_consent_source?:
            string;
          sms_unsubscribed_at?:
            null;
        } = {
          email:
            normalizedEmail,
          phone:
            normalizedPhone,
          first_name:
            firstName,
          last_name:
            lastName,
        };

        if (
          emailOptIn &&
          (
            !existingContact
              .email_marketing_consent ||
            existingContact
              .email_unsubscribed_at
          )
        ) {
          updates.email_marketing_consent =
            true;

          updates.email_consent_at =
            consentTimestamp;

          updates.email_consent_source =
            "checkout";

          updates.email_unsubscribed_at =
            null;

          shouldRecordEmailOptIn =
            true;
        }

        if (
          smsOptIn &&
          (
            !existingContact
              .sms_marketing_consent ||
            existingContact
              .sms_unsubscribed_at
          )
        ) {
          updates.sms_marketing_consent =
            true;

          updates.sms_consent_at =
            consentTimestamp;

          updates.sms_consent_source =
            "checkout";

          updates.sms_unsubscribed_at =
            null;

          shouldRecordSmsOptIn =
            true;
        }

        const {
          data: updatedContact,
          error: updateContactError,
        } =
          await supabase
            .from(
              "marketing_contacts"
            )
            .update(updates)
            .eq(
              "id",
              existingContact.id
            )
            .select("id")
            .single();

        if (
          updateContactError ||
          !updatedContact
        ) {
          throw (
            updateContactError ??
            new Error(
              "Unable to update marketing contact."
            )
          );
        }

        contactId =
          updatedContact.id;
      } else {
        const {
          data: createdContact,
          error: createContactError,
        } =
          await supabase
            .from(
              "marketing_contacts"
            )
            .insert({
              email:
                normalizedEmail,

              phone:
                normalizedPhone,

              first_name:
                firstName,

              last_name:
                lastName,

              contact_type:
                "prospect",

              source:
                "checkout",

              email_marketing_consent:
                emailOptIn,

              email_consent_at:
                emailOptIn
                  ? consentTimestamp
                  : null,

              email_consent_source:
                emailOptIn
                  ? "checkout"
                  : null,

              sms_marketing_consent:
                smsOptIn,

              sms_consent_at:
                smsOptIn
                  ? consentTimestamp
                  : null,

              sms_consent_source:
                smsOptIn
                  ? "checkout"
                  : null,
            })
            .select("id")
            .single();

        if (
          createContactError ||
          !createdContact
        ) {
          throw (
            createContactError ??
            new Error(
              "Unable to create marketing contact."
            )
          );
        }

        contactId =
          createdContact.id;

        shouldRecordEmailOptIn =
          emailOptIn;

        shouldRecordSmsOptIn =
          smsOptIn;
      }

      if (
        contactId &&
        (
          shouldRecordEmailOptIn ||
          shouldRecordSmsOptIn
        )
      ) {
        const consentEvents: Array<{
          contact_id: string;
          channel:
            | "email"
            | "sms";
          action:
            "opted_in";
          source: string;
          occurred_at: string;
          metadata: {
            disclosure_version:
              string;
            order_id: string;
            order_number: string;
          };
        }> = [];

        if (
          shouldRecordEmailOptIn
        ) {
          consentEvents.push({
            contact_id:
              contactId,

            channel:
              "email",

            action:
              "opted_in",

            source:
              "checkout",

            occurred_at:
              consentTimestamp,

            metadata: {
              disclosure_version:
                "checkout-email-v1",

              order_id:
                order.id,

              order_number:
                order.order_number,
            },
          });
        }

        if (
          shouldRecordSmsOptIn
        ) {
          consentEvents.push({
            contact_id:
              contactId,

            channel:
              "sms",

            action:
              "opted_in",

            source:
              "checkout",

            occurred_at:
              consentTimestamp,

            metadata: {
              disclosure_version:
                "checkout-sms-v1",

              order_id:
                order.id,

              order_number:
                order.order_number,
            },
          });
        }

        const {
          error:
            consentEventError,
        } =
          await supabase
            .from(
              "marketing_consent_events"
            )
            .insert(
              consentEvents
            );

        if (
          consentEventError
        ) {
          console.error(
            "Unable to record marketing consent event:",
            consentEventError
          );
        }
      }
    } catch (marketingContactError) {
      console.error(
        "Unable to sync checkout customer to marketing CRM:",
        marketingContactError
      );
    }

    const { error: eventError } = await supabase
      .from("order_events")
      .insert({
        order_id: order.id,
        event_type: "order_created",
        message:
          "Order created and awaiting payment.",
        metadata: {
          item_count: orderItems.reduce(
            (total, item) =>
              total + item.quantity,
            0
          ),
        },
      });

    if (eventError) {
      console.error(
        "Unable to create order event:",
        eventError
      );
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.order_number,
      subtotal,

      deliveryFee:
        effectiveDeliveryFee,

      originalDeliveryFee:
        deliveryRewardAmount > 0
          ? deliveryFee
          : effectiveDeliveryFee,

      deliveryRewardAmount,

      deliveryRewardName:
        reservedDeliveryReward?.name ??
        null,

      deliveryRewardCode:
        reservedDeliveryReward?.code ??
        null,

      petalsDiscountAmount,
      petalsDiscountPercent,

      taxAmount,
      total,
      paymentStatus: "unpaid",

      rewardName:
        reservedReward?.name ??
        null,

      rewardCode:
        reservedReward?.code ??
        null,

      rewardType:
        reservedReward?.rewardType ??
        null,

      referralApplied:
        Boolean(
          attachedReferral
        ),

      referralDiscountAmount:
        reservedReferralReward?.amount ??
        0,

      referralDiscountPercent:
        reservedReferralReward?.percent ??
        null,

      referralRewardCode:
        reservedReferralReward?.code ??
        null,
    });
  } catch (error) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create order.",
      },
      { status: 500 }
    );
  }
}
