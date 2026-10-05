import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductCreateForm from "./ProductCreateForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

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
    <main className="min-h-screen bg-transparent px-5 py-6 text-[#284239] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <AdminPageHeader
          eyebrow="Product Catalog"
          title="Create Product"
          description="Add the core product information first. Port Petals will apply the appropriate preparation rules based on the product type."
          backHref="/admin/products"
          backLabel="Back to Product Catalog"
        />

        <ProductCreateForm />
      </div>
    </main>
  );
}
