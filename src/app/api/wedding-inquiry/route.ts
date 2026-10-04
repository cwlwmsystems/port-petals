import {
  NextResponse,
} from "next/server";
import { resend } from "@/lib/email/resend";

const OWNER_EMAIL =
  "stacy@portpetals.com";

const FROM_EMAIL =
  "Port Petals <orders@portpetals.com>";

function clean(
  value: unknown,
  maxLength = 4000
) {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(
  value: string
) {
  return value
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}

function display(
  value: string
) {
  return value
    ? escapeHtml(value)
    : "Not provided";
}

function row(
  label: string,
  value: string
) {
  return `
    <tr>
      <td
        style="
          width:38%;
          padding:9px 12px;
          border-bottom:1px solid #ece6dd;
          vertical-align:top;
          font-weight:700;
          color:#153f32;
        "
      >
        ${escapeHtml(label)}
      </td>

      <td
        style="
          padding:9px 12px;
          border-bottom:1px solid #ece6dd;
          vertical-align:top;
          color:#52655d;
        "
      >
        ${display(value)}
      </td>
    </tr>
  `;
}

function section(
  title: string,
  rows: string
) {
  return `
    <div
      style="
        margin-top:24px;
        overflow:hidden;
        border:1px solid #e5ddd3;
        border-radius:14px;
      "
    >
      <div
        style="
          padding:12px 16px;
          background:#f7f1e8;
          color:#153f32;
          font-size:16px;
          font-weight:700;
        "
      >
        ${escapeHtml(title)}
      </div>

      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="
          border-collapse:collapse;
          font-size:14px;
        "
      >
        ${rows}
      </table>
    </div>
  `;
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    // Honeypot.
    if (
      clean(body.website, 200)
    ) {
      return NextResponse.json({
        ok: true,
      });
    }

    const contactName =
      clean(
        body.contactName,
        150
      );

    const role =
      clean(body.role, 100);

    const partnerName =
      clean(
        body.partnerName,
        150
      );

    const email =
      clean(
        body.email,
        250
      ).toLowerCase();

    const phone =
      clean(
        body.phone,
        80
      );

    const weddingDate =
      clean(
        body.weddingDate,
        40
      );

    if (
      !contactName ||
      !role ||
      !email ||
      !phone ||
      !weddingDate
    ) {
      return NextResponse.json(
        {
          error:
            "Please complete your name, role, email, phone number, and wedding date.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    const preferredContact =
      clean(
        body.preferredContact,
        80
      );

    const flexibleDate =
      clean(
        body.flexibleDate,
        40
      );

    const ceremonyLocation =
      clean(
        body.ceremonyLocation,
        300
      );

    const receptionLocation =
      clean(
        body.receptionLocation,
        300
      );

    const ceremonySetting =
      clean(
        body.ceremonySetting,
        100
      );

    const receptionSetting =
      clean(
        body.receptionSetting,
        100
      );

    const guestCount =
      clean(
        body.guestCount,
        30
      );

    const plannerName =
      clean(
        body.plannerName,
        150
      );

    const plannerContact =
      clean(
        body.plannerContact,
        250
      );

    const weddingStyle =
      clean(
        body.weddingStyle,
        100
      );

    const weddingColors =
      clean(
        body.weddingColors,
        300
      );

    const flowerPreferences =
      clean(
        body.flowerPreferences
      );

    const flowersToAvoid =
      clean(
        body.flowersToAvoid
      );

    const inspiration =
      clean(
        body.inspiration
      );

    const budgetRange =
      clean(
        body.budgetRange,
        100
      );

    const budgetNotes =
      clean(
        body.budgetNotes
      );

    const bridalBouquetStyle =
      clean(
        body.bridalBouquetStyle,
        100
      );

    const bridesmaidCount =
      clean(
        body.bridesmaidCount,
        20
      );

    const boutonniereCount =
      clean(
        body.boutonniereCount,
        20
      );

    const corsageCount =
      clean(
        body.corsageCount,
        20
      );

    const centerpieceCount =
      clean(
        body.centerpieceCount,
        20
      );

    const centerpieceStyle =
      clean(
        body.centerpieceStyle,
        100
      );

    const archDetails =
      clean(
        body.archDetails
      );

    const ceremonyDetails =
      clean(
        body.ceremonyDetails
      );

    const receptionDetails =
      clean(
        body.receptionDetails
      );

    const cakeFlowers =
      clean(
        body.cakeFlowers,
        40
      );

    const memorialFlowers =
      clean(
        body.memorialFlowers,
        40
      );

    const deliverySetup =
      clean(
        body.deliverySetup,
        100
      );

    const setupTime =
      clean(
        body.setupTime,
        40
      );

    const teardownNeeded =
      clean(
        body.teardownNeeded,
        40
      );

    const additionalNotes =
      clean(
        body.additionalNotes
      );

    const floralPieces =
      Array.isArray(
        body.floralPieces
      )
        ? (body.floralPieces as unknown[])
            .filter(
              (
                item: unknown
              ): item is string =>
                typeof item ===
                "string"
            )
            .map(
              (item: string) =>
                clean(item, 150)
            )
            .filter(Boolean)
            .slice(0, 40)
        : [];

    const floralPiecesText =
      floralPieces.length > 0
        ? floralPieces.join(
            ", "
          )
        : "";

    const ownerHtml = `
      <div
        style="
          font-family:Arial,sans-serif;
          line-height:1.6;
          color:#284239;
          max-width:760px;
          margin:auto;
        "
      >
        <div
          style="
            padding:26px;
            border-radius:18px;
            background:#f7f1e8;
          "
        >
          <p
            style="
              margin:0;
              color:#e76d61;
              font-size:12px;
              font-weight:700;
              text-transform:uppercase;
              letter-spacing:2px;
            "
          >
            New Wedding Inquiry
          </p>

          <h1
            style="
              margin:8px 0 0;
              color:#153f32;
            "
          >
            Wedding Floral Consultation
          </h1>

          <p
            style="
              margin-top:14px;
              color:#52655d;
            "
          >
            ${escapeHtml(
              contactName
            )} submitted a wedding
            floral inquiry through
            portpetals.com.
          </p>
        </div>

        ${section(
          "Couple & Contact",
          row(
            "Contact Name",
            contactName
          ) +
            row(
              "Role",
              role
            ) +
            row(
              "Partner / Couple",
              partnerName
            ) +
            row(
              "Email",
              email
            ) +
            row(
              "Phone",
              phone
            ) +
            row(
              "Preferred Contact",
              preferredContact
            )
        )}

        ${section(
          "Wedding Details",
          row(
            "Wedding Date",
            weddingDate
          ) +
            row(
              "Date Flexible",
              flexibleDate
            ) +
            row(
              "Ceremony Location",
              ceremonyLocation
            ) +
            row(
              "Reception Location",
              receptionLocation
            ) +
            row(
              "Ceremony Setting",
              ceremonySetting
            ) +
            row(
              "Reception Setting",
              receptionSetting
            ) +
            row(
              "Guest Count",
              guestCount
            ) +
            row(
              "Planner / Coordinator",
              plannerName
            ) +
            row(
              "Planner Contact",
              plannerContact
            )
        )}

        ${section(
          "Style & Floral Vision",
          row(
            "Wedding Style",
            weddingStyle
          ) +
            row(
              "Wedding Colors",
              weddingColors
            ) +
            row(
              "Flowers They Love",
              flowerPreferences
            ) +
            row(
              "Flowers / Styles to Avoid",
              flowersToAvoid
            ) +
            row(
              "Inspiration / Vision",
              inspiration
            )
        )}

        ${section(
          "Requested Floral Pieces",
          row(
            "Considering",
            floralPiecesText
          )
        )}

        ${section(
          "Personal Flowers",
          row(
            "Bridal Bouquet Style",
            bridalBouquetStyle
          ) +
            row(
              "Bridesmaid Bouquets",
              bridesmaidCount
            ) +
            row(
              "Boutonnieres",
              boutonniereCount
            ) +
            row(
              "Corsages",
              corsageCount
            )
        )}

        ${section(
          "Ceremony",
          row(
            "Arch / Arbor",
            archDetails
          ) +
            row(
              "Ceremony Details",
              ceremonyDetails
            ) +
            row(
              "Memorial Flowers",
              memorialFlowers
            )
        )}

        ${section(
          "Reception",
          row(
            "Centerpiece Count",
            centerpieceCount
          ) +
            row(
              "Centerpiece Style",
              centerpieceStyle
            ) +
            row(
              "Reception Details",
              receptionDetails
            ) +
            row(
              "Cake Flowers",
              cakeFlowers
            )
        )}

        ${section(
          "Budget & Logistics",
          row(
            "Budget Range",
            budgetRange
          ) +
            row(
              "Budget Notes",
              budgetNotes
            ) +
            row(
              "Delivery / Setup",
              deliverySetup
            ) +
            row(
              "Ready By",
              setupTime
            ) +
            row(
              "Teardown Needed",
              teardownNeeded
            )
        )}

        ${section(
          "Additional Notes",
          row(
            "Notes",
            additionalNotes
          )
        )}

        <div
          style="
            margin-top:24px;
            padding:18px;
            border-radius:14px;
            background:#edf3e7;
          "
        >
          <strong
            style="
              color:#153f32;
            "
          >
            Reply directly to this email
          </strong>

          <p
            style="
              margin:6px 0 0;
              color:#52655d;
              font-size:14px;
            "
          >
            The reply address is set to
            ${escapeHtml(email)}.
          </p>
        </div>
      </div>
    `;

    const {
      error: ownerError,
    } =
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [OWNER_EMAIL],
        replyTo: email,
        subject:
          `Wedding Inquiry — ${contactName} — ${weddingDate}`,
        html: ownerHtml,
      });

    if (ownerError) {
      console.error(
        "Wedding owner email error:",
        ownerError
      );

      return NextResponse.json(
        {
          error:
            "Your inquiry could not be sent. Please try again or contact Port Petals directly.",
        },
        {
          status: 500,
        }
      );
    }

    const confirmationHtml = `
      <div
        style="
          font-family:Arial,sans-serif;
          line-height:1.6;
          color:#284239;
          max-width:680px;
          margin:auto;
        "
      >
        <div
          style="
            padding:26px;
            border-radius:18px;
            background:#f7f1e8;
          "
        >
          <p
            style="
              margin:0;
              color:#e76d61;
              font-size:12px;
              font-weight:700;
              text-transform:uppercase;
              letter-spacing:2px;
            "
          >
            Wedding Inquiry Received
          </p>

          <h1
            style="
              margin:8px 0 0;
              color:#153f32;
            "
          >
            Thank you, ${escapeHtml(
              contactName
            )}.
          </h1>

          <p
            style="
              margin-top:16px;
            "
          >
            Your wedding floral
            inquiry has been sent to
            Stacy at Port Petals.
          </p>

          <p>
            <strong>
              Wedding date:
            </strong>
            ${display(
              weddingDate
            )}
          </p>

          <p>
            Stacy can review the
            details you provided
            before following up about
            availability, floral
            design, quantities,
            budget, and next steps.
          </p>

          <p
            style="
              margin-top:22px;
              color:#607068;
              font-size:13px;
            "
          >
            Submitting an inquiry does
            not reserve your wedding
            date or create a binding
            order.
          </p>
        </div>

        <p
          style="
            margin-top:20px;
            text-align:center;
            color:#607068;
            font-size:13px;
          "
        >
          Port Petals<br>
          430 E Arnold Avenue<br>
          Port Allegany, PA 16743<br>
          814-642-1253
        </p>
      </div>
    `;

    const {
      error:
        confirmationError,
    } =
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        replyTo:
          OWNER_EMAIL,
        subject:
          "We received your Port Petals wedding inquiry",
        html:
          confirmationHtml,
      });

    if (
      confirmationError
    ) {
      console.error(
        "Wedding confirmation email error:",
        confirmationError
      );
    }

    return NextResponse.json({
      ok: true,
      confirmationSent:
        !confirmationError,
    });
  } catch (error) {
    console.error(
      "Wedding inquiry error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to send your wedding inquiry.",
      },
      {
        status: 500,
      }
    );
  }
}
