import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductCreateForm from "./ProductCreateForm";

export default async function NewProductPage() {
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
      .eq("auth_user_id", userId)
      .eq("active", true)
      .maybeSingle();

  if (!adminUser) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-5 py-10 text-[#284239] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/products"
          className="text-sm font-semibold text-[#607068] transition hover:text-[#e76d61]"
        >
          ← Back to Product Catalog
        </Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
          Port Petals Admin
        </p>

        <h1 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
          Create Product
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-[#607068]">
          Add the core product information
          first. Port Petals will apply the
          appropriate preparation rules based
          on the product type.
        </p>

        <ProductCreateForm />
      </div>
    </main>
  );
}
