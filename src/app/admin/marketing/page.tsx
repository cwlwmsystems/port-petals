import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

function formatDate(
  value: string
) {
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

function statusClasses(
  status: string
) {
  switch (status) {
    case "draft":
      return "bg-[#f4ead8] text-[#775d2f]";

    case "sending":
      return "bg-[#e6edf7] text-[#365b7a]";

    case "sent":
      return "bg-[#e6f2e3] text-[#31583b]";

    case "failed":
      return "bg-[#f8e1dc] text-[#a7473f]";

    default:
      return "bg-[#edf1f6] text-[#607068]";
  }
}

function statusLabel(
  status: string
) {
  return status
    .replaceAll(
      "_",
      " "
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

export default async function AdminMarketingPage() {
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

  const [
    campaignsResult,
    draftCountResult,
    sentCountResult,
  ] =
    await Promise.all([
      supabase
        .from(
          "marketing_campaigns"
        )
        .select(`
          id,
          name,
          subject,
          status,
          recipient_count,
          sent_count,
          failed_count,
          skipped_count,
          created_at,
          updated_at,
          sent_at
        `)
        .order(
          "created_at",
          {
            ascending: false,
          }
        ),

      supabase
        .from(
          "marketing_campaigns"
        )
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq(
          "status",
          "draft"
        ),

      supabase
        .from(
          "marketing_campaigns"
        )
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq(
          "status",
          "sent"
        ),
    ]);

  if (
    campaignsResult.error
  ) {
    throw new Error(
      campaignsResult
        .error
        .message
    );
  }

  const campaigns =
    campaignsResult.data ??
    [];

  return (
    <main className="min-h-screen bg-transparent px-5 py-6 text-[#284239] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          eyebrow="Marketing"
          title="Email Marketing"
          description="Create promotional campaigns, select consented audiences, preview messages, and review delivery history."
          actions={
            <Link
              href="/admin/marketing/new"
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#e76d61] px-5 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
            >
              Create Campaign
            </Link>
          }
        />

        <section className="mt-5 overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
          <div className="grid grid-cols-1 divide-y divide-[#284239]/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="px-4 py-4 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Campaigns
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {
                  campaigns.length
                }
              </p>
            </div>

            <div className="px-4 py-4 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Drafts
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#775d2f]">
                {
                  draftCountResult.count ??
                  0
                }
              </p>
            </div>

            <div className="px-4 py-4 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Sent
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#31583b]">
                {
                  sentCountResult.count ??
                  0
                }
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
          <div className="border-b border-[#284239]/10 px-5 py-4 sm:px-6">
            <h2 className="font-serif text-xl font-semibold text-[#153f32]">
              Campaigns
            </h2>
          </div>

          {campaigns.length ===
          0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-semibold text-[#153f32]">
                No campaigns yet.
              </p>

              <p className="mt-2 text-sm text-[#607068]">
                Create a draft campaign to start preparing your first
                promotional email.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#284239]/10">
              {campaigns.map(
                (campaign) => (
                  <Link
                    key={
                      campaign.id
                    }
                    href={`/admin/marketing/${campaign.id}`}
                    className="grid gap-3 px-5 py-4 transition hover:bg-[#f7f8f6] sm:grid-cols-[1.5fr_auto_auto] sm:items-center sm:px-6"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-[#153f32]">
                          {
                            campaign.name
                          }
                        </p>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses(
                            campaign.status
                          )}`}
                        >
                          {
                            statusLabel(
                              campaign.status
                            )
                          }
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-[#607068]">
                        {
                          campaign.subject
                        }
                      </p>

                      <p className="mt-2 text-xs text-[#718078]">
                        Created{" "}
                        {
                          formatDate(
                            campaign.created_at
                          )
                        }
                      </p>
                    </div>

                    <div className="text-sm sm:text-right">
                      <p className="font-semibold text-[#153f32]">
                        {
                          campaign.recipient_count
                        }{" "}
                        recipients
                      </p>

                      <p className="mt-1 text-xs text-[#718078]">
                        {
                          campaign.sent_count
                        }{" "}
                        sent
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-[#e76d61] sm:text-right">
                      Open →
                    </p>
                  </Link>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
