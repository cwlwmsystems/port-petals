import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";

type ReferralRouteProps = {
  params: Promise<{
    code: string;
  }>;
};

export async function GET(
  request: Request,
  {
    params,
  }: ReferralRouteProps
) {
  const {
    code: rawCode,
  } = await params;

  const code =
    rawCode
      .trim()
      .toUpperCase()
      .slice(0, 50);

  const destination =
    new URL(
      "/",
      request.url
    );

  if (!code) {
    destination.searchParams.set(
      "referral",
      "invalid"
    );

    return NextResponse.redirect(
      destination
    );
  }

  const admin =
    createAdminClient();

  const {
    data: referralProfile,
    error: referralError,
  } =
    await admin
      .from(
        "customer_referral_profiles"
      )
      .select(`
        user_id,
        referral_code
      `)
      .eq(
        "referral_code",
        code
      )
      .maybeSingle();

  if (
    referralError ||
    !referralProfile
  ) {
    destination.searchParams.set(
      "referral",
      "invalid"
    );

    return NextResponse.redirect(
      destination
    );
  }

  /*
   * If the visitor is already signed in as the
   * person who owns this referral code, do not
   * store their own referral cookie.
   */
  const authSupabase =
    await createServerClient();

  const {
    data: claimsData,
  } =
    await authSupabase.auth.getClaims();

  const currentUserId =
    claimsData?.claims?.sub ??
    null;

  if (
    currentUserId &&
    currentUserId ===
      referralProfile.user_id
  ) {
    destination.searchParams.set(
      "referral",
      "self"
    );

    return NextResponse.redirect(
      destination
    );
  }

  destination.searchParams.set(
    "referral",
    "accepted"
  );

  const response =
    NextResponse.redirect(
      destination
    );

  response.cookies.set({
    name:
      "port_petals_referral",
    value:
      referralProfile.referral_code,
    httpOnly: true,
    secure:
      process.env.NODE_ENV ===
      "production",
    sameSite: "lax",
    path: "/",

    // 30 days
    maxAge:
      60 *
      60 *
      24 *
      30,
  });

  return response;
}
