/**
 * Seed data for development when Shopify is not yet connected.
 * Replace this with real Shopify data once the store is live.
 */
import { DailyDeal, ShopifyProduct } from "@/types";

function makeProduct(overrides: Partial<ShopifyProduct> & { id: string; handle: string; title: string }): ShopifyProduct {
  return {
    description: "A premium wellness product designed for pleasure and connection.",
    descriptionHtml: "<p>A premium wellness product designed for pleasure and connection.</p>",
    vendor: "xdipx",
    productType: "Wellness",
    tags: ["for-both"],
    featuredImage: null,
    images: { nodes: [] },
    variants: {
      nodes: [{
        id: `gid://shopify/ProductVariant/${overrides.id}`,
        title: "Default",
        sku: `SEED-${overrides.id}`,
        availableForSale: true,
        quantityAvailable: 50,
        price: { amount: "29.99", currencyCode: "USD" },
        compareAtPrice: { amount: "49.99", currencyCode: "USD" },
      }],
    },
    ...overrides,
  };
}

// ── Daily Deal seed ───────────────────────────────────────────────────────────

const dailyDealProduct = makeProduct({
  id: "seed-001",
  handle: "magic-wand-rechargeable",
  title: "Magic Wand Rechargeable Wand Massager",
  vendor: "Magic Wand",
  productType: "Wand Massager",
  tags: ["for-her", "for-both", "brand:magic-wand", "price:100-plus"],
  variants: {
    nodes: [{
      id: "gid://shopify/ProductVariant/seed-001",
      title: "Default",
      sku: "53907",
      availableForSale: true,
      quantityAvailable: 18,
      price: { amount: "142.95", currencyCode: "USD" },
      compareAtPrice: { amount: "208.95", currencyCode: "USD" },
    }],
  },
  xdipx: {
    isDailyDeal: true,
    dealDate: new Date().toISOString().split("T")[0],
    originalPrice: 208.95,
    tagline: "The one everyone's heard about. Now you'll know why.",
    fullStory: `There's a reason this thing has a cult following. The Magic Wand Rechargeable is the kind of product that shows up on wishlists, in gift guides, and — if you ask nicely — in conversations among very good friends.\n\nIt's powerful. Genuinely, surprisingly powerful. The kind of power that makes you rethink everything you thought you knew about what \"powerful\" meant. Six speeds, four pulse patterns, USB-C rechargeable, silicone head that's both soft and serious about what it does.\n\nThe cord-free design means you're not tethered to an outlet, you're not planning around furniture, you're just... free. Which is exactly the point.\n\nThis is the upgraded version of the original that put the Magic Wand on the map. The HV-270 is quieter, longer-lasting, and built to last. Whether it's your first wand or your fifth, this is the one you keep.`,
    worksForHim: "Don't let the reputation fool you — wands aren't just for one crowd. The deep, rumbly vibration is exceptional for prostate massage, perineal stimulation, and solo sessions that go somewhere different. The flexible head makes it remarkably easy to dial in exactly where you want it.",
    worksForHer: "This is the one. If you've been curious about wands, this is your answer. If you already know about wands, this is your upgrade. The Magic Wand's powerful rumbly vibration hits differently than anything buzzy or pinpoint — it's broad, deep, and inexplicably satisfying in a way that's hard to explain until you've experienced it.",
    featureBullets: [
      "Six intensity levels — from gentle to genuinely intense",
      "Four vibration patterns for when you want to mix it up",
      "Flexible silicone head adjusts to any angle",
      "USB-C rechargeable with 3-hour battery life",
      "Whisper-quiet enough for shared walls",
    ],
    accessoryProductIds: ["seed-acc-001", "seed-acc-002"],
    moodImageUrl: null,
    category: "for-her",
    dealStatus: "live",
    dealScore: 0.949,
    nalpacSku: "53907",
    mapPrice: 142.95,
    wholesaleCost: 88.11,
  },
});

export const SEED_DAILY_DEAL: DailyDeal = {
  product: dailyDealProduct,
  dealPrice: 142.95,
  originalPrice: 208.95,
  discountPct: 32,
  savingsAmount: 66.00,
  tagline: "The one everyone's heard about. Now you'll know why.",
  fullStory: dailyDealProduct.xdipx!.fullStory!,
  worksForHim: dailyDealProduct.xdipx!.worksForHim!,
  worksForHer: dailyDealProduct.xdipx!.worksForHer!,
  featureBullets: dailyDealProduct.xdipx!.featureBullets,
  accessories: [],
  moodImageUrl: null,
  stockCount: 18,
  category: "for-her",
};

// ── For Him seed ──────────────────────────────────────────────────────────────

export const SEED_FOR_HIM: ShopifyProduct[] = [
  makeProduct({
    id: "seed-him-001",
    handle: "fleshlight-launch",
    title: "Fleshlight Launch Interactive Stroker",
    vendor: "Fleshlight",
    productType: "Stroker",
    tags: ["for-him", "brand:fleshlight"],
    variants: {
      nodes: [{
        id: "gid://shopify/ProductVariant/seed-him-001",
        title: "Default",
        sku: "SEED-HIM-001",
        availableForSale: true,
        quantityAvailable: 34,
        price: { amount: "54.99", currencyCode: "USD" },
        compareAtPrice: { amount: "79.99", currencyCode: "USD" },
      }],
    },
    xdipx: { isDailyDeal: false, dealDate: null, originalPrice: 79.99, tagline: "Hands-free. Fully automatic. Enough said.", fullStory: null, worksForHim: null, worksForHer: null, featureBullets: [], accessoryProductIds: [], moodImageUrl: null, category: "for-him", dealStatus: null, dealScore: null, nalpacSku: null, mapPrice: null, wholesaleCost: null },
  }),
  makeProduct({
    id: "seed-him-002",
    handle: "je-joue-mio",
    title: "Je Joue Mio Cock Ring",
    vendor: "Je Joue",
    productType: "Cock Ring",
    tags: ["for-him", "for-couples", "material:silicone"],
    variants: {
      nodes: [{
        id: "gid://shopify/ProductVariant/seed-him-002",
        title: "Default",
        sku: "SEED-HIM-002",
        availableForSale: true,
        quantityAvailable: 62,
        price: { amount: "39.99", currencyCode: "USD" },
        compareAtPrice: { amount: "54.99", currencyCode: "USD" },
      }],
    },
    xdipx: { isDailyDeal: false, dealDate: null, originalPrice: 54.99, tagline: "Simple upgrade. Big difference.", fullStory: null, worksForHim: null, worksForHer: null, featureBullets: [], accessoryProductIds: [], moodImageUrl: null, category: "for-him", dealStatus: null, dealScore: null, nalpacSku: null, mapPrice: null, wholesaleCost: null },
  }),
  makeProduct({
    id: "seed-him-003",
    handle: "aneros-helix",
    title: "Aneros Helix Syn Prostate Massager",
    vendor: "Aneros",
    productType: "Prostate Massager",
    tags: ["for-him", "material:silicone"],
    variants: {
      nodes: [{
        id: "gid://shopify/ProductVariant/seed-him-003",
        title: "Default",
        sku: "SEED-HIM-003",
        availableForSale: true,
        quantityAvailable: 45,
        price: { amount: "44.99", currencyCode: "USD" },
        compareAtPrice: { amount: "59.99", currencyCode: "USD" },
      }],
    },
    xdipx: { isDailyDeal: false, dealDate: null, originalPrice: 59.99, tagline: "The one that started the conversation.", fullStory: null, worksForHim: null, worksForHer: null, featureBullets: [], accessoryProductIds: [], moodImageUrl: null, category: "for-him", dealStatus: null, dealScore: null, nalpacSku: null, mapPrice: null, wholesaleCost: null },
  }),
];

// ── For Her seed ──────────────────────────────────────────────────────────────

export const SEED_FOR_HER: ShopifyProduct[] = [
  makeProduct({
    id: "seed-her-001",
    handle: "satisfyer-pro-2",
    title: "Satisfyer Pro 2 Air Pulse Stimulator",
    vendor: "Satisfyer",
    productType: "Air Pulse",
    tags: ["for-her", "material:silicone"],
    variants: {
      nodes: [{
        id: "gid://shopify/ProductVariant/seed-her-001",
        title: "Default",
        sku: "SEED-HER-001",
        availableForSale: true,
        quantityAvailable: 88,
        price: { amount: "24.99", currencyCode: "USD" },
        compareAtPrice: { amount: "39.99", currencyCode: "USD" },
      }],
    },
    xdipx: { isDailyDeal: false, dealDate: null, originalPrice: 39.99, tagline: "This is the one everyone's been texting about.", fullStory: null, worksForHim: null, worksForHer: null, featureBullets: [], accessoryProductIds: [], moodImageUrl: null, category: "for-her", dealStatus: null, dealScore: null, nalpacSku: null, mapPrice: null, wholesaleCost: null },
  }),
  makeProduct({
    id: "seed-her-002",
    handle: "we-vibe-moxie",
    title: "We-Vibe Moxie Wearable Vibrator",
    vendor: "We-Vibe",
    productType: "Wearable Vibrator",
    tags: ["for-her", "for-couples", "material:silicone"],
    variants: {
      nodes: [{
        id: "gid://shopify/ProductVariant/seed-her-002",
        title: "Default",
        sku: "SEED-HER-002",
        availableForSale: true,
        quantityAvailable: 31,
        price: { amount: "74.99", currencyCode: "USD" },
        compareAtPrice: { amount: "99.99", currencyCode: "USD" },
      }],
    },
    xdipx: { isDailyDeal: false, dealDate: null, originalPrice: 99.99, tagline: "Wear it out. No one will know. That's the point.", fullStory: null, worksForHim: null, worksForHer: null, featureBullets: [], accessoryProductIds: [], moodImageUrl: null, category: "for-her", dealStatus: null, dealScore: null, nalpacSku: null, mapPrice: null, wholesaleCost: null },
  }),
  makeProduct({
    id: "seed-her-003",
    handle: "lelo-sona-2",
    title: "LELO SONA 2 Sonic Clitoral Massager",
    vendor: "LELO",
    productType: "Sonic Stimulator",
    tags: ["for-her", "material:silicone"],
    variants: {
      nodes: [{
        id: "gid://shopify/ProductVariant/seed-her-003",
        title: "Default",
        sku: "SEED-HER-003",
        availableForSale: false,
        quantityAvailable: 0,
        price: { amount: "109.99", currencyCode: "USD" },
        compareAtPrice: { amount: "149.00", currencyCode: "USD" },
      }],
    },
    xdipx: { isDailyDeal: false, dealDate: null, originalPrice: 149.00, tagline: "Sonic waves. Actual science. Real results.", fullStory: null, worksForHim: null, worksForHer: null, featureBullets: [], accessoryProductIds: [], moodImageUrl: null, category: "for-her", dealStatus: null, dealScore: null, nalpacSku: null, mapPrice: null, wholesaleCost: null },
  }),
];

// ── Bonus Deal seed ───────────────────────────────────────────────────────────

export const SEED_BONUS: ShopifyProduct = makeProduct({
  id: "seed-bonus-001",
  handle: "system-jo-h2o-lube",
  title: "System JO H2O Original Water-Based Lubricant",
  vendor: "System JO",
  productType: "Lubricant",
  tags: ["for-both", "price:25-50"],
  variants: {
    nodes: [{
      id: "gid://shopify/ProductVariant/seed-bonus-001",
      title: "4 oz",
      sku: "19440",
      availableForSale: true,
      quantityAvailable: 234,
      price: { amount: "18.99", currencyCode: "USD" },
      compareAtPrice: { amount: "28.99", currencyCode: "USD" },
    }],
  },
  xdipx: { isDailyDeal: false, dealDate: null, originalPrice: 28.99, tagline: "The lube your drawer has been waiting for.", fullStory: null, worksForHim: null, worksForHer: null, featureBullets: [], accessoryProductIds: [], moodImageUrl: null, category: "both", dealStatus: null, dealScore: null, nalpacSku: "19440", mapPrice: null, wholesaleCost: null },
});

// ── Accessories seed ──────────────────────────────────────────────────────────

export const SEED_ACCESSORIES: ShopifyProduct[] = [
  makeProduct({
    id: "seed-acc-001",
    handle: "wicked-aqua-lube",
    title: "Wicked Aqua Water-Based Lubricant",
    vendor: "Wicked",
    tags: ["accessories", "for-both"],
    variants: {
      nodes: [{
        id: "gid://shopify/ProductVariant/seed-acc-001",
        title: "4 oz",
        sku: "SEED-ACC-001",
        availableForSale: true,
        quantityAvailable: 135,
        price: { amount: "13.99", currencyCode: "USD" },
        compareAtPrice: null,
      }],
    },
    xdipx: { isDailyDeal: false, dealDate: null, originalPrice: 0, tagline: "Silky, clean, compatible with everything.", fullStory: null, worksForHim: null, worksForHer: null, featureBullets: [], accessoryProductIds: [], moodImageUrl: null, category: "both", dealStatus: null, dealScore: null, nalpacSku: null, mapPrice: null, wholesaleCost: null },
  }),
  makeProduct({
    id: "seed-acc-002",
    handle: "jo-refresh-toy-cleaner",
    title: "JO Refresh Foaming Toy Cleaner",
    vendor: "System JO",
    tags: ["accessories", "for-both"],
    variants: {
      nodes: [{
        id: "gid://shopify/ProductVariant/seed-acc-002",
        title: "7 oz",
        sku: "SEED-ACC-002",
        availableForSale: true,
        quantityAvailable: 210,
        price: { amount: "11.99", currencyCode: "USD" },
        compareAtPrice: null,
      }],
    },
    xdipx: { isDailyDeal: false, dealDate: null, originalPrice: 0, tagline: "Keep it clean. Keep it ready.", fullStory: null, worksForHim: null, worksForHer: null, featureBullets: [], accessoryProductIds: [], moodImageUrl: null, category: "both", dealStatus: null, dealScore: null, nalpacSku: null, mapPrice: null, wholesaleCost: null },
  }),
  makeProduct({
    id: "seed-acc-003",
    handle: "storage-pouch",
    title: "Velvet Storage Pouch — Discreet & Dust-Free",
    vendor: "xdipx",
    tags: ["accessories", "for-both"],
    variants: {
      nodes: [{
        id: "gid://shopify/ProductVariant/seed-acc-003",
        title: "Default",
        sku: "SEED-ACC-003",
        availableForSale: true,
        quantityAvailable: 500,
        price: { amount: "7.99", currencyCode: "USD" },
        compareAtPrice: null,
      }],
    },
    xdipx: { isDailyDeal: false, dealDate: null, originalPrice: 0, tagline: "Because your drawer deserves organization too.", fullStory: null, worksForHim: null, worksForHer: null, featureBullets: [], accessoryProductIds: [], moodImageUrl: null, category: "both", dealStatus: null, dealScore: null, nalpacSku: null, mapPrice: null, wholesaleCost: null },
  }),
  makeProduct({
    id: "seed-acc-004",
    handle: "slip-premium-hybrid-lube",
    title: "Slip Premium Hybrid Lubricant",
    vendor: "Slip",
    tags: ["accessories", "for-both"],
    variants: {
      nodes: [{
        id: "gid://shopify/ProductVariant/seed-acc-004",
        title: "2 oz",
        sku: "SEED-ACC-004",
        availableForSale: true,
        quantityAvailable: 98,
        price: { amount: "16.99", currencyCode: "USD" },
        compareAtPrice: null,
      }],
    },
    xdipx: { isDailyDeal: false, dealDate: null, originalPrice: 0, tagline: "Water-based feel, silicone staying power.", fullStory: null, worksForHim: null, worksForHer: null, featureBullets: [], accessoryProductIds: [], moodImageUrl: null, category: "both", dealStatus: null, dealScore: null, nalpacSku: null, mapPrice: null, wholesaleCost: null },
  }),
];

// ── Vault seed ────────────────────────────────────────────────────────────────

function vaultDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

export const SEED_VAULT: ShopifyProduct[] = [
  makeProduct({
    id: "seed-vault-001",
    handle: "we-vibe-sync",
    title: "We-Vibe Sync Couples Vibrator",
    vendor: "We-Vibe",
    tags: ["for-couples", "vault"],
    variants: {
      nodes: [{
        id: "gid://shopify/ProductVariant/seed-vault-001",
        title: "Default",
        sku: "SEED-V-001",
        availableForSale: false,
        quantityAvailable: 0,
        price: { amount: "109.99", currencyCode: "USD" },
        compareAtPrice: { amount: "159.99", currencyCode: "USD" },
      }],
    },
    xdipx: { isDailyDeal: false, dealDate: vaultDate(1), originalPrice: 159.99, tagline: null, fullStory: null, worksForHim: null, worksForHer: null, featureBullets: [], accessoryProductIds: [], moodImageUrl: null, category: "couples", dealStatus: "archived", dealScore: 0.88, nalpacSku: null, mapPrice: null, wholesaleCost: null },
  }),
  makeProduct({
    id: "seed-vault-002",
    handle: "femmefunn-ultra-bullet",
    title: "FemmeFunn Ultra Bullet Vibrator",
    vendor: "FemmeFunn",
    tags: ["for-her", "vault"],
    variants: {
      nodes: [{
        id: "gid://shopify/ProductVariant/seed-vault-002",
        title: "Default",
        sku: "SEED-V-002",
        availableForSale: true,
        quantityAvailable: 12,
        price: { amount: "52.99", currencyCode: "USD" },
        compareAtPrice: { amount: "69.99", currencyCode: "USD" },
      }],
    },
    xdipx: { isDailyDeal: false, dealDate: vaultDate(2), originalPrice: 69.99, tagline: null, fullStory: null, worksForHim: null, worksForHer: null, featureBullets: [], accessoryProductIds: [], moodImageUrl: null, category: "for-her", dealStatus: "archived", dealScore: 0.86, nalpacSku: null, mapPrice: null, wholesaleCost: null },
  }),
  makeProduct({
    id: "seed-vault-003",
    handle: "tantus-silk-dildo",
    title: "Tantus Silk Small Premium Silicone Dildo",
    vendor: "Tantus",
    tags: ["for-both", "vault"],
    variants: {
      nodes: [{
        id: "gid://shopify/ProductVariant/seed-vault-003",
        title: "Default",
        sku: "SEED-V-003",
        availableForSale: false,
        quantityAvailable: 0,
        price: { amount: "55.50", currencyCode: "USD" },
        compareAtPrice: { amount: "73.99", currencyCode: "USD" },
      }],
    },
    xdipx: { isDailyDeal: false, dealDate: vaultDate(3), originalPrice: 73.99, tagline: null, fullStory: null, worksForHim: null, worksForHer: null, featureBullets: [], accessoryProductIds: [], moodImageUrl: null, category: "both", dealStatus: "archived", dealScore: 0.88, nalpacSku: null, mapPrice: null, wholesaleCost: null },
  }),
  makeProduct({
    id: "seed-vault-004",
    handle: "lovense-lush-3",
    title: "Lovense Lush 3 Bluetooth Egg Vibrator",
    vendor: "Lovense",
    tags: ["for-her", "vault"],
    variants: {
      nodes: [{
        id: "gid://shopify/ProductVariant/seed-vault-004",
        title: "Default",
        sku: "SEED-V-004",
        availableForSale: false,
        quantityAvailable: 0,
        price: { amount: "89.99", currencyCode: "USD" },
        compareAtPrice: { amount: "119.99", currencyCode: "USD" },
      }],
    },
    xdipx: { isDailyDeal: false, dealDate: vaultDate(4), originalPrice: 119.99, tagline: null, fullStory: null, worksForHim: null, worksForHer: null, featureBullets: [], accessoryProductIds: [], moodImageUrl: null, category: "for-her", dealStatus: "archived", dealScore: 0.82, nalpacSku: null, mapPrice: null, wholesaleCost: null },
  }),
];
