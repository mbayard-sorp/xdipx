"use client";

import Image from "next/image";
import Link from "next/link";
import { ShopifyProduct } from "@/types";
import { formatMoney } from "@/lib/shopify";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

interface ProductCardProps {
  product: ShopifyProduct;
  ctaLabel?: string;
}

export function ProductCard({ product, ctaLabel = "Grab It" }: ProductCardProps) {
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
      <Link href={`/products/${product.handle}`} className="relative aspect-[4/3] bg-brand-mist block">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-brand-charcoal/20 text-5xl">
            ♥
          </div>
        )}

        {/* Compare-at price badge */}
        {variant?.compareAtPrice && (
          <div className="absolute top-3 right-3 bg-brand-purple text-white text-xs font-bold px-2 py-1 rounded-full">
            {Math.round(
              ((parseFloat(variant.compareAtPrice.amount) - parseFloat(variant.price.amount)) /
                parseFloat(variant.compareAtPrice.amount)) *
                100
            )}% OFF
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/products/${product.handle}`}>
          <h3 className="font-headline font-semibold text-brand-charcoal text-sm leading-tight line-clamp-2 hover:text-brand-coral transition-colors mb-1">
            {product.title}
          </h3>
        </Link>

        {product.xdipx?.tagline && (
          <p className="text-brand-charcoal/50 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">
            {product.xdipx.tagline}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <span className="font-bold text-brand-coral text-base">
              {formatMoney(variant?.price.amount ?? "0")}
            </span>
            {variant?.compareAtPrice && (
              <span className="text-brand-charcoal/30 text-xs line-through ml-1.5">
                {formatMoney(variant.compareAtPrice.amount)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={loading || !variant?.availableForSale}
            className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${
              added
                ? "bg-green-100 text-green-700"
                : "btn-gradient text-white"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {added ? "Added ✓" : ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
