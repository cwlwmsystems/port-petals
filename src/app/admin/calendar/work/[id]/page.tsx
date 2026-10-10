import {
  notFound,
  redirect,
} from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ManualWorkForm from "../ManualWorkForm";
import {
  deleteManualWork,
  updateManualWork,
} from "../actions";
import DeleteWorkButton from "./DeleteWorkButton";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ManualWorkPage({
  params,
}: Props) {
  const {
    id,
  } =
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

  const admin =
    createAdminClient();

  const {
    data: item,
    error,
  } =
    await admin
      .from(
        "manual_work_items"
      )
      .select("*")
      .eq("id", id)
      .maybeSingle();

  if (error) {
    throw new Error(
      error.message
    );
  }

  if (!item) {
    notFound();
  }

  const updateAction =
    updateManualWork.bind(
      null,
      id
    );

  const deleteAction =
    deleteManualWork.bind(
      null,
      id
    );

  return (
    <main className="min-h-screen bg-transparent px-5 py-6 text-[#284239] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <AdminPageHeader
          eyebrow="Manual Work"
          title={
            item.work_number
          }
          description={
            item.title
          }
          backHref="/admin/calendar"
          backLabel="Back to Production Calendar"
          actions={
            <DeleteWorkButton
              action={
                deleteAction
              }
            />
          }
        />

        <ManualWorkForm
          action={
            updateAction
          }
          values={
            item
          }
          submitLabel="Save Changes"
        />
      </div>
    </main>
  );
}
