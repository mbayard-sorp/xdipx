"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { SEED_ACCESSORIES } from "@/scripts/seed-data";
import { ShopifyProduct } from "@/types";
import { formatMoney } from "@/lib/shopify";

export default function CheckoutExtrasPage() {
  const { addToCart, loading, checkoutUrl } = useCart();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // In production: fetch from the current deal's accessory metafield
  const accessories: ShopifyProduct[] = SEED_ACCESSORIES;

  async function handleAdd(product: ShopifyProduct) {
    const variant = product.variants.nodes[0];
    if (!variant) return;
    await addToCart(variant.id, 1);
    setAddedIds((prev) => { const next = new Set(prev); next.add(product.id); return next; });
  }

  return (
    <div className="min-h-screen bg-brand-cream py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-10 text-sm">
          <Step label="Your Deal" done />
          <div className="flex-1 h-0.5 bg-brand-gradient" />
          <Step label="Extras" active />
          <div className="flex-1 h-0.5 bg-brand-charcoal/20" />
          <Step label="Checkout" />
        </div>

        <div className="text-center mb-8">
          <h1 className="font-headline font-black text-2xl text-brand-charcoal mb-2">
            You&apos;ve got great taste.
          </h1>
          <p className="text-brand-charcoal/60">
            Want to make it even better?
          </p>
        </div>

        {/* Accessory cards */}
        <div className="space-y-4 mb-8">
          {accessories.map((product) => {
            const variant = product.variants.nodes[0];
            const isAdded = addedIds.has(product.id);

            return (
              <div key={product.id} className="bg-white rounded-2xl p-4 card-shadow flex gap-4 items-center">
                {product.featuredImage && (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-brand-mist">
                    <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText ?? product.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-headline font-semibold text-brand-charcoal text-sm leading-tight mb-0.5">
                    {product.title}
                  </h3>
                  {product.xdipx?.tagline && (
                    <p className="text-brand-charcoal/50 text-xs leading-relaxed line-clamp-2">
                      {product.xdipx.tagline}
                    </p>
                  )}
                  <p className="font-bold text-brand-coral text-sm mt-1">
                    {formatMoney(variant?.price.amount ?? "0")}
                  </p>
                </div>

                <button
                  onClick={() => handleAdd(product)}
                  disabled={loading || isAdded}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isAdded
                      ? "bg-green-100 text-green-700"
                      : "btn-gradient text-white"
                  } disabled:opacity-60`}
                >
                  {isAdded ? "Added ✓" : "Add to Bag +"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Checkout button */}
        <div className="space-y-3 sticky bottom-0 bg-brand-cream/95 backdrop-blur-sm py-4 -mx-4 px-4 border-t border-brand-purple/10">
          {checkoutUrl ? (
            <a
              href={checkoutUrl}
              className="btn-gradient w-full py-5 rounded-2xl font-headline font-bold text-white text-lg text-center block shadow-lg"
            >
              To Checkout ♥
            </a>
          ) : (
            <button
              disabled
              className="w-full py-5 rounded-2xl bg-gray-200 text-gray-400 font-bold cursor-not-allowed"
            >
              Loading cart...
            </button>
          )}

          {checkoutUrl && (
            <a
              href={checkoutUrl}
              className="block text-center text-sm text-brand-charcoal/40 hover:text-brand-charcoal/60 transition-colors"
            >
              Nah, I&apos;m good → Go to Checkout
            </a>
          )}

          <p className="text-center text-xs text-brand-charcoal/30">
            🔒 Discreet billing & plain packaging guaranteed
          </p>
        </div>
      </div>
    </div>
  );
}

function Step({
  label,
  done = false,
  active = false,
}: {
  label: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
          done
            ? "bg-brand-gradient text-white"
            : active
            ? "border-2 border-brand-coral text-brand-coral"
            : "border-2 border-brand-charcoal/20 text-brand-charcoal/30"
        }`}
      >
        {done ? "✓" : ""}
      </div>
      <span
        className={`text-xs font-medium whitespace-nowrap ${
          active ? "text-brand-charcoal" : done ? "text-brand-charcoal/60" : "text-brand-charcoal/30"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
