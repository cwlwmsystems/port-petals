import Link from "next/link";
import {
  notFound,
  redirect,
} from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WeddingLeadActions from "./WeddingLeadActions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const statusLabels: Record<
  string,
  string
> = {
  new: "New",
  contacted: "Contacted",
  consultation_scheduled:
    "Consultation Scheduled",
  quote_sent:
    "Quote Sent",
  booked: "Booked",
  declined: "Declined",
  completed: "Completed",
};

function statusClasses(
  status: string
) {
  switch (status) {
    case "new":
      return "bg-[#fff0d9] text-[#7a5725]";
    case "contacted":
      return "bg-[#e6edf7] text-[#365b7a]";
    case "consultation_scheduled":
      return "bg-[#e8e3f4] text-[#5f4f7d]";
    case "quote_sent":
      return "bg-[#f4ead8] text-[#775d2f]";
    case "booked":
      return "bg-[#e6f2e3] text-[#31583b]";
    case "declined":
      return "bg-[#f8e1dc] text-[#a7473f]";
    case "completed":
      return "bg-[#e5ebe7] text-[#3f584b]";
    default:
      return "bg-[#edf1f6] text-[#536578]";
  }
}

function formatDate(
  value: string | null
) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }
  ).format(
    new Date(
      `${value}T12:00:00Z`
    )
  );
}

function formatDateTime(
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
  ).format(new Date(value));
}

function display(
  value:
    | string
    | number
    | null
    | undefined
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  return String(value);
}

function formatMoney(
  value:
    | number
    | string
    | null
) {
  if (
    value === null ||
    value === ""
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  ).format(Number(value));
}

function InfoItem({
  label,
  children,
}: {
  label: string;
  children:
    React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#718078]">
        {label}
      </p>

      <div className="mt-1 whitespace-pre-wrap leading-6 text-[#284239]">
        {children}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children:
    React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
      <h2 className="font-serif text-xl font-semibold text-[#153f32]">
        {title}
      </h2>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

export default async function WeddingLeadPage({
  params,
}: Props) {
  const { id } =
    await params;

  const supabase =
    await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

  const userId =
    claimsData?.claims?.sub;

  if (!userId) {
    redirect("/admin/login");
  }

  const { data: adminUser } =
    await supabase
      .from("admin_users")
      .select("id")
      .eq(
        "auth_user_id",
        userId
      )
      .eq("active", true)
      .maybeSingle();

  if (!adminUser) {
    redirect("/admin/login");
  }

  const {
    data: inquiry,
    error,
  } = await supabase
    .from("wedding_inquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(
      error.message
    );
  }

  if (!inquiry) {
    notFound();
  }

  const floralPieces =
    Array.isArray(
      inquiry.floral_pieces
    )
      ? inquiry.floral_pieces
      : [];

  return (
    <main className="min-h-screen bg-transparent px-5 py-6 text-[#284239] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          eyebrow="Wedding CRM"
          title={inquiry.inquiry_number}
          description={`Received ${formatDateTime(
            inquiry.created_at
          )}`}
          backHref="/admin/weddings"
          backLabel="Back to Wedding Leads"
          actions={
            <span
              className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses(
                inquiry.status
              )}`}
            >
              {statusLabels[
                inquiry.status
              ] ??
                inquiry.status}
            </span>
          }
        />

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <Section title="Couple & Contact">
              <InfoItem label="Contact Name">
                {display(
                  inquiry.contact_name
                )}
              </InfoItem>

              <InfoItem label="Role">
                {display(
                  inquiry.contact_role
                )}
              </InfoItem>

              <InfoItem label="Partner / Couple">
                {display(
                  inquiry.partner_name
                )}
              </InfoItem>

              <InfoItem label="Preferred Contact">
                {display(
                  inquiry.preferred_contact
                )}
              </InfoItem>

              <InfoItem label="Email">
                <a
                  href={`mailto:${inquiry.email}`}
                  className="break-all font-semibold text-[#e76d61] hover:underline"
                >
                  {
                    inquiry.email
                  }
                </a>
              </InfoItem>

              <InfoItem label="Phone">
                <a
                  href={`tel:${inquiry.phone}`}
                  className="font-semibold text-[#e76d61] hover:underline"
                >
                  {
                    inquiry.phone
                  }
                </a>
              </InfoItem>
            </Section>

            <Section title="Wedding Details">
              <InfoItem label="Wedding Date">
                {formatDate(
                  inquiry.wedding_date
                )}
              </InfoItem>

              <InfoItem label="Date Flexible">
                {display(
                  inquiry.flexible_date
                )}
              </InfoItem>

              <InfoItem label="Ceremony Location">
                {display(
                  inquiry.ceremony_location
                )}
              </InfoItem>

              <InfoItem label="Reception Location">
                {display(
                  inquiry.reception_location
                )}
              </InfoItem>

              <InfoItem label="Ceremony Setting">
                {display(
                  inquiry.ceremony_setting
                )}
              </InfoItem>

              <InfoItem label="Reception Setting">
                {display(
                  inquiry.reception_setting
                )}
              </InfoItem>

              <InfoItem label="Guest Count">
                {display(
                  inquiry.guest_count
                )}
              </InfoItem>

              <InfoItem label="Planner / Coordinator">
                {display(
                  inquiry.planner_name
                )}
              </InfoItem>

              <InfoItem label="Planner Contact">
                {display(
                  inquiry.planner_contact
                )}
              </InfoItem>
            </Section>

            <Section title="Style & Floral Vision">
              <InfoItem label="Wedding Style">
                {display(
                  inquiry.wedding_style
                )}
              </InfoItem>

              <InfoItem label="Wedding Colors">
                {display(
                  inquiry.wedding_colors
                )}
              </InfoItem>

              <InfoItem label="Flowers They Love">
                {display(
                  inquiry.flower_preferences
                )}
              </InfoItem>

              <InfoItem label="Flowers / Styles to Avoid">
                {display(
                  inquiry.flowers_to_avoid
                )}
              </InfoItem>

              <div className="sm:col-span-2">
                <InfoItem label="Inspiration / Vision">
                  {display(
                    inquiry.inspiration
                  )}
                </InfoItem>
              </div>
            </Section>

            <Section title="Requested Floral Pieces">
              <div className="sm:col-span-2">
                {floralPieces.length >
                0 ? (
                  <div className="flex flex-wrap gap-2">
                    {floralPieces.map(
                      (
                        piece:
                          string
                      ) => (
                        <span
                          key={
                            piece
                          }
                          className="rounded-full bg-[#edf3e7] px-3 py-1.5 text-sm font-medium text-[#31583b]"
                        >
                          {
                            piece
                          }
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-[#607068]">
                    None selected.
                  </p>
                )}
              </div>
            </Section>

            <Section title="Personal Flowers">
              <InfoItem label="Bridal Bouquet Style">
                {display(
                  inquiry.bridal_bouquet_style
                )}
              </InfoItem>

              <InfoItem label="Bridesmaid Bouquets">
                {display(
                  inquiry.bridesmaid_count
                )}
              </InfoItem>

              <InfoItem label="Boutonnieres">
                {display(
                  inquiry.boutonniere_count
                )}
              </InfoItem>

              <InfoItem label="Corsages">
                {display(
                  inquiry.corsage_count
                )}
              </InfoItem>
            </Section>

            <Section title="Ceremony">
              <div className="sm:col-span-2">
                <InfoItem label="Arch / Arbor">
                  {display(
                    inquiry.arch_details
                  )}
                </InfoItem>
              </div>

              <div className="sm:col-span-2">
                <InfoItem label="Ceremony Details">
                  {display(
                    inquiry.ceremony_details
                  )}
                </InfoItem>
              </div>

              <InfoItem label="Memorial Flowers">
                {display(
                  inquiry.memorial_flowers
                )}
              </InfoItem>
            </Section>

            <Section title="Reception">
              <InfoItem label="Centerpiece Count">
                {display(
                  inquiry.centerpiece_count
                )}
              </InfoItem>

              <InfoItem label="Centerpiece Style">
                {display(
                  inquiry.centerpiece_style
                )}
              </InfoItem>

              <InfoItem label="Cake Flowers">
                {display(
                  inquiry.cake_flowers
                )}
              </InfoItem>

              <div className="sm:col-span-2">
                <InfoItem label="Reception Details">
                  {display(
                    inquiry.reception_details
                  )}
                </InfoItem>
              </div>
            </Section>

            <Section title="Budget & Logistics">
              <InfoItem label="Budget Range">
                {display(
                  inquiry.budget_range
                )}
              </InfoItem>

              <InfoItem label="Delivery / Setup">
                {display(
                  inquiry.delivery_setup
                )}
              </InfoItem>

              <InfoItem label="Setup Time">
                {display(
                  inquiry.setup_time
                )}
              </InfoItem>

              <InfoItem label="Teardown Needed">
                {display(
                  inquiry.teardown_needed
                )}
              </InfoItem>

              <div className="sm:col-span-2">
                <InfoItem label="Budget Notes">
                  {display(
                    inquiry.budget_notes
                  )}
                </InfoItem>
              </div>

              <div className="sm:col-span-2">
                <InfoItem label="Additional Notes">
                  {display(
                    inquiry.additional_notes
                  )}
                </InfoItem>
              </div>
            </Section>

            <Section title="Email Delivery">
              <InfoItem label="Stacy Email">
                {inquiry.owner_email_sent_at
                  ? `Sent ${formatDateTime(
                      inquiry.owner_email_sent_at
                    )}`
                  : inquiry.owner_email_error
                    ? `Failed: ${inquiry.owner_email_error}`
                    : "Not sent"}
              </InfoItem>

              <InfoItem label="Customer Confirmation">
                {inquiry.customer_confirmation_sent_at
                  ? `Sent ${formatDateTime(
                      inquiry.customer_confirmation_sent_at
                    )}`
                  : inquiry.customer_email_error
                    ? `Failed: ${inquiry.customer_email_error}`
                    : "Not sent"}
              </InfoItem>
            </Section>
          </div>

          <aside className="space-y-5">
            <WeddingLeadActions
              inquiryId={
                inquiry.id
              }
              currentStatus={
                inquiry.status
              }
              quoteStatus={
                inquiry.quote_status
              }
              quoteAmount={
                inquiry.quote_amount
              }
              consultationAt={
                inquiry.consultation_at
              }
              followUpAt={
                inquiry.follow_up_at
              }
              lastContactedAt={
                inquiry.last_contacted_at
              }
              internalNotes={
                inquiry.internal_notes
              }
            />

            <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
              <h2 className="font-serif text-xl font-semibold text-[#153f32]">
                CRM Summary
              </h2>

              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-[#153f32]">
                    Quote
                  </dt>

                  <dd className="mt-1 text-[#607068]">
                    {formatMoney(
                      inquiry.quote_amount
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-[#153f32]">
                    Quote Status
                  </dt>

                  <dd className="mt-1 capitalize text-[#607068]">
                    {display(
                      inquiry.quote_status
                    ).replaceAll(
                      "_",
                      " "
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-[#153f32]">
                    Consultation
                  </dt>

                  <dd className="mt-1 text-[#607068]">
                    {formatDateTime(
                      inquiry.consultation_at
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-[#153f32]">
                    Next Follow-Up
                  </dt>

                  <dd className="mt-1 text-[#607068]">
                    {formatDateTime(
                      inquiry.follow_up_at
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-[#153f32]">
                    Last Contacted
                  </dt>

                  <dd className="mt-1 text-[#607068]">
                    {formatDateTime(
                      inquiry.last_contacted_at
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-[#153f32]">
                    Booked
                  </dt>

                  <dd className="mt-1 text-[#607068]">
                    {formatDateTime(
                      inquiry.booked_at
                    )}
                  </dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
