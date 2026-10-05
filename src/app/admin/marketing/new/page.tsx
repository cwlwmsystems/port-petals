import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createCampaign } from "../actions";

export default async function NewMarketingCampaignPage() {
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

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-5 py-10 text-[#284239] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/marketing"
          className="text-sm font-semibold text-[#607068] transition hover:text-[#e76d61]"
        >
          ← Back to Marketing
        </Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
          Email Marketing
        </p>

        <h1 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
          Create Campaign
        </h1>

        <p className="mt-3 max-w-2xl text-[#607068]">
          Save the campaign as a draft first. No email will be sent from this
          form.
        </p>

        <form
          action={
            createCampaign
          }
          className="mt-7 space-y-5"
        >
          <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
              Campaign
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 sm:col-span-2">
                <span className="text-sm font-semibold text-[#153f32]">
                  Internal Campaign Name
                </span>

                <input
                  name="name"
                  required
                  maxLength={
                    150
                  }
                  placeholder="Fall centerpiece promotion"
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
                  maxLength={
                    200
                  }
                  placeholder="Fresh fall flowers are here"
                  className="min-h-12 rounded-xl border border-[#284239]/15 px-4 outline-none transition focus:border-[#e76d61]"
                />
              </label>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-sm font-semibold text-[#153f32]">
                  Preview Text
                </span>

                <input
                  name="preview_text"
                  maxLength={
                    250
                  }
                  placeholder="Seasonal arrangements available now."
                  className="min-h-12 rounded-xl border border-[#284239]/15 px-4 outline-none transition focus:border-[#e76d61]"
                />
              </label>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-sm font-semibold text-[#153f32]">
                  Headline
                </span>

                <input
                  name="headline"
                  maxLength={
                    250
                  }
                  placeholder="Celebrate the season with Port Petals"
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
                  maxLength={
                    1500
                  }
                  placeholder="https://www.portpetals.com/..."
                  className="min-h-12 rounded-xl border border-[#284239]/15 px-4 outline-none transition focus:border-[#e76d61]"
                />

                <span className="text-xs leading-5 text-[#718078]">
                  Optional. Use a public HTTPS image URL. Wide landscape
                  images work best.
                </span>
              </label>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-sm font-semibold text-[#153f32]">
                  Promotional Badge
                </span>

                <input
                  name="offer_badge"
                  maxLength={
                    120
                  }
                  placeholder="Homecoming Pre-Orders Open"
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
                    10
                  }
                  maxLength={
                    10000
                  }
                  placeholder="Write the promotional message here..."
                  className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none transition focus:border-[#e76d61]"
                />
              </label>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-sm font-semibold text-[#153f32]">
                  Secondary Heading
                </span>

                <input
                  name="secondary_heading"
                  maxLength={
                    250
                  }
                  placeholder="Made locally for your special moments"
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
                  maxLength={
                    2500
                  }
                  placeholder="Add a little more context, ordering information, availability, or local pickup/delivery details."
                  className="rounded-xl border border-[#284239]/15 px-4 py-3 outline-none transition focus:border-[#e76d61]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#153f32]">
                  Button Label
                </span>

                <input
                  name="cta_label"
                  maxLength={
                    100
                  }
                  placeholder="Shop Flowers"
                  className="min-h-12 rounded-xl border border-[#284239]/15 px-4 outline-none transition focus:border-[#e76d61]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#153f32]">
                  Button URL
                </span>

                <input
                  name="cta_url"
                  type="url"
                  maxLength={
                    1000
                  }
                  placeholder="https://www.portpetals.com/flowers"
                  className="min-h-12 rounded-xl border border-[#284239]/15 px-4 outline-none transition focus:border-[#e76d61]"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
              Audience
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#607068]">
              Only contacts with active email marketing consent will ever be
              eligible. These filters narrow that consented audience further.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#153f32]">
                  Contact Type
                </span>

                <select
                  name="contact_type"
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

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#284239] px-6 text-sm font-semibold text-white transition hover:bg-[#1d332b]"
            >
              Save Draft Campaign
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
