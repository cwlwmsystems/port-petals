import Link from "next/link";
import {
  notFound,
  redirect,
} from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateCampaign } from "../actions";
import SendCampaignButton from "./SendCampaignButton";
import { buildMarketingEmailHtml } from "@/lib/email/marketing-template";

type Props = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    saved?: string;
  }>;
};

type AudienceFilters = {
  contact_type?: string | null;
  interest?: string | null;
  purchase_segment?: string | null;
};

function formatDeliveryDate(
  value: string | null
) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone:
        "America/New_York",
    }
  ).format(
    new Date(value)
  );
}

function deliveryStatusClasses(
  status: string
) {
  switch (status) {
    case "sent":
      return "bg-[#e6f2e3] text-[#31583b]";

    case "failed":
      return "bg-[#f8e1dc] text-[#a7473f]";

    case "skipped":
      return "bg-[#edf1f6] text-[#536578]";

    case "queued":
      return "bg-[#fff0d9] text-[#775d2f]";

    default:
      return "bg-[#edf1f6] text-[#607068]";
  }
}

function displayName(
  firstName: string | null,
  lastName: string | null,
  email: string | null
) {
  const name =
    [
      firstName,
      lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

  return (
    name ||
    email ||
    "Unnamed Contact"
  );
}

export default async function MarketingCampaignPage({
  params,
  searchParams,
}: Props) {
  const {
    id,
  } =
    await params;

  const queryParams =
    await searchParams;

  const supabase =
    await createClient();

  const {
    data: claimsData,
  } =
    await supabase.auth.getClaims();

  const userId =
    claimsData?.claims?.sub;

  if (!userId) {
    redirect(
      "/admin/login"
    );
  }

  const {
    data: adminUser,
  } =
    await supabase
      .from(
        "admin_users"
      )
      .select("id")
      .eq(
        "auth_user_id",
        userId
      )
      .eq(
        "active",
        true
      )
      .maybeSingle();

  if (!adminUser) {
    redirect(
      "/admin/login"
    );
  }

  const {
    data: campaign,
    error: campaignError,
  } =
    await supabase
      .from(
        "marketing_campaigns"
      )
      .select(`
        id,
        name,
        subject,
        preview_text,
        headline,
        hero_image_url,
        offer_badge,
        secondary_heading,
        secondary_text,
        body_text,
        cta_label,
        cta_url,
        audience_filters,
        status,
        recipient_count,
        sent_count,
        failed_count,
        skipped_count,
        created_at,
        updated_at,
        sent_at
      `)
      .eq(
        "id",
        id
      )
      .maybeSingle();

  if (
    campaignError ||
    !campaign
  ) {
    notFound();
  }

  const isDraft =
    campaign.status ===
    "draft";

  const filters =
    (
      campaign.audience_filters ??
      {}
    ) as AudienceFilters;

  let recipients: Array<{
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    contact_type: string;
    order_count: number;
    lifetime_value: number | string | null;
    email_marketing_consent: boolean;
    email_unsubscribed_at: string | null;
  }> = [];

  if (isDraft) {
    let interestContactIds:
      string[] | null =
        null;

    if (
      filters.interest
    ) {
      const {
        data: interestRows,
        error: interestError,
      } =
        await supabase
          .from(
            "marketing_contact_interests"
          )
          .select(
            "contact_id"
          )
          .eq(
            "interest",
            filters.interest
          );

      if (interestError) {
        throw new Error(
          interestError.message
        );
      }

      interestContactIds =
        Array.from(
          new Set(
            (
              interestRows ??
              []
            ).map(
              (row) =>
                row.contact_id
            )
          )
        );
    }

    let audienceQuery =
      supabase
        .from(
          "marketing_contacts"
        )
        .select(`
          id,
          first_name,
          last_name,
          email,
          contact_type,
          order_count,
          lifetime_value,
          email_marketing_consent,
          email_unsubscribed_at
        `)
        .eq(
          "email_marketing_consent",
          true
        )
        .is(
          "email_unsubscribed_at",
          null
        )
        .not(
          "email",
          "is",
          null
        )
        .order(
          "last_order_at",
          {
            ascending: false,
            nullsFirst: false,
          }
        );

    if (
      filters.contact_type
    ) {
      audienceQuery =
        audienceQuery.eq(
          "contact_type",
          filters.contact_type
        );
    }

    if (
      interestContactIds !==
      null
    ) {
      if (
        interestContactIds.length ===
        0
      ) {
        audienceQuery =
          audienceQuery.eq(
            "id",
            "00000000-0000-0000-0000-000000000000"
          );
      } else {
        audienceQuery =
          audienceQuery.in(
            "id",
            interestContactIds
          );
      }
    }

    if (
      filters.purchase_segment ===
      "no-purchases"
    ) {
      audienceQuery =
        audienceQuery.eq(
          "order_count",
          0
        );
    }

    if (
      filters.purchase_segment ===
      "first-time"
    ) {
      audienceQuery =
        audienceQuery.eq(
          "order_count",
          1
        );
    }

    if (
      filters.purchase_segment ===
      "repeat"
    ) {
      audienceQuery =
        audienceQuery.gte(
          "order_count",
          2
        );
    }

    const {
      data: audience,
      error: audienceError,
    } =
      await audienceQuery;

    if (audienceError) {
      throw new Error(
        audienceError.message
      );
    }

    recipients =
      audience ?? [];
  }

  const {
    data: historicalRecipients,
    error: historicalRecipientsError,
  } =
    isDraft
      ? {
          data: [],
          error: null,
        }
      : await supabase
          .from(
            "marketing_campaign_recipients"
          )
          .select(`
            id,
            contact_id,
            recipient_email,
            first_name,
            last_name,
            status,
            resend_email_id,
            error_message,
            queued_at,
            sent_at,
            failed_at,
            skipped_at
          `)
          .eq(
            "campaign_id",
            campaign.id
          )
          .order(
            "queued_at",
            {
              ascending: true,
            }
          );

  if (
    historicalRecipientsError
  ) {
    throw new Error(
      historicalRecipientsError.message
    );
  }

  const deliveryRecipients =
    historicalRecipients ??
    [];

  const emailPreviewHtml =
    buildMarketingEmailHtml({
      previewText:
        campaign.preview_text,

      headline:
        campaign.headline,

      heroImageUrl:
        campaign.hero_image_url,

      offerBadge:
        campaign.offer_badge,

      bodyText:
        campaign.body_text,

      secondaryHeading:
        campaign.secondary_heading,

      secondaryText:
        campaign.secondary_text,

      ctaLabel:
        campaign.cta_label,

      ctaUrl:
        campaign.cta_url,

      unsubscribeUrl:
        "#preview-unsubscribe",
    });

  const updateWithId =
    updateCampaign.bind(
      null,
      campaign.id
    );

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-5 py-10 text-[#284239] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin/marketing"
          className="text-sm font-semibold text-[#607068] transition hover:text-[#e76d61]"
        >
          ← Back to Marketing
        </Link>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
              {isDraft
                ? "Campaign Draft"
                : "Campaign"}
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
              {
                campaign.name
              }
            </h1>
          </div>

          <span className="inline-flex w-fit rounded-full bg-[#f4ead8] px-3 py-1.5 text-xs font-semibold text-[#775d2f]">
            {
              campaign.status
                .replaceAll(
                  "_",
                  " "
                )
                .replace(
                  /\b\w/g,
                  (letter: string) =>
                    letter.toUpperCase()
                )
            }
          </span>
        </div>

        {queryParams.saved ===
          "1" && (
          <div className="mt-5 rounded-xl bg-[#e6f2e3] px-4 py-3 text-sm font-semibold text-[#31583b]">
            Campaign draft saved.
          </div>
        )}

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.6fr)]">
          <form
            action={
              updateWithId
            }
          >
            <fieldset
              disabled={
                !isDraft
              }
              className="m-0 min-w-0 space-y-5 border-0 p-0"
            >
            <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Email Content
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-[#153f32]">
                    Internal Campaign Name
                  </span>

                  <input
                    name="name"
                    required
                    defaultValue={
                      campaign.name
                    }
                    maxLength={
                      150
                    }
                    className="min-h-12 rounded-xl border border-[#284239]/15 px-4 outline-none transition focus:border-[#e76d61]"
                  />
                </label>

                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-[#153f32]">
                    Subject
                  </span>

                  <input
                    name="subject"
                    required
                    defaultValue={
                      campaign.subject
                    }
                    maxLength={
                      200
                    }
                    className="min-h-12 rounded-xl border border-[#284239]/15 px-4 outline-none transition focus:border-[#e76d61]"
                  />
                </label>

                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-[#153f32]">
                    Preview Text
                  </span>

                  <input
                    name="preview_text"
                    defaultValue={
                      campaign.preview_text ??
                      ""
                    }
                    maxLength={
                      250
                    }
                    className="min-h-12 rounded-xl border border-[#284239]/15 px-4 outline-none transition focus:border-[#e76d61]"
                  />
                </label>

                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-[#153f32]">
                    Headline
                  </span>

                  <input
                    name="headline"
                    defaultValue={
                      campaign.headline ??
                      ""
                    }
                    maxLength={
                      250
                    }
                    className="min-h-12 rounded-xl border border-[#284239]/15 px-4 outline-none transition focus:border-[#e76d61]"
                  />
                </label>

                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-[#153f32]">
                    Hero Image URL
                  </span>

                  <input
                    name="hero_image_url"
                    type="url"
                    defaultValue={
                      campaign.hero_image_url ??
                      ""
                    }
                    maxLength={
                      1500
                    }
                    className="min-h-12 rounded-xl border border-[#284239]/15 px-4 outline-none transition focus:border-[#e76d61]"
                  />

                  <span className="text-xs leading-5 text-[#718078]">
                    Optional public image URL. Wide landscape images work best.
                  </span>
                </label>

                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-[#153f32]">
                    Promotional Badge
                  </span>

                  <input
                    name="offer_badge"
                    defaultValue={
                      campaign.offer_badge ??
                      ""
                    }
                    maxLength={
                      120
                    }
                    className="min-h-12 rounded-xl border border-[#284239]/15 px-4 outline-none transition focus:border-[#e76d61]"
                  />
                </label>

                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-[#153f32]">
                    Message
                  </span>

                  <textarea
                    name="body_text"
                    required
                    rows={
                      12
                    }
                    defaultValue={
                      campaign.body_text
                    }
                    maxLength={
                      10000
                    }
                    className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none transition focus:border-[#e76d61]"
                  />
                </label>

                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-[#153f32]">
                    Secondary Heading
                  </span>

                  <input
                    name="secondary_heading"
                    defaultValue={
                      campaign.secondary_heading ??
                      ""
                    }
                    maxLength={
                      250
                    }
                    className="min-h-12 rounded-xl border border-[#284239]/15 px-4 outline-none transition focus:border-[#e76d61]"
                  />
                </label>

                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-[#153f32]">
                    Secondary Text
                  </span>

                  <textarea
                    name="secondary_text"
                    rows={
                      4
                    }
                    defaultValue={
                      campaign.secondary_text ??
                      ""
                    }
                    maxLength={
                      2500
                    }
                    className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none transition focus:border-[#e76d61]"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#153f32]">
                    Button Label
                  </span>

                  <input
                    name="cta_label"
                    defaultValue={
                      campaign.cta_label ??
                      ""
                    }
                    maxLength={
                      100
                    }
                    className="min-h-12 rounded-xl border border-[#284239]/15 px-4"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#153f32]">
                    Button URL
                  </span>

                  <input
                    name="cta_url"
                    type="url"
                    defaultValue={
                      campaign.cta_url ??
                      ""
                    }
                    maxLength={
                      1000
                    }
                    className="min-h-12 rounded-xl border border-[#284239]/15 px-4"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Audience Filters
              </h2>

              <p className="mt-2 text-sm text-[#607068]">
                Saving changes recalculates the eligible audience shown beside
                this form.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#153f32]">
                    Contact Type
                  </span>

                  <select
                    name="contact_type"
                    defaultValue={
                      filters.contact_type ??
                      ""
                    }
                    className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4"
                  >
                    <option value="">
                      All
                    </option>

                    <option value="customer">
                      Customers
                    </option>

                    <option value="prospect">
                      Prospects
                    </option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#153f32]">
                    Interest
                  </span>

                  <select
                    name="interest"
                    defaultValue={
                      filters.interest ??
                      ""
                    }
                    className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4"
                  >
                    <option value="">
                      All Interests
                    </option>

                    <option value="flowers">
                      Flowers
                    </option>

                    <option value="gifts-decor">
                      Gifts & Decor
                    </option>

                    <option value="apparel">
                      Apparel
                    </option>

                    <option value="gator-gear">
                      Gator Gear
                    </option>

                    <option value="seasonal">
                      Seasonal
                    </option>

                    <option value="weddings-events">
                      Weddings & Events
                    </option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#153f32]">
                    Purchase Segment
                  </span>

                  <select
                    name="purchase_segment"
                    defaultValue={
                      filters.purchase_segment ??
                      ""
                    }
                    className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4"
                  >
                    <option value="">
                      All
                    </option>

                    <option value="no-purchases">
                      No Purchases
                    </option>

                    <option value="first-time">
                      First-Time Customer
                    </option>

                    <option value="repeat">
                      Repeat Customer
                    </option>
                  </select>
                </label>
              </div>
            </section>

            {isDraft && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#284239] px-6 text-sm font-semibold text-white transition hover:bg-[#1d332b]"
                >
                  Save Draft
                </button>
              </div>
            )}
            </fieldset>
          </form>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                {isDraft
                  ? "Eligible Audience"
                  : "Campaign Audience"}
              </p>

              <p className="mt-2 text-4xl font-semibold text-[#153f32]">
                {isDraft
                  ? recipients.length
                  : campaign.recipient_count}
              </p>

              <p className="mt-2 text-sm leading-6 text-[#607068]">
                {isDraft
                  ? "Contacts currently matching this campaign who have active email marketing consent."
                  : "Recipients snapshotted when this campaign was sent. Historical delivery results do not change if CRM data changes later."}
              </p>

              {isDraft ? (
                <div className="mt-5 border-t border-[#284239]/10 pt-5">
                  <SendCampaignButton
                    campaignId={
                      campaign.id
                    }
                    campaignName={
                      campaign.name
                    }
                    recipientCount={
                      recipients.length
                    }
                  />
                </div>
              ) : (
                <div className="mt-5 border-t border-[#284239]/10 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#607068]">
                    Campaign Results
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-[#faf7f1] p-3">
                      <p className="text-2xl font-semibold text-[#153f32]">
                        {
                          campaign.recipient_count
                        }
                      </p>

                      <p className="text-xs text-[#718078]">
                        Recipients
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#e6f2e3] p-3">
                      <p className="text-2xl font-semibold text-[#31583b]">
                        {
                          campaign.sent_count
                        }
                      </p>

                      <p className="text-xs text-[#718078]">
                        Sent
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#f8e1dc] p-3">
                      <p className="text-2xl font-semibold text-[#a7473f]">
                        {
                          campaign.failed_count
                        }
                      </p>

                      <p className="text-xs text-[#718078]">
                        Failed
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#edf1f6] p-3">
                      <p className="text-2xl font-semibold text-[#536578]">
                        {
                          campaign.skipped_count
                        }
                      </p>

                      <p className="text-xs text-[#718078]">
                        Skipped
                      </p>
                    </div>
                  </div>

                  {campaign.sent_at && (
                    <p className="mt-3 text-xs text-[#718078]">
                      Completed{" "}
                      {
                        formatDeliveryDate(
                          campaign.sent_at
                        )
                      }
                    </p>
                  )}
                </div>
              )}
            </section>

            <section className="overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-sm">
              <div className="border-b border-[#284239]/10 px-5 py-4">
                <h2 className="font-semibold text-[#153f32]">
                  {isDraft
                    ? "Recipient Preview"
                    : "Campaign Recipients"}
                </h2>

                <p className="mt-1 text-xs text-[#718078]">
                  {isDraft
                    ? "Showing up to 25 eligible contacts."
                    : `${deliveryRecipients.length} snapshotted recipient${
                        deliveryRecipients.length === 1
                          ? ""
                          : "s"
                      }.`}
                </p>
              </div>

              {isDraft ? (
                recipients.length ===
                0 ? (
                  <div className="p-5 text-sm text-[#607068]">
                    No eligible recipients match these filters.
                  </div>
                ) : (
                  <div className="divide-y divide-[#284239]/10">
                    {recipients
                      .slice(
                        0,
                        25
                      )
                      .map(
                        (
                          contact
                        ) => (
                          <div
                            key={
                              contact.id
                            }
                            className="px-5 py-4"
                          >
                            <p className="font-semibold text-[#153f32]">
                              {
                                displayName(
                                  contact.first_name,
                                  contact.last_name,
                                  contact.email
                                )
                              }
                            </p>

                            <p className="mt-1 break-all text-xs text-[#607068]">
                              {
                                contact.email
                              }
                            </p>

                            <p className="mt-1 text-xs capitalize text-[#718078]">
                              {
                                contact.contact_type
                              }{" "}
                              ·{" "}
                              {
                                contact.order_count
                              }{" "}
                              {
                                contact.order_count ===
                                1
                                  ? "order"
                                  : "orders"
                              }
                            </p>
                          </div>
                        )
                      )}
                  </div>
                )
              ) : deliveryRecipients.length ===
                0 ? (
                  <div className="p-5 text-sm text-[#607068]">
                    No snapshotted recipient records were found for this campaign.
                  </div>
                ) : (
                  <div className="divide-y divide-[#284239]/10">
                    {deliveryRecipients.map(
                      (
                        recipient
                      ) => {
                        const deliveryTime =
                          recipient.sent_at ??
                          recipient.failed_at ??
                          recipient.skipped_at ??
                          recipient.queued_at;

                        return (
                          <div
                            key={
                              recipient.id
                            }
                            className="px-5 py-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="font-semibold text-[#153f32]">
                                  {
                                    displayName(
                                      recipient.first_name,
                                      recipient.last_name,
                                      recipient.recipient_email
                                    )
                                  }
                                </p>

                                <p className="mt-1 break-all text-xs text-[#607068]">
                                  {
                                    recipient.recipient_email
                                  }
                                </p>
                              </div>

                              <span
                                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${deliveryStatusClasses(
                                  recipient.status
                                )}`}
                              >
                                {
                                  recipient.status
                                }
                              </span>
                            </div>

                            <p className="mt-2 text-xs text-[#718078]">
                              {
                                formatDeliveryDate(
                                  deliveryTime
                                )
                              }
                            </p>

                            {recipient.resend_email_id && (
                              <p className="mt-1 break-all text-[11px] text-[#8a958f]">
                                Resend ID:{" "}
                                {
                                  recipient.resend_email_id
                                }
                              </p>
                            )}

                            {recipient.error_message && (
                              <div className="mt-2 rounded-lg bg-[#fff0ed] px-3 py-2 text-xs leading-5 text-[#a7473f]">
                                {
                                  recipient.error_message
                                }
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
            </section>
          </aside>        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-[#284239]/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e76d61]">
                Email Preview
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                Recipient View
              </h2>

              <p className="mt-1 text-sm text-[#718078]">
                This preview uses the same HTML template as the actual
                marketing email.
              </p>
            </div>

            <span className="w-fit rounded-full bg-[#e6f2e3] px-3 py-1.5 text-xs font-semibold text-[#31583b]">
              640px Email Canvas
            </span>
          </div>

          <div className="bg-[#edf1ed] p-3 sm:p-6">
            <div className="mx-auto max-w-[760px] overflow-hidden rounded-xl border border-[#284239]/10 bg-white shadow-sm">
              <iframe
                title="Marketing email preview"
                srcDoc={
                  emailPreviewHtml
                }
                sandbox=""
                className="block h-[900px] w-full border-0 bg-[#f7f1e8]"
              />
            </div>
          </div>

          <div className="border-t border-[#284239]/10 bg-[#faf7f1] px-5 py-3 text-xs leading-5 text-[#718078] sm:px-6">
            The unsubscribe link is disabled in preview mode. Images must use
            publicly accessible URLs to appear for real recipients.
          </div>
        </section>
      </div>
    </main>
  );
}
