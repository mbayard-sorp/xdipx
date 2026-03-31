import { Suspense } from "react";
import { getDailyDeal, getProductsByCollection, getProductsByTag } from "@/lib/shopify";
import { DailyDealHero } from "@/components/store/DailyDealHero";
import { CountdownTimer } from "@/components/store/CountdownTimer";
import { AccessoriesSection } from "@/components/store/AccessoriesSection";
import { ProductTabs } from "@/components/store/ProductTabs";
import { ForHimSection } from "@/components/store/ForHimSection";
import { ForHerSection } from "@/components/store/ForHerSection";
import { BonusDeal } from "@/components/store/BonusDeal";
import { VaultPreview } from "@/components/store/VaultPreview";
import { EmailSubscribe } from "@/components/store/EmailSubscribe";
import { TrustBar } from "@/components/store/TrustBar";
import { SEED_DAILY_DEAL, SEED_FOR_HIM, SEED_FOR_HER, SEED_BONUS, SEED_ACCESSORIES, SEED_VAULT } from "@/scripts/seed-data";

// Revalidate every 60 seconds on the edge
export const revalidate = 60;

async function fetchPageData() {
  try {
    const [deal, forHimProducts, forHerProducts, bonusProducts, accessoryProducts, vaultProducts] =
      await Promise.allSettled([
        getDailyDeal(),
        getProductsByTag("for-him", 3),
        getProductsByTag("for-her", 3),
        getProductsByCollection("bonus-deal", 1),
        getProductsByCollection("accessories", 4),
        getProductsByCollection("vault", 4),
      ]);

    return {
      deal:               deal.status === "fulfilled" ? deal.value : null,
      forHimProducts:     forHimProducts.status === "fulfilled" ? forHimProducts.value : [],
      forHerProducts:     forHerProducts.status === "fulfilled" ? forHerProducts.value : [],
      bonusProduct:       bonusProducts.status === "fulfilled" ? bonusProducts.value[0] ?? null : null,
      accessoryProducts:  accessoryProducts.status === "fulfilled" ? accessoryProducts.value : [],
      vaultProducts:      vaultProducts.status === "fulfilled" ? vaultProducts.value : [],
    };
  } catch {
    // Fall back to seed data during development when Shopify isn't connected
    return {
      deal:               SEED_DAILY_DEAL,
      forHimProducts:     SEED_FOR_HIM,
      forHerProducts:     SEED_FOR_HER,
      bonusProduct:       SEED_BONUS,
      accessoryProducts:  SEED_ACCESSORIES,
      vaultProducts:      SEED_VAULT,
    };
  }
}

export default async function HomePage() {
  const { deal, forHimProducts, forHerProducts, bonusProduct, accessoryProducts, vaultProducts } =
    await fetchPageData();

  // Fetch accessories for the daily deal if needed
  const dealAccessories = accessoryProducts;
  if (deal?.product.xdipx?.accessoryProductIds?.length) {
    // In production, fetch by IDs from deal metafields
    // For now, use the accessories collection
  }

  if (deal) {
    deal.accessories = dealAccessories.slice(0, 4);
  }

  return (
    <div className="bg-brand-cream">
      {/* ── Countdown Banner ── */}
      <div className="bg-brand-cream border-b border-brand-purple/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="h-20" />}>
            <CountdownTimer />
          </Suspense>
        </div>
      </div>

      {/* ── Daily Deal Hero (PDP) ── */}
      {deal ? (
        <>
          <DailyDealHero deal={deal} />

          {/* Trust bar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <TrustBar />
          </div>

          {/* Accessories (pre-interstitial upsell) */}
          {dealAccessories.length > 0 && (
            <AccessoriesSection products={dealAccessories} />
          )}

          {/* Product tabs: Full Story, Specs, Reviews, Both Ways */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ProductTabs deal={deal} />
          </div>
        </>
      ) : (
        <NoDealFallback />
      )}

      {/* ── For Him ── */}
      {forHimProducts.length > 0 && <ForHimSection products={forHimProducts} />}

      {/* ── For Her ── */}
      {forHerProducts.length > 0 && <ForHerSection products={forHerProducts} />}

      {/* ── Bonus Deal ── */}
      {bonusProduct && <BonusDeal product={bonusProduct} />}

      {/* ── Vault Preview ── */}
      {vaultProducts.length > 0 && <VaultPreview products={vaultProducts} />}

      {/* ── Email Subscribe ── */}
      <EmailSubscribe />
    </div>
  );
}

function NoDealFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="text-6xl mb-6">♥</div>
      <h1 className="font-headline font-black text-3xl text-brand-charcoal mb-3">
        Something amazing is on its way.
      </h1>
      <p className="text-brand-charcoal/60 text-lg">
        Today&apos;s deal is loading. Check back shortly.
      </p>
    </div>
  );
}
