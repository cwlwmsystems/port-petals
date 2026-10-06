import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CustomerProfileForm from "@/components/CustomerProfileForm";

export const metadata: Metadata = {
  title: "My Profile",
  description:
    "Manage your Port Petals customer profile.",
};

export default async function AccountProfilePage() {
  const supabase = await createClient();

  const { data: userData } =
    await supabase.auth.getUser();

  const user =
    userData.user;

  if (!user) {
    redirect("/account/login");
  }

  const { data: profile, error } =
    await supabase
      .from("customer_profiles")
      .select(`
        full_name,
        phone,
        birthday_month,
        birthday_day
      `)
      .eq("user_id", user.id)
      .maybeSingle();

  if (error) {
    throw new Error(
      "Unable to load your profile."
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-12">
        <Link
          href="/account"
          className="text-sm font-semibold text-[#36594c] underline underline-offset-4"
        >
          ← Back to My Account
        </Link>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
            My Port Petals
          </p>

          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#153f32] sm:text-5xl">
            Your Profile
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068] sm:text-base">
            Keep your contact details current and add
            your birthday if you&apos;d like Port Petals
            to remember your special day.
          </p>
        </div>

        <div className="mt-8">
          <CustomerProfileForm
            userId={user.id}
            email={user.email ?? ""}
            initialName={
              profile?.full_name ?? ""
            }
            initialPhone={
              profile?.phone ?? ""
            }
            initialBirthdayMonth={
              profile?.birthday_month ?? null
            }
            initialBirthdayDay={
              profile?.birthday_day ?? null
            }
          />
        </div>
      </section>
    </main>
  );
}
