// ─── Shopify Types ────────────────────────────────────────────────────────────

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  availableForSale: boolean;
  quantityAvailable: number;
  sku: string;
}

export interface ShopifyMetafield {
  key: string;
  value: string;
  type: string;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  featuredImage: ShopifyImage | null;
  images: { nodes: ShopifyImage[] };
  variants: { nodes: ShopifyProductVariant[] };
  tags: string[];
  vendor: string;
  productType: string;
  metafields?: ShopifyMetafield[];
  // xdipx custom metafields (resolved)
  xdipx?: XdipxMetafields;
}

export interface XdipxMetafields {
  isDailyDeal: boolean;
  dealDate: string | null;
  originalPrice: number | null;
  tagline: string | null;
  fullStory: string | null;
  worksForHim: string | null;
  worksForHer: string | null;
  featureBullets: string[];
  accessoryProductIds: string[];
  moodImageUrl: string | null;
  category: "for-him" | "for-her" | "both" | "couples" | null;
  dealStatus: "draft" | "pending_approval" | "approved" | "live" | "archived" | null;
  dealScore: number | null;
  nalpacSku: string | null;
  mapPrice: number | null;
  wholesaleCost: number | null;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
  };
  lines: {
    nodes: ShopifyCartLine[];
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: Pick<ShopifyProduct, "id" | "handle" | "title" | "featuredImage">;
    price: ShopifyMoney;
  };
}

// ─── Daily Deal ───────────────────────────────────────────────────────────────

export interface DailyDeal {
  product: ShopifyProduct;
  dealPrice: number;
  originalPrice: number;
  discountPct: number;
  savingsAmount: number;
  tagline: string;
  fullStory: string;
  worksForHim: string;
  worksForHer: string;
  featureBullets: string[];
  accessories: ShopifyProduct[];
  moodImageUrl: string | null;
  stockCount: number;
  category: XdipxMetafields["category"];
}

// ─── Nalpac Feed ─────────────────────────────────────────────────────────────

export interface NalpacProduct {
  SKU: string;
  "UPC/barcode": string;
  "Product Title": string;
  "Product Description": string;
  "Image 1": string;
  "Image 2": string;
  "Image 3": string;
  "Image 4": string;
  "Image 5": string;
  "Image 6": string;
  "Image 7": string;
  "Image 8": string;
  "Image 9": string;
  "Image 10": string;
  Wholesale: string;
  MSRP: string;
  MAP: string;
  "Nalpac qty available": string;
  "Entrenue qty available": string;
  "Total qty available": string;
  "Fluid Oz": string;
  Brand: string;
  Material: string;
  Color: string;
  "Main Category": string;
  "Sub-Category": string;
  Size: string;
}

export interface ProductScore {
  sku: string;
  score: number;
  dealPrice: number;
  discountPct: number;
  profitPerUnit: number;
  brand: string;
  subscores: {
    profScore: number;
    dealScore: number;
    invScore: number;
    imgScore: number;
    catScore: number;
  };
}

export interface DealHistory {
  usedSKUs: string[];
  last7Days: Array<{ sku: string; brand: string; categories: string[] }>;
  recentCategories: string[][];
}

// ─── AI Content ───────────────────────────────────────────────────────────────

export type GenerateType =
  | "tagline"
  | "full-story"
  | "both-ways"
  | "bullets"
  | "email-subjects"
  | "meta";

export interface GenerateCopyRequest {
  productName: string;
  rawDescription: string;
  category: "for-him" | "for-her" | "both" | "couples";
  price: number;
  originalPrice: number;
  type: GenerateType;
}

export interface GeneratedContent {
  seoTitle: string;
  tagline: string;
  fullStory: string;
  fullStoryHTML: string;
  worksForHim: string;
  worksForHer: string;
  bullets: string[];
  emailSubjects: string[];
  metaDescription: string;
  accessorySKUs: string[];
  xdipxCategory: XdipxMetafields["category"];
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export type DealStatus = "pending" | "pending_approval" | "approved" | "live" | "archived";

export interface QueuedDeal {
  id: string;
  shopifyProductId: string;
  productTitle: string;
  scheduledDate: string;
  category: XdipxMetafields["category"];
  status: DealStatus;
  dealScore: number | null;
  brand: string;
  dealPrice: number;
  originalPrice: number;
  accessories: string[];
}

// ─── Klaviyo ──────────────────────────────────────────────────────────────────

export interface KlaviyoSubscribeRequest {
  email: string;
  listId?: string;
}

export interface KlaviyoWaitlistRequest {
  email: string;
  productId: string;
  productHandle: string;
}

// ─── Cart Context ─────────────────────────────────────────────────────────────

export interface CartContextValue {
  cart: ShopifyCart | null;
  loading: boolean;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  cartCount: number;
  checkoutUrl: string | null;
}
