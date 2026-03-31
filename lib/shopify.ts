import {
  ShopifyProduct,
  ShopifyCart,
  XdipxMetafields,
  DailyDeal,
} from "@/types";

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;

const STOREFRONT_API = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;
const ADMIN_API = `https://${SHOPIFY_DOMAIN}/admin/api/2024-01`;

// ─── Storefront API ───────────────────────────────────────────────────────────

async function storefrontFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(STOREFRONT_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Shopify Storefront API error: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message ?? "Shopify query error");
  return json.data as T;
}

// ─── Admin API ────────────────────────────────────────────────────────────────

export async function shopifyAdminFetch<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown
): Promise<T> {
  const res = await fetch(`${ADMIN_API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) throw new Error(`Shopify Admin API error: ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

// ─── Metafield resolver ───────────────────────────────────────────────────────

function resolveMetafields(metafields: Array<{ key: string; value: string }> = []): XdipxMetafields {
  const get = (key: string) => metafields.find((m) => m.key === key)?.value ?? null;

  const bulletsRaw = get("feature_bullets");
  const accessoryRaw = get("accessory_product_ids") ?? get("accessory_skus");

  return {
    isDailyDeal: get("is_daily_deal") === "true",
    dealDate: get("deal_date"),
    originalPrice: get("original_price") ? parseFloat(get("original_price")!) : null,
    tagline: get("tagline"),
    fullStory: get("full_story"),
    worksForHim: get("works_for_him"),
    worksForHer: get("works_for_her"),
    featureBullets: bulletsRaw ? tryParse<string[]>(bulletsRaw, []) : [],
    accessoryProductIds: accessoryRaw ? tryParse<string[]>(accessoryRaw, []) : [],
    moodImageUrl: get("mood_image_url"),
    category: (get("category") as XdipxMetafields["category"]) ?? null,
    dealStatus: (get("deal_status") as XdipxMetafields["dealStatus"]) ?? null,
    dealScore: get("deal_score") ? parseFloat(get("deal_score")!) : null,
    nalpacSku: get("nalpac_sku"),
    mapPrice: get("map_price") ? parseFloat(get("map_price")!) : null,
    wholesaleCost: get("wholesale_cost") ? parseFloat(get("wholesale_cost")!) : null,
  };
}

function tryParse<T>(str: string, fallback: T): T {
  try { return JSON.parse(str); }
  catch { return fallback; }
}

// ─── Fragments ────────────────────────────────────────────────────────────────

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    featuredImage { url altText width height }
    images(first: 10) {
      nodes { url altText width height }
    }
    variants(first: 5) {
      nodes {
        id title sku availableForSale quantityAvailable
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
      }
    }
    metafields(identifiers: [
      { namespace: "xdipx", key: "is_daily_deal" }
      { namespace: "xdipx", key: "deal_date" }
      { namespace: "xdipx", key: "original_price" }
      { namespace: "xdipx", key: "tagline" }
      { namespace: "xdipx", key: "full_story" }
      { namespace: "xdipx", key: "works_for_him" }
      { namespace: "xdipx", key: "works_for_her" }
      { namespace: "xdipx", key: "feature_bullets" }
      { namespace: "xdipx", key: "accessory_product_ids" }
      { namespace: "xdipx", key: "mood_image_url" }
      { namespace: "xdipx", key: "category" }
      { namespace: "xdipx", key: "deal_status" }
      { namespace: "xdipx", key: "deal_score" }
      { namespace: "xdipx", key: "nalpac_sku" }
      { namespace: "xdipx", key: "map_price" }
      { namespace: "xdipx", key: "wholesale_cost" }
    ]) {
      key value type
    }
  }
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getDailyDeal(): Promise<DailyDeal | null> {
  const data = await storefrontFetch<{
    collection: { products: { nodes: ShopifyProduct[] } } | null;
  }>(
    `query GetDailyDeal {
      collection(handle: "daily-deal") {
        products(first: 1) {
          nodes { ...ProductFields }
        }
      }
    }
    ${PRODUCT_FRAGMENT}`
  );

  const product = data.collection?.products.nodes[0];
  if (!product) return null;

  const xdipx = resolveMetafields(product.metafields as Array<{ key: string; value: string }>);
  const variant = product.variants.nodes[0];
  const dealPrice = parseFloat(variant?.price.amount ?? "0");
  const originalPrice = xdipx.originalPrice ?? parseFloat(variant?.compareAtPrice?.amount ?? "0");
  const savingsAmount = originalPrice - dealPrice;
  const discountPct = originalPrice > 0 ? Math.round((savingsAmount / originalPrice) * 100) : 0;

  return {
    product: { ...product, xdipx },
    dealPrice,
    originalPrice,
    discountPct,
    savingsAmount,
    tagline: xdipx.tagline ?? "",
    fullStory: xdipx.fullStory ?? product.description,
    worksForHim: xdipx.worksForHim ?? "",
    worksForHer: xdipx.worksForHer ?? "",
    featureBullets: xdipx.featureBullets,
    accessories: [],
    moodImageUrl: xdipx.moodImageUrl,
    stockCount: variant?.quantityAvailable ?? 0,
    category: xdipx.category,
  };
}

export async function getProductsByCollection(
  handle: string,
  first = 12
): Promise<ShopifyProduct[]> {
  const data = await storefrontFetch<{
    collection: { products: { nodes: ShopifyProduct[] } } | null;
  }>(
    `query GetCollection($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        products(first: $first) {
          nodes { ...ProductFields }
        }
      }
    }
    ${PRODUCT_FRAGMENT}`,
    { handle, first }
  );

  return (data.collection?.products.nodes ?? []).map((p) => ({
    ...p,
    xdipx: resolveMetafields(p.metafields as Array<{ key: string; value: string }>),
  }));
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await storefrontFetch<{ product: ShopifyProduct | null }>(
    `query GetProduct($handle: String!) {
      product(handle: $handle) { ...ProductFields }
    }
    ${PRODUCT_FRAGMENT}`,
    { handle }
  );

  if (!data.product) return null;
  return {
    ...data.product,
    xdipx: resolveMetafields(data.product.metafields as Array<{ key: string; value: string }>),
  };
}

export async function getProductsByTag(tag: string, first = 12): Promise<ShopifyProduct[]> {
  const data = await storefrontFetch<{
    products: { nodes: ShopifyProduct[] };
  }>(
    `query GetProductsByTag($query: String!, $first: Int!) {
      products(query: $query, first: $first) {
        nodes { ...ProductFields }
      }
    }
    ${PRODUCT_FRAGMENT}`,
    { query: `tag:${tag}`, first }
  );

  return (data.products?.nodes ?? []).map((p) => ({
    ...p,
    xdipx: resolveMetafields(p.metafields as Array<{ key: string; value: string }>),
  }));
}

export async function getProductsByIds(ids: string[]): Promise<ShopifyProduct[]> {
  if (!ids.length) return [];

  const queries = ids.map(
    (id, i) => `p${i}: product(id: "${id}") { ...ProductFields }`
  );

  const data = await storefrontFetch<Record<string, ShopifyProduct | null>>(
    `query GetProductsById { ${queries.join("\n")} }
    ${PRODUCT_FRAGMENT}`
  );

  return Object.values(data)
    .filter(Boolean)
    .map((p) => ({
      ...p!,
      xdipx: resolveMetafields(p!.metafields as Array<{ key: string; value: string }>),
    }));
}

// ─── Cart Mutations ───────────────────────────────────────────────────────────

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      nodes {
        id quantity
        merchandise {
          ... on ProductVariant {
            id title
            price { amount currencyCode }
            product { id handle title featuredImage { url altText width height } }
          }
        }
      }
    }
  }
`;

export async function createCart(variantId: string, quantity = 1): Promise<ShopifyCart> {
  const data = await storefrontFetch<{ cartCreate: { cart: ShopifyCart } }>(
    `mutation CartCreate($variantId: ID!, $quantity: Int!) {
      cartCreate(input: {
        lines: [{ merchandiseId: $variantId, quantity: $quantity }]
      }) {
        cart { ...CartFields }
      }
    }
    ${CART_FRAGMENT}`,
    { variantId, quantity }
  );
  return data.cartCreate.cart;
}

export async function addCartLine(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<ShopifyCart> {
  const data = await storefrontFetch<{ cartLinesAdd: { cart: ShopifyCart } }>(
    `mutation CartLinesAdd($cartId: ID!, $variantId: ID!, $quantity: Int!) {
      cartLinesAdd(
        cartId: $cartId,
        lines: [{ merchandiseId: $variantId, quantity: $quantity }]
      ) {
        cart { ...CartFields }
      }
    }
    ${CART_FRAGMENT}`,
    { cartId, variantId, quantity }
  );
  return data.cartLinesAdd.cart;
}

export async function removeCartLine(cartId: string, lineId: string): Promise<ShopifyCart> {
  const data = await storefrontFetch<{ cartLinesRemove: { cart: ShopifyCart } }>(
    `mutation CartLinesRemove($cartId: ID!, $lineId: ID!) {
      cartLinesRemove(cartId: $cartId, lineIds: [$lineId]) {
        cart { ...CartFields }
      }
    }
    ${CART_FRAGMENT}`,
    { cartId, lineId }
  );
  return data.cartLinesRemove.cart;
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const data = await storefrontFetch<{ cartLinesUpdate: { cart: ShopifyCart } }>(
    `mutation CartLinesUpdate($cartId: ID!, $lineId: ID!, $quantity: Int!) {
      cartLinesUpdate(
        cartId: $cartId,
        lines: [{ id: $lineId, quantity: $quantity }]
      ) {
        cart { ...CartFields }
      }
    }
    ${CART_FRAGMENT}`,
    { cartId, lineId, quantity }
  );
  return data.cartLinesUpdate.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await storefrontFetch<{ cart: ShopifyCart | null }>(
    `query GetCart($cartId: ID!) {
      cart(id: $cartId) { ...CartFields }
    }
    ${CART_FRAGMENT}`,
    { cartId }
  );
  return data.cart;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatMoney(amount: string | number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(typeof amount === "string" ? parseFloat(amount) : amount);
}

export function getProductImages(product: ShopifyProduct): string[] {
  const images = product.images?.nodes?.map((i) => i.url) ?? [];
  if (product.xdipx?.moodImageUrl) {
    images.unshift(product.xdipx.moodImageUrl);
  }
  return images;
}
