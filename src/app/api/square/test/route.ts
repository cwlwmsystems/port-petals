import { NextResponse } from "next/server";

const SQUARE_API_VERSION = "2026-09-16";

export async function GET() {
  const environment = process.env.SQUARE_ENVIRONMENT;
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const expectedLocationId = process.env.SQUARE_LOCATION_ID;

  if (!accessToken) {
    return NextResponse.json(
      { error: "SQUARE_ACCESS_TOKEN is not configured." },
      { status: 500 }
    );
  }

  if (!expectedLocationId) {
    return NextResponse.json(
      { error: "SQUARE_LOCATION_ID is not configured." },
      { status: 500 }
    );
  }

  const baseUrl =
    environment === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com";

  try {
    const response = await fetch(`${baseUrl}/v2/locations`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Square-Version": SQUARE_API_VERSION,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Square connectivity error:", data);

      return NextResponse.json(
        {
          connected: false,
          error: "Square rejected the API request.",
          details: data.errors ?? null,
        },
        { status: response.status }
      );
    }

    const locations = Array.isArray(data.locations)
      ? data.locations
      : [];

    const location = locations.find(
      (item: { id?: string }) =>
        item.id === expectedLocationId
    );

    if (!location) {
      return NextResponse.json(
        {
          connected: false,
          error:
            "Square connected successfully, but SQUARE_LOCATION_ID does not match a location returned by this Sandbox account.",
          availableLocationCount: locations.length,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      connected: true,
      environment:
        environment === "production"
          ? "production"
          : "sandbox",
      location: {
        id: location.id,
        name: location.name,
        status: location.status,
        currency: location.currency,
        country: location.country,
        capabilities: location.capabilities ?? [],
      },
    });
  } catch (error) {
    console.error("Square connectivity test failed:", error);

    return NextResponse.json(
      {
        connected: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to connect to Square.",
      },
      { status: 500 }
    );
  }
}
