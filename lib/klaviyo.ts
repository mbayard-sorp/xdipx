const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY!;
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID_DAILY_DEAL!;
const BASE_URL = "https://a.klaviyo.com/api";

async function klaviyoFetch<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "PATCH" = "GET",
  body?: unknown
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      revision: "2024-02-15",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.text().catch(() => res.statusText);
    throw new Error(`Klaviyo API error ${res.status}: ${error}`);
  }

  if (res.status === 204) return {} as T;
  return res.json() as Promise<T>;
}

// ─── List subscription ────────────────────────────────────────────────────────

export async function subscribeToList(email: string, listId?: string): Promise<void> {
  const targetListId = listId ?? KLAVIYO_LIST_ID;

  await klaviyoFetch(
    `/profile-subscription-bulk-create-jobs/`,
    "POST",
    {
      data: {
        type: "profile-subscription-bulk-create-job",
        attributes: {
          profiles: {
            data: [
              {
                type: "profile",
                attributes: {
                  email,
                  subscriptions: {
                    email: { marketing: { consent: "SUBSCRIBED" } },
                  },
                },
              },
            ],
          },
        },
        relationships: {
          list: { data: { type: "list", id: targetListId } },
        },
      },
    }
  );
}

// ─── Back-in-stock waitlist ───────────────────────────────────────────────────

export async function addToWaitlist(
  email: string,
  productId: string,
  productHandle: string
): Promise<void> {
  // Create or update profile with back-in-stock property
  await klaviyoFetch(
    `/profiles/`,
    "POST",
    {
      data: {
        type: "profile",
        attributes: {
          email,
          properties: {
            waitlist_product_id: productId,
            waitlist_product_handle: productHandle,
            waitlist_signup_date: new Date().toISOString(),
          },
        },
      },
    }
  );
}

// ─── Event tracking ───────────────────────────────────────────────────────────

export async function trackEvent(
  event: string,
  email: string,
  properties: Record<string, unknown> = {}
): Promise<void> {
  await klaviyoFetch(
    `/events/`,
    "POST",
    {
      data: {
        type: "event",
        attributes: {
          metric: { data: { type: "metric", attributes: { name: event } } },
          profile: {
            data: {
              type: "profile",
              attributes: { email },
            },
          },
          properties,
          time: new Date().toISOString(),
        },
      },
    }
  );
}

// ─── Daily deal email trigger ─────────────────────────────────────────────────

export interface DailyDealEmailPayload {
  productName: string;
  tagline: string;
  dealPrice: number;
  originalPrice: number;
  discountPct: number;
  imageUrl: string;
  productUrl: string;
  emailSubjectLine: string;
}

export async function triggerDailyDealEmail(payload: DailyDealEmailPayload): Promise<void> {
  // Trigger via Klaviyo "Track" event which activates the Daily Deal flow
  await trackEvent("Daily Deal Live", "broadcast@xdipx.com", {
    ...payload,
    site_url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://xdipx.com",
  });
}
