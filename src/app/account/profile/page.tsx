import type { Metadata } from "next";
import { redirect } from "next/navigation";

import AccountNavigation from "@/components/account/AccountNavigation";
import CustomerProfileForm from "@/components/CustomerProfileForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Profile",
  description:
    "Manage your Port Petals customer profile.",
};

export default async function AccountProfilePage() {
  const supabase =
    await createClient();

  const {
    data: userData,
  } =
    await supabase.auth.getUser();

  const user =
    userData.user;

  if (!user) {
    redirect(
      "/account/login"
    );
  }

  const {
    data: profile,
    error,
  } =
    await supabase
      .from(
        "customer_profiles"
      )
      .select(`
        full_name,
        phone,
        birthday_month,
        birthday_day
      `)
      .eq(
        "user_id",
        user.id
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      "Unable to load your profile."
    );
  }

  const hasBirthday =
    Boolean(
      profile?.birthday_month &&
      profile?.birthday_day
    );

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-6xl px-4 pb-7 pt-8 sm:px-8 sm:pb-9 sm:pt-12 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          My Port Petals
        </p>

        <div className="mt-2 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-[#153f32] sm:text-5xl">
              Profile
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068] sm:text-base">
              Keep your contact details
              current and manage the
              information used for your
              Port Petals account.
            </p>
          </div>

          <div
            className={[
              "rounded-2xl px-5 py-4 shadow-sm",
              hasBirthday
                ? "bg-[#edf3e7] text-[#31583b]"
                : "border border-[#284239]/10 bg-white text-[#607068]",
            ].join(" ")}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em]">
              Birthday Bloom
            </p>

            <p className="mt-1 text-sm font-semibold">
              {hasBirthday
                ? "Birthday saved"
                : "Birthday not added"}
            </p>
          </div>
        </div>
      </section>

      <AccountNavigation />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-[2rem] border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-8">
            <div className="border-b border-[#284239]/10 pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Personal Details
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                Your information
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#607068]">
                Update your name, phone
                number, and optional birthday.
              </p>
            </div>

            <div className="mt-6">
              <CustomerProfileForm
                userId={
                  user.id
                }
                email={
                  user.email ??
                  ""
                }
                initialName={
                  profile
                    ?.full_name ??
                  ""
                }
                initialPhone={
                  profile
                    ?.phone ??
                  ""
                }
                initialBirthdayMonth={
                  profile
                    ?.birthday_month ??
                  null
                }
                initialBirthdayDay={
                  profile
                    ?.birthday_day ??
                  null
                }
              />
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-[2rem] bg-[#153f32] p-6 text-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4b0a8]">
                Account Email
              </p>

              <p className="mt-3 break-all font-semibold">
                {user.email}
              </p>

              <p className="mt-3 text-sm leading-6 text-white/70">
                Your account email is used
                for authentication and
                account communication.
              </p>
            </section>

            <section className="rounded-[2rem] border border-[#284239]/10 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Birthday Bloom
              </p>

              <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
                {hasBirthday
                  ? "Your birthday is saved"
                  : "Add your birthday"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                {hasBirthday
                  ? "Port Petals can use your saved birthday month and day for your annual Birthday Bloom perk."
                  : "Add your birthday month and day to become eligible for Birthday Bloom during your birthday month."}
              </p>

              <a
                href="/account/rewards"
                className="mt-4 inline-flex text-sm font-semibold text-[#31583b] underline decoration-[#e76d61]/30 underline-offset-4"
              >
                View rewards
              </a>
            </section>

            <section className="rounded-[2rem] border border-[#284239]/10 bg-[#fffdf9] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Privacy
              </p>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Birthday information stores
                the month and day only. A
                birth year is not required
                for Birthday Bloom.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
