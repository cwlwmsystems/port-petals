import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Choose New Password",
};

export default async function ResetPasswordPage() {
  const supabase = await createClient();

  const { data } =
    await supabase.auth.getClaims();

  if (!data?.claims?.sub) {
    redirect(
      "/account/login?error=confirmation"
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-5 py-12 text-[#284239] sm:px-8 sm:py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e76d61]">
            Port Petals
          </p>

          <h1 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
            Choose a new password
          </h1>

          <p className="mt-4 leading-7 text-[#607068]">
            Enter a new password for your
            Port Petals account.
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </main>
  );
}
