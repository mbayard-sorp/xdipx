import { NextRequest, NextResponse } from "next/server";
import { fetchNalpacFeed, selectBestDeal, buildTags, detectXdipxCategory, calculateDealPricing, getImages } from "@/lib/nalpac";
import { generateSEOTitle, generateTagline, generateFullStory, generateBothWays, generateBullets, generateEmailSubjects, generateMetaDescription } from "@/lib/claude";
import { generateMoodImage } from "@/lib/imagen";
import { shopifyAdminFetch } from "@/lib/shopify";
import { triggerDailyDealEmail } from "@/lib/klaviyo";
import { DealHistory } from "@/types";

// Authenticate cron requests
function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const log: string[] = [];
  const ts = () => new Date().toISOString();

  try {
    log.push(`[${ts()}] Starting daily feed processor`);

    // STEP 1: Fetch and parse feed
    log.push(`[${ts()}] Fetching Nalpac feed...`);
    const products = await fetchNalpacFeed();
    log.push(`[${ts()}] Fetched ${products.length} products`);

    // STEP 2: Load deal history (stub — replace with real DB/KV)
    const dealHistory: DealHistory = {
      usedSKUs: [],       // TODO: load from Vercel KV / DB
      last7Days: [],      // TODO: load from Vercel KV / DB
      recentCategories: [],
    };

    // STEP 3: Select best deal
    log.push(`[${ts()}] Scoring and selecting deal...`);
    const selection = selectBestDeal(products, dealHistory);

    if (!selection) {
      log.push(`[${ts()}] ERROR: No eligible products found`);
      return NextResponse.json({ error: "No eligible products", log }, { status: 500 });
    }

    const { product: nalpacProduct, score } = selection;
    log.push(`[${ts()}] Selected: ${nalpacProduct["Product Title"]} (score: ${score.score})`);

    // STEP 4: Generate AI content
    log.push(`[${ts()}] Generating AI content...`);
    const wholesale = parseFloat(nalpacProduct.Wholesale);
    const msrp = parseFloat(nalpacProduct.MSRP);
    const map = parseFloat(nalpacProduct.MAP) || 0;
    const { dealPrice, savingsPct } = calculateDealPricing(wholesale, msrp, map);
    const category = detectXdipxCategory(nalpacProduct);

    const [seoTitle, tagline, fullStory, bothWays, bullets, emailSubjects, metaDescription] =
      await Promise.allSettled([
        generateSEOTitle(nalpacProduct["Product Title"], nalpacProduct.Brand, nalpacProduct["Sub-Category"]),
        generateTagline(nalpacProduct["Product Title"], nalpacProduct["Product Description"], category),
        generateFullStory(nalpacProduct["Product Title"], nalpacProduct["Product Description"], category, dealPrice, msrp),
        generateBothWays(nalpacProduct["Product Title"], nalpacProduct["Product Description"], nalpacProduct["Sub-Category"]),
        generateBullets(nalpacProduct["Product Title"], nalpacProduct["Product Description"], nalpacProduct.Material),
        generateEmailSubjects(nalpacProduct["Product Title"], dealPrice, savingsPct),
        generateMetaDescription(nalpacProduct["Product Title"], dealPrice, savingsPct, parseInt(nalpacProduct["Total qty available"])),
      ]);

    const resolvedTitle = seoTitle.status === "fulfilled" ? seoTitle.value : nalpacProduct["Product Title"];
    const resolvedTagline = tagline.status === "fulfilled" ? tagline.value : "";
    const resolvedStory = fullStory.status === "fulfilled" ? fullStory.value : nalpacProduct["Product Description"];
    const resolvedBothWays = bothWays.status === "fulfilled" ? bothWays.value : { forHim: "", forHer: "" };
    const resolvedBullets = bullets.status === "fulfilled" ? bullets.value : [];
    const resolvedEmailSubjects = emailSubjects.status === "fulfilled" ? emailSubjects.value : [];
    const resolvedMeta = metaDescription.status === "fulfilled" ? metaDescription.value : "";

    log.push(`[${ts()}] AI content generated`);

    // STEP 5: Generate Imagen mood image if < 3 product images
    let moodImageUrl: string | null = null;
    const images = getImages(nalpacProduct);
    if (images.length < 3) {
      log.push(`[${ts()}] Generating mood image (only ${images.length} product images)...`);
      moodImageUrl = await generateMoodImage({
        productName: resolvedTitle,
        category,
        mood: "warm",
        style: "lifestyle",
      });
      if (moodImageUrl) log.push(`[${ts()}] Mood image generated`);
    }

    // STEP 6: Stage in Shopify as draft
    log.push(`[${ts()}] Creating Shopify product draft...`);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dealDate = tomorrow.toISOString().split("T")[0];

    const shopifyPayload = {
      product: {
        title: resolvedTitle,
        body_html: `<p>${resolvedStory.replace(/\n\n/g, "</p><p>")}</p>`,
        vendor: nalpacProduct.Brand,
        product_type: nalpacProduct["Sub-Category"].split(",")[0]?.trim() ?? "",
        status: "draft",
        tags: buildTags(nalpacProduct).join(", "),
        variants: [{
          price: dealPrice.toString(),
          compare_at_price: msrp.toString(),
          sku: nalpacProduct.SKU,
          barcode: nalpacProduct["UPC/barcode"],
          inventory_management: "shopify",
          inventory_quantity: parseInt(nalpacProduct["Total qty available"]),
          requires_shipping: true,
        }],
        images: images.slice(0, 10).map((url, i) => ({
          src: url,
          alt: `${resolvedTitle} - view ${i + 1} | xdipx`,
        })),
        metafields: [
          { namespace: "xdipx", key: "is_daily_deal",         value: "true",                              type: "boolean" },
          { namespace: "xdipx", key: "deal_date",             value: dealDate,                             type: "date" },
          { namespace: "xdipx", key: "original_price",        value: msrp.toString(),                      type: "number_decimal" },
          { namespace: "xdipx", key: "wholesale_cost",        value: wholesale.toString(),                  type: "number_decimal" },
          { namespace: "xdipx", key: "map_price",             value: map.toString(),                        type: "number_decimal" },
          { namespace: "xdipx", key: "tagline",               value: resolvedTagline,                       type: "single_line_text_field" },
          { namespace: "xdipx", key: "full_story",            value: resolvedStory,                         type: "multi_line_text_field" },
          { namespace: "xdipx", key: "works_for_him",         value: resolvedBothWays.forHim,               type: "multi_line_text_field" },
          { namespace: "xdipx", key: "works_for_her",         value: resolvedBothWays.forHer,               type: "multi_line_text_field" },
          { namespace: "xdipx", key: "feature_bullets",       value: JSON.stringify(resolvedBullets),       type: "json" },
          { namespace: "xdipx", key: "accessory_product_ids", value: JSON.stringify([]),                    type: "json" },
          { namespace: "xdipx", key: "mood_image_url",        value: moodImageUrl ?? "",                    type: "url" },
          { namespace: "xdipx", key: "category",              value: category,                              type: "single_line_text_field" },
          { namespace: "xdipx", key: "deal_status",           value: "pending_approval",                    type: "single_line_text_field" },
          { namespace: "xdipx", key: "nalpac_sku",            value: nalpacProduct.SKU,                     type: "single_line_text_field" },
          { namespace: "xdipx", key: "deal_score",            value: score.score.toString(),                type: "number_decimal" },
          { namespace: "xdipx", key: "seo_meta_description",  value: resolvedMeta,                          type: "multi_line_text_field" },
        ],
      },
    };

    const shopifyResponse = await shopifyAdminFetch<{ product: { id: number } }>(
      "/products.json",
      "POST",
      shopifyPayload
    );

    log.push(`[${ts()}] Shopify draft created: product ID ${shopifyResponse.product.id}`);

    // STEP 7: Trigger Klaviyo deal email (will send when admin approves)
    if (resolvedEmailSubjects.length > 0) {
      await triggerDailyDealEmail({
        productName: resolvedTitle,
        tagline: resolvedTagline,
        dealPrice,
        originalPrice: msrp,
        discountPct: savingsPct,
        imageUrl: images[0] ?? moodImageUrl ?? "",
        productUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://xdipx.com"}`,
        emailSubjectLine: resolvedEmailSubjects[0],
      });
      log.push(`[${ts()}] Klaviyo event triggered`);
    }

    log.push(`[${ts()}] Done. Admin must approve deal before it goes live.`);

    return NextResponse.json({
      success: true,
      sku: nalpacProduct.SKU,
      title: resolvedTitle,
      dealPrice,
      discountPct: savingsPct,
      shopifyProductId: shopifyResponse.product.id,
      log,
    });

  } catch (err) {
    log.push(`[${ts()}] FATAL ERROR: ${String(err)}`);
    console.error("/api/deal-scheduler error:", err);
    return NextResponse.json({ error: String(err), log }, { status: 500 });
  }
}
