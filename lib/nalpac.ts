import Papa from "papaparse";
import { NalpacProduct, ProductScore, DealHistory } from "@/types";

const FEED_URL = process.env.NALPAC_FEED_URL!;

// ─── Fetch & parse ────────────────────────────────────────────────────────────

export async function fetchNalpacFeed(): Promise<NalpacProduct[]> {
  const res = await fetch(FEED_URL, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`Nalpac feed fetch failed: ${res.status}`);
  const csvText = await res.text();

  const result = Papa.parse<NalpacProduct>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  return result.data.map(cleanProduct);
}

// ─── Encoding cleanup ─────────────────────────────────────────────────────────

function cleanProduct(p: NalpacProduct): NalpacProduct {
  return {
    ...p,
    "Product Title": cleanNalpacText(p["Product Title"] ?? ""),
    "Product Description": cleanDescription(p["Product Description"] ?? ""),
    Brand: (p.Brand ?? "").trim(),
    Material: (p.Material ?? "").trim(),
    Color: (p.Color ?? "").trim(),
    "Sub-Category": (p["Sub-Category"] ?? "").trim(),
  };
}

function cleanNalpacText(raw: string): string {
  return raw.replace(/ft\./g, "'").replace(/\s+/g, " ").trim();
}

function cleanDescription(raw: string): string {
  // Fix apostrophes: word + ft. → word + '
  let clean = raw.replace(/(\w)ft\./g, "$1'");
  // Fix quoted phrases: in. at non-digit word boundary
  clean = clean.replace(/(?<!\d)in\./g, '"');
  return clean.replace(/\s+/g, " ").trim();
}

// ─── Product images ───────────────────────────────────────────────────────────

export function getImages(p: NalpacProduct): string[] {
  return [
    p["Image 1"], p["Image 2"], p["Image 3"], p["Image 4"], p["Image 5"],
    p["Image 6"], p["Image 7"], p["Image 8"], p["Image 9"], p["Image 10"],
  ].filter((img) => img?.trim().length > 0);
}

export function parseCategories(subCategory: string): string[] {
  return subCategory
    .split(",")
    .map((c) => c.trim())
    .filter((c) => c && c !== "Top 100 Items");
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

function profitabilityScore(wholesale: number, msrp: number): number {
  const grossMargin = (msrp - wholesale) / msrp;
  return Math.min(grossMargin / 0.65, 1.0);
}

function dealabilityScore(
  wholesale: number,
  msrp: number,
  map: number
): { score: number; dealPrice: number; discountPct: number } {
  if (map === 0) {
    const dealPrice = Math.max(wholesale * 1.5, msrp * 0.5);
    const discountPct = Math.round(((msrp - dealPrice) / msrp) * 100);
    return { score: 1.0, dealPrice: round2(dealPrice), discountPct };
  } else if (map < msrp) {
    const discountPct = Math.round(((msrp - map) / msrp) * 100);
    const score = Math.min(discountPct / 30, 1.0);
    return { score, dealPrice: map, discountPct };
  } else {
    return { score: 0.05, dealPrice: msrp, discountPct: 0 };
  }
}

function inventoryScore(qty: number): number {
  if (qty < 20) return 0;
  if (qty < 50) return 0.4;
  if (qty <= 250) return 1.0;
  if (qty <= 600) return 0.8;
  return 0.65;
}

function imageScore(images: string[]): number {
  return Math.min(images.length / 8, 1.0);
}

function categoryFreshnessScore(
  productCategories: string[],
  recentDealCategories: string[][]
): number {
  const recentFlat = recentDealCategories.flat();
  const overlap = productCategories.filter((c) => recentFlat.includes(c)).length;
  return Math.pow(0.7, overlap);
}

function isEligible(p: NalpacProduct, usedSKUs: string[]): boolean {
  const qty = parseInt(p["Total qty available"]) || 0;
  const wholesale = parseFloat(p.Wholesale) || 0;
  const msrp = parseFloat(p.MSRP) || 0;
  if (qty < 20) return false;
  if (wholesale === 0 || msrp === 0) return false;
  if (usedSKUs.includes(p.SKU)) return false;
  return true;
}

export function scoreProduct(p: NalpacProduct, history: DealHistory): ProductScore | null {
  if (!isEligible(p, history.usedSKUs)) return null;

  const wholesale = parseFloat(p.Wholesale);
  const msrp = parseFloat(p.MSRP);
  const map = parseFloat(p.MAP) || 0;
  const qty = parseInt(p["Total qty available"]);
  const images = getImages(p);
  const categories = parseCategories(p["Sub-Category"]);

  const profScore = profitabilityScore(wholesale, msrp);
  const { score: dealScore, dealPrice, discountPct } = dealabilityScore(wholesale, msrp, map);
  const invScore = inventoryScore(qty);
  const imgScore = imageScore(images);
  const catScore = categoryFreshnessScore(categories, history.recentCategories);

  const totalScore =
    profScore * 0.35 +
    dealScore * 0.30 +
    invScore  * 0.20 +
    imgScore  * 0.10 +
    catScore  * 0.05;

  return {
    sku: p.SKU,
    score: round2(totalScore),
    dealPrice,
    discountPct,
    profitPerUnit: round2(dealPrice - wholesale),
    brand: p.Brand,
    subscores: { profScore, dealScore, invScore, imgScore, catScore },
  };
}

// ─── Selection ────────────────────────────────────────────────────────────────

export function selectBestDeal(
  products: NalpacProduct[],
  history: DealHistory
): { product: NalpacProduct; score: ProductScore } | null {
  const scored = products
    .map((p) => ({ product: p, score: scoreProduct(p, history) }))
    .filter((s): s is { product: NalpacProduct; score: ProductScore } => s.score !== null)
    .sort((a, b) => b.score.score - a.score.score);

  if (!scored.length) return null;

  // Avoid running the same brand in last 3 days
  const recentBrands = history.last7Days.slice(0, 3).map((d) => d.brand);
  for (const candidate of scored) {
    if (!recentBrands.includes(candidate.product.Brand)) {
      return candidate;
    }
  }

  // Fall back to top scorer if all recent brands conflict
  return scored[0];
}

// ─── Tag builder ──────────────────────────────────────────────────────────────

const FOR_HIM_CATS = new Set([
  "Vagina Strokers", "Body Molds", "Masturbators",
  "Prostate Toys", "Hands-Free Masturbators",
]);
const FOR_HER_CATS = new Set([
  "Dual Action and Rabbits", "Finger and Clit",
  "Air Pulse and Suction", "Bullets and Eggs",
]);
const COUPLE_CATS = new Set([
  "Couples and Wearable", "Remote", "Top Couples Toys",
  "Restraints", "Bondage",
]);

export function buildTags(p: NalpacProduct): string[] {
  const cats = parseCategories(p["Sub-Category"]);
  const tags: string[] = [];

  cats.forEach((cat) =>
    tags.push(`cat:${cat.toLowerCase().replace(/\s+/g, "-")}`)
  );

  if (cats.some((c) => FOR_HIM_CATS.has(c))) tags.push("for-him");
  if (cats.some((c) => FOR_HER_CATS.has(c))) tags.push("for-her");
  if (cats.some((c) => COUPLE_CATS.has(c))) tags.push("for-couples");
  if (cats.some((c) => FOR_HIM_CATS.has(c)) && cats.some((c) => FOR_HER_CATS.has(c)))
    tags.push("for-both");

  if (p.Material.toLowerCase().includes("silicone")) tags.push("material:silicone");
  if (p.Material.toLowerCase().includes("tpe")) tags.push("material:tpe");

  tags.push(`brand:${p.Brand.toLowerCase().replace(/\s+/g, "-")}`);

  const price = parseFloat(p.MSRP);
  if (price < 25) tags.push("price:under-25");
  else if (price < 50) tags.push("price:25-50");
  else if (price < 100) tags.push("price:50-100");
  else tags.push("price:100-plus");

  return tags;
}

export function detectXdipxCategory(p: NalpacProduct): "for-him" | "for-her" | "both" | "couples" {
  const cats = parseCategories(p["Sub-Category"]);
  const isHim = cats.some((c) => FOR_HIM_CATS.has(c));
  const isHer = cats.some((c) => FOR_HER_CATS.has(c));
  const isCouples = cats.some((c) => COUPLE_CATS.has(c));

  if (isCouples) return "couples";
  if (isHim && isHer) return "both";
  if (isHim) return "for-him";
  if (isHer) return "for-her";
  return "both";
}

// ─── Pricing formula ──────────────────────────────────────────────────────────

export function calculateDealPricing(wholesale: number, msrp: number, map: number) {
  if (map === 0) {
    const minPrice = wholesale * 1.4;
    const targetPrice = msrp * 0.55;
    const dealPrice = round2(Math.max(minPrice, targetPrice));
    const savings = round2(msrp - dealPrice);
    const savingsPct = Math.round((savings / msrp) * 100);
    return { dealPrice, savings, savingsPct };
  } else if (map < msrp) {
    const savings = round2(msrp - map);
    const savingsPct = Math.round((savings / msrp) * 100);
    return { dealPrice: map, savings, savingsPct };
  } else {
    return { dealPrice: msrp, savings: 0, savingsPct: 0 };
  }
}

// ─── Util ─────────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
