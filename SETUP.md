# xdipx — Setup Guide

Step-by-step instructions for connecting all services and deploying to production.

---

## Prerequisites

- Node.js 18+
- A GitHub account (for Vercel deployment)
- A Shopify Partner account → convert to Basic plan ($29/mo) at launch

---

## 1. Clone & Install

```bash
git clone https://github.com/YOUR_ORG/xdipx.git
cd xdipx
npm install
cp .env.example .env.local
```

---

## 2. Shopify Setup

### 2a. Create a Shopify store
1. Go to [partners.shopify.com](https://partners.shopify.com) → Stores → Add store → Development store
2. Once ready to launch, convert to Basic plan in Settings → Plan

### 2b. Get Storefront API token
1. Shopify Admin → Settings → Apps and sales channels → Develop apps
2. Create app → Configure Storefront API scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
3. Install the app → copy the **Storefront API access token**
4. Set `SHOPIFY_STOREFRONT_ACCESS_TOKEN` in `.env.local`

### 2c. Get Admin API token
1. Same app → Admin API → enable:
   - `read_products`, `write_products`
   - `read_inventory`, `write_inventory`
   - `read_orders`
2. Copy **Admin API access token** → `SHOPIFY_ADMIN_ACCESS_TOKEN`
3. Set `SHOPIFY_STORE_DOMAIN=yourstore.myshopify.com`

### 2d. Create Shopify Collections
In Shopify Admin → Products → Collections, create:
- `daily-deal` (manual)
- `for-him` (automated, tag = `for-him`)
- `for-her` (automated, tag = `for-her`)
- `accessories` (automated, tag = `accessories`)
- `bonus-deal` (manual)
- `vault` (automated, tag = `vault`)

### 2e. Create Custom Metafield Definitions
In Shopify Admin → Settings → Custom data → Products, add these metafields
(namespace: `xdipx`):

| Key | Type |
|-----|------|
| `is_daily_deal` | Boolean |
| `deal_date` | Date |
| `original_price` | Decimal number |
| `wholesale_cost` | Decimal number |
| `tagline` | Single-line text |
| `full_story` | Multi-line text |
| `works_for_him` | Multi-line text |
| `works_for_her` | Multi-line text |
| `feature_bullets` | JSON |
| `accessory_product_ids` | JSON |
| `mood_image_url` | URL |
| `category` | Single-line text |
| `deal_status` | Single-line text |
| `nalpac_sku` | Single-line text |
| `deal_score` | Decimal number |
| `map_price` | Decimal number |
| `seo_meta_description` | Multi-line text |

### 2f. Install Nalpac App
1. Install the **Nalpac** Shopify app from the Shopify App Store
2. Connect your Nalpac distributor account
3. Configure order routing to auto-fulfill via Nalpac

---

## 3. Anthropic (Claude API)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Set `ANTHROPIC_API_KEY=sk-ant-...` in `.env.local`

---

## 4. Google Cloud / Vertex AI (Imagen)

1. Create a Google Cloud project at [console.cloud.google.com](https://console.cloud.google.com)
2. Enable the **Vertex AI API**
3. Create a Service Account with role `Vertex AI User`
4. Download the JSON key file
5. Set `GOOGLE_CLOUD_PROJECT_ID=your-project-id`
6. For Vercel: copy the entire JSON key contents into env var `GOOGLE_APPLICATION_CREDENTIALS_JSON`

---

## 5. Klaviyo

1. Create a free account at [klaviyo.com](https://www.klaviyo.com)
2. Go to Settings → API Keys → Create a private key
3. Set `KLAVIYO_API_KEY=pk_...`
4. Create a List called "Daily Deal" → copy the List ID
5. Set `KLAVIYO_LIST_ID_DAILY_DEAL=your_list_id`

### Email Flows to create in Klaviyo:
- **Welcome Series** (trigger: List join) — 3 emails at Day 0, Day 2, Day 5
- **Daily Deal** (trigger: Metric "Daily Deal Live") — 1 email immediately
- **Back In Stock** (trigger: Metric "Back In Stock") — 1 email immediately
- **Abandoned Checkout** (trigger: Shopify) — 2 emails at 1hr, 24hr
- **Post-Purchase** (trigger: Shopify order placed) — 2 emails at 0hr, Day 7

---

## 6. Payment Processor

xdipx requires a **high-risk payment processor** (Stripe and PayPal do not allow adult content).

### Recommended: Segpay
1. Apply at [segpay.com](https://www.segpay.com) — approval takes 1-5 business days
2. Provide: business registration, site URL, product category, banking info
3. Once approved, get your `SEGPAY_MERCHANT_ID` and `SEGPAY_API_KEY`
4. Connect Segpay to Shopify via their payment gateway integration

### Alternative: Verotel
- Similar process at [verotel.com](https://www.verotel.com)

---

## 7. Admin Password

Set a strong password for the admin panel:
```
ADMIN_PASSWORD=your-secret-password-here
```

The admin panel lives at `/admin` and is password-protected via a cookie.

---

## 8. Other Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://xdipx.com
CRON_SECRET=generate-a-random-32-char-string-here
NALPAC_FEED_URL=https://productfeeds.wyomind.com/feeds/1s6o37vbh23/nal-top-100.csv
```

For `CRON_SECRET`, generate one with:
```bash
openssl rand -hex 32
```

---

## 9. Deploy to Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add **all environment variables** from `.env.local` in the Vercel dashboard
4. Deploy

### Verify the cron job
- In Vercel dashboard → Crons tab, you should see `/api/deal-scheduler` scheduled at `45 23 * * *` (11:45 PM UTC)
- Trigger it manually once to test: click "Run" in the dashboard

---

## 10. Connect Domain

1. In Vercel → Project Settings → Domains → Add `xdipx.com`
2. Update your DNS:
   - `A` record: `76.76.21.21`
   - `CNAME` record: `www` → `cname.vercel-dns.com`
3. SSL is provisioned automatically by Vercel

---

## 11. First Deal

1. Go to `https://xdipx.com/admin` → log in
2. Click **Run Deal Selector** to pull the first deal from the Nalpac feed
3. Go to **Today's Deal** → review and edit the AI-generated copy
4. Click **Approve Deal**
5. In Shopify Admin → Products → find the new draft product → change status to **Active** → add to the `daily-deal` collection

---

## 12. Pre-Launch Checklist

- [ ] Age gate tested on mobile (iOS + Android)
- [ ] Checkout flow tested end-to-end with a real test order
- [ ] Cron job triggered manually and deal staged successfully
- [ ] Email flows active in Klaviyo
- [ ] Billing descriptor confirmed with payment processor
- [ ] SSL active on xdipx.com
- [ ] Google Analytics 4 property created and tracking ID added (TODO: add GA4 script to layout.tsx)
- [ ] First 7 deals approved with mood images

---

## Local Development

```bash
npm run dev
```

The site runs at `http://localhost:3000`.

Without Shopify connected, all pages fall back to the seed data in `scripts/seed-data.ts` — the full UI is visible and interactive immediately.

---

## Support

Questions? hello@xdipx.com
