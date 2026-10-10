import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ManualWorkForm from "../ManualWorkForm";
import { createManualWork } from "../actions";

export default async function NewManualWorkPage() {
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

  return (
    <main className="min-h-screen bg-transparent px-5 py-6 text-[#284239] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <AdminPageHeader
          eyebrow="Production Calendar"
          title="Add Work"
          description="Add work received outside the website, such as walk-ins, phone orders, Facebook messages, or email requests."
          backHref="/admin/calendar"
          backLabel="Back to Production Calendar"
        />

        <ManualWorkForm
          action={
            createManualWork
          }
          submitLabel="Add Work"
        />
      </div>
    </main>
  );
}
