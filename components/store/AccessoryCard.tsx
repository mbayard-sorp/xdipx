"use client";

import Image from "next/image";
import { useState } from "react";
import { ShopifyProduct } from "@/types";
import { formatMoney } from "@/lib/shopify";
import { useCart } from "@/hooks/useCart";

interface AccessoryCardProps {
  product: ShopifyProduct;
}

export function AccessoryCard({ product }: AccessoryCardProps) {
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
    <div className="bg-white rounded-2xl overflow-hidden card-shadow card-shadow-hover flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-brand-mist">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-brand-charcoal/20 text-4xl">
            ♥
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-headline font-semibold text-brand-charcoal text-sm leading-tight line-clamp-2 mb-1">
          {product.title}
        </h3>

        {product.xdipx?.tagline && (
          <p className="text-brand-charcoal/50 text-xs leading-relaxed mb-2 line-clamp-2 flex-1">
            {product.xdipx.tagline}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="font-bold text-brand-coral text-base">
            {formatMoney(variant?.price.amount ?? "0")}
          </span>

          <button
            onClick={handleAdd}
            disabled={loading || !variant?.availableForSale}
            className={`text-sm font-bold px-3 py-2 rounded-xl transition-all ${
              added
                ? "bg-green-100 text-green-700"
                : "btn-gradient text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {added ? "Added ✓" : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
