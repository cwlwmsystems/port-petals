import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your Port Petals customer account.",
};

export default async function AccountLoginPage() {
  const supabase = await createClient();

  const { data } =
    await supabase.auth.getClaims();

  if (data?.claims?.sub) {
    redirect("/account");
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-5 py-12 text-[#284239] sm:px-8 sm:py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e76d61]">
            Port Petals
          </p>

          <h1 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
            Welcome back
          </h1>

          <p className="mt-4 leading-7 text-[#607068]">
            Sign in to see your orders, saved favorites,
            Petals, rewards, and account details.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
