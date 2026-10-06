# Port Petals

> Production ecommerce, customer-account, loyalty, marketing, and operations platform built and maintained by Cwlwm Systems for Port Petals.

## Overview

**Project:** `Port Petals`  
**Business Role:** `Client Production Ecommerce Platform`  
**Client / Business:** `Port Petals`  
**Business Contact:** `Stacy`  
**Status:** `Production / Active Development`  
**Repository:** `cwlwmsystems/port-petals`  
**Default Branch:** `main`  
**Production URL:** `https://www.portpetals.com`  
**Hosting:** `Vercel`  
**Primary Application:** `Next.js 16.3.7`  
**Database / Auth / Storage:** `Supabase`  
**Payments:** `Square hosted checkout`  
**Transactional Email:** `Resend`

Port Petals is a full ecommerce and customer-operations platform for a local floral, gift, apparel, wedding, event, and community-merchandise business. The project began as a customer-facing storefront and evolved into a broader operating system that supports catalog management, online ordering, Square payment collection, local fulfillment, customer accounts, wishlists, loyalty rewards, referrals, birthday rewards, marketing contacts and consent, wedding inquiries, customer relationship management, and administrative operations.

The application is designed around two major audiences:

1. **Port Petals customers**, who browse products, place pickup or local-delivery orders, create optional accounts, manage orders and profile information, save wishlist items, earn and redeem Petals, receive referral rewards, and access Birthday Bloom benefits.
2. **Port Petals staff**, primarily Stacy, who use the protected administrative interface to manage products, orders, customers, marketing contacts, campaigns, weddings, calendar activity, and customer account visibility.

Guest checkout remains supported. Creating a site account is not required to place an order, and creating an account does not automatically grant marketing consent.

---

## Purpose

Cwlwm Systems maintains Port Petals to provide the business with a dedicated, first-party ecommerce and operational platform rather than relying exclusively on a generic hosted storefront.

The platform is intended to:

- Present Port Petals products and services in a branded storefront.
- Support flowers, gifts, candles, apparel, Gator merchandise, seasonal products, occasions, custom requests, weddings, and events.
- Accept online orders for local pickup and approved local delivery.
- Send customers into Square-hosted checkout for payment.
- Treat Square webhook confirmation, not browser redirects, as the authoritative payment signal.
- Maintain an internal order history and operational workflow.
- Provide Stacy with protected administrative tools.
- Maintain a customer CRM with marketing consent and segmentation.
- Support registered customer accounts without eliminating guest checkout.
- Maintain a Petals loyalty ledger and reward catalog.
- Support customer referrals and earned discounts.
- Support Birthday Bloom using birthday month/day only.
- Track wishlists and customer engagement.
- Send customer and owner order notifications.
- Support wedding/event inquiry intake and administration.
- Provide a maintainable system whose source, configuration requirements, architecture, and operating procedures can be understood without undocumented institutional knowledge.

---

# Current Status

## Production

Port Petals is deployed and active at:

```text
https://www.portpetals.com
```

The production application is hosted by Vercel and is deployed from the `main` branch / current production source.

Recent production validation completed successfully on Next.js `16.3.7` with Turbopack, including TypeScript compilation and production route generation.

## Completed

### Storefront

- Branded Port Petals homepage and site shell.
- Responsive desktop and mobile navigation.
- Product/category browsing.
- Product-detail routes.
- Flowers.
- Candles.
- Gifts.
- Apparel.
- Shirts.
- Gator merchandise.
- Seasonal merchandise.
- Occasions.
- Custom offerings.
- Weddings and events.
- Cart.
- Checkout.
- Fulfillment information.
- Privacy page.
- Terms page.
- Sitemap and robots support.
- Journal/content sections.
- Seasonal homepage content.
- Featured products.
- "How to Order" content.
- "Why Port Petals" content.
- Quick-add behavior for products that do not require additional configuration.
- Product-detail routing where variants or customizations are required.
- Mobile sticky product call-to-action behavior.
- Add-to-cart feedback/toasts.
- Cart behavior intentionally avoids automatically opening the cart drawer after every add.

### Checkout

- Cart → Details → Payment → Confirmation progress indicator.
- Customer information collection.
- Pickup and local-delivery fulfillment selection.
- Requested fulfillment date handling.
- Product lead-time validation.
- Server-side price validation.
- Product availability validation.
- Variant validation.
- Inventory checks where inventory tracking is enabled.
- Local delivery fee calculation.
- Square-hosted payment checkout.
- Payment transition overlay.
- Order creation before payment.
- Payment-return page.
- Order status polling after Square redirects the customer back.
- Customer email prepopulation in Square checkout.
- Square payment-link identifiers stored on orders.
- Square checkout URL stored on orders.
- Idempotent Square checkout creation per order.
- Server-side total-integrity verification before a payment link is created.
- Marketing email/SMS selections remain opt-in and are not preselected.

### Square Payment Processing

- Sandbox and production Square environment support.
- Square hosted Payment Links API.
- Server-side access token usage.
- Square location support.
- Square webhook endpoint.
- HMAC-SHA256 webhook signature validation using the configured notification URL plus raw body.
- `payment.updated` webhook processing.
- Only `COMPLETED` Square payments are treated as paid.
- Payment return page does **not** mark an order paid.
- Database payment-completion RPC.
- Square order ID storage.
- Square payment-link ID storage.
- Square checkout URL storage.
- Square payment ID/event information used in payment completion.
- Order events record checkout and payment lifecycle activity.

### Order Management

- Order creation API.
- Order-number generation.
- Order items.
- Order events.
- Order notifications.
- Payment status tracking.
- Operational order status tracking.
- Paid, cancelled, refunded, and partial-refund states represented in admin workflows.
- Admin order list.
- Admin order detail.
- Admin order status actions.
- Cancellation protections.
- Completed/refunded state protections.
- Administrative reminder that cancelling an order does not itself issue a Square refund.
- Customer account order history.
- Customer account order detail.
- Guest checkout remains supported.

### Customer Accounts

- Supabase Auth.
- Account signup.
- Email confirmation.
- Login.
- Logout.
- Forgot-password flow.
- Password-reset flow.
- Auth callback.
- Safe `next` redirect behavior for account routes.
- Customer profile.
- Customer name.
- Customer phone.
- Birthday month/day.
- No unnecessary full birth date is required.
- Recent-order view.
- Full account order history.
- Wishlist.
- Rewards.
- Referral area.
- Shared account navigation.
- Responsive account portal redesign.
- Account link in the main site header.

### Customer Profile Creation

A customer profile is automatically created/backfilled around the authenticated customer account model so normal account features have a corresponding profile row.

Authentication remains separate from CRM classification and marketing consent.

### Wishlist

- `customer_wishlist_items` storage.
- Authenticated customer's own wishlist.
- Product wishlist controls.
- Wishlist page.
- Row Level Security for customer-owned wishlist access.
- Admin account visibility includes wishlist count.

### Petals Loyalty

Port Petals uses a first-party loyalty currency called **Petals**.

Implemented functionality includes:

- Ledger-based Petals accounting.
- Petals balance view.
- Earned Petals.
- Redeemed Petals.
- Bonus Petals.
- Adjustments.
- Reversals.
- Expiration transaction type.
- Reward catalog.
- Reward redemption records.
- Secure redemption RPC.
- Customer reward wallet.
- Petals activity history.
- Reward reservation during checkout.
- Reward finalization after payment.
- Reward release when an unpaid order is cancelled or deleted.
- Server-side validation of reward ownership and availability.
- Server-side validation of reward status and expiration.
- Loyalty UI in customer account.
- Admin read-only visibility into Petals balances and reward activity.

Petals earned from paid orders are based on eligible merchandise value after supported merchandise discounts. Delivery and tax do not generate Petals.

### Reward Catalog

The implemented catalog includes:

| Petals | Reward | Type |
|---:|---|---|
| 100 | A Little Something | Free gift |
| 250 | Petals Pick-Me-Up | Free gift |
| 500 | Petals Treat | Free gift |
| 750 | The Full Bloom | Free gift |
| 1000 | Free Local Delivery | Special perk |
| 1250 | $15 Off Your Order | Fixed discount |
| 1500 | 20% Off Merchandise | Percentage discount |
| 0 | Birthday Bloom | Birthday benefit / non-standard redemption |

The catalog is data-driven in `customer_rewards`.

### Petals Discount Rules

The checkout implements explicit stacking rules.

#### Merchandise discount slot

A normal Petals reward can occupy the generic reward slot.

Supported merchandise discounts include:

- `$15 Off Your Order`
- `20% Off Merchandise`

A Petals merchandise discount cannot stack with a referral merchandise discount.

#### Delivery reward slot

`Free Local Delivery` uses a separate delivery-reward slot.

This allows a customer to combine eligible free delivery with a compatible gift or merchandise reward.

The delivery perk:

- Requires an authenticated customer.
- Must be issued and available.
- Must belong to the customer.
- Must be active and redeemable.
- Must be the `Free Local Delivery` special perk.
- Requires a paid local-delivery fee.
- Removes the eligible delivery fee from the order.
- Preserves the original delivery fee for auditability.
- Stores the delivery reward amount, name, code, and redemption linkage.

### Referral Program

Implemented referral functionality includes:

- Permanent customer referral code.
- Referral landing route:

```text
/r/[code]
```

- Referral share UI.
- Referral tracking.
- First valid referral attribution wins.
- Self-referral protection.
- Referral qualification tracking.
- Referral reward issuance.
- 20% referral reward.
- Merchandise-only referral discount behavior.
- Referral reward reservation and lifecycle.
- Referral activity in customer account.
- Referral visibility in admin customer accounts.

Referral merchandise discounts cannot stack with a Petals merchandise discount.

A compatible Free Local Delivery reward may still coexist because delivery uses a separate reward slot.

### Birthday Bloom

Birthday Bloom is implemented as an account benefit using birthday **month and day only**.

Current behavior:

- Birthday information is optional.
- Birthday year is not required.
- Birthday Bloom can be issued during the customer's birthday month.
- A customer can receive the birthday reward once per calendar year.
- The reward is represented in the reward wallet.
- It has its own annual issuance protection.
- It expires after the birthday month.
- Birthday Bloom is issued lazily when the customer accesses the relevant rewards flow rather than through a daily global scheduler.
- Changing birthday data does not create a second reward for the same year.

Current architectural constraint:

Birthday Bloom shares the generic reward slot with normal generic gift/merchandise rewards. It therefore does not currently stack with another reward occupying that same slot.

A dedicated Birthday Bloom curated gift-selection page has been discussed but is intentionally deferred.

### Admin Customer Visibility

The admin customer experience has evolved into a unified customer model.

The system distinguishes:

- Registered site account holders.
- Customers who purchased through an account.
- Guest purchasers.
- CRM contacts.
- Prospects.

The primary customer directory includes account holders even when they have never ordered.

Current administrative routes include:

```text
/admin/customers
/admin/customers/[id]
/admin/customers/accounts
/admin/customers/accounts/[userId]
/admin/customers/crm
```

Admin account visibility includes:

- Account status.
- Account creation date.
- Name.
- Email.
- Phone.
- Birthday month/day.
- Petals balance.
- Reward wallet.
- Reserved rewards.
- Petals transaction history.
- Referral code.
- Referral activity.
- Wishlist count.
- Linked orders.
- Paid-order count.
- Lifetime value.
- CRM link where an email match exists.

The loyalty/account visibility layer is intentionally **read-only** at this stage. Direct manual Petals modification should not be added without an audited adjustment workflow.

### CRM and Marketing

The administrative CRM includes:

- `marketing_contacts`.
- Customers and prospects.
- Purchase counts.
- Lifetime value.
- First-order date.
- Last-order date.
- Source tracking.
- Email marketing consent.
- SMS marketing consent.
- Unsubscribe state.
- Consent event history.
- Interest tagging.
- Customer search.
- Contact-type filtering.
- Purchase segmentation.
- Email subscription filtering.
- SMS subscription filtering.
- Interest filtering.
- Segment exports.
- Email-eligible audience exports.
- SMS-eligible audience exports.
- Manual contact updates.
- Manual interest changes.
- Admin consent changes with audit-event recording.

Marketing consent remains independent of account creation.

A person creating an account does **not** automatically opt into marketing.

### Marketing Campaign Administration

Administrative marketing routes exist for:

```text
/admin/marketing
/admin/marketing/new
/admin/marketing/[id]
```

The project also includes:

- Marketing actions.
- Campaign send controls.
- Unsubscribe endpoint.
- Unsubscribe page.
- Marketing consent audit behavior.

### Weddings and Events

The public weddings experience includes:

- Wedding florals.
- Bridal bouquets.
- Wedding-party flowers.
- Ceremony florals.
- Reception florals.
- Wedding packages.
- Events and celebrations.
- Wedding/event planning process.
- Wedding inquiry form/API.
- Admin weddings list.
- Admin wedding detail.
- Admin wedding actions.
- Calendar-related wedding activity.
- Follow-up workflow support.

Wedding inquiry email handling uses the project's transactional email infrastructure.

### Products and Catalog Administration

Admin product functionality includes:

```text
/admin/products
/admin/products/new
/admin/products/[id]/edit
```

Implemented capabilities include product creation/editing and project support for:

- Product status.
- Slugs.
- Base price.
- Lead time.
- Inventory tracking.
- Quantity.
- Product images.
- Variants.
- Variant names.
- Garment type.
- Size.
- Color.
- Variant pricing.
- Variant inventory.
- Active/inactive variants.
- Product image storage through Supabase Storage.

### Product Categories / Public Commerce Routes

The application contains or has supported the following public commerce areas:

```text
/
/about
/flowers
/flowers/[slug]
/candles
/candles/[slug]
/gifts
/apparel
/shirts
/shirts/[slug]
/gators
/gators/[slug]
/seasonal
/occasions
/occasions/[slug]
/custom
/custom/[slug]
/custom/request
/weddings
/cart
/checkout
/payment/return
/fulfillment
```

Content/supporting routes include:

```text
/journal
/journal/flower-care
/journal/gift-guides
/journal/seasonal-ideas
/journal/shop-news
/privacy
/terms
/robots.txt
/sitemap.xml
/unsubscribe
```

### Seasonal Experience

The storefront includes a seasonal section designed to change with current seasons and holidays.

During Homecoming / Gator football season, the site can emphasize:

- Gator gear.
- Homecoming products/flowers.
- Relevant seasonal navigation and featured content.

### New-Customer Experience

A dismissible new-customer informational popup was implemented to explain that the online ordering portal is new.

The intent is informational and non-intrusive.

### Email Notifications

The project uses Resend for transactional email.

Current email-related functionality includes:

- Owner paid-order email.
- Customer paid-order email.
- Customer order-status email support.
- Wedding inquiry email handling.
- Abandoned-checkout related infrastructure.
- Port Petals sender/owner email configuration in application code where applicable.

### Abandoned Checkout Infrastructure

The application contains:

```text
/api/cron/abandoned-checkouts
```

This supports automated abandoned-checkout/order follow-up logic.

Cron/security configuration must remain server-side and must never expose any secret used to authorize a scheduled endpoint.

### Admin Dashboard / Operations

The protected admin system includes:

```text
/admin
/admin/calendar
/admin/customers
/admin/customers/[id]
/admin/customers/accounts
/admin/customers/accounts/[userId]
/admin/customers/crm
/admin/marketing
/admin/marketing/new
/admin/marketing/[id]
/admin/orders
/admin/orders/[id]
/admin/products
/admin/products/new
/admin/products/[id]/edit
/admin/weddings
/admin/weddings/[id]
```

Administrative authorization is backed by Supabase authentication plus the `admin_users` table.

Normal customer authentication is not sufficient to gain administrative access.

---

## In Progress

The platform is in production and continues to be enhanced.

Current areas suitable for continued work include:

- Additional admin operational tooling.
- More complete customer loyalty administration with audited adjustments.
- More comprehensive documentation under `docs/`.
- Continued end-to-end production QA as new features are introduced.
- Refinement of reward visibility and expiration presentation.
- Additional product/catalog content.
- Continued marketing workflow refinement.

---

## Deferred / Future Enhancements

The following have been discussed or intentionally deferred:

- Dedicated Birthday Bloom curated-gift selection page.
- Dedicated birthday reward order slot if Birthday Bloom needs to stack with another generic reward.
- Audited admin controls to grant/remove Petals.
- More formal reward-administration tools.
- Partial-refund Petals reconciliation beyond the current full-refund/reversal design.
- Additional loyalty/reporting analytics.
- More extensive automated testing.
- Potential migration away from Square-hosted checkout only if a future requirement justifies a custom embedded payment experience.

---

## Blocked / Waiting

No known blocker prevents the production application from operating.

Some third-party workflows depend on external service configuration remaining valid:

- Supabase.
- Square.
- Vercel.
- Resend.
- DNS/domain configuration.

---

# Technology Stack

| Area | Technology / Service |
|---|---|
| Application | Next.js 16.3.7, React, TypeScript |
| Application Model | Next.js App Router |
| Build System | Turbopack / Next.js production build |
| Runtime | Node.js |
| Package Manager | npm |
| Hosting | Vercel |
| Production Domain | `www.portpetals.com` |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Authorization | Supabase RLS + application/admin checks |
| Server Privileged DB Access | Supabase service-role client, server-only |
| Storage | Supabase Storage |
| Payments | Square hosted Payment Links / Online Checkout |
| Payment Confirmation | Square webhook |
| Transactional Email | Resend |
| Source Control | Git / GitHub |
| Repository Organization | `cwlwmsystems` |
| Styling | Tailwind CSS utility classes |
| Analytics | External analytics may be configured separately; do not document credentials here |

Only technologies that are part of the actual system should be added to this table.

---

# Repository

```text
git@github.com:cwlwmsystems/port-petals.git
```

Primary branch:

```text
main
```

Local Cwlwm development path:

```text
~/cwlwm/projects/port-petals
```

---

# Repository Structure

The exact repository evolves with the application. Important runtime areas include:

```text
port-petals/
├── README.md
├── CHANGELOG.md
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── next.config.ts
├── public/
├── src/
│   ├── app/
│   │   ├── account/
│   │   │   ├── auth/
│   │   │   ├── forgot-password/
│   │   │   ├── login/
│   │   │   ├── orders/
│   │   │   ├── profile/
│   │   │   ├── referrals/
│   │   │   ├── reset-password/
│   │   │   ├── rewards/
│   │   │   ├── signup/
│   │   │   └── wishlist/
│   │   ├── admin/
│   │   │   ├── calendar/
│   │   │   ├── customers/
│   │   │   │   ├── [id]/
│   │   │   │   ├── accounts/
│   │   │   │   └── crm/
│   │   │   ├── marketing/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   └── weddings/
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   ├── cron/
│   │   │   ├── marketing/
│   │   │   ├── orders/
│   │   │   ├── square/
│   │   │   └── wedding-inquiry/
│   │   ├── apparel/
│   │   ├── candles/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── custom/
│   │   ├── flowers/
│   │   ├── fulfillment/
│   │   ├── gators/
│   │   ├── gifts/
│   │   ├── journal/
│   │   ├── occasions/
│   │   ├── payment/
│   │   ├── seasonal/
│   │   ├── shirts/
│   │   ├── weddings/
│   │   ├── privacy/
│   │   └── terms/
│   ├── components/
│   │   ├── account/
│   │   └── admin/
│   ├── lib/
│   │   ├── email/
│   │   └── supabase/
│   └── proxy.ts
└── docs/
    ├── architecture/
    ├── database/
    ├── deployment/
    ├── operations/
    ├── troubleshooting/
    ├── decisions/
    ├── releases/
    ├── planning/
    └── history/
        └── implementation-guides/
```

The tree above documents the important conceptual structure. Use `find` or the editor's Explorer to inspect the authoritative current tree before changing documentation that depends on exact filenames.

---

# Local Development

## Prerequisites

- Git.
- Node.js.
- npm.
- Access to the Cwlwm Systems GitHub repository.
- Appropriate Supabase project access.
- Appropriate Square development credentials when testing checkout.
- Appropriate Resend credentials when testing email.
- Vercel CLI when performing CLI deployments.
- A local environment file containing required development configuration.

## Install

```bash
cd ~/cwlwm/projects/port-petals
npm install
```

## Configure

Create the local environment file from the repository's safe example:

```bash
cp .env.example .env.local
```

Populate `.env.local` with the appropriate **development or sandbox** values.

Never commit `.env.local`.

Never place production secret values in `.env.example`.

## Run

```bash
npm run dev
```

Typical local URL:

```text
http://localhost:3000
```

Use the URL displayed by Next.js as authoritative if the development server chooses another port.

---

# Validation

At minimum, validate a production build before committing or deploying significant changes:

```bash
rm -rf .next
npm run build
```

The build performs TypeScript validation as part of the project's current Next.js build process.

Where package scripts exist for linting or testing, run the repository-defined commands from `package.json`.

Do not invent or document a command as required unless it exists in the project.

Recommended pre-deployment checks include:

```bash
git status --short
git diff --stat
npm run build
```

For checkout/reward changes, also manually verify the affected end-to-end flows.

---

# Environment Variables

The following names are known to be used by the current application architecture.

Real values belong in ignored local environment files and Vercel project environment variables.

| Variable | Purpose | Required | Secret |
|---|---|---:|---:|
| `NEXT_PUBLIC_SITE_URL` | Canonical application origin used for redirects such as Square payment return | Production: Yes | No |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes | Generally public configuration |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase browser/server-session anon key | Yes | Public by Supabase design, but still review before disclosure |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged server-side Supabase access | Yes for privileged server operations | **Yes** |
| `SQUARE_ACCESS_TOKEN` | Square server API authorization | Yes for checkout | **Yes** |
| `SQUARE_LOCATION_ID` | Square location used when creating checkout orders | Yes for checkout | Treat as configuration |
| `SQUARE_ENVIRONMENT` | `sandbox` or `production` | Yes / defaults to sandbox in code | No |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | Verifies Square webhook signatures | Yes for payment confirmation | **Yes** |
| `SQUARE_WEBHOOK_NOTIFICATION_URL` | Exact webhook notification URL used in Square HMAC verification | Yes for webhook verification | No |
| `RESEND_API_KEY` | Sends transactional email | Yes for email | **Yes** |

If additional variables are introduced, update `.env.example` and this section in the same change.

Do not include actual values here.

---

# Deployment

**Hosting:** `Vercel`  
**Production Project:** `port-petals`  
**Production Branch:** `main`  
**Production URL:** `https://www.portpetals.com`  
**Repository:** `cwlwmsystems/port-petals`

## Standard Production Deployment

1. Verify the local working tree.
2. Run a clean production build.
3. Stage only intended files.
4. Review staged changes.
5. Commit.
6. Push to `main`.
7. Deploy through Vercel.
8. Verify the production alias.
9. Confirm the working tree is clean.

Example:

```bash
cd ~/cwlwm/projects/port-petals

rm -rf .next
npm run build

git status --short

git add <intended-files>
git diff --cached --stat

git commit -m "type: concise description"
git push

vercel --prod

git status --short
```

Do not use `git add .` casually when temporary, generated, or backup files may exist.

## Production Domain

Current production alias:

```text
https://www.portpetals.com
```

## Deployment Protection

Vercel Deployment Protection may be enabled for deployment URLs. The production custom domain and Vercel authentication behavior should be verified when troubleshooting direct deployment URLs.

## Rollback

Vercel retains prior deployments.

A rollback/redeployment decision should consider:

- Whether the database schema changed.
- Whether the deployed application expects new columns/functions.
- Whether a previous deployment is compatible with the current database.
- Whether external Square/Supabase configuration changed.

Never assume reverting application code alone safely reverts a database-dependent release.

Detailed deployment procedures should live in:

```text
docs/deployment/
```

---

# Architecture

## High-Level Architecture

```text
Customer Browser
      |
      v
Next.js / Vercel
      |
      +-------------------+
      |                   |
      v                   v
Supabase              Square
Postgres/Auth         Hosted Checkout
Storage               Payment Links
      ^                   |
      |                   |
      +---- Webhook <-----+
      |
      +---- Resend
             |
             v
      Transactional Email
```

### Storefront

The public Next.js application renders product collections, product pages, informational content, cart, checkout, account pages, and customer-facing order/reward experiences.

### Supabase

Supabase provides:

- PostgreSQL database.
- Supabase Auth.
- Row Level Security.
- Server-side database access.
- Service-role access for trusted server operations.
- Storage for product assets.

### Square

Square is responsible for collecting card/payment information through hosted Payment Links.

Port Petals does **not** mark an order paid merely because a customer returns from Square.

The Square webhook is the authoritative payment event.

### Resend

Resend sends transactional email such as paid-order confirmations and operational messages.

### Vercel

Vercel hosts the Next.js application and production environment variables.

---

# Checkout and Payment Architecture

## Order Creation

The application creates and validates the internal order before starting Square payment.

The server is responsible for validating:

- Product exists.
- Product is published.
- Requested quantity is valid.
- Variant belongs to the product.
- Variant is active.
- Inventory is sufficient where tracked.
- Pricing is authoritative.
- Lead-time requirements.
- Delivery selection.
- Rewards.
- Referral eligibility.
- Discount compatibility.
- Final order totals.

Client-provided prices are not the authority.

## Square Checkout Creation

The checkout route:

```text
/api/square/checkout
```

creates a Square-hosted payment link after loading the saved order from Supabase.

The route:

- Rejects missing orders.
- Rejects already-paid orders.
- Rejects cancelled/refunded orders.
- Builds Square line items from saved server data.
- Includes an eligible delivery line where applicable.
- Applies either an eligible referral merchandise discount or Petals merchandise discount.
- Checks the calculated Square total against the saved internal order total.
- Uses a stable idempotency key derived from the Port Petals order ID.
- Sets the payment return URL.
- Pre-populates customer email.
- Saves Square identifiers and checkout URL.

## Payment Confirmation

The Square webhook:

```text
/api/square/webhook
```

uses:

- Raw request body.
- Square signature header.
- `SQUARE_WEBHOOK_SIGNATURE_KEY`.
- Exact `SQUARE_WEBHOOK_NOTIFICATION_URL`.
- HMAC-SHA256.
- Timing-safe comparison.

Only the relevant completed-payment event proceeds to payment completion.

The webhook calls the database payment-completion RPC, providing Square payment identifiers.

The payment completion flow is designed to be idempotent.

## Return Page

```text
/payment/return
```

is a customer UX page.

It may check internal order status after returning from Square, but it does not independently assert that money was received.

---

# Fulfillment

Port Petals currently supports:

- Local pickup.
- Approved local delivery.

The application does not currently treat parcel shipping as a general fulfillment method.

Delivery pricing implemented in the checkout architecture has included:

- Pickup: `$0`.
- Very local delivery / within configured range: `$0`.
- 3–8 mile local delivery: `$10`.
- Smethport / Eldred delivery: `$15`.

The server remains the authority for delivery charges and should be updated if business rules change.

A Free Local Delivery reward can reduce an otherwise eligible paid local-delivery fee to `$0`.

---

# Database

**Database:** `Supabase PostgreSQL`

The database is the system of record for application orders, customer profiles, loyalty records, referrals, CRM/marketing data, admin access records, product data, and operational state.

## Core Commerce Tables

Known core tables include:

- `products`
- `product_variants`
- `product_images`
- `orders`
- `order_items`
- `order_events`
- `order_notifications`
- `admin_users`

## Customer Account Tables

- `customer_profiles`
- `customer_wishlist_items`

## Petals / Rewards Tables

- `customer_petals_transactions`
- `customer_rewards`
- `customer_reward_redemptions`

View:

- `customer_petals_balances`

## Referral Tables

- `customer_referral_profiles`
- `customer_referrals`
- `customer_referral_rewards`

## Marketing / CRM Tables

- `marketing_contacts`
- `marketing_contact_interests`
- `marketing_consent_events`

Additional marketing/campaign tables may exist and should be documented from the authoritative database schema when maintaining `docs/database/`.

## Weddings / Operations

Wedding/event and related operational tables exist behind the admin wedding/calendar functionality. Exact schema definitions should be maintained in database documentation/migrations rather than inferred from UI routes.

---

# Important Database Objects and Behavior

## `customer_petals_transactions`

Acts as the authoritative Petals ledger.

Transaction concepts include:

```text
earned
redeemed
bonus
adjustment
reversal
expired
```

The current balance is derived from transaction amounts rather than maintained only as an independently mutable number.

## `customer_petals_balances`

A view used to expose the customer's current ledger-derived Petals balance.

## `customer_rewards`

Reward catalog.

Important concepts include:

- Name.
- Description.
- Petals cost.
- Reward type.
- Discount value.
- Active state.
- Redeemable state.
- Sort order.
- Optional product linkage.

Reward types used by the system include:

```text
free_gift
percent_discount
fixed_discount
special_perk
custom
```

## `customer_reward_redemptions`

Tracks issued and consumed reward instances.

Important states include:

```text
requested
issued
reserved
redeemed
cancelled
expired
```

It stores reward/customer/order linkage, redemption code, Petals cost, lifecycle timestamps, expiration, metadata, and annual birthday-reward protection.

## Reward Redemption RPC

The database includes a secure reward redemption function:

```text
redeem_customer_reward(uuid)
```

The function is designed to:

- Require an authenticated user.
- Validate ownership.
- Validate reward availability.
- Use the authoritative ledger balance.
- Create a redemption.
- Deduct Petals.
- Issue a unique redemption code.
- Avoid trusting client-calculated balances.

## Birthday Bloom RPCs

Birthday Bloom uses database functions that include the issuance operation and an authenticated wrapper used by the customer-facing rewards page.

The current issuance pattern is lazy rather than a scheduled daily issuance process.

## Payment Completion RPC

Square webhook payment confirmation calls a database RPC used to finalize Square payment safely and idempotently.

Payment-related reward finalization occurs as part of the trusted payment lifecycle rather than browser-side logic.

---

# Order Reward Data Model

Orders support multiple reward/audit concepts.

## Generic Reward Slot

Fields include concepts such as:

- Reward redemption ID.
- Reward name.
- Reward code.
- Petals discount amount.
- Petals discount percentage.

## Delivery Reward Slot

Separate delivery reward fields include:

- Delivery reward redemption ID.
- Delivery reward name.
- Delivery reward code.
- Original delivery fee.
- Applied delivery reward amount.
- Effective delivery fee.

## Referral Reward Fields

Orders also preserve referral reward linkage and discount information.

The schema prevents or application logic rejects incompatible simultaneous merchandise discounts.

---

# Loyalty Lifecycle

## Earn

After a qualifying paid order:

1. Square confirms payment.
2. The internal payment-completion flow marks the order paid.
3. Eligible customer-linked orders generate Petals.
4. Petals are based on eligible merchandise after applicable merchandise discounts.
5. Delivery and tax are excluded from Petals earning.
6. The ledger records an earned transaction.

## Redeem

1. Customer chooses a redeemable reward.
2. Secure server/database logic verifies the balance.
3. A redemption is issued.
4. Required Petals are deducted.
5. A redemption code is assigned.
6. At checkout, the issued reward is reserved against an order.
7. Successful payment finalizes/redems it.
8. Unpaid cancellation/deletion releases the reservation.

## Refund / Reversal

Full-refund behavior includes Petals reversal support.

Partial-refund Petals reconciliation is intentionally not treated as fully solved and should be handled deliberately before relying on automated proportional loyalty adjustments.

---

# Authentication

Port Petals uses Supabase Auth.

Supported account flows include:

```text
/account/signup
/account/login
/account/auth/callback
/account/forgot-password
/account/reset-password
/account
```

Protected customer account routes include:

```text
/account
/account/orders
/account/orders/[id]
/account/profile
/account/rewards
/account/wishlist
/account/referrals
```

Admin routes are protected separately.

The application uses middleware/proxy matching for protected account/admin areas.

## Auth URL Configuration

Supabase authentication URL configuration must include the production site and valid callback/reset destinations.

Production account confirmation must not be configured to redirect to localhost.

When auth redirects behave incorrectly, check Supabase Authentication URL Configuration before changing application code.

---

# Authorization and RLS

Authentication and authorization are separate concerns.

The project uses:

- Supabase user identity.
- Row Level Security for customer-owned data.
- Admin membership checks through `admin_users`.
- Service-role access only on trusted server code.

Examples of customer-owned data protected through RLS include:

- Customer profile.
- Wishlist.
- Customer loyalty data where applicable.
- Customer-specific account data.

The service role must never be imported into browser/client components.

---

# Admin Security Model

An authenticated user is not automatically an administrator.

Protected admin code verifies:

1. A valid authenticated session.
2. A corresponding active `admin_users` row.
3. Only then performs protected admin operations.

Where service-role access is required for cross-customer visibility, the normal admin session is validated first and the privileged Supabase client is created only on the server.

This is especially important for the unified customer/account visibility screens because customer RLS must not be bypassed from the browser.

---

# Customer Model

Port Petals intentionally separates:

- Authentication.
- Customer account profile.
- Order identity.
- CRM classification.
- Marketing consent.

A unified admin UI may merge those concepts for visibility, but the underlying data remains separate.

## Registered Account

A person with a Supabase Auth user.

They are considered a meaningful Port Petals customer relationship even if they have never placed an order.

## Guest Customer

A person who placed an order without creating an account.

## CRM Contact

A record in `marketing_contacts`.

May be a customer or prospect.

## Marketing Subscriber

A CRM contact with explicit channel consent that has not been unsubscribed.

Creating a site account alone does not create marketing consent.

---

# Marketing Consent

Email and SMS consent are tracked independently.

Important behaviors:

- Consent must be explicit.
- Checkout marketing controls are opt-in.
- Unsubscribe state is preserved.
- Admin consent changes generate audit events.
- Source and timestamp information are retained where supported.
- Account creation does not equal email consent.
- Account creation does not equal SMS consent.

---

# Customer Account UX

The account area has a shared navigation model:

```text
Overview
Orders
Rewards
Wishlist
Referrals
Profile
```

## Overview

Displays customer summary information including recent orders, Petals/rewards, and shortcuts.

## Orders

Displays customer-linked order history.

## Rewards

Uses logical tabs for:

```text
Overview
Redeem
Wallet
Activity
```

## Wishlist

Displays saved products.

## Referrals

Displays referral code, referral program explanation, and activity.

## Profile

Allows management of supported customer profile data including birthday month/day.

---

# Admin Customer UX

## Unified Directory

```text
/admin/customers
```

Designed as the broad customer directory.

It may include:

- Registered accounts with zero orders.
- Registered accounts with orders.
- Guest order customers.
- CRM prospects.

Useful filters include:

- Search.
- Account status.
- Customer segment.
- No orders.
- First-time.
- Repeat.
- Prospect.

## Site Accounts

```text
/admin/customers/accounts
```

Focuses on registered customer accounts and loyalty/account data.

## Account Detail

```text
/admin/customers/accounts/[userId]
```

Provides read-only visibility into account/loyalty data.

## CRM

```text
/admin/customers/crm
```

Preserves the deeper marketing/contact management view.

## CRM Contact Detail

```text
/admin/customers/[id]
```

Includes:

- Contact information.
- Marketing consent.
- Interests.
- Order history.
- Customer actions.
- Consent history.

---

# Products

Product records are loaded server-side and validated again during order creation.

Relevant product concepts include:

- ID.
- Name.
- Slug.
- Base price.
- Publication status.
- Lead time.
- Inventory-tracking flag.
- Quantity.
- Product images.

## Variants

Relevant variant concepts include:

- Product linkage.
- Name.
- Garment type.
- Size.
- Color.
- Price.
- Inventory tracking.
- Quantity.
- Active state.

The order API rejects invalid or unavailable variants rather than trusting client state.

---

# Product Images / Storage

Product images are associated with products and stored through Supabase Storage.

Image metadata includes concepts such as:

- Storage path.
- Primary-image flag.
- Sort order.

Public URLs are generated through the Supabase Storage client when rendering catalog content.

---

# Order Status and Payment Status

Operational order status and payment status are separate.

This separation matters because:

- An order may exist before it is paid.
- Payment is confirmed by Square.
- Operational fulfillment may continue after payment.
- Cancelling a Port Petals order does not inherently refund a Square payment.
- Refund operations must be treated deliberately.

Do not collapse these states into one field.

---

# Email

Transactional email uses:

```text
src/lib/email/resend.ts
src/lib/email/order-notifications.ts
```

The Resend API key is server-only.

Email responsibilities include customer notifications and owner notifications associated with order lifecycle events.

Do not hard-code credentials into email code.

---

# SEO / Discoverability

The application contains:

- Route-specific metadata.
- Canonical support on relevant pages.
- Open Graph metadata where implemented.
- `sitemap.xml`.
- `robots.txt`.
- Content sections/journal pages.
- Category/product routes that can be indexed appropriately.

External search/analytics configuration may be maintained outside the repository and should be referenced, not duplicated with credentials.

---

# Operations

Operational procedures belong under:

```text
docs/operations/
```

Recommended operational documentation includes:

- Reviewing new paid orders.
- Updating order status.
- Managing products and variants.
- Uploading/reordering product images.
- Reviewing customer accounts.
- Viewing Petals/reward status.
- Managing CRM contacts.
- Updating marketing consent only when authorized.
- Sending marketing campaigns.
- Handling wedding inquiries.
- Reviewing calendar/follow-up items.
- Handling cancellation.
- Handling Square refund separately where needed.
- Verifying failed email delivery.
- Verifying webhook/payment incidents.
- Reviewing abandoned-checkout automation.

---

# Production Verification

After a meaningful release, verify at minimum:

## Storefront

- Homepage loads.
- Navigation works.
- Product category pages load.
- Product detail page loads.
- Product images resolve.
- Add-to-cart works.
- Cart reflects quantity/variant correctly.

## Checkout

- Checkout form loads.
- Pickup can be selected.
- Delivery can be selected where supported.
- Delivery pricing is correct.
- Lead-time rules behave correctly.
- Server rejects unavailable products/variants.
- Square checkout opens.
- Return page works.

## Accounts

- Signup.
- Confirmation email.
- Production auth callback.
- Login.
- Forgot password.
- Reset password.
- Account overview.
- Profile.
- Orders.
- Wishlist.
- Rewards.
- Referrals.

## Petals

- Balance reflects ledger.
- Reward catalog loads.
- Redemption requires sufficient balance.
- Reward cannot be reused.
- Reserved reward attaches to order.
- Cancelled unpaid order releases reward.
- Paid order finalizes reward.
- Referral merchandise discount cannot stack with Petals merchandise discount.
- Free Local Delivery uses the delivery slot.
- Birthday Bloom annual restriction remains enforced.

## Payments

- Square webhook validates.
- Non-completed event does not mark paid.
- Completed payment marks paid.
- Duplicate webhook does not duplicate business effects.
- Customer/owner notifications do not cause payment failure if secondary notification logic encounters a recoverable problem.

## Admin

- Admin login.
- Unauthorized customer cannot access admin.
- Orders.
- Products.
- Customers.
- Site accounts.
- CRM.
- Marketing.
- Weddings.
- Calendar.

---

# Troubleshooting

Detailed procedures belong under:

```text
docs/troubleshooting/
```

## Supabase confirmation redirects to localhost

### Symptom

Production confirmation email opens a localhost URL.

### Cause

Supabase Authentication URL Configuration is using an incorrect Site URL / redirect allowlist.

### Resolution

Verify production Site URL and production callback/reset URLs in Supabase Authentication configuration.

The application builds account callback URLs from the active browser origin.

Do not immediately hard-code the production host into the signup form.

---

## Order returned from Square but still shows unpaid

### Important

The return page is not the authority.

Check:

1. Square payment status.
2. Square webhook delivery.
3. Webhook signature configuration.
4. Exact webhook notification URL.
5. `payment.updated` event.
6. `COMPLETED` status.
7. Payment-completion RPC result.
8. Internal order/payment status.

Do not manually treat a return redirect as proof of payment.

---

## Square webhook signature failure

Verify:

```text
SQUARE_WEBHOOK_SIGNATURE_KEY
SQUARE_WEBHOOK_NOTIFICATION_URL
```

The notification URL used in verification must exactly match the URL configured for the Square webhook.

The signature is calculated from:

```text
notification URL + raw request body
```

Do not parse/re-stringify the body before signature verification.

---

## Square total mismatch

The Square checkout route intentionally refuses to create a checkout when its calculated line-item/discount total does not match the saved internal order total.

Investigate:

- Saved subtotal.
- Delivery fee.
- Referral discount.
- Petals discount.
- Line-item quantities.
- Reward stack.
- Total rounding.

Do not bypass the total-integrity check.

---

## Customer reward says unavailable

Check:

- Correct customer.
- Redemption status.
- `order_id`.
- Expiration.
- Reward active state.
- Reward `redeemable`.
- Reward category.
- Whether it is already reserved/redeemed.
- Whether another incompatible merchandise discount is being used.

---

## Admin customer/account appears duplicated

The unified admin model merges data from separate systems.

Review normalized email across:

- Supabase Auth user.
- `customer_profiles`.
- `marketing_contacts`.
- Orders.

Do not automatically merge unrelated people solely because of a weak/non-email match.

---

# Security

## General

- Never commit populated `.env` files.
- Never commit passwords.
- Never commit API keys.
- Never commit Supabase service-role keys.
- Never commit Square access tokens.
- Never commit webhook signature keys.
- Never commit Resend API keys.
- Never commit recovery codes.
- Never commit SSH private keys.
- Keep production secrets in Vercel/environment-provider secret storage.
- Keep local secrets only in ignored environment files.
- Review `.env.example` before committing.

## Supabase

- Keep the service-role key server-only.
- Use RLS for customer-owned data.
- Validate admin authorization server-side.
- Never treat a hidden UI control as authorization.
- Review `SECURITY DEFINER` functions carefully.
- Validate `auth.uid()` where appropriate.
- Keep privileged admin/customer cross-account reads on trusted server paths.

## Payments

- Do not accept client-calculated prices as authoritative.
- Do not accept a browser redirect as payment confirmation.
- Verify Square webhook HMAC.
- Use idempotency where supported.
- Preserve payment identifiers for audit/troubleshooting.

## Marketing

- Do not infer marketing consent from account creation.
- Preserve opt-out state.
- Audit manual admin consent changes.
- Do not preselect marketing checkboxes.

## Customer Data

- Collect only data needed for operations/features.
- Birthday Bloom requires month/day only; do not expand to full birth date without a justified business requirement.
- Avoid exposing customer account data to other customers.
- Use service-role access only after trusted admin verification.

---

# Backup and Recovery

| Component | Authoritative / Recovery Location | Responsibility |
|---|---|---|
| Source Code | GitHub `cwlwmsystems/port-petals` | Cwlwm Systems |
| Production Deployment | Vercel project `port-petals` and deployment history | Cwlwm Systems |
| Production Database | Supabase project / provider backup and database procedures | Cwlwm Systems / Port Petals according to service ownership |
| Authentication | Supabase Auth | Cwlwm Systems / Port Petals according to service ownership |
| Product Storage | Supabase Storage | Cwlwm Systems / Port Petals according to service ownership |
| Payments | Square merchant account and Square records | Port Petals |
| Email Delivery | Resend account and application logs | Cwlwm Systems / Port Petals according to service ownership |
| Business Documentation | Cwlwm Systems Google Drive project records | Cwlwm Systems |
| Credentials | Approved credential/password system | Appropriate account owner |

Source control does not back up:

- Supabase production rows.
- Supabase Auth user records.
- Supabase Storage assets.
- Square account configuration.
- Square payment history.
- Vercel project environment variables.
- DNS configuration.
- Resend configuration.

Each must have an independent recovery/account-access plan.

---

# Database Backup / Recovery

Database documentation should identify:

- Supabase project ownership.
- Schema migration history.
- Backup capability of the active Supabase plan.
- Export procedure where required.
- Recovery testing.
- Expected RPO/RTO if the business requires formal targets.
- Which production data must never be copied casually into development.
- Test-data cleanup procedure.
- How to distinguish test accounts/orders from real customer data.

Do not rely on Git to recover live database contents.

---

# Data Retention

Retention rules should be documented deliberately for:

- Orders.
- Payment identifiers.
- Customer profiles.
- Marketing consent history.
- Unsubscribe records.
- Loyalty ledger.
- Reward redemptions.
- Referral records.
- Wedding inquiries.
- Email/notification logs.

Consent/unsubscribe audit information should not be casually removed merely to simplify the CRM.

---

# Documentation Map

| Topic | Location |
|---|---|
| Project Overview | `README.md` |
| Change History | `CHANGELOG.md` |
| Environment Variable Reference | `.env.example` |
| Architecture | `docs/architecture/` |
| Database | `docs/database/` |
| Deployment | `docs/deployment/` |
| Operations | `docs/operations/` |
| Troubleshooting | `docs/troubleshooting/` |
| Decisions | `docs/decisions/` |
| Releases | `docs/releases/` |
| Planning | `docs/planning/` |
| Historical Material | `docs/history/` |
| Historical Implementation Guides | `docs/history/implementation-guides/` |

---

# Recommended Documentation Files

As the project matures, the following files would provide a strong permanent operational record:

```text
docs/
├── architecture/
│   ├── application-architecture.md
│   ├── checkout-payment-flow.md
│   ├── customer-account-architecture.md
│   └── rewards-referrals-architecture.md
├── database/
│   ├── schema-overview.md
│   ├── rls-policies.md
│   ├── functions-and-triggers.md
│   ├── rewards-schema.md
│   └── crm-schema.md
├── deployment/
│   ├── production-deployment.md
│   ├── environment-configuration.md
│   └── rollback-recovery.md
├── operations/
│   ├── order-operations.md
│   ├── customer-crm.md
│   ├── rewards-operations.md
│   ├── product-management.md
│   ├── marketing-operations.md
│   └── wedding-operations.md
├── troubleshooting/
│   ├── square-payments.md
│   ├── supabase-auth.md
│   ├── customer-rewards.md
│   └── email-delivery.md
├── decisions/
│   ├── square-hosted-checkout.md
│   ├── webhook-payment-authority.md
│   ├── guest-checkout.md
│   ├── ledger-based-petals.md
│   └── separate-marketing-consent.md
├── releases/
├── planning/
└── history/
    └── implementation-guides/
```

These files should be created when populated with useful content, not merely to create empty structure.

---

# Significant Architecture Decisions

## Square-hosted checkout

**Decision:** Use Square hosted checkout rather than directly handling payment card fields in the Port Petals app.

**Rationale:**

- Reduces direct payment-card handling.
- Keeps payment collection within Square.
- Simplifies initial payment implementation.
- Reuses the merchant's Square ecosystem.

**Consequence:**

Square controls much of the hosted payment-page shell and styling. Branding customization is more limited than a fully embedded payment form.

---

## Square webhook is payment authority

**Decision:** The payment-return page never marks an order paid.

**Rationale:**

Browser navigation can be interrupted, replayed, manipulated, or closed. The server-to-server Square event is the correct payment authority.

---

## Guest checkout remains supported

**Decision:** Do not require account creation to purchase.

**Rationale:**

Reduces checkout friction and preserves accessibility for one-time customers.

**Consequence:**

The system must distinguish guest purchasers from registered account customers.

---

## Authentication is separate from CRM

**Decision:** A Supabase Auth user is not automatically equivalent to a marketing contact classification.

**Rationale:**

Authentication, customer identity, CRM classification, and marketing consent have different semantics and security/legal implications.

---

## Marketing consent is explicit

**Decision:** Account creation and checkout do not silently opt customers into marketing.

**Rationale:**

Channel consent must remain explicit and auditable.

---

## Petals uses a ledger

**Decision:** Treat `customer_petals_transactions` as the authoritative history rather than relying only on a mutable balance field.

**Rationale:**

A ledger provides traceability for earned, redeemed, reversed, bonus, and adjustment activity.

---

## Reward reservation lifecycle

**Decision:** Issued rewards become reserved against an unpaid order and are finalized only after payment.

**Rationale:**

Prevents a reward from being used simultaneously in multiple in-progress orders while allowing recovery if checkout is abandoned/cancelled.

---

## Separate delivery reward slot

**Decision:** Free Local Delivery does not consume the normal generic merchandise/gift reward slot.

**Rationale:**

Allows a delivery perk to coexist with an eligible reward affecting merchandise.

---

## Server calculates pricing

**Decision:** Server-side code loads current product/variant data and computes order pricing.

**Rationale:**

The browser is not a trusted pricing authority.

---

# Implementation History

The following summarizes the major evolution of the project.

## Phase 1 — Storefront Foundation

The project began as a branded Next.js storefront for Port Petals with:

- Core layout and brand styling.
- Homepage.
- Product categories.
- Product pages.
- Responsive navigation.
- Informational content.
- Cart foundation.
- Local floral/gift/apparel positioning.

## Phase 2 — Product and Catalog System

The storefront evolved into a database-backed catalog with:

- Products.
- Product images.
- Product variants.
- Pricing.
- Inventory concepts.
- Lead times.
- Product publishing.
- Category-specific product presentation.
- Admin product management.

## Phase 3 — Cart, Checkout, and Fulfillment

Commerce workflows were expanded with:

- Cart.
- Customer checkout details.
- Pickup.
- Local delivery.
- Delivery charges.
- Requested dates.
- Product lead-time enforcement.
- Server-side order validation.
- Order records/items/events.

## Phase 4 — Square Payment Integration

Square was introduced for hosted payment collection.

Implemented:

- Payment Links API.
- Square order mapping.
- Payment return page.
- Square identifiers on internal orders.
- Total verification.
- Webhook signature validation.
- Completed-payment authority.
- Idempotent completion.

## Phase 5 — Order Administration and Notifications

Operational functionality expanded to include:

- Admin order list/detail.
- Status management.
- Order lifecycle restrictions.
- Transactional email.
- Customer payment confirmation.
- Owner notifications.
- Status notifications.
- Abandoned-checkout infrastructure.

## Phase 6 — CRM and Marketing

The application expanded beyond ecommerce into customer operations:

- Marketing contacts.
- Customer/prospect distinction.
- Purchase statistics.
- Lifetime value.
- Marketing interests.
- Email consent.
- SMS consent.
- Consent audit events.
- Segmentation.
- Export.
- Marketing campaigns.
- Unsubscribe flows.

## Phase 7 — Weddings and Events

Wedding and event workflows were added:

- Public weddings page.
- Wedding/event product content.
- Inquiry form.
- Inquiry API.
- Admin wedding management.
- Calendar/follow-up support.

## Phase 8 — Customer Accounts

Supabase Auth customer accounts were added without removing guest checkout:

- Signup.
- Confirmation.
- Login.
- Reset password.
- Profile.
- Account overview.
- Order history.
- Account navigation.
- Header account access.

## Phase 9 — Wishlist and Customer Engagement

Wishlist functionality was added as authenticated customer-owned data with RLS and account UI.

## Phase 10 — Petals Loyalty

A first-party loyalty system was designed around:

- Petals ledger.
- Balance view.
- Reward catalog.
- Secure redemption.
- Reward wallet.
- Checkout reservation.
- Payment finalization.
- Reversal/release behavior.

## Phase 11 — Referrals

The customer account ecosystem expanded with:

- Referral code.
- Referral links.
- Referral tracking.
- Qualification.
- 20% reward.
- Checkout discount integration.
- Anti-self-referral and first-attribution rules.

## Phase 12 — Advanced Petals Checkout Rewards

Checkout reward support was expanded to include:

- Free Local Delivery.
- `$15 Off Your Order`.
- `20% Off Merchandise`.
- Separate delivery reward slot.
- Merchandise discount incompatibility rules.
- Square discount transfer.
- Order audit fields.
- Reward-aware checkout UI.

A production checkpoint for this work was committed as:

```text
9f3b2ee feat: complete Petals checkout rewards
```

## Phase 13 — Birthday Bloom

Birthday month/day profile support evolved into Birthday Bloom:

- Annual issuance.
- Birthday-month qualification.
- Expiration.
- Wallet visibility.
- Once-per-year protection.
- No need to store birth year.

## Phase 14 — Customer Account Portal Redesign

The customer account UI was redesigned as a cohesive portal with:

- Shared navigation.
- Overview.
- Orders.
- Rewards.
- Wishlist.
- Referrals.
- Profile.
- Improved responsive layout.

## Phase 15 — Admin Account / Loyalty Visibility

Stacy's admin customer experience was expanded to show registered accounts and loyalty data.

A unified customer directory was introduced so "customer" no longer means only "someone who already placed an order."

The system can now represent:

- Account created, zero orders.
- Account plus orders.
- Guest orders.
- CRM prospects.

The customer-account administration checkpoint was committed as:

```text
ec45dfa feat: add unified customer account visibility
```

---

# Recent Production Checkpoints

```text
ec45dfa  feat: add unified customer account visibility
9f3b2ee  feat: complete Petals checkout rewards
```

These commits represent the unified admin customer/account visibility and completed Petals checkout reward work.

---

# Development Workflow

## Start work

```bash
cd ~/cwlwm/projects/port-petals
git status
git pull
```

## Develop

```bash
npm run dev
```

## Validate

```bash
rm -rf .next
npm run build
```

## Review

```bash
git status --short
git diff
```

## Stage deliberately

```bash
git add <files>
git diff --cached --stat
```

## Commit

```bash
git commit -m "type: concise description"
```

## Push

```bash
git push
```

## Deploy

```bash
vercel --prod
```

## Confirm clean repository

```bash
git status --short
```

A clean result prints nothing.

---

# Temporary Backup Files

During major edits, temporary files using patterns such as:

```text
*.before-*
```

have been used as short-lived safety copies.

These files are not permanent project artifacts and should not be committed.

Once the replacement code is validated, committed, pushed, and recoverable through Git, remove obsolete temporary backup files.

Git history is the long-term source-code recovery mechanism.

---

# Testing Strategy

The project currently relies heavily on:

- Production builds.
- TypeScript compilation.
- Focused manual QA.
- Supabase SQL verification.
- Role/RLS testing.
- End-to-end checkout verification.
- Sandbox Square testing during payment development.
- Production validation after release.

Future development should add automated tests where they provide practical protection, especially around:

- Pricing.
- Reward stacking.
- Referral qualification.
- Payment finalization.
- Idempotency.
- RLS-sensitive operations.
- Order/reward cancellation behavior.

---

# Known Limitations / Technical Debt

## Partial refund loyalty behavior

Full reversal behavior exists, but partial refunds need a deliberate loyalty policy before automated proportional Petals reversal should be considered authoritative.

## Birthday Bloom slot

Birthday Bloom currently shares the generic reward slot.

If the business wants Birthday Bloom plus another generic Petals reward on the same order, a dedicated birthday slot/model would be required.

## Birthday issuance schedule

Birthday Bloom issuance is currently lazy through the customer's reward experience rather than a global daily job.

## Expired wallet presentation

Expiration is enforced when using rewards. Additional cleanup/presentation logic may be useful to ensure old issued rows are displayed exactly as desired after expiration.

## Admin loyalty changes

Admin visibility exists, but direct Petals/reward editing should remain disabled until there is a fully audited adjustment system.

## Square branding

The hosted Square payment page is intentionally controlled by Square and therefore cannot match every visual detail of the Port Petals site.

A substantially more custom payment UI would require a different Square integration architecture.

---

# Change Management

When changing any of the following, update documentation in the same work:

- Production URL.
- GitHub repository.
- Hosting provider.
- Supabase project.
- Square integration.
- Payment webhook URL.
- Authentication redirect architecture.
- Reward rules.
- Referral rules.
- Fulfillment pricing.
- Admin authorization.
- Environment variable names.
- Database migrations.
- Third-party service ownership.

---

# Related Cwlwm Records

| Record | Reference |
|---|---|
| Project Registry | `Cwlwm Systems → 07 Technology → Project Registry` |
| Technology Registry | `Cwlwm Systems → 07 Technology → Technology Registry` |
| Business Documentation | Cwlwm Systems Google Drive project/client records |
| Source Code | GitHub `cwlwmsystems/port-petals` |
| Production Application | Vercel `port-petals` |

Google Drive explains how Cwlwm operates and retains company/client records. This repository explains how the Port Petals software system works.

---

# Ownership and Maintenance

**Business:** Port Petals  
**Business Owner / Primary Client Contact:** Stacy  
**Software / Technical Stewardship:** Cwlwm Systems  
**Repository Owner:** Cwlwm Systems GitHub organization  
**Maintenance Status:** Active  
**Production Status:** Production

If ownership, hosting, database, domain, or production status changes, update:

1. This README.
2. Cwlwm Systems Project Registry.
3. Cwlwm Systems Technology Registry where applicable.
4. Relevant deployment/operations documentation.

---

# License

```text
Private / Proprietary
```

This repository is not intended to be treated as open-source software unless Port Petals and Cwlwm Systems explicitly approve an appropriate release and license.

Do not add an open-source license by default.

---

# Documentation Principle

A production Cwlwm Systems project should be understandable, operable, recoverable, and maintainable without depending on undocumented knowledge.

For Port Petals this means:

- Keep the README accurate.
- Keep operational instructions versioned.
- Record significant architecture decisions.
- Document the database rather than relying on memory.
- Preserve meaningful implementation history separately from current procedures.
- Keep credentials and customer secrets out of source control.
- Keep production payment authority on trusted server boundaries.
- Keep marketing consent explicit.
- Keep customer authorization enforced by trusted server/database controls.
- Keep GitHub, Vercel, Supabase, Square, and Resend responsibilities clearly separated.
- Validate before deployment.
- Keep the repository clean after releases.

The authoritative system is the combination of version-controlled source, documented external configuration, database state/migrations, and provider-managed production services—not any one of those components in isolation.
