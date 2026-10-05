"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend } from "@/lib/email/resend";
import { buildMarketingEmailHtml } from "@/lib/email/marketing-template";

const allowedInterests = new Set([
  "",
  "flowers",
  "gifts-decor",
  "apparel",
  "gator-gear",
  "seasonal",
  "weddings-events",
]);

const allowedContactTypes = new Set([
  "",
  "customer",
  "prospect",
]);

const allowedPurchaseSegments = new Set([
  "",
  "no-purchases",
  "first-time",
  "repeat",
]);

function cleanText(
  value: FormDataEntryValue | null,
  maxLength = 500
) {
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value
    .trim()
    .slice(
      0,
      maxLength
    );
}

function optionalText(
  value: FormDataEntryValue | null,
  maxLength = 500
) {
  const cleaned =
    cleanText(
      value,
      maxLength
    );

  return cleaned || null;
}

async function requireAdmin() {
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
      .select(
        "id, auth_user_id"
      )
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

  return {
    supabase,
    adminUser,
  };
}

function readAudienceFilters(
  formData: FormData
) {
  const contactType =
    cleanText(
      formData.get(
        "contact_type"
      ),
      50
    );

  const interest =
    cleanText(
      formData.get(
        "interest"
      ),
      50
    );

  const purchaseSegment =
    cleanText(
      formData.get(
        "purchase_segment"
      ),
      50
    );

  if (
    !allowedContactTypes.has(
      contactType
    )
  ) {
    throw new Error(
      "Invalid contact type."
    );
  }

  if (
    !allowedInterests.has(
      interest
    )
  ) {
    throw new Error(
      "Invalid interest."
    );
  }

  if (
    !allowedPurchaseSegments.has(
      purchaseSegment
    )
  ) {
    throw new Error(
      "Invalid purchase segment."
    );
  }

  return {
    contact_type:
      contactType || null,

    interest:
      interest || null,

    purchase_segment:
      purchaseSegment || null,
  };
}

function readCampaignFields(
  formData: FormData
) {
  const name =
    cleanText(
      formData.get("name"),
      150
    );

  const subject =
    cleanText(
      formData.get(
        "subject"
      ),
      200
    );

  const previewText =
    optionalText(
      formData.get(
        "preview_text"
      ),
      250
    );

  const headline =
    optionalText(
      formData.get(
        "headline"
      ),
      250
    );

  const heroImageUrl =
    optionalText(
      formData.get(
        "hero_image_url"
      ),
      1500
    );

  const offerBadge =
    optionalText(
      formData.get(
        "offer_badge"
      ),
      120
    );

  const secondaryHeading =
    optionalText(
      formData.get(
        "secondary_heading"
      ),
      250
    );

  const secondaryText =
    optionalText(
      formData.get(
        "secondary_text"
      ),
      2500
    );

  const bodyText =
    cleanText(
      formData.get(
        "body_text"
      ),
      10000
    );

  const ctaLabel =
    optionalText(
      formData.get(
        "cta_label"
      ),
      100
    );

  const ctaUrl =
    optionalText(
      formData.get(
        "cta_url"
      ),
      1000
    );

  if (!name) {
    throw new Error(
      "Campaign name is required."
    );
  }

  if (!subject) {
    throw new Error(
      "Email subject is required."
    );
  }

  if (!bodyText) {
    throw new Error(
      "Campaign body is required."
    );
  }

  if (
    Boolean(ctaLabel) !==
    Boolean(ctaUrl)
  ) {
    throw new Error(
      "CTA label and CTA URL must either both be provided or both be blank."
    );
  }

  if (ctaUrl) {
    let parsedUrl: URL;

    try {
      parsedUrl =
        new URL(ctaUrl);
    } catch {
      throw new Error(
        "CTA URL must be a valid URL."
      );
    }

    if (
      parsedUrl.protocol !==
        "https:" &&
      parsedUrl.protocol !==
        "http:"
    ) {
      throw new Error(
        "CTA URL must use http or https."
      );
    }
  }

  if (heroImageUrl) {
    let parsedImageUrl: URL;

    try {
      parsedImageUrl =
        new URL(
          heroImageUrl
        );
    } catch {
      throw new Error(
        "Hero image URL must be a valid URL."
      );
    }

    if (
      parsedImageUrl.protocol !==
        "https:" &&
      parsedImageUrl.protocol !==
        "http:"
    ) {
      throw new Error(
        "Hero image URL must use http or https."
      );
    }
  }

  return {
    name,
    subject,
    preview_text:
      previewText,
    headline,

    hero_image_url:
      heroImageUrl,

    offer_badge:
      offerBadge,

    secondary_heading:
      secondaryHeading,

    secondary_text:
      secondaryText,

    body_text:
      bodyText,

    cta_label:
      ctaLabel,
    cta_url:
      ctaUrl,
    audience_filters:
      readAudienceFilters(
        formData
      ),
  };
}

export async function createCampaign(
  formData: FormData
) {
  const {
    supabase,
    adminUser,
  } =
    await requireAdmin();

  const values =
    readCampaignFields(
      formData
    );

  const {
    data: campaign,
    error,
  } =
    await supabase
      .from(
        "marketing_campaigns"
      )
      .insert({
        ...values,
        status:
          "draft",
        created_by:
          adminUser.id,
      })
      .select("id")
      .single();

  if (
    error ||
    !campaign
  ) {
    throw new Error(
      error?.message ??
        "Unable to create campaign."
    );
  }

  revalidatePath(
    "/admin/marketing"
  );

  redirect(
    `/admin/marketing/${campaign.id}`
  );
}

export async function updateCampaign(
  campaignId: string,
  formData: FormData
) {
  if (!campaignId) {
    throw new Error(
      "Campaign ID is required."
    );
  }

  const {
    supabase,
  } =
    await requireAdmin();

  const {
    data: campaign,
    error: loadError,
  } =
    await supabase
      .from(
        "marketing_campaigns"
      )
      .select(
        "id, status"
      )
      .eq(
        "id",
        campaignId
      )
      .maybeSingle();

  if (
    loadError ||
    !campaign
  ) {
    throw new Error(
      "Campaign not found."
    );
  }

  if (
    campaign.status !==
    "draft"
  ) {
    throw new Error(
      "Only draft campaigns can be edited."
    );
  }

  const values =
    readCampaignFields(
      formData
    );

  const {
    error,
  } =
    await supabase
      .from(
        "marketing_campaigns"
      )
      .update(values)
      .eq(
        "id",
        campaignId
      );

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/marketing"
  );

  revalidatePath(
    `/admin/marketing/${campaignId}`
  );

  redirect(
    `/admin/marketing/${campaignId}?saved=1`
  );
}


type CampaignAudienceFilters = {
  contact_type?:
    | string
    | null;
  interest?:
    | string
    | null;
  purchase_segment?:
    | string
    | null;
};

export async function sendCampaign(
  campaignId: string
) {
  if (!campaignId) {
    throw new Error(
      "Campaign ID is required."
    );
  }

  await requireAdmin();

  const supabase =
    createAdminClient();

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
        body_text,
        secondary_heading,
        secondary_text,
        cta_label,
        cta_url,
        audience_filters,
        status
      `)
      .eq(
        "id",
        campaignId
      )
      .maybeSingle();

  if (
    campaignError ||
    !campaign
  ) {
    throw new Error(
      "Campaign not found."
    );
  }

  if (
    campaign.status !==
    "draft"
  ) {
    throw new Error(
      "Only draft campaigns can be sent."
    );
  }

  const filters =
    (
      campaign.audience_filters ??
      {}
    ) as CampaignAudienceFilters;

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
        email_marketing_consent,
        email_unsubscribed_at,
        email_unsubscribe_token,
        contact_type,
        order_count
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
        "created_at",
        {
          ascending: true,
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

  const recipients =
    audience ?? [];

  if (
    recipients.length ===
    0
  ) {
    throw new Error(
      "This campaign has no eligible email recipients."
    );
  }

  /*
   * Atomically claim the campaign for sending.
   * A second send request cannot claim a campaign that
   * has already moved out of draft status.
   */
  const sendStartedAt =
    new Date().toISOString();

  const {
    data: claimedCampaign,
    error: claimError,
  } =
    await supabase
      .from(
        "marketing_campaigns"
      )
      .update({
        status:
          "sending",

        recipient_count:
          recipients.length,

        sent_count:
          0,

        failed_count:
          0,

        skipped_count:
          0,

        send_started_at:
          sendStartedAt,
      })
      .eq(
        "id",
        campaignId
      )
      .eq(
        "status",
        "draft"
      )
      .select("id")
      .maybeSingle();

  if (
    claimError ||
    !claimedCampaign
  ) {
    throw new Error(
      "This campaign is already being sent or is no longer a draft."
    );
  }

  try {
    /*
     * Snapshot the selected audience before delivery.
     * The unique campaign/contact constraint prevents
     * duplicate recipient rows.
     */
    const snapshotRows =
      recipients.map(
        (contact) => ({
          campaign_id:
            campaignId,

          contact_id:
            contact.id,

          recipient_email:
            contact.email!,

          first_name:
            contact.first_name,

          last_name:
            contact.last_name,

          status:
            "queued",

          queued_at:
            sendStartedAt,

          metadata: {
            audience_filters:
              filters,
          },
        })
      );

    const {
      error: snapshotError,
    } =
      await supabase
        .from(
          "marketing_campaign_recipients"
        )
        .insert(
          snapshotRows
        );

    if (snapshotError) {
      throw new Error(
        `Unable to snapshot campaign recipients: ${snapshotError.message}`
      );
    }

    let sentCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    const siteUrl =
      (
        process.env
          .NEXT_PUBLIC_SITE_URL ??
        "https://www.portpetals.com"
      ).replace(
        /\/+$/,
        ""
      );

    for (
      const recipient
      of recipients
    ) {
      const {
        data:
          currentContact,
        error:
          currentContactError,
      } =
        await supabase
          .from(
            "marketing_contacts"
          )
          .select(`
            id,
            email,
            email_marketing_consent,
            email_unsubscribed_at,
            email_unsubscribe_token
          `)
          .eq(
            "id",
            recipient.id
          )
          .maybeSingle();

      /*
       * Consent is deliberately checked again immediately
       * before delivery. The audience snapshot alone is
       * never treated as permission to send.
       */
      if (
        currentContactError ||
        !currentContact ||
        !currentContact.email ||
        !currentContact
          .email_marketing_consent ||
        currentContact
          .email_unsubscribed_at ||
        !currentContact
          .email_unsubscribe_token
      ) {
        skippedCount += 1;

        await supabase
          .from(
            "marketing_campaign_recipients"
          )
          .update({
            status:
              "skipped",

            skipped_at:
              new Date()
                .toISOString(),

            error_message:
              "Contact was no longer eligible for email marketing at send time.",
          })
          .eq(
            "campaign_id",
            campaignId
          )
          .eq(
            "contact_id",
            recipient.id
          );

        continue;
      }

      const unsubscribeUrl =
        `${siteUrl}/api/marketing/unsubscribe/${currentContact.email_unsubscribe_token}`;

      try {
        const {
          data,
          error,
        } =
          await resend.emails.send({
            from:
              "Port Petals <orders@portpetals.com>",

            to: [
              currentContact.email,
            ],

            replyTo:
              "stacy@portpetals.com",

            subject:
              campaign.subject,

            html:
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

                unsubscribeUrl,
              }),
          });

        if (error) {
          failedCount += 1;

          await supabase
            .from(
              "marketing_campaign_recipients"
            )
            .update({
              status:
                "failed",

              failed_at:
                new Date()
                  .toISOString(),

              error_message:
                error.message ??
                "Resend returned an error.",
            })
            .eq(
              "campaign_id",
              campaignId
            )
            .eq(
              "contact_id",
              recipient.id
            );

          continue;
        }

        sentCount += 1;

        await supabase
          .from(
            "marketing_campaign_recipients"
          )
          .update({
            recipient_email:
              currentContact.email,

            status:
              "sent",

            resend_email_id:
              data?.id ??
              null,

            sent_at:
              new Date()
                .toISOString(),

            error_message:
              null,
          })
          .eq(
            "campaign_id",
            campaignId
          )
          .eq(
            "contact_id",
            recipient.id
          );
      } catch (
        recipientError
      ) {
        failedCount += 1;

        await supabase
          .from(
            "marketing_campaign_recipients"
          )
          .update({
            status:
              "failed",

            failed_at:
              new Date()
                .toISOString(),

            error_message:
              recipientError instanceof
                Error
                ? recipientError.message
                : "Unexpected email delivery error.",
          })
          .eq(
            "campaign_id",
            campaignId
          )
          .eq(
            "contact_id",
            recipient.id
          );
      }
    }

    const finishedAt =
      new Date().toISOString();

    const finalStatus =
      sentCount === 0 &&
      failedCount > 0
        ? "failed"
        : "sent";

    const {
      error: finishError,
    } =
      await supabase
        .from(
          "marketing_campaigns"
        )
        .update({
          status:
            finalStatus,

          sent_count:
            sentCount,

          failed_count:
            failedCount,

          skipped_count:
            skippedCount,

          sent_at:
            finishedAt,
        })
        .eq(
          "id",
          campaignId
        );

    if (finishError) {
      throw new Error(
        finishError.message
      );
    }

    revalidatePath(
      "/admin"
    );

    revalidatePath(
      "/admin/marketing"
    );

    revalidatePath(
      `/admin/marketing/${campaignId}`
    );

    return {
      recipientCount:
        recipients.length,

      sentCount,
      failedCount,
      skippedCount,
    };
  } catch (
    sendError
  ) {
    await supabase
      .from(
        "marketing_campaigns"
      )
      .update({
        status:
          "failed",
      })
      .eq(
        "id",
        campaignId
      )
      .eq(
        "status",
        "sending"
      );

    revalidatePath(
      "/admin/marketing"
    );

    revalidatePath(
      `/admin/marketing/${campaignId}`
    );

    throw sendError;
  }
}
