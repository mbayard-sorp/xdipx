"use client";

import Image from "next/image";
import { ShopifyProduct } from "@/types";
import { formatMoney } from "@/lib/shopify";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

interface BonusDealProps {
  product: ShopifyProduct;
}

export function BonusDeal({ product }: BonusDealProps) {
  const { addToCart, loading } = useCart();
  const [added, setAdded] = useState(false);
  const variant = product.variants.nodes[0];
  const image = product.featuredImage;

  async function handleAdd() {
    if (!variant || added) return;
    await addToCart(variant.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  }

  return (
    <section className="bg-brand-charcoal py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-brand-orange/70 font-medium text-sm uppercase tracking-widest mb-6 text-center">
          Today&apos;s Bonus Pick
        </p>
        <h2 className="font-headline font-black text-2xl text-white text-center mb-8">
          Because one deal is never enough.
        </h2>

        <div className="bg-white/5 rounded-3xl overflow-hidden max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative w-full sm:w-56 aspect-square sm:aspect-auto flex-shrink-0 bg-brand-mist/10">
              {image ? (
                <Image
                  src={image.url}
                  alt={image.altText ?? product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 224px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/20 text-6xl">
                  ♥
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
              <h3 className="font-headline font-bold text-xl text-white mb-2">
                {product.title}
              </h3>
              {product.xdipx?.tagline && (
                <p className="text-white/60 text-sm mb-4 leading-relaxed">
                  {product.xdipx.tagline}
                </p>
              )}

              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-price font-black text-2xl text-brand-orange">
                  {formatMoney(variant?.price.amount ?? "0")}
                </span>
                {variant?.compareAtPrice && (
                  <span className="text-white/30 text-base line-through">
                    {formatMoney(variant.compareAtPrice.amount)}
                  </span>
                )}
              </div>

              <button
                onClick={handleAdd}
                disabled={loading || !variant?.availableForSale}
                className={`mt-5 px-8 py-3 rounded-2xl font-headline font-bold text-sm w-fit transition-all ${
                  added
                    ? "bg-green-500 text-white"
                    : "btn-gradient text-white"
                } disabled:opacity-40`}
              >
                {added ? "Added ✓" : "Add to Bag ♥"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
