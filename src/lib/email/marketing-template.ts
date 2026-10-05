function escapeEmailHtml(
  value:
    | string
    | number
    | null
    | undefined
) {
  return String(
    value ?? ""
  )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function marketingMessageHtml(
  value: string
) {
  return value
    .split(/\n{2,}/)
    .map(
      (paragraph) =>
        paragraph.trim()
    )
    .filter(Boolean)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 20px;">${escapeEmailHtml(
          paragraph
        ).replace(
          /\n/g,
          "<br>"
        )}</p>`
    )
    .join("");
}

export function buildMarketingEmailHtml({
  previewText,
  headline,
  heroImageUrl,
  offerBadge,
  bodyText,
  secondaryHeading,
  secondaryText,
  ctaLabel,
  ctaUrl,
  unsubscribeUrl,
}: {
  previewText:
    | string
    | null;
  headline:
    | string
    | null;
  heroImageUrl:
    | string
    | null;
  offerBadge:
    | string
    | null;
  bodyText: string;
  secondaryHeading:
    | string
    | null;
  secondaryText:
    | string
    | null;
  ctaLabel:
    | string
    | null;
  ctaUrl:
    | string
    | null;
  unsubscribeUrl: string;
}) {
  const previewHtml =
    previewText
      ? `
        <div
          style="
            display:none;
            max-height:0;
            overflow:hidden;
            opacity:0;
            color:transparent;
            line-height:1px;
            font-size:1px;
          "
        >
          ${escapeEmailHtml(
            previewText
          )}
        </div>
      `
      : "";

  const badgeHtml =
    offerBadge
      ? `
        <div
          style="
            margin:0 0 18px;
            text-align:center;
          "
        >
          <span
            style="
              display:inline-block;
              background:#f8e1dc;
              color:#a7473f;
              border-radius:999px;
              padding:7px 14px;
              font-family:Arial,sans-serif;
              font-size:11px;
              font-weight:700;
              letter-spacing:1.2px;
              text-transform:uppercase;
            "
          >
            ${escapeEmailHtml(
              offerBadge
            )}
          </span>
        </div>
      `
      : "";

  const headlineHtml =
    headline
      ? `
        <h1
          style="
            margin:0 auto 20px;
            max-width:520px;
            color:#153f32;
            font-family:Georgia,'Times New Roman',serif;
            font-size:34px;
            line-height:1.15;
            font-weight:700;
            text-align:center;
          "
        >
          ${escapeEmailHtml(
            headline
          )}
        </h1>
      `
      : "";

  const heroImageHtml =
    heroImageUrl
      ? `
        <div
          style="
            padding:0 30px;
          "
        >
          <img
            src="${escapeEmailHtml(
              heroImageUrl
            )}"
            alt="${escapeEmailHtml(
              headline ??
                "Port Petals"
            )}"
            width="580"
            style="
              display:block;
              width:100%;
              max-width:580px;
              height:auto;
              margin:0 auto;
              border:0;
              border-radius:18px;
            "
          />
        </div>
      `
      : "";

  const ctaHtml =
    ctaLabel &&
    ctaUrl
      ? `
        <div
          style="
            margin:32px 0 10px;
            text-align:center;
          "
        >
          <a
            href="${escapeEmailHtml(
              ctaUrl
            )}"
            style="
              display:inline-block;
              min-width:170px;
              border-radius:999px;
              background:#e76d61;
              color:#ffffff;
              padding:15px 28px;
              font-family:Arial,sans-serif;
              font-size:15px;
              font-weight:700;
              text-decoration:none;
              box-shadow:0 5px 14px rgba(167,71,63,0.18);
            "
          >
            ${escapeEmailHtml(
              ctaLabel
            )} →
          </a>
        </div>
      `
      : "";

  const secondaryHtml =
    secondaryHeading ||
    secondaryText
      ? `
        <div
          style="
            margin:8px 30px 30px;
            border-top:4px solid #e76d61;
            border-radius:18px;
            background:#f4ead8;
            padding:24px;
            text-align:center;
          "
        >
          ${
            secondaryHeading
              ? `
                <h2
                  style="
                    margin:0 0 10px;
                    color:#153f32;
                    font-family:Georgia,'Times New Roman',serif;
                    font-size:23px;
                    line-height:1.25;
                  "
                >
                  ${escapeEmailHtml(
                    secondaryHeading
                  )}
                </h2>
              `
              : ""
          }

          ${
            secondaryText
              ? `
                <div
                  style="
                    color:#607068;
                    font-family:Arial,sans-serif;
                    font-size:15px;
                    line-height:1.7;
                  "
                >
                  ${marketingMessageHtml(
                    secondaryText
                  )}
                </div>
              `
              : ""
          }
        </div>
      `
      : "";

  return `
    <!doctype html>
    <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />
      </head>

      <body
        style="
          margin:0;
          padding:0;
          background:#f7f1e8;
          font-family:Arial,sans-serif;
          color:#284239;
        "
      >
        ${previewHtml}

        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            width:100%;
            background:#f7f1e8;
          "
        >
          <tr>
            <td
              align="center"
              style="
                padding:32px 12px;
              "
            >
              <table
                role="presentation"
                width="640"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  width:100%;
                  max-width:640px;
                  background:#ffffff;
                  border-radius:22px;
                  overflow:hidden;
                  border:1px solid #e8dfd4;
                "
              >
                <tr>
                  <td
                    style="
                      background:#153f32;
                      padding:24px 28px;
                      text-align:center;
                    "
                  >
                    <div
                      style="
                        color:#ffffff;
                        font-family:Georgia,'Times New Roman',serif;
                        font-size:27px;
                        font-weight:700;
                        letter-spacing:0.3px;
                      "
                    >
                      Port Petals
                    </div>

                    <div
                      style="
                        margin-top:6px;
                        color:#f4ead8;
                        font-family:Arial,sans-serif;
                        font-size:11px;
                        font-weight:700;
                        letter-spacing:2px;
                        text-transform:uppercase;
                      "
                    >
                      Flowers · Gifts · Local Favorites
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      height:6px;
                      background:#e76d61;
                      font-size:0;
                      line-height:0;
                    "
                  >
                    &nbsp;
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding:34px 30px 28px;
                    "
                  >
                    ${badgeHtml}

                    ${headlineHtml}

                    <div
                      style="
                        max-width:520px;
                        margin:0 auto;
                        color:#4f625a;
                        font-family:Arial,sans-serif;
                        font-size:16px;
                        line-height:1.8;
                        text-align:center;
                      "
                    >
                      ${marketingMessageHtml(
                        bodyText
                      )}
                    </div>

                    ${ctaHtml}
                  </td>
                </tr>

                ${
                  heroImageHtml
                    ? `
                      <tr>
                        <td
                          style="
                            padding-bottom:32px;
                          "
                        >
                          ${heroImageHtml}
                        </td>
                      </tr>
                    `
                    : ""
                }

                ${
                  secondaryHtml
                    ? `
                      <tr>
                        <td>
                          ${secondaryHtml}
                        </td>
                      </tr>
                    `
                    : ""
                }

                <tr>
                  <td
                    style="
                      padding:0 30px 30px;
                    "
                  >
                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="
                        width:100%;
                        border-radius:18px;
                        background:#e6f2e3;
                      "
                    >
                      <tr>
                        <td
                          width="33%"
                          align="center"
                          style="
                            padding:18px 8px;
                            color:#31583b;
                            font-size:12px;
                            line-height:1.4;
                          "
                        >
                          <strong>Local</strong>
                          <br />
                          Port Allegany
                        </td>

                        <td
                          width="33%"
                          align="center"
                          style="
                            padding:18px 8px;
                            color:#31583b;
                            font-size:12px;
                            line-height:1.4;
                            border-left:1px solid #cfe0cc;
                            border-right:1px solid #cfe0cc;
                          "
                        >
                          <strong>Thoughtful</strong>
                          <br />
                          Made with care
                        </td>

                        <td
                          width="33%"
                          align="center"
                          style="
                            padding:18px 8px;
                            color:#31583b;
                            font-size:12px;
                            line-height:1.4;
                          "
                        >
                          <strong>Convenient</strong>
                          <br />
                          Pickup & delivery
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      background:#faf7f1;
                      border-top:1px solid #eee5da;
                      padding:26px 30px;
                      color:#7c8881;
                      font-family:Arial,sans-serif;
                      font-size:11px;
                      line-height:1.7;
                      text-align:center;
                    "
                  >
                    <div
                      style="
                        color:#153f32;
                        font-family:Georgia,'Times New Roman',serif;
                        font-size:18px;
                        font-weight:700;
                        margin-bottom:8px;
                      "
                    >
                      Port Petals
                    </div>

                    <div
                      style="
                        color:#53665d;
                      "
                    >
                      430 E Arnold Avenue
                      <br />
                      Port Allegany, PA 16743
                      <br />
                      814-642-1253
                    </div>

                    <div
                      style="
                        margin-top:16px;
                      "
                    >
                      You're receiving this promotional email because you
                      opted in to Port Petals email marketing.
                    </div>

                    <div
                      style="
                        margin-top:8px;
                      "
                    >
                      <a
                        href="${escapeEmailHtml(
                          unsubscribeUrl
                        )}"
                        style="
                          color:#7c8881;
                          text-decoration:underline;
                        "
                      >
                        Unsubscribe from promotional emails
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
