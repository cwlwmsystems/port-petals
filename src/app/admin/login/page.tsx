import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  if (data?.claims?.sub) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-5 py-16 text-[#284239] sm:px-8">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e76d61]">
            Port Petals
          </p>

          <h1 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
            Owner Login
          </h1>

          <p className="mt-4 leading-7 text-[#607068]">
            Sign in to manage products and inventory.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
