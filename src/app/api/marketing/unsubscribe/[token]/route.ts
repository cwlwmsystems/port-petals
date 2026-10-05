import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(
  request: Request,
  {
    params,
  }: Props
) {
  const {
    token,
  } = await params;

  const requestUrl =
    new URL(request.url);

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      token
    )
  ) {
    return NextResponse.redirect(
      new URL(
        "/unsubscribe?status=invalid",
        requestUrl.origin
      )
    );
  }

  const supabase =
    createAdminClient();

  const {
    data: contact,
    error: contactError,
  } =
    await supabase
      .from(
        "marketing_contacts"
      )
      .select(`
        id,
        email,
        email_marketing_consent,
        email_unsubscribed_at
      `)
      .eq(
        "email_unsubscribe_token",
        token
      )
      .maybeSingle();

  if (
    contactError ||
    !contact
  ) {
    return NextResponse.redirect(
      new URL(
        "/unsubscribe?status=invalid",
        requestUrl.origin
      )
    );
  }

  if (
    contact.email_marketing_consent ||
    !contact.email_unsubscribed_at
  ) {
    const now =
      new Date().toISOString();

    const {
      error: updateError,
    } =
      await supabase
        .from(
          "marketing_contacts"
        )
        .update({
          email_marketing_consent:
            false,

          email_unsubscribed_at:
            now,
        })
        .eq(
          "id",
          contact.id
        );

    if (updateError) {
      console.error(
        "Unable to process marketing unsubscribe:",
        updateError
      );

      return NextResponse.redirect(
        new URL(
          "/unsubscribe?status=error",
          requestUrl.origin
        )
      );
    }

    const {
      error: eventError,
    } =
      await supabase
        .from(
          "marketing_consent_events"
        )
        .insert({
          contact_id:
            contact.id,

          channel:
            "email",

          action:
            "opted_out",

          source:
            "marketing_unsubscribe",

          occurred_at:
            now,

          metadata: {
            method:
              "email_unsubscribe_link",
          },
        });

    if (eventError) {
      console.error(
        "Unable to record marketing unsubscribe consent event:",
        eventError
      );
    }
  }

  return NextResponse.redirect(
    new URL(
      "/unsubscribe?status=success",
      requestUrl.origin
    )
  );
}
