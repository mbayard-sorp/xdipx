"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DailyDeal } from "@/types";
import { formatMoney, getProductImages } from "@/lib/shopify";
import { useCart } from "@/hooks/useCart";
import { ProductImageGallery } from "./ProductImageGallery";
import { StockIndicator } from "./StockIndicator";
import { TrustBar } from "./TrustBar";

interface DailyDealHeroProps {
  deal: DailyDeal;
}

const AUDIENCE_TAGS: Record<string, string> = {
  "for-him":     "♂ For Him",
  "for-her":     "♀ For Her",
  "for-couples": "👫 For Couples",
  "for-both":    "♂♀ For Everyone",
};

export function DailyDealHero({ deal }: DailyDealHeroProps) {
  const { addToCart, loading } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);

  const images = getProductImages(deal.product);
  const variant = deal.product.variants.nodes[0];
  const audienceTags = deal.product.tags.filter((t) => AUDIENCE_TAGS[t]);

  async function handleDipIn() {
    if (!variant) return;
    await addToCart(variant.id, qty);
    router.push("/checkout-extras");
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* ── Left: Image gallery ── */}
        <ProductImageGallery
          images={images}
          alt={deal.product.featuredImage?.altText ?? deal.product.title}
          discountBadge={
            deal.discountPct > 0 ? (
              <div className="absolute top-4 left-4 bg-brand-purple text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                {deal.discountPct}% OFF
              </div>
            ) : undefined
          }
        />

        {/* ── Right: Product info ── */}
        <div className="space-y-5">
          {/* Audience tags */}
          {audienceTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {audienceTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-brand-purple bg-brand-mist px-3 py-1 rounded-full"
                >
                  {AUDIENCE_TAGS[tag]}
                </span>
              ))}
            </div>
          )}

          {/* Product name */}
          <div>
            <h1 className="font-headline font-bold text-2xl md:text-3xl text-brand-charcoal leading-tight">
              {deal.product.title}
            </h1>
            {deal.tagline && (
              <p className="text-brand-charcoal/60 text-base mt-2 italic leading-relaxed">
                {deal.tagline}
              </p>
            )}
          </div>

          {/* Star rating (placeholder) */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-brand-orange text-base">★</span>
              ))}
            </div>
            <span className="text-sm text-brand-charcoal/40">(reviews below)</span>
          </div>

          {/* Pricing */}
          <div className="flex items-end gap-3 flex-wrap">
            <span className="countdown-block text-4xl md:text-5xl">
              {formatMoney(deal.dealPrice)}
            </span>
            {deal.originalPrice > 0 && deal.originalPrice !== deal.dealPrice && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-brand-charcoal/40 text-lg line-through">
                  {formatMoney(deal.originalPrice)}
                </span>
                <span className="text-xs font-bold text-white bg-brand-purple px-2 py-1 rounded-full">
                  SAVE {formatMoney(deal.savingsAmount)}
                </span>
              </div>
            )}
          </div>

          {/* Feature bullets */}
          {deal.featureBullets.length > 0 && (
            <ul className="space-y-2">
              {deal.featureBullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-brand-charcoal/80">
                  <span className="text-brand-purple flex-shrink-0 mt-0.5 text-xs">♥</span>
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {/* Stock indicator */}
          <StockIndicator qty={deal.stockCount} />

          {/* Quantity selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-brand-charcoal/60">Qty:</span>
            <div className="flex items-center border border-brand-purple/20 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-brand-charcoal hover:bg-brand-mist transition-colors font-bold"
              >
                −
              </button>
              <span className="w-10 text-center font-bold text-brand-charcoal">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(3, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-brand-charcoal hover:bg-brand-mist transition-colors font-bold"
              >
                +
              </button>
            </div>
            <span className="text-xs text-brand-charcoal/40">(max 3)</span>
          </div>

          {/* CTA */}
          <button
            onClick={handleDipIn}
            disabled={loading || !variant?.availableForSale}
            className="btn-gradient w-full py-5 rounded-2xl font-headline font-bold text-white text-xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </span>
            ) : !variant?.availableForSale ? (
              "Sold Out"
            ) : (
              "Dip In ♥"
            )}
          </button>

          {/* Trust bar */}
          <TrustBar compact />
        </div>
      </div>
    </section>
  );
}
